import { NavLink, Outlet } from 'react-router-dom'

function MainLayout() {
  return (
    <div>
      <aside>
        <h2>NovaLife</h2>

        <nav>
            <p>
                <NavLink to="/dashboard">Dashboard</NavLink>
            </p>

            <p>
                <NavLink to="/goals">Mục tiêu</NavLink>
            </p>

            <p>
                <NavLink to="/habits">Thói quen</NavLink>
            </p>

            <p>
                <NavLink to="/wardrobe">Tủ đồ</NavLink>
            </p>

            <p>
                <NavLink to="/ai-outfit">AI Outfit</NavLink>
            </p> 
        </nav>
      </aside>

      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default MainLayout