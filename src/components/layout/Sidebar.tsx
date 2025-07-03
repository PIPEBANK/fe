

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  activeMenu: string
}

interface SubMenuItem {
  id: string
  label: string
}

type MenuItems = {
  [key: string]: SubMenuItem[]
}

export default function Sidebar({ isOpen, onClose, activeMenu }: SidebarProps) {
  const allMenuItems: MenuItems = {
    '주문관리': [
      { id: 'order-list', label: '주문서조회' },
      { id: 'order-status', label: '주문현황조회' },
      { id: 'order-register', label: '주문등록' }
    ],
    '출하정보': [
      { id: 'shipping-list', label: '출하조회' },
      { id: 'shipping-status', label: '출하현황' }
    ]
  }

  const currentMenuItems = allMenuItems[activeMenu] || []

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
          <div className="px-1">
            <span className="text-lg font-semibold" style={{color: '#2A3038'}}>{activeMenu}</span>
          </div>
        </div>

        <nav className="flex-1 px-5 py-4 space-y-1 overflow-y-auto">
          {currentMenuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'order-list') {
                  window.location.href = '/order-list'
                }
                onClose()
              }}
              className="w-full flex items-center justify-between text-left px-1 py-3 text-sm font-medium rounded-lg transition-colors hover:bg-gray-100 hover:text-orange-primary"
              style={{color: '#2A3038'}}
            >
              <span>{item.label}</span>
              <span style={{color: '#2A3038'}}>{'>'}</span>
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