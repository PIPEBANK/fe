import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, User, LogOut, ChevronDown, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { pipebankLogo } from '@/assets'

interface HeaderProps {
  onMenuToggle: () => void
}

export default function Header({ onMenuToggle }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      const mainContent = document.querySelector('main > div')
      if (mainContent) {
        const scrollTop = mainContent.scrollTop
        setIsScrolled(scrollTop > 0)
      }
    }

    const mainContent = document.querySelector('main > div')
    if (mainContent) {
      mainContent.addEventListener('scroll', handleScroll)
      return () => mainContent.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // 사용자 메뉴 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.user-menu')) {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const handleMyPageClick = () => {
    navigate('/mypage')
    setIsUserMenuOpen(false)
  }

  return (
    <header className={`bg-white border-b border-gray-200 sticky top-0 z-50 transition-all duration-300 ${
      isScrolled ? 'shadow-sm' : ''
    }`}>
      <div className="flex items-center justify-between px-4 h-16">
        {/* 왼쪽: 로고 + 메뉴 버튼 */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuToggle}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-3">
            <a href="/" className="cursor-pointer">
              <img 
                src={pipebankLogo} 
                alt="PIPEBANK" 
                className="h-8 w-auto hover:opacity-80 transition-opacity"
                loading="lazy"
              />
            </a>
          </div>
        </div>

        {/* 오른쪽: 사용자 메뉴 */}
        <div className="flex items-center gap-2">
          {/* 사용자 메뉴 */}
          <div className="relative user-menu">
            <Button 
              variant="ghost" 
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 px-3 py-2"
            >
              <User className="h-5 w-5" />
              <span className="hidden sm:block text-sm font-medium">
                {user?.memberName || '사용자'}
              </span>
              <ChevronDown className="h-4 w-4" />
            </Button>

            {/* 드롭다운 메뉴 */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.memberName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user?.memberId}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user?.role === 'ADMIN' ? '관리자' : '사용자'}
                  </p>
                </div>
                
                <button
                  onClick={handleMyPageClick}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  마이페이지
                </button>
                
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  로그아웃
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
} 