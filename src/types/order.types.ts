// 주문 관련 타입 정의

// 품목 검색 응답 타입 (백엔드 ItemSearchResponse에 맞는 타입)
export interface ItemSearchResponse {
  itemCode: number        // 품목 코드
  itemNum: string         // 품목번호
  itemName: string        // 품목명
  spec: string            // 규격
  unit: string            // 단위
  saleRate: number        // 판매단가
  stockQuantity: number   // 재고량
  brand: string           // 브랜드
}

// 품목 검색 응답 (Spring Page 구조)
export interface ItemSearchListResponse {
  content: ItemSearchResponse[]
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

// 백엔드 OrderMastListResponse에 맞는 타입 (간소화된 목록용)
export interface OrderMastListResponse {
  orderNumber: string              // 주문번호 (DATE-ACNO)
  orderMastSdiv: string           // 출고형태 코드
  orderMastSdivDisplayName: string // 출고형태명
  orderMastComname: string        // 납품현장명
  orderMastDate: string           // 주문일자
  orderMastCust: number           // 거래처코드
  orderMastStatus: string         // 주문상태 코드
  orderMastStatusDisplayName: string // 주문상태명
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

// UI에서 사용할 간소화된 주문 타입 (백엔드 필드명과 일치)
export interface Order {
  // 백엔드 필드명과 동일
  orderNumber: string                    // 주문번호
  orderMastSdivDisplayName: string       // 출고형태명
  orderMastComname: string               // 납품현장명
  orderMastDate: string                  // 주문일자 (포맷팅된)
  orderMastStatusDisplayName: string     // 주문상태명
  
  // 기존 호환성을 위한 필드들
  id: string                             // orderNumber와 동일
  status: string                         // orderMastStatusDisplayName과 동일 (기존 호환성)
}

// 주문 상태
export type OrderStatus = '임시저장' | '주문완료' | '출하대기' | '출하완료' | '취소'

// 백엔드 API 응답 타입 - 주문 상세조회
export interface OrderDetailResponse {
  // OrderMast 정보
  orderNumber: string                    // 주문번호 (DATE-ACNO)
  orderMastDate: string                  // 주문일자
  orderMastSdiv: string                  // 출고형태 코드
  orderMastSdivDisplayName: string       // 출고형태명
  orderMastOdate: string                 // 도착요구일(납기일자)
  orderMastOtime: string                 // 도착요구시간
  orderMastDcust: string                 // 수요처
  orderMastComaddr: string               // 납품현장주소 (Comaddr1+2 합쳐진 것)
  orderMastComname: string               // 현장명
  orderMastCurrency: string              // 화폐코드
  orderMastCurrencyDisplayName: string   // 화폐코드명
  orderMastCurrencyPer: string           // 환율
  orderMastReason: string                // 용도코드
  orderMastReasonDisplayName: string     // 용도코드명
  orderMastComuname: string              // 인수자
  orderMastComutel: string               // 인수자연락처
  orderMastRemark: string                // 비고
  
  // OrderTran 정보
  orderTranList: OrderTranDetailResponse[]   // 주문 상세 목록
  orderTranTotalAmount: number               // 주문 총금액
}

// 백엔드 API 응답 타입 - 주문 상세 아이템
export interface OrderTranDetailResponse {
  itemCodeNum: string                     // 제품코드 (co_item_code.item_code_num)
  orderTranItem: number                   // 제품번호 (FK - item_code_code)
  orderTranDeta: string                   // 제품명
  orderTranSpec: string                   // 규격
  orderTranUnit: string                   // 단위
  orderTranCnt: number                    // 수량
  orderTranDcPer: number                  // DC(%)
  orderTranAmt: number                    // 단가
  orderTranTot: number                    // 금액
  orderTranStau: string                   // 상태코드
  orderTranStauDisplayName: string        // 상태코드명
}

// UI에서 사용할 주문 상세 타입 (백엔드 필드명과 일치)
export interface OrderDetail {
  // 기본 정보
  orderNumber: string                    // 주문번호
  orderMastDate: string                  // 주문일자 (포맷팅된)
  orderMastSdivDisplayName: string       // 출고형태명
  orderMastOdate: string                 // 도착요구일 (포맷팅된)
  orderMastDcust: string                 // 수요처
  orderMastComaddr: string               // 납품현장주소
  orderMastComname: string               // 현장명
  orderMastCurrency: string              // 화폐/환율 (포맷팅된)
  orderMastReasonDisplayName: string     // 용도코드명
  orderMastComuname: string              // 인수자
  orderMastComutel: string               // 인수자연락처
  orderMastRemark: string                // 비고
  orderTranTotalAmount: string           // 주문총금액 (포맷팅된)
  
