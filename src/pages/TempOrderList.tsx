import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import { TempOrderListService } from '@/services'
import { useAuth } from '@/hooks/useAuth'
import type { TempOrder, TempOrderListParams, TempOrderListResponse } from '@/types'
import DateRangePicker from '../components/ui/DateRangePicker'

export default function TempOrderList() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useState<TempOrderListParams>({
    orderNumber: '',
    startDate: '',
    endDate: '',
    userId: '',
    comName: '',
    page: 0,
    size: 10
  })
  
  const [tempOrders, setTempOrders] = useState<TempOrder[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // 페이징 정보 상태
  const [paginationInfo, setPaginationInfo] = useState({
    totalElements: 0,
    totalPages: 0,
    currentPage: 0,
    pageSize: 10,
    isFirst: true,
    isLast: true
  })

  // 임시저장 주문 목록 조회
  const fetchTempOrders = async (params: TempOrderListParams = {}) => {
    if (!user?.custCode) {
      setError('사용자 정보를 불러올 수 없습니다.')
      return
    }

    try {
      setLoading(true)
      setError(null)
      const response = await TempOrderListService.getTempOrderList(Number(user.custCode), params)
      
      // TempOrderListResponse를 UI용 TempOrder 타입으로 변환
      const transformedOrders = response.content.map((tempOrderResponse: TempOrderListResponse) => 
        TempOrderListService.transformToTempOrder(tempOrderResponse)
      )
      setTempOrders(transformedOrders)
      
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
      setError('임시저장 목록을 불러오는데 실패했습니다.')
      console.error('임시저장 목록 조회 실패:', err)
    } finally {
      setLoading(false)
    }
  }

  // 컴포넌트 마운트 시 초기 데이터 로드
  useEffect(() => {
    if (user?.custCode) {
      fetchTempOrders(searchParams)
    }
  }, [user?.custCode])

  const handleSearch = () => {
    // 검색 시 페이지를 0으로 초기화
    const searchParamsWithReset = { ...searchParams, page: 0 }
    setSearchParams(searchParamsWithReset)
    fetchTempOrders(searchParamsWithReset)
  }

  const handleReset = () => {
    const resetParams = {
      orderNumber: '',
      startDate: '',
      endDate: '',
      userId: '',
      comName: '',
      page: 0,
      size: searchParams.size || 10
    }
    setSearchParams(resetParams)
    fetchTempOrders(resetParams)
  }

  // 엔터키 입력 시 검색
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  // 페이지 사이즈 변경
  const handlePageSizeChange = (newSize: number) => {
    const newParams = { ...searchParams, size: newSize, page: 0 }
    setSearchParams(newParams)
    fetchTempOrders(newParams)
  }

  // 페이지 변경
  const handlePageChange = (newPage: number) => {
    const newParams = { ...searchParams, page: newPage }
    setSearchParams(newParams)
    fetchTempOrders(newParams)
  }

  // 임시저장 주문 수정 페이지로 이동
  const handleRowClick = (tempOrder: TempOrder) => {
    navigate(`/temp-order-edit/${tempOrder.orderNumber}/${tempOrder.tempOrderId}`)
  }

  // 삭제 처리
  const handleDelete = async (tempOrder: TempOrder) => {
    if (!confirm(`임시주문을 삭제하시겠습니까?\n주문번호: ${tempOrder.orderNumber}`)) return
    try {
      setLoading(true)
      await TempOrderListService.deleteByOrderNumberAndTempId(tempOrder.orderNumber, tempOrder.tempOrderId)
      // 성공 후 목록 새로고침 (현재 검색조건 유지)
      fetchTempOrders(searchParams)
    } catch (e) {
      console.error('임시주문 삭제 실패:', e)
      alert('삭제에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* 브레드크럼 */}
      <div className="flex items-center gap-2 text-sm text-custom-secondary">
        <span>HOME</span>
        <span>{'>'}</span>
        <span>주문관리</span>
        <span>{'>'}</span>
        <span className="text-custom-primary font-medium">임시저장목록</span>
      </div>

      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold" style={{color: '#2A3038'}}>임시저장목록</h1>
      </div>

      {/* 검색 영역 */}
      <div className="bg-white rounded-xl p-6 card-shadow border-t-4 border-orange-500">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium mb-2" style={{color: '#2A3038'}}>
              주문번호
            </label>
            <input
              type="text"
              value={searchParams.orderNumber || ''}
              onChange={(e) => setSearchParams({...searchParams, orderNumber: e.target.value})}
              onKeyDown={handleKeyDown}
              className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-primary focus:border-transparent"
              placeholder="주문번호 입력"
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
              onKeyDown={handleKeyDown}
              className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-primary focus:border-transparent"
              placeholder="현장명 입력"
            />
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
          <table className="w-full table-fixed">
            <thead className="bg-gray-100">
              <tr>
                <th className="w-[30%] px-6 py-4 text-left text-sm font-medium" style={{color: '#2A3038'}}>
                  임시 주문번호
                </th>
                <th className="w-[40%] px-6 py-4 text-left text-sm font-medium" style={{color: '#2A3038'}}>
                  현장명
                </th>
                <th className="w-[20%] px-6 py-4 text-left text-sm font-medium" style={{color: '#2A3038'}}>
                  주문일자
                </th>
                <th className="w-[10%] px-6 py-4 text-left text-sm font-medium" style={{color: '#2A3038'}}>
                  상태
                </th>
                <th className="w-[10%] px-6 py-4 text-left text-sm font-medium" style={{color: '#2A3038'}}>
                  삭제
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">
                    로딩 중...
                  </td>
                </tr>
              ) : tempOrders.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">
                    임시저장된 주문이 없습니다.
                  </td>
                </tr>
              ) : (
                tempOrders.map((tempOrder) => (
                  <tr key={tempOrder.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleRowClick(tempOrder)}>
                    <td className="w-[30%] px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium block truncate" style={{color: '#2A3038'}} title={tempOrder.orderNumber}>
                       {tempOrder.orderNumber} 
                      </span>
                    </td>
                    <td className="w-[40%] px-6 py-4 whitespace-nowrap">
                      <span className="text-sm block truncate" style={{color: '#2A3038'}} title={tempOrder.siteName}>
                        {tempOrder.siteName}
                      </span>
                    </td>
                    <td className="w-[20%] px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-custom-secondary block truncate" title={tempOrder.orderDate}>
                        {tempOrder.orderDate}
                      </span>
                    </td>
                  <td className="w-[10%] px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium block truncate" style={{color: '#FF6F0F'}}>
                      미발송
                    </span>
                  </td>
                  <td className="w-[10%] px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(tempOrder) }}
                      className="px-3 py-1 border border-gray-300 bg-white hover:bg-gray-100 text-sm rounded"
                      title="삭제"
                    >
                      삭제
                    </button>
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
    </div>
  )
} 