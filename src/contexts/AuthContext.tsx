import React, { createContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { tokenManager } from '@/lib/api'
import { authService } from '@/services'
import type { AuthContextType, LoginRequest, Member } from '@/types'

// Context 생성
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [user, setUser] = useState<Member | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  // 초기 인증 상태 확인
  useEffect(() => {
    const initAuth = async () => {
      const accessToken = tokenManager.getAccessToken()
      
      if (accessToken) {
        try {
          const profile = await authService.getProfile()
          setUser(profile)
          setToken(accessToken)
          setIsAuthenticated(true)
        } catch (error) {
          console.error('Failed to load user profile:', error)
          tokenManager.clearTokens()
          setIsAuthenticated(false)
          setUser(null)
          setToken(null)
        }
      }
      
      setLoading(false)
    }

    initAuth()
  }, [])

  const login = async (credentials: LoginRequest): Promise<void> => {
    try {
      setLoading(true)
      const tokenResponse = await authService.login(credentials)
      
      // 토큰 저장
      tokenManager.setTokens(tokenResponse.accessToken, tokenResponse.refreshToken)
      
      // 사용자 프로필 로드
      const profile = await authService.getProfile()
      
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
      const refreshToken = tokenManager.getRefreshToken()
      if (refreshToken) {
        await authService.logout(refreshToken)
      }
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      // 로컬 상태 초기화
      tokenManager.clearTokens()
      setUser(null)
      setToken(null)
      setIsAuthenticated(false)
    }
  }

  const refreshToken = async (): Promise<void> => {
    try {
      const currentRefreshToken = tokenManager.getRefreshToken()
      if (!currentRefreshToken) {
        throw new Error('No refresh token available')
      }
      
      const tokenResponse = await authService.refreshToken(currentRefreshToken)
      tokenManager.setTokens(tokenResponse.accessToken, tokenResponse.refreshToken)
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

 