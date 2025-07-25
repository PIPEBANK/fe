import { useState, useEffect } from 'react'
import { X, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { itemService } from '@/services'
import type { ItemSearchResponse, OrderProduct } from '@/types'

interface ProductSearchModalProps {
  isOpen: boolean
  onClose: () => void
  onProductSelect: (products: OrderProduct[]) => void
  existingProducts?: OrderProduct[] // 이미 등록된 제품 목록
}

export default function ProductSearchModal({ isOpen, onClose, onProductSelect, existingProducts = [] }: ProductSearchModalProps) {
  const [searchResults, setSearchResults] = useState<ItemSearchResponse[]>([])
  const [selectedProducts, setSelectedProducts] = useState<OrderProduct[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  
  // 검색 조건
  const [itemName, setItemName] = useState('')
  const [spec, setSpec] = useState('')
  // 2중 검색 조건 추가
  const [itemName2, setItemName2] = useState('')
  const [spec2, setSpec2] = useState('')
  // AND/OR 연산자 상태 추가
  const [itemNameOperator, setItemNameOperator] = useState<'AND' | 'OR'>('AND')
  const [specOperator, setSpecOperator] = useState<'AND' | 'OR'>('AND')
  // 초기화 트리거 상태 추가
  const [shouldResetSearch, setShouldResetSearch] = useState(false)

  // 컴포넌트 마운트 시 초기 검색 (빈 조건으로 전체 조회)
  useEffect(() => {
    if (isOpen) {
      handleSearch()
    }
  }, [isOpen])

  // 초기화 후 검색 실행
  useEffect(() => {
    if (shouldResetSearch) {
      handleSearch()
      setShouldResetSearch(false)
    }
  }, [shouldResetSearch, itemName, itemName2, spec, spec2, itemNameOperator, specOperator])

  // 검색 실행
  const handleSearch = async (page = 0) => {
    try {
      setLoading(true)
      setCurrentPage(page)
      
      // 2중 검색을 지원하는 새로운 메서드 사용 (AND/OR 연산자 포함)
      const response = await itemService.searchItemsAdvanced(
        itemName.trim() || undefined,
        itemName2.trim() || undefined,
        spec.trim() || undefined,
        spec2.trim() || undefined,
        page,
        20,
        'itemCodeCode',
        'asc',
        itemNameOperator,
        specOperator
      )
      
      setSearchResults(response.content)
      setTotalPages(response.totalPages)
      setTotalElements(response.totalElements)
    } catch (error) {
      console.error('품목 검색 실패:', error)
      setSearchResults([])
      setTotalPages(0)
      setTotalElements(0)
    } finally {
      setLoading(false)
    }
  }

  // 제품 선택/해제
  const handleProductToggle = (item: ItemSearchResponse) => {
    const product: OrderProduct = {
      id: item.itemCode.toString(),
      productCode: item.itemNum,
      productName: item.itemName,
      specification: item.spec,
      quantity: 1,
      unit: item.unit,
      discount: 0,
      unitPrice: item.saleRate,
      totalPrice: item.saleRate,
      status: '주문대기',
      stockQuantity: item.stockQuantity
    }

    setSelectedProducts(prev => {
      const exists = prev.find(p => p.id === product.id)
      if (exists) {
        return prev.filter(p => p.id !== product.id)
      }
      return [...prev, product]
    })
  }

  // 페이지 이동
  const handlePageChange = (page: number) => {
    if (page >= 0 && page < totalPages) {
      handleSearch(page)
    }
  }

  // 확인 버튼
  const handleConfirm = () => {
    // 중복 제품 확인
    const duplicateProducts = selectedProducts.filter(selected => 
      existingProducts.some(existing => existing.id === selected.id)
    )
    
    if (duplicateProducts.length > 0) {
      const duplicateCodes = duplicateProducts.map(p => p.productCode).join(', ')
      alert(`이미 등록된 품목입니다 : ${duplicateCodes}`)
      return
    }
    
    onProductSelect(selectedProducts)
    alert(`${selectedProducts.length}개 제품이 추가되었습니다.`)
    handleCancel()
  }

  // 검색 조건 초기화
  const handleReset = () => {
    setItemName('')
    setSpec('')
    setItemName2('')
    setSpec2('')
    setItemNameOperator('AND')
    setSpecOperator('AND')
    setCurrentPage(0)
    // 초기화 후 검색 트리거
    setShouldResetSearch(true)
  }

  // 취소 버튼
  const handleCancel = () => {
    onClose()
    setSelectedProducts([])
    setItemName('')
    setSpec('')
    // 2차 검색 조건도 초기화
    setItemName2('')
    setSpec2('')
    // 연산자도 초기화
    setItemNameOperator('AND')
    setSpecOperator('AND')
    setCurrentPage(0)
  }

  // 선택된 제품인지 확인
  const isSelected = (itemCode: number) => {
    return selectedProducts.some(p => p.id === itemCode.toString())
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white border border-gray-300 w-full max-w-7xl max-h-[95vh] flex flex-col">
        {/* 모달 헤더 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-300">
          <h2 className="text-lg font-semibold" style={{color: '#2A3038'}}>제품검색</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

                {/* 검색 조건 */}
        <div className="p-3 border-b border-gray-300 bg-gray-50">
          <div className="space-y-2">
            {/* 제품명 검색 라인 */}
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <label className="block text-xs font-medium mb-1" style={{color: '#2A3038'}}>
                  제품명 (1차)
                </label>
                <input
                  type="text"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 focus:border-blue-500 focus:outline-none text-xs"
                  placeholder="제품명을 입력하세요"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <div className="w-16">
                <label className="block text-xs font-medium mb-1" style={{color: '#2A3038'}}>
                  조건
                </label>
                <select
                  value={itemNameOperator}
                  onChange={(e) => setItemNameOperator(e.target.value as 'AND' | 'OR')}
                  className="w-full px-2 py-2 border border-gray-300 focus:border-blue-500 focus:outline-none text-xs bg-white"
                >
                  <option value="AND">AND</option>
                  <option value="OR">OR</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium mb-1" style={{color: '#2A3038'}}>
                  제품명 (2차)
                </label>
                <input
                  type="text"
                  value={itemName2}
                  onChange={(e) => setItemName2(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 focus:border-blue-500 focus:outline-none text-xs"
                  placeholder="추가 제품명"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <button
                onClick={handleReset}
                className="px-4 py-2 border border-gray-300 bg-white hover:bg-gray-100 text-xs rounded-sm flex items-center gap-1"
                title="검색 조건 초기화"
              >
                초기화
              </button>
            </div>
            
            {/* 규격 검색 라인 */}
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <label className="block text-xs font-medium mb-1" style={{color: '#2A3038'}}>
                  규격 (1차)
                </label>
                <input
                  type="text"
                  value={spec}
                  onChange={(e) => setSpec(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 focus:border-blue-500 focus:outline-none text-xs"
                  placeholder="규격을 입력하세요"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <div className="w-16">
                <label className="block text-xs font-medium mb-1" style={{color: '#2A3038'}}>
                  조건
                </label>
                <select
                  value={specOperator}
                  onChange={(e) => setSpecOperator(e.target.value as 'AND' | 'OR')}
                  className="w-full px-2 py-2 border border-gray-300 focus:border-blue-500 focus:outline-none text-xs bg-white"
                >
                  <option value="AND">AND</option>
                  <option value="OR">OR</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium mb-1" style={{color: '#2A3038'}}>
                  규격 (2차)
                </label>
                <input
                  type="text"
                  value={spec2}
                  onChange={(e) => setSpec2(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 focus:border-blue-500 focus:outline-none text-xs"
                  placeholder="추가 규격"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <button
                onClick={() => handleSearch()}
                disabled={loading}
                className="px-4 py-2 bg-orange-primary hover:bg-orange-light text-white text-xs rounded-sm flex items-center gap-1 disabled:opacity-50"
              >
                <Search className="w-3 h-3" />
                검색
              </button>
            </div>

            
          </div>
        </div>

        {/* 검색 결과 */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* 결과 헤더 */}
          <div className="p-3 bg-gray-100 border-b border-gray-300">
            <div className="flex justify-between items-center">
              <div className="text-sm font-medium" style={{color: '#2A3038'}}>
                검색결과 ({totalElements.toLocaleString()}건)
              </div>
              <div className="text-xs text-gray-600">
                선택된 제품: {selectedProducts.length}개
              </div>
            </div>
          </div>

          {/* 결과 테이블 */}
          <div className="flex-1 overflow-auto">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="text-gray-500 text-sm">검색 중...</div>
              </div>
            ) : searchResults.length === 0 ? (
              <div className="flex items-center justify-center h-32">
                <div className="text-gray-500 text-sm">검색 결과가 없습니다.</div>
              </div>
            ) : (
              <table className="w-full border-collapse text-xs">
                <thead className="bg-gray-100 sticky top-0">
                  <tr>
                    <th className="px-2 py-2 text-left text-xs font-medium border-b border-r border-gray-300" style={{color: '#2A3038'}}>
                      선택
                    </th>
                    <th className="px-2 py-2 text-left text-xs font-medium border-b border-r border-gray-300" style={{color: '#2A3038'}}>
                      제품코드
                    </th>
                    <th className="px-2 py-2 text-left text-xs font-medium border-b border-r border-gray-300" style={{color: '#2A3038'}}>
                      제품명
                    </th>
                    <th className="px-2 py-2 text-left text-xs font-medium border-b border-r border-gray-300" style={{color: '#2A3038'}}>
                      규격
                    </th>
                    <th className="px-2 py-2 text-left text-xs font-medium border-b border-r border-gray-300" style={{color: '#2A3038'}}>
                      단위
                    </th>
                    <th className="px-2 py-2 text-left text-xs font-medium border-b border-gray-300" style={{color: '#2A3038'}}>
                      재고량
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {searchResults.map((item) => (
                    <tr 
                      key={item.itemCode} 
                      className={`hover:bg-gray-50 cursor-pointer ${isSelected(item.itemCode) ? 'bg-blue-50' : ''}`}
                      onClick={() => handleProductToggle(item)}
                    >
                      <td className="px-2 py-1.5 text-xs border-r border-gray-300 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected(item.itemCode)}
                          onChange={() => handleProductToggle(item)}
                          className="cursor-pointer"
                        />
                      </td>
                      <td className="px-2 py-1.5 text-xs border-r border-gray-300" style={{color: '#2A3038'}}>
                        {item.itemNum}
                      </td>
                      <td className="px-2 py-1.5 text-xs border-r border-gray-300" style={{color: '#2A3038'}}>
                        {item.itemName}
                      </td>
                      <td className="px-2 py-1.5 text-xs border-r border-gray-300" style={{color: '#2A3038'}}>
                        {item.spec}
                      </td>
                      <td className="px-2 py-1.5 text-xs border-r border-gray-300" style={{color: '#2A3038'}}>
                        {item.unit}
                      </td>
                      <td className="px-2 py-1.5 text-xs text-right" style={{color: '#2A3038'}}>
                        {item.stockQuantity?.toFixed(2) || '0.00'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* 페이징 */}
          {totalPages > 1 && (
            <div className="p-3 border-t border-gray-300 bg-gray-50">
              <div className="flex justify-center items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                  className="px-2 py-1 border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-xs flex items-center gap-1"
                >
                  <ChevronLeft className="w-3 h-3" />
                  이전
                </button>

                <div className="flex gap-1">
                  {Array.from({ length: Math.min(10, totalPages) }, (_, i) => {
                    const pageNumber = Math.floor(currentPage / 10) * 10 + i
                    if (pageNumber >= totalPages) return null
                    
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`px-2 py-1 text-xs border ${
                          currentPage === pageNumber
                            ? 'bg-orange-primary text-white border-orange-primary'
                            : 'bg-white border-gray-300 hover:bg-gray-100'
                        }`}
                      >
                        {pageNumber + 1}
                      </button>
                    )
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages - 1}
                  className="px-2 py-1 border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-xs flex items-center gap-1"
                >
                  다음
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
              
              <div className="text-center text-xs text-gray-600 mt-1">
                페이지 {currentPage + 1} / {totalPages} (총 {totalElements.toLocaleString()}건)
              </div>
            </div>
          )}
        </div>

        {/* 선택된 제품 목록 - 고정 크기 */}
        <div className="border-t border-gray-300 bg-gray-50 flex-shrink-0" style={{height: '200px'}}>
          <div className="p-3 h-full flex flex-col">
            <div className="text-sm mb-2 font-medium flex justify-between items-center flex-shrink-0" style={{color: '#2A3038'}}>
              <span>선택된 제품 ({selectedProducts.length}개)</span>
              {selectedProducts.length === 0 && (
                <span className="text-xs text-gray-500">제품을 선택해주세요</span>
              )}
            </div>
            <div className="overflow-x-auto overflow-y-auto flex-1 min-h-0">
              {selectedProducts.length > 0 ? (
                <table className="w-full border border-gray-300 text-xs">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-2 py-2 text-left text-xs font-medium border-b border-r border-gray-300" style={{color: '#2A3038'}}>
                        제품코드
                      </th>
                      <th className="px-2 py-2 text-left text-xs font-medium border-b border-r border-gray-300" style={{color: '#2A3038'}}>
                        제품명
                      </th>
                      <th className="px-2 py-2 text-left text-xs font-medium border-b border-r border-gray-300" style={{color: '#2A3038'}}>
                        규격
                      </th>
                      <th className="px-2 py-2 text-left text-xs font-medium border-b border-r border-gray-300" style={{color: '#2A3038'}}>
                        단위
                      </th>
                      <th className="px-2 py-2 text-left text-xs font-medium border-b border-r border-gray-300" style={{color: '#2A3038'}}>
                        재고량
                      </th>
                      <th className="px-2 py-2 text-left text-xs font-medium border-b border-r border-gray-300" style={{color: '#2A3038'}}>
                        수량
                      </th>
                      <th className="px-2 py-2 text-left text-xs font-medium border-b border-gray-300" style={{color: '#2A3038'}}>
                        삭제
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-2 py-1.5 text-xs border-r border-gray-300" style={{color: '#2A3038'}}>
                          {product.productCode}
                        </td>
                        <td className="px-2 py-1.5 text-xs border-r border-gray-300" style={{color: '#2A3038'}}>
                          {product.productName}
                        </td>
                        <td className="px-2 py-1.5 text-xs border-r border-gray-300" style={{color: '#2A3038'}}>
                          {product.specification}
                        </td>
                        <td className="px-2 py-1.5 text-xs border-r border-gray-300" style={{color: '#2A3038'}}>
                          {product.unit}
                        </td>
                        <td className="px-2 py-1.5 text-xs border-r border-gray-300" style={{color: '#2A3038'}}>
                          {product.stockQuantity?.toFixed(2) || '0.00'}
                        </td>
                        <td className="px-2 py-1.5 text-xs border-r border-gray-300" style={{color: '#2A3038'}}>
                          <input
                            type="number"
                            value={product.quantity}
                            onChange={(e) => {
                              const value = Math.max(1, parseInt(e.target.value) || 1);
                              if (value <= 999) {
                                setSelectedProducts(prev => 
                                  prev.map(p => p.id === product.id ? { ...p, quantity: value } : p)
                                )
                              }
                            }}
                            className="w-16 px-1 py-1 border border-gray-300 focus:border-blue-500 focus:outline-none text-xs"
                            min="1"
                            max="999"
                          />
                        </td>
                        <td className="px-2 py-1.5 text-xs" style={{color: '#2A3038'}}>
                          <button
                            onClick={() => handleProductToggle({
                              itemCode: parseInt(product.id),
                              itemNum: product.productCode,
                              itemName: product.productName,
                              spec: product.specification,
                              unit: product.unit,
                              saleRate: product.unitPrice || 0,
                              stockQuantity: product.stockQuantity || 0,
                              brand: ''
                            })}
                            className="px-2 py-1 border border-gray-300 bg-white hover:bg-gray-100 text-xs"
                          >
                            삭제
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500 text-xs">
                  선택된 제품이 없습니다.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 모달 푸터 */}
        <div className="p-3 border-t border-gray-300">
          <div className="flex justify-end gap-2">
            <button
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 bg-white hover:bg-gray-100 text-xs rounded-sm"
            >
              취소
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-2 bg-orange-primary hover:bg-orange-light text-white text-xs rounded-sm"
              disabled={selectedProducts.length === 0}
            >
              선택완료 ({selectedProducts.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 