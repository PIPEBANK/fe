import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Search, Info } from 'lucide-react'
import { OrderService } from '@/services'
import { useAuth } from '@/hooks/useAuth'
import type { Order, OrderListParams } from '@/types'
import RoundedDatePicker from '../components/ui/RoundedDatePicker'

export default function OrderList() {
  const { user } = useAuth()
  const [searchParams, setSearchParams] = useState<OrderListParams>({
    orderNumber: '',
    startDate: '',
    endDate: '',
    sdiv: '',
    comName: '',
    page: 0,
    size: 10
  })
  
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showStatusTooltip, setShowStatusTooltip] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const infoIconRef = useRef<HTMLDivElement>(null)
  
  // 페이징 정보 상태
  const [paginationInfo, setPaginationInfo] = useState({
    totalElements: 0,
    totalPages: 0,
    currentPage: 0,
    pageSize: 10,
    isFirst: true,
    isLast: true
  })



  // 주문 목록 조회
  const fetchOrders = async (params: OrderListParams = {}) => {
    if (!user?.custCode) {
      setError('사용자 정보를 불러올 수 없습니다.')
      return
    }

    try {
      setLoading(true)
      setError(null)
      const response = await OrderService.getOrderList(Number(user.custCode), params)
      
      // OrderMastResponse를 UI용 Order 타입으로 변환
      const transformedOrders = response.content.map(orderMast => 
        OrderService.transformToOrder(orderMast)
      )
      setOrders(transformedOrders)
      
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
      setError('주문 목록을 불러오는데 실패했습니다.')
      console.error('주문 목록 조회 실패:', err)
    } finally {
      setLoading(false)
    }
  }



  // 컴포넌트 마운트 시 초기 데이터 로드
  useEffect(() => {
    if (user?.custCode) {
      fetchOrders(searchParams)
    }
  }, [user?.custCode])

  const handleSearch = () => {
    // 검색 시 페이지를 0으로 초기화
    const searchParamsWithReset = { ...searchParams, page: 0 }
    setSearchParams(searchParamsWithReset)
    fetchOrders(searchParamsWithReset)
  }

  const handleReset = () => {
    const resetParams = {
      orderNumber: '',
      startDate: '',
      endDate: '',
      sdiv: '',
      comName: '',
      page: 0,
      size: searchParams.size || 10
    }
    setSearchParams(resetParams)
    fetchOrders(resetParams)
  }

  // 페이지 사이즈 변경
  const handlePageSizeChange = (newSize: number) => {
    const newParams = { ...searchParams, size: newSize, page: 0 }
    setSearchParams(newParams)
    fetchOrders(newParams)
  }

  // 페이지 변경
  const handlePageChange = (newPage: number) => {
    const newParams = { ...searchParams, page: newPage }
    setSearchParams(newParams)
    fetchOrders(newParams)
  }

  const getStatusBadge = (statusDisplayName: string) => {
    return (
      <span className="text-sm font-medium" style={{color: '#FF6F0F'}}>
        {statusDisplayName}
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
      <div className="bg-white rounded-xl p-6 card-shadow border-t-4 border-orange-500">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium mb-2" style={{color: '#2A3038'}}>
              주문번호
            </label>
            <input
              type="text"
              value={searchParams.orderNumber || ''}
              onChange={(e) => setSearchParams({...searchParams, orderNumber: e.target.value})}
              className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-primary focus:border-transparent"
              placeholder="주문번호 입력"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{color: '#2A3038'}}>
              납품현장명
            </label>
            <input
              type="text"
              value={searchParams.comName || ''}
              onChange={(e) => setSearchParams({...searchParams, comName: e.target.value})}
              className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-primary focus:border-transparent"
              placeholder="납품현장명 입력"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium mb-2" style={{color: '#2A3038'}}>
              주문일자
            </label>
            <div className="flex items-center gap-2">
              <RoundedDatePicker
                value={searchParams.startDate || ''}
                onChange={(date) => setSearchParams({
                  ...searchParams,
                  startDate: date
                })}
                placeholder="시작일을 선택하세요"
                className="flex-1"
              />
              <span className="text-gray-500 text-sm">~</span>
              <RoundedDatePicker
                value={searchParams.endDate || ''}
                onChange={(date) => setSearchParams({
                  ...searchParams,
                  endDate: date
                })}
                placeholder="종료일을 선택하세요"
                className="flex-1"
              />
            </div>
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
      <div className="bg-white rounded-xl card-shadow" style={{ overflow: 'visible' }}>
        <div className="overflow-x-auto">
          <table className="w-full table-fixed">
            <thead className="bg-gray-100">
              <tr>
                <th className="w-[18%] px-6 py-4 text-left text-sm font-medium" style={{color: '#2A3038'}}>
                  주문번호
                </th>
                <th className="w-[15%] px-6 py-4 text-left text-sm font-medium" style={{color: '#2A3038'}}>
                  출고형태
                </th>
                <th className="w-[35%] px-6 py-4 text-left text-sm font-medium" style={{color: '#2A3038'}}>
                  납품현장
                </th>
                <th className="w-[17%] px-6 py-4 text-left text-sm font-medium" style={{color: '#2A3038'}}>
                  주문일자
                </th>
                <th className="w-[15%] px-6 py-4 text-left text-sm font-medium" style={{color: '#2A3038'}}>
                  <div className="flex items-center gap-1 relative">
                    <span>상태</span>
                    <div className="relative" ref={infoIconRef}>
                      <Info 
                        className="w-4 h-4 text-gray-400 cursor-help" 
                        onMouseEnter={() => {
                          const rect = infoIconRef.current?.getBoundingClientRect()
                          if (rect) {
                            setTooltipPosition({
                              x: rect.right - 320, // 툴팁 너비(320px)만큼 왼쪽으로
                              y: rect.top - 140    // 아이콘 위쪽으로 더 멀리
                            })
                          }
                          setShowStatusTooltip(true)
                        }}
                        onMouseLeave={() => setShowStatusTooltip(false)}
                      />
                    </div>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">
                    로딩 중...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">
                    조회된 주문이 없습니다.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 cursor-pointer">
                    <td className="w-[18%] px-6 py-4 whitespace-nowrap">
                      <a 
                        href={`/order-detail/${order.id}`}
                        className="text-sm font-medium hover:underline cursor-pointer block truncate" 
                        style={{color: '#2A3038'}}
                        title={order.orderNumber}
                      >
                        {order.orderNumber}
                      </a>
                    </td>
                    <td className="w-[15%] px-6 py-4 whitespace-nowrap">
                      <span className="text-sm block truncate" style={{color: '#2A3038'}} title={order.orderMastSdivDisplayName}>
                        {order.orderMastSdivDisplayName}
                      </span>
                    </td>
                    <td className="w-[35%] px-6 py-4 whitespace-nowrap">
                      <span className="text-sm block truncate" style={{color: '#2A3038'}} title={order.orderMastComname}>
                        {order.orderMastComname}
                      </span>
                    </td>
                    <td className="w-[17%] px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-custom-secondary block truncate" title={order.orderMastDate}>
                        {order.orderMastDate}
                      </span>
                    </td>
                    <td className="w-[15%] px-6 py-4 whitespace-nowrap">
                      <span className="block truncate">
                        {getStatusBadge(order.orderMastStatusDisplayName)}
                      </span>
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
                  value={searchParams.size || 10}
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
                  // 전체 페이지가 5개 이하면 모든 페이지 표시
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
                
                // 끝에서 5개가 안 될 때 시작점 조정
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

      {/* Portal로 렌더링되는 툴팁 */}
      {showStatusTooltip && createPortal(
        <div 
          className="fixed w-80 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            zIndex: 9999
          }}
          onMouseEnter={() => setShowStatusTooltip(true)}
          onMouseLeave={() => setShowStatusTooltip(false)}
        >
          <div className="font-semibold mb-2">주문 상태 기준</div>
          <div className="space-y-1.5">
            <div><span className="font-medium text-blue-300">• 수주등록:</span> 모든 품목이 수주등록 상태</div>
            <div><span className="font-medium text-orange-300">• 수주진행:</span> 하나 이상의 품목이 수주 진행 중이거나 혼재 상태</div>
            <div><span className="font-medium text-green-300">• 출하완료:</span> 모든 품목이 출하완료 상태</div>
          </div>
          <div className="text-gray-300 mt-2 text-xs">
            * 주문 상태는 주문에 포함된 모든 품목의 상태를 종합하여 결정됩니다
          </div>
        </div>,
        document.body
      )}
    </div>
  )
} 