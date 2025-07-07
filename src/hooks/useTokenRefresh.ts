import { useEffect, useRef } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { tokenManager } from '@/lib/api'

export const useTokenRefresh = () => {
  const { refreshToken, logout } = useAuth()
  const intervalRef = useRef<number | null>(null)

  useEffect(() => {
    const startTokenRefresh = () => {
      // 토큰이 있을 때만 갱신 스케줄링
      const accessToken = tokenManager.getAccessToken()
      if (!accessToken) return

      // 20분마다 토큰 갱신 시도 (토큰 만료 4분 전)
      intervalRef.current = setInterval(async () => {
        try {
          await refreshToken()
        } catch (error) {
          console.error('Auto token refresh failed:', error)
          // 갱신 실패 시 로그아웃
          await logout()
        }
      }, 20 * 60 * 1000) // 20분
    }

    startTokenRefresh()

    // 컴포넌트 언마운트 시 인터벌 정리
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [refreshToken, logout])

  // 수동 토큰 갱신
  const manualRefresh = async () => {
    try {
      await refreshToken()
      return true
    } catch (error) {
      console.error('Manual token refresh failed:', error)
      return false
    }
  }

  return { manualRefresh }
} 