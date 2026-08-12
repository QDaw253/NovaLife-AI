import { useEffect, useState } from 'react'
import {
  Link,
  useNavigate,
  useParams,
} from 'react-router-dom'

import {
  completeHabitToday,
  deleteHabit,
  getHabit,
} from '../../api/habits'

function HabitDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [habit, setHabit] = useState(null)

  const [logData, setLogData] = useState({
    value: '',
    note: '',
  })

  // =========================================
  // LOAD HABIT DETAIL
  // =========================================
  useEffect(() => {
    const fetchHabit = async () => {
      const result = await getHabit(id)

      setHabit(result.data)
    }

    fetchHabit()
  }, [id])

  // =========================================
  // HANDLE LOG FORM
  // =========================================
  const handleLogChange = (e) => {
    setLogData({
      ...logData,
      [e.target.name]: e.target.value,
    })
  }

  // =========================================
  // COMPLETE HABIT TODAY
  // =========================================
  const handleCompleteToday = async (e) => {
    e.preventDefault()

    await completeHabitToday(id, {
      value: logData.value,
      note: logData.note,
    })

    // Lấy lại dữ liệu mới nhất
    const result = await getHabit(id)

    setHabit(result.data)

    // Reset form
    setLogData({
      value: '',
      note: '',
    })
  }

  // =========================================
  // SOFT DELETE HABIT
  // =========================================
  const handleDelete = async () => {
    const confirmed = window.confirm(
      'Bạn có chắc muốn xóa thói quen này không?'
    )

    if (!confirmed) {
      return
    }

    await deleteHabit(id)

    navigate('/habits')
  }

  // =========================================
  // LOADING
  // =========================================
  if (!habit) {
    return <p>Đang tải thói quen...</p>
  }

  return (
    <div>
      <h1>{habit.title}</h1>

      <p>
        {habit.description || 'Không có mô tả'}
      </p>

      <p>
        Danh mục: {habit.category}
      </p>

      <p>
        Tần suất: {habit.frequency}
      </p>

      <p>
        Mục tiêu: {habit.target_value} {habit.unit}
      </p>

      <p>
        Ngày bắt đầu: {habit.start_date}
      </p>

      <p>
        Ngày kết thúc:{' '}
        {habit.end_date || 'Không có'}
      </p>

      <p>
        Giờ nhắc:{' '}
        {habit.reminder_time || 'Không có'}
      </p>

      <br />

      <Link to={`/habits/${id}/edit`}>
        <button>
          Chỉnh sửa thói quen
        </button>
      </Link>

      {' '}

      <button onClick={handleDelete}>
        Xóa thói quen
      </button>

      <hr />

      {/* =====================================
          COMPLETE TODAY
      ====================================== */}

      <h2>Hoàn thành hôm nay</h2>

      <form onSubmit={handleCompleteToday}>
        <div>
          <label>Giá trị hôm nay</label>

          <br />

          <input
            type="number"
            step="0.01"
            name="value"
            value={logData.value}
            onChange={handleLogChange}
            required
          />

          {' '}

          <span>{habit.unit}</span>
        </div>

        <br />

        <div>
          <label>Ghi chú</label>

          <br />

          <textarea
            name="note"
            value={logData.note}
            onChange={handleLogChange}
          />
        </div>

        <br />

        <button type="submit">
          Hoàn thành hôm nay
        </button>
      </form>

      <hr />

      {/* =====================================
          RECENT LOGS
      ====================================== */}

      <h2>Lịch sử gần đây</h2>

      {habit.recent_logs?.length > 0 ? (
        habit.recent_logs.map((log) => (
          <div key={log.id}>
            <p>
              Ngày: {log.date}
            </p>

            <p>
              Giá trị: {log.value} {habit.unit}
            </p>

            <p>
              Trạng thái: {log.status}
            </p>

            <p>
              Ghi chú:{' '}
              {log.note || 'Không có'}
            </p>

            <hr />
          </div>
        ))
      ) : (
        <p>
          Chưa có lịch sử thực hiện.
        </p>
      )}
    </div>
  )
}

export default HabitDetailPage