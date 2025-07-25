import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import { OrderService } from '@/services'
import { useAuth } from '@/hooks/useAuth'
import type { ShipmentItemParams, ShipmentItemResponse } from '@/types'
import RoundedDatePicker from '../components/ui/RoundedDatePicker'
import PrintShippingSite from '@/components/ui/PrintShippingSite'

export default function ShippingSite() {
  const { user } = useAuth()
  const [searchParams, setSearchParams] = useState<ShipmentItemParams>({
    itemName1: '',
    itemName2: '',
    spec1: '',
    spec2: '',
    itemNameOperator: 'AND',
    specOperator: 'AND',
    comName: '',
    orderNumber: '',
    startDate: '',
    endDate: '',
    page: 0,
    size: 20
  })
  
  const [shipmentData, setShipmentData] = useState<ShipmentItemResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paginationInfo, setPaginationInfo] = useState({
    totalElements: 0,
    totalPages: 0,
    currentPage: 0,
    pageSize: 20,
    isFirst: true,
    isLast: true
  })

  // 툴팁 관련 상태
  const [tooltip, setTooltip] = useState<{
    visible: boolean
    x: number
    y: number
    content: ShipmentItemResponse | null
  }>({
    visible: false,
    x: 0,
    y: 0,
    content: null
  })

  // 현장별 출하조회 데이터 조회
  const fetchShipmentData = async (params: ShipmentItemParams = {}) => {
    if (!user?.custCode) return
    
    try {
      setLoading(true)
      setError(null)
      
      const response = await OrderService.getShipmentItems(parseInt(user.custCode), {
        ...searchParams,
        ...params
      })
      
      setShipmentData(response.content)
      setPaginationInfo({
        totalElements: response.totalElements,
        totalPages: response.totalPages,
        currentPage: response.number,
        pageSize: response.size,
        isFirst: response.first,
        isLast: response.last
      })
    } catch (err) {
      console.error('현장별 출하조회 실패:', err)
      setError('현장별 출하조회 데이터를 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  // 컴포넌트 마운트 시 초기 데이터 로드
  useEffect(() => {
    fetchShipmentData()
  }, [user?.custCode])

  const handleSearch = () => {
    fetchShipmentData({ page: 0 })
  }

  const handleReset = () => {
    const resetParams = {
      itemName1: '',
      itemName2: '',
      spec1: '',
      spec2: '',
      itemNameOperator: 'AND' as 'AND' | 'OR',
      specOperator: 'AND' as 'AND' | 'OR',
      comName: '',
      orderNumber: '',
      startDate: '',
      endDate: '',
      page: 0,
      size: 20
    }
    setSearchParams(resetParams)
    fetchShipmentData(resetParams)
  }

  const handlePrint = () => {
    if (shipmentData.length === 0) {
      alert('인쇄할 데이터가 없습니다.')
      return
    }
    PrintShippingSite.open(shipmentData, searchParams, paginationInfo)
  }

  const handlePageChange = (newPage: number) => {
    const newParams = { ...searchParams, page: newPage }
    setSearchParams(newParams)
    fetchShipmentData(newParams)
  }

  const handlePageSizeChange = (newSize: number) => {
    const newParams = { ...searchParams, page: 0, size: newSize }
    setSearchParams(newParams)
    fetchShipmentData(newParams)
  }

  // 툴팁 핸들러
  const handleMouseEnter = (event: React.MouseEvent, item: ShipmentItemResponse) => {
    const rect = event.currentTarget.getBoundingClientRect()
    setTooltip({
      visible: true,
      x: rect.left + rect.width / 2, // 셀의 가운데
      y: rect.top, // 셀의 상단
      content: item
    })
  }

  const handleMouseLeave = () => {
    setTooltip({
      visible: false,
      x: 0,
      y: 0,
      content: null
    })
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
          className="px-3 py-1 border border-gray-300 bg-white hover:bg-gray-50 rounded-lg text-sm flex items-center gap-2"
          style={{color: '#2A3038'}}
        >
          🖨️ 프린트
        </button>
      </div>

      {/* 검색 영역 */}
      <div className="bg-white rounded-xl p-6 card-shadow border-t-4 border-orange-500">
        <div className="space-y-4">
          {/* 첫 번째 줄: 제품명1 조건 제품명2 규격1 조건 규격2 */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
            <div>
              <label className="block text-sm font-medium mb-2" style={{color: '#2A3038'}}>
                제품명 (1차)
              </label>
              <input
                type="text"
                value={searchParams.itemName1 || ''}
                onChange={(e) => setSearchParams({...searchParams, itemName1: e.target.value})}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-primary focus:border-transparent text-sm"
                placeholder="제품명 입력"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{color: '#2A3038'}}>
                조건
              </label>
              <select
                value={searchParams.itemNameOperator || 'AND'}
                onChange={(e) => setSearchParams({...searchParams, itemNameOperator: e.target.value as 'AND' | 'OR'})}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-primary focus:border-transparent text-sm bg-white"
              >
                <option value="AND">AND</option>
                <option value="OR">OR</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{color: '#2A3038'}}>
                제품명 (2차)
              </label>
              <input
                type="text"
                value={searchParams.itemName2 || ''}
                onChange={(e) => setSearchParams({...searchParams, itemName2: e.target.value})}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-primary focus:border-transparent text-sm"
                placeholder="추가 제품명"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{color: '#2A3038'}}>
                규격 (1차)
              </label>
              <input
                type="text"
                value={searchParams.spec1 || ''}
                onChange={(e) => setSearchParams({...searchParams, spec1: e.target.value})}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-primary focus:border-transparent text-sm"
                placeholder="규격 입력"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{color: '#2A3038'}}>
                조건
              </label>
              <select
                value={searchParams.specOperator || 'AND'}
                onChange={(e) => setSearchParams({...searchParams, specOperator: e.target.value as 'AND' | 'OR'})}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-primary focus:border-transparent text-sm bg-white"
              >
                <option value="AND">AND</option>
                <option value="OR">OR</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{color: '#2A3038'}}>
                규격 (2차)
              </label>
              <input
                type="text"
                value={searchParams.spec2 || ''}
                onChange={(e) => setSearchParams({...searchParams, spec2: e.target.value})}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-primary focus:border-transparent text-sm"
                placeholder="추가 규격"
              />
            </div>
          </div>

          {/* 두 번째 줄: 현장명 주문번호 출하일자 초기화 검색 */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
            <div>
              <label className="block text-sm font-medium mb-2" style={{color: '#2A3038'}}>
                현장명
              </label>
              <input
                type="text"
                value={searchParams.comName || ''}
                onChange={(e) => setSearchParams({...searchParams, comName: e.target.value})}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-primary focus:border-transparent text-sm"
                placeholder="현장명 입력"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{color: '#2A3038'}}>
                주문번호
              </label>
              <input
                type="text"
                value={searchParams.orderNumber || ''}
                onChange={(e) => setSearchParams({...searchParams, orderNumber: e.target.value})}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-primary focus:border-transparent text-sm"
                placeholder="주문번호 입력"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2" style={{color: '#2A3038'}}>
                출하일자
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
                onClick={handleReset}
                variant="outline"
                className="h-10 border-gray-300 text-gray-700 hover:bg-gray-50 w-full"
              >
                초기화
              </Button>
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
                  주문번호
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium" style={{color: '#2A3038'}}>
                  출하일자
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium" style={{color: '#2A3038'}}>
                  현장명
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium" style={{color: '#2A3038'}}>
                  제품명
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium" style={{color: '#2A3038'}}>
                  규격
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium" style={{color: '#2A3038'}}>
                  단위
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium" style={{color: '#2A3038'}}>
                  수량
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium" style={{color: '#2A3038'}}>
                  공급가액
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
              ) : shipmentData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-sm text-gray-500">
                    조회된 출하 정보가 없습니다.
                  </td>
                </tr>
              ) : (
                shipmentData.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td 
                      className="px-6 py-4 whitespace-nowrap text-sm cursor-pointer relative" 
                      style={{color: '#2A3038'}}
                      onMouseEnter={(e) => handleMouseEnter(e, item)}
                      onMouseLeave={handleMouseLeave}
                    >
                      {item.orderNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{color: '#2A3038'}}>
                      {item.shipTranDate ? 
                        `${item.shipTranDate.substring(0,4)}-${item.shipTranDate.substring(4,6)}-${item.shipTranDate.substring(6,8)}` : 
                        '-'
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{color: '#2A3038'}}>
                      {item.shipMastComname}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{color: '#2A3038'}}>
                      {item.shipTranDeta}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{color: '#2A3038'}}>
                      {item.shipTranSpec}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{color: '#2A3038'}}>
                      {item.shipTranUnit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{color: '#2A3038'}}>
                      {item.shipTranCnt}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{color: '#2A3038'}}>
                      {item.shipTranTot.toLocaleString()}
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
              
              {/* 페이지 번호 표시 */}
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, paginationInfo.totalPages) }, (_, i) => {
                  const startPage = Math.max(0, paginationInfo.currentPage - 2)
                  const pageNum = startPage + i
                  
                  if (pageNum >= paginationInfo.totalPages) return null
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={pageNum === paginationInfo.currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(pageNum)}
                      className="h-8 w-8 p-0"
                    >
                      {pageNum + 1}
                    </Button>
                  )
                })}
              </div>
              
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

      {/* 툴팁 */}
      {tooltip.visible && tooltip.content && createPortal(
        <div
          className="absolute z-50 bg-white border border-gray-300 rounded-lg shadow-lg p-4 text-xs max-w-xs"
          style={{
            left: tooltip.x,
            top: tooltip.y - 120,
            transform: 'translateX(-50%)'
          }}
        >
          <div className="font-semibold mb-2 text-gray-800">배송 정보</div>
          <div className="space-y-1 text-gray-600">
            <div>
              <span className="font-medium">차량번호:</span> {tooltip.content.shipMastCarno || '-'}
            </div>
            <div>
              <span className="font-medium">톤수:</span> {tooltip.content.shipMastCartonDisplayName || '-'}
            </div>
            <div>
              <span className="font-medium">기사이름:</span> {tooltip.content.shipMastTname || '-'}
            </div>
            <div>
              <span className="font-medium">기사 연락처:</span> {tooltip.content.shipMastTtel || '-'}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
} 