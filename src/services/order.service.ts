import api from '@/lib/api'
import { API_ENDPOINTS } from '@/constants'
import type { 
  OrderListParams, 
  OrderListResponse, 
  OrderDetail, 
  OrderMastListResponse, 
  Order,
  OrderDetailResponse,
  OrderTranDetailResponse,
  ShipmentListResponse,
  OrderShipmentResponse,
  ShippingProgress,
  ShipmentDetailResponse,
  ShipSlipResponse
} from '@/types/order.types'

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
   * 주문 상세 조회 (기존 - 사용하지 않음)
   */
  static async getOrderDetail(id: string): Promise<OrderDetail> {
    const url = API_ENDPOINTS.ORDERS.DETAIL.replace(':id', id)
    const response = await api.get(url)
    return response.data
  }

  /**
   * 주문 상세 조회 (주문번호 기준) - 백엔드 API 연동
   */
  static async getOrderDetailByOrderNumber(orderNumber: string): Promise<OrderDetailResponse> {
    const url = API_ENDPOINTS.ORDERS.DETAIL_BY_ORDER_NUMBER.replace(':orderNumber', orderNumber)
    console.log('주문 상세조회 API 요청 URL:', url) // 디버깅용
    const response = await api.get<OrderDetailResponse>(url)
    return response.data
  }

  /**
   * 백엔드 OrderDetailResponse를 UI용 OrderDetail 타입으로 변환
   * 백엔드 필드명과 동일하게 매핑하여 혼란 방지
   */
  static transformOrderDetail(apiResponse: OrderDetailResponse): OrderDetail {
    return {
      // 백엔드 필드명과 동일하게 매핑 (포맷팅만 적용)
      orderNumber: apiResponse.orderNumber,
      orderMastDate: this.formatDisplayDate(apiResponse.orderMastDate),
      orderMastSdivDisplayName: apiResponse.orderMastSdivDisplayName || apiResponse.orderMastSdiv,
      orderMastOdate: this.formatDisplayDateWithTime(apiResponse.orderMastOdate, apiResponse.orderMastOtime),
      orderMastDcust: apiResponse.orderMastDcust || '',
      orderMastComaddr: apiResponse.orderMastComaddr || '',
      orderMastComname: apiResponse.orderMastComname || '',
      orderMastCurrency: `${apiResponse.orderMastCurrencyDisplayName || apiResponse.orderMastCurrency} / ${apiResponse.orderMastCurrencyPer || '1'}`,
      orderMastReasonDisplayName: apiResponse.orderMastReasonDisplayName || apiResponse.orderMastReason || '',
      orderMastComuname: apiResponse.orderMastComuname || '',
      orderMastComutel: apiResponse.orderMastComutel || '',
      orderMastRemark: apiResponse.orderMastRemark || '',
      orderTranTotalAmount: (apiResponse.orderTranTotalAmount || 0).toLocaleString() + '원',
      
      // 기존 호환성을 위한 필드들
      id: apiResponse.orderNumber,
      status: '주문완료',
      products: this.transformOrderProducts(apiResponse.orderTranList || [])
    }
  }

  /**
   * OrderTranDetailResponse 배열을 OrderProduct 배열로 변환
   */
  static transformOrderProducts(orderTranList: OrderTranDetailResponse[]): Array<{
    id: string
    productCode: string
    productName: string
    specification: string
    quantity: number
    unit: string
    discount: number
    unitPrice: number
    totalPrice: number
    status: string
  }> {
    return orderTranList.map((tran, index) => ({
      id: `${tran.orderTranItem}-${index}`,
      productCode: tran.itemCodeNum || '',
      productName: tran.orderTranDeta || '',
      specification: tran.orderTranSpec || '',
      quantity: tran.orderTranCnt || 0,
      unit: tran.orderTranUnit || '',
      discount: tran.orderTranDcPer || 0,
      unitPrice: tran.orderTranAmt || 0,
      totalPrice: tran.orderTranTot || 0,
      status: tran.orderTranStauDisplayName || tran.orderTranStau || ''
    }))
  }

  /**
   * OrderMastListResponse를 UI용 Order 타입으로 변환
   * 백엔드 필드명과 동일하게 매핑하여 혼란 방지
   */
  static transformToOrder(orderMast: OrderMastListResponse): Order {
    return {
      // 백엔드 필드명과 동일하게 매핑 (포맷팅만 적용)
      orderNumber: orderMast.orderNumber,
      orderMastSdivDisplayName: orderMast.orderMastSdivDisplayName || '일반판매',
      orderMastComname: orderMast.orderMastComname || '미지정',
      orderMastDate: this.formatDisplayDate(orderMast.orderMastDate),
      orderMastStatusDisplayName: orderMast.orderMastStatusDisplayName || '처리중',
      
      // 기존 호환성을 위한 필드들
      id: orderMast.orderNumber,
      status: orderMast.orderMastStatusDisplayName || '처리중'
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
   * YYYYMMDD 날짜와 HH 시간을 YYYY-MM-DD HH:00 형식으로 변환
   */
  private static formatDisplayDateWithTime(dateString: string, timeString: string): string {
    const formattedDate = this.formatDisplayDate(dateString)
    
    if (!timeString) {
      return formattedDate
    }
    
    // 시간이 한 자리수면 앞에 0을 붙여서 두 자리로 만들기
    const formattedTime = timeString.padStart(2, '0')
    
    return `${formattedDate} ${formattedTime}:00`
  }

  /**
   * 거래처별 출하진행현황 조회
   * @param custId 거래처 ID (로그인한 사용자의 custCode)
   * @param params 필터링 파라미터
   */
  static async getShipmentList(custId: number, params: OrderListParams = {}): Promise<ShipmentListResponse> {
    const searchParams = new URLSearchParams()
    
    // 필터링 파라미터 추가 (기존과 동일한 방식)
    if (params.orderDate) {
      const formattedDate = params.orderDate.replace(/-/g, '')
      searchParams.append('orderDate', formattedDate)
    }
    if (params.startDate) {
      const formattedStartDate = params.startDate.replace(/-/g, '')
      searchParams.append('startDate', formattedStartDate)
    }
    if (params.endDate) {
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
    const url = API_ENDPOINTS.ORDERS.SHIPMENT.replace(':custId', custId.toString())
    const finalUrl = queryString ? `${url}?${queryString}` : url
    
    console.log('출하진행현황 API 요청 URL:', finalUrl) // 디버깅용
    
    const response = await api.get(finalUrl)
    return response.data
  }

  /**
   * OrderShipmentResponse를 UI용 ShippingProgress 타입으로 변환
   * 백엔드 필드명과 동일하게 매핑하여 혼란 방지
   */
  static transformToShippingProgress(shipment: OrderShipmentResponse): ShippingProgress {
    return {
      // 백엔드 필드명과 동일하게 매핑 (포맷팅만 적용)
      orderNumber: shipment.orderNumber,
      shipNumber: shipment.shipNumber,
      orderMastDate: this.formatDisplayDate(shipment.orderMastDate),
      orderMastSdivDisplayName: shipment.orderMastSdivDisplayName || '일반판매',
      orderMastComname: shipment.orderMastComname || '미지정',
      orderMastOdate: this.formatDisplayDate(shipment.orderMastOdate),
      orderMastStatusDisplayName: shipment.orderMastStatusDisplayName || '처리중',
      
      // 기존 호환성을 위한 필드들 (출하번호 기준으로 변경)
      id: shipment.shipNumber
    }
  }

  /**
   * 출하번호별 출고현황 조회
   * @param shipNumber 출하번호
   */
  static async getShipmentDetail(shipNumber: string): Promise<ShipmentDetailResponse[]> {
    const url = API_ENDPOINTS.SHIPMENTS.DETAIL.replace(':shipNumber', shipNumber)
    console.log('출고현황 API 요청 URL:', url) // 디버깅용
    const response = await api.get<ShipmentDetailResponse[]>(url)
    return response.data
  }

  /**
   * 전표번호별 출고전표현황 조회
   * @param slipNumber 전표번호
   */
  static async getShipSlipDetail(slipNumber: string): Promise<ShipSlipResponse> {
    const url = API_ENDPOINTS.SHIPMENTS.SLIP.replace(':slipNumber', slipNumber)
    console.log('출고전표현황 API 요청 URL:', url) // 디버깅용
    const response = await api.get<ShipSlipResponse>(url)
    return response.data
  }


} 