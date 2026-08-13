import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useEffect, useState } from 'react'
import { getDashboard } from '../../api/dashboard'

function DashboardPage() {
  const { user, logout } = useAuth()
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

        console.log('Dashboard data:', result.data)
      } catch (error) {
        console.error('Dashboard error:', error)

        setError('Không thể tải dữ liệu Dashboard.')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  if (loading) {
    return <p>Đang tải Dashboard...</p>
  }

  if (error) {
    return <p>{error}</p>
  }

  if (!dashboard) {
    return <p>Không có dữ liệu Dashboard.</p>
  }

  return (
    <div>
      <h1>NovaLife Dashboard</h1>

      <p>Xin chào, {user?.username}</p>
      <p>Email: {user?.email}</p>

      <hr />

      {/* GOALS */}

      <section>
        <h2>🎯 Mục tiêu</h2>

        <p>
          Tổng mục tiêu: {dashboard.goals.total}
        </p>

        <p>
          Đang thực hiện: {dashboard.goals.in_progress}
        </p>

        <p>
          Đã hoàn thành: {dashboard.goals.completed}
        </p>

        <p>
          Tỷ lệ hoàn thành:{' '}
          {dashboard.goals.completion_rate}%
        </p>

        <button
          type="button"
          onClick={() => navigate('/goals')}
        >
          Xem mục tiêu
        </button>
      </section>

      <hr />

      {/* HABITS */}

      <section>
        <h2>🔁 Thói quen</h2>

        <p>
          Thói quen đang hoạt động:{' '}
          {dashboard.habits.active}
        </p>

        <p>
          Hoàn thành hôm nay:{' '}
          {dashboard.habits.completed_today}
        </p>

        <p>
          Tỷ lệ hoàn thành hôm nay:{' '}
          {dashboard.habits.completion_rate}%
        </p>

        <button
          type="button"
          onClick={() => navigate('/habits')}
        >
          Xem thói quen
        </button>
      </section>

      <hr />

      {/* WARDROBE */}

      <section>
        <h2>👕 Tủ đồ</h2>

        <p>
          Tổng trang phục: {dashboard.wardrobe.total}
        </p>

        <p>
          Trang phục yêu thích:{' '}
          {dashboard.wardrobe.favorites}
        </p>

        <button
          type="button"
          onClick={() => navigate('/wardrobe')}
        >
          Xem tủ đồ
        </button>
      </section>

      <hr />

      {/* AI OUTFIT */}

      <section>
        <h2>✨ AI Outfit</h2>

        <p>
          Nhận gợi ý phối đồ từ những trang phục
          hiện có trong tủ đồ của bạn.
        </p>

        <button
          type="button"
          onClick={() => navigate('/ai-outfit')}
        >
          Gợi ý phối đồ bằng AI
        </button>
      </section>

      <hr />

      <button
        type="button"
        onClick={handleLogout}
      >
        Đăng xuất
      </button>
    </div>
  )
}

export default DashboardPage