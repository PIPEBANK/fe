import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { MemberRole } from '@/types'

export default function RoleBasedRedirect() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && user) {
      if (user.role === MemberRole.ADMIN) {
        navigate('/member-list', { replace: true })
      } else {
        navigate('/order-list', { replace: true })
      }
    }
  }, [user, loading, navigate])

  // 로딩 중이거나 리다이렉트 중일 때 표시할 내용
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">로딩 중...</div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-lg">페이지를 불러오는 중...</div>
    </div>
  )
} 