import type { ShipmentItemResponse, ShipmentItemParams } from '@/types'
import pipebankLogo from '@/assets/images/pipebank_logo.png'

interface PaginationInfo {
  totalElements: number
  totalPages: number
  currentPage: number
  pageSize: number
  isFirst: boolean
  isLast: boolean
}

const PrintShippingSite = {
  // 인쇄 함수
  open: (shipmentData: ShipmentItemResponse[], searchParams: ShipmentItemParams, paginationInfo: PaginationInfo) => {
    // 새 창에서 인쇄 페이지 열기
    const printWindow = window.open('', '_blank', 'width=800,height=600,scrollbars=yes')
    if (!printWindow) {
      alert('팝업이 차단되었습니다. 팝업 차단을 해제해 주세요.')
      return
    }

    // 검색 조건 텍스트 생성
    const getSearchConditions = () => {
      const conditions = []
      if (searchParams.shipNumber) conditions.push(`출하번호: ${searchParams.shipNumber}`)
      if (searchParams.itemName) conditions.push(`제품명: ${searchParams.itemName}`)
      if (searchParams.comName) conditions.push(`현장명: ${searchParams.comName}`)
      if (searchParams.startDate && searchParams.endDate) {
        conditions.push(`출하기간: ${searchParams.startDate} ~ ${searchParams.endDate}`)
      }
      return conditions.length > 0 ? conditions.join(' | ') : '전체 조회'
    }

    // React 컴포넌트를 문자열로 렌더링하기 위한 HTML 생성
    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="ko">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>현장별 출하 리스트</title>
          <style>
            @media print {
              body { margin: 0; }
              .print-container { 
                max-width: none !important; 
                margin: 0 !important;
                padding: 20px !important;
                font-family: 'Malgun Gothic', sans-serif !important;
              }
              .no-print { display: none !important; }
            }
            
            body {
              margin: 0;
              padding: 0;
              font-family: 'Malgun Gothic', sans-serif;
            }
            
            .print-container {
              max-width: 1000px;
              margin: 0 auto;
              padding: 20px;
              background: white;
            }
            
            .print-header {
              text-align: center;
              margin-bottom: 30px;
            }
            
            .print-title {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 20px;
              color: #2A3038;
            }
            
            .print-date {
              font-size: 14px;
              color: #666;
              margin-bottom: 10px;
            }
            
            .search-info {
              font-size: 12px;
              color: #666;
              margin-bottom: 20px;
            }
            
            .data-table {
              width: 100%;
              border-collapse: collapse;
              font-size: 11px;
              margin-bottom: 30px;
            }
            
            .data-table th,
            .data-table td {
              padding: 8px 6px;
              border: 1px solid #ddd;
              text-align: left;
              color: #2A3038;
            }
            
            .data-table th {
              background-color: #f5f5f5;
              font-weight: bold;
              text-align: center;
            }
            
            .data-table td:nth-child(7),
            .data-table td:nth-child(8) {
              text-align: right;
            }
            
            .footer {
              margin-top: 40px;
              text-align: center;
              font-size: 12px;
              color: #666;
            }
            
            .close-button {
              position: fixed;
              top: 10px;
              right: 10px;
              padding: 8px 16px;
              background: #f0f0f0;
              border: 1px solid #ccc;
              border-radius: 4px;
              cursor: pointer;
              font-size: 12px;
            }
            
            @media print {
              .close-button { display: none; }
            }
            
            .pagination-info {
              font-size: 12px;
              color: #666;
              margin-bottom: 15px;
              text-align: right;
            }
          </style>
        </head>
        <body>
          <button class="close-button no-print" onclick="window.close()">창 닫기</button>
          
          <div class="print-container">
            <div class="print-header">
              <div class="print-date">
                출력일자: ${new Date().toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit'
                }).replace(/\./g, '-').replace(/- /g, '-').slice(0, -1)}
              </div>
              <div class="print-title">현장별 출하 리스트</div>
              <div class="search-info">
                검색조건: ${getSearchConditions()}
              </div>
              <div class="pagination-info">
                총 ${paginationInfo.totalElements}개 중 ${(paginationInfo.currentPage * paginationInfo.pageSize) + 1}-${Math.min((paginationInfo.currentPage + 1) * paginationInfo.pageSize, paginationInfo.totalElements)}개 표시 (${paginationInfo.currentPage + 1}/${paginationInfo.totalPages} 페이지)
              </div>
            </div>

            <!-- 출하 목록 테이블 -->
            <table class="data-table">
              <thead>
                <tr>
                  <th>출하번호</th>
                  <th>주문번호</th>
                  <th>현장명</th>
                  <th>제품명</th>
                  <th>규격</th>
                  <th>단위</th>
                  <th>수량</th>
                  <th>단가</th>
                </tr>
              </thead>
              <tbody>
                ${shipmentData.map(item => `
                  <tr>
                    <td>${item.shipNumber}</td>
                    <td>${item.orderNumber}</td>
                    <td>${item.shipMastComname}</td>
                    <td>${item.shipTranDeta}</td>
                    <td>${item.shipTranSpec}</td>
                    <td>${item.shipTranUnit}</td>
                    <td style="text-align: right;">${item.shipTranCnt}</td>
                    <td style="text-align: right;">${item.shipTranTot.toLocaleString()}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <!-- 하단 정보 -->
            <div class="footer">
              <div style="display: flex; justify-content: center; align-items: center; gap: 20px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <img src="${pipebankLogo}" alt="파이프뱅크" style="height: 30px; width: auto;" />
                </div>
                <div>
                  전화번호: 044-860-3600 | 팩스번호: 044-863-0741
                </div>
              </div>
              <div style="margin-top: 10px; font-size: 11px;">
                Copyright(C) 2025 PIPE BANK. All rights reserved.
              </div>
            </div>
          </div>

          <script>
            // 페이지 로드 후 자동으로 인쇄 대화상자 열기
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 500);
            };
          </script>
        </body>
      </html>
    `)

    printWindow.document.close()
  }
}

export default PrintShippingSite 