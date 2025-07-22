// 임시저장 주문 마스터 생성 요청 타입 (통합 API용)
export interface TempWebOrderMastCreateRequest {
  // 복합키 필드들
  orderMastDate: string
  orderMastSosok: number
  orderMastUjcd: string
  
  // 기본 필드들
  orderMastCust: number
  orderMastScust: number
  orderMastSawon: number
  orderMastSawonBuse: number
  orderMastOdate: string
  orderMastProject: number
  orderMastRemark: string
  orderMastFdate?: string
  orderMastFuser?: string
  orderMastLdate?: string 
  orderMastLuser?: string
  orderMastComaddr1?: string
  orderMastComaddr2?: string
  orderMastComname?: string
  orderMastComuname?: string
  orderMastComutel?: string
  orderMastReason?: string
  orderMastTcomdiv?: string
  orderMastCurrency?: string
  orderMastCurrencyPer?: string
  orderMastSdiv?: string
  orderMastDcust?: string
  orderMastIntype?: string
  orderMastOtime: string
  
  // 임시저장용 필드들
  userId: string
  send?: boolean // 기본값: false (임시저장)
  
  // 통합 API용 - 주문 상세 배열
  orderTrans: TempWebOrderTranCreateRequest[]
}

// 임시저장 주문 마스터 응답 타입
export interface TempWebOrderMastResponse {
  orderMastDate: string
  orderMastSosok: number
  orderMastUjcd: string
  orderMastAcno: number
  orderMastCust: number
  orderMastScust: number
  orderMastSawon: number
  tempOrderId: number
  orderMastSawonBuse: number
  orderMastOdate: string
  orderMastProject: number
  orderMastRemark: string
  orderMastFdate?: string // LocalDateTime -> string으로 변환
  orderMastFuser?: string
  orderMastLdate?: string // LocalDateTime -> string으로 변환
  orderMastLuser?: string
  orderMastComaddr1?: string
  orderMastComaddr2?: string
  orderMastComname?: string
  orderMastComuname?: string
  orderMastComutel?: string
  orderMastReason?: string
  orderMastTcomdiv?: string
  orderMastCurrency?: string
  orderMastCurrencyPer?: string
  orderMastSdiv?: string
  orderMastDcust?: string
  orderMastIntype?: string
  orderMastOtime: string
  userId: string
  send?: boolean
  createdAt?: string // LocalDateTime -> string으로 변환
  updatedAt?: string // LocalDateTime -> string으로 변환
  orderKey?: string
  
  // 통합 조회용 - 주문 상세 배열 (주문번호로 조회 시 포함)
  orderTrans?: TempWebOrderTranResponse[]
}

// 임시저장 주문 상세 생성 요청 타입 (통합 API용)
export interface TempWebOrderTranCreateRequest {
  // 기본 필드들 (복합키는 마스터에서 자동 설정)
  orderTranItemVer?: string
  orderTranItem?: number
  orderTranDeta?: string
  orderTranSpec?: string
  orderTranUnit?: string
  orderTranCalc?: number
  orderTranVdiv?: number
  orderTranAdiv?: number
  orderTranRate?: number
  orderTranCnt?: number
  orderTranConvertWeight?: number
  orderTranDcPer?: number
  orderTranDcAmt?: number
  orderTranForiAmt?: number
  orderTranAmt?: number
  orderTranNet?: number
  orderTranVat?: number
  orderTranAdv?: number
  orderTranTot?: number
  orderTranLrate?: number
  orderTranPrice?: number
  orderTranPrice2?: number
  orderTranLdiv?: number
  orderTranRemark?: string
  orderTranStau?: string
  orderTranFdate?: string
  orderTranFuser?: string
  orderTranLdate?: string
  orderTranLuser?: string
  orderTranWamt?: number
  
  // 임시저장용 필드들
  userId?: string
  send?: boolean // 기본값: false (임시저장)
}

// 임시저장 주문 상세 응답 타입
export interface TempWebOrderTranResponse {
  orderTranDate: string
  orderTranSosok: number
  orderTranUjcd: string
  orderTranAcno: number
  orderTranSeq: number
  orderTranItemVer?: string
  orderTranItem?: number
  itemCodeNum?: string
  orderTranDeta?: string
  orderTranSpec?: string
  orderTranUnit?: string
  orderTranCalc?: number
  orderTranVdiv?: number
  orderTranAdiv?: number
  orderTranRate?: number
  orderTranCnt?: number
  orderTranConvertWeight?: number
  orderTranDcPer?: number
  orderTranDcAmt?: number
  orderTranForiAmt?: number
  orderTranAmt?: number
  orderTranNet?: number
  orderTranVat?: number
  orderTranAdv?: number
  orderTranTot?: number
  orderTranLrate?: number
  orderTranPrice?: number
  orderTranPrice2?: number
  orderTranLdiv?: number
  orderTranRemark?: string
  orderTranStau?: string
  orderTranFdate?: string
  orderTranFuser?: string
  orderTranLdate?: string
  orderTranLuser?: string
  orderTranWamt?: number
  userId?: string
  send?: boolean
  orderTranKey?: string
}

// 복합키 ID 타입들
export interface TempWebOrderMastId {
  orderMastDate: string
  orderMastSosok: number
  orderMastUjcd: string
  orderMastAcno: number
}

export interface TempWebOrderTranId {
  orderTranDate: string
  orderTranSosok: number
  orderTranUjcd: string
  orderTranAcno: number
  orderTranSeq: number
}

// 발송 처리 응답 타입
export interface SendResponse {
  message: string
  orderKey?: string
  orderTranKey?: string
  tempOrder?: TempWebOrderMastResponse
  tempOrderTran?: TempWebOrderTranResponse
}

// 에러 응답 타입
export interface ErrorResponse {
  error: string
} 