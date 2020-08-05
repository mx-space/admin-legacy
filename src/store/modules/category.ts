/*
 * @Author: Innei
 * @Date: 2020-04-09 20:40:28
 * @LastEditTime: 2020-08-05 10:49:31
 * @LastEditors: Innei
 * @FilePath: /mx-admin/src/store/modules/category.ts
 * @Coding with Love
 */
import { VuexModule, Action, Module, Mutation } from 'vuex-module-decorators'
import { CategoryModel } from '../interfaces/category.interface'
import { rest } from '@/api/rest'
import { CategoriesRespDto, CategoryRespDto } from '@/models/response.dto'

export type CategoryMap = Map<string, CategoryModel>

@Module({ namespaced: true })
export class CategoryModule extends VuexModule {
  categories?: CategoryMap = new Map<string, CategoryModel>()

  @Action({ commit: 'SET_CATEGORY', rawError: true })
  async fetchCategory(_data?: CategoryRespDto[]) {
    let data: CategoryRespDto[]
    if (!_data) {
      const resp: CategoriesRespDto = await rest('Category').gets(
        {},
        { type: 'Category' },
      )
      data = resp.data
    } else {
      data = _data
    }
    const map = new Map<string, CategoryModel>()
    data.forEach((category) => {
      const value: CategoryModel = {
        ...category,
        created: new Date(category.created),
        modified: new Date(category.modified),
      }
      map.set(category._id, value)
    })

    return map
  }

  @Mutation
  SET_CATEGORY(payload: Map<string, CategoryModel>) {
    this.categories = payload
  }
}
