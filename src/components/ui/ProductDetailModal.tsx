import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

interface ProductDetail {
  productCode: string
  productName: string
  specification: string
  unit: string
  orderQuantity: number
  shippedQuantity: number
  remainingQuantity: number
}

interface ProductDetailModalProps {
  isOpen: boolean
  onClose: () => void
  orderNumber: string
  products: ProductDetail[]
}

export default function ProductDetailModal({ 
  isOpen, 
  onClose, 
  orderNumber, 
  products 
}: ProductDetailModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold" style={{color: '#2A3038'}}>
            제품별 현황 (단위:EA) - {orderNumber}
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
                  제품코드
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium border-r border-gray-300" style={{color: '#2A3038'}}>
                  제품명
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium border-r border-gray-300" style={{color: '#2A3038'}}>
                  규격
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium border-r border-gray-300" style={{color: '#2A3038'}}>
                  단위
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium border-r border-gray-300" style={{color: '#2A3038'}}>
                  주문량
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium border-r border-gray-300" style={{color: '#2A3038'}}>
                  출고량
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium" style={{color: '#2A3038'}}>
                  주문잔량
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.length > 0 ? (
                products.map((product, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm" style={{color: '#2A3038'}}>
                      {product.productCode}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm" style={{color: '#2A3038'}}>
                      {product.productName}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm" style={{color: '#2A3038'}}>
                      {product.specification}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm" style={{color: '#2A3038'}}>
                      {product.unit}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm" style={{color: '#2A3038'}}>
                      {product.orderQuantity}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm" style={{color: '#2A3038'}}>
                      {product.shippedQuantity}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm" style={{color: '#2A3038'}}>
                      {product.remainingQuantity}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    해당 주문번호의 제품 정보가 없습니다.
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

export type { ProductDetail } 