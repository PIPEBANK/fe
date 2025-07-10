import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

export interface SimpleSelectOption {
  value: string
  label: string
}

interface SimpleSelectProps {
  options: SimpleSelectOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export default function SimpleSelect({
  options,
  value,
  onChange,
  placeholder = "선택하세요",
  disabled = false,
  className = ""
}: SimpleSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // 드롭다운 열기/닫기
  const toggleDropdown = () => {
    if (disabled) return
    setIsOpen(!isOpen)
  }

  // 옵션 선택
  const handleOptionSelect = (option: SimpleSelectOption) => {
    onChange(option.value)
    setIsOpen(false)
  }

  // 선택된 옵션의 라벨 찾기
  const selectedOption = options.find(option => option.value === value)
  const selectedLabel = selectedOption ? selectedOption.label : placeholder

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* 선택 버튼 */}
      <button
        type="button"
        onClick={toggleDropdown}
        disabled={disabled}
        className={`
          w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent 
          text-sm text-left bg-white flex items-center justify-between
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'cursor-pointer hover:border-gray-400'}
          ${value ? 'text-gray-900' : 'text-gray-500'}
        `}
        style={{ color: value ? '#2A3038' : undefined }}
      >
        <span className="truncate">{selectedLabel}</span>
        <ChevronDown className={`w-4 h-4 transition-transform text-gray-400 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* 드롭다운 메뉴 */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden">
          {/* 옵션 목록 */}
          <div className="max-h-60 overflow-y-auto">
            {options.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                옵션이 없습니다.
              </div>
            ) : (
              options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleOptionSelect(option)}
                  className={`
                    w-full px-4 py-3 text-left text-sm hover:bg-gray-50 cursor-pointer transition-colors
                    ${option.value === value ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-900'}
                  `}
                  style={{ color: option.value === value ? undefined : '#2A3038' }}
                >
                  {option.label}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
} 