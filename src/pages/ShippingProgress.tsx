import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import ProductDetailModal, { type ProductDetail } from '@/components/ui/ProductDetailModal'
import ShippingSlipModal, { type ShippingSlipDetail } from '@/components/ui/ShippingSlipModal'

export default function ShippingProgress() {
  const [searchParams, setSearchParams] = useState({
    orderNumber: '',
    startDate: '2025-06-01',
    endDate: '2025-07-01',
    status: ''
  })

  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedSlipOrder, setSelectedSlipOrder] = useState<string | null>(null)
  const [isSlipModalOpen, setIsSlipModalOpen] = useState(false)

  // 상태 옵션
  const statusOptions = [
    { value: '', label: '전체' },
    { value: '진행', label: '진행' },
    { value: '완료', label: '완료' },
    { value: '대기', label: '대기' }
  ]

  // 출하 전표현황 샘플 데이터 - 첨부 이미지 기준
  const shippingProgressData = [
    {
      orderNumber: '20250701-4',
      orderDate: '2025-07-01',
      shippingType: '일반판매',
      siteName: '(주)동양파이프',
      deliveryDate: '2025-07-02',
      returnStatus: '-',
      status: '진행',
      progress: '진행'
    },
    {
      orderNumber: '20250630-39',
      orderDate: '2025-06-30',
      shippingType: '일반판매',
      siteName: '(주)동양파이프',
      deliveryDate: '2025-07-01',
      returnStatus: '-',
      status: '완료',
      progress: '완료'
    },
    {
      orderNumber: '20250630-24',
      orderDate: '2025-06-30',
      shippingType: '일반판매',
      siteName: '대신철물 : 신성품 지점',
      deliveryDate: '2025-07-01',
      returnStatus: '-',
      status: '대기',
      progress: '대기'
    },
    {
      orderNumber: '20250625-17',
      orderDate: '2025-06-25',
      shippingType: '일반판매',
      siteName: '(주)동양파이프',
      deliveryDate: '2025-06-26',
      returnStatus: '-',
      status: '완료',
      progress: '완료'
    },
    {
      orderNumber: '20250623-13',
      orderDate: '2025-06-23',
      shippingType: '일반판매',
      siteName: '(주)동양파이프',
      deliveryDate: '2025-06-24',
      returnStatus: '-',
      status: '진행',
      progress: '진행'
    },
    {
      orderNumber: '20250618-18',
      orderDate: '2025-06-18',
      shippingType: '일반판매',
      siteName: '(주)동양파이프',
      deliveryDate: '2025-06-19',
      returnStatus: '-',
      status: '완료',
      progress: '완료'
    },
    {
      orderNumber: '20250618-15',
      orderDate: '2025-06-18',
      shippingType: '일반판매',
      siteName: '(주)동양파이프',
      deliveryDate: '2025-06-19',
      returnStatus: '-',
      status: '대기',
      progress: '대기'
    },
    {
      orderNumber: '20250618-5',
      orderDate: '2025-06-18',
      shippingType: '일반판매',
      siteName: '(주)동양파이프',
      deliveryDate: '2025-06-19',
      returnStatus: '-',
      status: '완료',
      progress: '완료'
    },
    {
      orderNumber: '20250617-21',
      orderDate: '2025-06-17',
      shippingType: '일반판매',
      siteName: '(주)동양파이프',
      deliveryDate: '2025-06-18',
      returnStatus: '-',
      status: '진행',
      progress: '진행'
    },
    {
      orderNumber: '20250616-10',
      orderDate: '2025-06-16',
      shippingType: '일반판매',
      siteName: '(주)동양파이프',
      deliveryDate: '2025-06-17',
      returnStatus: '-',
      status: '완료',
      progress: '완료'
    },
    {
      orderNumber: '20250612-61',
      orderDate: '2025-06-12',
      shippingType: '일반판매',
      siteName: '(주)동양파이프',
      deliveryDate: '2025-06-13',
      returnStatus: '-',
      status: '대기',
      progress: '대기'
    },
    {
      orderNumber: '20250610-11',
      orderDate: '2025-06-10',
      shippingType: '일반판매',
      siteName: '(주)동양파이프',
      deliveryDate: '2025-06-11',
      returnStatus: '-',
      status: '완료',
      progress: '완료'
    },
    {
      orderNumber: '20250605-12',
      orderDate: '2025-06-05',
      shippingType: '일반판매',
      siteName: '(주)동양파이프',
      deliveryDate: '2025-06-06',
      returnStatus: '-',
      status: '진행',
      progress: '진행'
    },
    {
      orderNumber: '20250605-6',
      orderDate: '2025-06-05',
      shippingType: '일반판매',
      siteName: '(주)동양파이프',
      deliveryDate: '2025-06-06',
      returnStatus: '-',
      status: '완료',
      progress: '완료'
    },
    {
      orderNumber: '20250604-13',
      orderDate: '2025-06-04',
      shippingType: '일반판매',
      siteName: '(주)충남연탄공장 출고분',
      deliveryDate: '2025-06-05',
      returnStatus: '-',
      status: '대기',
      progress: '대기'
    }
  ]

  // 제품별 현황 데이터 (첨부 이미지 기준)
  const productDetailData: { [key: string]: ProductDetail[] } = {
    '20250701-4': [
      {
        productCode: '223042-010050',
        productName: '수도(SUS)T/F(S)(상품)',
        specification: '50',
        unit: 'ea',
        orderQuantity: 4,
        shippedQuantity: 4,
        remainingQuantity: 0
      },
      {
        productCode: '223042-010030',
        productName: '수도(SUS)T/F(S)(상품)',
        specification: '30',
        unit: 'ea',
        orderQuantity: 3,
        shippedQuantity: 3,
        remainingQuantity: 0
      }
    ],
    '20250630-39': [
      {
        productCode: '223042-010050',
        productName: '수도(SUS)T/F(S)(상품)',
        specification: '50',
        unit: 'ea',
        orderQuantity: 2,
        shippedQuantity: 2,
        remainingQuantity: 0
      }
    ],
    '20250630-24': [
      {
        productCode: '223042-010030',
        productName: '수도(SUS)T/F(S)(상품)',
        specification: '30',
        unit: 'ea',
        orderQuantity: 5,
        shippedQuantity: 3,
        remainingQuantity: 2
      }
    ]
  }

  // 출고전표 현황 데이터 (첨부 이미지 기준)
  const shippingSlipData: { [key: string]: ShippingSlipDetail[] } = {
    '20250612-17': [
      {
        slipNumber: '20250612-17',
        shippingDate: '2025-06-12',
        productName: '수도(SUS)T/F(S)(상품)',
        quantity: 4,
        unitPrice: 62137,
        shippingAmount: 226354,
        deliveryCompleteAmount: 226354
      },
      {
        slipNumber: '20250612-17',
        shippingDate: '2025-06-12',
        productName: '수도(SUS)T/F(S)(상품)',
        quantity: 3,
        unitPrice: 34899,
        shippingAmount: 95396,
        deliveryCompleteAmount: 95396
      }
    ],
    '20250701-4': [
      {
        slipNumber: '20250701-4',
        shippingDate: '2025-07-01',
        productName: '수도(SUS)T/F(S)(상품)',
        quantity: 2,
        unitPrice: 45000,
        shippingAmount: 90000,
        deliveryCompleteAmount: 90000
      }
    ]
  }

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

  const handleProductClick = (orderNumber: string) => {
    setSelectedOrder(orderNumber)
    setIsModalOpen(true)
  }

  const handleSlipClick = (orderNumber: string) => {
    setSelectedSlipOrder(orderNumber)
    setIsSlipModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedOrder(null)
  }

  const closeSlipModal = () => {
    setIsSlipModalOpen(false)
    setSelectedSlipOrder(null)
  }

  return (
    <div className="space-y-6">
      {/* 브레드크럼 */}
      <div className="flex items-center gap-2 text-sm text-custom-secondary">
        <span>HOME</span>
        <span>{'>'}</span>
        <span>출하정보</span>
        <span>{'>'}</span>
        <span className="text-custom-primary font-medium">출하진행현황</span>
      </div>

      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold" style={{color: '#2A3038'}}>출하진행현황</h1>
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
                  주문일
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium" style={{color: '#2A3038'}}>
                  출고형태
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium" style={{color: '#2A3038'}}>
                  현장명
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium" style={{color: '#2A3038'}}>
                  납품일
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium" style={{color: '#2A3038'}}>
                  반품
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium" style={{color: '#2A3038'}}>
                  상태
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium" style={{color: '#2A3038'}}>
                  현황
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {shippingProgressData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" style={{color: '#2A3038'}}>
                    {item.orderNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm" style={{color: '#2A3038'}}>
                    {item.orderDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm" style={{color: '#2A3038'}}>
                    {item.shippingType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm" style={{color: '#2A3038'}}>
                    {item.siteName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-custom-secondary">
                    {item.deliveryDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm" style={{color: '#2A3038'}}>
                    {item.returnStatus}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(item.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleProductClick(item.orderNumber)}
                        className="px-3 py-1 text-xs border border-gray-300 bg-white hover:bg-gray-50 rounded-sm"
                        style={{color: '#2A3038'}}
                      >
                        제품
                      </button>
                      <button
                        onClick={() => handleSlipClick(item.orderNumber)}
                        className="px-3 py-1 text-xs border border-gray-300 bg-white hover:bg-gray-50 rounded-sm"
                        style={{color: '#2A3038'}}
                      >
                        전표
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 제품별 현황 모달 */}
      <ProductDetailModal
        isOpen={isModalOpen}
        onClose={closeModal}
        orderNumber={selectedOrder || ''}
        products={selectedOrder ? productDetailData[selectedOrder] || [] : []}
      />

      {/* 출고전표 현황 모달 */}
      <ShippingSlipModal
        isOpen={isSlipModalOpen}
        onClose={closeSlipModal}
        orderNumber={selectedSlipOrder || ''}
        slipDetails={selectedSlipOrder ? shippingSlipData[selectedSlipOrder] || [] : []}
      />
    </div>
  )
} 