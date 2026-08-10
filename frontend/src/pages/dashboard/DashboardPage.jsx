import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

function DashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div>
      <h1>NovaLife Dashboard</h1>

      <p>Xin chào, {user?.username}</p>
      <p>Email: {user?.email}</p>

      <button onClick={handleLogout}>
        Đăng xuất
      </button>
    </div>
  )
}

export default DashboardPage