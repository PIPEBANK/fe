import { useState, useEffect, useRef } from 'react'

import { Plus, Search, X } from 'lucide-react'
import type { OrderFormData, OrderProduct, CommonCode3Response, TempWebOrderMastCreateRequest, TempWebOrderTranCreateRequest } from '@/types'
import ProductCategoryModal from '@/components/ui/ProductCategoryModal'
import ProductSearchModal from '@/components/ui/ProductSearchModal'
import { commonCodeService, TempOrderService } from '@/services'
import { useAuth } from '@/hooks/useAuth'

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
  const { user } = useAuth()
  const timeSelectRef = useRef<HTMLSelectElement>(null)
  const [formData, setFormData] = useState<OrderFormData>({
    customerNumber: '',
    orderNumber: '',
    orderDate: new Date().toISOString().split('T')[0],
    requiredDate: '',
    deliveryType: '',
    usage: '',
    recipient: '',
    recipientContact: '',
    deliveryAddress: '',
    postalCode: '',
    detailAddress: '',
    demandSite: '',
    siteName: '',
    currency: '',
    exchangeRate: 1,
    memo: '',
    products: []
  })

  const [selectedProducts, setSelectedProducts] = useState<OrderProduct[]>([])
  const [showProductCategory, setShowProductCategory] = useState(false)
  const [showProductSearch, setShowProductSearch] = useState(false)
  const [deliveryTypes, setDeliveryTypes] = useState<CommonCode3Response[]>([])
  const [usageTypes, setUsageTypes] = useState<CommonCode3Response[]>([])
  const [currencyTypes, setCurrencyTypes] = useState<CommonCode3Response[]>([])
    const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  // 데이터 변환 함수들

  const convertFormDataToMastRequest = (send: boolean = false): TempWebOrderMastCreateRequest => {
    const today = new Date()
    const dateStr = today.toISOString().split('T')[0].replace(/-/g, '') // 주문일자
    
    // 도착요구일에서 시간 추출 (이미 HH 형식)
    const timeStr = timeSelectRef.current?.value || '09'
    
    return {
      orderMastDate: dateStr, // 주문일자 (오늘 날짜)
      orderMastSosok: 2, // 고정값: 2
      orderMastUjcd: '0013001000', // 고정값
      orderMastCust: parseInt(user?.custCode || '0') || 0, // 로그인한 사람의 custCode
      orderMastScust: 0, // 고정값: 0
      orderMastSawon: parseInt(user?.custCodeSawon || '0') || 0, // 로그인한 사람의 custCodeSawon
      orderMastSawonBuse: parseInt(user?.custCodeBuse || '0') || 0, // 로그인한 사람의 custCodeBuse
      orderMastOdate: formData.requiredDate.replace(/-/g, ''), // 도착요구일
      orderMastProject: 0, // 고정값: 0
      orderMastRemark: formData.memo || '', // 비고 필드값
      orderMastOtime: timeStr, // 도착요구일 시간
      orderMastComaddr1: formData.deliveryAddress || '', // 기본주소
      orderMastComaddr2: formData.detailAddress || '', // 상세주소
      orderMastComname: formData.siteName || '', // 현장명
      orderMastComuname: formData.recipient || '', // 인수자
      orderMastComutel: formData.recipientContact || '', // 인수자 연락처
      orderMastReason: formData.usage || '', // 용도 (선택한 코드의 commCod3Code)
      orderMastTcomdiv: '', // 빈 문자열 (공백X, null X)
      orderMastCurrency: formData.currency || '', // 화폐 (선택한 코드의 commCod3Code)
      orderMastCurrencyPer: formData.exchangeRate?.toString() || '1', // 환율
      orderMastSdiv: '5300010001', // 고정값
      orderMastDcust: formData.demandSite || '', // 수요처
      orderMastIntype: '5370010001', // 고정값
      userId: user?.memberId || 'TEMP',
      send,
      orderTrans: convertProductsToTranRequests() // 통합 API용 상세 배열 추가
    }
  }

  const convertProductsToTranRequests = (): TempWebOrderTranCreateRequest[] => {
    return selectedProducts.map((product) => ({
      // 복합키 필드들은 백엔드에서 자동 설정되므로 제거
      orderTranItemVer: '', // 빈값 고정 (null X, 공백 X)
      orderTranItem: parseInt(product.id) || 0, // 선택한 품목 itemCode값
      orderTranDeta: product.productName, // 선택한 품목 itemName값
      orderTranSpec: product.specification, // 선택한 품목 spec
      orderTranUnit: product.unit, // 선택한 품목 unit
      orderTranCalc: 1, // 고정값
      orderTranVdiv: 1, // 고정값
      orderTranAdiv: 0, // 고정값
      orderTranRate: product.unitPrice || 0, // 선택한 품목 saleRate
      orderTranCnt: product.quantity, // 수량필드 입력값
      orderTranConvertWeight: 0, // 고정값
      orderTranDcPer: 0, // 고정값
      orderTranDcAmt: 0, // 고정값
      orderTranForiAmt: 0, // 고정값
      orderTranAmt: 0, // 고정값
      orderTranNet: 0, // 고정값
      orderTranVat: 0, // 고정값
      orderTranAdv: 0, // 고정값
      orderTranTot: 0, // 고정값
      orderTranLrate: 0, // 고정값
      orderTranPrice: 0, // 고정값
      orderTranPrice2: 0, // 고정값
      orderTranLdiv: 0, // 고정값
      orderTranRemark: '', // 빈값 고정
      orderTranStau: '4010010001', // 고정값
      orderTranWamt: 0 // 고정값
      // userId는 자동생성으로 제거
    }))
  }

  // API에서 공통코드 데이터 로드
  useEffect(() => {
    const loadCommonCodes = async () => {
      try {
        setLoading(true)
        // 출고형태, 용도, 화폐 데이터를 병렬로 로드
        const [deliveryData, usageData, currencyData] = await Promise.all([
          commonCodeService.getLevel3CodesByParent('530'), // 출고형태
          commonCodeService.getLevel3CodesByParent('522'), // 용도
          commonCodeService.getLevel3CodesByParent('191')  // 화폐
        ])
        setDeliveryTypes(deliveryData)
        setUsageTypes(usageData)
        setCurrencyTypes(currencyData)
      } catch (error) {
        console.error('공통코드 데이터 로드 실패:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadCommonCodes()
  }, [])

  const handleInputChange = (field: keyof OrderFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleProductAdd = () => {
    setShowProductCategory(true)
  }

  const handleProductCategoryClose = () => {
    setShowProductCategory(false)
  }

  const handleProductSearch = () => {
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

  const handleProductRemove = (productId: string) => {
    setSelectedProducts(prev => prev.filter(p => p.id !== productId))
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
    
    if (selectedProducts.length === 0) {
      errors.push('최소 1개 이상의 제품을 추가해주세요.')
    }
    
    return errors
  }

  const handleSave = async () => {
    const validationErrors = validateForm()
    
    if (validationErrors.length > 0) {
      alert('다음 항목을 확인해주세요:\n' + validationErrors.join('\n'))
      return
    }
    
    try {
      setSaving(true)
      
      // 발송 요청 데이터 생성
      const request = convertFormDataToMastRequest(true) // send: true
      
      // API 호출 (통합 API 사용)
      const result = await TempOrderService.send(request)
      
      console.log('주문서 발송 성공:', result)
      alert('주문서가 성공적으로 발송되었습니다.')
      
      // 성공 시 목록 페이지로 이동
      window.location.href = '/order-list'
      
    } catch (error) {
      console.error('주문서 발송 실패:', error)
      alert('주문서 발송 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setSaving(false)
    }
  }

  const handleTempSave = async () => {
    const validationErrors = validateForm()
    
    if (validationErrors.length > 0) {
      alert('다음 항목을 확인해주세요:\n' + validationErrors.join('\n'))
      return
    }
    
    try {
      setSaving(true)
      
      // 임시저장 요청 데이터 생성
      const request = convertFormDataToMastRequest(false) // send: false
      
      // API 호출 (통합 API 사용)
      const result = await TempOrderService.tempSave(request)
      
      console.log('임시저장 성공:', result)
      alert('임시저장되었습니다.')
      
      // 성공 시 목록 페이지로 이동
      window.location.href = '/order-list'
      
    } catch (error) {
      console.error('임시저장 실패:', error)
      alert('임시저장 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setSaving(false)
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
                <select
                  ref={timeSelectRef}
                  defaultValue="09"
                  className={`flex-1 ${selectFieldClass}`}
                >
                  <option value="01">01시</option>
                  <option value="02">02시</option>
                  <option value="03">03시</option>
                  <option value="04">04시</option>
                  <option value="05">05시</option>
                  <option value="06">06시</option>
                  <option value="07">07시</option>
                  <option value="08">08시</option>
                  <option value="09">09시</option>
                  <option value="10">10시</option>
                  <option value="11">11시</option>
                  <option value="12">12시</option>
                  <option value="13">13시</option>
                  <option value="14">14시</option>
                  <option value="15">15시</option>
                  <option value="16">16시</option>
                  <option value="17">17시</option>
                  <option value="18">18시</option>
                  <option value="19">19시</option>
                  <option value="20">20시</option>
                  <option value="21">21시</option>
                  <option value="22">22시</option>
                  <option value="23">23시</option>
                  <option value="24">24시</option>
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
                disabled={loading}
              >
                <option value="">출고형태를 선택하세요</option>
                {deliveryTypes.map(type => (
                  <option key={type.commCod3Code} value={type.commCod3Code}>
                    {type.commCod3Hnam}
                  </option>
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
                disabled={loading}
              >
                <option value="">용도를 선택하세요</option>
                {usageTypes.map(type => (
                  <option key={type.commCod3Code} value={type.commCod3Code}>
                    {type.commCod3Hnam}
                  </option>
                ))}
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
                disabled={loading}
              >
                <option value="">화폐를 선택하세요</option>
                {currencyTypes.map(type => (
                  <option key={type.commCod3Code} value={type.commCod3Code}>
                    {type.commCod3Hnam}
                  </option>
                ))}
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
              <button 
                onClick={handleProductSearch} 
                className="px-4 py-2 border border-gray-300 bg-white hover:bg-gray-100 text-xs font-medium text-custom-primary rounded-sm flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                제품검색
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
                  선택취소
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {selectedProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-sm text-custom-secondary">
                    제품추가 또는 제품검색을 통해 제품을 선택해주세요.
                  </td>
                </tr>
              ) : (
                selectedProducts.map((product) => (
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
                      <button
                        onClick={() => handleProductRemove(product.id)}
                        className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                        title="제품 삭제"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 액션 버튼 */}
      <div className="flex justify-center gap-2">
        <button
          onClick={handleTempSave}
          disabled={saving}
          className="px-4 py-2 border border-gray-300 bg-white hover:bg-gray-100 text-xs font-medium text-custom-primary rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? '저장 중...' : '임시저장'}
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-orange-primary hover:bg-orange-light text-white text-xs font-medium rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? '발송 중...' : '발송하기'}
        </button>
        <button
          onClick={() => window.location.href = '/order-list'}
          className="px-4 py-2 border border-gray-300 bg-white hover:bg-gray-100 text-xs font-medium text-custom-primary rounded-sm"
        >
          목록보기
        </button>
      </div>

      {/* 제품 분류선택 모달 */}
      <ProductCategoryModal
        isOpen={showProductCategory}
        onClose={handleProductCategoryClose}
        onProductSelect={handleProductsFromSearch}
        existingProducts={selectedProducts}
      />

      {/* 제품 검색 모달 */}
      <ProductSearchModal
        isOpen={showProductSearch}
        onClose={handleProductSearchClose}
        onProductSelect={handleProductsFromSearch}
        existingProducts={selectedProducts}
      />
    </div>
  )
} 