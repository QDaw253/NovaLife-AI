import axios from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
  headers: {
    'Content-Type': 'application/json',
  },
})


// =====================================
// REQUEST INTERCEPTOR
// =====================================

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
      config.headers.Authorization =
        `Bearer ${accessToken}`
    }

    return config
  },

  (error) => {
    return Promise.reject(error)
  }
)


// =====================================
// RESPONSE INTERCEPTOR
// =====================================

api.interceptors.response.use(
  (response) => {
    return response
  },

  async (error) => {
    const originalRequest = error.config

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true

      const refreshToken =
        localStorage.getItem('refresh_token')

      if (!refreshToken) {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')

        window.location.href = '/login'

        return Promise.reject(error)
      }

      try {
        const refreshResponse = await axios.post(
          'http://127.0.0.1:8000/api/accounts/refresh/',
          {
            refresh: refreshToken,
          }
        )

        // NovaLife custom renderer:
        // có thể là response.data.data
        // fallback response.data để an toàn
        const tokenData =
          refreshResponse.data.data ||
          refreshResponse.data

        const newAccessToken = tokenData.access
        const newRefreshToken = tokenData.refresh

        if (!newAccessToken) {
          throw new Error(
            'Không nhận được access token mới.'
          )
        }

        // Lưu access mới
        localStorage.setItem(
          'access_token',
          newAccessToken
        )

        // ROTATE_REFRESH_TOKENS=True
        // nên nếu backend trả refresh mới thì phải lưu lại
        if (newRefreshToken) {
          localStorage.setItem(
            'refresh_token',
            newRefreshToken
          )
        }

        originalRequest.headers =
          originalRequest.headers || {}

        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`

        // Gửi lại request vừa bị 401
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