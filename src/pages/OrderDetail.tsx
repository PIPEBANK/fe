import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { OrderService } from '@/services'
import type { OrderDetail } from '@/types'
import PrintOrderDetail from '@/components/ui/PrintOrderDetail'

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>()
  const [orderDetail, setOrderDetail] = useState<OrderDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

    // 인쇄 함수
  const handlePrint = () => {
    if (!orderDetail) return
    PrintOrderDetail.open(orderDetail)
  }

  // 주문 상세 데이터 로드
  useEffect(() => {
    const fetchOrderDetail = async () => {
      if (!id) {
        setError('주문번호가 없습니다.')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        
        // 백엔드 API 호출
        const apiResponse = await OrderService.getOrderDetailByOrderNumber(id)
        
        // UI용 타입으로 변환
        const transformedDetail = OrderService.transformOrderDetail(apiResponse)
        setOrderDetail(transformedDetail)
      } catch (err) {
        console.error('주문 상세조회 실패:', err)
        setError('주문 상세 정보를 불러오는데 실패했습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetchOrderDetail()
  }, [id])

  // 로딩 상태
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-sm text-custom-secondary">
          <span>HOME</span>
          <span>{'>'}</span>
          <span>주문관리</span>
          <span>{'>'}</span>
          <span className="text-custom-primary font-medium">주문서 상세조회</span>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="text-lg text-gray-600">로딩 중...</div>
        </div>
      </div>
    )
  }

  // 에러 상태
  if (error || !orderDetail) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-sm text-custom-secondary">
          <span>HOME</span>
          <span>{'>'}</span>
          <span>주문관리</span>
          <span>{'>'}</span>
          <span className="text-custom-primary font-medium">주문서 상세조회</span>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="text-lg text-red-600">{error || '주문 정보를 찾을 수 없습니다.'}</div>
        </div>
      </div>
    )
  }

  const products = orderDetail.products

  return (
    <div className="space-y-6">
      {/* 브레드크럼 */}
      <div className="flex items-center gap-2 text-sm text-custom-secondary">
        <span>HOME</span>
        <span>{'>'}</span>
        <span>주문관리</span>
        <span>{'>'}</span>
        <span className="text-custom-primary font-medium">주문서 상세조회</span>
      </div>

      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold" style={{color: '#2A3038'}}>주문서 상세조회</h1>
      </div>

      {/* 주문 상세 정보 */}
      <div className="bg-white border border-gray-300 p-4">
        <div className="grid grid-cols-2 gap-1">
          {/* 왼쪽 열 */}
          <div className="border border-gray-300">
            <div className="grid grid-cols-5 border-b border-gray-300">
              <div className="col-span-1 p-2 text-sm font-medium border-r border-gray-300 bg-gray-100" style={{color: '#2A3038'}}>
                주문번호
              </div>
              <div className="col-span-4 p-2 text-sm" style={{color: '#2A3038'}}>
                {orderDetail.orderNumber}
              </div>
            </div>
            <div className="grid grid-cols-5 border-b border-gray-300">
              <div className="col-span-1 p-2 text-sm font-medium border-r border-gray-300 bg-gray-100" style={{color: '#2A3038'}}>
                주문일자
              </div>
              <div className="col-span-4 p-2 text-sm" style={{color: '#2A3038'}}>
                {orderDetail.orderMastDate}
              </div>
            </div>
            <div className="grid grid-cols-5 border-b border-gray-300">
              <div className="col-span-1 p-2 text-sm font-medium border-r border-gray-300 bg-gray-100" style={{color: '#2A3038'}}>
                현장명
              </div>
              <div className="col-span-4 p-2 text-sm" style={{color: '#2A3038'}}>
                {orderDetail.orderMastComname || '-'}
              </div>
            </div>
            <div className="grid grid-cols-5 border-b border-gray-300">
              <div className="col-span-1 p-2 text-sm font-medium border-r border-gray-300 bg-gray-100" style={{color: '#2A3038'}}>
                출고형태
              </div>
              <div className="col-span-4 p-2 text-sm" style={{color: '#2A3038'}}>
                {orderDetail.orderMastSdivDisplayName}
              </div>
            </div>
            <div className="grid grid-cols-5 border-b border-gray-300">
              <div className="col-span-1 p-2 text-sm font-medium border-r border-gray-300 bg-gray-100" style={{color: '#2A3038'}}>
                화폐/환율
              </div>
              <div className="col-span-4 p-2 text-sm" style={{color: '#2A3038'}}>
                {orderDetail.orderMastCurrency}
              </div>
            </div>
            <div className="grid grid-cols-5 border-b border-gray-300">
              <div className="col-span-1 p-2 text-sm font-medium border-r border-gray-300 bg-gray-100" style={{color: '#2A3038'}}>
                인수자
              </div>
              <div className="col-span-4 p-2 text-sm" style={{color: '#2A3038'}}>
                {orderDetail.orderMastComuname}
              </div>
            </div>
            <div className="grid grid-cols-5">
              <div className="col-span-1 p-2 text-sm font-medium border-r border-gray-300 bg-gray-100" style={{color: '#2A3038'}}>
                인수자 연락처
              </div>
              <div className="col-span-4 p-2 text-sm" style={{color: '#2A3038'}}>
                {orderDetail.orderMastComutel}
              </div>
            </div>
          </div>

                    {/* 오른쪽 열 */}
          <div className="border border-gray-300">
            <div className="grid grid-cols-5 border-b border-gray-300">
              <div className="col-span-1 p-2 text-sm font-medium border-r border-gray-300 bg-gray-100" style={{color: '#2A3038'}}>
                주문 총금액
              </div>
              <div className="col-span-4 p-2 text-sm font-bold" style={{color: '#FF6F0F'}}>
                {orderDetail.orderTranTotalAmount}
              </div>
            </div>
            <div className="grid grid-cols-5 border-b border-gray-300">
              <div className="col-span-1 p-2 text-sm font-medium border-r border-gray-300 bg-gray-100" style={{color: '#2A3038'}}>
                미출고 총금액
              </div>
              <div className="col-span-4 p-2 text-sm font-bold" style={{color: '#FF6F0F'}}>
                {orderDetail.pendingTotalAmount}
              </div>
            </div>
            <div className="grid grid-cols-5 border-b border-gray-300">
              <div className="col-span-1 p-2 text-sm font-medium border-r border-gray-300 bg-gray-100" style={{color: '#2A3038'}}>
                도착요구일
              </div>
              <div className="col-span-4 p-2 text-sm" style={{color: '#2A3038'}}>
                {orderDetail.orderMastOdate}
              </div>
            </div>
            <div className="grid grid-cols-5 border-b border-gray-300">
              <div className="col-span-1 p-2 text-sm font-medium border-r border-gray-300 bg-gray-100" style={{color: '#2A3038'}}>
                납품현장주소
              </div>
              <div className="col-span-4 p-2 text-sm" style={{color: '#2A3038'}}>
                {orderDetail.orderMastComaddr}
              </div>
            </div>
            <div className="grid grid-cols-5 border-b border-gray-300">
              <div className="col-span-1 p-2 text-sm font-medium border-r border-gray-300 bg-gray-100" style={{color: '#2A3038'}}>
                수요처
              </div>
              <div className="col-span-4 p-2 text-sm" style={{color: '#2A3038'}}>
                {orderDetail.orderMastDcust}
              </div>
            </div>
            <div className="grid grid-cols-5 border-b border-gray-300">
              <div className="col-span-1 p-2 text-sm font-medium border-r border-gray-300 bg-gray-100" style={{color: '#2A3038'}}>
                용도
              </div>
              <div className="col-span-4 p-2 text-sm" style={{color: '#2A3038'}}>
                {orderDetail.orderMastReasonDisplayName}
              </div>
            </div>
            <div className="grid grid-cols-5">
              <div className="col-span-1 p-2 text-sm font-medium border-r border-gray-300 bg-gray-100" style={{color: '#2A3038'}}>
                -
              </div>
              <div className="col-span-4 p-2 text-sm" style={{color: '#2A3038'}}>
                -
              </div>
            </div>
          </div>
        </div>

        {/* 비고 - 기존 그리드와 같은 스타일로 통합 */}
        <div className="grid grid-cols-2 gap-1 mt-1">
          <div className="col-span-2 border border-gray-300">
            <div className="grid grid-cols-24">
              <div className="col-span-1 p-2 text-sm font-medium border-r border-gray-300 bg-gray-100" style={{color: '#2A3038'}}>
                비고
              </div>
              <div className="col-span-23 p-2 text-sm" style={{color: '#2A3038'}}>
                {orderDetail.orderMastRemark}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 제품 목록 */}
      <div className="bg-white border border-gray-300 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold" style={{color: '#2A3038'}}>제품목록</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2 text-left text-sm font-medium border-b border-r border-gray-300" style={{color: '#2A3038'}}>
                  출하번호
                </th>
                <th className="px-3 py-2 text-left text-sm font-medium border-b border-r border-gray-300" style={{color: '#2A3038'}}>
                  제품코드
                </th>
                <th className="px-3 py-2 text-left text-sm font-medium border-b border-r border-gray-300" style={{color: '#2A3038'}}>
                  제품명
                </th>
                <th className="px-3 py-2 text-left text-sm font-medium border-b border-r border-gray-300" style={{color: '#2A3038'}}>
                  규격
                </th>
                <th className="px-3 py-2 text-left text-sm font-medium border-b border-r border-gray-300" style={{color: '#2A3038'}}>
                  단위
                </th>
                <th className="px-3 py-2 text-left text-sm font-medium border-b border-r border-gray-300" style={{color: '#2A3038'}}>
                  주문량
                </th>
                <th className="px-3 py-2 text-left text-sm font-medium border-b border-r border-gray-300" style={{color: '#2A3038'}}>
                  출하량
                </th>
                <th className="px-3 py-2 text-left text-sm font-medium border-b border-r border-gray-300" style={{color: '#2A3038'}}>
                  주문잔량
                </th>
                <th className="px-3 py-2 text-left text-sm font-medium border-b border-r border-gray-300" style={{color: '#2A3038'}}>
                  단가
                </th>
                <th className="px-3 py-2 text-left text-sm font-medium border-b border-r border-gray-300" style={{color: '#2A3038'}}>
                  금액
                </th>
                <th className="px-3 py-2 text-left text-sm font-medium border-b border-gray-300" style={{color: '#2A3038'}}>
                  상태
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2 text-xs border-r border-gray-300" style={{color: '#2A3038'}}>
                    {product.shipNumber || '-'}
                  </td>
                  <td className="px-3 py-2 text-xs border-r border-gray-300" style={{color: '#2A3038'}}>
                    {product.productCode}
                  </td>
                  <td className="px-3 py-2 text-xs border-r border-gray-300" style={{color: '#2A3038'}}>
                    {product.productName}
                  </td>
                  <td className="px-3 py-2 text-xs border-r border-gray-300" style={{color: '#2A3038'}}>
                    {product.specification}
                  </td>
                  <td className="px-3 py-2 text-xs border-r border-gray-300" style={{color: '#2A3038'}}>
                    {product.unit}
                  </td>
                  <td className="px-3 py-2 text-xs border-r border-gray-300" style={{color: '#2A3038'}}>
                    {product.quantity?.toLocaleString()}
                  </td>
                  <td className="px-3 py-2 text-xs border-r border-gray-300" style={{color: '#2A3038'}}>
                    {product.shipQuantity?.toLocaleString() || '0'}
                  </td>
                  <td className="px-3 py-2 text-xs border-r border-gray-300" style={{color: '#2A3038'}}>
                    {product.remainQuantity?.toLocaleString() || '0'}
                  </td>
                  <td className="px-3 py-2 text-xs border-r border-gray-300" style={{color: '#2A3038'}}>
                    {product.unitPrice?.toLocaleString()}원
                  </td>
                  <td className="px-3 py-2 text-xs border-r border-gray-300" style={{color: '#2A3038'}}>
                    {product.totalPrice?.toLocaleString()}원
                  </td>
                  <td className="px-3 py-2 text-xs" style={{color: '#FF6F0F'}}>
                    {product.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 액션 버튼 */}
      <div className="flex justify-center gap-2">
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 border border-gray-300 bg-white hover:bg-gray-100 text-xs font-medium text-custom-primary rounded-sm"
        >
          목록보기
        </button>
        <button
          onClick={handlePrint}
          className="px-4 py-2 border border-gray-300 bg-white hover:bg-gray-100 text-xs font-medium text-custom-primary rounded-sm"
        >
          인쇄하기
        </button>
      </div>
    </div>
  )
} 