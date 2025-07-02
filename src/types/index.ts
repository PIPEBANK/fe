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