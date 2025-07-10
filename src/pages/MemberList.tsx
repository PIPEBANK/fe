import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MemberService } from '@/services/member.service'
import { MemberRole } from '@/types'
import type { MemberResponse, MemberSearchParams } from '@/types'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import RoundedSimpleSelect, { type RoundedSimpleSelectOption } from '@/components/ui/RoundedSimpleSelect'

export default function MemberList() {
  const navigate = useNavigate()
  const [members, setMembers] = useState<MemberResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)

  // 권한 옵션
  const roleOptions: RoundedSimpleSelectOption[] = [
    { value: '', label: '전체' },
    { value: MemberRole.ADMIN, label: '관리자' },
    { value: MemberRole.USER, label: '사용자' }
  ]

  // 사용여부 옵션
  const useYnOptions: RoundedSimpleSelectOption[] = [
    { value: '', label: '전체' },
    { value: 'true', label: '사용' },
    { value: 'false', label: '미사용' }
  ]
  
  // 검색 상태
  const [searchParams, setSearchParams] = useState<MemberSearchParams>({
    memberId: '',
    memberName: '',
    custCodeName: '',
    role: undefined,
    useYn: undefined,
    page: 0,
    size: 20,
    sort: 'createDate',
    direction: 'desc'
  })

  // 데이터 로드
  const loadMembers = async (params: MemberSearchParams = searchParams) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await MemberService.getAllMembers({
        page: params.page,
        size: params.size,
        sort: params.sort,
        direction: params.direction,
        memberId: params.memberId,
        memberName: params.memberName,
        custCodeName: params.custCodeName,
        role: params.role,
        useYn: params.useYn
      })
      
      setMembers(response.content)
      setTotalElements(response.totalElements)
      setTotalPages(response.totalPages)
      setCurrentPage(response.number)
    } catch (err) {
      console.error('Failed to load members:', err)
      setError('사용자 목록을 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  // 초기 로드
  useEffect(() => {
    loadMembers()
  }, [])

  // 검색 실행
  const handleSearch = () => {
    const newParams = { ...searchParams, page: 0 }
    setSearchParams(newParams)
    loadMembers(newParams)
  }

  // 검색 초기화
  const handleReset = () => {
    const resetParams: MemberSearchParams = {
      memberId: '',
      memberName: '',
      custCodeName: '',
      role: undefined,
      useYn: undefined,
      page: 0,
      size: 20,
      sort: 'createDate',
      direction: 'desc'
    }
    setSearchParams(resetParams)
    loadMembers(resetParams)
  }

  // 페이지 변경
  const handlePageChange = (page: number) => {
    const newParams = { ...searchParams, page }
    setSearchParams(newParams)
    loadMembers(newParams)
  }

  // 검색 입력 변경
  const handleSearchInputChange = (field: keyof MemberSearchParams, value: string | MemberRole | boolean | undefined) => {
    setSearchParams(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // 회원 상세조회로 이동
  const handleMemberClick = (memberId: number) => {
    navigate(`/member-detail/${memberId}`)
  }

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">로딩 중...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: '#2A3038' }}>
          전체사용자조회
        </h1>
        <p className="text-gray-600 mt-2">시스템에 등록된 모든 사용자를 조회할 수 있습니다.</p>
      </div>

      {/* 검색 영역 */}
      <div className="bg-white rounded-xl p-6 card-shadow border-t-4 border-orange-500">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#2A3038' }}>
              사용자ID
            </label>
            <input
              type="text"
              value={searchParams.memberId || ''}
              onChange={(e) => handleSearchInputChange('memberId', e.target.value)}
              className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-primary focus:border-transparent"
              placeholder="사용자ID 입력"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#2A3038' }}>
              사용자명
            </label>
            <input
              type="text"
              value={searchParams.memberName || ''}
              onChange={(e) => handleSearchInputChange('memberName', e.target.value)}
              className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-primary focus:border-transparent"
              placeholder="사용자명 입력"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#2A3038' }}>
              거래처명
            </label>
            <input
              type="text"
              value={searchParams.custCodeName || ''}
              onChange={(e) => handleSearchInputChange('custCodeName', e.target.value)}
              className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-primary focus:border-transparent"
              placeholder="거래처명 입력"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#2A3038' }}>
              권한
            </label>
            <RoundedSimpleSelect
              options={roleOptions}
              value={searchParams.role || ''}
              onChange={(value) => handleSearchInputChange('role', value as MemberRole || undefined)}
              placeholder="권한을 선택하세요"
              className="h-10"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#2A3038' }}>
              사용여부
            </label>
            <RoundedSimpleSelect
              options={useYnOptions}
              value={searchParams.useYn === undefined ? '' : searchParams.useYn.toString()}
              onChange={(value) => handleSearchInputChange('useYn', value === '' ? undefined : value === 'true')}
              placeholder="사용여부를 선택하세요"
              className="h-10"
            />
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleSearch} 
              disabled={loading}
              className="bg-orange-500 hover:bg-orange-600 h-10 disabled:opacity-50 flex-1"
            >
              <Search className="w-4 h-4 mr-2" />
              {loading ? '검색중...' : '검색'}
            </Button>
            <Button 
              onClick={handleReset}
              variant="outline"
              className="h-10 border-gray-300 text-gray-700 hover:bg-gray-50 flex-1"
            >
              초기화
            </Button>
          </div>
        </div>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* 결과 정보 */}
      <div className="mb-4">
        <div className="text-sm text-gray-600">
          총 <span className="font-semibold" style={{ color: '#FF6F0F' }}>{totalElements}</span>건의 사용자가 있습니다.
        </div>
      </div>

      {/* 테이블 */}
      <div className="bg-white rounded-xl card-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium" style={{ color: '#2A3038' }}>
                  사용자ID
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium" style={{ color: '#2A3038' }}>
                  사용자명
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium" style={{ color: '#2A3038' }}>
                  거래처코드
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium" style={{ color: '#2A3038' }}>
                  거래처명
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium" style={{ color: '#2A3038' }}>
                  담당자명
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium" style={{ color: '#2A3038' }}>
                  연락처
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium" style={{ color: '#2A3038' }}>
                  권한
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium" style={{ color: '#2A3038' }}>
                  사용여부
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium" style={{ color: '#2A3038' }}>
                  등록일
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center text-sm text-gray-500">
                    로딩 중...
                  </td>
                </tr>
              ) : members.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center text-sm text-gray-500">
                    조회된 사용자가 없습니다.
                  </td>
                </tr>
              ) : (
                members.map((member) => (
                  <tr 
                    key={member.id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleMemberClick(member.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" style={{ color: '#2A3038' }}>
                      {member.memberId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: '#2A3038' }}>
                      {member.memberName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: '#2A3038' }}>
                      {member.custCode}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: '#2A3038' }}>
                      {member.custCodeName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: '#2A3038' }}>
                      {member.custCodeUname1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: '#2A3038' }}>
                      {member.custCodeUtel1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: '#2A3038' }}>
                      {member.role === MemberRole.ADMIN ? '관리자' : '사용자'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        member.useYn 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {member.useYn ? '사용' : '미사용'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(member.createDate)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 페이지네이션 */}
        {!loading && totalElements > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              {/* 페이지 정보 및 사이즈 선택 */}
              <div className="flex items-center gap-4">
                <div className="text-sm" style={{ color: '#868B94' }}>
                  총 {totalElements}개 중 {(currentPage * 20) + 1}-{Math.min((currentPage + 1) * 20, totalElements)}개 표시
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm" style={{ color: '#2A3038' }}>페이지당 표시:</span>
                  <select
                    value={searchParams.size || 20}
                    onChange={(e) => {
                      const newSize = Number(e.target.value)
                      const newParams = { ...searchParams, size: newSize, page: 0 }
                      setSearchParams(newParams)
                      loadMembers(newParams)
                    }}
                    className="border border-gray-300 rounded px-2 py-1 text-sm"
                    style={{ color: '#2A3038' }}
                  >
                    <option value={10}>10개</option>
                    <option value={20}>20개</option>
                    <option value={50}>50개</option>
                  </select>
                </div>
              </div>

              {/* 페이지네이션 버튼 */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                  className="h-8 w-8 p-0"
                >
                  ‹
                </Button>
                
                {/* 페이지 번호 버튼들 */}
                {(() => {
                  const maxButtons = 5
                  
                  if (totalPages <= maxButtons) {
                    // 전체 페이지가 5개 이하면 모든 페이지 표시
                    return Array.from({ length: totalPages }, (_, i) => (
                      <Button
                        key={i}
                        variant={i === currentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(i)}
                        className={`h-8 w-8 p-0 ${
                          i === currentPage 
                            ? "bg-orange-500 hover:bg-orange-600 text-white border-orange-500" 
                            : ""
                        }`}
                      >
                        {i + 1}
                      </Button>
                    ))
                  }
                  
                  // 전체 페이지가 5개 초과일 때 스마트 페이징
                  let startPage = Math.max(0, currentPage - 2)
                  const endPage = Math.min(totalPages - 1, startPage + maxButtons - 1)
                  
                  // 끝에서 5개가 안 될 때 시작점 조정
                  if (endPage - startPage < maxButtons - 1) {
                    startPage = Math.max(0, endPage - maxButtons + 1)
                  }
                  
                  const pages = []
                  for (let i = startPage; i <= endPage; i++) {
                    pages.push(
                      <Button
                        key={i}
                        variant={i === currentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(i)}
                        className={`h-8 w-8 p-0 ${
                          i === currentPage 
                            ? "bg-orange-500 hover:bg-orange-600 text-white border-orange-500" 
                            : ""
                        }`}
                      >
                        {i + 1}
                      </Button>
                    )
                  }
                  return pages
                })()}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages - 1}
                  className="h-8 w-8 p-0"
                >
                  ›
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 