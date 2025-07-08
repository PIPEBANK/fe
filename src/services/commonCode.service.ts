import api from '@/lib/api'
import type { CommonCode3Response } from '@/types'

export class CommonCodeService {
  /**
   * 특정 대분류의 소분류 코드들 조회
   */
  async getLevel3CodesByParent(cod1: string): Promise<CommonCode3Response[]> {
    try {
      const response = await api.get<CommonCode3Response[]>(`/erp/common-codes/level3/parent/${cod1}`)
      return response.data
    } catch (error) {
      console.error('공통코드 조회 실패:', error)
      throw error
    }
  }
}

export const commonCodeService = new CommonCodeService() 