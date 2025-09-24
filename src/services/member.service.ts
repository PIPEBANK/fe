import api from '@/lib/api'
import type { 
  MemberDetail, 
  ChangePasswordRequest, 
  UpdateMemberRequest,
  MemberResponse,
  PageResponse,
  MemberCreateRequest,
  CheckDuplicateResponse
} from '@/types'
import { MemberRole } from '@/types'
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

  /**
   * 전체 회원 목록 조회 (관리자만)
   */
  static async getAllMembers(params: {
    page?: number;
    size?: number;
    sort?: string;
    direction?: string;
    memberId?: string;
    memberName?: string;
    custCodeName?: string;
    role?: MemberRole;
    useYn?: boolean;
  } = {}): Promise<PageResponse<MemberResponse>> {
    const {
      page = 0,
      size = 20,
      sort = 'createDate',
      direction = 'desc',
      memberId,
      memberName,
      custCodeName,
      role,
      useYn
    } = params;

    const response = await api.get<PageResponse<MemberResponse>>(
      '/members',
      {
        params: {
          page,
          size,
          sort,
          direction,
          ...(memberId && { memberId }),
          ...(memberName && { memberName }),
          ...(custCodeName && { custCodeName }),
          ...(role && { role }),
          ...(useYn !== undefined && { useYn })
        }
      }
    )
    return response.data
  }

  /**
   * 회원 상세조회 (ID)
   */
  static async getMemberById(id: number): Promise<MemberResponse> {
    const response = await api.get<MemberResponse>(`/members/${id}`)
    return response.data
  }

  /**
   * 비밀번호 초기화 (관리자만)
   */
  static async resetPassword(id: number): Promise<{ message: string }> {
    const response = await api.put<{ message: string }>(`/members/${id}/password/reset`)
    return response.data
  }

  /**
   * 회원 비활성화 (관리자만)
   */
  static async deactivateMember(id: number): Promise<{ message: string }> {
    const response = await api.put<{ message: string }>(`/members/${id}/deactivate`)
    return response.data
  }

  /**
   * 회원 활성화 (관리자만)
   */
  static async activateMember(id: number): Promise<{ message: string }> {
    const response = await api.put<{ message: string }>(`/members/${id}/activate`)
    return response.data
  }

  /**
   * 사용자 생성 (관리자만)
   */
  static async createMember(request: MemberCreateRequest): Promise<MemberResponse> {
    const response = await api.post<MemberResponse>('/members', request)
    return response.data
  }

  /**
   * 사용자 ID 중복 체크
   */
  static async checkDuplicateMemberId(memberId: string): Promise<CheckDuplicateResponse> {
    const response = await api.get<CheckDuplicateResponse>(`/members/check-duplicate/${memberId}`)
    return response.data
  }

  /**
   * 회원 정보 수정 (관리자: 타 사용자 수정 가능, 일반: 자기자신 일부 수정)
   */
  static async updateMember(
    id: number,
    data: { memberName: string; custCode: string; role?: MemberRole; useYn?: boolean }
  ): Promise<MemberResponse> {
    const response = await api.put<MemberResponse>(`/members/${id}`, data)
    return response.data
  }
} 