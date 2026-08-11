import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useEffect, useState } from 'react'
import { getDashboard } from '../../api/dashboard'

function DashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [dashboard, setDashboard] = useState(null)

  useEffect(() => {
    const fetchDashboard = async () => {
      const result = await getDashboard()

      setDashboard(result.data)
      console.log('Dashboard data:',result.data)
    }

    fetchDashboard()
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }
  
  if (!dashboard) {
    return <p>Đang tải Dashboard...</p>
  }

  return (
    <div>
      <h1>NovaLife Dashboard</h1>

      <p>Xin chào, {user?.username}</p>
      <p>Email: {user?.email}</p>

      <hr />

      <h2>Mục tiêu</h2>

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
        Tỷ lệ hoàn thành: {dashboard.goals.completion_rate}%
      </p>

      <hr />

      <h2>Thói quen</h2>

      <p>
        Thói quen đang hoạt động: {dashboard.habits.active}
      </p>

      <p>
        Hoàn thành hôm nay: {dashboard.habits.completed_today}
      </p>

      <p>
        Tỷ lệ hoàn thành hôm nay: {dashboard.habits.completion_rate}%
      </p>

      <hr />

      <button onClick={handleLogout}>
        Đăng xuất
      </button>
    </div>
  )
}

export default DashboardPage