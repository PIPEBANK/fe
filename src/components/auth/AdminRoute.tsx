import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { MemberRole } from '@/types'

interface AdminRouteProps {
  children: ReactNode
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const { isAuthenticated, user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">로딩 중...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (user?.role !== MemberRole.ADMIN) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <div className="text-lg font-semibold text-red-600 mb-2">접근 권한이 없습니다</div>
        <div className="text-gray-600">관리자만 접근할 수 있는 페이지입니다.</div>
      </div>
    )
  }

  return <>{children}</>
} 