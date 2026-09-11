import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getGoals } from '../../api/goals'

function GoalsPage() {
  const navigate = useNavigate()
  const [goals, setGoals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        setLoading(true)
        setError('')
        const result = await getGoals()
        setGoals(result.data)
      } catch (error) {
        console.error('Goals error:', error)
        setError('Không thể tải danh sách mục tiêu.')
      } finally {
        setLoading(false)
      }
    }
    fetchGoals()
  }, [])

  const getCategoryLabel = (category) => {
    switch (category) {
      case 'study': return 'Học tập'
      case 'career': return 'Sự nghiệp'
      case 'health': return 'Sức khỏe'
      case 'personal': return 'Cá nhân'
      default: return category
    }
  }

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'low': return 'Thấp'
      case 'medium': return 'Trung bình'
      case 'high': return 'Cao'
      default: return priority
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending': return 'Chưa bắt đầu'
      case 'in_progress': return 'Đang thực hiện'
      case 'completed': return 'Hoàn thành'
      case 'cancelled': return 'Đã hủy'
      default: return status
    }
  }

  if (loading) {
    return (
      <div className="goals-state">
        <div className="goals-state-spinner" />
        <p>Đang tải mục tiêu...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="goals-state goals-state--error">
        <h2>Không thể tải mục tiêu</h2>
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="goals-page">
      <header className="goals-header">
        <div>
          <p className="goals-eyebrow">Phát triển cá nhân</p>
          <h1>Mục tiêu của bạn</h1>
          <p className="goals-header-description">
            Theo dõi tiến độ và từng bước hoàn thành những điều bạn đang hướng tới.
          </p>
        </div>
        <button className="goals-create-button" type="button" onClick={() => navigate('/goals/new')}>
          <span>＋</span> Tạo mục tiêu
        </button>
      </header>

      {goals.length === 0 ? (
        <section className="goals-empty">
          <div className="goals-empty-icon">◎</div>
          <h2>Bắt đầu với mục tiêu đầu tiên</h2>
          <p>Tạo một mục tiêu để NovaLife giúp bạn xây dựng lộ trình và theo dõi tiến độ.</p>
          <button type="button" className="goals-create-button" onClick={() => navigate('/goals/new')}>
            <span>＋</span> Tạo mục tiêu
          </button>
        </section>
      ) : (
        <section className="goals-grid">
          {goals.map((goal) => {
            const progress = Math.min(Math.max(goal.progress || 0, 0), 100)

            return (
              <article className="goal-card" key={goal.id}>
                <div className="goal-card-top">
                  <span className="goal-category">{getCategoryLabel(goal.category)}</span>
                  <span className={`goal-status goal-status--${goal.status}`}>
                    <span className="goal-status-dot" />
                    {getStatusLabel(goal.status)}
                  </span>
                </div>

                <div className="goal-card-content">
                  <Link className="goal-card-title" to={`/goals/${goal.id}`}>
                    {goal.title}
                  </Link>

                  <div className="goal-card-priority">
                    <span>Ưu tiên</span>
                    <strong className={`goal-priority goal-priority--${goal.priority}`}>
                      {getPriorityLabel(goal.priority)}
                    </strong>
                  </div>
                </div>

                <div className="goal-card-progress">
                  <div className="goal-progress-header">
                    <span>Tiến độ</span>
                    <strong>{progress}%</strong>
                  </div>
                  <div className="goal-progress-track">
                    <div className="goal-progress-bar" style={{ width: `${progress}%` }} />
                  </div>
                </div>

                <Link className="goal-card-link" to={`/goals/${goal.id}`}>
                  <span>Xem chi tiết</span>
                  <span>→</span>
                </Link>
              </article>
            )
          })}
        </section>
      )}
    </div>
  )
}

export default GoalsPage