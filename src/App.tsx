import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MainLayout from '@/components/layout/MainLayout'
import Dashboard from '@/pages/Dashboard'
import About from '@/pages/About'
import OrderList from '@/pages/OrderList'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="/about" element={<About />} />
          <Route path="/order-list" element={<OrderList />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
