import { useEffect, useRef } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { tokenManager } from '@/lib/api'

function decodeJwtExp(token: string): number | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')))
    if (!payload || typeof payload.exp !== 'number') return null
    return payload.exp // seconds since epoch
  } catch {
    return null
  }
}

export const useTokenRefresh = () => {
  const { refreshToken, logout } = useAuth()
  const intervalRef = useRef<number | null>(null)

  useEffect(() => {
    const scheduleRefresh = () => {
      const accessToken = tokenManager.getAccessToken()
      if (!accessToken) return

      const expSec = decodeJwtExp(accessToken)
      if (!expSec) return

      const nowMs = Date.now()
      const expMs = expSec * 1000
      const leadMs = 90 * 1000 // 만료 90초 전 사전 갱신
      const delay = Math.max(1000, expMs - nowMs - leadMs)

      if (intervalRef.current) clearTimeout(intervalRef.current)
      const timeoutId = window.setTimeout(async () => {
        try {
          await refreshToken()
          // 갱신 후 다시 스케줄링
          scheduleRefresh()
        } catch (error) {
          console.error('Auto token refresh failed:', error)
          await logout()
        }
      }, delay)
      intervalRef.current = timeoutId
    }

    scheduleRefresh()

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current)
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