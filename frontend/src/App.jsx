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
import HabitsPage from './pages/habits/HabitPage'
import HabitDetailPage from './pages/habits/HabitDetailPage'
import CreateHabitPage from './pages/habits/CreateHabitPage'
import EditHabitPage from './pages/habits/EditHabitPage'
import WardrobePage from './pages/wardrobe/WardrobePage'
import WardrobeDetailPage from './pages/wardrobe/WardrobeDetailPage'
import CreateWardrobePage from './pages/wardrobe/CreateWardrobePage'
import EditWardrobePage from './pages/wardrobe/EditWardrobePage'
import AIOutfitPage from './pages/ai/AIOutfitPage'
import OutfitRecommendationPage from './pages/wardrobe/OutfitRecommendationPage'
import GoalDetailPage from './pages/goals/GoalDetailPage'
import CreateGoalPage from './pages/goals/CreateGoalPage'
import EditGoalPage from './pages/goals/EditGoalPage'

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
        <Route path="/goals/:id/edit" element={<EditGoalPage />} />
        <Route path="/habits" element={<HabitsPage />} />
        <Route path="/habits/:id" element={<HabitDetailPage />} />
        <Route path="/habits/:id/edit" element={<EditHabitPage />} />
        <Route path="/habits/new" element={<CreateHabitPage />} />
        <Route path="/wardrobe" element={<WardrobePage />} />
        <Route path="/wardrobe/:id" element={<WardrobeDetailPage />} />
        <Route path="/wardrobe/new" element={<CreateWardrobePage />} />
        <Route path="/wardrobe/:id/edit" element={<EditWardrobePage />} />
        <Route path="/ai-outfit" element={<AIOutfitPage />} />
        <Route path="/wardrobe/outfit-recommendation" element={<OutfitRecommendationPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App