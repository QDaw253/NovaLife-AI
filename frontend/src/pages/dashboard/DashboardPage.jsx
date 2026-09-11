import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '../../contexts/AuthContext'
import { getDashboard } from '../../api/dashboard'


function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')


  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true)
        setError('')

        const result = await getDashboard()

        setDashboard(result.data)
      } catch (error) {
        console.error('Dashboard error:', error)

        setError('Không thể tải dữ liệu Dashboard.')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [])


  if (loading) {
    return (
      <div className="dashboard-state">
        <div className="dashboard-state-spinner" />

        <p>Đang tải Dashboard...</p>
      </div>
    )
  }


  if (error) {
    return (
      <div className="dashboard-state dashboard-state--error">
        <h2>Không thể tải Dashboard</h2>

        <p>{error}</p>
      </div>
    )
  }


  if (!dashboard) {
    return (
      <div className="dashboard-state">
        <p>Không có dữ liệu Dashboard.</p>
      </div>
    )
  }


  return (
    <div className="dashboard-page">

      <header className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">
            Tổng quan
          </p>

          <h1>
            Xin chào, {user?.username || 'bạn'} 
          </h1>

          <p className="dashboard-header-description">
            Theo dõi mục tiêu, thói quen và phong cách
            của bạn tại một nơi.
          </p>
        </div>

        <div className="dashboard-user">
          <div className="dashboard-user-avatar">
            {user?.username
              ? user.username.charAt(0).toUpperCase()
              : 'N'}
          </div>

          <div>
            <strong>
              {user?.username || 'NovaLife User'}
            </strong>

            <span>
              {user?.email}
            </span>
          </div>
        </div>
      </header>


      <section className="dashboard-overview">

        <article className="dashboard-card">
          <div className="dashboard-card-header">
            <div className="dashboard-card-icon">
              ◎
            </div>

            <span className="dashboard-card-label">
              Mục tiêu
            </span>
          </div>

          <div className="dashboard-card-value">
            {dashboard.goals.total}
          </div>

          <p className="dashboard-card-description">
            Tổng mục tiêu của bạn
          </p>

          <div className="dashboard-card-meta">
            <span>
              {dashboard.goals.in_progress} đang thực hiện
            </span>

            <span>
              {dashboard.goals.completed} hoàn thành
            </span>
          </div>

          <div className="dashboard-progress">
            <div className="dashboard-progress-info">
              <span>Tiến độ</span>

              <strong>
                {dashboard.goals.completion_rate}%
              </strong>
            </div>

            <div className="dashboard-progress-track">
              <div
                className="dashboard-progress-bar"
                style={{
                  width: `${Math.min(
                    dashboard.goals.completion_rate,
                    100,
                  )}%`,
                }}
              />
            </div>
          </div>

          <button
            className="dashboard-card-action"
            type="button"
            onClick={() => navigate('/goals')}
          >
            Xem mục tiêu
            <span>→</span>
          </button>
        </article>


        <article className="dashboard-card">
          <div className="dashboard-card-header">
            <div className="dashboard-card-icon">
              ✓
            </div>

            <span className="dashboard-card-label">
              Thói quen
            </span>
          </div>

          <div className="dashboard-card-value">
            {dashboard.habits.active}
          </div>

          <p className="dashboard-card-description">
            Thói quen đang hoạt động
          </p>

          <div className="dashboard-card-meta">
            <span>
              {dashboard.habits.completed_today}
              {' '}hoàn thành hôm nay
            </span>
          </div>

          <div className="dashboard-progress">
            <div className="dashboard-progress-info">
              <span>Hôm nay</span>

              <strong>
                {dashboard.habits.completion_rate}%
              </strong>
            </div>

            <div className="dashboard-progress-track">
              <div
                className="dashboard-progress-bar"
                style={{
                  width: `${Math.min(
                    dashboard.habits.completion_rate,
                    100,
                  )}%`,
                }}
              />
            </div>
          </div>

          <button
            className="dashboard-card-action"
            type="button"
            onClick={() => navigate('/habits')}
          >
            Xem thói quen
            <span>→</span>
          </button>
        </article>


        <article className="dashboard-card">
          <div className="dashboard-card-header">
            <div className="dashboard-card-icon">
              ◇
            </div>

            <span className="dashboard-card-label">
              Tủ đồ
            </span>
          </div>

          <div className="dashboard-card-value">
            {dashboard.wardrobe.total}
          </div>

          <p className="dashboard-card-description">
            Trang phục trong tủ đồ
          </p>

          <div className="dashboard-card-meta">
            <span>
              {dashboard.wardrobe.favorites}
              {' '}trang phục yêu thích
            </span>
          </div>

          <div className="dashboard-card-spacer" />

          <button
            className="dashboard-card-action"
            type="button"
            onClick={() => navigate('/wardrobe')}
          >
            Xem tủ đồ
            <span>→</span>
          </button>
        </article>

      </section>


      <section className="dashboard-ai-card">

        <div className="dashboard-ai-icon">
          ✦
        </div>

        <div className="dashboard-ai-content">
          <span className="dashboard-ai-badge">
            NOVALIFE AI
          </span>

          <h2>
            Hôm nay mặc gì?
          </h2>

          <p>
            Sử dụng AI để tạo gợi ý phối đồ từ chính
            những trang phục đang có trong tủ đồ của bạn.
          </p>
        </div>

        <button
          className="dashboard-ai-button"
          type="button"
          onClick={() => navigate('/ai-outfit')}
        >
          Gợi ý phối đồ

          <span>
            ✦
          </span>
        </button>

      </section>

    </div>
  )
}


export default DashboardPage