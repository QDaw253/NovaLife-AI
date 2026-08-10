import { createContext, useContext, useState } from 'react'
import { logout as logoutApi } from '../api/auth'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  // Khi mở web lại, lấy user đã lưu trong localStorage
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user')

    return savedUser? JSON.parse(savedUser): null
  })

  // Hàm đăng xuất
  const logout = async () => {
    const refreshToken = localStorage.getItem('refresh_token')

    try {
      if (refreshToken) {
        await logoutApi(refreshToken)
      }
    } catch (error) {
      console.error('Logout API error:', error)
    } finally {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user')

      setUser(null)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}