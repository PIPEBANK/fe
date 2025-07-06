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
export type DeliveryType = '일반판매' | '직송' | '픽업' | '기타'

// 화폐 옵션
export type Currency = '한국(KRW)' | '미국(USD)' | '일본(JPY)' | '중국(CNY)' 