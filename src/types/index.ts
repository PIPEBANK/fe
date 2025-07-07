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

// 로그인 관련 타입
export interface LoginRequest {
  memberId: string;
  password: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface Member {
  id: number;
  memberId: string;
  memberName: string;
  custCode: string;
  role: MemberRole;
  useYn: boolean;
  createDate: string;
  updateDate?: string;
}

export enum MemberRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: Member | null;
  token: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  loading: boolean;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

// 멤버 상세 정보 (마이페이지용)
export interface MemberDetail {
  id: number;
  memberId: string;
  memberName: string;
  custCode: string;
  custCodeName: string;
  custCodeSano: string;
  custCodeUname1: string;
  custCodeUtel1: string;
  custCodeAddr: string;
  custCodeEmail: string;
  useYn: boolean;
  role: MemberRole;
  roleDescription: string;
  createDate: string;
  createBy: string;
  updateDate?: string;
  updateBy?: string;
}

// 비밀번호 변경 요청
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// 멤버 정보 수정 요청
export interface UpdateMemberRequest {
  memberName?: string;
  custCodeUname1?: string;
  custCodeUtel1?: string;
  custCodeEmail?: string;
} 