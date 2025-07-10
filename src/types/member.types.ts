// 회원 역할 타입
export enum MemberRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

// 기본 회원 정보
export interface Member {
  id: number;
  memberId: string;
  memberName: string;
  custCode: string;
  custCodeName?: string;
  role: MemberRole;
  useYn: boolean;
  createDate: string;
  updateDate?: string;
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
  custCodeSawon: string; // 담당자 코드
  custCodeBuse: string;  // 담당자부서 코드
  useYn: boolean;
  role: MemberRole;
  roleDescription: string;
  createDate: string;
  createBy: string;
  updateDate?: string;
  updateBy?: string;
}

// 멤버 응답 타입 (관리자 조회용)
export interface MemberResponse {
  id: number;
  memberId: string;
  memberName: string;
  custCode: string;
  custCodeName: string;
  custCodeSano: string;     // 사업자번호
  custCodeUname1: string;   // 담당자명
  custCodeUtel1: string;    // 담당자 전화번호
  custCodeAddr: string;     // 주소
  custCodeEmail: string;    // 이메일
  custCodeSawon: number;    // 담당 사원번호
  custCodeBuse: number;     // 담당 부서번호
  useYn: boolean;
  role: MemberRole;
  roleDescription: string;
  createDate: string;
  createBy: string;
  updateDate?: string;
  updateBy?: string;
}

// 페이지네이션 관련 타입
export interface PageInfo {
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface PageResponse<T> {
  content: T[];
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
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  numberOfElements: number;
  empty: boolean;
}

// 멤버 검색 파라미터
export interface MemberSearchParams {
  memberId?: string;
  memberName?: string;
  custCodeName?: string;
  role?: MemberRole;
  useYn?: boolean;
  page?: number;
  size?: number;
  sort?: string;
  direction?: string;
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