import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Plus, Search, X } from 'lucide-react'
import type { OrderFormData, OrderProduct, CommonCode3Response, TempWebOrderMastCreateRequest, TempWebOrderTranCreateRequest, TempWebOrderMastResponse, TempWebOrderTranResponse } from '@/types'
import ProductCategoryModal from '@/components/ui/ProductCategoryModal'
import ProductSearchModal from '@/components/ui/ProductSearchModal'
import SearchableSelect, { type SearchableSelectOption } from '@/components/ui/SearchableSelect'
import SimpleSelect, { type SimpleSelectOption } from '@/components/ui/SimpleSelect'
import DatePicker from '@/components/ui/DatePicker'
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
const inputFieldClass = "w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
const textareaFieldClass = "w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm resize-none"
const readOnlyFieldClass = "w-full px-3 py-2 border border-gray-300 text-sm bg-gray-50 cursor-not-allowed"

export default function TempOrderEdit() {
  const { orderNumber, tempOrderId } = useParams<{ orderNumber: string; tempOrderId: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  
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
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [selectedTime, setSelectedTime] = useState('09')

  // 시간 옵션들
  const timeOptions: SimpleSelectOption[] = [
    { value: '01', label: '01시' },
    { value: '02', label: '02시' },
    { value: '03', label: '03시' },
    { value: '04', label: '04시' },
    { value: '05', label: '05시' },
    { value: '06', label: '06시' },
    { value: '07', label: '07시' },
    { value: '08', label: '08시' },
    { value: '09', label: '09시' },
    { value: '10', label: '10시' },
    { value: '11', label: '11시' },
    { value: '12', label: '12시' },
    { value: '13', label: '13시' },
    { value: '14', label: '14시' },
    { value: '15', label: '15시' },
    { value: '16', label: '16시' },
    { value: '17', label: '17시' },
    { value: '18', label: '18시' },
    { value: '19', label: '19시' },
    { value: '20', label: '20시' },
    { value: '21', label: '21시' },
    { value: '22', label: '22시' },
    { value: '23', label: '23시' },
    { value: '24', label: '24시' }
  ]

  // CommonCode3Response를 SearchableSelectOption으로 변환
  const convertToSelectOptions = (codes: CommonCode3Response[]): SearchableSelectOption[] => {
    return codes.map(code => ({
      value: code.commCod3Code,
      label: code.commCod3Hnam
    }))
  }

  // TempWebOrderMastResponse를 OrderFormData로 변환
  const convertTempOrderToFormData = (tempOrder: TempWebOrderMastResponse): OrderFormData => {
    // 주문일자는 항상 오늘 날짜로 표시 (사용자 수정 불가)
    const orderDate = new Date().toISOString().split('T')[0]
    
    // 도착요구일 변환 (YYYYMMDD -> YYYY-MM-DD)
    const requiredDate = tempOrder.orderMastOdate ? 
      `${tempOrder.orderMastOdate.substring(0, 4)}-${tempOrder.orderMastOdate.substring(4, 6)}-${tempOrder.orderMastOdate.substring(6, 8)}` : 
      ''

    return {
      customerNumber: tempOrder.orderMastCust?.toString() || '',
      orderNumber: `${tempOrder.orderMastDate}-${tempOrder.orderMastAcno}`,
      orderDate: orderDate,
      requiredDate: requiredDate,
      deliveryType: tempOrder.orderMastSdiv || '',
      usage: tempOrder.orderMastReason || '',
      recipient: tempOrder.orderMastComuname || '',
      recipientContact: tempOrder.orderMastComutel || '',
      deliveryAddress: tempOrder.orderMastComaddr1 || '',
      postalCode: '', // 우편번호는 별도로 저장되지 않으므로 빈값
      detailAddress: tempOrder.orderMastComaddr2 || '',
      demandSite: tempOrder.orderMastDcust || '',
      siteName: tempOrder.orderMastComname || '',
      currency: tempOrder.orderMastCurrency || '',
      exchangeRate: Number(tempOrder.orderMastCurrencyPer) || 1,
      memo: tempOrder.orderMastRemark || '',
      products: []
    }
  }

  // TempWebOrderTranResponse를 OrderProduct로 변환
  const convertTempOrderTranToProduct = (tempOrderTran: TempWebOrderTranResponse): OrderProduct => {
    return {
      id: tempOrderTran.orderTranItem?.toString() || '',
      productCode: tempOrderTran.itemCodeNum || '',
      productName: tempOrderTran.orderTranDeta || '',
      specification: tempOrderTran.orderTranSpec || '',
      unit: tempOrderTran.orderTranUnit || '',
      quantity: Number(tempOrderTran.orderTranCnt) || 1,
      unitPrice: Number(tempOrderTran.orderTranRate) || 0
    }
  }

  // 데이터 변환 함수들
  const convertFormDataToMastRequest = (send: boolean = false): TempWebOrderMastCreateRequest => {
    const today = new Date()
    const dateStr = today.toISOString().split('T')[0].replace(/-/g, '') // 주문일자
    
    // 도착요구일에서 시간 추출 (이미 HH 형식)
    const timeStr = selectedTime || '09'
    
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
      orderMastCurrency: '1910010120', // 화폐 고정값
      orderMastCurrencyPer: '1', // 환율 고정값
      orderMastSdiv: formData.deliveryType || '', // 출고형태 (선택한 코드의 commCod3Code)
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
    }))
  }

  // 임시저장 데이터 로드
  useEffect(() => {
    const loadTempOrderData = async () => {
      if (!orderNumber || !tempOrderId) {
        alert('주문번호 또는 임시주문ID가 없습니다.')
        navigate('/temp-order-list')
        return
      }

      try {
        setLoading(true)
        const tempOrderData = await TempOrderService.findByOrderNumberAndTempId(orderNumber, Number(tempOrderId))
        
        // 폼 데이터 설정
        const convertedFormData = convertTempOrderToFormData(tempOrderData)
        setFormData(convertedFormData)
        
        // 시간 설정
        setSelectedTime(tempOrderData.orderMastOtime || '09')
        
        // 제품 목록 설정
        if (tempOrderData.orderTrans && tempOrderData.orderTrans.length > 0) {
          const convertedProducts = tempOrderData.orderTrans.map(convertTempOrderTranToProduct)
          setSelectedProducts(convertedProducts)
        }
      } catch (error) {
        console.error('임시저장 데이터 로드 실패:', error)
        alert('임시저장 데이터를 불러오는데 실패했습니다.')
        navigate('/temp-order-list')
      } finally {
        setLoading(false)
      }
    }

    loadTempOrderData()
  }, [orderNumber, tempOrderId, navigate])

  // API에서 공통코드 데이터 로드
  useEffect(() => {
    const loadCommonCodes = async () => {
      try {
        // 출고형태, 용도 데이터를 병렬로 로드
        const [deliveryData, usageData] = await Promise.all([
          commonCodeService.getLevel3CodesByParent('530'), // 출고형태
          commonCodeService.getLevel3CodesByParent('522')  // 용도
        ])
        setDeliveryTypes(deliveryData)
        setUsageTypes(usageData)
      } catch (error) {
        console.error('공통코드 데이터 로드 실패:', error)
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
    
    if (!orderNumber || !tempOrderId) {
      alert('주문번호 또는 임시주문ID가 없습니다.')
      return
    }
    
    try {
      setSaving(true)
      
      // 발송 요청 데이터 생성
      const request = convertFormDataToMastRequest(true) // send: true
      
      // API 호출 (수정 API 사용)
      const result = await TempOrderService.updateByOrderNumberAndTempId(orderNumber, Number(tempOrderId), request)
      
      console.log('주문서 발송 성공:', result)
      alert('주문서가 성공적으로 발송되었습니다.')
      
      // 성공 시 목록 페이지로 이동
      navigate('/temp-order-list')
      
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
    
    if (!orderNumber || !tempOrderId) {
      alert('주문번호 또는 임시주문ID가 없습니다.')
      return
    }
    
    try {
      setSaving(true)
      
      // 임시저장 요청 데이터 생성
      const request = convertFormDataToMastRequest(false) // send: false
      
      // API 호출 (수정 API 사용)
      const result = await TempOrderService.updateByOrderNumberAndTempId(orderNumber, Number(tempOrderId), request)
      
      console.log('임시저장 성공:', result)
      alert('임시저장되었습니다.')
      
      // 성공 시 목록 페이지로 이동
      navigate('/temp-order-list')
      
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">임시저장 데이터를 불러오는 중...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 브레드크럼 */}
      <div className="flex items-center gap-2 text-sm text-custom-secondary">
        <span>HOME</span>
        <span>{'>'}</span>
        <span>주문관리</span>
        <span>{'>'}</span>
        <span>임시저장목록</span>
        <span>{'>'}</span>
        <span className="text-custom-primary font-medium">임시저장 수정</span>
      </div>

      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold" style={{color: '#2A3038'}}>임시저장 수정</h1>
        <div className="text-sm text-custom-secondary">
          주문번호: {formData.orderNumber} | * 는 필수입력항목입니다.
        </div>
      </div>

      {/* 주문서 입력 폼 */}
      <div className="bg-white border border-gray-300 overflow-visible">
        <table className="w-full">
          <tbody>
            {/* 1. 주문일자 + 도착요구일 */}
            <tr className="border-b border-gray-200">
              <td className="w-32 px-4 py-4 bg-gray-50 text-sm font-medium text-gray-700 border-r border-gray-200" style={{ width: '12.5%' }}>
                주문일자
              </td>
              <td className="px-4 py-4" style={{ width: '37.5%' }}>
                <div className="max-w-xs">
                  <DatePicker
                    value={formData.orderDate}
                    onChange={(value) => handleInputChange('orderDate', value)}
                    placeholder="주문일자를 선택하세요"
                    disabled
                  />
                </div>
              </td>
              <td className="w-32 px-4 py-4 bg-gray-50 text-sm font-medium text-gray-700 border-r border-gray-200 border-l border-gray-200" style={{ width: '12.5%' }}>
                <span className="text-orange-primary">*</span> 도착요구일
              </td>
              <td className="px-4 py-4" style={{ width: '37.5%' }}>
                <div className="flex gap-2 items-center">
                  <div className="w-60">
                    <DatePicker
                      value={formData.requiredDate}
                      onChange={(value) => handleInputChange('requiredDate', value)}
                      placeholder="도착요구일을 선택하세요"
                    />
                  </div>
                  <SimpleSelect
                    options={timeOptions}
                    value={selectedTime}
                    onChange={setSelectedTime}
                    className="w-20"
                  />
                </div>
              </td>
            </tr>

            {/* 3. 출고형태 */}
            <tr className="border-b border-gray-200">
              <td className="w-32 px-4 py-4 bg-gray-50 text-sm font-medium text-gray-700 border-r border-gray-200">
                <span className="text-orange-primary">*</span> 출고형태
              </td>
              <td className="px-4 py-4">
                <div className="max-w-md">
                  <SearchableSelect
                    options={convertToSelectOptions(deliveryTypes)}
                    value={formData.deliveryType}
                    onChange={(value) => handleInputChange('deliveryType', value)}
                    placeholder="출고형태를 선택하세요"
                  />
                </div>
              </td>
            </tr>

            {/* 4. 용도 */}
            <tr className="border-b border-gray-200">
              <td className="w-32 px-4 py-4 bg-gray-50 text-sm font-medium text-gray-700 border-r border-gray-200">
                <span className="text-orange-primary">*</span> 용도
              </td>
              <td className="px-4 py-4">
                <div className="max-w-md">
                  <SearchableSelect
                    options={convertToSelectOptions(usageTypes)}
                    value={formData.usage}
                    onChange={(value) => handleInputChange('usage', value)}
                    placeholder="용도를 선택하세요"
                  />
                </div>
              </td>
            </tr>

            {/* 5. 인수자 */}
            <tr className="border-b border-gray-200">
              <td className="w-32 px-4 py-4 bg-gray-50 text-sm font-medium text-gray-700 border-r border-gray-200">
                <span className="text-orange-primary">*</span> 인수자
              </td>
              <td className="px-4 py-4">
                <input
                  type="text"
                  value={formData.recipient}
                  onChange={(e) => handleInputChange('recipient', e.target.value)}
                  className={`max-w-md ${inputFieldClass}`}
                  maxLength={20}
                  placeholder="인수자를 입력하세요"
                />
              </td>
            </tr>

            {/* 6. 인수자 연락처 */}
            <tr className="border-b border-gray-200">
              <td className="w-32 px-4 py-4 bg-gray-50 text-sm font-medium text-gray-700 border-r border-gray-200">
                <span className="text-orange-primary">*</span> 인수자 연락처
              </td>
              <td className="px-4 py-4">
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
                  className={`max-w-md ${inputFieldClass}`}
                  placeholder="010-1234-5678"
                />
              </td>
            </tr>

            {/* 7. 현장명 */}
            <tr className="border-b border-gray-200">
              <td className="w-32 px-4 py-4 bg-gray-50 text-sm font-medium text-gray-700 border-r border-gray-200">
                <span className="text-orange-primary">*</span> 현장명
              </td>
              <td className="px-4 py-4">
                <input
                  type="text"
                  value={formData.siteName}
                  onChange={(e) => handleInputChange('siteName', e.target.value)}
                  className={`max-w-md ${inputFieldClass}`}
                  maxLength={20}
                  placeholder="현장명을 입력하세요"
                />
              </td>
            </tr>

            {/* 8. 납품현장주소 */}
            <tr className="border-b border-gray-200">
              <td className="w-32 px-4 py-4 bg-gray-50 text-sm font-medium text-gray-700 border-r border-gray-200">
                <span className="text-orange-primary">*</span> 납품현장주소
              </td>
              <td className="px-4 py-4" colSpan={3}>
                <div className="flex gap-2 items-center w-full">
                  <input
                    type="text"
                    value={formData.deliveryAddress}
                    onChange={(e) => handleInputChange('deliveryAddress', e.target.value)}
                    className={`flex-1 ${readOnlyFieldClass}`}
                    placeholder="주소검색을 통해 주소를 선택하세요"
                    readOnly
                    maxLength={100}
                  />
                  <button
                    onClick={handlePostalCodeSearch}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded shrink-0"
                  >
                    주소검색
                  </button>
                  <input
                    type="text"
                    value={formData.detailAddress}
                    onChange={(e) => handleInputChange('detailAddress', e.target.value)}
                    placeholder="상세주소를 입력하세요"
                    className={`flex-1 ${inputFieldClass}`}
                    maxLength={100}
                  />
                </div>
              </td>
            </tr>

            {/* 9. 수요처 */}
            <tr className="border-b border-gray-200">
              <td className="w-32 px-4 py-4 bg-gray-50 text-sm font-medium text-gray-700 border-r border-gray-200">
                수요처
              </td>
              <td className="px-4 py-4">
                <input
                  type="text"
                  value={formData.demandSite}
                  onChange={(e) => handleInputChange('demandSite', e.target.value)}
                  className={`max-w-md ${inputFieldClass}`}
                  maxLength={20}
                  placeholder="수요처를 입력하세요"
                />
              </td>
            </tr>



            {/* 12. 비고 */}
            <tr>
              <td className="w-32 px-4 py-4 bg-gray-50 text-sm font-medium text-gray-700 border-r border-gray-200">
                비고 ({formData.memo.length}/200)
              </td>
              <td className="px-4 py-4" colSpan={3}>
                <textarea
                  value={formData.memo}
                  onChange={(e) => {
                    if (e.target.value.length <= 200) {
                      handleInputChange('memo', e.target.value);
                    }
                  }}
                  rows={4}
                  className={`w-full ${textareaFieldClass}`}
                  maxLength={200}
                  placeholder="비고사항을 입력하세요"
                />
              </td>
            </tr>
          </tbody>
        </table>
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
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? '발송 중...' : '주문하기'}
        </button>
        <button
          onClick={handleTempSave}
          disabled={saving}
          className="px-6 py-2 border border-gray-300 bg-white hover:bg-gray-50 text-sm font-medium text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? '저장 중...' : '임시저장'}
        </button>
        <button
          onClick={() => navigate('/temp-order-list')}
          className="px-6 py-2 border border-gray-300 bg-white hover:bg-gray-50 text-sm font-medium text-gray-700 rounded"
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