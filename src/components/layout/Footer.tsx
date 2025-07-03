export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-orange-primary rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-xs">P</span>
            </div>
            <span className="text-sm text-custom-secondary">파이프뱅크 거래처 시스템</span>
          </div>

          <div className="flex items-center gap-6 text-sm text-custom-icon">
            <span>서비스 문의: 1588-0000</span>
            <span>|</span>
            <span>운영시간: 09:00 ~ 18:00 (평일)</span>
          </div>

          <div className="text-sm text-custom-icon">
            © 2025 PipeBank Co., Ltd. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
} 