// 주문 관련 타입 정의

// 백엔드 OrderMastListResponse에 맞는 타입 (간소화된 목록용)
export interface OrderMastListResponse {
  orderNumber: string              // 주문번호 (DATE-ACNO)
  orderMastSdiv: string           // 출고형태 코드
  orderMastSdivDisplayName: string // 출고형태명
  orderMastComname: string        // 납품현장명
  orderMastDate: string           // 주문일자
  orderMastCust: number           // 거래처코드
}

// 기존 상세 조회용 타입 (상세 페이지에서 사용)
export interface OrderMastResponse {
  // 복합키 필드들
  orderMastDate: string
  orderMastSosok: number
  orderMastUjcd: string
  orderMastAcno: number
  
  // 기본 정보 필드들
  orderMastCust: number
  orderMastScust: number
  orderMastSawon: number
  orderMastSawonBuse: number
  orderMastOdate: string
  orderMastProject: number
  orderMastRemark: string
  orderMastFdate: string
  orderMastFuser: string
  orderMastLdate: string
  orderMastLuser: string
  orderMastComaddr1: string
  orderMastComaddr2: string
  orderMastComname: string
  orderMastComuname: string
  orderMastComutel: string
  orderMastReason: string
  orderMastTcomdiv: string
  orderMastCurrency: string
  orderMastCurrencyPer: string
  orderMastSdiv: string
  orderMastDcust: string
  orderMastIntype: string
  orderMastOtime: string
  
  // 추가 정보 필드들
  orderKey: string
  orderNumber: string    // 사용자 친화적 주문번호 (DATE-ACNO)
  fullAddress: string
  displayName: string
  
  // 코드 필드들의 표시명
  orderMastUjcdDisplayName: string     // 업장코드 표시명
  orderMastReasonDisplayName: string   // 사유코드 표시명
  orderMastTcomdivDisplayName: string  // 거래구분 표시명
  orderMastCurrencyDisplayName: string // 통화코드 표시명
  orderMastSdivDisplayName: string     // 구분코드 표시명
  orderMastIntypeDisplayName: string   // 입력타입 표시명
  
  // 관련 엔티티 정보
  orderMastSosokName: string  // orderMastSosok FK -> SosokCode.sosokCodeName
  orderMastSawonName: string  // orderMastSawon FK -> InsaMast.insaMastKnam
  orderMastSawonBuseName: string  // orderMastSawonBuse FK -> BuseCode.buseCodeName
  orderMastCustName: string   // orderMastCust FK -> Customer.custCodeName
  orderMastScustName: string  // orderMastScust FK -> Customer.custCodeName
}

// 주문 목록 조회 파라미터 (백엔드 API에 맞게 수정)
export interface OrderListParams {
  orderDate?: string    // 주문일자 (정확히 일치, YYYYMMDD 형식)
  startDate?: string    // 시작 주문일자 (범위 조회, YYYYMMDD 형식)
  endDate?: string      // 종료 주문일자 (범위 조회, YYYYMMDD 형식)
  orderNumber?: string  // 주문번호 (부분 검색)
  sdiv?: string        // 출고형태 (ORDER_MAST_SDIV)
  comName?: string     // 납품현장명 (부분 검색)
  page?: number
  size?: number
}

// 주문 목록 조회 응답 (Spring Page 구조)
export interface OrderListResponse {
  content: OrderMastListResponse[]  // 간소화된 응답 사용
  pageable: {
    sort: {
      sorted: boolean
      unsorted: boolean
      empty: boolean
    }
    pageNumber: number
    pageSize: number
    offset: number
    paged: boolean
    unpaged: boolean
  }
  totalElements: number
  totalPages: number
  last: boolean
  first: boolean
  numberOfElements: number
  size: number
  number: number
  sort: {
    sorted: boolean
    unsorted: boolean
    empty: boolean
  }
  empty: boolean
}

// UI에서 사용할 간소화된 주문 타입
export interface Order {
  id: string
  orderNumber: string
  productCategory: string  // orderMastSdivDisplayName
  client: string          // orderMastComname (납품현장명)
  orderDate: string       // orderMastDate
  status: string          // 상태는 별도 로직으로 결정
}

// 주문 상태
export type OrderStatus = '임시저장' | '주문완료' | '출하대기' | '출하완료' | '취소'

// 주문 상세 조회용 타입
export interface OrderDetail {
  id: string
  orderNumber: string
  orderDate: string
  customerOrderNumber?: string
  deliveryType: string
  requiredDate: string
  recipient: string
  deliveryAddress: string
  recipientContact: string
  currency: string
  demandSite: string
  usage: string
  memo?: string
  status: OrderStatus
  products: OrderProduct[]
}

// 주문 제품 타입
export interface OrderProduct {
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
} 