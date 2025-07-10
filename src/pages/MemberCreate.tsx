import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Check, X } from 'lucide-react'
import { MemberService } from '@/services/member.service'
import { MemberRole } from '@/types'
import type { MemberCreateRequest, CustomerResponse } from '@/types'
import CustomerSearchModal from '@/components/ui/CustomerSearchModal'

// 공통 입력 필드 스타일을 정의하는 상수
const inputFieldClass = "w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
const selectFieldClass = "w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm bg-white"
const readOnlyFieldClass = "w-full px-3 py-2 border border-gray-300 text-sm bg-gray-50 cursor-not-allowed"

export default function MemberCreate() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<MemberCreateRequest>({
    memberId: '',
    memberPw: '',
    memberName: '',
    custCode: '',
    useYn: true,
    role: MemberRole.USER
  })

  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [memberIdChecked, setMemberIdChecked] = useState(false)
  const [memberIdValid, setMemberIdValid] = useState(false)
  const [checkingId, setCheckingId] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerResponse | null>(null)
  const [showCustomerSearch, setShowCustomerSearch] = useState(false)

  const handleInputChange = (field: keyof MemberCreateRequest, value: string | MemberRole | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // 사용자 ID가 변경되면 중복 체크 상태 초기화
    if (field === 'memberId') {
      setMemberIdChecked(false)
      setMemberIdValid(false)
    }
  }

  const handleCheckDuplicate = async () => {
    if (!formData.memberId) {
      alert('사용자 ID를 입력해주세요.')
      return
    }

    if (formData.memberId.length < 3) {
      alert('사용자 ID는 3자 이상이어야 합니다.')
      return
    }

    try {
      setCheckingId(true)
      const response = await MemberService.checkDuplicateMemberId(formData.memberId)
      
      if (response.exists) {
        alert('이미 사용 중인 사용자 ID입니다.')
        setMemberIdValid(false)
      } else {
        alert('사용 가능한 사용자 ID입니다.')
        setMemberIdValid(true)
      }
      setMemberIdChecked(true)
    } catch (error) {
      console.error('중복 체크 실패:', error)
      alert('중복 체크 중 오류가 발생했습니다.')
    } finally {
      setCheckingId(false)
    }
  }

  // 거래처 선택 처리
  const handleCustomerSelect = (customer: CustomerResponse) => {
    setSelectedCustomer(customer)
    setFormData(prev => ({
      ...prev,
      custCode: customer.custCodeCode.toString()
    }))
  }

  // 거래처 검색 모달 열기
  const handleCustomerSearch = () => {
    setShowCustomerSearch(true)
  }

  const validateForm = () => {
    const errors: string[] = []
    
    if (!formData.memberId) {
      errors.push('회원 ID는 필수입니다.')
    } else if (formData.memberId.length < 3 || formData.memberId.length > 50) {
      errors.push('회원 ID는 3-50자 사이여야 합니다.')
    }

    if (!memberIdChecked || !memberIdValid) {
      errors.push('회원 ID 중복 체크를 완료해주세요.')
    }
    
    if (!formData.memberPw) {
      errors.push('회원 비밀번호는 필수입니다.')
    } else if (formData.memberPw.length < 8 || formData.memberPw.length > 100) {
      errors.push('회원 비밀번호는 8-100자 사이여야 합니다.')
    }

    if (!passwordConfirm) {
      errors.push('회원 비밀번호 확인은 필수입니다.')
    } else if (formData.memberPw !== passwordConfirm) {
      errors.push('비밀번호와 비밀번호 확인이 일치하지 않습니다.')
    }
    
    if (!formData.memberName) {
      errors.push('회원 이름은 필수입니다.')
    } else if (formData.memberName.length > 100) {
      errors.push('회원 이름은 100자를 초과할 수 없습니다.')
    }
    
    if (!formData.custCode) {
      errors.push('거래처코드는 필수입니다.')
    }
    
    return errors
  }

  const handleSubmit = async () => {
    const validationErrors = validateForm()
    
    if (validationErrors.length > 0) {
      alert('다음 항목을 확인해주세요:\n' + validationErrors.join('\n'))
      return
    }
    
    try {
      setLoading(true)
      
      const result = await MemberService.createMember(formData)
      
      console.log('사용자 생성 성공:', result)
      alert('사용자가 성공적으로 생성되었습니다.')
      
      // 성공 시 전체사용자조회 페이지로 이동
      navigate('/member-list')
      
    } catch (error) {
      console.error('사용자 생성 실패:', error)
      alert('사용자 생성 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    navigate('/member-list')
  }

  return (
    <div className="space-y-6">
      {/* 브레드크럼 */}
      <div className="flex items-center gap-2 text-sm text-custom-secondary">
        <span>HOME</span>
        <span>{'>'}</span>
        <span>사용자관리</span>
        <span>{'>'}</span>
        <span className="text-custom-primary font-medium">사용자추가</span>
      </div>

      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold" style={{color: '#2A3038'}}>사용자추가</h1>
        <div className="text-sm text-custom-secondary">
          * 는 필수입력항목입니다. 빠짐없이 기재해 주시기 바랍니다.
        </div>
      </div>

      {/* 사용자 정보 입력 폼 - 테이블 형태 */}
      <div className="bg-white border border-gray-300 overflow-hidden">
        <table className="w-full">
          <tbody>
            {/* 1. 회원 ID */}
            <tr className="border-b border-gray-200">
              <td className="w-32 px-4 py-4 bg-gray-50 text-sm font-medium text-gray-700 border-r border-gray-200">
                <span className="text-orange-primary">*</span> 회원 ID
              </td>
              <td className="px-4 py-4">
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={formData.memberId}
                    onChange={(e) => handleInputChange('memberId', e.target.value)}
                    className={`flex-1 max-w-md ${inputFieldClass}`}
                    placeholder="회원 ID를 입력하세요"
                    maxLength={50}
                  />
                  <button
                    onClick={handleCheckDuplicate}
                    disabled={checkingId || !formData.memberId}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded"
                  >
                    {checkingId ? '확인중...' : '중복확인'}
                  </button>
                </div>
                {memberIdChecked && (
                  <div className={`flex items-center gap-1 mt-2 text-sm ${memberIdValid ? 'text-green-600' : 'text-red-600'}`}>
                    {memberIdValid ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    {memberIdValid ? '사용 가능한 ID입니다.' : '사용할 수 없는 ID입니다.'}
                  </div>
                )}
              </td>
            </tr>

            {/* 2. 회원 비밀번호 */}
            <tr className="border-b border-gray-200">
              <td className="w-32 px-4 py-4 bg-gray-50 text-sm font-medium text-gray-700 border-r border-gray-200">
                <span className="text-orange-primary">*</span> 회원 비밀번호
              </td>
              <td className="px-4 py-4">
                <div className="relative max-w-md">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.memberPw}
                    onChange={(e) => handleInputChange('memberPw', e.target.value)}
                    className={inputFieldClass}
                    placeholder="비밀번호를 입력하세요"
                    maxLength={100}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </td>
            </tr>

            {/* 3. 회원 비밀번호 확인 */}
            <tr className="border-b border-gray-200">
              <td className="w-32 px-4 py-4 bg-gray-50 text-sm font-medium text-gray-700 border-r border-gray-200">
                <span className="text-orange-primary">*</span> 회원 비밀번호 확인
              </td>
              <td className="px-4 py-4">
                <div className="relative max-w-md">
                  <input
                    type={showPasswordConfirm ? 'text' : 'password'}
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    className={inputFieldClass}
                    placeholder="비밀번호를 다시 입력하세요"
                    maxLength={100}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswordConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {passwordConfirm && formData.memberPw !== passwordConfirm && (
                  <div className="flex items-center gap-1 mt-2 text-sm text-red-600">
                    <X className="w-4 h-4" />
                    비밀번호가 일치하지 않습니다.
                  </div>
                )}
                {passwordConfirm && formData.memberPw === passwordConfirm && (
                  <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
                    <Check className="w-4 h-4" />
                    비밀번호가 일치합니다.
                  </div>
                )}
              </td>
            </tr>

            {/* 4. 회원 이름 */}
            <tr className="border-b border-gray-200">
              <td className="w-32 px-4 py-4 bg-gray-50 text-sm font-medium text-gray-700 border-r border-gray-200">
                <span className="text-orange-primary">*</span> 회원 이름
              </td>
              <td className="px-4 py-4">
                <input
                  type="text"
                  value={formData.memberName}
                  onChange={(e) => handleInputChange('memberName', e.target.value)}
                  className={`max-w-md ${inputFieldClass}`}
                  placeholder="회원 이름을 입력하세요"
                  maxLength={100}
                />
              </td>
            </tr>

            {/* 5. 거래처코드 */}
            <tr className="border-b border-gray-200">
              <td className="w-32 px-4 py-4 bg-gray-50 text-sm font-medium text-gray-700 border-r border-gray-200">
                <span className="text-orange-primary">*</span> 거래처코드
              </td>
              <td className="px-4 py-4">
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={formData.custCode}
                    onChange={(e) => handleInputChange('custCode', e.target.value)}
                    className={`flex-1 max-w-md ${inputFieldClass}`}
                    placeholder="거래처코드를 입력하세요"
                    maxLength={50}
                  />
                  <button
                    onClick={handleCustomerSearch}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded"
                  >
                    거래처 검색
                  </button>
                </div>
              </td>
            </tr>

            {/* 6. 거래처명 (읽기전용) */}
            <tr className="border-b border-gray-200">
              <td className="w-32 px-4 py-4 bg-gray-50 text-sm font-medium text-gray-700 border-r border-gray-200">
                거래처명
              </td>
              <td className="px-4 py-4">
                <input
                  type="text"
                  value={selectedCustomer?.custCodeName || ''}
                  className={`max-w-md ${readOnlyFieldClass}`}
                  placeholder="거래처를 선택하면 자동으로 입력됩니다"
                  readOnly
                />
              </td>
            </tr>

            {/* 7. 사업자등록번호 (읽기전용) */}
            <tr className="border-b border-gray-200">
              <td className="w-32 px-4 py-4 bg-gray-50 text-sm font-medium text-gray-700 border-r border-gray-200">
                사업자등록번호
              </td>
              <td className="px-4 py-4">
                <input
                  type="text"
                  value={selectedCustomer?.custCodeSano || ''}
                  className={`max-w-md ${readOnlyFieldClass}`}
                  placeholder="거래처를 선택하면 자동으로 입력됩니다"
                  readOnly
                />
              </td>
            </tr>

            {/* 8. 주소 (읽기전용) */}
            <tr className="border-b border-gray-200">
              <td className="w-32 px-4 py-4 bg-gray-50 text-sm font-medium text-gray-700 border-r border-gray-200">
                주소
              </td>
              <td className="px-4 py-4">
                <input
                  type="text"
                  value={selectedCustomer?.custCodeAddr || ''}
                  className={`max-w-lg ${readOnlyFieldClass}`}
                  placeholder="거래처를 선택하면 자동으로 입력됩니다"
                  readOnly
                />
              </td>
            </tr>

            {/* 9. 이메일 (읽기전용) */}
            <tr className="border-b border-gray-200">
              <td className="w-32 px-4 py-4 bg-gray-50 text-sm font-medium text-gray-700 border-r border-gray-200">
                이메일
              </td>
              <td className="px-4 py-4">
                <input
                  type="text"
                  value={selectedCustomer?.custCodeEmail || ''}
                  className={`max-w-md ${readOnlyFieldClass}`}
                  placeholder="거래처를 선택하면 자동으로 입력됩니다"
                  readOnly
                />
              </td>
            </tr>

            {/* 10. 담당자 (읽기전용) */}
            <tr className="border-b border-gray-200">
              <td className="w-32 px-4 py-4 bg-gray-50 text-sm font-medium text-gray-700 border-r border-gray-200">
                담당자
              </td>
              <td className="px-4 py-4">
                <input
                  type="text"
                  value={selectedCustomer?.custCodeUname1 || ''}
                  className={`max-w-md ${readOnlyFieldClass}`}
                  placeholder="거래처를 선택하면 자동으로 입력됩니다"
                  readOnly
                />
              </td>
            </tr>

            {/* 11. 담당자연락처 (읽기전용) */}
            <tr className="border-b border-gray-200">
              <td className="w-32 px-4 py-4 bg-gray-50 text-sm font-medium text-gray-700 border-r border-gray-200">
                담당자연락처
              </td>
              <td className="px-4 py-4">
                <input
                  type="text"
                  value={selectedCustomer?.custCodeUtel1 || ''}
                  className={`max-w-md ${readOnlyFieldClass}`}
                  placeholder="거래처를 선택하면 자동으로 입력됩니다"
                  readOnly
                />
              </td>
            </tr>

            {/* 권한 */}
            <tr>
              <td className="w-32 px-4 py-4 bg-gray-50 text-sm font-medium text-gray-700 border-r border-gray-200">
                <span className="text-orange-primary">*</span> 권한
              </td>
              <td className="px-4 py-4">
                <select
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value as MemberRole)}
                  className={`max-w-md ${selectFieldClass}`}
                >
                  <option value={MemberRole.USER}>사용자</option>
                  <option value={MemberRole.ADMIN}>관리자</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 액션 버튼 */}
      <div className="flex justify-center gap-2">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '생성 중...' : '사용자 생성'}
        </button>
        <button
          onClick={handleCancel}
          className="px-6 py-2 border border-gray-300 bg-white hover:bg-gray-50 text-sm font-medium text-gray-700 rounded"
        >
          취소
        </button>
      </div>

      {/* 거래처 검색 모달 */}
      <CustomerSearchModal
        isOpen={showCustomerSearch}
        onClose={() => setShowCustomerSearch(false)}
        onSelect={handleCustomerSelect}
      />
    </div>
  )
} 