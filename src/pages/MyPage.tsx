import { useState, useEffect } from 'react'
import { User, Lock } from 'lucide-react'
import { MemberService } from '@/services/member.service'
import PasswordChangeModal from '@/components/ui/PasswordChangeModal'
import type { MemberDetail } from '@/types'

// 공통 입력 필드 스타일을 정의하는 상수
const inputFieldClass = "w-full px-2 py-2 border border-gray-300 focus:border-blue-500 focus:outline-none text-xs text-custom-primary h-8 bg-gray-50"
const labelClass = "block text-sm font-medium mb-1 text-custom-primary"

export default function MyPage() {
  const [memberData, setMemberData] = useState<MemberDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showPasswordModal, setShowPasswordModal] = useState(false)

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
      <div className="bg-white border border-gray-300 p-4">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5 text-orange-primary" />
          <h2 className="text-lg font-semibold" style={{color: '#2A3038'}}>기본 정보</h2>
        </div>
        
        <div className="space-y-3">
          {/* 사용자 아이디 / 사용자 이름 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>
                사용자 아이디
              </label>
              <input
                type="text"
                value={memberData.memberId}
                className={inputFieldClass}
                readOnly
              />
            </div>
            <div>
              <label className={labelClass}>
                사용자 이름
              </label>
              <input
                type="text"
                value={memberData.memberName}
                className={inputFieldClass}
                readOnly
              />
            </div>
          </div>

          {/* 회사명 / 사업자등록번호 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>
                회사명
              </label>
              <input
                type="text"
                value={memberData.custCodeName}
                className={inputFieldClass}
                readOnly
              />
            </div>
            <div>
              <label className={labelClass}>
                사업자등록번호
              </label>
              <input
                type="text"
                value={memberData.custCodeSano}
                className={inputFieldClass}
                readOnly
              />
            </div>
          </div>

          {/* 회사 주소 */}
          <div>
            <label className={labelClass}>
              회사 주소
            </label>
            <input
              type="text"
              value={memberData.custCodeAddr}
              className={inputFieldClass}
              readOnly
            />
          </div>

          {/* 담당자 */}
          <div>
            <label className={labelClass}>
              담당자
            </label>
            <input
              type="text"
              value={memberData.custCodeUname1}
              className={inputFieldClass}
              readOnly
            />
          </div>

          {/* 담당자 핸드폰번호 / 담당자 이메일 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>
                담당자 핸드폰번호
              </label>
              <input
                type="text"
                value={memberData.custCodeUtel1 || '-'}
                className={inputFieldClass}
                readOnly
              />
            </div>
            <div>
              <label className={labelClass}>
                담당자 이메일
              </label>
              <input
                type="text"
                value={memberData.custCodeEmail || '-'}
                className={inputFieldClass}
                readOnly
              />
            </div>
          </div>
        </div>
      </div>

      {/* 계정 정보 */}
      <div className="bg-white border border-gray-300 p-4">
        <div className="flex items-center gap-2 mb-4">
          <Lock className="w-5 h-5 text-orange-primary" />
          <h2 className="text-lg font-semibold" style={{color: '#2A3038'}}>계정 정보</h2>
        </div>
        
        <div className="space-y-3">
          {/* 권한 / 계정 상태 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>
                권한
              </label>
              <input
                type="text"
                value={memberData.roleDescription}
                className={inputFieldClass}
                readOnly
              />
            </div>
            <div>
              <label className={labelClass}>
                계정 상태
              </label>
              <input
                type="text"
                value={memberData.useYn ? '활성' : '비활성'}
                className={inputFieldClass}
                readOnly
              />
            </div>
          </div>
        </div>
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