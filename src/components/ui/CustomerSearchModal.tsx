import React, { useState, useEffect } from 'react'
import { X, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CustomerService } from '@/services/customer.service'
import type { CustomerResponse } from '@/types'

interface CustomerSearchModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (customer: CustomerResponse) => void
}

export default function CustomerSearchModal({ isOpen, onClose, onSelect }: CustomerSearchModalProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [customers, setCustomers] = useState<CustomerResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [pageSize] = useState(10)

  // 거래처 목록 조회
  const loadCustomers = async (page: number = 0, search?: string) => {
    try {
      setLoading(true)
      const response = await CustomerService.getActiveCustomers({
        search,
        page,
        size: pageSize,
        sort: 'custCodeName',
        direction: 'asc'
      })
      
      setCustomers(response.content)
      setCurrentPage(response.number)
      setTotalPages(response.totalPages)
      setTotalElements(response.totalElements)
    } catch (error) {
      console.error('거래처 목록 조회 실패:', error)
      setCustomers([])
    } finally {
      setLoading(false)
    }
  }

  // 모달이 열릴 때 초기 데이터 로드
  useEffect(() => {
    if (isOpen) {
      loadCustomers(0)
      setSearchTerm('')
      setCurrentPage(0)
    }
  }, [isOpen])

  // 검색 실행
  const handleSearch = () => {
    loadCustomers(0, searchTerm)
  }

  // 검색 초기화
  const handleReset = () => {
    setSearchTerm('')
    loadCustomers(0)
  }

  // 페이지 변경
  const handlePageChange = (page: number) => {
    loadCustomers(page, searchTerm)
  }

  // 거래처 선택
  const handleSelectCustomer = (customer: CustomerResponse) => {
    onSelect(customer)
    onClose()
  }

  // 모달 닫기
  const handleClose = () => {
    setSearchTerm('')
    setCustomers([])
    onClose()
  }

  // Enter 키 처리
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-6xl mx-4 max-h-[90vh] flex flex-col">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold" style={{ color: '#2A3038' }}>
            거래처 검색
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 검색 영역 */}
        <div className="p-6 border-b">
          <div className="flex gap-3 items-center">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              placeholder="거래처명 또는 사업자등록번호로 검색하세요"
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              {loading ? '검색 중...' : '검색'}
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-3 border border-gray-300 bg-white hover:bg-gray-50 text-sm font-medium text-gray-700 rounded-lg"
            >
              초기화
            </button>
          </div>
        </div>

        {/* 결과 영역 */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* 결과 정보 */}
          <div className="px-6 py-4 bg-gray-50 border-b">
            <span className="text-sm text-gray-600 font-medium">
              총 {totalElements}건의 거래처가 검색되었습니다.
            </span>
          </div>

          {/* 테이블 */}
          <div className="flex-1 overflow-auto">
            <table className="w-full">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 w-32">
                    거래처코드
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 w-48">
                    거래처명
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 w-40">
                    사업자등록번호
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 flex-1">
                    주소
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 w-32">
                    담당자
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-700 w-24">
                    선택
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-500">
                      검색 중...
                    </td>
                  </tr>
                ) : customers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-500">
                      검색 결과가 없습니다.
                    </td>
                  </tr>
                ) : (
                  customers.map((customer) => (
                    <tr 
                      key={customer.custCodeCode} 
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handleSelectCustomer(customer)}
                    >
                      <td className="px-6 py-4 text-sm font-medium" style={{ color: '#2A3038' }}>
                        {customer.custCodeCode}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium" style={{ color: '#2A3038' }}>
                        {customer.custCodeName}
                      </td>
                      <td className="px-6 py-4 text-sm" style={{ color: '#2A3038' }}>
                        {customer.custCodeSano || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm" style={{ color: '#2A3038' }}>
                        <div className="truncate" title={customer.custCodeAddr || '-'}>
                          {customer.custCodeAddr || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm" style={{ color: '#2A3038' }}>
                        {customer.custCodeUname1 || '-'}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleSelectCustomer(customer)
                          }}
                          className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded transition-colors whitespace-nowrap"
                        >
                          선택
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="p-6 border-t bg-white">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600 font-medium">
                  {currentPage * pageSize + 1} - {Math.min((currentPage + 1) * pageSize, totalElements)} / {totalElements}
                </div>
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
    </div>
  )
} 