import { useState } from 'react'
import { Search, X } from 'lucide-react'
import type { OrderProduct, ProductCategory, ProductSubCategory, ProductSpecification } from '@/types'

interface ProductSearchModalProps {
  isOpen: boolean
  onClose: () => void
  onProductSelect: (products: OrderProduct[]) => void
}

export default function ProductSearchModal({ isOpen, onClose, onProductSelect }: ProductSearchModalProps) {
  const [searchKeyword, setSearchKeyword] = useState('')
  const [selectedProducts, setSelectedProducts] = useState<OrderProduct[]>([])
  
  // 분류 선택 상태
  const [selectedCategory1, setSelectedCategory1] = useState<string>('')
  const [selectedCategory2, setSelectedCategory2] = useState<string>('')
  const [selectedCategory3, setSelectedCategory3] = useState<string>('')
  const [selectedCategory4, setSelectedCategory4] = useState<string>('')
  const [selectedSpec, setSelectedSpec] = useState<string>('')

  // 샘플 분류 데이터
  const categories1: ProductCategory[] = [
    { id: 'cat1', name: '제품' },
    { id: 'cat2', name: '상품/구매품' },
    { id: 'cat3', name: '재료' },
    { id: 'cat4', name: '제품' },
    { id: 'cat5', name: '제품' },
  ]

  const categories2: ProductSubCategory[] = [
    { id: 'subcat1', categoryId: 'cat1', name: '관류' },
    { id: 'subcat2', categoryId: 'cat1', name: '관부속' },
    { id: 'subcat3', categoryId: 'cat1', name: 'PE 시트' },
    { id: 'subcat4', categoryId: 'cat1', name: '사출품' },
    { id: 'subcat5', categoryId: 'cat1', name: '관부속' },
    { id: 'subcat6', categoryId: 'cat1', name: 'H-LOSS' },
  ]

  const categories3: ProductSubCategory[] = [
    { id: 'subcat7', categoryId: 'subcat2', name: '가스이음관(사출)' },
    { id: 'subcat8', categoryId: 'subcat2', name: '가스이음관(ISO,실링)(사출)' },
    { id: 'subcat9', categoryId: 'subcat2', name: '가스이음관(ISO,실링)(가공)' },
    { id: 'subcat10', categoryId: 'subcat2', name: '수도이음관(사출)' },
    { id: 'subcat11', categoryId: 'subcat2', name: '수도이음관(JIKS)(사출)' },
    { id: 'subcat12', categoryId: 'subcat2', name: '수도이음관(사출)' },
  ]

  const categories4: ProductSubCategory[] = [
    { id: 'subcat13', categoryId: 'subcat8', name: '가스90원보(ISO)(사출)' },
    { id: 'subcat14', categoryId: 'subcat8', name: '가스45원보(ISO)(사출)' },
    { id: 'subcat15', categoryId: 'subcat8', name: '가스스티이(ISO)(사출)' },
    { id: 'subcat16', categoryId: 'subcat8', name: '가스캡(ISO)(사출)' },
    { id: 'subcat17', categoryId: 'subcat8', name: '가스레듀샤(ISO)(사출)' },
    { id: 'subcat18', categoryId: 'subcat8', name: '가스이경티이(ISO)(사출)' },
  ]

  const specifications: ProductSpecification[] = [
    { id: 'spec1', subCategoryId: 'subcat14', name: '90( ea ) [ 재고량 : 201.00 ]', price: 201 },
    { id: 'spec2', subCategoryId: 'subcat14', name: '110( ea ) [ 재고량 : 521.00 ]', price: 521 },
    { id: 'spec3', subCategoryId: 'subcat14', name: '160( ea ) [ 재고량 : 158.00 ]', price: 158 },
  ]

  // 샘플 제품 검색 결과
  const productData: OrderProduct[] = [
    {
      id: '1',
      productCode: '121603-010090',
      productName: '가스45원보(ISO)(사출)',
      specification: '90',
      quantity: 1,
      unit: 'ea'
    },
    {
      id: '2',
      productCode: '121012-1104000090',
      productName: '가스다단레듀서',
      specification: '400×90',
      quantity: 1,
      unit: 'ea'
    },
    {
      id: '3',
      productCode: '121603-015090',
      productName: '가스45원보(ISO)(사출) 150',
      specification: '150',
      quantity: 1,
      unit: 'ea'
    },
    {
      id: '4',
      productCode: '121012-1105000090',
      productName: '가스다단레듀서 500',
      specification: '500×90',
      quantity: 1,
      unit: 'ea'
    }
  ]

  const handleSearch = () => {
    console.log('제품 검색:', searchKeyword)
    // 실제 API 호출 로직 구현
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
  }

  const handleCancel = () => {
    onClose()
    setSelectedProducts([])
  }

  // 분류 선택 핸들러
  const handleCategory1Change = (categoryId: string) => {
    setSelectedCategory1(categoryId)
    setSelectedCategory2('')
    setSelectedCategory3('')
    setSelectedCategory4('')
    setSelectedSpec('')
  }

  const handleCategory2Change = (categoryId: string) => {
    setSelectedCategory2(categoryId)
    setSelectedCategory3('')
    setSelectedCategory4('')
    setSelectedSpec('')
  }

  const handleCategory3Change = (categoryId: string) => {
    setSelectedCategory3(categoryId)
    setSelectedCategory4('')
    setSelectedSpec('')
  }

  const handleCategory4Change = (categoryId: string) => {
    setSelectedCategory4(categoryId)
    setSelectedSpec('')
  }

  const handleSpecChange = (specId: string) => {
    setSelectedSpec(specId)
    // 여기서 선택된 규격에 맞는 제품을 선택할 수 있음
    const spec = specifications.find(s => s.id === specId)
    if (spec) {
      // 예시로 첫 번째 제품을 선택
      const product = productData[0]
      if (product) {
        handleProductToggle(product)
      }
    }
  }

  // 필터링된 카테고리 목록
  const filteredCategories2 = categories2.filter(cat => !selectedCategory1 || cat.categoryId === selectedCategory1)
  const filteredCategories3 = categories3.filter(cat => !selectedCategory2 || cat.categoryId === selectedCategory2)
  const filteredCategories4 = categories4.filter(cat => !selectedCategory3 || cat.categoryId === selectedCategory3)
  const filteredSpecifications = specifications.filter(spec => !selectedCategory4 || spec.subCategoryId === selectedCategory4)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white border border-gray-300 w-full max-w-5xl max-h-[90vh] flex flex-col">
        {/* 모달 헤더 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-300">
          <h2 className="text-lg font-semibold" style={{color: '#2A3038'}}>제품정보</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 검색 영역 */}
        <div className="p-4 border-b border-gray-300">
          <div className="flex gap-2">
            <div className="flex-1">
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="제품명 또는 규격을 입력하세요"
                className="w-full px-3 py-1 border border-gray-300 focus:border-blue-500 focus:outline-none text-xs"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <button 
              onClick={handleSearch} 
              className="px-3 py-1 bg-orange-primary hover:bg-orange-light text-white text-xs font-medium rounded-sm"
            >
              <Search className="w-3 h-3 inline mr-1" />
              검색
            </button>
          </div>
        </div>

        {/* 분류 선택 및 결과 영역 */}
        <div className="flex flex-1 overflow-hidden">
          {/* 분류 선택 영역 */}
          <div className="w-full border-r border-gray-300 flex">
            {/* 분류 1 */}
            <div className="w-1/5 border-r border-gray-300 overflow-y-auto">
              <div className="p-2 bg-gray-100 border-b border-gray-300 text-center text-xs font-medium" style={{color: '#2A3038'}}>
                분류1
              </div>
              <div>
                {categories1.map(category => (
                  <label 
                    key={category.id}
                    className={`block px-2 py-1 text-xs cursor-pointer hover:bg-gray-100 ${selectedCategory1 === category.id ? 'bg-blue-100' : ''}`}
                  >
                    <input
                      type="radio"
                      name="category1"
                      value={category.id}
                      checked={selectedCategory1 === category.id}
                      onChange={() => handleCategory1Change(category.id)}
                      className="mr-2"
                    />
                    {category.name}
                  </label>
                ))}
              </div>
            </div>

            {/* 분류 2 */}
            <div className="w-1/5 border-r border-gray-300 overflow-y-auto">
              <div className="p-2 bg-gray-100 border-b border-gray-300 text-center text-xs font-medium" style={{color: '#2A3038'}}>
                분류2
              </div>
              <div>
                <div className="text-xs px-2 py-1 text-gray-500">선택하세요</div>
                {filteredCategories2.map(category => (
                  <label 
                    key={category.id}
                    className={`block px-2 py-1 text-xs cursor-pointer hover:bg-gray-100 ${selectedCategory2 === category.id ? 'bg-blue-100' : ''}`}
                  >
                    <input
                      type="radio"
                      name="category2"
                      value={category.id}
                      checked={selectedCategory2 === category.id}
                      onChange={() => handleCategory2Change(category.id)}
                      className="mr-2"
                    />
                    {category.name}
                  </label>
                ))}
              </div>
            </div>

            {/* 분류 3 */}
            <div className="w-1/5 border-r border-gray-300 overflow-y-auto">
              <div className="p-2 bg-gray-100 border-b border-gray-300 text-center text-xs font-medium" style={{color: '#2A3038'}}>
                분류3
              </div>
              <div>
                <div className="text-xs px-2 py-1 text-gray-500">선택하세요</div>
                {filteredCategories3.map(category => (
                  <label 
                    key={category.id}
                    className={`block px-2 py-1 text-xs cursor-pointer hover:bg-gray-100 ${selectedCategory3 === category.id ? 'bg-blue-100' : ''}`}
                  >
                    <input
                      type="radio"
                      name="category3"
                      value={category.id}
                      checked={selectedCategory3 === category.id}
                      onChange={() => handleCategory3Change(category.id)}
                      className="mr-2"
                    />
                    {category.name}
                  </label>
                ))}
              </div>
            </div>

            {/* 분류 4 */}
            <div className="w-1/5 border-r border-gray-300 overflow-y-auto">
              <div className="p-2 bg-gray-100 border-b border-gray-300 text-center text-xs font-medium" style={{color: '#2A3038'}}>
                분류4
              </div>
              <div>
                <div className="text-xs px-2 py-1 text-gray-500">선택하세요</div>
                {filteredCategories4.map(category => (
                  <label 
                    key={category.id}
                    className={`block px-2 py-1 text-xs cursor-pointer hover:bg-gray-100 ${selectedCategory4 === category.id ? 'bg-blue-100' : ''}`}
                  >
                    <input
                      type="radio"
                      name="category4"
                      value={category.id}
                      checked={selectedCategory4 === category.id}
                      onChange={() => handleCategory4Change(category.id)}
                      className="mr-2"
                    />
                    {category.name}
                  </label>
                ))}
              </div>
            </div>

            {/* 규격 */}
            <div className="w-1/5 overflow-y-auto">
              <div className="p-2 bg-gray-100 border-b border-gray-300 text-center text-xs font-medium" style={{color: '#2A3038'}}>
                규격 (단위)
              </div>
              <div>
                <div className="text-xs px-2 py-1 text-gray-500">선택하세요</div>
                {filteredSpecifications.map(spec => (
                  <label 
                    key={spec.id}
                    className={`block px-2 py-1 text-xs cursor-pointer hover:bg-gray-100 ${selectedSpec === spec.id ? 'bg-blue-500 text-white' : ''}`}
                  >
                    <input
                      type="radio"
                      name="specification"
                      value={spec.id}
                      checked={selectedSpec === spec.id}
                      onChange={() => handleSpecChange(spec.id)}
                      className="mr-2"
                    />
                    {spec.name}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 선택된 제품 목록 */}
        <div className="border-t border-gray-300">
          <div className="p-4">
            <div className="text-sm mb-2 font-medium" style={{color: '#2A3038'}}>
              선택된 제품
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium border-b border-r border-gray-300" style={{color: '#2A3038'}}>
                      제품코드
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium border-b border-r border-gray-300" style={{color: '#2A3038'}}>
                      제품명
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium border-b border-r border-gray-300" style={{color: '#2A3038'}}>
                      규격
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium border-b border-r border-gray-300" style={{color: '#2A3038'}}>
                      단위
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium border-b border-r border-gray-300" style={{color: '#2A3038'}}>
                      수량
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium border-b border-gray-300" style={{color: '#2A3038'}}>
                      선택
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedProducts.map((product) => (
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
                        <input
                          type="number"
                          value={product.quantity}
                          onChange={(e) => {
                            const value = Math.max(1, parseInt(e.target.value) || 1);
                            if (value <= 999) { // 3자리수 제한
                              setSelectedProducts(prev => 
                                prev.map(p => p.id === product.id ? { ...p, quantity: value } : p)
                              )
                            }
                          }}
                          className="w-16 px-2 py-1 border border-gray-300 focus:border-blue-500 focus:outline-none text-xs"
                          min="1"
                          max="999"
                        />
                      </td>
                      <td className="px-3 py-2 text-xs" style={{color: '#2A3038'}}>
                        <button
                          onClick={() => handleProductToggle(product)}
                          className="px-2 py-1 border border-gray-300 bg-white hover:bg-gray-100 text-xs"
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  ))}
                  {selectedProducts.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-3 py-4 text-center text-xs text-gray-500">
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
          <div className="flex justify-end gap-2">
            <button
              onClick={handleCancel}
              className="px-4 py-1 border border-gray-300 bg-white hover:bg-gray-100 text-xs rounded-sm"
            >
              창닫기
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-1 bg-orange-primary hover:bg-orange-light text-white text-xs rounded-sm"
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