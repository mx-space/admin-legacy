import { CategoryType } from '../../models/response.dto'

export interface CategoryModel {
  type: CategoryType
  count: number
  id: string
  created: Date
  modified: Date
  slug: string
  name: string
}
