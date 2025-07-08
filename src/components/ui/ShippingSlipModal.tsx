import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { OrderService } from '@/services'
import type { ShipSlipResponse } from '@/types'

interface ShippingSlipModalProps {
  isOpen: boolean
  onClose: () => void
  orderNumber: string // 전표번호로 사용됨
}

export default function ShippingSlipModal({ 
  isOpen, 
  onClose, 
  orderNumber 
}: ShippingSlipModalProps) {
  const [slipData, setSlipData] = useState<ShipSlipResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 전표번호별 출고전표현황 조회
  useEffect(() => {
    if (isOpen && orderNumber) {
      const fetchShipSlipDetail = async () => {
        try {
          setLoading(true)
          setError(null)
          const data = await OrderService.getShipSlipDetail(orderNumber)
          setSlipData(data)
        } catch (err) {
          console.error('출고전표현황 조회 실패:', err)
          setError('출고전표현황을 불러오는데 실패했습니다.')
        } finally {
          setLoading(false)
        }
      }
      
      fetchShipSlipDetail()
    }
  }, [isOpen, orderNumber])

  if (!isOpen) return null

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
                  매출확정금액
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
              ) : slipData && slipData.details.length > 0 ? (
                <>
                  {slipData.details.map((slip, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm" style={{color: '#2A3038'}}>
                        {slip.slipNumber}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm" style={{color: '#2A3038'}}>
                        {slip.shipTranDate}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm" style={{color: '#2A3038'}}>
                        {slip.shipTranDeta}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm" style={{color: '#2A3038'}}>
                        {slip.shipTranCnt}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm" style={{color: '#2A3038'}}>
                        {slip.shipTranRate.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm" style={{color: '#2A3038'}}>
                        {slip.shipTranTot.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm" style={{color: '#2A3038'}}>
                        {slip.shipTranTot.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  {/* 합계 행 - 백엔드에서 제공하는 합계 데이터 사용 */}
                  <tr className="bg-orange-50 font-medium">
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
                      {slipData.totalQuantity}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm" style={{color: '#2A3038'}}>
                      {slipData.totalRate.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm" style={{color: '#2A3038'}}>
                      {slipData.totalAmount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm" style={{color: '#2A3038'}}>
                      {slipData.totalAmount.toLocaleString()}
                    </td>
                  </tr>
                </>
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    해당 전표번호의 전표 정보가 없습니다.
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

// 타입은 백엔드 API 응답인 ShipSlipResponse 사용 