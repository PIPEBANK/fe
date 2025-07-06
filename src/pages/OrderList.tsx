import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'

export default function OrderList() {
  const [searchParams, setSearchParams] = useState({
    orderNumber: '',
    startDate: '2025-06-01',
    endDate: '2025-07-01',
    status: ''
  })

  // 샘플 데이터 - 첨부 이미지와 동일한 내용
  const orderData = [
    {
      orderNumber: '20250701-4',
      modifiedOrderNumber: '20250701-1',
      productCategory: '일반판매',
      client: '(주)동양파이프',
      orderDate: '2025-07-01',
      status: '출하완료'
    },
    {
      orderNumber: '20250630-39',
      modifiedOrderNumber: '-',
      productCategory: '일반판매',
      client: '(주)동양파이프',
      orderDate: '2025-06-30',
      status: '출하완료'
    },
    {
      orderNumber: '20250630-24',
      modifiedOrderNumber: '-',
      productCategory: '일반판매',
      client: '대신철물 : 신성품 지점',
      orderDate: '2025-06-30',
      status: '수주진행'
    },
    {
      orderNumber: '20250625-17',
      modifiedOrderNumber: '-',
      productCategory: '일반판매',
      client: '(주)동양파이프',
      orderDate: '2025-06-25',
      status: '출하완료'
    },
    {
      orderNumber: '20250623-13',
      modifiedOrderNumber: '-',
      productCategory: '일반판매',
      client: '(주)동양파이프',
      orderDate: '2025-06-23',
      status: '출하대기'
    },
    {
      orderNumber: '20250618-18',
      modifiedOrderNumber: '-',
      productCategory: '일반판매',
      client: '(주)동양파이프',
      orderDate: '2025-06-18',
      status: '출하완료'
    },
    {
      orderNumber: '20250618-15',
      modifiedOrderNumber: '-',
      productCategory: '일반판매',
      client: '(주)동양파이프',
      orderDate: '2025-06-18',
      status: '수주진행'
    },
    {
      orderNumber: '20250618-5',
      modifiedOrderNumber: '-',
      productCategory: '일반판매',
      client: '(주)동양파이프',
      orderDate: '2025-06-18',
      status: '출하완료'
    },
    {
      orderNumber: '20250617-21',
      modifiedOrderNumber: '-',
      productCategory: '일반판매',
      client: '(주)동양파이프',
      orderDate: '2025-06-17',
      status: '출하대기'
    },
    {
      orderNumber: '20250616-10',
      modifiedOrderNumber: '-',
      productCategory: '일반판매',
      client: '(주)동양파이프',
      orderDate: '2025-06-16',
      status: '출하완료'
    },
    {
      orderNumber: '20250612-61',
      modifiedOrderNumber: '-',
      productCategory: '일반판매',
      client: '(주)동양파이프',
      orderDate: '2025-06-12',
      status: '수주진행'
    },
    {
      orderNumber: '20250610-11',
      modifiedOrderNumber: '-',
      productCategory: '일반판매',
      client: '(주)동양파이프',
      orderDate: '2025-06-10',
      status: '출하완료'
    },
    {
      orderNumber: '20250605-12',
      modifiedOrderNumber: '-',
      productCategory: '일반판매',
      client: '(주)동양파이프',
      orderDate: '2025-06-05',
      status: '출하대기'
    },
    {
      orderNumber: '20250605-6',
      modifiedOrderNumber: '-',
      productCategory: '일반판매',
      client: '(주)동양파이프',
      orderDate: '2025-06-05',
      status: '출하완료'
    },
    {
      orderNumber: '20250604-13',
      modifiedOrderNumber: '-',
      productCategory: '일반판매',
      client: '(주)충남연탄공장 출고분',
      orderDate: '2025-06-04',
      status: '수주진행'
    },
    {
      orderNumber: '20250604-11',
      modifiedOrderNumber: '-',
      productCategory: '일반판매',
      client: '동양파이프 대전분',
      orderDate: '2025-06-04',
      status: '출하완료'
    }
  ]

  // 상태 옵션
  const statusOptions = [
    { value: '', label: '전체' },
    { value: '출하완료', label: '출하완료' },
    { value: '수주진행', label: '수주진행' },
    { value: '출하대기', label: '출하대기' }
  ]

  const handleSearch = () => {
    // 검색 로직 구현
    console.log('검색 실행:', searchParams)
  }

  const getStatusBadge = (status: string) => {
    return (
      <span className="text-sm font-medium" style={{color: '#FF6F0F'}}>
        {status}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      {/* 브레드크럼 */}
      <div className="flex items-center gap-2 text-sm text-custom-secondary">
        <span>HOME</span>
        <span>{'>'}</span>
        <span>주문관리</span>
        <span>{'>'}</span>
        <span className="text-custom-primary font-medium">주문서조회</span>
      </div>

      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold" style={{color: '#2A3038'}}>주문서조회</h1>
      </div>

      {/* 검색 영역 */}
      <div className="bg-white rounded-xl p-6 card-shadow border-t-4 border-orange-primary">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium mb-2" style={{color: '#2A3038'}}>
              주문번호
            </label>
            <input
              type="text"
              value={searchParams.orderNumber}
              onChange={(e) => setSearchParams({...searchParams, orderNumber: e.target.value})}
              className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-primary focus:border-transparent"
              placeholder="주문번호 입력"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2" style={{color: '#2A3038'}}>
              주문일자
            </label>
            <input
              type="date"
              value={searchParams.startDate}
              onChange={(e) => setSearchParams({...searchParams, startDate: e.target.value})}
              className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-primary focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-transparent">
              ~
            </label>
            <input
              type="date"
              value={searchParams.endDate}
              onChange={(e) => setSearchParams({...searchParams, endDate: e.target.value})}
              className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{color: '#2A3038'}}>
              상태
            </label>
            <select
              value={searchParams.status}
              onChange={(e) => setSearchParams({...searchParams, status: e.target.value})}
              className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-primary focus:border-transparent bg-white"
              style={{color: '#2A3038'}}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <Button onClick={handleSearch} className="bg-orange-primary hover:bg-orange-light h-10">
            <Search className="w-4 h-4 mr-2" />
            검색
          </Button>
        </div>
      </div>

      {/* 테이블 영역 */}
      <div className="bg-white rounded-xl card-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium" style={{color: '#2A3038'}}>
                  주문번호
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium" style={{color: '#2A3038'}}>
                  고객주문번호
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium" style={{color: '#2A3038'}}>
                  출고형태
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium" style={{color: '#2A3038'}}>
                  납품현장
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium" style={{color: '#2A3038'}}>
                  주문일자
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium" style={{color: '#2A3038'}}>
                  상태
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orderData.map((order, index) => (
                <tr key={index} className="hover:bg-gray-50 cursor-pointer">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <a 
                      href={`/order-detail/${order.orderNumber}`}
                      className="text-sm font-medium hover:underline cursor-pointer" 
                      style={{color: '#2A3038'}}
                    >
                      {order.orderNumber}
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm" style={{color: '#2A3038'}}>
                    {order.modifiedOrderNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm" style={{color: '#2A3038'}}>
                    {order.productCategory}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm" style={{color: '#2A3038'}}>
                    {order.client}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-custom-secondary">
                    {order.orderDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(order.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 