import api from '@/lib/api'
import { API_ENDPOINTS } from '@/constants'
import type { LoginRequest, TokenResponse, Member } from '@/types'

/**
 * 인증 관련 API 서비스
 */
export const authService = {
  /**
   * 로그인
   */
  login: async (credentials: LoginRequest): Promise<TokenResponse> => {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, credentials)
    return response.data
  },

  /**
   * 로그아웃
   */
  logout: async (refreshToken: string): Promise<void> => {
    await api.post(API_ENDPOINTS.AUTH.LOGOUT, { refreshToken })
  },

  /**
   * 토큰 갱신
   */
  refreshToken: async (refreshToken: string): Promise<TokenResponse> => {
    const response = await api.post(API_ENDPOINTS.AUTH.REFRESH, { refreshToken })
    return response.data
  },

  /**
   * 내 프로필 조회
   */
  getProfile: async (): Promise<Member> => {
    const response = await api.get(API_ENDPOINTS.MEMBERS.ME)
    return response.data
  },
} 