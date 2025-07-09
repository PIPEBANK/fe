import type { OrderDetail } from '@/types'
import pipebankLogo from '@/assets/images/pipebank_logo.png'

const PrintOrderDetail = {
  // 인쇄 함수
  open: (orderDetail: OrderDetail) => {
    // 새 창에서 인쇄 페이지 열기
    const printWindow = window.open('', '_blank', 'width=800,height=600,scrollbars=yes')
    if (!printWindow) {
      alert('팝업이 차단되었습니다. 팝업 차단을 해제해 주세요.')
      return
    }

    // React 컴포넌트를 문자열로 렌더링하기 위한 HTML 생성
    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="ko">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>주문요청서 - ${orderDetail.orderNumber}</title>
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
              max-width: 800px;
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
              margin-bottom: 20px;
            }
            
            .info-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 30px;
              font-size: 12px;
            }
            
            .info-table td {
              padding: 8px 12px;
              border: 1px solid #ddd;
              vertical-align: top;
            }
            
            .info-label {
              background-color: #f5f5f5;
              font-weight: bold;
              width: 120px;
              color: #2A3038;
            }
            
            .info-value {
              color: #2A3038;
            }
            
            .products-table {
              width: 100%;
              border-collapse: collapse;
              font-size: 11px;
              margin-bottom: 30px;
            }
            
            .products-table th,
            .products-table td {
              padding: 8px 6px;
              border: 1px solid #ddd;
              text-align: center;
              color: #2A3038;
            }
            
            .products-table th {
              background-color: #f5f5f5;
              font-weight: bold;
            }
            
            .products-table td:nth-child(2),
            .products-table td:nth-child(3),
            .products-table td:nth-child(4) {
              text-align: left;
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
              <div class="print-title">주 문 요 청 서</div>
            </div>

            <!-- 주문 정보 테이블 -->
            <table class="info-table">
              <tbody>
                <tr>
                  <td class="info-label">주문번호</td>
                  <td class="info-value">${orderDetail.orderNumber}</td>
                  <td class="info-label">주문 총금액</td>
                  <td class="info-value" style="color: #FF6F0F; font-weight: bold;">${orderDetail.orderTranTotalAmount}</td>
                </tr>
                <tr>
                  <td class="info-label">주문일자</td>
                  <td class="info-value">${orderDetail.orderMastDate}</td>
                  <td class="info-label">도착요구일</td>
                  <td class="info-value">${orderDetail.orderMastOdate}</td>
                </tr>
                <tr>
                  <td class="info-label">현장명</td>
                  <td class="info-value">${orderDetail.orderMastComname || '-'}</td>
                  <td class="info-label">납품현장주소</td>
                  <td class="info-value">${orderDetail.orderMastComaddr}</td>
                </tr>
                <tr>
                  <td class="info-label">출고형태</td>
                  <td class="info-value">${orderDetail.orderMastSdivDisplayName}</td>
                  <td class="info-label">수요처</td>
                  <td class="info-value">${orderDetail.orderMastDcust}</td>
                </tr>
                <tr>
                  <td class="info-label">화폐/환율</td>
                  <td class="info-value">${orderDetail.orderMastCurrency}</td>
                  <td class="info-label">용도</td>
                  <td class="info-value">${orderDetail.orderMastReasonDisplayName}</td>
                </tr>
                <tr>
                  <td class="info-label">인수자</td>
                  <td class="info-value">${orderDetail.orderMastComuname}</td>
                  <td class="info-label">인수자 연락처</td>
                  <td class="info-value">${orderDetail.orderMastComutel}</td>
                </tr>
                <tr>
                  <td class="info-label">비고</td>
                  <td class="info-value" colspan="3">
                    ${orderDetail.orderMastRemark || ''}
                  </td>
                </tr>
              </tbody>
            </table>

            <!-- 제품 목록 테이블 -->
            <table class="products-table">
              <thead>
                <tr>
                  <th>출하번호</th>
                  <th>제품코드</th>
                  <th>제품명</th>
                  <th>규격</th>
                  <th>단위</th>
                  <th>주문량</th>
                  <th>출하량</th>
                  <th>주문잔량</th>
                  <th>단가</th>
                  <th>금액</th>
                  <th>상태</th>
                </tr>
              </thead>
              <tbody>
                ${orderDetail.products.map(product => `
                  <tr>
                    <td>${product.shipNumber || '-'}</td>
                    <td>${product.productCode}</td>
                    <td>${product.productName}</td>
                    <td>${product.specification}</td>
                    <td>${product.unit}</td>
                    <td>${product.quantity?.toLocaleString()}</td>
                    <td>${product.shipQuantity?.toLocaleString() || '0'}</td>
                    <td>${product.remainQuantity?.toLocaleString() || '0'}</td>
                    <td>${product.unitPrice?.toLocaleString()}원</td>
                    <td>${product.totalPrice?.toLocaleString()}원</td>
                    <td style="color: #FF6F0F;">${product.status}</td>
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

export default PrintOrderDetail 