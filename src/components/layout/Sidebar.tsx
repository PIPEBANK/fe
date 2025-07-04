import { useState } from 'react'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

interface MenuItem {
  id: string
  label: string
  path: string
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [activeMenuItem, setActiveMenuItem] = useState('order-list')

  const menuItems: MenuItem[] = [
    {
      id: 'order-input',
      label: '주문서 입력',
      path: '/order-input'
    },
    {
      id: 'order-list',
      label: '주문서 조회',
      path: '/order-list'
    },
    {
      id: 'shipping-progress',
      label: '출하 진행현황',
      path: '/shipping-progress'
    },
    {
      id: 'shipping-site',
      label: '현장별 출하조회',
      path: '/shipping-site'
    }
  ]

  const handleMenuClick = (item: MenuItem) => {
    setActiveMenuItem(item.id)
    if (item.path === '/order-list') {
      window.location.href = '/order-list'
    }
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
          {menuItems.map((item) => (
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
                backgroundColor: activeMenuItem === item.id ? 'rgba(255, 203, 100, 0.2)' : 'transparent'
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