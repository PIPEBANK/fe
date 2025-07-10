import React, { useState } from 'react'
import { X, Search, User } from 'lucide-react'
import { authService } from '@/services/auth.service'
import type { FindMemberIdRequest, FindMemberIdResponse } from '@/types'

interface FindMemberIdModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function FindMemberIdModal({ isOpen, onClose }: FindMemberIdModalProps) {
  const [formData, setFormData] = useState<FindMemberIdRequest>({
    memberName: '',
    custCodeSano: ''
  })
  const [result, setResult] = useState<FindMemberIdResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // 에러 메시지 초기화
    if (error) setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.memberName || !formData.custCodeSano) {
      setError('사용자명과 사업자등록번호를 모두 입력해주세요.')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await authService.findMemberId(formData)
      setResult(response)
    } catch (err) {
      console.error('아이디 찾기 실패:', err)
      setError('입력하신 정보와 일치하는 사용자를 찾을 수 없습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({ memberName: '', custCodeSano: '' })
    setResult(null)
    setError('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold" style={{ color: '#2A3038' }}>
            아이디 찾기
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 내용 */}
        <div className="p-6">
          {!result ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#2A3038' }}>
                  사용자명
                </label>
                <input
                  type="text"
                  name="memberName"
                  value={formData.memberName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="사용자명을 입력하세요"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#2A3038' }}>
                  사업자등록번호
                </label>
                <input
                  type="text"
                  name="custCodeSano"
                  value={formData.custCodeSano}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="사업자등록번호를 입력하세요 (예: 123-45-67890)"
                  disabled={loading}
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                {loading ? '검색 중...' : '아이디 찾기'}
              </button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-orange-500" />
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2" style={{ color: '#2A3038' }}>
                  아이디를 찾았습니다!
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {result.memberName}님의 아이디는 다음과 같습니다.
                </p>
                
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-lg font-semibold text-orange-600">
                    {result.memberId}
                  </p>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                확인
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 