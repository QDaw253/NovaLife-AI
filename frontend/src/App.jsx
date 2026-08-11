import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'

import ProtectedRoute from './routes/ProtectedRoute'
import LoginPage from './pages/auth/LoginPage'
import DashboardPage from './pages/dashboard/DashboardPage'
import MainLayout from './layouts/MainLayout'
import GoalsPage from './pages/goals/GoalsPage'
import HabitsPage from './pages/habits/HabitsPage'
import WardrobePage from './pages/wardrobe/WardrobePage'
import AIOutfitPage from './pages/ai/AIOutfitPage'
import GoalDetailPage from './pages/goals/GoalDetailPage'
import CreateGoalPage from './pages/goals/CreateGoalPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>

        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/goals" element={<GoalsPage />} />
        <Route path="/goals/:id" element={<GoalDetailPage />} />
        <Route path="/goals/new" element={<CreateGoalPage />} />
        <Route path="/habits" element={<HabitsPage />} />
        <Route path="/wardrobe" element={<WardrobePage />} />
        <Route path="/ai-outfit" element={<AIOutfitPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App