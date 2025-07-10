import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { pipebankLogo } from '@/assets'
import FindMemberIdModal from '@/components/ui/FindMemberIdModal'
import type { LoginRequest } from '@/types'

const Login: React.FC = () => {
  const [credentials, setCredentials] = useState<LoginRequest>({
    memberId: '',
    password: ''
  })
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showFindIdModal, setShowFindIdModal] = useState(false)
  
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }))
    // 에러 메시지 초기화
    if (error) setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!credentials.memberId || !credentials.password) {
      setError('아이디와 비밀번호를 입력해주세요.')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      await login(credentials)
      navigate('/', { replace: true })
    } catch (error) {
      console.error('Login error:', error)
      setError('로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFindId = () => {
    setShowFindIdModal(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl p-10 space-y-8">
          {/* 로고 */}
          <div className="text-center">
            <img
              className="h-12 w-auto mx-auto"
              src={pipebankLogo}
              alt="PIPEBANK"
            />
          </div>
          
          {/* 폼 */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <input
                id="memberId"
                name="memberId"
                type="text"
                required
                value={credentials.memberId}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-bluegray-500 focus:border-transparent text-gray-700 placeholder-gray-400"
                placeholder="아이디"
                disabled={isLoading}
              />
            </div>
            
            <div>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={credentials.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-bluegray-500 focus:border-transparent text-gray-700 placeholder-gray-400"
                placeholder="비밀번호"
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600 text-center">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-orange-primary hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  로그인 중...
                </div>
              ) : (
                'Login'
              )}
            </button>
          </form>

          {/* 하단 링크들 */}
          <div className="space-y-4 text-center">
            <p className="text-xs text-gray-400">
              <button
                type="button"
                onClick={handleFindId}
                className="hover:text-orange-500 transition-colors"
              >
                아이디 찾기
              </button>
            </p>
            <p className="text-xs text-gray-400">
              개인정보처리방침
            </p>
            <p className="text-xs text-gray-400">
              회사 대표 문의 : admin@pipebank.com
            </p>
            <p className="text-xs text-gray-300 mt-4">
              Copyright © 2025 PipeBank. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>

      {/* 아이디 찾기 모달 */}
      <FindMemberIdModal
        isOpen={showFindIdModal}
        onClose={() => setShowFindIdModal(false)}
      />
    </div>
  )
}

export default Login 