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

  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)


  // =========================================
  // LOAD HABIT DETAIL
  // =========================================
  const fetchHabit = async () => {
    const result = await getHabit(id)
    setHabit(result.data)

    return result.data
  }


  useEffect(() => {
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
  // UPDATE TODAY PROGRESS
  // =========================================
  const handleCompleteToday = async (e) => {
    e.preventDefault()

    try {
      setSubmitting(true)
      setMessage('')

      await completeHabitToday(id, {
        value: logData.value,
        note: logData.note,
      })

      const updatedHabit = await fetchHabit()

      const progress = updatedHabit.progress

      if (progress?.completed) {
        setMessage(
          `🎉 Đã hoàn thành mục tiêu! Tiến độ hiện tại: ${progress.current}/${progress.target} ${updatedHabit.unit}.`
        )
      } else {
        setMessage(
          `✅ Đã ghi nhận tiến độ: ${progress.current}/${progress.target} ${updatedHabit.unit} (${progress.percentage}%).`
        )
      }

      setLogData({
        value: '',
        note: '',
      })
    } catch (error) {
      console.error(error)

      setMessage(
        'Không thể cập nhật tiến độ thói quen.'
      )
    } finally {
      setSubmitting(false)
    }
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
  // HELPERS
  // =========================================
  const getFrequencyLabel = (frequency) => {
    switch (frequency) {
      case 'daily':
        return 'Hằng ngày'

      case 'weekly':
        return 'Hằng tuần'

      case 'monthly':
        return 'Hằng tháng'

      default:
        return frequency
    }
  }


  const getPeriodLabel = (frequency) => {
    switch (frequency) {
      case 'daily':
        return 'Hôm nay'

      case 'weekly':
        return 'Tuần này'

      case 'monthly':
        return 'Tháng này'

      default:
        return 'Tiến độ hiện tại'
    }
  }


  const getStreakUnit = (frequency) => {
    switch (frequency) {
      case 'daily':
        return 'ngày'

      case 'weekly':
        return 'tuần'

      case 'monthly':
        return 'tháng'

      default:
        return 'kỳ'
    }
  }


  const getLogStatusLabel = (status, frequency) => {
    if (
      frequency === 'weekly' ||
      frequency === 'monthly'
    ) {
      if (status === 'skipped') {
        return 'Bỏ qua'
      }

      return 'Đã ghi nhận'
    }

    switch (status) {
      case 'completed':
        return 'Hoàn thành'

      case 'pending':
        return 'Chưa đạt'

      case 'skipped':
        return 'Bỏ qua'

      default:
        return status
    }
  }


  // =========================================
  // LOADING
  // =========================================
  if (!habit) {
    return <p>Đang tải thói quen...</p>
  }


  const progress = habit.progress
  const statistics = habit.statistics

  const streakUnit = getStreakUnit(
    habit.frequency
  )


  return (
    <div>
      {/* =====================================
          HABIT INFORMATION
      ====================================== */}

      <h1>{habit.title}</h1>

      <p>
        {habit.description || 'Không có mô tả'}
      </p>

      <p>
        Danh mục: {habit.category}
      </p>

      <p>
        Tần suất:{' '}
        {getFrequencyLabel(habit.frequency)}
      </p>

      <p>
        Mục tiêu:{' '}
        {habit.target_value} {habit.unit}
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
        <button type="button">
          Chỉnh sửa thói quen
        </button>
      </Link>

      {' '}

      <button
        type="button"
        onClick={handleDelete}
      >
        Xóa thói quen
      </button>


      <hr />


      {/* =====================================
          CURRENT PROGRESS
      ====================================== */}

      <section>
        <h2>
          🎯 {getPeriodLabel(habit.frequency)}
        </h2>

        {progress ? (
          <>
            <p>
              Tiến độ:{' '}
              <strong>
                {progress.current}
                {' / '}
                {progress.target}
                {' '}
                {habit.unit}
              </strong>
            </p>

            <p>
              Phần trăm:{' '}
              <strong>
                {progress.percentage}%
              </strong>
            </p>

            <progress
              value={progress.percentage}
              max="100"
            />

            <p>
              {progress.completed
                ? '✅ Đã hoàn thành mục tiêu của kỳ này.'
                : '⏳ Chưa hoàn thành mục tiêu của kỳ này.'}
            </p>

            <p>
              Thời gian:{' '}
              {progress.start_date}
              {' → '}
              {progress.end_date}
            </p>
          </>
        ) : (
          <p>Chưa có dữ liệu tiến độ.</p>
        )}
      </section>


      <hr />


      {/* =====================================
          STATISTICS
      ====================================== */}

      <section>
        <h2>📊 Thống kê</h2>

        {statistics ? (
          <>
            <p>
              🔥 Chuỗi hiện tại:{' '}
              <strong>
                {statistics.current_streak}{' '}
                {streakUnit}
              </strong>
            </p>

            <p>
              🏆 Chuỗi dài nhất:{' '}
              <strong>
                {statistics.longest_streak}{' '}
                {streakUnit}
              </strong>
            </p>

            <p>
              ✅ Tổng số kỳ hoàn thành:{' '}
              <strong>
                {statistics.total_completions}
              </strong>
            </p>

            <p>
              📈 Tỷ lệ duy trì:{' '}
              <strong>
                {statistics.completion_rate}%
              </strong>
            </p>
          </>
        ) : (
          <p>Chưa có dữ liệu thống kê.</p>
        )}
      </section>


      <hr />


      {/* =====================================
          UPDATE PROGRESS
      ====================================== */}

      <section>
        <h2>Cập nhật tiến độ</h2>

        <form onSubmit={handleCompleteToday}>
          <div>
            <label>
              Giá trị hôm nay
            </label>

            <br />

            <input
              type="number"
              step="0.01"
              min="0"
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

          <button
            type="submit"
            disabled={submitting}
          >
            {submitting
              ? 'Đang cập nhật...'
              : 'Cập nhật tiến độ'}
          </button>
        </form>

        {message && (
          <p>
            <strong>{message}</strong>
          </p>
        )}
      </section>


      <hr />


      {/* =====================================
          RECENT LOGS
      ====================================== */}

      <section>
        <h2>Lịch sử gần đây</h2>

        {habit.recent_logs?.length > 0 ? (
          habit.recent_logs.map((log) => (
            <div key={log.id}>
              <p>
                Ngày: {log.date}
              </p>

              <p>
                Giá trị:{' '}
                {log.value} {habit.unit}
              </p>

              <p>
                Trạng thái:{' '}
                {getLogStatusLabel(
                  log.status,
                  habit.frequency
                )}
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
      </section>
    </div>
  )
}

export default HabitDetailPage