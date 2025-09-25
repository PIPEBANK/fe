import api from '@/lib/api'
import { API_ENDPOINTS } from '@/constants'
import type { 
  LoginRequest, 
  TokenResponse,
  Member,
  FindMemberIdRequest,
  FindMemberIdResponse
} from '@/types'

/**
 * 인증 관련 API 서비스
 */
export const authService = {
  /**
   * 로그인
   */
  login: async (credentials: LoginRequest): Promise<TokenResponse> => {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, credentials, { withCredentials: true })
    return response.data
  },

  /**
   * 로그아웃
   */
  logout: async (): Promise<void> => {
    await api.post(API_ENDPOINTS.AUTH.LOGOUT, null, { withCredentials: true })
  },

  /**
   * 토큰 갱신
   */
  refreshToken: async (): Promise<TokenResponse> => {
    const response = await api.post(API_ENDPOINTS.AUTH.REFRESH, null, { withCredentials: true })
    return response.data
  },

  /**
   * 아이디 찾기
   */
  findMemberId: async (request: FindMemberIdRequest): Promise<FindMemberIdResponse> => {
    const response = await api.post<FindMemberIdResponse>('/auth/find-member-id', request)
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