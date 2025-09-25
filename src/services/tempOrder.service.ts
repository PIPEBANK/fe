import api, { tokenManager } from '@/lib/api'
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
   * 인증 필수: 액세스 토큰이 없으면 로그인으로 이동
   */
  private static ensureAuthenticated(): void {
    const token = tokenManager.getAccessToken()
    if (!token) {
      alert('세션이 만료되었습니다. 다시 로그인해 주세요.')
      window.location.href = '/login'
      throw new Error('UNAUTHORIZED')
    }
  }

  /**
   * 요청 중복 방지용 키 생성 (Idempotency-Key)
   */
  private static generateIdempotencyKey(): string {
    try {
      // 브라우저 지원 시 사용
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const g = (globalThis as any)?.crypto?.randomUUID?.()
      if (g) return g
    } catch {
      // noop
    }
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`
  }

  /**
   * 임시저장 주문 전체 저장 (마스터 + 상세들 통합)
   */
  static async tempSave(request: TempWebOrderMastCreateRequest): Promise<TempWebOrderMastResponse> {
    try {
      this.ensureAuthenticated()
      const response = await api.post<TempWebOrderMastResponse>(this.BASE_URL, {
        ...request,
        send: false
      }, { headers: { 'Idempotency-Key': this.generateIdempotencyKey() } })
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
      this.ensureAuthenticated()
      const response = await api.post<TempWebOrderMastResponse>(this.BASE_URL, {
        ...request,
        send: true
      }, { headers: { 'Idempotency-Key': this.generateIdempotencyKey() } })
      return response.data
    } catch (error) {
      console.error('발송 실패:', error)
      throw error
    }
  }

  /**
   * 주문번호로 임시저장 주문 조회 (마스터 + 상세들 통합)
   */
  static async findByOrderNumber(orderNumber: string): Promise<TempWebOrderMastResponse> {
    try {
      this.ensureAuthenticated()
      const response = await api.get<TempWebOrderMastResponse>(`/web/temp/order-mast/by-order-number/${orderNumber}`)
      return response.data
    } catch (error) {
      console.error('임시저장 주문 조회 실패:', error)
      throw error
    }
  }

  /**
   * 주문번호 + tempOrderId로 임시저장 주문 조회 (마스터 + 상세들 통합)
   */
  static async findByOrderNumberAndTempId(orderNumber: string, tempOrderId: number): Promise<TempWebOrderMastResponse> {
    try {
      this.ensureAuthenticated()
      const response = await api.get<TempWebOrderMastResponse>(`/web/temp/order-mast/by-order-number/${orderNumber}/temp-id/${tempOrderId}`)
      return response.data
    } catch (error) {
      console.error('임시저장 주문 조회 실패:', error)
      throw error
    }
  }

  /**
   * 주문번호로 임시저장 주문 수정 (마스터 + 상세들 통합)
   */
  static async updateByOrderNumber(orderNumber: string, request: TempWebOrderMastCreateRequest): Promise<TempWebOrderMastResponse> {
    try {
      this.ensureAuthenticated()
      const response = await api.put<TempWebOrderMastResponse>(`/web/temp/order-mast/by-order-number/${orderNumber}/with-trans`, request, {
        headers: { 'Idempotency-Key': this.generateIdempotencyKey() }
      })
      return response.data
    } catch (error) {
      console.error('임시저장 주문 수정 실패:', error)
      throw error
    }
  }

  /**
   * 주문번호 + tempOrderId로 임시저장 주문 수정 (마스터 + 상세들 통합)
   */
  static async updateByOrderNumberAndTempId(orderNumber: string, tempOrderId: number, request: TempWebOrderMastCreateRequest): Promise<TempWebOrderMastResponse> {
    try {
      this.ensureAuthenticated()
      const response = await api.put<TempWebOrderMastResponse>(`/web/temp/order-mast/by-order-number/${orderNumber}/temp-id/${tempOrderId}/with-trans`, request, {
        headers: { 'Idempotency-Key': this.generateIdempotencyKey() }
      })
      return response.data
    } catch (error) {
      console.error('임시저장 주문 수정 실패:', error)
      throw error
    }
  }
} 