import { useParams } from 'react-router-dom'
import type { OrderProduct } from '@/types'

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>()

  // 하드코딩된 주문 상세 데이터
  const orderDetail = {
    orderNumber: id || '20250701-4',
    orderDate: '2025-07-01',
    customerOrderNumber: '프로그램 등록',
    deliveryType: '일반판매',
    requiredDate: '2025-07-02 09시',
    recipient: '동양파이프',
    deliveryAddress: '서울특별시 동대문구 장안로 13길 4 ()',
    recipientContact: '02-2293-1007',
    currency: '한국(KRW) / 1',
    demandSite: '(주)동양파이프',
    usage: '재고보충-기본생성',
    memo: '직접입수 / 동양파이프 02-2293-1007 # 장안 현장 직접인수건 강승구'
  }

  // 하드코딩된 제품 데이터
  const products: OrderProduct[] = [
    {
      id: '1',
      productCode: '123002-010050',
      productName: '수도90엘보(사출)',
      specification: '1-50',
      quantity: 1,
      unit: 'ea',
      discount: 35,
      unitPrice: 5941,
      totalPrice: 6535,
      status: '출하완료'
    }
  ]

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
                고객주문번호
              </div>
              <div className="col-span-4 p-2 text-sm" style={{color: '#2A3038'}}>
                {orderDetail.customerOrderNumber}
              </div>
            </div>
            <div className="grid grid-cols-5 border-b border-gray-300">
              <div className="col-span-1 p-2 text-sm font-medium border-r border-gray-300 bg-gray-100" style={{color: '#2A3038'}}>
                도착요구일
              </div>
              <div className="col-span-4 p-2 text-sm" style={{color: '#2A3038'}}>
                {orderDetail.requiredDate}
              </div>
            </div>
            <div className="grid grid-cols-5 border-b border-gray-300">
              <div className="col-span-1 p-2 text-sm font-medium border-r border-gray-300 bg-gray-100" style={{color: '#2A3038'}}>
                납품현장
              </div>
              <div className="col-span-4 p-2 text-sm" style={{color: '#2A3038'}}>
                {orderDetail.deliveryAddress}
              </div>
            </div>
            <div className="grid grid-cols-5 border-b border-gray-300">
              <div className="col-span-1 p-2 text-sm font-medium border-r border-gray-300 bg-gray-100" style={{color: '#2A3038'}}>
                화폐/환율
              </div>
              <div className="col-span-4 p-2 text-sm" style={{color: '#2A3038'}}>
                {orderDetail.currency}
              </div>
            </div>
            <div className="grid grid-cols-5">
              <div className="col-span-1 p-2 text-sm font-medium border-r border-gray-300 bg-gray-100" style={{color: '#2A3038'}}>
                인수자
              </div>
              <div className="col-span-4 p-2 text-sm" style={{color: '#2A3038'}}>
                {orderDetail.recipient}
              </div>
            </div>
          </div>

          {/* 오른쪽 열 */}
          <div className="border border-gray-300">
            <div className="grid grid-cols-5 border-b border-gray-300">
              <div className="col-span-1 p-2 text-sm font-medium border-r border-gray-300 bg-gray-100" style={{color: '#2A3038'}}>
                주문일자
              </div>
              <div className="col-span-4 p-2 text-sm" style={{color: '#2A3038'}}>
                {orderDetail.orderDate}
              </div>
            </div>
            <div className="grid grid-cols-5 border-b border-gray-300">
              <div className="col-span-1 p-2 text-sm font-medium border-r border-gray-300 bg-gray-100" style={{color: '#2A3038'}}>
                출고형태
              </div>
              <div className="col-span-4 p-2 text-sm" style={{color: '#2A3038'}}>
                {orderDetail.deliveryType}
              </div>
            </div>
            <div className="grid grid-cols-5 border-b border-gray-300">
              <div className="col-span-1 p-2 text-sm font-medium border-r border-gray-300 bg-gray-100" style={{color: '#2A3038'}}>
                수요처
              </div>
              <div className="col-span-4 p-2 text-sm" style={{color: '#2A3038'}}>
                {orderDetail.demandSite}
              </div>
            </div>
            <div className="grid grid-cols-5 border-b border-gray-300">
              <div className="col-span-1 p-2 text-sm font-medium border-r border-gray-300 bg-gray-100" style={{color: '#2A3038'}}>
                현장명
              </div>
              <div className="col-span-4 p-2 text-sm" style={{color: '#2A3038'}}>
                {orderDetail.demandSite}
              </div>
            </div>
            <div className="grid grid-cols-5 border-b border-gray-300">
              <div className="col-span-1 p-2 text-sm font-medium border-r border-gray-300 bg-gray-100" style={{color: '#2A3038'}}>
                용도
              </div>
              <div className="col-span-4 p-2 text-sm" style={{color: '#2A3038'}}>
                {orderDetail.usage}
              </div>
            </div>
            <div className="grid grid-cols-5">
              <div className="col-span-1 p-2 text-sm font-medium border-r border-gray-300 bg-gray-100" style={{color: '#2A3038'}}>
                인수자 연락처
              </div>
              <div className="col-span-4 p-2 text-sm" style={{color: '#2A3038'}}>
                {orderDetail.recipientContact}
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
                {orderDetail.memo}
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
                  수량
                </th>
                <th className="px-3 py-2 text-left text-sm font-medium border-b border-r border-gray-300" style={{color: '#2A3038'}}>
                  DC(%)
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
                    {product.quantity}
                  </td>
                  <td className="px-3 py-2 text-xs border-r border-gray-300" style={{color: '#2A3038'}}>
                    {product.discount}
                  </td>
                  <td className="px-3 py-2 text-xs border-r border-gray-300" style={{color: '#2A3038'}}>
                    {product.unitPrice?.toLocaleString()}
                  </td>
                  <td className="px-3 py-2 text-xs border-r border-gray-300" style={{color: '#2A3038'}}>
                    {product.totalPrice?.toLocaleString()}
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
          onClick={() => window.print()}
          className="px-4 py-2 border border-gray-300 bg-white hover:bg-gray-100 text-xs font-medium text-custom-primary rounded-sm"
        >
          인쇄하기
        </button>
      </div>
    </div>
  )
} 