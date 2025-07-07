import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import MainLayout from '@/components/layout/MainLayout'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import Login from '@/pages/Login'
import About from '@/pages/About'
import OrderList from '@/pages/OrderList'
import OrderForm from '@/pages/OrderForm'
import OrderDetail from '@/pages/OrderDetail'
import ShippingProgress from '@/pages/ShippingProgress'
import ShippingSite from '@/pages/ShippingSite'
import ShippingSlip from '@/pages/ShippingSlip'
import MyPage from '@/pages/MyPage'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* 로그인 페이지 (인증 불필요) */}
          <Route path="/login" element={<Login />} />
          
          {/* 보호된 라우트들 (인증 필요) */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<OrderList />} />
            <Route path="/about" element={<About />} />
            <Route path="/order-list" element={<OrderList />} />
            <Route path="/order-form" element={<OrderForm />} />
            <Route path="/order-detail/:id" element={<OrderDetail />} />
            <Route path="/shipping-progress" element={<ShippingProgress />} />
            <Route path="/shipping-site" element={<ShippingSite />} />
            <Route path="/shipping-slip" element={<ShippingSlip />} />
            <Route path="/mypage" element={<MyPage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
