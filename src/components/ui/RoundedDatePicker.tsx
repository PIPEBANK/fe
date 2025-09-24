import { useState, useRef, useEffect } from 'react'
import { Calendar, ChevronDown } from 'lucide-react'

interface RoundedDatePickerProps {
  value: string
  onChange: (date: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export default function RoundedDatePicker({
  value,
  onChange,
  placeholder = "날짜를 선택하세요 (YYYY-MM-DD)",
  className = "",
  disabled = false
}: RoundedDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [tempSelection, setTempSelection] = useState<string>('')
  const [isYearOpen, setIsYearOpen] = useState(false)
  const [isMonthOpen, setIsMonthOpen] = useState(false)
  const [inputValue, setInputValue] = useState(value) // 텍스트 입력값 관리
  const containerRef = useRef<HTMLDivElement>(null)
  const yearSelectRef = useRef<HTMLDivElement>(null)
  const monthSelectRef = useRef<HTMLDivElement>(null)
  const yearDropdownRef = useRef<HTMLDivElement>(null)
  const monthDropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // value가 변경될 때 inputValue도 동기화
  useEffect(() => {
    setInputValue(value)
  }, [value])

  // 외부 클릭 시 팝업 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setTempSelection('')
      }
      
      // 년도 드롭다운 외부 클릭
      if (yearSelectRef.current && !yearSelectRef.current.contains(event.target as Node)) {
        setIsYearOpen(false)
      }
      
      // 월 드롭다운 외부 클릭
      if (monthSelectRef.current && !monthSelectRef.current.contains(event.target as Node)) {
        setIsMonthOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // 팝업이 열릴 때 현재 값을 임시 선택값으로 설정
  useEffect(() => {
    if (isOpen) {
      setTempSelection(value)
    }
  }, [isOpen, value])

  // 날짜를 YYYY-MM-DD 형식으로 변환 (시간대 문제 해결)
  const formatDateToString = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // 날짜 포맷팅 함수 (표시용)
  const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return `${date.getFullYear()}년 ${String(date.getMonth() + 1).padStart(2, '0')}월 ${String(date.getDate()).padStart(2, '0')}일`
  }

  // 텍스트 입력값을 표준 날짜 형식으로 변환 및 실시간 포맷팅
  const formatInputDate = (input: string): { formatted: string; isComplete: boolean } => {
    if (!input) return { formatted: '', isComplete: false }
    
    // 숫자만 추출
    const numbers = input.replace(/\D/g, '')
    
    // 길이에 따른 포맷팅
    if (numbers.length <= 4) {
      // 년도 입력 중
      return { formatted: numbers, isComplete: false }
    } else if (numbers.length <= 6) {
      // 년도 + 월 입력 중
      return { 
        formatted: `${numbers.substring(0, 4)}-${numbers.substring(4)}`, 
        isComplete: false 
      }
    } else if (numbers.length <= 8) {
      // 년도 + 월 + 일 입력 중/완료
      const formatted = `${numbers.substring(0, 4)}-${numbers.substring(4, 6)}-${numbers.substring(6, 8)}`
      
      if (numbers.length === 8) {
        // 8자리 완성 - 유효성 검증
        const year = numbers.substring(0, 4)
        const month = numbers.substring(4, 6)
        const day = numbers.substring(6, 8)
        
        const date = new Date(`${year}-${month}-${day}`)
        const isValid = !isNaN(date.getTime()) && 
                       date.getFullYear() === parseInt(year) &&
                       date.getMonth() + 1 === parseInt(month) &&
                       date.getDate() === parseInt(day)
        
        return { formatted, isComplete: isValid }
      } else {
        return { formatted, isComplete: false }
      }
    } else {
      // 8자리 초과 - 잘라내기
      const truncated = numbers.substring(0, 8)
      return formatInputDate(truncated)
    }
  }

  // 텍스트 입력 처리
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value
    
    // 실시간 포맷팅 적용
    const { formatted, isComplete } = formatInputDate(rawValue)
    setInputValue(formatted)
    
    // 완전한 날짜가 입력된 경우 onChange 호출
    if (isComplete) {
      onChange(formatted)
    } else if (rawValue === '') {
      // 빈값인 경우
      onChange('')
    }
  }

