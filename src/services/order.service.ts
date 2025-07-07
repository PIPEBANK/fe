import api from '@/lib/api'
import { API_ENDPOINTS } from '@/constants'
import type { OrderListParams, OrderListResponse, OrderDetail, OrderMastListResponse, Order } from '@/types/order.types'

export class OrderService {
  /**
   * 거래처별 주문 목록 조회
   * @param custId 거래처 ID (로그인한 사용자의 custCode)
   * @param params 필터링 파라미터
   */
  static async getOrderList(custId: number, params: OrderListParams = {}): Promise<OrderListResponse> {
    const searchParams = new URLSearchParams()
    
    // 필터링 파라미터 추가
    if (params.orderDate) {
      // YYYY-MM-DD 형식을 YYYYMMDD 형식으로 변환
      const formattedDate = params.orderDate.replace(/-/g, '')
      searchParams.append('orderDate', formattedDate)
    }
    if (params.startDate) {
      // YYYY-MM-DD 형식을 YYYYMMDD 형식으로 변환
      const formattedStartDate = params.startDate.replace(/-/g, '')
      searchParams.append('startDate', formattedStartDate)
    }
    if (params.endDate) {
      // YYYY-MM-DD 형식을 YYYYMMDD 형식으로 변환
      const formattedEndDate = params.endDate.replace(/-/g, '')
      searchParams.append('endDate', formattedEndDate)
    }
    if (params.orderNumber) {
      searchParams.append('orderNumber', params.orderNumber)
    }
    if (params.sdiv) {
      searchParams.append('sdiv', params.sdiv)
    }
    if (params.comName) {
      searchParams.append('comName', params.comName)
    }
    if (params.page !== undefined) {
      searchParams.append('page', params.page.toString())
    }
    if (params.size !== undefined) {
      searchParams.append('size', params.size.toString())
    }
    
    const queryString = searchParams.toString()
    const url = API_ENDPOINTS.ORDERS.LIST.replace(':custId', custId.toString())
    const finalUrl = queryString ? `${url}?${queryString}` : url
    
    console.log('API 요청 URL:', finalUrl) // 디버깅용
    
    const response = await api.get(finalUrl)
    return response.data
  }

  /**
   * 주문 상세 조회
   */
  static async getOrderDetail(id: string): Promise<OrderDetail> {
    const url = API_ENDPOINTS.ORDERS.DETAIL.replace(':id', id)
    const response = await api.get(url)
    return response.data
  }

  /**
   * OrderMastListResponse를 UI용 Order 타입으로 변환
   */
  static transformToOrder(orderMast: OrderMastListResponse): Order {
    // orderNumber를 직접 ID로 사용 (백엔드에서 고유값 보장)
    return {
      id: orderMast.orderNumber,
      orderNumber: orderMast.orderNumber,
      productCategory: orderMast.orderMastSdivDisplayName || '일반판매',
      client: orderMast.orderMastComname || '미지정',
      orderDate: this.formatDisplayDate(orderMast.orderMastDate),
      status: this.getOrderStatus() // 상태 결정 로직
    }
  }

  /**
   * YYYYMMDD 형식을 YYYY-MM-DD 형식으로 변환 (화면 표시용)
   */
  private static formatDisplayDate(dateString: string): string {
    if (!dateString || dateString.length !== 8) {
      return dateString
    }
    const year = dateString.substring(0, 4)
    const month = dateString.substring(4, 6)
    const day = dateString.substring(6, 8)
    return `${year}-${month}-${day}`
  }

  /**
   * 주문 상태 결정 로직 (비즈니스 로직에 따라 수정 필요)
   */
  private static getOrderStatus(): string {
    // 간소화된 응답이므로 기본값 반환
    // 실제 상태는 별도 필드나 로직으로 결정해야 함
    return '처리중'
  }
} 