import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import { OrderService } from '@/services'
import { useAuth } from '@/hooks/useAuth'
import type { ShippingProgress, OrderListParams } from '@/types'
import DateRangePicker from '../components/ui/DateRangePicker'
import ProductDetailModal from '@/components/ui/ProductDetailModal'
import ShippingSlipModal from '@/components/ui/ShippingSlipModal'

export default function ShippingProgress() {
  const { user } = useAuth()
  const [searchParams, setSearchParams] = useState<OrderListParams>({
    orderNumber: '',
    startDate: '',
    endDate: '',
    sdiv: '',
    comName: '',
    page: 0,
    size: 20
  })

  
  const [shippingData, setShippingData] = useState<ShippingProgress[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // 페이징 정보 상태
  const [paginationInfo, setPaginationInfo] = useState({
    totalElements: 0,
    totalPages: 0,
    currentPage: 0,
    pageSize: 20,
    isFirst: true,
    isLast: true
  })

  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedSlipOrder, setSelectedSlipOrder] = useState<string | null>(null)
  const [isSlipModalOpen, setIsSlipModalOpen] = useState(false)

  // 상태 옵션 (출고형태 코드에 맞게 수정)
  const statusOptions = [
    { value: '', label: '전체' },
    { value: '5300010001', label: '일반판매' },
    { value: '5300010002', label: '특별판매' },
    { value: '5300010003', label: '기타' }
  ]

  // 페이지 사이즈 변경
  const handlePageSizeChange = (newSize: number) => {
    const newParams = { ...searchParams, size: newSize, page: 0 }
    setSearchParams(newParams)
    fetchShippingData(newParams)
  }

  // 페이지 변경
  const handlePageChange = (newPage: number) => {
    const newParams = { ...searchParams, page: newPage }
    setSearchParams(newParams)
    fetchShippingData(newParams)
  }



  // 출하진행현황 조회
  const fetchShippingData = async (params: OrderListParams = {}) => {
    if (!user?.custCode) {
      setError('사용자 정보를 불러올 수 없습니다.')
      return
    }

    try {
      setLoading(true)
      setError(null)
      const response = await OrderService.getShipmentList(Number(user.custCode), params)
      
      // OrderShipmentResponse를 UI용 ShippingProgress 타입으로 변환
      const transformedData = response.content.map(shipment => 
        OrderService.transformToShippingProgress(shipment)
      )
      setShippingData(transformedData)
      
      // 페이징 정보 업데이트
      setPaginationInfo({
        totalElements: response.totalElements,
        totalPages: response.totalPages,
        currentPage: response.number,
        pageSize: response.size,
        isFirst: response.first,
        isLast: response.last
      })
    } catch (err) {
      setError('출하진행현황을 불러오는데 실패했습니다.')
      console.error('출하진행현황 조회 실패:', err)
    } finally {
      setLoading(false)
    }
  }

  // 컴포넌트 마운트 시 초기 데이터 로드
  useEffect(() => {
    if (user?.custCode) {
      fetchShippingData(searchParams)
    }
  }, [user?.custCode])

  const handleSearch = () => {
    // 검색 시 페이지를 0으로 초기화
    const searchParamsWithReset = { ...searchParams, page: 0 }
    setSearchParams(searchParamsWithReset)
    fetchShippingData(searchParamsWithReset)
  }

  const handleReset = () => {
    const resetParams: OrderListParams = {
      orderNumber: '',
      startDate: '',
      endDate: '',
      sdiv: '',
      comName: '',
      page: 0,
      size: searchParams.size || 20
    }
    setSearchParams(resetParams)
    fetchShippingData(resetParams)
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
      <div className="bg-white rounded-xl p-6 card-shadow border-t-4 border-orange-500">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium mb-2" style={{color: '#2A3038'}}>
              출하번호
            </label>
            <input
              type="text"
              value={searchParams.orderNumber || ''}
              onChange={(e) => setSearchParams({...searchParams, orderNumber: e.target.value})}
              className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-primary focus:border-transparent"
              placeholder="출하번호 입력"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{color: '#2A3038'}}>
              현장명
            </label>
            <input
              type="text"
              value={searchParams.comName || ''}
              onChange={(e) => setSearchParams({...searchParams, comName: e.target.value})}
              className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-primary focus:border-transparent"
              placeholder="현장명 입력"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{color: '#2A3038'}}>
              출고형태
            </label>
            <select
              value={searchParams.sdiv || ''}
              onChange={(e) => setSearchParams({...searchParams, sdiv: e.target.value})}
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
          
          <div>
            <label className="block text-sm font-medium mb-2" style={{color: '#2A3038'}}>
              기간 선택
            </label>
            <DateRangePicker
              value={{
                startDate: searchParams.startDate || '',
                endDate: searchParams.endDate || ''
              }}
              onChange={(dateRange) => setSearchParams({
                ...searchParams,
                startDate: dateRange.startDate,
                endDate: dateRange.endDate
              })}
              placeholder="기간을 선택하세요"
            />
          </div>
          
          <div>
            <Button 
              onClick={handleSearch} 
              disabled={loading}
              className="bg-orange-500 hover:bg-orange-600 h-10 disabled:opacity-50 w-full"
            >
              <Search className="w-4 h-4 mr-2" />
              {loading ? '검색중...' : '검색'}
            </Button>
          </div>

          <div>
            <Button 
              onClick={handleReset}
              variant="outline"
              className="h-10 border-gray-300 text-gray-700 hover:bg-gray-50 w-full"
            >
              초기화
            </Button>
          </div>
        </div>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* 테이블 영역 */}
      <div className="bg-white rounded-xl card-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium" style={{color: '#2A3038'}}>
                  출하번호
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
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-sm text-gray-500">
                    로딩 중...
                  </td>
                </tr>
              ) : shippingData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-sm text-gray-500">
                    조회된 출하진행현황이 없습니다.
                  </td>
                </tr>
              ) : (
                shippingData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" style={{color: '#2A3038'}}>
                      {item.shipNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{color: '#2A3038'}}>
                      {item.orderMastDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{color: '#2A3038'}}>
                      {item.orderMastSdivDisplayName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{color: '#2A3038'}}>
                      {item.orderMastComname}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-custom-secondary">
                      {item.orderMastOdate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{color: '#2A3038'}}>
                      -
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(item.orderMastStatusDisplayName)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleProductClick(item.shipNumber)}
                          className="px-3 py-1 text-xs border border-gray-300 bg-white hover:bg-gray-50 rounded-sm"
                          style={{color: '#2A3038'}}
                        >
                          제품
                        </button>
                        <button
                          onClick={() => handleSlipClick(item.shipNumber)}
                          className="px-3 py-1 text-xs border border-gray-300 bg-white hover:bg-gray-50 rounded-sm"
                          style={{color: '#2A3038'}}
                        >
                          전표
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* 페이징 컨트롤 - 데이터가 있을 때만 표시 */}
        {!loading && paginationInfo.totalElements > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            {/* 페이지 정보 및 사이즈 선택 */}
            <div className="flex items-center gap-4">
              <div className="text-sm" style={{color: '#868B94'}}>
                총 {paginationInfo.totalElements}개 중 {(paginationInfo.currentPage * paginationInfo.pageSize) + 1}-{Math.min((paginationInfo.currentPage + 1) * paginationInfo.pageSize, paginationInfo.totalElements)}개 표시
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm" style={{color: '#2A3038'}}>페이지당 표시:</span>
                <select
                  value={searchParams.size || 20}
                  onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                  style={{color: '#2A3038'}}
                >
                  <option value={10}>10개</option>
                  <option value={20}>20개</option>
                  <option value={50}>50개</option>
                </select>
              </div>
            </div>

            {/* 페이지네이션 버튼 */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(paginationInfo.currentPage - 1)}
                disabled={paginationInfo.isFirst}
                className="h-8 w-8 p-0"
              >
                ‹
              </Button>
              
              {/* 페이지 번호 버튼들 */}
              {(() => {
                const totalPages = paginationInfo.totalPages
                const currentPage = paginationInfo.currentPage
                const maxButtons = 5
                
                if (totalPages <= maxButtons) {
                  return Array.from({ length: totalPages }, (_, i) => (
                    <Button
                      key={i}
                      variant={i === currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(i)}
                      className={`h-8 w-8 p-0 ${
                        i === currentPage 
                          ? "bg-orange-500 hover:bg-orange-600 text-white border-orange-500" 
                          : ""
                      }`}
                    >
                      {i + 1}
                    </Button>
                  ))
                }
                
                // 전체 페이지가 5개 초과일 때 스마트 페이징
                let startPage = Math.max(0, currentPage - 2)
                const endPage = Math.min(totalPages - 1, startPage + maxButtons - 1)
                
                if (endPage - startPage < maxButtons - 1) {
                  startPage = Math.max(0, endPage - maxButtons + 1)
                }
                
                const pages = []
                for (let i = startPage; i <= endPage; i++) {
                  pages.push(
                    <Button
                      key={i}
                      variant={i === currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(i)}
                      className={`h-8 w-8 p-0 ${
                        i === currentPage 
                          ? "bg-orange-500 hover:bg-orange-600 text-white border-orange-500" 
                          : ""
                      }`}
                    >
                      {i + 1}
                    </Button>
                  )
                }
                return pages
              })()}
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(paginationInfo.currentPage + 1)}
                disabled={paginationInfo.isLast}
                className="h-8 w-8 p-0"
              >
                ›
              </Button>
            </div>
          </div>
        </div>
        )}
      </div>

      {/* 제품별 현황 모달 */}
      <ProductDetailModal
        isOpen={isModalOpen}
        onClose={closeModal}
        orderNumber={selectedOrder || ''} // 출하번호로 사용됨
      />

      {/* 출고전표 현황 모달 */}
      <ShippingSlipModal
        isOpen={isSlipModalOpen}
        onClose={closeSlipModal}
        orderNumber={selectedSlipOrder || ''} // 전표번호로 사용됨
      />
    </div>
  )
} 