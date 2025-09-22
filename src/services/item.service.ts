import api from '@/lib/api'
import type { 
  ItemDiv1Response, 
  ItemDiv2Response, 
  ItemDiv3Response, 
  ItemDiv4Response, 
  ItemSelectionPageResponse,
  ItemSearchListResponse 
} from '@/types'

export class ItemService {
  /**
   * 1단계: 제품종류(DIV1) 목록 조회
   */
  async getItemDiv1List(): Promise<ItemDiv1Response[]> {
    try {
      const response = await api.get<ItemDiv1Response[]>('/erp/items/div1')
      return response.data
    } catch (error) {
      console.error('제품종류 조회 실패:', error)
      throw error
    }
  }

  /**
   * 2단계: 제품군(DIV2) 목록 조회 (DIV1 기준)
   */
  async getItemDiv2List(div1: string): Promise<ItemDiv2Response[]> {
    try {
      const response = await api.get<ItemDiv2Response[]>(`/erp/items/div2/${div1}`)
      return response.data
    } catch (error) {
      console.error('제품군 조회 실패:', error)
      throw error
    }
  }

  /**
   * 3단계: 제품용도(DIV3) 목록 조회 (DIV1+DIV2 기준)
   */
  async getItemDiv3List(div1: string, div2: string): Promise<ItemDiv3Response[]> {
    try {
      const response = await api.get<ItemDiv3Response[]>(`/erp/items/div3/${div1}/${div2}`)
      return response.data
    } catch (error) {
      console.error('제품용도 조회 실패:', error)
      throw error
    }
  }

  /**
   * 4단계: 제품기능(DIV4) 목록 조회 (DIV1+DIV2+DIV3 기준) - 주문가능한 항목만
   */
  async getItemDiv4List(div1: string, div2: string, div3: string): Promise<ItemDiv4Response[]> {
    try {
      const response = await api.get<ItemDiv4Response[]>(`/erp/items/div4/${div1}/${div2}/${div3}`)
      return response.data
    } catch (error) {
      console.error('제품기능 조회 실패:', error)
      throw error
    }
  }

  /**
   * 5단계: 최종 품목(ItemCode) 목록 조회 (DIV1+DIV2+DIV3+DIV4 기준) - 주문가능한 항목만
   */
  async getItemsByDivision(
    div1: string, 
    div2: string, 
    div3: string, 
    div4: string, 
    page: number = 0, 
    size: number = 20, 
    sortBy: string = 'itemCodeCode', 
    sortDir: string = 'asc'
  ): Promise<ItemSelectionPageResponse> {
    try {
      const response = await api.get<ItemSelectionPageResponse>(
        `/erp/items/final/${div1}/${div2}/${div3}/${div4}`,
        {
          params: {
            page,
            size,
            sortBy,
            sortDir
          }
        }
      )
      return response.data
    } catch (error) {
      console.error('최종 품목 조회 실패:', error)
      throw error
    }
  }

  /**
   * 품목 검색 (제품명과 규격을 분리해서 검색) - 2중 검색 지원
   * 하위호환: itemName -> itemName1, spec -> spec1
   */
  async searchItems(
    itemName?: string,
    spec?: string,
    page: number = 0,
    size: number = 20,
    sortBy: string = 'itemCodeCode',
    sortDir: string = 'asc',
    // 새로운 2중 검색 파라미터
    itemName2?: string,
    spec2?: string
  ): Promise<ItemSearchListResponse> {
    try {
      const params: Record<string, string | number> = {
        page,
        size,
        sortBy,
        sortDir
      }

      // 기존 파라미터 (하위호환성)
      if (itemName) {
        params.itemName1 = itemName  // 백엔드에서 itemName -> itemName1로 매핑
      }
      if (spec) {
        params.spec1 = spec  // 백엔드에서 spec -> spec1로 매핑
      }

      // 새로운 2중 검색 파라미터
      if (itemName2) {
        params.itemName2 = itemName2
      }
      if (spec2) {
        params.spec2 = spec2
      }

      const response = await api.get<ItemSearchListResponse>('/erp/items/search', { params })
      return response.data
    } catch (error) {
      console.error('품목 검색 실패:', error)
      throw error
    }
  }

  /**
   * 2중 검색을 위한 새로운 메서드 (명시적 파라미터) - AND/OR 연산자 지원
   */
  async searchItemsAdvanced(
    itemName1?: string,
    itemName2?: string,
    spec1?: string,
    spec2?: string,
    itemNum?: string,
    page: number = 0,
    size: number = 20,
    sortBy: string = 'itemCodeCode',
    sortDir: string = 'asc',
    itemNameOperator: 'AND' | 'OR' = 'AND',  // 제품명 연산자
    specOperator: 'AND' | 'OR' = 'AND'       // 규격 연산자
  ): Promise<ItemSearchListResponse> {
    try {
      const params: Record<string, string | number> = {
        page,
        size,
        sortBy,
        sortDir
      }

      if (itemName1) {
        params.itemName1 = itemName1
      }
      if (itemName2) {
        params.itemName2 = itemName2
      }
      if (spec1) {
        params.spec1 = spec1
      }
      if (spec2) {
        params.spec2 = spec2
      }

      if (itemNum) {
        params.itemNum = itemNum
      }

      // AND/OR 연산자 추가
      params.itemNameOperator = itemNameOperator
      params.specOperator = specOperator

      const response = await api.get<ItemSearchListResponse>('/erp/items/search', { params })
      return response.data
    } catch (error) {
      console.error('품목 고급 검색 실패:', error)
      throw error
    }
  }
}

export const itemService = new ItemService() 