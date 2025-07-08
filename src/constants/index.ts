// API 관련 상수
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },
  MEMBERS: {
    LIST: '/members',
    ME: '/members/me',
    CHANGE_PASSWORD: '/members/me/password',
    UPDATE_ME: '/members/me',
  },
  ORDERS: {
    LIST: '/erp/orders/customer/:custId',
    DETAIL: '/erp/orders/:id',
    DETAIL_BY_ORDER_NUMBER: '/erp/orders/detail/:orderNumber',
    CREATE: '/erp/orders',
    SHIPMENT: '/erp/orders/shipment/customer/:custId',
  },
  SHIPMENTS: {
    DETAIL: '/erp/shipments/detail/:shipNumber',
    SLIP: '/erp/shipments/slip/:slipNumber',
  },
} as const

// 토큰 관련 상수
export const TOKEN_CONFIG = {
  ACCESS_TOKEN_KEY: 'accessToken',
  REFRESH_TOKEN_KEY: 'refreshToken',
  REFRESH_INTERVAL: 20 * 60 * 1000, // 20분
} as const

// 페이지 경로 상수
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  ORDER_LIST: '/order-list',
  ORDER_FORM: '/order-form',
  ORDER_DETAIL: '/order-detail',
  SHIPPING_PROGRESS: '/shipping-progress',
  SHIPPING_SITE: '/shipping-site',
  SHIPPING_SLIP: '/shipping-slip',
  MYPAGE: '/mypage',
} as const

// 기타 상수
export const APP_CONFIG = {
  APP_NAME: 'PIPEBANK',
  VERSION: '1.0.0',
  API_TIMEOUT: 10000,
} as const 