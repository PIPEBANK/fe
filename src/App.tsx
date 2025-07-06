import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MainLayout from '@/components/layout/MainLayout'
import Dashboard from '@/pages/Dashboard'
import About from '@/pages/About'
import OrderList from '@/pages/OrderList'
import OrderForm from '@/pages/OrderForm'
import OrderDetail from '@/pages/OrderDetail'
import ShippingProgress from '@/pages/ShippingProgress'
import ShippingSite from '@/pages/ShippingSite'
import ShippingSlip from '@/pages/ShippingSlip'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="/about" element={<About />} />
          <Route path="/order-list" element={<OrderList />} />
          <Route path="/order-form" element={<OrderForm />} />
          <Route path="/order-detail/:id" element={<OrderDetail />} />
          <Route path="/shipping-progress" element={<ShippingProgress />} />
          <Route path="/shipping-site" element={<ShippingSite />} />
          <Route path="/shipping-slip" element={<ShippingSlip />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
