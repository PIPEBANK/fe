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