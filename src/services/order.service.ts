import api from '@/lib/api'
import type { AxiosError } from 'axios'
import { API_ENDPOINTS } from '@/constants'
import type { 
  OrderListParams, 
  OrderListResponse, 
  OrderDetail, 
  OrderMastListResponse, 
  Order,
  OrderDetailResponse,
  OrderTranDetailResponse,
  OrderProduct,
  ShipmentListResponse,
  OrderShipmentResponse,
  ShippingProgress,
  ShipmentDetailResponse,
  ShipSlipResponse,
  ShipSlipListParams,
  ShipSlipListPageResponse,
  ShipmentItemParams,
  ShipmentItemPageResponse,
  OrderShipmentDetailParams,
  OrderShipmentDetailPageResponse,
  TempOrder,
  TempOrderListParams,
  TempOrderListResponse
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

    try {
      const response = await api.get(finalUrl)
      return response.data
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message?: string }>
      console.error('주문 목록 API 오류:', {
        url: finalUrl,
        status: axiosError.response?.status,
        data: axiosError.response?.data,
        message: axiosError.message,
      })
      throw error
    }
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
      pendingTotalAmount: (apiResponse.pendingTotalAmount || 0).toLocaleString() + '원',
      
      // 기존 호환성을 위한 필드들
      id: apiResponse.orderNumber,
      status: '주문완료',
      products: this.transformOrderProducts(apiResponse.orderTranList || [])
    }
  }

  /**
   * OrderTranDetailResponse 배열을 OrderProduct 배열로 변환
   */
  static transformOrderProducts(orderTranList: OrderTranDetailResponse[]): OrderProduct[] {
    return orderTranList.map((tran, index) => {
      const orderQuantity = tran.orderTranCnt || 0;  // 주문량
      const shipQuantity = tran.shipQuantity || 0;   // 출하량
      const pendingQuantity = tran.pendingQuantity || 0; // 백엔드에서 계산된 주문잔량 사용
      
      return {
        id: `${tran.orderTranItem}-${index}`,
        productCode: tran.itemCodeNum || '',
        productName: tran.orderTranDeta || '',
        specification: tran.orderTranSpec || '',
        quantity: orderQuantity,
        unit: tran.orderTranUnit || '',
        discount: tran.orderTranDcPer || 0,
        unitPrice: tran.orderTranAmt || 0,
        totalPrice: tran.orderTranTot || 0,
        netAmount: tran.orderTranNet ?? undefined,
        vatAmount: tran.orderTranVat ?? undefined,
        status: tran.orderTranStauDisplayName || tran.orderTranStau || '',
        shipNumber: tran.shipNumber || '',
        shipQuantity: shipQuantity,
        remainQuantity: pendingQuantity // 백엔드에서 계산된 값 사용
      }
    })
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
      orderTranTotalAmount: (orderMast.orderTranTotalAmount || 0).toLocaleString() + '원',
      pendingTotalAmount: (orderMast.pendingTotalAmount || 0).toLocaleString() + '원',
      
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

  /**
   * 거래처별 출고전표 목록 조회
   * @param custId 거래처 ID (로그인한 사용자의 custCode)
   * @param params 필터링 파라미터
   */
  static async getShipSlipList(custId: number, params: ShipSlipListParams = {}): Promise<ShipSlipListPageResponse> {
    const searchParams = new URLSearchParams()
    
    // 필터링 파라미터 추가
    if (params.shipDate) {
      // YYYY-MM-DD 형식을 YYYYMMDD 형식으로 변환
      const formattedDate = params.shipDate.replace(/-/g, '')
      searchParams.append('shipDate', formattedDate)
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
    if (params.shipNumber) {
      searchParams.append('shipNumber', params.shipNumber)
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
    const url = API_ENDPOINTS.SHIPMENTS.SLIP_LIST.replace(':custId', custId.toString())
    const finalUrl = queryString ? `${url}?${queryString}` : url
    
    console.log('출고전표 목록 API 요청 URL:', finalUrl) // 디버깅용
    
    const response = await api.get<ShipSlipListPageResponse>(finalUrl)
    return response.data
  }

  /**
   * 주문-출하 통합 상세 조회 (새로운 API)
   * @param custId 거래처 ID (로그인한 사용자의 custCode)
   * @param params 필터링 파라미터
   */
  static async getOrderShipmentDetail(custId: number, params: OrderShipmentDetailParams = {}): Promise<OrderShipmentDetailPageResponse> {
    const searchParams = new URLSearchParams()
    
    // 페이징 파라미터
    if (params.page !== undefined) {
      searchParams.append('page', params.page.toString())
    }
    if (params.size !== undefined) {
      searchParams.append('size', params.size.toString())
    }
    
    // 필터링 파라미터
    if (params.shipDate) {
      // YYYY-MM-DD 형식을 YYYYMMDD 형식으로 변환
      const formattedDate = params.shipDate.replace(/-/g, '')
      searchParams.append('shipDate', formattedDate)
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
    if (params.itemName1) {
      searchParams.append('itemName1', params.itemName1)
    }
    if (params.itemName2) {
      searchParams.append('itemName2', params.itemName2)
    }
    if (params.spec1) {
      searchParams.append('spec1', params.spec1)
    }
    if (params.spec2) {
      searchParams.append('spec2', params.spec2)
    }
    if (params.itemNameOperator) {
      searchParams.append('itemNameOperator', params.itemNameOperator)
    }
    if (params.specOperator) {
      searchParams.append('specOperator', params.specOperator)
    }
    if (params.siteName) {
      searchParams.append('siteName', params.siteName)
    }
    if (params.excludeCompleted !== undefined) {
      searchParams.append('excludeCompleted', params.excludeCompleted.toString())
    }
    if (params.statusFilter) {
      searchParams.append('statusFilter', params.statusFilter)
    }

    const response = await api.get(`/erp/shipments/order-shipment-detail/customer/${custId}?${searchParams.toString()}`)
    return response.data
  }

  /**
   * 거래처별 현장별 출하조회 (ShipTran 단위)
   * @param custId 거래처 ID (로그인한 사용자의 custCode)
   * @param params 필터링 파라미터
   */
  static async getShipmentItems(custId: number, params: ShipmentItemParams = {}): Promise<ShipmentItemPageResponse> {
    const searchParams = new URLSearchParams()
    
    // 필터링 파라미터 추가
    if (params.shipDate) {
      // YYYY-MM-DD 형식을 YYYYMMDD 형식으로 변환
      const formattedDate = params.shipDate.replace(/-/g, '')
      searchParams.append('shipDate', formattedDate)
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
    if (params.shipNumber) {
      searchParams.append('shipNumber', params.shipNumber)
    }
    if (params.orderNumber) {
      searchParams.append('orderNumber', params.orderNumber)
    }
    // 하위호환성을 위한 기존 itemName 지원
    if (params.itemName) {
      searchParams.append('itemName', params.itemName)
    }
    // 2차 검색 파라미터 추가
    if (params.itemName1) {
      searchParams.append('itemName1', params.itemName1)
    }
    if (params.itemName2) {
      searchParams.append('itemName2', params.itemName2)
    }
    if (params.spec1) {
      searchParams.append('spec1', params.spec1)
    }
    if (params.spec2) {
      searchParams.append('spec2', params.spec2)
    }
    if (params.itemNameOperator) {
      searchParams.append('itemNameOperator', params.itemNameOperator)
    }
    if (params.specOperator) {
      searchParams.append('specOperator', params.specOperator)
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
    const url = API_ENDPOINTS.SHIPMENTS.ITEMS.replace(':custId', custId.toString())
    const finalUrl = queryString ? `${url}?${queryString}` : url
    
    console.log('현장별 출하조회 API 요청 URL:', finalUrl) // 디버깅용
    
    const response = await api.get<ShipmentItemPageResponse>(finalUrl)
    return response.data
  }


} 

// 임시저장 주문 서비스
export class TempOrderListService {
  private static readonly BASE_URL = '/web/temp/order-mast'

  /**
   * 거래처별 임시저장 주문 목록 조회
   */
  static async getTempOrderList(
    custId: number,
    params: TempOrderListParams = {}
  ): Promise<{
    content: TempOrderListResponse[]
    totalElements: number
    totalPages: number
    number: number
    size: number
    first: boolean
    last: boolean
  }> {
    const searchParams = new URLSearchParams()
    
    if (params.orderDate) searchParams.append('orderDate', params.orderDate)
    if (params.startDate) searchParams.append('startDate', params.startDate)
    if (params.endDate) searchParams.append('endDate', params.endDate)
    if (params.orderNumber) searchParams.append('orderNumber', params.orderNumber)
    if (params.userId) searchParams.append('userId', params.userId)
    if (params.comName) searchParams.append('comName', params.comName)
    if (params.page !== undefined) searchParams.append('page', params.page.toString())
    if (params.size !== undefined) searchParams.append('size', params.size.toString())

    const queryString = searchParams.toString()
    const url = queryString 
      ? `${this.BASE_URL}/customer/${custId}?${queryString}`
      : `${this.BASE_URL}/customer/${custId}`

    const response = await api.get(url)
    return response.data
  }

  /**
   * 백엔드 응답을 UI용 타입으로 변환
   */
  static transformToTempOrder(response: TempOrderListResponse): TempOrder {
    return {
      id: response.orderNumber, // 임시 ID로 orderNumber 사용
      orderNumber: response.orderNumber,
      userId: response.userId,
      siteName: response.orderMastComname,
      orderDate: this.formatOrderDate(response.orderMastDate),
      tempOrderId: response.tempOrderId
    }
  }

  /**
   * 주문일자 포맷팅 (YYYYMMDD -> YYYY-MM-DD)
   */
  private static formatOrderDate(dateStr: string): string {
    if (!dateStr || dateStr.length !== 8) return dateStr
    
    const year = dateStr.substring(0, 4)
    const month = dateStr.substring(4, 6)
    const day = dateStr.substring(6, 8)
    
    return `${year}-${month}-${day}`
  }
} 