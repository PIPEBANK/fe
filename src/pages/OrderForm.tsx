import { useState } from 'react'

import { Plus } from 'lucide-react'
import type { OrderFormData, OrderProduct, DeliveryType } from '@/types'
import ProductSearchModal from '@/components/ui/ProductSearchModal'

// 다음(카카오) 주소검색 API 타입 정의
declare global {
  interface Window {
    daum: {
      Postcode: new (config: {
        oncomplete: (data: {
          address: string;
          addressType: string;
          bname: string;
          buildingName: string;
          zonecode: string;
          [key: string]: string | number | boolean;
        }) => void;
      }) => {
        open: () => void;
      };
    };
  }
}

// 공통 입력 필드 스타일을 정의하는 상수 추가
const inputFieldClass = "w-full px-2 py-2 border border-gray-300 focus:border-blue-500 focus:outline-none text-xs text-custom-primary h-8"
const selectFieldClass = "w-full px-2 py-2 border border-gray-300 focus:border-blue-500 focus:outline-none text-xs text-custom-primary h-8"
const textareaFieldClass = "w-full px-2 py-2 border border-gray-300 focus:border-blue-500 focus:outline-none text-xs resize-none text-custom-primary"

export default function OrderForm() {
  const [formData, setFormData] = useState<OrderFormData>({
    customerNumber: '',
    orderNumber: '',
    orderDate: new Date().toISOString().split('T')[0],
    requiredDate: '',
    deliveryType: '일반판매',
    usage: '',
    recipient: '',
    recipientContact: '',
    deliveryAddress: '',
    postalCode: '',
    detailAddress: '',
    demandSite: '',
    siteName: '',
    currency: '한국(KRW)',
    exchangeRate: 1,
    memo: '',
    products: []
  })

  const [selectedProducts, setSelectedProducts] = useState<OrderProduct[]>([])
  const [showProductSearch, setShowProductSearch] = useState(false)

  // 샘플 제품 데이터
  const sampleProducts: OrderProduct[] = [
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
    }
  ]

  const deliveryTypes: DeliveryType[] = ['일반판매', '직송', '픽업', '기타']

  const handleInputChange = (field: keyof OrderFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleProductAdd = () => {
    setShowProductSearch(true)
  }

  const handleProductSearchClose = () => {
    setShowProductSearch(false)
  }

  const handleProductsFromSearch = (products: OrderProduct[]) => {
    setSelectedProducts(prev => {
      const newProducts = products.filter(product => 
        !prev.find(p => p.id === product.id)
      )
      return [...prev, ...newProducts]
    })
  }

  const handleProductSelect = (product: OrderProduct) => {
    setSelectedProducts(prev => {
      const exists = prev.find(p => p.id === product.id)
      if (exists) {
        return prev.map(p => 
          p.id === product.id 
            ? { ...p, selected: !p.selected }
            : p
        )
      }
      return [...prev, { ...product, selected: true }]
    })
  }

  const handleProductQuantityChange = (productId: string, quantity: number) => {
    setSelectedProducts(prev =>
      prev.map(p =>
        p.id === productId ? { ...p, quantity } : p
      )
    )
  }

  const validateForm = () => {
    const errors: string[] = []
    
    if (!formData.requiredDate) {
      errors.push('도착요구일은 필수입니다.')
    }
    
    if (!formData.deliveryType) {
      errors.push('출고형태는 필수입니다.')
    }
    
    if (!formData.usage) {
      errors.push('용도는 필수입니다.')
    }
    
    if (!formData.recipient) {
      errors.push('인수자는 필수입니다.')
    }
    
    if (!formData.recipientContact) {
      errors.push('인수자 연락처는 필수입니다.')
    }
    
    if (!formData.deliveryAddress) {
      errors.push('납품현장주소는 필수입니다.')
    }
    
    if (!formData.siteName) {
      errors.push('현장명은 필수입니다.')
    }
    
    const selectedProductsCount = selectedProducts.filter(p => p.selected).length
    if (selectedProductsCount === 0) {
      errors.push('최소 1개 이상의 제품을 선택해주세요.')
    }
    
    return errors
  }

  const handleSave = () => {
    const validationErrors = validateForm()
    
    if (validationErrors.length > 0) {
      alert('다음 항목을 확인해주세요:\n' + validationErrors.join('\n'))
      return
    }
    
    // 상세주소가 있으면 주소에 추가
    const fullAddress = formData.detailAddress 
      ? `${formData.deliveryAddress}, ${formData.detailAddress}`
      : formData.deliveryAddress
    
    const orderData = {
      ...formData,
      deliveryAddress: fullAddress,
      products: selectedProducts.filter(p => p.selected)
    }
    console.log('주문서 저장:', orderData)
    alert('주문서가 성공적으로 저장되었습니다.')
    // API 호출 로직 구현
  }

  const handleDelete = () => {
    if (confirm('정말로 삭제하시겠습니까?')) {
      // 삭제 로직 구현
      console.log('주문서 삭제')
    }
  }

  const handlePostalCodeSearch = () => {
    // 다음(카카오) 우편번호 검색 API 호출
    new window.daum.Postcode({
      oncomplete: function(data: {
        address: string;
        addressType: string;
        bname: string;
        buildingName: string;
        zonecode: string;
        [key: string]: string | number | boolean;
      }) {
        // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드
        let fullAddress = data.address;
        let extraAddress = '';

        // 도로명 주소인 경우 추가 정보 추가
        if (data.addressType === 'R') {
          if (data.bname !== '') {
            extraAddress += data.bname;
          }
          if (data.buildingName !== '') {
            extraAddress += (extraAddress !== '' ? ', ' + data.buildingName : data.buildingName);
          }
          // 지번주소와 도로명주소 모두 표시
          fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
        }

        // 주소 길이 제한 (100자)
        if (fullAddress.length > 100) {
          fullAddress = fullAddress.substring(0, 100);
        }

        // 주소 데이터 업데이트
        setFormData(prev => ({
          ...prev,
          postalCode: data.zonecode,
          deliveryAddress: fullAddress,
          detailAddress: ''
        }));
      }
    }).open();
  }

  return (
    <div className="space-y-6">
      {/* 브레드크럼 */}
      <div className="flex items-center gap-2 text-sm text-custom-secondary">
        <span>HOME</span>
        <span>{'>'}</span>
        <span>주문관리</span>
        <span>{'>'}</span>
        <span className="text-custom-primary font-medium">주문서입력</span>
      </div>

      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold" style={{color: '#2A3038'}}>주문서입력</h1>
        <div className="text-sm text-custom-secondary">
          * 는 필수입력항목입니다. 빠짐없이 기재해 주시기 바랍니다.
        </div>
      </div>

      {/* 주문서 입력 폼 */}
      <div className="bg-white border border-gray-300 p-4">
        <div className="space-y-3">
          {/* 고객주문번호 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1 text-custom-primary">
                고객주문번호
              </label>
              <input
                type="text"
                value={formData.customerNumber}
                onChange={(e) => handleInputChange('customerNumber', e.target.value)}
                className={inputFieldClass}
                maxLength={20}
                placeholder=""
              />
            </div>
            <div></div>
          </div>

          {/* 주문일자 / 도착요구일 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1 text-custom-primary">
                주문일자
              </label>
              <input
                type="date"
                value={formData.orderDate}
                onChange={(e) => handleInputChange('orderDate', e.target.value)}
                className={inputFieldClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-custom-primary">
                <span className="text-orange-primary">*</span> 도착요구일
              </label>
              <div className="flex gap-1">
                <input
                  type="date"
                  value={formData.requiredDate}
                  onChange={(e) => handleInputChange('requiredDate', e.target.value)}
                  className={`flex-1 ${inputFieldClass}`}
                />
                <select className={`${selectFieldClass} px-1`}>
                  <option>09시</option>
                  <option>10시</option>
                  <option>11시</option>
                  <option>12시</option>
                  <option>13시</option>
                  <option>14시</option>
                  <option>15시</option>
                  <option>16시</option>
                  <option>17시</option>
                  <option>18시</option>
                </select>
              </div>
            </div>
          </div>

          {/* 출고형태 / 용도 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1 text-custom-primary">
                <span className="text-orange-primary">*</span> 출고형태
              </label>
              <select
                value={formData.deliveryType}
                onChange={(e) => handleInputChange('deliveryType', e.target.value)}
                className={selectFieldClass}
              >
                {deliveryTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-custom-primary">
                <span className="text-orange-primary">*</span> 용도
              </label>
              <select
                value={formData.usage}
                onChange={(e) => handleInputChange('usage', e.target.value)}
                className={selectFieldClass}
              >
                <option value="">재고보충기타본게재</option>
                <option value="재고보충">재고보충</option>
                <option value="기타">기타</option>
              </select>
            </div>
          </div>

          {/* 인수자 / 인수자 연락처 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1 text-custom-primary">
                <span className="text-orange-primary">*</span> 인수자
              </label>
              <input
                type="text"
                value={formData.recipient}
                onChange={(e) => handleInputChange('recipient', e.target.value)}
                className={inputFieldClass}
                maxLength={20}
                placeholder=""
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-custom-primary">
                <span className="text-orange-primary">*</span> 인수자 연락처
              </label>
              <input
                type="text"
                value={formData.recipientContact}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  let formattedValue = value;
                  
                  if (value.length <= 11) {
                    if (value.length > 3 && value.length <= 7) {
                      formattedValue = `${value.slice(0, 3)}-${value.slice(3)}`;
                    } else if (value.length > 7) {
                      formattedValue = `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7)}`;
                    }
                    handleInputChange('recipientContact', formattedValue);
                  }
                }}
                className={inputFieldClass}
                placeholder="010-1234-5678"
              />
            </div>
          </div>

          {/* 수요처 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1 text-custom-primary">
                수요처
              </label>
              <input
                type="text"
                value={formData.demandSite}
                onChange={(e) => handleInputChange('demandSite', e.target.value)}
                className={inputFieldClass}
                maxLength={20}
                placeholder=""
              />
            </div>
            <div></div>
          </div>

          {/* 납품현장주소 / 상세주소 */}
          <div>
            <label className="block text-sm font-medium mb-1 text-custom-primary">
              <span className="text-orange-primary">*</span> 납품현장주소
            </label>
            <div className="flex gap-1">
              <input
                type="text"
                value={formData.deliveryAddress}
                onChange={(e) => handleInputChange('deliveryAddress', e.target.value)}
                className={`flex-1 ${inputFieldClass}`}
                placeholder=""
                readOnly
                maxLength={100}
              />
              <button
                onClick={handlePostalCodeSearch}
                className="px-2 py-1 border border-gray-300 bg-gray-50 hover:bg-gray-100 text-xs font-medium text-custom-primary h-8"
              >
                주소검색
              </button>
              <input
                type="text"
                value={formData.detailAddress}
                onChange={(e) => handleInputChange('detailAddress', e.target.value)}
                placeholder="상세주소"
                className={`flex-1 ${inputFieldClass}`}
                maxLength={100}
              />
            </div>
          </div>

          {/* 현장명 / 화폐 / 환율 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1 text-custom-primary">
                <span className="text-orange-primary">*</span> 현장명
              </label>
              <input
                type="text"
                value={formData.siteName}
                onChange={(e) => handleInputChange('siteName', e.target.value)}
                className={inputFieldClass}
                maxLength={20}
                placeholder=""
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-custom-primary">
                화폐
              </label>
              <select
                value={formData.currency}
                onChange={(e) => handleInputChange('currency', e.target.value)}
                className={selectFieldClass}
              >
                <option value="한국(KRW)">한국(KRW)</option>
                <option value="미국(USD)">미국(USD)</option>
                <option value="일본(JPY)">일본(JPY)</option>
                <option value="중국(CNY)">중국(CNY)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-custom-primary">
                환율
              </label>
              <input
                type="text"
                value={formData.exchangeRate}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9.]/g, '');
                  if (value.length <= 5) {
                    handleInputChange('exchangeRate', Number(value) || 0);
                  }
                }}
                className={inputFieldClass}
                maxLength={5}
                placeholder="1"
              />
            </div>
          </div>

          {/* 비고 */}
          <div>
            <label className="block text-sm font-medium mb-1 text-custom-primary">
              비고 ({formData.memo.length}/200)
            </label>
            <textarea
              value={formData.memo}
              onChange={(e) => {
                if (e.target.value.length <= 200) {
                  handleInputChange('memo', e.target.value);
                }
              }}
              rows={3}
              className={textareaFieldClass}
              maxLength={200}
              placeholder=""
            />
          </div>
        </div>
      </div>

      {/* 제품 목록 */}
      <div className="bg-white border border-gray-300 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold" style={{color: '#2A3038'}}>제품목록</h2>
            <div className="flex gap-2">
              <button 
                onClick={handleProductAdd} 
                className="px-4 py-2 bg-orange-primary hover:bg-orange-light text-white text-xs font-medium rounded-sm flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                제품추가
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium" style={{color: '#2A3038'}}>
                  제품코드
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium" style={{color: '#2A3038'}}>
                  제품명
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium" style={{color: '#2A3038'}}>
                  규격
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium" style={{color: '#2A3038'}}>
                  단위
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium" style={{color: '#2A3038'}}>
                  수량
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium" style={{color: '#2A3038'}}>
                  선택
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sampleProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-100">
                  <td className="px-6 py-4 whitespace-nowrap text-sm" style={{color: '#2A3038'}}>
                    {product.productCode}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm" style={{color: '#2A3038'}}>
                    {product.productName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm" style={{color: '#2A3038'}}>
                    {product.specification}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm" style={{color: '#2A3038'}}>
                    {product.unit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm" style={{color: '#2A3038'}}>
                    <input
                      type="number"
                      value={product.quantity}
                      onChange={(e) => handleProductQuantityChange(product.id, Number(e.target.value))}
                      className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-orange-primary focus:border-transparent"
                      min="1"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm" style={{color: '#2A3038'}}>
                    <input
                      type="checkbox"
                      checked={product.selected || false}
                      onChange={() => handleProductSelect(product)}
                      className="w-4 h-4 text-orange-primary border-gray-300 rounded focus:ring-orange-primary"
                    />
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
          onClick={handleSave}
          className="px-4 py-2 border border-gray-300 bg-white hover:bg-gray-100 text-xs font-medium text-custom-primary rounded-sm"
        >
          선택항목 저장하기
        </button>
        <button
          onClick={handleDelete}
          className="px-4 py-2 border border-gray-300 bg-white hover:bg-gray-100 text-xs font-medium text-custom-primary rounded-sm"
        >
          선택항목 삭제하기
        </button>
        <button
          onClick={() => {
            // 발송 로직 구현
            console.log('발송하기')
          }}
          className="px-4 py-2 bg-orange-primary hover:bg-orange-light text-white text-xs font-medium rounded-sm"
        >
          발송하기
        </button>
        <button
          onClick={() => window.location.href = '/order-list'}
          className="px-4 py-2 border border-gray-300 bg-white hover:bg-gray-100 text-xs font-medium text-custom-primary rounded-sm"
        >
          목록보기
        </button>
      </div>

      {/* 제품 검색 모달 */}
      <ProductSearchModal
        isOpen={showProductSearch}
        onClose={handleProductSearchClose}
        onProductSelect={handleProductsFromSearch}
      />
    </div>
  )
} 