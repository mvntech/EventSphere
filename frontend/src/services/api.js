import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
})

export const TOKEN_KEY = 'eventsphere_token'

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// a 401 means the token is gone or expired — drop it so the app falls back to logged-out.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY)
    }
    return Promise.reject(error)
  }
)

// axios errors carry the useful text in different places depending on what failed.
export function apiError(error, fallback = 'Something went wrong. Please try again.') {
  if (error.response?.data?.message) return error.response.data.message
  if (error.code === 'ERR_NETWORK') return 'Cannot reach the server. Is the backend running?'
  return fallback
}

export default api
