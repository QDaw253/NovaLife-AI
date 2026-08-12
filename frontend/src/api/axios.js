import axios from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
  headers: {
    'Content-Type': 'application/json',
  },
})

// ==============================
// REQUEST INTERCEPTOR
// ==============================
// Tự động gắn access token vào các API cần đăng nhập
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('access_token')

    const publicUrls = [
      'accounts/login/',
      'accounts/register/',
      'accounts/refresh/',
    ]

    const isPublicUrl = publicUrls.some((url) =>
      config.url?.includes(url)
    )

    if (accessToken && !isPublicUrl) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// ==============================
// RESPONSE INTERCEPTOR
// ==============================
// Nếu access token hết hạn và backend trả 401
// thì tự dùng refresh token để lấy access token mới
api.interceptors.response.use(
  (response) => {
    return response
  },

  async (error) => {
    const originalRequest = error.config

    if (
      error.response?.status === 401 &&
      !originalRequest?._retry
    ) {
      originalRequest._retry = true

      const refreshToken = localStorage.getItem('refresh_token')

      if (!refreshToken) {
        localStorage.removeItem('access_token')
        localStorage.removeItem('user')

        window.location.href = '/login'

        return Promise.reject(error)
      }

      try {
        const response = await axios.post(
          'http://127.0.0.1:8000/api/accounts/refresh/',
          {
            refresh: refreshToken,
          }
        )

        const newAccessToken = response.data.access

        localStorage.setItem(
          'access_token',
          newAccessToken
        )

        originalRequest.headers =
          originalRequest.headers || {}

        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`

        return api(originalRequest)
      } catch (refreshError) {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')

        window.location.href = '/login'

        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default api