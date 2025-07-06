import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

interface ShippingSlipDetail {
  slipNumber: string
  shippingDate: string
  productName: string
  quantity: number
  unitPrice: number
  shippingAmount: number
  deliveryCompleteAmount: number
}

interface ShippingSlipModalProps {
  isOpen: boolean
  onClose: () => void
  orderNumber: string
  slipDetails: ShippingSlipDetail[]
}

export default function ShippingSlipModal({ 
  isOpen, 
  onClose, 
  orderNumber, 
  slipDetails 
}: ShippingSlipModalProps) {
  if (!isOpen) return null

  // 합계 계산
  const totals = slipDetails.reduce((acc, item) => ({
    quantity: acc.quantity + item.quantity,
    unitPrice: acc.unitPrice + item.unitPrice,
    shippingAmount: acc.shippingAmount + item.shippingAmount,
    deliveryCompleteAmount: acc.deliveryCompleteAmount + item.deliveryCompleteAmount
  }), { quantity: 0, unitPrice: 0, shippingAmount: 0, deliveryCompleteAmount: 0 })

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-5xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold" style={{color: '#2A3038'}}>
            출고전표 현황 - {orderNumber}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="bg-white rounded-lg overflow-hidden border">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium border-r border-gray-300" style={{color: '#2A3038'}}>
                  출고전표번호
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium border-r border-gray-300" style={{color: '#2A3038'}}>
                  출고일
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium border-r border-gray-300" style={{color: '#2A3038'}}>
                  제품명
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium border-r border-gray-300" style={{color: '#2A3038'}}>
                  수량
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium border-r border-gray-300" style={{color: '#2A3038'}}>
                  단가
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium border-r border-gray-300" style={{color: '#2A3038'}}>
                  출고금액
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium" style={{color: '#2A3038'}}>
                  배송완료금액
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {slipDetails.length > 0 ? (
                <>
                  {slipDetails.map((slip, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm" style={{color: '#2A3038'}}>
                        {slip.slipNumber}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm" style={{color: '#2A3038'}}>
                        {slip.shippingDate}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm" style={{color: '#2A3038'}}>
                        {slip.productName}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm" style={{color: '#2A3038'}}>
                        {slip.quantity}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm" style={{color: '#2A3038'}}>
                        {slip.unitPrice.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm" style={{color: '#2A3038'}}>
                        {slip.shippingAmount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm" style={{color: '#2A3038'}}>
                        {slip.deliveryCompleteAmount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  {/* 합계 행 */}
                  <tr className="bg-blue-50 font-medium">
                    <td className="px-4 py-3 whitespace-nowrap text-sm" style={{color: '#2A3038'}}>
                      합계
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm" style={{color: '#2A3038'}}>
                      -
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm" style={{color: '#2A3038'}}>
                      -
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm" style={{color: '#2A3038'}}>
                      {totals.quantity}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm" style={{color: '#2A3038'}}>
                      {totals.unitPrice.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm" style={{color: '#2A3038'}}>
                      {totals.shippingAmount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm" style={{color: '#2A3038'}}>
                      {totals.deliveryCompleteAmount.toLocaleString()}
                    </td>
                  </tr>
                </>
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    해당 주문번호의 전표 정보가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="flex justify-end mt-4">
          <Button
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white"
          >
            닫기
          </Button>
        </div>
      </div>
    </div>
  )
}

export type { ShippingSlipDetail } 