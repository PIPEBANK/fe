// API 응답 타입
export interface ApiResponse<T = unknown> {
  data: T
  message?: string
  success: boolean
}

// 사용자 타입
export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  createdAt: string
  updatedAt: string
}

// 페이지네이션 타입
export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

// 공통 ID 타입
export type ID = string | number 

// API 에러 타입
export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

// 인증 관련 타입들 re-export
export * from './auth.types'

// 회원 관련 타입들 re-export  
export * from './member.types'

// 도메인별 타입 re-export
export * from './order.types'

// 임시저장 주문 관련 타입들 re-export
export * from './tempOrder.types'

// ===========================================
// 아래는 UI/UX 작업용 하드코딩 타입들 (추후 정리 예정)
// ===========================================

// 주문서 작성 관련 타입
export interface OrderFormData {
  // 기본 정보
  customerNumber: string
  orderNumber: string
  orderDate: string
  requiredDate: string
  
  // 출고 정보
  deliveryType: string
  usage: string
  recipient: string
  recipientContact: string
  
  // 납품 현장
  deliveryAddress: string
  postalCode: string
  detailAddress: string
  
  // 기타 정보
  demandSite: string  // 수요처
  siteName: string    // 현장명
  currency: string
  exchangeRate: number
  memo: string
  
  // 제품 목록
  products: OrderProduct[]
}

export interface OrderProduct {
  id: string
  productCode: string
  productName: string
  specification: string
  quantity: number
  unit: string
  selected?: boolean
  discount?: number
  unitPrice?: number
  totalPrice?: number
  status?: string
}

// 제품 검색 관련
export interface ProductSearchParams {
  keyword: string
  category?: string
  page: number
  limit: number
}

export interface ProductSearchResult {
  products: OrderProduct[]
  pagination: Pagination
}

// 제품 분류 관련
export interface ProductCategory {
  id: string;
  name: string;
}

export interface ProductSubCategory {
  id: string;
  categoryId: string;
  name: string;
}

export interface ProductSpecification {
  id: string;
  subCategoryId: string;
  name: string;
  price?: number;
}

// 주문서 상태
export type OrderStatus = '임시저장' | '주문완료' | '출하대기' | '출하완료' | '취소'

// 출고 형태 옵션
// DeliveryType은 이제 공통코드 API에서 동적으로 로드됩니다

// 화폐 옵션
export type Currency = '한국(KRW)' | '미국(USD)' | '일본(JPY)' | '중국(CNY)'

// 제품 관련 타입들 (하드코딩)
export interface Product {
  id: string
  productCode: string
  productName: string
  specification: string
  unit: string
  unitPrice: number
  category: string
  subcategory: string
  description?: string
  imageUrl?: string
  inStock: boolean
  stockQuantity: number
  minOrderQuantity: number
  leadTime: string
  manufacturer: string
  origin: string
  weight?: number
  dimensions?: string
  certifications?: string[]
  relatedProducts?: string[]
  tags?: string[]
}

export interface ProductSearchResponse {
  products: Product[]
  totalCount: number
  totalPages: number
  currentPage: number
  categories: string[]
  subcategories: string[]
  priceRange: {
    min: number
    max: number
  }
}

// 배송 관련 타입
export interface DeliveryInfo {
  type: string
  address: string
  detailAddress?: string
  postalCode?: string
  recipient: string
  phone: string
  requestDate: string
  memo?: string
}

// 고객 관련 타입
export interface Customer {
  id: string
  customerNumber: string
  companyName: string
  businessNumber: string
  address: string
  phone: string
  email: string
  contactPerson: string
  contactPhone: string
  contactEmail: string
  creditLimit: number
  paymentTerms: string
  discountRate: number
  status: 'active' | 'inactive' | 'suspended'
  registrationDate: string
  lastOrderDate?: string
  totalOrderAmount: number
  notes?: string
} 

// 공통코드 타입
export interface CommonCode3Response {
  commCod3Cod1: string;
  commCod3Cod2: string;
  commCod3Cod3: string;
  commCod3Code: string;
  commCod3Num: string;
  commCod3Word: string;
  commCod3Hnam: string;
  commCod3Enam: string;
  commCod3Hsub: string;
  commCod3Esub: string;
  commCod3Sort: number;
  commCod3View: number;
  commCod3Use: number;
  commCod3Remark: string;
  commCod3Fdate: string;
  commCod3Fuser: string;
  commCod3Ldate: string;
  commCod3Luser: string;
  active: boolean;
  visible: boolean;
  fullCode: string;
  displayName: string;
  hangulName: string;
  englishName: string;
  hangulSub: string;
  englishSub: string;
} 

// 계층형 품목선택 API 응답 타입들
export interface ItemDiv1Response {
  code: string;        // 제품종류 코드 (1자리)
  name: string;        // 제품종류명
  isActive: boolean;   // 사용여부
}

export interface ItemDiv2Response {
  div1: string;        // 제품종류 코드 (상위)
  code: string;        // 제품군 코드 (1자리)
  name: string;        // 제품군명
  isActive: boolean;   // 사용여부
  fullCode: string;    // 전체 코드 (div1 + code)
}

export interface ItemDiv3Response {
  div1: string;        // 제품종류 코드 (상위)
  div2: string;        // 제품군 코드 (상위)
  code: string;        // 제품용도 코드 (2자리)
  name: string;        // 제품용도명
  isActive: boolean;   // 사용여부
  fullCode: string;    // 전체 코드 (div1 + div2 + code)
}

export interface ItemDiv4Response {
  div1: string;        // 제품종류 코드 (상위)
  div2: string;        // 제품군 코드 (상위)
  div3: string;        // 제품용도 코드 (상위)
  code: string;        // 제품기능 코드 (2자리)
  name: string;        // 제품기능명
  isActive: boolean;   // 사용여부
  isOrderable: boolean; // 오더센터 사용여부
  fullCode: string;    // 전체 코드 (div1 + div2 + div3 + code)
}

export interface ItemSelectionResponse {
  itemCode: number;       // 품목 코드
  itemNum: string;        // 품목번호
  itemName: string;       // 품목명
  spec: string;           // 규격
  spec2: number;          // 규격2 (표준중량)
  unit: string;           // 단위
  saleRate: number;       // 판매단가
  stockQuantity: number;  // 재고량
  brand: string;          // 브랜드
  isActive: boolean;      // 사용여부
  isOrderable: boolean;   // 주문가능여부
  
  // 분류 정보
  div1: string;           // 제품종류 코드
  div2: string;           // 제품군 코드
  div3: string;           // 제품용도 코드
  div4: string;           // 제품기능 코드
  div1Name: string;       // 제품종류명
  div2Name: string;       // 제품군명
  div3Name: string;       // 제품용도명
  div4Name: string;       // 제품기능명
}

// Spring Page 구조 (최종 품목 조회용)
export interface ItemSelectionPageResponse {
  content: ItemSelectionResponse[];
  pageable: {
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    pageNumber: number;
    pageSize: number;
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  numberOfElements: number;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  empty: boolean;
} 