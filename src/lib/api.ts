import axios from 'axios'

// API 기본 설정
const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || 'http://localhost:8080') + '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 쿠키 기반 refresh 지원
})

// 토큰 관리 유틸리티
export const tokenManager = {
  getAccessToken: () => localStorage.getItem('accessToken'),
  // refresh 토큰은 httpOnly 쿠키로만 관리 (클라이언트 저장 금지)
  setAccessToken: (accessToken: string) => {
    localStorage.setItem('accessToken', accessToken)
  },
  setTokens: (accessToken: string) => {
    localStorage.setItem('accessToken', accessToken)
  },
  clearTokens: () => {
    localStorage.removeItem('accessToken')
  }
}

// 토큰 갱신 함수
let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (error: unknown) => void
}> = []

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error)
    } else {
      resolve(token!)
    }
  })
  
  failedQueue = []
}

// 로그인 리다이렉트 보호: 중복 리다이렉트/무한 루프 방지
const redirectToLoginOnce = () => {
  if (typeof window === 'undefined') return
  try {
    if (window.location.pathname === '/login') return
    if (sessionStorage.getItem('authRedirected') === '1') return
    sessionStorage.setItem('authRedirected', '1')
    window.location.replace('/login')
  } catch {
    window.location.href = '/login'
  }
}

const notifySessionExpiredOnce = () => {
  if (typeof window === 'undefined') return
  try {
    if (sessionStorage.getItem('authExpiredNotified') === '1') return
    sessionStorage.setItem('authExpiredNotified', '1')
    // 사용자 안내
    alert('세션이 만료되었습니다. 다시 로그인해 주세요.')
  } catch {
    // noop
  }
}

// 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    const token = tokenManager.getAccessToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 응답 인터셉터
api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return api(originalRequest)
        }).catch(err => {
          return Promise.reject(err)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const response = await axios.post(`${api.defaults.baseURL}/auth/refresh`, null, { withCredentials: true })
        const { accessToken } = response.data
        tokenManager.setAccessToken(accessToken)
        
        processQueue(null, accessToken)
        
        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return api(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        tokenManager.clearTokens()
        notifySessionExpiredOnce()
        redirectToLoginOnce()
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

// 기존 authApi는 services/auth.service.ts로 이동됨

export default api 