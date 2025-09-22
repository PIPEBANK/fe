import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { OrderService } from '@/services'
import type { OrderDetail } from '@/types'
import PrintOrderDetail from '@/components/ui/PrintOrderDetail'
import * as XLSX from 'xlsx'

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

  // 엑셀 내보내기
  const handleExcelExport = () => {
    if (!orderDetail) return

    // 1) 주문 정보 시트
    const orderInfoRows = [
      { 항목: '주문번호', 값: orderDetail.orderNumber },
      { 항목: '주문일자', 값: orderDetail.orderMastDate },
      { 항목: '현장명', 값: orderDetail.orderMastComname || '-' },
      { 항목: '출고형태', 값: orderDetail.orderMastSdivDisplayName },
      { 항목: '도착요구일', 값: orderDetail.orderMastOdate },
      { 항목: '납품현장주소', 값: orderDetail.orderMastComaddr },
      { 항목: '수요처', 값: orderDetail.orderMastDcust },
      { 항목: '용도', 값: orderDetail.orderMastReasonDisplayName },
      { 항목: '화폐/환율', 값: orderDetail.orderMastCurrency },
      { 항목: '주문 총금액(VAT 별도)', 값: orderDetail.orderTranTotalAmount.replace(/원/g, '') },
      { 항목: '미출고 총금액(VAT 별도)', 값: orderDetail.pendingTotalAmount.replace(/원/g, '') },
      { 항목: '비고', 값: orderDetail.orderMastRemark || '' },
    ]
    const wb = XLSX.utils.book_new()
    const wsInfo = XLSX.utils.json_to_sheet(orderInfoRows)
    wsInfo['!cols'] = [{ wch: 18 }, { wch: 60 }]
    XLSX.utils.book_append_sheet(wb, wsInfo, '주문정보')

    // 2) 제품 목록 시트 (화면 테이블과 동일 컬럼)
    const products = orderDetail.products
    const productRows = products.map((p, idx) => ({
      번호: idx + 1,
      출하번호: p.shipNumber || '-',
      제품코드: p.productCode,
      제품명: p.productName,
      규격: p.specification,
      단위: p.unit,
      주문량: p.quantity ?? 0,
      출하량: p.shipQuantity ?? 0,
      주문잔량: p.remainQuantity ?? 0,
      판매단가: p.unitPrice ?? 0,
      공급가: (p.netAmount ?? (p.totalPrice !== undefined && p.vatAmount !== undefined ? p.totalPrice - p.vatAmount : 0)) ?? 0,
      부가세: (p.vatAmount ?? (p.totalPrice !== undefined && p.netAmount !== undefined ? p.totalPrice - p.netAmount : 0)) ?? 0,
      주문금액: p.totalPrice ?? 0,
      상태: p.status,
    }))
    const wsProducts = XLSX.utils.json_to_sheet(productRows)
    wsProducts['!cols'] = [
      { wch: 6 },  // 번호
      { wch: 16 }, // 출하번호
      { wch: 18 }, // 제품코드
      { wch: 28 }, // 제품명
      { wch: 24 }, // 규격
      { wch: 8 },  // 단위
      { wch: 10 }, // 주문량
      { wch: 10 }, // 출하량
      { wch: 10 }, // 주문잔량
      { wch: 12 }, // 판매단가
      { wch: 12 }, // 공급가
      { wch: 12 }, // 부가세
      { wch: 12 }, // 주문금액
      { wch: 12 }, // 상태
    ]
    XLSX.utils.book_append_sheet(wb, wsProducts, '제품목록')

    // 파일명: 주문서상세_주문번호.xlsx
    const fileName = `주문서상세_${orderDetail.orderNumber}.xlsx`
    XLSX.writeFile(wb, fileName)
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
                {orderDetail.orderTranTotalAmount.replace(/원/g, '')} (VAT 별도)
              </div>
            </div>
            <div className="grid grid-cols-5 border-b border-gray-300">
              <div className="col-span-1 p-2 text-sm font-medium border-r border-gray-300 bg-gray-100" style={{color: '#2A3038'}}>
                미출고 총금액
              </div>
              <div className="col-span-4 p-2 text-sm font-bold" style={{color: '#FF6F0F'}}>
                {orderDetail.pendingTotalAmount.replace(/원/g, '')} (VAT 별도)
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
                <th className="px-3 py-2 text-right text-sm font-medium border-b border-r border-gray-300" style={{color: '#2A3038'}}>
                  주문량
                </th>
                <th className="px-3 py-2 text-right text-sm font-medium border-b border-r border-gray-300" style={{color: '#2A3038'}}>
                  출하량
                </th>
                <th className="px-3 py-2 text-right text-sm font-medium border-b border-r border-gray-300" style={{color: '#2A3038'}}>
                  주문잔량
                </th>
                <th className="px-3 py-2 text-right text-sm font-medium border-b border-r border-gray-300" style={{color: '#2A3038'}}>
                  판매단가
                </th>
                <th className="px-3 py-2 text-right text-sm font-medium border-b border-r border-gray-300" style={{color: '#2A3038'}}>
                  공급가
                </th>
                <th className="px-3 py-2 text-right text-sm font-medium border-b border-r border-gray-300" style={{color: '#2A3038'}}>
                  부가세
                </th>
                <th className="px-3 py-2 text-right text-sm font-medium border-b border-r border-gray-300" style={{color: '#2A3038'}}>
                 주문금액
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
                  <td className="px-3 py-2 text-xs border-r border-gray-300 text-right" style={{color: '#2A3038'}}>
                    {product.quantity?.toLocaleString()}
                  </td>
                  <td className="px-3 py-2 text-xs border-r border-gray-300 text-right" style={{color: '#2A3038'}}>
                    {product.shipQuantity?.toLocaleString() || '0'}
                  </td>
                  <td className="px-3 py-2 text-xs border-r border-gray-300 text-right" style={{color: '#2A3038'}}>
                    {product.remainQuantity?.toLocaleString() || '0'}
                  </td>
                  <td className="px-3 py-2 text-xs border-r border-gray-300 text-right" style={{color: '#2A3038'}}>
                    {(product.unitPrice ?? 0).toLocaleString()}
                  </td>
                  <td className="px-3 py-2 text-xs border-r border-gray-300 text-right" style={{color: '#2A3038'}}>
                    {(
                      (product.netAmount ?? (
                        product.totalPrice !== undefined && product.vatAmount !== undefined
                          ? product.totalPrice - product.vatAmount
                          : undefined
                      )) ?? 0
                    ).toLocaleString()}
                  </td>
                  <td className="px-3 py-2 text-xs border-r border-gray-300 text-right" style={{color: '#2A3038'}}>
                    {(
                      (product.vatAmount ?? (
                        product.totalPrice !== undefined && product.netAmount !== undefined
                          ? product.totalPrice - product.netAmount
                          : undefined
                      )) ?? 0
                    ).toLocaleString()}
                  </td>
                  <td className="px-3 py-2 text-xs border-r border-gray-300 text-right" style={{color: '#2A3038'}}>
                    {(product.totalPrice ?? 0).toLocaleString()}
                  </td>
                  <td className="px-3 py-2 text-xs" style={{color: '#FF6F0F'}}>
                    {product.status}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50">
                <td className="px-3 py-2 text-xs border-t border-r border-gray-300" style={{color: '#2A3038'}} colSpan={5}>
                  합계
                </td>
                <td className="px-3 py-2 text-xs font-semibold border-t border-r border-gray-300 text-right" style={{color: '#2A3038'}}>
                  {orderDetail.orderTranCntTotal?.toLocaleString()}
                </td>
                <td className="px-3 py-2 text-xs font-semibold border-t border-r border-gray-300 text-right" style={{color: '#2A3038'}}>
                  {orderDetail.shipQuantityTotal?.toLocaleString()}
                </td>
                <td className="px-3 py-2 text-xs font-semibold border-t border-r border-gray-300 text-right" style={{color: '#2A3038'}}>
                  {(Number(orderDetail.orderTranCntTotal || 0) - Number(orderDetail.shipQuantityTotal || 0)).toLocaleString()}
                </td>
                <td className="px-3 py-2 text-xs font-semibold border-t border-r border-gray-300 text-right" style={{color: '#2A3038'}}>
                  {Number(orderDetail.orderTranAmtTotal || 0).toLocaleString()}
                </td>
                <td className="px-3 py-2 text-xs font-semibold border-t border-r border-gray-300 text-right" style={{color: '#2A3038'}}>
                  {Number(orderDetail.orderTranNetTotal || 0).toLocaleString()}
                </td>
                <td className="px-3 py-2 text-xs font-semibold border-t border-r border-gray-300 text-right" style={{color: '#2A3038'}}>
                  {Number(orderDetail.orderTranVatTotal || 0).toLocaleString()}
                </td>
                <td className="px-3 py-2 text-xs font-semibold border-t border-gray-300 text-right" style={{color: '#2A3038'}}>
                  {Number(orderDetail.orderTranTotTotal || 0).toLocaleString()}
                </td>
                <td className="px-3 py-2 text-xs font-semibold border-t border-gray-300" style={{color: '#2A3038'}}></td>
              </tr>
            </tfoot>
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
        <button
          onClick={handleExcelExport}
          className="px-4 py-2 border border-gray-300 bg-white hover:bg-gray-100 text-xs font-medium text-custom-primary rounded-sm"
        >
          엑셀 내보내기
        </button>
      </div>
    </div>
  )
} 