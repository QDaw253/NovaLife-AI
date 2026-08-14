import {
  NavLink,
  Outlet,
  useNavigate,
} from 'react-router-dom'

import { useAuth } from '../contexts/AuthContext'


function MainLayout() {
  const { logout } = useAuth()
  const navigate = useNavigate()


  const handleLogout = async () => {
    await logout()

    navigate('/login')
  }


  return (
    <div>
      <aside>
        <h2>NovaLife</h2>

        <nav>
          <p>
            <NavLink to="/dashboard">
              Dashboard
            </NavLink>
          </p>

          <p>
            <NavLink to="/goals">
              Mục tiêu
            </NavLink>
          </p>

          <p>
            <NavLink to="/habits">
              Thói quen
            </NavLink>
          </p>

          <p>
            <NavLink to="/wardrobe">
              Tủ đồ
            </NavLink>
          </p>

          <p>
            <NavLink to="/ai-outfit">
              AI Outfit
            </NavLink>
          </p>
        </nav>

        <hr />

        <button
          type="button"
          onClick={handleLogout}
        >
          Đăng xuất
        </button>
      </aside>

      <main>
        <Outlet />
      </main>
    </div>
  )
}


export default MainLayout