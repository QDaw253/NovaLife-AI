import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getHabits } from '../../api/habits'

function HabitsPage() {
  const [habits, setHabits] = useState([])

  useEffect(() => {
    const fetchHabits = async () => {
      const result = await getHabits()
      setHabits(result.data)
    }
    fetchHabits()
  }, [])

  const getCategoryLabel = (category) => {
    switch (category) {
      case 'health': return 'Sức khỏe'
      case 'fitness': return 'Thể hình'
      case 'study': return 'Học tập'
      case 'personal': return 'Cá nhân'
      default: return 'Khác'
    }
  }

  const getFrequencyLabel = (frequency) => {
    switch (frequency) {
      case 'daily': return 'Hằng ngày'
      case 'weekly': return 'Hằng tuần'
      case 'monthly': return 'Hằng tháng'
      default: return frequency
    }
  }

  const getFrequencyDescription = (frequency) => {
    switch (frequency) {
      case 'daily': return 'Mỗi ngày'
      case 'weekly': return 'Mỗi tuần'
      case 'monthly': return 'Mỗi tháng'
      default: return ''
    }
  }

  return (
    <div className="habits-page">
      <div className="habits-header">
        <div>
          <p className="habits-eyebrow">PHÁT TRIỂN CÁ NHÂN</p>
          <h1>Thói quen của bạn</h1>
          <p className="habits-subtitle">Những thay đổi nhỏ mỗi ngày sẽ tạo nên phiên bản tốt hơn của bạn.</p>
        </div>

        <Link to="/habits/new" className="habits-create-button">
          <span>＋</span> Tạo thói quen
        </Link>
      </div>

      <div className="habits-summary">
        <div className="habits-summary-icon">✓</div>
        <div>
          <strong>{habits.length}</strong>
          <span>thói quen đang được theo dõi</span>
        </div>
      </div>

      {habits.length > 0 ? (
        <div className="habits-grid">
          {habits.map((habit) => (
            <div key={habit.id} className="habit-card">
              <div className="habit-card-top">
                <span className="habit-category">{getCategoryLabel(habit.category)}</span>
                <div className="habit-frequency">
                  <span className="habit-frequency-dot" />
                  {getFrequencyLabel(habit.frequency)}
                </div>
              </div>

              <h2 className="habit-card-title">{habit.title}</h2>

              <div className="habit-target">
                <span className="habit-target-label">Mục tiêu</span>
                <div className="habit-target-value">
                  <strong>{habit.target_value}</strong>
                  <span>{habit.unit}</span>
                </div>
                <p>{getFrequencyDescription(habit.frequency)}</p>
              </div>

              <div className="habit-card-reminder">
                <div className="habit-card-reminder-icon">◷</div>
                <div className="habit-card-reminder-info">
                  <span className="habit-card-reminder-label">Nhắc nhở</span>
                  <strong className="habit-card-reminder-time">
                    {habit.reminder_time ? habit.reminder_time.slice(0, 5) : 'Chưa thiết lập'}
                  </strong>
                </div>
              </div>

              <div className="habit-card-footer">
                <Link to={`/habits/${habit.id}`} className="habit-detail-link">
                  Xem chi tiết
                </Link>
                <Link to={`/habits/${habit.id}`} className="habit-detail-arrow" aria-label={`Xem ${habit.title}`}>
                  →
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="habits-empty">
          <div className="habits-empty-icon">✓</div>
          <h2>Chưa có thói quen nào</h2>
          <p>Bắt đầu với một thay đổi nhỏ mà bạn muốn duy trì mỗi ngày.</p>
          <Link to="/habits/new" className="habits-empty-button">
            ＋ Tạo thói quen đầu tiên
          </Link>
        </div>
      )}
    </div>
  )
}

export default HabitsPage