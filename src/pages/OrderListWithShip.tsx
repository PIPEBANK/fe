import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Search, Download } from 'lucide-react'
import * as XLSX from 'xlsx'
import { OrderService } from '@/services'
import { useAuth } from '@/hooks/useAuth'
import type { OrderShipmentDetailParams, OrderShipmentDetailResponse } from '@/types'
import RoundedDatePicker from '../components/ui/RoundedDatePicker'
import type { AxiosError } from 'axios'

export default function OrderListWithShip() {
  const { user } = useAuth()
  const [orderSearchParams, setOrderSearchParams] = useState<OrderShipmentDetailParams>({
    itemName1: '',
    itemName2: '',
    spec1: '',
    spec2: '',
    itemNumber: '',
    itemNameOperator: 'AND',
    specOperator: 'AND',
    orderNumber: '',
    siteName: '',
    excludeCompleted: false,
    startDate: '',
    endDate: '',
    page: 0,
    size: 10
  })
  
  const [orderWithShipData, setOrderWithShipData] = useState<OrderShipmentDetailResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [urlSearchParams, setUrlSearchParams] = useSearchParams()
  // 검색 버튼 클릭 시 적용되는 검색 파라미터 (실시간 자동조회 방지용)
  const [appliedOrderSearchParams, setAppliedOrderSearchParams] = useState<OrderShipmentDetailParams>({
    itemName1: '',
    itemName2: '',
    spec1: '',
    spec2: '',
    itemNumber: '',
    itemNameOperator: 'AND',
    specOperator: 'AND',
    orderNumber: '',
    siteName: '',
    excludeCompleted: false,
    startDate: '',
    endDate: '',
    page: 0,
    size: 10
  })
  const [paginationInfo, setPaginationInfo] = useState({
    totalElements: 0,
    totalPages: 0,
    currentPage: 0,
    pageSize: 10,
    isFirst: true,
    isLast: true
  })



  // 주문서 상세 데이터 조회
  const fetchOrderWithShipData = async (params: OrderShipmentDetailParams = {}) => {
    if (!user?.custCode) return
    
    try {
      setLoading(true)
      setError(null)
      
      // 새로운 주문-출하 통합 상세 조회 API 사용
      const response = await OrderService.getOrderShipmentDetail(parseInt(user.custCode), {
        ...appliedOrderSearchParams,
        ...params
      })
      
      setOrderWithShipData(response.content)
      setPaginationInfo({
        totalElements: response.totalElements,
        totalPages: response.totalPages,
        currentPage: response.number,
        pageSize: response.size,
        isFirst: response.first,
        isLast: response.last
      })
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ message?: string }>
      console.error('주문서 상세 조회 실패:', axiosErr)
      setError(axiosErr.response?.data?.message || `주문서 상세 데이터를 불러오는데 실패했습니다. (${axiosErr.response?.status ?? '네트워크 오류'})`)
    } finally {
      setLoading(false)
    }
  }

  // URL(page/size) 또는 적용된 검색 조건 변화에 따라 데이터 로드 (입력 변경 시 자동조회 방지)
  useEffect(() => {
    if (!user?.custCode) return

    const pageParam = parseInt(urlSearchParams.get('page') || '0', 10)
    const sizeParam = parseInt(urlSearchParams.get('size') || '10', 10)

    const paramsForFetch: OrderShipmentDetailParams = {
      ...appliedOrderSearchParams,
      page: isNaN(pageParam) ? 0 : pageParam,
      size: isNaN(sizeParam) ? 10 : sizeParam
    }

    // 로컬 상태와 URL(page/size) 동기화
    if (appliedOrderSearchParams.page !== paramsForFetch.page || appliedOrderSearchParams.size !== paramsForFetch.size) {
      setAppliedOrderSearchParams(paramsForFetch)
    }

    fetchOrderWithShipData(paramsForFetch)
  }, [user?.custCode, urlSearchParams, appliedOrderSearchParams])

  const handleSearch = () => {
    // 검색 시 페이지를 0으로 초기화하고 URL에 반영
    setOrderSearchParams(prev => ({ ...prev, page: 0 }))
    setAppliedOrderSearchParams({ ...orderSearchParams, page: 0, size: orderSearchParams.size || 10 })
    setUrlSearchParams(prev => {
      const p = new URLSearchParams(prev)
      p.set('page', '0')
      p.set('size', String(orderSearchParams.size || 10))
      return p
    })
  }

  const handleReset = () => {
    const resetParams = {
      itemName1: '',
      itemName2: '',
      spec1: '',
      spec2: '',
      itemNumber: '',
      itemNameOperator: 'AND' as 'AND' | 'OR',
      specOperator: 'AND' as 'AND' | 'OR',
      orderNumber: '',
      siteName: '',
      excludeCompleted: false,
      startDate: '',
      endDate: '',
      page: 0,
      size: 10
    }
    setOrderSearchParams(resetParams)
    setAppliedOrderSearchParams(resetParams)
    setUrlSearchParams(prev => {
      const p = new URLSearchParams(prev)
      p.set('page', '0')
      p.set('size', String(resetParams.size))
      return p
    })
  }



  const handlePageChange = (newPage: number) => {
    setUrlSearchParams(prev => {
      const p = new URLSearchParams(prev)
      p.set('page', String(newPage))
      p.set('size', String(appliedOrderSearchParams.size || 10))
      return p
    })
  }

  const handlePageSizeChange = (newSize: number) => {
    // 드롭다운 표시값도 즉시 반영되도록 로컬 상태 갱신
    setOrderSearchParams(prev => ({
      ...prev,
      size: newSize,
      page: 0
    }))
    setUrlSearchParams(prev => {
      const p = new URLSearchParams(prev)
      p.set('page', '0')
      p.set('size', String(newSize))
      return p
    })
  }

  // 엑셀 내보내기 함수
  const handleExcelExport = async () => {
    if (!user?.custCode) {
      alert('사용자 정보를 불러올 수 없습니다.')
      return
    }

    try {
      setLoading(true)
      
      // 모든 데이터를 한 번에 조회 (페이징 없이)
      const allDataParams = {
        ...appliedOrderSearchParams,
        page: 0,
        size: 10000 // 충분히 큰 수로 설정하여 모든 데이터 조회
      }
      
      const response = await OrderService.getOrderShipmentDetail(parseInt(user.custCode), allDataParams)
      const allOrderData = response.content
      
      if (allOrderData.length === 0) {
        alert('내보낼 데이터가 없습니다.')
        return
      }

      // 엑셀 데이터 형식으로 변환 (19개 컬럼)
      const excelData = allOrderData.map((item, index) => ({
        '번호': index + 1,
        '주문일자': item.orderDate ? 
          `${item.orderDate.substring(0,4)}-${item.orderDate.substring(4,6)}-${item.orderDate.substring(6,8)}` : 
          '-',
        '주문번호': item.orderNumber || '-',
        '납기일자': item.deliveryDate ? 
          `${item.deliveryDate.substring(0,4)}-${item.deliveryDate.substring(4,6)}-${item.deliveryDate.substring(6,8)}` : 
          '-',
        '상태': item.statusDisplayName || item.status || '-',
        '품번': item.itemNumber || '-',
        '품명': item.itemName || '-',
        '규격': item.spec || '-',
        '단위': item.unit || '-',
        '납품현장명': item.siteName || '-',
        '수요처': item.demander || '-',
        '수주수량': item.orderQuantity || 0,
        '할인율(%)': item.discountRate || 0,
        '판매단가': item.unitPrice || 0,
        '공급가': item.orderTranNet || 0,
        '부가세': item.orderTranVat || 0,
        '주문금액': item.orderAmount || 0,
        '출하수량': item.shipQuantity || 0,
        '미출하수량': item.pendingQuantity || 0,
        '미출하금액': item.pendingAmount || 0
      }))

      // 워크북 생성
      const wb = XLSX.utils.book_new()
      const ws = XLSX.utils.json_to_sheet(excelData)

      // 컬럼 너비 설정 (19개 컬럼에 맞게)
      const colWidths = [
        { wch: 6 },  // 번호
        { wch: 12 }, // 주문일자
        { wch: 18 }, // 주문번호
        { wch: 12 }, // 납기일자
        { wch: 12 }, // 상태
        { wch: 18 }, // 품번
        { wch: 25 }, // 품명
        { wch: 15 }, // 규격
        { wch: 8 },  // 단위
        { wch: 25 }, // 납품현장명
        { wch: 20 }, // 수요처
        { wch: 12 }, // 수주수량
        { wch: 10 }, // 할인율
        { wch: 12 }, // 판매단가
        { wch: 15 }, // 공급가
        { wch: 12 }, // 부가세
        { wch: 15 }, // 주문금액
        { wch: 12 }, // 출하수량
        { wch: 12 }, // 미출하수량
        { wch: 15 }  // 미출하금액
      ]
      ws['!cols'] = colWidths

      // 시트 추가
      XLSX.utils.book_append_sheet(wb, ws, '주문서 상세 목록')

      // 파일명 생성 (현재 날짜 포함)
      const today = new Date().toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).replace(/\./g, '').replace(/\s/g, '')
      
      const fileName = `주문서상세목록_${today}.xlsx`

      // 파일 다운로드
      XLSX.writeFile(wb, fileName)
      
      alert(`엑셀 파일이 다운로드되었습니다.\n파일명: ${fileName}\n총 ${allOrderData.length}건`)
      
    } catch (error) {
      console.error('엑셀 내보내기 실패:', error)
      alert('엑셀 내보내기에 실패했습니다.')
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
        <span className="text-custom-primary font-medium">주문서 조회 - 상세</span>
      </div>

      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold" style={{color: '#2A3038'}}>주문서 조회 - 상세</h1>
        <button
          onClick={handleExcelExport}
          disabled={loading}
          className="px-3 py-1 border border-gray-300 bg-white hover:bg-gray-50 rounded-lg text-sm flex items-center gap-2 disabled:opacity-50"
          style={{color: '#2A3038'}}
        >
          <Download className="w-4 h-4" />
          엑셀 내보내기
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
                value={orderSearchParams.itemName1 || ''}
                onChange={(e) => setOrderSearchParams({...orderSearchParams, itemName1: e.target.value})}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-primary focus:border-transparent text-sm"
                placeholder="제품명 입력"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{color: '#2A3038'}}>
                조건
              </label>
              <select
                value={orderSearchParams.itemNameOperator || 'AND'}
                onChange={(e) => setOrderSearchParams({...orderSearchParams, itemNameOperator: e.target.value as 'AND' | 'OR'})}
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
                value={orderSearchParams.itemName2 || ''}
                onChange={(e) => setOrderSearchParams({...orderSearchParams, itemName2: e.target.value})}
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
                value={orderSearchParams.spec1 || ''}
                onChange={(e) => setOrderSearchParams({...orderSearchParams, spec1: e.target.value})}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-primary focus:border-transparent text-sm"
                placeholder="규격 입력"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{color: '#2A3038'}}>
                조건
              </label>
              <select
                value={orderSearchParams.specOperator || 'AND'}
                onChange={(e) => setOrderSearchParams({...orderSearchParams, specOperator: e.target.value as 'AND' | 'OR'})}
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
                value={orderSearchParams.spec2 || ''}
                onChange={(e) => setOrderSearchParams({...orderSearchParams, spec2: e.target.value})}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-primary focus:border-transparent text-sm"
                placeholder="추가 규격"
              />
            </div>
          </div>

          {/* 두 번째 줄: 품번 현장명 주문번호 주문일자 검색 */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
            <div>
              <label className="block text-sm font-medium mb-2" style={{color: '#2A3038'}}>
                품번
              </label>
              <input
                type="text"
                value={orderSearchParams.itemNumber || ''}
                onChange={(e) => setOrderSearchParams({...orderSearchParams, itemNumber: e.target.value})}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-primary focus:border-transparent text-sm"
                placeholder="품번 입력"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{color: '#2A3038'}}>
                현장명
              </label>
              <input
                type="text"
                value={orderSearchParams.siteName || ''}
                onChange={(e) => setOrderSearchParams({...orderSearchParams, siteName: e.target.value})}
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
                value={orderSearchParams.orderNumber || ''}
                onChange={(e) => setOrderSearchParams({...orderSearchParams, orderNumber: e.target.value})}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-primary focus:border-transparent text-sm"
                placeholder="주문번호 입력"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2" style={{color: '#2A3038'}}>
                주문일자
              </label>
              <div className="flex items-center gap-2">
                <RoundedDatePicker
                  value={orderSearchParams.startDate || ''}
                  onChange={(date) => setOrderSearchParams({
                    ...orderSearchParams,
                    startDate: date
                  })}
                  placeholder="시작일을 선택하세요"
                  className="flex-1"
                />
                <span className="text-gray-500 text-sm">~</span>
                <RoundedDatePicker
                  value={orderSearchParams.endDate || ''}
                  onChange={(date) => setOrderSearchParams({
                    ...orderSearchParams,
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
          </div>

          {/* 세 번째 줄: 초기화 버튼 + 완료내역 제외 체크박스 */}
          <div className="flex items-center gap-4 pt-2">
            <div>
              <Button 
                onClick={handleReset}
                variant="outline"
                className="h-10 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                초기화
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="excludeCompleted"
                checked={orderSearchParams.excludeCompleted || false}
                onChange={(e) => setOrderSearchParams({...orderSearchParams, excludeCompleted: e.target.checked})}
                className="w-4 h-4 text-orange-500 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
              />
              <label htmlFor="excludeCompleted" className="text-sm font-medium" style={{color: '#2A3038'}}>
                완료내역 제외
              </label>
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

      {/* 테이블 영역 - 17개 컬럼 with 횡스크롤 */}
      <div className="bg-white rounded-xl card-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1900px]">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium whitespace-nowrap" style={{color: '#2A3038'}}>
                  주문일자
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium whitespace-nowrap" style={{color: '#2A3038'}}>
                  주문번호
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium whitespace-nowrap" style={{color: '#2A3038'}}>
                  납기일자
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium whitespace-nowrap" style={{color: '#2A3038'}}>
                  상태
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium whitespace-nowrap" style={{color: '#2A3038'}}>
                  품번
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium whitespace-nowrap" style={{color: '#2A3038'}}>
                  품명
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium whitespace-nowrap" style={{color: '#2A3038'}}>
                  규격
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium whitespace-nowrap" style={{color: '#2A3038'}}>
                  단위
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium whitespace-nowrap" style={{color: '#2A3038'}}>
                  납품현장명
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium whitespace-nowrap" style={{color: '#2A3038'}}>
                  수요처
                </th>
                <th className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap" style={{color: '#2A3038'}}>
                  수주수량
                </th>
                <th className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap" style={{color: '#2A3038'}}>
                  할인율
                </th>
                <th className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap" style={{color: '#2A3038'}}>
                  판매단가
                </th>
                <th className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap" style={{color: '#2A3038'}}>
                  공급가
                </th>
                <th className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap" style={{color: '#2A3038'}}>
                  부가세
                </th>
                <th className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap" style={{color: '#2A3038'}}>
                  주문금액
                </th>
                <th className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap" style={{color: '#2A3038'}}>
                  출하수량
                </th>
                <th className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap" style={{color: '#2A3038'}}>
                  미출하수량
                </th>
                <th className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap" style={{color: '#2A3038'}}>
                  미출하금액
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={17} className="px-6 py-8 text-center text-sm text-gray-500">
                    로딩 중...
                  </td>
                </tr>
              ) : orderWithShipData.length === 0 ? (
                <tr>
                  <td colSpan={17} className="px-6 py-8 text-center text-sm text-gray-500">
                    조회된 주문 정보가 없습니다.
                  </td>
                </tr>
              ) : (
                orderWithShipData.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{color: '#2A3038'}}>
                      {item.orderDate ? 
                        `${item.orderDate.substring(0,4)}-${item.orderDate.substring(4,6)}-${item.orderDate.substring(6,8)}` : 
                        '-'
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{color: '#2A3038'}}>
                      {item.orderNumber || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{color: '#2A3038'}}>
                      {item.deliveryDate ? 
                        `${item.deliveryDate.substring(0,4)}-${item.deliveryDate.substring(4,6)}-${item.deliveryDate.substring(6,8)}` : 
                        '-'
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="text-sm font-medium" style={{color: '#FF6F0F'}}>
                        {item.statusDisplayName || item.status || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{color: '#2A3038'}}>
                      {item.itemNumber || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{color: '#2A3038'}}>
                      {item.itemName || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{color: '#2A3038'}}>
                      {item.spec || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{color: '#2A3038'}}>
                      {item.unit || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{color: '#2A3038'}}>
                      {item.siteName || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{color: '#2A3038'}}>
                      {item.demander || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right" style={{color: '#2A3038'}}>
                      {item.orderQuantity?.toLocaleString() || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right" style={{color: '#2A3038'}}>
                      {item.discountRate ? `${item.discountRate}%` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right" style={{color: '#2A3038'}}>
                      {item.unitPrice?.toLocaleString() || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right" style={{color: '#2A3038'}}>
                      {(item.orderTranNet ?? (item.orderAmount !== undefined && item.orderTranVat !== undefined ? item.orderAmount - item.orderTranVat : undefined))?.toLocaleString() || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right" style={{color: '#2A3038'}}>
                      {(item.orderTranVat ?? (item.orderAmount !== undefined && item.orderTranNet !== undefined ? item.orderAmount - item.orderTranNet : undefined))?.toLocaleString() || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right" style={{color: '#2A3038'}}>
                      {item.orderAmount?.toLocaleString() || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right" style={{color: '#2A3038'}}>
                      {item.shipQuantity?.toLocaleString() || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right" style={{color: '#2A3038'}}>
                      {item.pendingQuantity?.toLocaleString() || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right" style={{color: '#2A3038'}}>
                      {item.pendingAmount?.toLocaleString() || '-'}
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
                  value={orderSearchParams.size || 20}
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


    </div>
  )
} 