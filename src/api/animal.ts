import request from '@/utils/request';

/** 获取动物列表 */
export function fetchGetAnimalList(params?: Api.Common.SearchParams) {
  return request.get<Api.Common.PageRecord>('/animal/list', params);
}

/** 获取动物详情 */
export function fetchGetAnimal(id: number) {
  return request.get<Api.AnimalManger.Animal>('/animal/' + id);
}

/** 创建动物 */
export function fetchCreateAnimal(params: Api.AnimalManger.AnimalCreate) {
  return request.post('/animal/create', params);
}

/** 修改动物 */
export function fetchUpdateAnimal(params: Api.AnimalManger.AnimalUpdate) {
  return request.post('/animal/update', params);
}

/** 删除动物 */
export function fetchDeleteAnimal(params: Api.Common.IDsParams) {
  return request.post('/animal/delete', params);
}

/** 更改动物状态 */
export function fetchSetAnimalStatus(params: Api.Common.BatchStatusParams) {
  return request.post('/animal/status', params);
}

/** 推荐动物 */
export function fetchSetAnimalRecommend(params: Api.Common.IDParams) {
  return request.post('/animal/recommend', params);
}

/** 更改动物GLTF */
export function fetchSetAnimalGltf(params: any) {
  return request.post('/animal/gltf', params);
}

/** 批量排序动物 */
export function fetchSortAnimal(params: Api.Common.SortParams) {
  return request.post('/animal/sort', params);
}

/** 动物复制 */
export function fetchCopyAnimal(params: Api.Common.IDParams) {
  return request.post('/animal/copy', params);
}
/** 获取动物分类 */
export function fetchGetCategory(params?: Api.Common.SearchParams) {
  return request.get<Api.Common.PageRecord>('/animal/category/list', params);
}

/** 创建动物分类 */
export function fetchCreateCategory(params: Api.AnimalManger.AnimalCategoryCreate) {
  return request.post('/animal/category/create', params);
}

/** 修改动物分类 */
export function fetchUpdateCategory(params: Api.AnimalManger.AnimalCategoryUpdate) {
  return request.post('/animal/category/update', params);
}

/** 删除动物分类 */
export function fetchDeleteCategory(params: Api.Common.IDParams) {
  return request.post('/animal/category/delete', params);
}

/** 排序动物分类 */
export function fetchSortCategory(params: Api.Common.SortParams) {
  return request.post('/animal/category/sort', params);
}

/** 更改分类状态 */
export function fetchSetCategoryStatus(params: Api.Common.IDParams) {
  return request.post('/animal/category/status', params);
}
