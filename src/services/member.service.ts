import api from '@/lib/api'
import type { 
  MemberDetail, 
  ChangePasswordRequest, 
  UpdateMemberRequest
} from '@/types'
import { API_ENDPOINTS } from '@/constants'

/**
 * 멤버 관련 API 서비스
 */
export class MemberService {
  /**
   * 내 정보 조회
   */
  static async getMyProfile(): Promise<MemberDetail> {
    const response = await api.get<MemberDetail>(
      API_ENDPOINTS.MEMBERS.ME
    )
    return response.data
  }

  /**
   * 비밀번호 변경
   */
  static async changePassword(userId: number, data: ChangePasswordRequest): Promise<{ message: string }> {
    const response = await api.put<{ message: string }>(
      `/members/${userId}/password`,
      data
    )
    return response.data
  }

  /**
   * 내 정보 수정
   */
  static async updateMyProfile(data: UpdateMemberRequest): Promise<MemberDetail> {
    const response = await api.put<MemberDetail>(
      API_ENDPOINTS.MEMBERS.UPDATE_ME,
      data
    )
    return response.data
  }
} 