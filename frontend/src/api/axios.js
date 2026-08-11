import axios from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('access_token')

    const publicUrls = [
      'accounts/login/',
      'accounts/register/',
      'accounts/refresh/',
    ]

    const isPublicUrl = publicUrls.some(
      (url) => config.url?.includes(url)
    )

    if (accessToken && !isPublicUrl) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default api