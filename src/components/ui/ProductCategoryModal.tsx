import { useState, useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import type { 
  OrderProduct, 
  ItemDiv1Response, 
  ItemDiv2Response, 
  ItemDiv3Response, 
  ItemDiv4Response, 
  ItemSelectionResponse 
} from '@/types'
import { itemService } from '@/services'

interface ProductCategoryModalProps {
  isOpen: boolean
  onClose: () => void
  onProductSelect: (products: OrderProduct[]) => void
  existingProducts?: OrderProduct[]
}

export default function ProductCategoryModal({ 
  isOpen, 
  onClose, 
  onProductSelect, 
  existingProducts = [] 
}: ProductCategoryModalProps) {
  const [selectedProducts, setSelectedProducts] = useState<OrderProduct[]>([])
  
  // 분류 선택 상태
  const [selectedDiv1, setSelectedDiv1] = useState<string>('')
  const [selectedDiv2, setSelectedDiv2] = useState<string>('')
  const [selectedDiv3, setSelectedDiv3] = useState<string>('')
  const [selectedDiv4, setSelectedDiv4] = useState<string>('')
  
  // API 데이터 상태
  const [div1List, setDiv1List] = useState<ItemDiv1Response[]>([])
  const [div2List, setDiv2List] = useState<ItemDiv2Response[]>([])
  const [div3List, setDiv3List] = useState<ItemDiv3Response[]>([])
  const [div4List, setDiv4List] = useState<ItemDiv4Response[]>([])
  const [finalItems, setFinalItems] = useState<ItemSelectionResponse[]>([])
  
  // 로딩 상태
  const [loading, setLoading] = useState(false)

  // 선택된 제품 목록 스크롤 참조
  const selectedListRef = useRef<HTMLDivElement>(null)

  // 컴포넌트 마운트 시 제품종류(DIV1) 데이터 로드
  useEffect(() => {
    if (isOpen) {
      loadDiv1Data()
    }
  }, [isOpen])

  // 제품종류(DIV1) 데이터 로드
  const loadDiv1Data = async () => {
    try {
      setLoading(true)
      const data = await itemService.getItemDiv1List()
      setDiv1List(data)
    } catch (error) {
      console.error('제품종류 데이터 로드 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  // 제품군(DIV2) 데이터 로드
  const loadDiv2Data = async (div1: string) => {
    try {
      setLoading(true)
      const data = await itemService.getItemDiv2List(div1)
      setDiv2List(data)
    } catch (error) {
      console.error('제품군 데이터 로드 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  // 제품용도(DIV3) 데이터 로드
  const loadDiv3Data = async (div1: string, div2: string) => {
    try {
      setLoading(true)
      const data = await itemService.getItemDiv3List(div1, div2)
      setDiv3List(data)
    } catch (error) {
      console.error('제품용도 데이터 로드 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  // 제품기능(DIV4) 데이터 로드
  const loadDiv4Data = async (div1: string, div2: string, div3: string) => {
    try {
      setLoading(true)
      const data = await itemService.getItemDiv4List(div1, div2, div3)
      setDiv4List(data)
    } catch (error) {
      console.error('제품기능 데이터 로드 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  // 최종 품목 데이터 로드
  const loadFinalItems = async (div1: string, div2: string, div3: string, div4: string) => {
    try {
      setLoading(true)
      const data = await itemService.getItemsByDivision(div1, div2, div3, div4, 0, 100)
      setFinalItems(data.content)
    } catch (error) {
      console.error('최종 품목 데이터 로드 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleProductToggle = (product: OrderProduct) => {
    setSelectedProducts(prev => {
      const exists = prev.find(p => p.id === product.id)
      if (exists) {
        return prev.filter(p => p.id !== product.id)
      }
      return [...prev, { ...product, selected: true }]
    })
  }

  const handleConfirm = () => {
    onProductSelect(selectedProducts)
    alert(`${selectedProducts.length}개 제품이 추가되었습니다.`)
    setSelectedProducts([]) // 선택된 제품 목록 초기화
  }

  const handleCancel = () => {
    onClose()
    setSelectedProducts([])
  }

  // 새 품목 추가 시 선택 목록의 스크롤을 하단으로 이동
  useEffect(() => {
    const el = selectedListRef.current
    if (el) {
      el.scrollTop = el.scrollHeight
    }
  }, [selectedProducts.length])

  // 분류 선택 핸들러
  const handleDiv1Change = (div1Code: string) => {
    setSelectedDiv1(div1Code)
    setSelectedDiv2('')
    setSelectedDiv3('')
    setSelectedDiv4('')
    setDiv2List([])
    setDiv3List([])
    setDiv4List([])
    setFinalItems([])
    
    if (div1Code) {
      loadDiv2Data(div1Code)
    }
  }

  const handleDiv2Change = (div2Code: string) => {
    setSelectedDiv2(div2Code)
    setSelectedDiv3('')
    setSelectedDiv4('')
    setDiv3List([])
    setDiv4List([])
    setFinalItems([])
    
    if (selectedDiv1 && div2Code) {
      loadDiv3Data(selectedDiv1, div2Code)
    }
  }

  const handleDiv3Change = (div3Code: string) => {
    setSelectedDiv3(div3Code)
    setSelectedDiv4('')
    setDiv4List([])
    setFinalItems([])
    
    if (selectedDiv1 && selectedDiv2 && div3Code) {
      loadDiv4Data(selectedDiv1, selectedDiv2, div3Code)
    }
  }

  const handleDiv4Change = (div4Code: string) => {
    setSelectedDiv4(div4Code)
    setFinalItems([])
    
    if (selectedDiv1 && selectedDiv2 && selectedDiv3 && div4Code) {
      loadFinalItems(selectedDiv1, selectedDiv2, selectedDiv3, div4Code)
    }
  }

  // 최종 품목에서 제품 선택
  const handleFinalItemSelect = (item: ItemSelectionResponse) => {
    // 중복 확인
    const isDuplicate = existingProducts.some(product => product.productCode === item.itemNum)
    if (isDuplicate) {
      alert(`이미 등록된 품목입니다 : ${item.itemNum}`)
      return
    }

    const product: OrderProduct = {
      id: item.itemCode.toString(),
      productCode: item.itemNum,
      productName: item.itemName,
      specification: item.spec,
      quantity: 1,
      unit: item.unit,
      unitPrice: item.saleRate, // 판매단가 추가
      stockQuantity: item.stockQuantity // 재고량 추가
    }
    handleProductToggle(product)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white border border-gray-300 w-full max-w-7xl max-h-[95vh] flex flex-col">
        {/* 모달 헤더 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-300">
          <h2 className="text-lg font-semibold" style={{color: '#2A3038'}}>제품분류선택</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 분류 선택 및 결과 영역 */}
        <div className="flex flex-1 overflow-hidden">
          {/* 분류 선택 영역 */}
          <div className="w-full border-r border-gray-300 flex" style={{height: '280px'}}>
            {/* 제품종류 */}
            <div className="border-r border-gray-300 flex flex-col" style={{width: '18.5%'}}>
              <div className="px-3 py-2 bg-gray-100 border-b border-gray-300 text-center text-sm font-medium" style={{color: '#2A3038'}}>
                제품종류
              </div>
              <div className="flex-1 overflow-y-auto">
                {loading && div1List.length === 0 ? (
                  <div className="text-sm px-3 py-2 text-gray-500">로딩 중...</div>
                ) : (
                  div1List.map(item => (
                    <label 
                      key={item.code}
                      className={`block px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 ${selectedDiv1 === item.code ? 'bg-blue-100' : ''}`}
                    >
                      <input
                        type="radio"
                        name="div1"
                        value={item.code}
                        checked={selectedDiv1 === item.code}
                        onChange={() => handleDiv1Change(item.code)}
                        className="mr-2"
                      />
                      {item.name}
                    </label>
                  ))
                )}
              </div>
            </div>

            {/* 제품군 */}
            <div className="border-r border-gray-300 flex flex-col" style={{width: '18.5%'}}>
              <div className="px-3 py-2 bg-gray-100 border-b border-gray-300 text-center text-sm font-medium" style={{color: '#2A3038'}}>
                제품군
              </div>
              <div className="flex-1 overflow-y-auto">
                {!selectedDiv1 ? (
                  <div className="text-sm px-3 py-2 text-gray-500">제품종류를 선택하세요</div>
                ) : loading && div2List.length === 0 ? (
                  <div className="text-sm px-3 py-2 text-gray-500">로딩 중...</div>
                ) : (
                  div2List.map(item => (
                    <label 
                      key={item.code}
                      className={`block px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 ${selectedDiv2 === item.code ? 'bg-blue-100' : ''}`}
                    >
                      <input
                        type="radio"
                        name="div2"
                        value={item.code}
                        checked={selectedDiv2 === item.code}
                        onChange={() => handleDiv2Change(item.code)}
                        className="mr-2"
                      />
                      {item.name}
                    </label>
                  ))
                )}
              </div>
            </div>

            {/* 제품용도 */}
            <div className="border-r border-gray-300 flex flex-col" style={{width: '18.5%'}}>
              <div className="px-3 py-2 bg-gray-100 border-b border-gray-300 text-center text-sm font-medium" style={{color: '#2A3038'}}>
                제품용도
              </div>
              <div className="flex-1 overflow-y-auto">
                {!selectedDiv2 ? (
                  <div className="text-sm px-3 py-2 text-gray-500">제품군을 선택하세요</div>
                ) : loading && div3List.length === 0 ? (
                  <div className="text-sm px-3 py-2 text-gray-500">로딩 중...</div>
                ) : (
                  div3List.map(item => (
                    <label 
                      key={item.code}
                      className={`block px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 ${selectedDiv3 === item.code ? 'bg-blue-100' : ''}`}
                    >
                      <input
                        type="radio"
                        name="div3"
                        value={item.code}
                        checked={selectedDiv3 === item.code}
                        onChange={() => handleDiv3Change(item.code)}
                        className="mr-2"
                      />
                      {item.name}
                    </label>
                  ))
                )}
              </div>
            </div>

            {/* 제품기능 */}
            <div className="border-r border-gray-300 flex flex-col" style={{width: '18.5%'}}>
              <div className="px-3 py-2 bg-gray-100 border-b border-gray-300 text-center text-sm font-medium" style={{color: '#2A3038'}}>
                제품기능
              </div>
              <div className="flex-1 overflow-y-auto">
                {!selectedDiv3 ? (
                  <div className="text-sm px-3 py-2 text-gray-500">제품용도를 선택하세요</div>
                ) : loading && div4List.length === 0 ? (
                  <div className="text-sm px-3 py-2 text-gray-500">로딩 중...</div>
                ) : (
                  div4List.map(item => (
                    <label 
                      key={item.code}
                      className={`block px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 ${selectedDiv4 === item.code ? 'bg-blue-100' : ''}`}
                    >
                      <input
                        type="radio"
                        name="div4"
                        value={item.code}
                        checked={selectedDiv4 === item.code}
                        onChange={() => handleDiv4Change(item.code)}
                        className="mr-2"
                      />
                      {item.name}
                    </label>
                  ))
                )}
              </div>
            </div>

            {/* 최종 품목 */}
            <div className="flex flex-col" style={{width: '26%'}}>
              <div className="px-3 py-2 bg-gray-100 border-b border-gray-300 text-center text-sm font-medium" style={{color: '#2A3038'}}>
                최종 품목
              </div>
              <div className="flex-1 overflow-y-auto">
                {!selectedDiv4 ? (
                  <div className="text-sm px-3 py-2 text-gray-500">제품기능을 선택하세요</div>
                ) : loading && finalItems.length === 0 ? (
                  <div className="text-sm px-3 py-2 text-gray-500">로딩 중...</div>
                ) : (
                  finalItems.map(item => {
                    const isSelected = selectedProducts.some(product => product.productCode === item.itemNum)
                    return (
                      <div
                        key={item.itemCode}
                        className={`px-3 py-2 text-sm cursor-pointer border-b border-gray-200 ${isSelected ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                        onClick={() => handleFinalItemSelect(item)}
                      >
                        <div className="text-gray-700">
                          {item.spec} ( {item.unit} ) [재고량 : {item.stockQuantity !== undefined ? Math.floor(Number(item.stockQuantity)).toLocaleString() : '0'}]
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 선택된 제품 목록 */}
        <div className="border-t border-gray-300" style={{height: '360px'}}>
          <div className="px-0 py-2 h-full flex flex-col">
            <div className="text-base mb-2 font-medium px-3" style={{color: '#2A3038'}}>
              선택된 제품 <span className="ml-1 text-sm text-custom-secondary">({selectedProducts.length})</span>
            </div>
            <div className="overflow-x-auto overflow-y-auto flex-1" ref={selectedListRef}>
              <table className="w-full border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium border-b border-r border-gray-300" style={{color: '#2A3038'}}>
                      제품코드
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium border-b border-r border-gray-300" style={{color: '#2A3038'}}>
                      제품명
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium border-b border-r border-gray-300" style={{color: '#2A3038'}}>
                      규격
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium border-b border-r border-gray-300" style={{color: '#2A3038'}}>
                      단위
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium border-b border-r border-gray-300" style={{color: '#2A3038'}}>
                      재고량
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium border-b border-r border-gray-300" style={{color: '#2A3038'}}>
                      수량
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium border-b border-gray-300" style={{color: '#2A3038'}}>
                      선택
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm border-r border-gray-300" style={{color: '#2A3038'}}>
                        {product.productCode}
                      </td>
                      <td className="px-4 py-3 text-sm border-r border-gray-300" style={{color: '#2A3038'}}>
                        {product.productName}
                      </td>
                      <td className="px-4 py-3 text-sm border-r border-gray-300" style={{color: '#2A3038'}}>
                        {product.specification}
                      </td>
                      <td className="px-4 py-3 text-sm border-r border-gray-300" style={{color: '#2A3038'}}>
                        {product.unit}
                      </td>
                      <td className="px-4 py-3 text-sm border-r border-gray-300" style={{color: '#2A3038'}}>
                        {product.stockQuantity !== undefined ? Math.floor(Number(product.stockQuantity)).toLocaleString() : '0'}
                      </td>
                      <td className="px-4 py-3 text-sm border-r border-gray-300" style={{color: '#2A3038'}}>
                        <input
                          type="number"
                          value={product.quantity}
                          onFocus={(e) => e.currentTarget.select()}
                          onClick={(e) => e.currentTarget.select()}
                          onChange={(e) => {
                            const value = Math.max(1, parseInt(e.target.value) || 1);
                            if (value <= 999) { // 3자리수 제한
                              setSelectedProducts(prev => 
                                prev.map(p => p.id === product.id ? { ...p, quantity: value } : p)
                              )
                            }
                          }}
                          className="w-20 px-2 py-1 border border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
                          min="1"
                          max="999"
                          step="1"
                        />
                      </td>
                      <td className="px-4 py-3 text-sm" style={{color: '#2A3038'}}>
                        <button
                          onClick={() => handleProductToggle(product)}
                          className="px-3 py-1 border border-gray-300 bg-white hover:bg-gray-100 text-sm"
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  ))}
                  {selectedProducts.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-6 text-center text-sm text-gray-500">
                        선택된 제품이 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 모달 푸터 */}
        <div className="p-4 border-t border-gray-300">
          <div className="flex justify-end gap-3">
            <button
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 bg-white hover:bg-gray-100 text-sm rounded-sm"
            >
              창닫기
            </button>
            <button
              onClick={handleConfirm}
              className="px-6 py-2 bg-orange-primary hover:bg-orange-light text-white text-sm rounded-sm"
              disabled={selectedProducts.length === 0}
            >
              추가하기
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 