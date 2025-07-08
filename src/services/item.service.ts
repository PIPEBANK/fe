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
   * 품목 검색 (제품명과 규격을 분리해서 검색)
   */
  async searchItems(
    itemName?: string,
    spec?: string,
    page: number = 0,
    size: number = 20,
    sortBy: string = 'itemCodeCode',
    sortDir: string = 'asc'
  ): Promise<ItemSearchListResponse> {
    try {
      const params: Record<string, string | number> = {
        page,
        size,
        sortBy,
        sortDir
      }

      if (itemName) {
        params.itemName = itemName
      }
      if (spec) {
        params.spec = spec
      }

      const response = await api.get<ItemSearchListResponse>('/erp/items/search', { params })
      return response.data
    } catch (error) {
      console.error('품목 검색 실패:', error)
      throw error
    }
  }
}

export const itemService = new ItemService() 