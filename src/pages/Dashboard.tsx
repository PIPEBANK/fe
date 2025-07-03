import { Button } from '@/components/ui/button'
import { FileText, Package, Truck, TrendingUp, Calendar, Clock } from 'lucide-react'

export default function Dashboard() {
  const stats = [
    {
      title: '총 주문건수',
      value: '1,234',
      change: '+12.5%',
      changeType: 'increase' as const,
      icon: <FileText className="w-5 h-5" />
    },
    {
      title: '출하대기',
      value: '45',
      change: '-5.2%',
      changeType: 'decrease' as const,
      icon: <Package className="w-5 h-5" />
    },
    {
      title: '출하완료',
      value: '892',
      change: '+8.1%',
      changeType: 'increase' as const,
      icon: <Truck className="w-5 h-5" />
    },
    {
      title: '월 매출',
      value: '₩2.4억',
      change: '+15.3%',
      changeType: 'increase' as const,
      icon: <TrendingUp className="w-5 h-5" />
    }
  ]

  const recentOrders = [
    { id: '20250701-1', company: '동양파이프', product: '스테인리스 파이프', status: '출하완료', date: '2025-07-01' },
    { id: '20250630-39', company: '한국철강', product: '일반강관', status: '출하대기', date: '2025-06-30' },
    { id: '20250630-24', company: '대신철물', product: '신성품', status: '출하완료', date: '2025-06-30' },
    { id: '20250625-17', company: '동양파이프', product: '일반강관', status: '출하완료', date: '2025-06-25' }
  ]

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-custom-primary">대시보드</h1>
          <p className="text-custom-secondary">거래처 주문 및 출하 현황을 확인하세요</p>
        </div>
                  <div className="flex items-center gap-2 text-sm text-custom-icon">
            <Calendar className="w-4 h-4" />
            <span>2025년 7월 1일</span>
            <Clock className="w-4 h-4 ml-2" />
            <span>14:30</span>
          </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 card-shadow">
            <div className="flex items-center justify-between">
              <div className="text-custom-icon">{stat.icon}</div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                stat.changeType === 'increase' 
                  ? 'text-green-700 bg-green-100' 
                  : 'text-red-700 bg-red-100'
              }`}>
                {stat.change}
              </span>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-bold text-custom-primary">{stat.value}</div>
              <div className="text-sm text-custom-secondary">{stat.title}</div>
            </div>
          </div>
        ))}
      </div>

      {/* 최근 주문 내역 */}
      <div className="bg-white rounded-xl card-shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-custom-primary">최근 주문 내역</h2>
            <Button variant="outline" size="sm">
              전체보기
            </Button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-custom-icon uppercase tracking-wider">
                  주문번호
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-custom-icon uppercase tracking-wider">
                  거래처
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-custom-icon uppercase tracking-wider">
                  제품명
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-custom-icon uppercase tracking-wider">
                  상태
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-custom-icon uppercase tracking-wider">
                  주문일시
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-custom-primary">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-custom-primary">
                    {order.company}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-custom-primary">
                    {order.product}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      order.status === '출하완료' 
                        ? 'text-green-700 bg-green-100' 
                        : 'text-orange-700 bg-orange-100'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-custom-secondary">
                    {order.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 퀵 액션 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 card-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-orange-primary bg-opacity-10 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-orange-primary" />
            </div>
            <h3 className="font-semibold text-custom-primary">주문서 조회</h3>
          </div>
          <p className="text-sm text-custom-secondary mb-4">주문 내역을 확인하고 상태를 추적하세요</p>
          <Button className="w-full">조회하기</Button>
        </div>

        <div className="bg-white rounded-xl p-6 card-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-orange-primary bg-opacity-10 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-orange-primary" />
            </div>
            <h3 className="font-semibold text-custom-primary">새 주문 등록</h3>
          </div>
          <p className="text-sm text-custom-secondary mb-4">새로운 주문을 빠르게 등록하세요</p>
          <Button className="w-full">등록하기</Button>
        </div>

        <div className="bg-white rounded-xl p-6 card-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-orange-primary bg-opacity-10 rounded-lg flex items-center justify-center">
              <Truck className="w-5 h-5 text-orange-primary" />
            </div>
            <h3 className="font-semibold text-custom-primary">출하 현황</h3>
          </div>
          <p className="text-sm text-custom-secondary mb-4">출하 진행 상황을 실시간으로 확인하세요</p>
          <Button className="w-full">확인하기</Button>
        </div>
      </div>
    </div>
  )
} 