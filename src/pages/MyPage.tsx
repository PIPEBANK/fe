import { useState, useEffect } from 'react'
import { User, Lock, Pencil, Save, X as Close } from 'lucide-react'
import { MemberService } from '@/services/member.service'
import PasswordChangeModal from '@/components/ui/PasswordChangeModal'
import type { MemberDetail } from '@/types'



export default function MyPage() {
  const [memberData, setMemberData] = useState<MemberDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadMemberData()
  }, [])

  const loadMemberData = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await MemberService.getMyProfile()
      setMemberData(data)
    } catch (err) {
      console.error('회원 정보 조회 실패:', err)
      setError('회원 정보를 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = () => {
    setShowPasswordModal(true)
  }

  const handleEditToggle = () => {
    if (memberData && !isEditing) {
      setEditName(memberData.memberName)
    }
    setIsEditing(prev => !prev)
  }

  const handleSave = async () => {
    if (!memberData) return
    const name = editName.trim()
    if (!name) {
      alert('이름을 입력해주세요.')
      return
    }
    // 백엔드 유효성상 custCode는 필수
    const custCode = memberData.custCode == null ? '' : String(memberData.custCode)
    if (!custCode) {
      alert('거래처 코드 정보를 불러올 수 없습니다. 다시 시도해주세요.')
      return
    }
    try {
      setSaving(true)
      await MemberService.updateMember(memberData.id, { memberName: name, custCode })
      await loadMemberData()
      alert('이름이 수정되었습니다.')
      setIsEditing(false)
    } catch (err) {
      console.error('내 정보 수정 실패:', err)
      alert('내 정보 수정에 실패했습니다.')
    } finally {
      setSaving(false)
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

  return (
    <div className="space-y-6">
      {/* 브레드크럼 */}
      <div className="flex items-center gap-2 text-sm text-custom-secondary">
        <span>HOME</span>
        <span>{'>'}</span>
        <span>마이페이지</span>
        <span>{'>'}</span>
        <span className="text-custom-primary font-medium">내 정보</span>
      </div>

      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold" style={{color: '#2A3038'}}>마이페이지</h1>
        <div className="flex gap-2">
          {!isEditing ? (
            <button
              onClick={handleEditToggle}
              className="px-4 py-2 bg-orange-primary hover:bg-orange-light text-white text-xs font-medium rounded-sm flex items-center gap-2"
            >
              <Pencil className="w-4 h-4" /> 내 정보 수정
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white text-xs font-medium rounded-sm flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> {saving ? '저장 중...' : '저장'}
              </button>
              <button
                onClick={handleEditToggle}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white text-xs font-medium rounded-sm flex items-center gap-2"
              >
                <Close className="w-4 h-4" /> 취소
              </button>
            </>
          )}
          <button
            onClick={handlePasswordChange}
            className="px-4 py-2 bg-orange-primary hover:bg-orange-light text-white text-xs font-medium rounded-sm flex items-center gap-2"
          >
            <Lock className="w-4 h-4" />
            비밀번호 변경
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
                {!isEditing ? (
                  memberData.memberName
                ) : (
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm max-w-md"
                    maxLength={100}
                  />
                )}
              </td>
            </tr>

            {/* 회사명 / 사업자등록번호 */}
            <tr className="border-b border-gray-200">
              <td className="w-32 px-4 py-4 bg-gray-50 text-sm font-medium text-gray-700 border-r border-gray-200" style={{ width: '12.5%' }}>
                회사명
              </td>
              <td className="px-4 py-4 text-sm" style={{ width: '37.5%', color: '#2A3038' }}>
                {memberData.custCodeName}
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
                {memberData.roleDescription}
              </td>
              <td className="w-32 px-4 py-4 bg-gray-50 text-sm font-medium text-gray-700 border-r border-gray-200 border-l border-gray-200" style={{ width: '12.5%' }}>
                계정 상태
              </td>
              <td className="px-4 py-4 text-sm" style={{ width: '37.5%', color: '#2A3038' }}>
                {memberData.useYn ? '활성' : '비활성'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 비밀번호 변경 모달 */}
      <PasswordChangeModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        userId={memberData.id}
      />
    </div>
  )
} 