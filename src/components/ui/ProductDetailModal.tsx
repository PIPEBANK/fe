import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { OrderService } from '@/services'
import type { ShipmentDetailResponse } from '@/types'

interface ProductDetailModalProps {
  isOpen: boolean
  onClose: () => void
  orderNumber: string // 출하번호로 사용됨
}

export default function ProductDetailModal({ 
  isOpen, 
  onClose, 
  orderNumber 
}: ProductDetailModalProps) {
  const [products, setProducts] = useState<ShipmentDetailResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 출하번호별 출고현황 조회
  useEffect(() => {
    if (isOpen && orderNumber) {
      const fetchShipmentDetail = async () => {
        try {
          setLoading(true)
          setError(null)
          const data = await OrderService.getShipmentDetail(orderNumber)
          setProducts(data)
        } catch (err) {
          console.error('출고현황 조회 실패:', err)
          setError('출고현황을 불러오는데 실패했습니다.')
        } finally {
          setLoading(false)
        }
      }
      
      fetchShipmentDetail()
    }
  }, [isOpen, orderNumber])

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
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    로딩 중...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-red-500">
                    {error}
                  </td>
                </tr>
              ) : products.length > 0 ? (
                products.map((product, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm" style={{color: '#2A3038'}}>
                      {product.itemCodeNum}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm" style={{color: '#2A3038'}}>
                      {product.shipTranDeta}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm" style={{color: '#2A3038'}}>
                      {product.shipTranSpec}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm" style={{color: '#2A3038'}}>
                      {product.shipTranUnit}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm" style={{color: '#2A3038'}}>
                      {product.orderQuantity}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm" style={{color: '#2A3038'}}>
                      {product.shipQuantity}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm" style={{color: '#2A3038'}}>
                      {product.remainQuantity}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    해당 출하번호의 제품 정보가 없습니다.
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

// 타입은 백엔드 API 응답인 ShipmentDetailResponse 사용 