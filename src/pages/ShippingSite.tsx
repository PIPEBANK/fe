import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'

export default function ShippingSite() {
  const [searchParams, setSearchParams] = useState({
    siteName: '',
    startDate: '2025-06-01',
    endDate: '2025-07-01'
  })

  // 현장별 출하조회 샘플 데이터 - 첨부 이미지 기준
  const siteShippingData = [
    {
      site: '(주)동양파이프',
      orderNumber: '20250610-21',
      productName: '수도캡(신KS,사출,PE100)',
      specification: '1~90',
      unit: 'ea',
      shippingDate: '2025-06-10',
      quantity: 3,
      unitPrice: 20721
    },
    {
      site: '(주)동양파이프',
      orderNumber: '20250612-17',
      productName: '수도(SUS)T/F(S)(상품)',
      specification: '50',
      unit: 'ea',
      shippingDate: '2025-06-12',
      quantity: 4,
      unitPrice: 226354
    },
    {
      site: '(주)동양파이프',
      orderNumber: '20250612-17',
      productName: '수도(SUS)T/F(S)(상품)',
      specification: '30',
      unit: 'ea',
      shippingDate: '2025-06-12',
      quantity: 3,
      unitPrice: 95396
    },
    {
      site: '(주)동양파이프',
      orderNumber: '20250616-16',
      productName: '수도정티이(신KS,사출,PE100)',
      specification: '1~90',
      unit: 'ea',
      shippingDate: '2025-06-16',
      quantity: 2,
      unitPrice: 27999
    },
    {
      site: '(주)동양파이프',
      orderNumber: '20250616-16',
      productName: '수도이경티이(신KS,사출,PE100)',
      specification: '1~63X1~32',
      unit: 'ea',
      shippingDate: '2025-06-16',
      quantity: 1,
      unitPrice: 12104
    },
    {
      site: '(주)동양파이프',
      orderNumber: '20250617-16',
      productName: '수도전기융착식소켓(신KS)(상품)',
      specification: '315',
      unit: 'ea',
      shippingDate: '2025-06-17',
      quantity: 3,
      unitPrice: 411721
    },
    {
      site: '(주)동양파이프',
      orderNumber: '20250617-16',
      productName: '수도90엘보(신KS,가공,PE100)',
      specification: '1~315(S,가공)',
      unit: 'ea',
      shippingDate: '2025-06-17',
      quantity: 2,
      unitPrice: 236135
    },
    {
      site: '(주)동양파이프',
      orderNumber: '20250618-59',
      productName: '수도전기융착식90엘보(신KS)(상품)',
      specification: '90',
      unit: 'ea',
      shippingDate: '2025-06-18',
      quantity: 2,
      unitPrice: 50266
    },
    {
      site: '(주)동양파이프',
      orderNumber: '20250618-64',
      productName: '수도(SUS)T/F(S)(상품)',
      specification: '30',
      unit: 'ea',
      shippingDate: '2025-06-18',
      quantity: 2,
      unitPrice: 63598
    },
    {
      site: '(주)동양파이프',
      orderNumber: '20250618-65',
      productName: '수도전기융착식소켓(신KS)(상품)',
      specification: '315',
      unit: 'ea',
      shippingDate: '2025-06-18',
      quantity: 1,
      unitPrice: 137240
    },
    {
      site: '(주)동양파이프',
      orderNumber: '20250618-67',
      productName: '수도90엘보(사출)',
      specification: '1~40',
      unit: 'ea',
      shippingDate: '2025-06-18',
      quantity: 20,
      unitPrice: 107954
    },
    {
      site: '(주)동양파이프',
      orderNumber: '20250623-16',
      productName: '수도캡(DD)(신KS,상품,PE100)',
      specification: '63(S)',
      unit: 'ea',
      shippingDate: '2025-06-23',
      quantity: 8,
      unitPrice: 38667
    },
    {
      site: '(주)동양파이프',
      orderNumber: '20250623-16',
      productName: '수도캡(신KS,사출,PE100)',
      specification: '1~110',
      unit: 'ea',
      shippingDate: '2025-06-23',
      quantity: 1,
      unitPrice: 10689
    },
    {
      site: '(주)동양파이프',
      orderNumber: '20250623-16',
      productName: '운반비',
      specification: '운반비',
      unit: 'ea',
      shippingDate: '2025-06-23',
      quantity: 1,
      unitPrice: 3850
    },
    {
      site: '(주)동양파이프',
      orderNumber: '20250625-25',
      productName: '수도관(PE100)',
      specification: '20',
      unit: '6m',
      shippingDate: '2025-06-25',
      quantity: 2,
      unitPrice: 7775
    },
    {
      site: '(주)동양파이프',
      orderNumber: '20250625-25',
      productName: '수도관(PE100)',
      specification: '50',
      unit: '6m',
      shippingDate: '2025-06-25',
      quantity: 2,
      unitPrice: 32366
    },
    {
      site: '(주)동양파이프',
      orderNumber: '20250625-31',
      productName: '수도45엘보(사출,B)',
      specification: '1~75(B)',
      unit: 'ea',
      shippingDate: '2025-06-25',
      quantity: 2,
      unitPrice: 20634
    },
    {
      site: '(주)동양파이프',
      orderNumber: '20250701-8',
      productName: '수도45엘보(2단,가공)',
      specification: '1~50(B)',
      unit: 'ea',
      shippingDate: '2025-07-01',
      quantity: 30,
      unitPrice: 238293
    },
    {
      site: '(주)동양파이프',
      orderNumber: '20250701-10',
      productName: '수도90엘보(사출)',
      specification: '1~50',
      unit: 'ea',
      shippingDate: '2025-07-01',
      quantity: 1,
      unitPrice: 6535
    },
    {
      site: '남양종합배관',
      orderNumber: '20250616-1',
      productName: '수도용플리에탈관(SDR11)(PE100)',
      specification: '90',
      unit: '6m',
      shippingDate: '2025-06-16',
      quantity: 4,
      unitPrice: 151694
    }
  ]

  const handleSearch = () => {
    // 검색 로직 구현
    console.log('검색 실행:', searchParams)
  }

  const handlePrint = () => {
    console.log('프린트 실행')
  }

  return (
    <div className="space-y-6">
      {/* 브레드크럼 */}
      <div className="flex items-center gap-2 text-sm text-custom-secondary">
        <span>HOME</span>
        <span>{'>'}</span>
        <span>출하정보</span>
        <span>{'>'}</span>
        <span className="text-custom-primary font-medium">현장별출하조회</span>
      </div>

      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold" style={{color: '#2A3038'}}>현장별 출하조회</h1>
        <button
          onClick={handlePrint}
          className="px-4 py-2 border border-gray-300 bg-white hover:bg-gray-50 rounded-lg text-sm flex items-center gap-2"
          style={{color: '#2A3038'}}
        >
          🖨️ 프린트
        </button>
      </div>

      {/* 검색 영역 */}
      <div className="bg-white rounded-xl p-6 card-shadow border-t-4 border-orange-primary">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium mb-2" style={{color: '#2A3038'}}>
              현장명
            </label>
            <input
              type="text"
              value={searchParams.siteName}
              onChange={(e) => setSearchParams({...searchParams, siteName: e.target.value})}
              className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-primary focus:border-transparent"
              placeholder="현장명 입력"
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
                <th className="px-4 py-3 text-left text-sm font-medium border-r border-gray-300" style={{color: '#2A3038'}}>
                  현장1
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium border-r border-gray-300" style={{color: '#2A3038'}}>
                  주문번호
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium border-r border-gray-300" style={{color: '#2A3038'}}>
                  제품명
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium border-r border-gray-300" style={{color: '#2A3038'}}>
                  호칭
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium border-r border-gray-300" style={{color: '#2A3038'}}>
                  단위
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium border-r border-gray-300" style={{color: '#2A3038'}}>
                  출고일자
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium border-r border-gray-300" style={{color: '#2A3038'}}>
                  수량
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium" style={{color: '#2A3038'}}>
                  단가
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {siteShippingData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-xs border-r border-gray-300" style={{color: '#2A3038'}}>
                    {item.site}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs border-r border-gray-300" style={{color: '#2A3038'}}>
                    {item.orderNumber}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs border-r border-gray-300" style={{color: '#2A3038'}}>
                    {item.productName}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs border-r border-gray-300" style={{color: '#2A3038'}}>
                    {item.specification}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs border-r border-gray-300" style={{color: '#2A3038'}}>
                    {item.unit}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs text-custom-secondary border-r border-gray-300">
                    {item.shippingDate}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs border-r border-gray-300" style={{color: '#2A3038'}}>
                    {item.quantity}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs" style={{color: '#2A3038'}}>
                    {item.unitPrice.toLocaleString()}
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