  // 입력 필드에서 엔터 키 처리
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const { formatted, isComplete } = formatInputDate(inputValue)
      if (isComplete) {
        setInputValue(formatted)
        onChange(formatted)
        inputRef.current?.blur()
      }
    }
  }

  // 입력 필드 포커스 아웃 처리
  const handleInputBlur = () => {
    const { formatted, isComplete } = formatInputDate(inputValue)
    if (isComplete) {
      setInputValue(formatted)
      onChange(formatted)
    } else if (inputValue !== value) {
      // 파싱에 실패한 경우 원래값으로 되돌리기
      setInputValue(value)
    }
  }

  // 달력 날짜 생성
  const getCalendarDays = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay()) // 주의 시작을 일요일로

    const days = []
    for (let i = 0; i < 42; i++) { // 6주 * 7일
      const currentDate = new Date(startDate)
      currentDate.setDate(startDate.getDate() + i)
      days.push(currentDate)
    }
    return days
  }

  // 날짜 클릭 처리
  const handleDateClick = (date: Date) => {
    const dateStr = formatDateToString(date) // 로컬 날짜 사용
    setTempSelection(dateStr)
  }

  // 날짜 더블클릭 처리: 즉시 적용 후 닫기
  const handleDateDoubleClick = (date: Date) => {
    const dateStr = formatDateToString(date)
    setTempSelection(dateStr)
    onChange(dateStr)
    setInputValue(dateStr)
    setIsOpen(false)
  }

  // 날짜 스타일 결정
  const getDateClassName = (date: Date) => {
    const dateStr = formatDateToString(date) // 로컬 날짜 사용
    const isCurrentMonth = date.getMonth() === currentMonth.getMonth()
    const isSelected = dateStr === tempSelection
    const isToday = dateStr === formatDateToString(new Date()) // 로컬 날짜 사용

    let className = 'w-8 h-8 flex items-center justify-center text-sm cursor-pointer hover:bg-gray-100 rounded'
    
    if (!isCurrentMonth) className += ' text-gray-300'
    else className += ' text-gray-700'
    
    if (isSelected) className += ' !bg-blue-500 !text-white'
    
    if (isToday && !isSelected) className += ' border border-blue-300'

    return className
  }

  // 월 이동
  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth)
    newMonth.setMonth(currentMonth.getMonth() + (direction === 'next' ? 1 : -1))
    setCurrentMonth(newMonth)
  }

  // 년도 변경
  const handleYearChange = (year: number) => {
    const newMonth = new Date(currentMonth)
    newMonth.setFullYear(year)
    setCurrentMonth(newMonth)
  }

  // 월 변경
  const handleMonthChange = (month: number) => {
    const newMonth = new Date(currentMonth)
    newMonth.setMonth(month)
    setCurrentMonth(newMonth)
  }

  // 년도 옵션 생성 (현재 년도 기준 ±50년)
  const getYearOptions = () => {
    const currentYear = new Date().getFullYear()
    const years = []
    for (let i = currentYear - 50; i <= currentYear + 10; i++) {
      years.push(i)
    }
    return years
  }

  // 월 옵션 생성
  const getMonthOptions = () => {
    return Array.from({ length: 12 }, (_, i) => ({ value: i, label: `${i + 1}월` }))
  }

  // 초기화
  const handleReset = () => {
    setTempSelection('')
    // 바로 빈 값으로 적용하고 창 닫기
    onChange('')
    setInputValue('')
    setIsOpen(false)
  }

  // 적용
  const handleApply = () => {
    onChange(tempSelection)
    setInputValue(tempSelection)
    setIsOpen(false)
  }

  // 달력 아이콘 클릭 처리
  const handleCalendarIconClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!disabled) {
      setIsOpen(!isOpen)
    }
  }

  // 드롭다운에서 선택된 항목으로 스크롤
  const scrollToSelectedYear = () => {
    setTimeout(() => {
      if (yearDropdownRef.current) {
        const selectedButton = yearDropdownRef.current.querySelector('[data-selected="true"]') as HTMLElement
        if (selectedButton) {
          selectedButton.scrollIntoView({ behavior: 'instant', block: 'center' })
        }
      }
    }, 0)
  }

  const scrollToSelectedMonth = () => {
    setTimeout(() => {
      if (monthDropdownRef.current) {
        const selectedButton = monthDropdownRef.current.querySelector('[data-selected="true"]') as HTMLElement
        if (selectedButton) {
          selectedButton.scrollIntoView({ behavior: 'instant', block: 'center' })
        }
      }
    }, 0)
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* 입력 필드 + 달력 아이콘 */}
      <div className="relative flex items-center">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          onBlur={handleInputBlur}
          disabled={disabled}
          placeholder={placeholder}
          className={`
            w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg
            focus:ring-2 focus:ring-orange-500 focus:border-transparent
            text-sm
            ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'bg-white'}
          `}
        />
        <button
          type="button"
          onClick={handleCalendarIconClick}
          disabled={disabled}
          className={`
            absolute right-2 p-1 rounded hover:bg-gray-100
            ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          <Calendar className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* 캘린더 팝업 */}
      {isOpen && (
        <div className="absolute top-12 left-0 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-[320px]">
          {/* 헤더 - 년도/월 선택 */}
          <div className="flex items-center justify-between mb-4 gap-2">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-1 hover:bg-gray-100 rounded"
            >
              ←
            </button>
            <div className="flex gap-2">
              {/* 년도 커스텀 드롭다운 */}
              <div className="relative" ref={yearSelectRef}>
                <button
                  type="button"
                  onClick={() => {
                    setIsYearOpen(!isYearOpen)
                    if (!isYearOpen) scrollToSelectedYear()
                  }}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white cursor-pointer hover:border-gray-400 shadow-sm flex items-center justify-between min-w-[80px]"
                  style={{ color: '#2A3038' }}
                >
                  <span>{currentMonth.getFullYear()}년</span>
                  <ChevronDown className={`w-3 h-3 ml-1 transition-transform text-gray-400 ${isYearOpen ? 'rotate-180' : ''}`} />
                </button>
                {isYearOpen && (
                  <div ref={yearDropdownRef} className="absolute top-full left-0 z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {getYearOptions().map(year => (
                      <button
                        key={year}
                        type="button"
                        data-selected={year === currentMonth.getFullYear()}
                        onClick={() => {
                          handleYearChange(year)
                          setIsYearOpen(false)
                        }}
                        className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 cursor-pointer transition-colors ${
                          year === currentMonth.getFullYear() ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-900'
                        }`}
                        style={{ color: year === currentMonth.getFullYear() ? undefined : '#2A3038' }}
                      >
                        {year}년
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* 월 커스텀 드롭다운 */}
              <div className="relative" ref={monthSelectRef}>
                <button
                  type="button"
                  onClick={() => {
                    setIsMonthOpen(!isMonthOpen)
                    if (!isMonthOpen) scrollToSelectedMonth()
                  }}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white cursor-pointer hover:border-gray-400 shadow-sm flex items-center justify-between min-w-[70px]"
                  style={{ color: '#2A3038' }}
                >
                  <span>{currentMonth.getMonth() + 1}월</span>
                  <ChevronDown className={`w-3 h-3 ml-1 transition-transform text-gray-400 ${isMonthOpen ? 'rotate-180' : ''}`} />
                </button>
                {isMonthOpen && (
                  <div ref={monthDropdownRef} className="absolute top-full left-0 z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {getMonthOptions().map(month => (
                      <button
                        key={month.value}
                        type="button"
                        data-selected={month.value === currentMonth.getMonth()}
                        onClick={() => {
                          handleMonthChange(month.value)
                          setIsMonthOpen(false)
                        }}
                        className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 cursor-pointer transition-colors ${
                          month.value === currentMonth.getMonth() ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-900'
                        }`}
                        style={{ color: month.value === currentMonth.getMonth() ? undefined : '#2A3038' }}
                      >
                        {month.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => navigateMonth('next')}
              className="p-1 hover:bg-gray-100 rounded"
            >
              →
            </button>
          </div>

          {/* 요일 헤더 */}
          <div className="grid grid-cols-7 mb-2">
            {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
              <div key={day} className={`text-center text-sm font-medium py-1 ${index === 0 ? 'text-red-500' : index === 6 ? 'text-blue-500' : 'text-gray-600'}`}>
                {day}
              </div>
            ))}
          </div>

          {/* 날짜 그리드 */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {getCalendarDays(currentMonth).map((date, index) => (
              <div
                key={index}
                onClick={() => handleDateClick(date)}
                onDoubleClick={() => handleDateDoubleClick(date)}
                className={getDateClassName(date)}
              >
                {date.getDate()}
              </div>
            ))}
          </div>

          {/* 선택된 날짜 표시 */}
          <div className="border-t pt-3 mb-3">
            <div className="text-sm">
              <div className="text-gray-600 mb-1">선택된 날짜</div>
              <div className="text-gray-800 font-medium">
                {tempSelection ? formatDate(tempSelection) : '날짜를 선택해주세요'}
              </div>
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex gap-2">
            <button
              onClick={handleReset}
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
            >
              초기화
            </button>
            <button
              onClick={handleApply}
              className="flex-1 px-3 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
              disabled={!tempSelection}
            >
              적용
            </button>
          </div>
        </div>
      )}
    </div>
  )
} 