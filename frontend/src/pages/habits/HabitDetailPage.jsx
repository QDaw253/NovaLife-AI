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
  const [messageType, setMessageType] = useState('')
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
      setMessageType('')

      await completeHabitToday(id, {
        value: logData.value,
        note: logData.note,
      })

      const updatedHabit = await fetchHabit()
      const progress = updatedHabit.progress

      if (progress?.completed) {
        setMessage(
          `Đã hoàn thành mục tiêu! Tiến độ hiện tại: ${progress.current}/${progress.target} ${updatedHabit.unit}.`
        )

        setMessageType('success')
      } else {
        setMessage(
          `Đã ghi nhận tiến độ: ${progress.current}/${progress.target} ${updatedHabit.unit} (${progress.percentage}%).`
        )

        setMessageType('progress')
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

      setMessageType('error')
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

  const getCategoryLabel = (category) => {
    switch (category) {
      case 'health':
        return 'Sức khỏe'

      case 'fitness':
        return 'Thể hình'

      case 'study':
        return 'Học tập'

      case 'personal':
        return 'Cá nhân'

      case 'other':
        return 'Khác'

      default:
        return category
    }
  }


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


  const getLogStatusLabel = (
    status,
    frequency
  ) => {
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


  const getLogStatusClass = (
    status,
    frequency
  ) => {
    if (
      frequency === 'weekly' ||
      frequency === 'monthly'
    ) {
      if (status === 'skipped') {
        return 'skipped'
      }

      return 'recorded'
    }

    switch (status) {
      case 'completed':
        return 'completed'

      case 'pending':
        return 'pending'

      case 'skipped':
        return 'skipped'

      default:
        return 'recorded'
    }
  }


  const formatNumber = (value) => {
    const number = Number(value)

    if (Number.isNaN(number)) {
      return value
    }

    return Number.isInteger(number)
      ? number
      : Number(number.toFixed(2))
  }


  const formatDate = (date) => {
    if (!date) {
      return 'Không có'
    }

    const parts = date.split('-')

    if (parts.length !== 3) {
      return date
    }

    return `${parts[2]}/${parts[1]}/${parts[0]}`
  }


  // =========================================
  // LOADING
  // =========================================

  if (!habit) {
    return (
      <div className="habit-detail-loading">
        <div className="habit-detail-spinner" />

        <h2>Đang tải thói quen...</h2>

        <p>
          NovaLife đang chuẩn bị tiến độ của bạn.
        </p>
      </div>
    )
  }


  const progress = habit.progress
  const statistics = habit.statistics

  const streakUnit = getStreakUnit(
    habit.frequency
  )

  const percentage = Math.min(
    Number(progress?.percentage || 0),
    100
  )


  return (
    <div className="habit-detail-page">

      {/* =====================================
          BACK
      ====================================== */}

      <button
        type="button"
        className="habit-detail-back"
        onClick={() => navigate('/habits')}
      >
        ← Quay lại thói quen
      </button>


      {/* =====================================
          HERO
      ====================================== */}

      <section className="habit-detail-hero">

        <div className="habit-detail-hero-main">

          <div className="habit-detail-badges">

            <span className="habit-detail-category">
              {getCategoryLabel(habit.category)}
            </span>

            <span className="habit-detail-frequency">
              <span />
              {getFrequencyLabel(habit.frequency)}
            </span>

          </div>


          <h1>{habit.title}</h1>


          <p className="habit-detail-description">
            {habit.description ||
              'Chưa có mô tả cho thói quen này.'}
          </p>


          <div className="habit-detail-meta">

            <div className="habit-detail-meta-item">

              <span className="habit-detail-meta-label">
                Mục tiêu
              </span>

              <strong>
                {formatNumber(habit.target_value)}{' '}
                {habit.unit}
              </strong>

            </div>


            <div className="habit-detail-meta-item">

              <span className="habit-detail-meta-label">
                Bắt đầu
              </span>

              <strong>
                {formatDate(habit.start_date)}
              </strong>

            </div>


            <div className="habit-detail-meta-item">

              <span className="habit-detail-meta-label">
                Kết thúc
              </span>

              <strong>
                {formatDate(habit.end_date)}
              </strong>

            </div>


            <div className="habit-detail-meta-item">

              <span className="habit-detail-meta-label">
                Nhắc lúc
              </span>

              <strong>
                {habit.reminder_time ||
                  'Chưa thiết lập'}
              </strong>

            </div>

          </div>

        </div>


        <div className="habit-detail-actions">

          <Link
            to={`/habits/${id}/edit`}
            className="habit-detail-edit"
          >
            Chỉnh sửa
          </Link>

          <button
            type="button"
            className="habit-detail-delete"
            onClick={handleDelete}
          >
            Xóa
          </button>

        </div>

      </section>


      {/* =====================================
          CURRENT PROGRESS
      ====================================== */}

      <section className="habit-progress-card">

        <div className="habit-progress-heading">

          <div>

            <p className="habit-detail-section-eyebrow">
              TIẾN ĐỘ HIỆN TẠI
            </p>

            <h2>
              {getPeriodLabel(habit.frequency)}
            </h2>

          </div>


          {progress && (
            <span
              className={
                progress.completed
                  ? 'habit-progress-status completed'
                  : 'habit-progress-status pending'
              }
            >
              {progress.completed
                ? '✓ Đã hoàn thành'
                : 'Đang thực hiện'}
            </span>
          )}

        </div>


        {progress ? (
          <>
            <div className="habit-progress-values">

              <div>

                <strong>
                  {formatNumber(progress.current)}
                </strong>

                <span>
                  {' / '}
                  {formatNumber(progress.target)}{' '}
                  {habit.unit}
                </span>

              </div>

              <strong className="habit-progress-percentage">
                {formatNumber(progress.percentage)}%
              </strong>

            </div>


            <div className="habit-progress-track">

              <div
                className="habit-progress-fill"
                style={{
                  width: `${percentage}%`,
                }}
              />

            </div>


            <div className="habit-progress-footer">

              <p>
                {progress.completed
                  ? 'Bạn đã hoàn thành mục tiêu của kỳ này.'
                  : 'Tiếp tục duy trì để hoàn thành mục tiêu của kỳ này.'}
              </p>

              <span>
                {formatDate(progress.start_date)}
                {' → '}
                {formatDate(progress.end_date)}
              </span>

            </div>
          </>
        ) : (
          <div className="habit-detail-empty-inline">
            Chưa có dữ liệu tiến độ.
          </div>
        )}

      </section>


      {/* =====================================
          STATISTICS
      ====================================== */}

      <section className="habit-statistics-section">

        <div className="habit-detail-section-header">

          <div>
            <p className="habit-detail-section-eyebrow">
              THỐNG KÊ
            </p>

            <h2>
              Hành trình của bạn
            </h2>
          </div>

          <p>
            Theo dõi sự nhất quán qua từng kỳ.
          </p>

        </div>


        {statistics ? (
          <div className="habit-statistics-grid">

            <div className="habit-stat-card">

              <div className="habit-stat-icon">
                ↗
              </div>

              <span>Chuỗi hiện tại</span>

              <strong>
                {statistics.current_streak}
                <small> {streakUnit}</small>
              </strong>

              <p>
                Số {streakUnit} liên tiếp
                đạt mục tiêu.
              </p>

            </div>


            <div className="habit-stat-card">

              <div className="habit-stat-icon">
                ★
              </div>

              <span>Chuỗi dài nhất</span>

              <strong>
                {statistics.longest_streak}
                <small> {streakUnit}</small>
              </strong>

              <p>
                Thành tích duy trì tốt nhất.
              </p>

            </div>


            <div className="habit-stat-card">

              <div className="habit-stat-icon">
                ✓
              </div>

              <span>Kỳ hoàn thành</span>

              <strong>
                {statistics.total_completions}
                <small> kỳ</small>
              </strong>

              <p>
                Tổng số kỳ đã đạt mục tiêu.
              </p>

            </div>


            <div className="habit-stat-card">

              <div className="habit-stat-icon">
                %
              </div>

              <span>Tỷ lệ duy trì</span>

              <strong>
                {formatNumber(
                  statistics.completion_rate
                )}
                <small>%</small>
              </strong>

              <p>
                Tỷ lệ hoàn thành theo lịch sử.
              </p>

            </div>

          </div>
        ) : (
          <div className="habit-detail-empty-inline">
            Chưa có dữ liệu thống kê.
          </div>
        )}

      </section>


      {/* =====================================
          ACTIVITY GRID
      ====================================== */}

      <div className="habit-activity-grid">

        {/* =================================
            UPDATE PROGRESS
        ================================== */}

        <section className="habit-log-card">

          <div className="habit-log-card-header">

            <p className="habit-detail-section-eyebrow">
              GHI NHẬN
            </p>

            <h2>Cập nhật tiến độ</h2>

            <p>
              Ghi lại những gì bạn đã thực hiện
              trong hôm nay.
            </p>

          </div>


          <form
            className="habit-log-form"
            onSubmit={handleCompleteToday}
          >

            <div className="habit-log-field">

              <label htmlFor="habit-log-value">
                Giá trị hôm nay
              </label>

              <div className="habit-log-value-input">

                <input
                  id="habit-log-value"
                  type="number"
                  step="0.01"
                  min="0"
                  name="value"
                  value={logData.value}
                  onChange={handleLogChange}
                  placeholder="0"
                  required
                />

                <span>{habit.unit}</span>

              </div>

            </div>


            <div className="habit-log-field">

              <label htmlFor="habit-log-note">
                Ghi chú
              </label>

              <textarea
                id="habit-log-note"
                name="note"
                value={logData.note}
                onChange={handleLogChange}
                placeholder="Bạn cảm thấy thế nào sau khi thực hiện?"
                rows="5"
              />

            </div>


            <button
              type="submit"
              className="habit-log-submit"
              disabled={submitting}
            >
              {submitting
                ? 'Đang cập nhật...'
                : '✓ Cập nhật tiến độ'}
            </button>

          </form>


          {message && (
            <div
              className={`habit-log-message ${messageType}`}
            >
              {message}
            </div>
          )}

        </section>


        {/* =================================
            RECENT LOGS
        ================================== */}

        <section className="habit-history-card">

          <div className="habit-history-header">

            <div>
              <p className="habit-detail-section-eyebrow">
                LỊCH SỬ
              </p>

              <h2>Gần đây</h2>
            </div>

            <span>
              {habit.recent_logs?.length || 0}{' '}
              bản ghi
            </span>

          </div>


          {habit.recent_logs?.length > 0 ? (
            <div className="habit-history-list">

              {habit.recent_logs.map((log) => (

                <div
                  key={log.id}
                  className="habit-history-item"
                >

                  <div className="habit-history-date">

                    <strong>
                      {formatDate(log.date)}
                    </strong>

                    <span>
                      {log.note ||
                        'Không có ghi chú'}
                    </span>

                  </div>


                  <div className="habit-history-value">

                    <strong>
                      {formatNumber(log.value)}
                    </strong>

                    <span>
                      {habit.unit}
                    </span>

                  </div>


                  <span
                    className={`habit-history-status ${getLogStatusClass(
                      log.status,
                      habit.frequency
                    )}`}
                  >
                    {getLogStatusLabel(
                      log.status,
                      habit.frequency
                    )}
                  </span>

                </div>

              ))}

            </div>
          ) : (
            <div className="habit-history-empty">

              <div>✓</div>

              <h3>
                Chưa có lịch sử
              </h3>

              <p>
                Bản ghi tiến độ đầu tiên của bạn
                sẽ xuất hiện tại đây.
              </p>

            </div>
          )}

        </section>

      </div>

    </div>
  )
}


export default HabitDetailPage