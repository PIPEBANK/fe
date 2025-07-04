import { useState, useEffect } from 'react'
import { Menu, Bell, User, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface HeaderProps {
  onMenuToggle: () => void
}

export default function Header({ onMenuToggle }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)

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
            <h1 className="text-xl font-bold text-custom-primary">
              PIPEBANK
            </h1>
          </div>
        </div>

        {/* 오른쪽: 검색 + 알림 + 사용자 */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <Search className="h-5 w-5" />
          </Button>
          
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-primary rounded-full"></span>
          </Button>

          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
} 