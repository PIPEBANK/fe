import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { User, Lock, ArrowLeft, RotateCcw, Pencil, Save, X as Close } from 'lucide-react'
import { MemberService } from '@/services/member.service'
import { MemberRole } from '@/types'
import type { MemberResponse, CustomerResponse } from '@/types'
import { useAuth } from '@/hooks/useAuth'
import CustomerSearchModal from '@/components/ui/CustomerSearchModal'
import SimpleSelect, { type SimpleSelectOption } from '@/components/ui/SimpleSelect'



export default function MemberDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [memberData, setMemberData] = useState<MemberResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [resetLoading, setResetLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [editCust, setEditCust] = useState<{ code: string; name: string }>({ code: '', name: '' })
  const [editRole, setEditRole] = useState<MemberRole | undefined>(undefined)
  const [editUseYn, setEditUseYn] = useState<boolean | undefined>(undefined)
  const [showCustomerSearch, setShowCustomerSearch] = useState(false)

  // 셀렉트 옵션 (커스텀 드롭다운으로 네이티브 옵션 테두리 이슈 회피)
  const roleOptions: SimpleSelectOption[] = [
    { value: MemberRole.USER, label: '사용자' },
    { value: MemberRole.ADMIN, label: '관리자' }
  ]
  const useYnOptions: SimpleSelectOption[] = [
    { value: 'true', label: '활성' },
    { value: 'false', label: '비활성' }
  ]

  useEffect(() => {
    if (id) {
      loadMemberData(parseInt(id))
    }
  }, [id])

  const loadMemberData = async (memberId: number) => {
    try {
      setLoading(true)
      setError(null)
      const data = await MemberService.getMemberById(memberId)
      setMemberData(data)
      setEditName(data.memberName)
      setEditCust({ code: data.custCode?.toString() || '', name: data.custCodeName || '' })
      setEditRole(data.role)
      setEditUseYn(data.useYn)
    } catch (err) {
      console.error('회원 정보 조회 실패:', err)
      setError('회원 정보를 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoBack = () => {
    navigate('/member-list')
  }

  const isAdmin = user?.role === MemberRole.ADMIN

  const handleEditToggle = () => {
    if (!memberData) return
    if (!isEditing) {
      setEditName(memberData.memberName)
      setEditCust({ code: memberData.custCode?.toString() || '', name: memberData.custCodeName || '' })
      setEditRole(memberData.role)
      setEditUseYn(memberData.useYn)
    }
    setIsEditing(prev => !prev)
  }

  const handleCustomerSelect = (customer: CustomerResponse) => {
    if (!customer) return
    const code = String(customer.custCodeCode)
    const name = customer.custCodeName
    setEditCust({ code, name })
    setShowCustomerSearch(false)
  }

  const handleSave = async () => {
    if (!memberData) return
    if (!editName.trim()) {
      alert('회원 이름은 필수입니다.')
      return
    }
    if (!editCust.code) {
      alert('거래처 코드는 필수입니다.')
      return
    }
    try {
      const payload: { memberName: string; custCode: string; role?: MemberRole; useYn?: boolean } = {
        memberName: editName.trim(),
        custCode: editCust.code
      }
      if (isAdmin) {
        payload.role = editRole
        payload.useYn = editUseYn
      }
      const updated = await MemberService.updateMember(parseInt(id as string), payload)
      setMemberData(updated)
      alert('회원 정보가 수정되었습니다.')
      setIsEditing(false)
    } catch (err) {
      console.error('회원 수정 실패:', err)
      alert('회원 정보 수정에 실패했습니다.')
    }
  }

  const handlePasswordReset = async () => {
    if (!memberData || !id) return

    const confirmed = window.confirm(
      `${memberData.memberName}(${memberData.memberId}) 님의 비밀번호를 초기화하시겠습니까?\n\n초기화 후 비밀번호는 '12345678'로 설정됩니다.`
    )

    if (!confirmed) return

    try {
      setResetLoading(true)
      await MemberService.resetPassword(parseInt(id))
      alert('비밀번호가 성공적으로 초기화되었습니다.')
    } catch (err) {
      console.error('비밀번호 초기화 실패:', err)
      alert('비밀번호 초기화에 실패했습니다.')
    } finally {
      setResetLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-custom-secondary">로딩 중...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">{error}</div>
      </div>
    )
  }

  if (!memberData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-custom-secondary">회원 정보를 찾을 수 없습니다.</div>
      </div>
    )
  }

  // 관리자 권한 체크는 상단으로 이동

  return (
    <div className="space-y-6">
      {/* 브레드크럼 */}
      <div className="flex items-center gap-2 text-sm text-custom-secondary">
        <span>HOME</span>
        <span>{'>'}</span>
        <span>전체사용자조회</span>
        <span>{'>'}</span>
        <span className="text-custom-primary font-medium">회원 상세정보</span>
      </div>

      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold" style={{color: '#2A3038'}}>회원 상세정보</h1>
        <div className="flex gap-2">
          {!isEditing ? (
            <button
              onClick={handleEditToggle}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-medium rounded-sm flex items-center gap-2"
            >
              <Pencil className="w-4 h-4" /> 수정하기
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded-sm flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> 저장
              </button>
              <button
                onClick={handleEditToggle}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white text-xs font-medium rounded-sm flex items-center gap-2"
              >
                <Close className="w-4 h-4" /> 취소
              </button>
            </>
          )}
          {isAdmin && (
            <button
              onClick={handlePasswordReset}
              disabled={resetLoading}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-xs font-medium rounded-sm flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              {resetLoading ? '초기화 중...' : '비밀번호 초기화'}
            </button>
          )}
          <button
            onClick={handleGoBack}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white text-xs font-medium rounded-sm flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            목록으로
          </button>
        </div>
      </div>

      {/* 회원 정보 */}
      <div className="bg-white border border-gray-300 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-orange-primary" />
            <h2 className="text-lg font-semibold" style={{color: '#2A3038'}}>기본 정보</h2>
          </div>
        </div>
        
        <table className="w-full">
          <tbody>
            {/* 사용자 아이디 / 사용자 이름 */}
            <tr className="border-b border-gray-200">
              <td className="w-32 px-4 py-4 bg-gray-50 text-sm font-medium text-gray-700 border-r border-gray-200" style={{ width: '12.5%' }}>
                사용자 아이디
              </td>
              <td className="px-4 py-4 text-sm" style={{ width: '37.5%', color: '#2A3038' }}>
                {memberData.memberId}
              </td>
              <td className="w-32 px-4 py-4 bg-gray-50 text-sm font-medium text-gray-700 border-r border-gray-200 border-l border-gray-200" style={{ width: '12.5%' }}>
                사용자 이름
              </td>
              <td className="px-4 py-4 text-sm" style={{ width: '37.5%', color: '#2A3038' }}>
                {isEditing ? (
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm max-w-md"
                    maxLength={100}
                  />
                ) : (
                  memberData.memberName
                )}
              </td>
            </tr>

            {/* 회사명 / 사업자등록번호 */}
            <tr className="border-b border-gray-200">
              <td className="w-32 px-4 py-4 bg-gray-50 text-sm font-medium text-gray-700 border-r border-gray-200" style={{ width: '12.5%' }}>
                회사명
              </td>
              <td className="px-4 py-4 text-sm" style={{ width: '37.5%', color: '#2A3038' }}>
                {isEditing ? (
                  <div className="flex items-center gap-2 max-w-md">
                    <input
                      type="text"
                      value={editCust.name}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 text-sm bg-gray-50 cursor-not-allowed"
                      placeholder="거래처를 선택하세요"
                    />
                    <button
                      onClick={() => setShowCustomerSearch(true)}
                      className="px-3 py-2 border border-gray-300 bg-white hover:bg-gray-50 text-xs"
                    >
                      거래처 검색
                    </button>
                  </div>
                ) : (
                  memberData.custCodeName
                )}
              </td>
              <td className="w-32 px-4 py-4 bg-gray-50 text-sm font-medium text-gray-700 border-r border-gray-200 border-l border-gray-200" style={{ width: '12.5%' }}>
                사업자등록번호
              </td>
              <td className="px-4 py-4 text-sm" style={{ width: '37.5%', color: '#2A3038' }}>
                {memberData.custCodeSano}
              </td>
            </tr>

            {/* 회사 주소 */}
            <tr className="border-b border-gray-200">
              <td className="w-32 px-4 py-4 bg-gray-50 text-sm font-medium text-gray-700 border-r border-gray-200">
                회사 주소
              </td>
              <td className="px-4 py-4 text-sm" colSpan={3} style={{ color: '#2A3038' }}>
                {memberData.custCodeAddr}
              </td>
            </tr>

            {/* 담당자 */}
            <tr className="border-b border-gray-200">
              <td className="w-32 px-4 py-4 bg-gray-50 text-sm font-medium text-gray-700 border-r border-gray-200">
                담당자
              </td>
              <td className="px-4 py-4 text-sm" colSpan={3} style={{ color: '#2A3038' }}>
                {memberData.custCodeUname1}
              </td>
            </tr>

            {/* 담당자 핸드폰번호 / 담당자 이메일 */}
            <tr className="border-b border-gray-200">
              <td className="w-32 px-4 py-4 bg-gray-50 text-sm font-medium text-gray-700 border-r border-gray-200" style={{ width: '12.5%' }}>
                담당자 핸드폰번호
              </td>
              <td className="px-4 py-4 text-sm" style={{ width: '37.5%', color: '#2A3038' }}>
                {memberData.custCodeUtel1 || '-'}
              </td>
              <td className="w-32 px-4 py-4 bg-gray-50 text-sm font-medium text-gray-700 border-r border-gray-200 border-l border-gray-200" style={{ width: '12.5%' }}>
                담당자 이메일
              </td>
              <td className="px-4 py-4 text-sm" style={{ width: '37.5%', color: '#2A3038' }}>
                {memberData.custCodeEmail || '-'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 거래처 검색 모달 */}
      <CustomerSearchModal
        isOpen={showCustomerSearch}
        onClose={() => setShowCustomerSearch(false)}
        onSelect={handleCustomerSelect}
      />

      {/* 계정 정보 */}
      <div className="bg-white border border-gray-300 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-orange-primary" />
            <h2 className="text-lg font-semibold" style={{color: '#2A3038'}}>계정 정보</h2>
          </div>
        </div>
        
        <table className="w-full">
          <tbody>
            {/* 권한 / 계정 상태 */}
            <tr>
              <td className="w-32 px-4 py-4 bg-gray-50 text-sm font-medium text-gray-700 border-r border-gray-200" style={{ width: '12.5%' }}>
                권한
              </td>
              <td className="px-4 py-4 text-sm" style={{ width: '37.5%', color: '#2A3038' }}>
                {isEditing && isAdmin ? (
                  <div className="max-w-xs">
                    <SimpleSelect
                      options={roleOptions}
                      value={editRole || ''}
                      onChange={(value) => setEditRole((value as MemberRole) || undefined)}
                      placeholder="권한 선택"
                      className="h-10"
                      usePortal
                      square
                    />
                  </div>
                ) : (
                  memberData.role === MemberRole.ADMIN ? '관리자' : '사용자'
                )}
              </td>
              <td className="w-32 px-4 py-4 bg-gray-50 text-sm font-medium text-gray-700 border-r border-gray-200 border-l border-gray-200" style={{ width: '12.5%' }}>
                계정 상태
              </td>
              <td className="px-4 py-4 text-sm" style={{ width: '37.5%', color: '#2A3038' }}>
                {isEditing && isAdmin ? (
                  <div className="max-w-xs">
                    <SimpleSelect
                      options={useYnOptions}
                      value={editUseYn === undefined ? '' : String(editUseYn)}
                      onChange={(value) => setEditUseYn(value === 'true')}
                      placeholder="상태 선택"
                      className="h-10"
                      usePortal
                      square
                    />
                  </div>
                ) : (
                  memberData.useYn ? '활성' : '비활성'
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
} 