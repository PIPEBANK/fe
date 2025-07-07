import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'

export default function ShippingSlip() {
  const [searchParams, setSearchParams] = useState({
    orderNumber: '',
    startDate: '2025-06-01',
    endDate: '2025-07-01'
  })

  // 출고전표현황 샘플 데이터 - 첨부 이미지 기준
  const shippingSlipData = [
    {
      orderNumber: '20250610-11',
      slipNumber: '20250610-21',
      siteName: '(주)동양파이프',
      shippingDate: '2025-06-10',
      amount: 20721
    },
    {
      orderNumber: '20250612-61',
      slipNumber: '20250612-17',
      siteName: '(주)동양파이프',
      shippingDate: '2025-06-12',
      amount: 321750
    },
    {
      orderNumber: '20250516-17',
      slipNumber: '20250616-1',
      siteName: '남양종합배관',
      shippingDate: '2025-06-16',
      amount: 4589287
    },
    {
      orderNumber: '20250616-10',
      slipNumber: '20250616-16',
      siteName: '(주)동양파이프',
      shippingDate: '2025-06-16',
      amount: 40103
    },
    {
      orderNumber: '20250617-21',
      slipNumber: '20250617-16',
      siteName: '(주)동양파이프',
      shippingDate: '2025-06-17',
      amount: 647856
    },
    {
      orderNumber: '20250618-5',
      slipNumber: '20250618-59',
      siteName: '(주)동양파이프',
      shippingDate: '2025-06-18',
      amount: 50266
    },
    {
      orderNumber: '20250618-15',
      slipNumber: '20250618-64',
      siteName: '(주)동양파이프',
      shippingDate: '2025-06-18',
      amount: 63598
    },
    {
      orderNumber: '20250618-5',
      slipNumber: '20250618-65',
      siteName: '(주)동양파이프',
      shippingDate: '2025-06-18',
      amount: 137240
    },
    {
      orderNumber: '20250618-18',
      slipNumber: '20250618-67',
      siteName: '(주)동양파이프',
      shippingDate: '2025-06-18',
      amount: 107954
    },
    {
      orderNumber: '20250623-13',
      slipNumber: '20250623-16',
      siteName: '(주)동양파이프',
      shippingDate: '2025-06-23',
      amount: 53206
    },
    {
      orderNumber: '20250625-17',
      slipNumber: '20250625-25',
      siteName: '(주)동양파이프',
      shippingDate: '2025-06-25',
      amount: 40141
    },
    {
      orderNumber: '20250625-17',
      slipNumber: '20250625-31',
      siteName: '(주)동양파이프',
      shippingDate: '2025-06-25',
      amount: 20634
    },
    {
      orderNumber: '20250630-24',
      slipNumber: '20250630-32',
      siteName: '대신철물 : 신성품 지점',
      shippingDate: '2025-06-30',
      amount: 150437
    },
    {
      orderNumber: '20250701-4',
      slipNumber: '20250701-10',
      siteName: '(주)동양파이프',
      shippingDate: '2025-07-01',
      amount: 6535
    },
    {
      orderNumber: '20250630-39',
      slipNumber: '20250701-8',
      siteName: '(주)동양파이프',
      shippingDate: '2025-07-01',
      amount: 238293
    }
  ]

  const handleSearch = () => {
    // 검색 로직 구현
    console.log('검색 실행:', searchParams)
  }

  const handleExport = () => {
    console.log('엑셀다운')
  }

  const handlePrint = (orderNumber: string) => {
    console.log('프린트:', orderNumber)
  }

  return (
    <div className="space-y-6">
      {/* 브레드크럼 */}
      <div className="flex items-center gap-2 text-sm text-custom-secondary">
        <span>HOME</span>
        <span>{'>'}</span>
        <span>출하정보</span>
        <span>{'>'}</span>
        <span className="text-custom-primary font-medium">출고전표현황</span>
      </div>

      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold" style={{color: '#2A3038'}}>출고전표현황</h1>
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
              출고일자
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
              엑셀다운
            </label>
            <button
              onClick={handleExport}
              className="w-full h-10 px-3 py-2 border border-gray-300 bg-white hover:bg-gray-50 rounded-lg text-sm"
              style={{color: '#2A3038'}}
            >
              📊 엑셀다운
            </button>
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
                  주문서번호
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium" style={{color: '#2A3038'}}>
                  출고전표번호
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium" style={{color: '#2A3038'}}>
                  현장명
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium" style={{color: '#2A3038'}}>
                  출고일자
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium" style={{color: '#2A3038'}}>
                  출고금액
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium" style={{color: '#2A3038'}}>
                  출력
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {shippingSlipData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm" style={{color: '#2A3038'}}>
                    {item.orderNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm" style={{color: '#2A3038'}}>
                    {item.slipNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm" style={{color: '#2A3038'}}>
                    {item.siteName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-custom-secondary">
                    {item.shippingDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm" style={{color: '#2A3038'}}>
                    {item.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handlePrint(item.orderNumber)}
                      className="px-3 py-1 text-xs border border-gray-300 bg-white hover:bg-gray-50 rounded-sm"
                      style={{color: '#2A3038'}}
                    >
                      🖨️ 프린트
                    </button>
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