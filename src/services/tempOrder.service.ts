import api from '@/lib/api'
import axios from 'axios'
import type { 
  TempWebOrderMastCreateRequest,
  TempWebOrderMastResponse,
  TempWebOrderTranCreateRequest,
  TempWebOrderTranResponse,
  TempWebOrderMastId,
  TempWebOrderTranId,
  SendResponse
} from '@/types/tempOrder.types'

/**
 * 임시저장 주문 마스터 API 서비스
 */
export class TempOrderMastService {
  private static readonly BASE_URL = '/web/temp/order-mast'

  /**
   * 임시저장 주문 마스터 생성
   */
  static async create(request: TempWebOrderMastCreateRequest): Promise<TempWebOrderMastResponse> {
    const response = await api.post<TempWebOrderMastResponse>(this.BASE_URL, request)
    return response.data
  }

  /**
   * 전체 임시저장 주문 마스터 조회
   */
  static async findAll(): Promise<TempWebOrderMastResponse[]> {
    const response = await api.get<TempWebOrderMastResponse[]>(this.BASE_URL)
    return response.data
  }

  /**
   * ID로 임시저장 주문 마스터 조회
   */
  static async findById(id: TempWebOrderMastId): Promise<TempWebOrderMastResponse | null> {
    try {
      const url = `${this.BASE_URL}/${id.orderMastDate}/${id.orderMastSosok}/${id.orderMastUjcd}/${id.orderMastAcno}`
      const response = await api.get<TempWebOrderMastResponse>(url)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null
      }
      throw error
    }
  }

  /**
   * 임시저장 주문 마스터 수정
   */
  static async update(id: TempWebOrderMastId, request: TempWebOrderMastCreateRequest): Promise<TempWebOrderMastResponse | null> {
    try {
      const url = `${this.BASE_URL}/${id.orderMastDate}/${id.orderMastSosok}/${id.orderMastUjcd}/${id.orderMastAcno}`
      const response = await api.put<TempWebOrderMastResponse>(url, request)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null
      }
      throw error
    }
  }

  /**
   * 임시저장 주문 마스터 삭제
   */
  static async delete(id: TempWebOrderMastId): Promise<boolean> {
    try {
      const url = `${this.BASE_URL}/${id.orderMastDate}/${id.orderMastSosok}/${id.orderMastUjcd}/${id.orderMastAcno}`
      await api.delete(url)
      return true
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return false
      }
      throw error
    }
  }

  /**
   * 임시저장 주문을 정식 주문으로 발송 처리
   */
  static async markAsSent(id: TempWebOrderMastId): Promise<SendResponse> {
    const url = `${this.BASE_URL}/${id.orderMastDate}/${id.orderMastSosok}/${id.orderMastUjcd}/${id.orderMastAcno}/send`
    const response = await api.patch<SendResponse>(url)
    return response.data
  }
}

/**
 * 임시저장 주문 상세 API 서비스
 */
export class TempOrderTranService {
  private static readonly BASE_URL = '/web/temp/order-tran'

  /**
   * 임시저장 주문 상세 생성
   */
  static async create(request: TempWebOrderTranCreateRequest): Promise<TempWebOrderTranResponse> {
    const response = await api.post<TempWebOrderTranResponse>(this.BASE_URL, request)
    return response.data
  }

  /**
   * 전체 임시저장 주문 상세 조회
   */
  static async findAll(): Promise<TempWebOrderTranResponse[]> {
    const response = await api.get<TempWebOrderTranResponse[]>(this.BASE_URL)
    return response.data
  }

  /**
   * ID로 임시저장 주문 상세 조회
   */
  static async findById(id: TempWebOrderTranId): Promise<TempWebOrderTranResponse | null> {
    try {
      const url = `${this.BASE_URL}/${id.orderTranDate}/${id.orderTranSosok}/${id.orderTranUjcd}/${id.orderTranAcno}/${id.orderTranSeq}`
      const response = await api.get<TempWebOrderTranResponse>(url)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null
      }
      throw error
    }
  }

  /**
   * 임시저장 주문 상세 수정
   */
  static async update(id: TempWebOrderTranId, request: TempWebOrderTranCreateRequest): Promise<TempWebOrderTranResponse | null> {
    try {
      const url = `${this.BASE_URL}/${id.orderTranDate}/${id.orderTranSosok}/${id.orderTranUjcd}/${id.orderTranAcno}/${id.orderTranSeq}`
      const response = await api.put<TempWebOrderTranResponse>(url, request)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null
      }
      throw error
    }
  }

  /**
   * 임시저장 주문 상세 삭제
   */
  static async delete(id: TempWebOrderTranId): Promise<boolean> {
    try {
      const url = `${this.BASE_URL}/${id.orderTranDate}/${id.orderTranSosok}/${id.orderTranUjcd}/${id.orderTranAcno}/${id.orderTranSeq}`
      await api.delete(url)
      return true
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return false
      }
      throw error
    }
  }

  /**
   * 임시저장 주문 상세를 정식 주문 상세로 발송 처리
   */
  static async markAsSent(id: TempWebOrderTranId): Promise<SendResponse> {
    const url = `${this.BASE_URL}/${id.orderTranDate}/${id.orderTranSosok}/${id.orderTranUjcd}/${id.orderTranAcno}/${id.orderTranSeq}/send`
    const response = await api.patch<SendResponse>(url)
    return response.data
  }
}

/**
 * 통합 임시저장 주문 서비스
 * 마스터와 상세를 함께 처리하는 고수준 서비스 (통합 API 사용)
 */
export class TempOrderService {
  private static readonly BASE_URL = '/web/temp/order-mast/with-trans'

  /**
   * 임시저장 주문 전체 저장 (마스터 + 상세들 통합)
   */
  static async tempSave(request: TempWebOrderMastCreateRequest): Promise<TempWebOrderMastResponse> {
    try {
      const response = await api.post<TempWebOrderMastResponse>(this.BASE_URL, {
        ...request,
        send: false
      })
      return response.data
    } catch (error) {
      console.error('임시저장 실패:', error)
      throw error
    }
  }

  /**
   * 임시저장 주문을 정식 주문으로 발송 처리 (마스터 + 상세들 통합)
   */
  static async send(request: TempWebOrderMastCreateRequest): Promise<TempWebOrderMastResponse> {
    try {
      const response = await api.post<TempWebOrderMastResponse>(this.BASE_URL, {
        ...request,
        send: true
      })
      return response.data
    } catch (error) {
      console.error('발송 실패:', error)
      throw error
    }
  }
} 