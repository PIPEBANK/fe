// 다른 타입 파일에서 import
import type { MemberDetail } from './member.types'

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

export interface AuthContextType {
  isAuthenticated: boolean;
  user: MemberDetail | null;
  token: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  loading: boolean;
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface FindMemberIdRequest {
  memberName: string
  custCodeSano: string
}

export interface FindMemberIdResponse {
  memberId: string
  memberName: string
} 