  // 기존 호환성을 위한 필드들
  id: string                             // orderNumber와 동일
  status: OrderStatus                    // 상태
  products: OrderProduct[]               // 제품 목록
}

// UI에서 사용할 주문 제품 타입 (기존 유지 - 호환성을 위해)
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

// 백엔드 API 응답 타입 - 출하진행현황
export interface OrderShipmentResponse {
  orderNumber: string                     // 주문번호 (DATE-ACNO)
  shipNumber: string                      // 출하번호
  orderMastDate: string                   // 주문일
  orderMastSdiv: string                   // 출고형태 코드
  orderMastSdivDisplayName: string        // 출고형태명
  orderMastComname: string                // 현장명
  orderMastOdate: string                  // 납품일
  orderMastStatus: string                 // 주문상태 코드 (계산된 값)
  orderMastStatusDisplayName: string      // 주문상태명 (계산된 값)
}

// 출하진행현황 목록 조회 응답 (Spring Page 구조)
export interface ShipmentListResponse {
  content: OrderShipmentResponse[]
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

// 백엔드 API 응답 타입 - 출하번호별 출고현황
export interface ShipmentDetailResponse {
  shipNumber: string            // 출하번호
  itemCodeNum: string          // 제품코드
  shipTranItem: number         // 제품번호 (FK)
  shipTranDeta: string         // 품목명
  shipTranSpec: string         // 규격
  shipTranUnit: string         // 단위
  orderQuantity: number        // 주문량
  shipQuantity: number         // 출고량
  remainQuantity: number       // 주문잔량
  shipTranSeq: number          // 출하순번
}

// 백엔드 API 응답 타입 - 전표번호별 출고전표현황 (개별 항목)
export interface ShipSlipDetailResponse {
  slipNumber: string            // 출고전표번호
  shipTranDate: string         // 출고일
  shipTranDeta: string         // 제품명
  shipTranCnt: number          // 수량
  shipTranRate: number         // 단가
  shipTranTot: number          // 출고금액
  shipTranSeq: number          // 순번 (정렬용)
}

// 백엔드 API 응답 타입 - 전표번호별 출고전표현황 (전체 응답)
export interface ShipSlipResponse {
  slipNumber: string                      // 출고전표번호
  details: ShipSlipDetailResponse[]       // 상세 항목들
  totalQuantity: number                   // 총 수량
  totalRate: number                       // 총 단가
  totalAmount: number                     // 총 출고금액
}

// 백엔드 API 응답 타입 - 거래처별 출고전표 목록
export interface ShipSlipListResponse {
  orderNumber: string           // 주문번호
  shipNumber: string           // 출하번호
  shipMastComname: string      // 현장명
  shipMastDate: string         // 출고일자
  totalAmount: number          // 출고금액
  shipMastAcno: number         // 출하번호 (정렬용)
  customerName: string         // 거래처명 (참고용)
}

// 출고전표 목록 조회 파라미터
export interface ShipSlipListParams {
  shipDate?: string           // 출고일자 (정확히 일치)
  startDate?: string         // 시작 출고일자
  endDate?: string           // 종료 출고일자
  orderNumber?: string       // 주문번호 (부분 검색)
  shipNumber?: string        // 출하번호 (부분 검색)
  comName?: string           // 현장명 (부분 검색)
  page?: number              // 페이지 번호
  size?: number              // 페이지 크기
}

// 출고전표 목록 응답 (페이징)
export interface ShipSlipListPageResponse {
  content: ShipSlipListResponse[]
  pageable: {
    pageNumber: number
    pageSize: number
    sort: {
      empty: boolean
      sorted: boolean
      unsorted: boolean
    }
    offset: number
    paged: boolean
    unpaged: boolean
  }
  last: boolean
  totalElements: number
  totalPages: number
  first: boolean
  size: number
  number: number
  sort: {
    empty: boolean
    sorted: boolean
    unsorted: boolean
  }
  numberOfElements: number
  empty: boolean
}

// UI에서 사용할 출하진행현황 타입 (백엔드 필드명과 일치)
export interface ShippingProgress {
  // 백엔드 필드명과 동일
  orderNumber: string                    // 주문번호
  shipNumber: string                     // 출하번호
  orderMastDate: string                  // 주문일 (포맷팅된)
  orderMastSdivDisplayName: string       // 출고형태명
  orderMastComname: string               // 현장명
  orderMastOdate: string                 // 납품일 (포맷팅된)
  orderMastStatusDisplayName: string     // 주문상태명
  
  // 기존 호환성을 위한 필드들
  id: string                             // shipNumber와 동일 (출하번호 기준으로 변경)
}

// 현장별 출하조회 응답
export interface ShipmentItemResponse {
  shipMastComname: string          // 현장명
  shipNumber: string               // 출하번호
  shipTranDeta: string            // 제품명
  shipTranSpec: string            // 규격
  shipTranUnit: string            // 단위
  shipTranDate: string            // 출고일자 (YYYYMMDD)
  shipTranCnt: number             // 수량
  shipTranTot: number             // 단가
  shipMastCust?: number           // 거래처코드
  shipTranSeq?: number            // ShipTran 순번
}

// 현장별 출하조회 파라미터
export interface ShipmentItemParams {
  shipDate?: string               // 출고일자 (정확히 일치)
  startDate?: string             // 시작 출고일자
  endDate?: string               // 종료 출고일자
  shipNumber?: string            // 출하번호 (부분 검색)
  itemName?: string              // 제품명 (부분 검색)
  comName?: string               // 현장명 (부분 검색)
  page?: number                  // 페이지 번호
  size?: number                  // 페이지 크기
}

// 현장별 출하조회 응답 (페이징)
export interface ShipmentItemPageResponse {
  content: ShipmentItemResponse[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  first: boolean
  last: boolean
} 