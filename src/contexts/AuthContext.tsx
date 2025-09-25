import React, { createContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { tokenManager } from '@/lib/api'
import { authService } from '@/services'
import { MemberService } from '@/services/member.service'
import type { AuthContextType, LoginRequest, MemberDetail } from '@/types'

// Context 생성
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [user, setUser] = useState<MemberDetail | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  // 초기 인증 상태 확인
  useEffect(() => {
    const initAuth = async () => {
      const accessToken = tokenManager.getAccessToken()
      
      try {
        if (accessToken) {
          // 토큰이 있으면 바로 프로필 로드
          const profile = await MemberService.getMyProfile()
          setUser(profile)
          setToken(accessToken)
          setIsAuthenticated(true)
        }
      } catch {
        // 조용히 실패 처리: 로그인 필요 상태 유지
        tokenManager.clearTokens()
        setIsAuthenticated(false)
        setUser(null)
        setToken(null)
      }
      
      setLoading(false)
    }

    initAuth()
  }, [])

  const login = async (credentials: LoginRequest): Promise<void> => {
    try {
      setLoading(true)
      const tokenResponse = await authService.login(credentials)
      
      // accessToken만 저장 (refresh는 httpOnly 쿠키)
      tokenManager.setAccessToken(tokenResponse.accessToken)
      try { 
        sessionStorage.removeItem('authRedirected'); 
        sessionStorage.removeItem('authExpiredNotified'); 
      } catch { 
        console.debug('Skip clearing session flags') 
      }
      
      // 사용자 프로필 로드
      const profile = await MemberService.getMyProfile()
      
      // localStorage에 사용자 정보 저장
      localStorage.setItem('user', JSON.stringify(profile))
      
      setUser(profile)
      setToken(tokenResponse.accessToken)
      setIsAuthenticated(true)
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async (): Promise<void> => {
    try {
      await authService.logout()
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      // 로컬 상태 초기화
      tokenManager.clearTokens()
      localStorage.removeItem('user')
      setUser(null)
      setToken(null)
      setIsAuthenticated(false)
    }
  }

  const refreshToken = async (): Promise<void> => {
    try {
      const tokenResponse = await authService.refreshToken()
      tokenManager.setAccessToken(tokenResponse.accessToken)
      setToken(tokenResponse.accessToken)
    } catch (error) {
      console.error('Token refresh failed:', error)
      await logout()
      throw error
    }
  }

  const value: AuthContextType = {
    isAuthenticated,
    user,
    token,
    login,
    logout,
    refreshToken,
    loading
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

 