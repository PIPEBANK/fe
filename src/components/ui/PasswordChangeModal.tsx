import { useState } from 'react'
import { X, Eye, EyeOff, Lock } from 'lucide-react'
import { MemberService } from '@/services/member.service'
import { useAuth } from '@/hooks/useAuth'
import type { ChangePasswordRequest } from '@/types'

interface PasswordChangeModalProps {
  isOpen: boolean
  onClose: () => void
  userId: number
}

// 공통 입력 필드 스타일
const inputFieldClass = "w-full px-3 py-2 border border-gray-300 rounded-sm focus:border-orange-primary focus:outline-none text-sm"
const labelClass = "block text-sm font-medium mb-1 text-custom-primary"

export default function PasswordChangeModal({ isOpen, onClose, userId }: PasswordChangeModalProps) {
  const [formData, setFormData] = useState<ChangePasswordRequest>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const { logout } = useAuth()

  const handleInputChange = (field: keyof ChangePasswordRequest, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    // 입력 시 에러 초기화
    if (errors.length > 0) {
      setErrors([])
    }
  }

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const validateForm = (): string[] => {
    const validationErrors: string[] = []

    if (!formData.currentPassword) {
      validationErrors.push('현재 비밀번호는 필수입니다.')
    }

    if (!formData.newPassword) {
      validationErrors.push('새 비밀번호는 필수입니다.')
    } else if (formData.newPassword.length < 8 || formData.newPassword.length > 100) {
      validationErrors.push('새 비밀번호는 8-100자 사이여야 합니다.')
    }

    if (!formData.confirmPassword) {
      validationErrors.push('새 비밀번호 확인은 필수입니다.')
    } else if (formData.newPassword !== formData.confirmPassword) {
      validationErrors.push('새 비밀번호와 확인 비밀번호가 일치하지 않습니다.')
    }

    if (formData.currentPassword && formData.newPassword && formData.currentPassword === formData.newPassword) {
      validationErrors.push('새 비밀번호는 현재 비밀번호와 달라야 합니다.')
    }

    return validationErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const validationErrors = validateForm()
    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)
    setErrors([])

    try {
      await MemberService.changePassword(userId, formData)
      alert('비밀번호가 성공적으로 변경되었습니다.\n보안을 위해 다시 로그인해 주세요.')
      handleClose()
      
      // 비밀번호 변경 후 로그아웃 처리
      await logout()
    } catch (error: unknown) {
      console.error('비밀번호 변경 실패:', error)
      let errorMessage = '비밀번호 변경에 실패했습니다.'
      if (error && typeof error === 'object' && 'response' in error) {
        const response = (error as { response?: { data?: { message?: string } } }).response
        if (response?.data?.message) {
          errorMessage = response.data.message
        }
      }
      setErrors([errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
    setShowPasswords({
      current: false,
      new: false,
      confirm: false
    })
    setErrors([])
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-orange-primary" />
            <h2 className="text-lg font-semibold text-custom-primary">비밀번호 변경</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 내용 */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* 에러 메시지 */}
            {errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-sm p-3">
                {errors.map((error, index) => (
                  <p key={index} className="text-sm text-red-600">
                    • {error}
                  </p>
                ))}
              </div>
            )}

            {/* 현재 비밀번호 */}
            <div>
              <label className={labelClass}>
                <span className="text-orange-primary">*</span> 현재 비밀번호
              </label>
              <div className="relative">
                <input
                  type={showPasswords.current ? 'text' : 'password'}
                  value={formData.currentPassword}
                  onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                  className={inputFieldClass}
                  placeholder="현재 비밀번호를 입력하세요"
                  maxLength={100}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('current')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* 새 비밀번호 */}
            <div>
              <label className={labelClass}>
                <span className="text-orange-primary">*</span> 새 비밀번호
              </label>
              <div className="relative">
                <input
                  type={showPasswords.new ? 'text' : 'password'}
                  value={formData.newPassword}
                  onChange={(e) => handleInputChange('newPassword', e.target.value)}
                  className={inputFieldClass}
                  placeholder="새 비밀번호를 입력하세요 (8-100자)"
                  maxLength={100}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('new')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* 새 비밀번호 확인 */}
            <div>
              <label className={labelClass}>
                <span className="text-orange-primary">*</span> 새 비밀번호 확인
              </label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className={inputFieldClass}
                  placeholder="새 비밀번호를 다시 입력하세요"
                  maxLength={100}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 bg-white hover:bg-gray-50 text-sm font-medium text-custom-primary rounded-sm"
              disabled={loading}
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-primary hover:bg-orange-light text-white text-sm font-medium rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? '변경 중...' : '비밀번호 변경'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 