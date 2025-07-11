import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { MemberRole } from '@/types'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

interface MenuItem {
  id: string
  label: string
  path: string
  adminOnly?: boolean
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [activeMenuItem, setActiveMenuItem] = useState('')
  const { user } = useAuth()

  const menuItems: MenuItem[] = [
    {
      id: 'order-input',
      label: '주문서 입력',
      path: '/order-form',
      adminOnly: false
    },
    {
      id: 'order-list',
      label: '주문서 조회',
      path: '/order-list',
      adminOnly: false
    },
    {
      id: 'temp-order-list',
      label: '임시저장목록',
      path: '/temp-order-list',
      adminOnly: false
    },
    // {
    //   id: 'shipping-progress',
    //   label: '출하 진행현황',
    //   path: '/shipping-progress'
    // },
    // {
    //   id: 'shipping-slip',
    //   label: '출고전표현황',
    //   path: '/shipping-slip'
    // },
    {
      id: 'shipping-site',
      label: '현장별 출하조회',
      path: '/shipping-site',
      adminOnly: false
    },
    {
      id: 'member-list',
      label: '전체사용자조회',
      path: '/member-list',
      adminOnly: true
    },
    {
      id: 'member-create',
      label: '사용자추가',
      path: '/member-create',
      adminOnly: true
    }
  ]

  // 권한에 따라 메뉴 필터링
  const filteredMenuItems = menuItems.filter(item => {
    if (user?.role === MemberRole.ADMIN) {
      // ADMIN은 adminOnly가 true인 메뉴만 보임
      return item.adminOnly === true
    } else {
      // USER는 adminOnly가 false인 메뉴만 보임
      return item.adminOnly === false
    }
  })

  // 현재 경로에 따라 활성 메뉴 설정
  useEffect(() => {
    const currentPath = window.location.pathname
    // 루트 경로(/)인 경우 주문서 조회를 활성화
    if (currentPath === '/') {
      setActiveMenuItem('order-list')
    } else {
      const currentMenuItem = filteredMenuItems.find(item => item.path === currentPath)
      if (currentMenuItem) {
        setActiveMenuItem(currentMenuItem.id)
      }
    }
  }, [user])

  const handleMenuClick = (item: MenuItem) => {
    setActiveMenuItem(item.id)
    window.location.href = item.path
    onClose()
  }

  return (
    <>
      {/* 모바일 오버레이 */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* 사이드바 */}
      <aside className={`
        w-48 bg-white border-r border-gray-200 flex flex-col
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0
        ${isOpen ? 'translate-x-0 fixed top-16 left-0 bottom-0 z-40' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-4 border-b border-gray-200">
          <div className="px-4">
            <span className="text-lg font-semibold text-custom-primary">메뉴</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {filteredMenuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item)}
              className={`
                w-full flex items-center px-4 py-3 text-sm font-medium rounded-sm
                transition-all duration-200 relative
                ${activeMenuItem === item.id
                  ? 'text-custom-primary'
                  : 'text-custom-primary hover:text-orange-primary hover:bg-gray-50'
                }
              `}
              style={{
                backgroundColor: activeMenuItem === item.id ? 'rgba(255, 111, 15, 0.1)' : 'transparent'
              }}
            >
              <span className="flex-1 text-left">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* 하단 정보 */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 mt-auto">
          <div className="text-xs text-custom-icon">
            <div>© 2025 PIPEBANK</div>
            <div className="mt-1">v1.0.0</div>
          </div>
        </div>
      </aside>
    </>
  )
} 