import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
import Footer from './Footer'
import { useTokenRefresh } from '@/hooks/useTokenRefresh'

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  // 자동 토큰 갱신 활성화
  useTokenRefresh()

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const closeSidebar = () => {
    setSidebarOpen(false)
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      <Header onMenuToggle={toggleSidebar} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
        
        <main className="flex-1 transition-all duration-300 ease-in-out overflow-hidden">
          <div className="h-full overflow-y-auto">
            <div className="p-6">
              <Outlet />
            </div>
            <Footer />
          </div>
        </main>
      </div>
    </div>
  )
} 