import { useState, useEffect } from 'react'
import { Menu, Bell, User, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface HeaderProps {
  onMenuToggle: () => void
  activeMenu: string
  setActiveMenu: (menu: string) => void
}

export default function Header({ onMenuToggle, activeMenu, setActiveMenu }: HeaderProps) {
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

  const mainMenus = ['주문관리', '출하정보']

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

        {/* 중앙: 메인 네비게이션 */}
        <nav className="hidden md:flex items-center space-x-8">
          {mainMenus.map((menu) => (
            <button
              key={menu}
              onClick={() => setActiveMenu(menu)}
              className={`relative px-2 py-3 text-sm font-medium transition-colors ${
                activeMenu === menu
                  ? 'text-custom-primary'
                  : 'text-custom-secondary hover:text-custom-primary'
              }`}
            >
              {menu}
              {activeMenu === menu && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-primary rounded-full"></div>
              )}
            </button>
          ))}
        </nav>

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

      {/* 모바일 메뉴 */}
      <div className={`md:hidden px-4 py-2 ${
        isScrolled ? 'border-t border-gray-200' : 'border-t border-transparent'
      }`}>
        <nav className="flex space-x-6">
          {mainMenus.map((menu) => (
            <button
              key={menu}
              onClick={() => setActiveMenu(menu)}
              className={`relative px-2 py-2 text-sm font-medium transition-colors ${
                activeMenu === menu
                  ? 'text-custom-primary'
                  : 'text-custom-secondary hover:text-custom-primary'
              }`}
            >
              {menu}
              {activeMenu === menu && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-primary rounded-full"></div>
              )}
            </button>
          ))}
        </nav>
      </div>
    </header>
  )
} 