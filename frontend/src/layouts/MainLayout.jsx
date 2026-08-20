import {
  NavLink,
  Outlet,
  useNavigate,
} from 'react-router-dom'

import { useState } from 'react'

import { useAuth } from '../contexts/AuthContext'

import HabitReminder from '../components/HabitReminder'


function MainLayout() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)


  const handleLogout = async () => {
    await logout()

    navigate('/login')
  }


  const handleCloseSidebar = () => {
    setIsSidebarOpen(false)
  }


  const getNavLinkClass = ({ isActive }) => {
    return isActive
      ? 'app-nav-link app-nav-link--active'
      : 'app-nav-link'
  }


  return (
    <div className="app-shell">

      <button
        className="app-mobile-menu-button"
        type="button"
        onClick={() => setIsSidebarOpen(true)}
        aria-label="Mở menu"
      >
        ☰
      </button>


      {isSidebarOpen && (
        <button
          className="app-sidebar-overlay"
          type="button"
          onClick={handleCloseSidebar}
          aria-label="Đóng menu"
        />
      )}


      <aside
        className={`app-sidebar ${
          isSidebarOpen
            ? 'app-sidebar--open'
            : ''
        }`}
      >

        <div className="app-sidebar-top">

          <div className="app-brand">
            <div className="app-brand-mark">
              N
            </div>

            <div>
              <h1 className="app-brand-name">
                NovaLife
              </h1>

              <p className="app-brand-subtitle">
                Your Life OS
              </p>
            </div>


            <button
              className="app-sidebar-close-button"
              type="button"
              onClick={handleCloseSidebar}
              aria-label="Đóng menu"
            >
              ×
            </button>
          </div>


          <nav className="app-nav">

            <p className="app-nav-section-label">
              Tổng quan
            </p>

            <NavLink
              to="/dashboard"
              className={getNavLinkClass}
              onClick={handleCloseSidebar}
            >
              <span className="app-nav-icon">
                ◫
              </span>

              <span>
                Dashboard
              </span>
            </NavLink>


            <p className="app-nav-section-label">
              Phát triển cá nhân
            </p>

            <NavLink
              to="/goals"
              className={getNavLinkClass}
              onClick={handleCloseSidebar}
            >
              <span className="app-nav-icon">
                ◎
              </span>

              <span>
                Mục tiêu
              </span>
            </NavLink>

            <NavLink
              to="/habits"
              className={getNavLinkClass}
              onClick={handleCloseSidebar}
            >
              <span className="app-nav-icon">
                ✓
              </span>

              <span>
                Thói quen
              </span>
            </NavLink>


            <p className="app-nav-section-label">
              Phong cách
            </p>

            <NavLink
              to="/wardrobe"
              className={getNavLinkClass}
              onClick={handleCloseSidebar}
            >
              <span className="app-nav-icon">
                ◇
              </span>

              <span>
                Tủ đồ
              </span>
            </NavLink>

            <NavLink
              to="/ai-outfit"
              className={getNavLinkClass}
              onClick={handleCloseSidebar}
            >
              <span className="app-nav-icon app-nav-icon--ai">
                ✦
              </span>

              <span>
                AI Outfit
              </span>
            </NavLink>

          </nav>
        </div>


        <div className="app-sidebar-footer">
          <button
            className="app-logout-button"
            type="button"
            onClick={handleLogout}
          >
            <span className="app-nav-icon">
              ↪
            </span>

            <span>
              Đăng xuất
            </span>
          </button>
        </div>

      </aside>


      <main className="app-main">
        <div className="app-content">
          <HabitReminder />
          <Outlet />
        </div>
      </main>

    </div>
  )
}


export default MainLayout