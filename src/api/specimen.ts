import request from '@/utils/request';

/** 获取标本列表 */
export function fetchGetSpecimenList(params?: Api.Common.SearchParams) {
  return request.get<Api.Common.PageRecord>('/specimen/list', params);
}
/** 创建标本 */
export function fetchCreateSpecimen(params: Api.ResourceManage.SpecimenCreate) {
  return request.post('/specimen/create', params);
}

/** 修改标本 */
export function fetchUpdateSpecimen(params: Api.ResourceManage.SpecimenUpdate) {
  return request.post('/specimen/update', params);
}

/** 删除标本 */
export function fetchDeleteSpecimen(params: Api.Common.IDsParams) {
  return request.post('/specimen/delete', params);
}

/** 更改标本状态 */
export function fetchSetSpecimenStatus(params: Api.Common.BatchStatusParams) {
  return request.post('/specimen/status', params);
}

/** 转换标本为标本 */
export function fetchTransformSpecimen(params: Api.Common.IDParams) {
  return request.post('/specimen/transform', params);
}

/** 批量移动标本到分类 */
export function fetchMoveSpecimen(params: Api.ResourceManage.ResourceMove) {
  return request.post('/specimen/move', params);
}

/** 推荐标本 */
export function fetchRecommendSpecimen(params: Api.Common.IDParams) {
  return request.post('/specimen/recommend', params);
}

/** 推荐标本 */
export function fetchSetSpecimenRecommend(params: Api.Common.IDParams) {
  return request.post('/specimen/recommend', params);
}

/** 更改标本VIP权限 */
export function fetchSetSpecimenVipAuth(params: Api.Common.IDParams) {
  return request.post('/specimen/auth', params);
}

/** 更改标本GLTF */
export function fetchSetSpecimenGltf(params: any) {
  return request.post('/specimen/gltf', params);
}

/** 批量排序标本 */
export function fetchSortSpecimen(params: Api.Common.SortParams) {
  return request.post('/specimen/sort', params);
}

/** 复制 */
export function fetchCopySpecimen(params: Api.Common.IDParams) {
  return request.post('/specimen/copy', params);
}

/** 获取模型贴图 */
export function fetchGetSpecimenMaps(id: number) {
  return request.get<Api.Common.ListRecord>('/specimen/chartlet/' + id);
}

/** 获取分类 */
export function fetchGetCategory(params?: Api.Common.SearchParams) {
  return request.get<Api.Common.ListRecord>('/category/list', params);
}

/** 创建分类 */
export function fetchCreateCategory(params: Api.ResourceManage.CategoryCreate) {
  return request.post('/category/create', params);
}

/** 修改分类 */
export function fetchUpdateCategory(params: Api.ResourceManage.CategoryUpdate) {
  return request.post('/category/update', params);
}

/** 删除分类 */
export function fetchDeleteCategory(params: Api.Common.IDParams) {
  return request.post('/category/delete', params);
}

/** 排序分类 */
export function fetchSortCategory(params: Api.Common.SortParams) {
  return request.post('/category/sort', params);
}

/** 更改分类状态 */
export function fetchStatusCategory(params: Api.Common.IDParams) {
  return request.post('/category/status', params);
}
