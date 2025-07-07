import { pipebankFooterLogo } from '@/assets'

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-700">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 로고 및 회사명 */}
          <div className="space-y-4">
            <img 
              src={pipebankFooterLogo} 
              alt="PIPEBANK" 
              className="h-10 w-auto"
              loading="lazy"
            />
            <p className="text-gray-600 text-sm leading-relaxed">
              파이프뱅크는 고품질의 배관 자재를 제공하는<br />
              전문 기업입니다.
            </p>
          </div>

          {/* 회사 정보 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">회사 정보</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div>
                <span className="font-medium text-gray-800">본사:</span>
                <p className="mt-1">
                  (30121) 세종특별자치시 한누리대로 350, 8층<br />
                  (어진동, 뱅크빌딩)
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-800">공장:</span>
                <p className="mt-1">
                  (30058) 세종특별자치시 연기면 공단로 130
                </p>
              </div>
            </div>
          </div>

          {/* 연락처 정보 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">연락처</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-800">TEL:</span>
                <a href="tel:044-860-3600" className="hover:text-orange-primary transition-colors">
                  044-860-3600
                </a>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-800">FAX:</span>
                <span>044-863-0741</span>
              </div>
            </div>
          </div>
        </div>

        {/* 구분선 */}
        <div className="border-t border-gray-200 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              Copyright 2025 pipebank. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-gray-500">
              <a href="#" className="hover:text-orange-primary transition-colors">개인정보처리방침</a>
              <a href="#" className="hover:text-orange-primary transition-colors">이용약관</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
} 