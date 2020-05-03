import { VuexModule, Action, Module, Mutation } from 'vuex-module-decorators'
import { CategoryModel } from '../interfaces/category.interface'
import { rest } from '@/api/rest'
import { CategoriesRespDto, CategoryRespDto } from '@/models/response.dto'
import { Map } from 'immutable'

export type CategoryMap = Map<string, CategoryModel>

@Module({ namespaced: true })
export class CategoryModule extends VuexModule {
  categories?: CategoryMap = Map<string, CategoryModel>()

  @Action({ commit: 'SET_CATEGORY', rawError: true })
  async fetchCategory(_data?: CategoryRespDto[]) {
    let data
    if (!_data) {
      const resp: CategoriesRespDto = await rest('Category').gets()
      data = resp.data
    } else {
      data = _data
    }
    const map = Map<string, CategoryModel>()
    const newMap: CategoryMap = data.reduce(
      (prev: CategoryMap, item: CategoryRespDto) => {
        const value: CategoryModel = {
          ...item,
          created: new Date(item.created),
          modified: new Date(item.modified),
        }
        return prev.set(item._id, value)
      },
      map,
    )
    return newMap
  }

  @Mutation
  SET_CATEGORY(payload: Map<string, CategoryModel>) {
    this.categories = payload
  }
}
