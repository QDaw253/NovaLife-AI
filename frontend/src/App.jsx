import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'

import ProtectedRoute from './routes/ProtectedRoute'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import DashboardPage from './pages/dashboard/DashboardPage'
import MainLayout from './layouts/MainLayout'

import GoalsPage from './pages/goals/GoalsPage'
import GoalDetailPage from './pages/goals/GoalDetailPage'
import CreateGoalPage from './pages/goals/CreateGoalPage'
import EditGoalPage from './pages/goals/EditGoalPage'

import HabitsPage from './pages/habits/HabitPage'
import HabitDetailPage from './pages/habits/HabitDetailPage'
import CreateHabitPage from './pages/habits/CreateHabitPage'
import EditHabitPage from './pages/habits/EditHabitPage'

import WardrobePage from './pages/wardrobe/WardrobePage'
import WardrobeDetailPage from './pages/wardrobe/WardrobeDetailPage'
import CreateWardrobePage from './pages/wardrobe/CreateWardrobePage'
import EditWardrobePage from './pages/wardrobe/EditWardrobePage'
import OutfitRecommendationPage from './pages/wardrobe/OutfitRecommendationPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Protected */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard */}
          <Route path="/dashboard" element={<DashboardPage />} />

          {/* Goals */}
          <Route path="/goals" element={<GoalsPage />} />
          <Route path="/goals/new" element={<CreateGoalPage />} />
          <Route path="/goals/:id" element={<GoalDetailPage />} />
          <Route path="/goals/:id/edit" element={<EditGoalPage />} />

          {/* Habits */}
          <Route path="/habits" element={<HabitsPage />} />
          <Route path="/habits/new" element={<CreateHabitPage />} />
          <Route path="/habits/:id" element={<HabitDetailPage />} />
          <Route path="/habits/:id/edit" element={<EditHabitPage />} />

          {/* Wardrobe */}
          <Route path="/wardrobe" element={<WardrobePage />} />
          <Route path="/wardrobe/new" element={<CreateWardrobePage />} />
          <Route path="/wardrobe/:id" element={<WardrobeDetailPage />} />
          <Route path="/wardrobe/:id/edit" element={<EditWardrobePage />} />

          {/* AI Outfit */}
          <Route path="/ai-outfit" element={<OutfitRecommendationPage />} />

        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App