import api from '@/lib/api'
import type { CustomerResponse, PageResponse } from '@/types'

export interface CustomerSearchParams {
  search?: string
  page?: number
  size?: number
  sort?: string
  direction?: string
}

/**
 * 거래처 관련 API 서비스
 */
export class CustomerService {
  /**
   * 활성 거래처 목록 조회 (페이징 + 통합검색)
   */
  static async getActiveCustomers(params?: CustomerSearchParams): Promise<PageResponse<CustomerResponse>> {
    const searchParams = new URLSearchParams()
    
    if (params?.search) {
      searchParams.append('search', params.search)
    }
    if (params?.page !== undefined) {
      searchParams.append('page', params.page.toString())
    }
    if (params?.size !== undefined) {
      searchParams.append('size', params.size.toString())
    }
    if (params?.sort) {
      searchParams.append('sort', params.sort)
    }
    if (params?.direction) {
      searchParams.append('direction', params.direction)
    }

    const response = await api.get<PageResponse<CustomerResponse>>(`/erp/customers?${searchParams.toString()}`)
    return response.data
  }
} 