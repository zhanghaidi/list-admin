import request from '@/utils/request';

/** 获取运动系统列表 */
export function fetchGetSportList(params?: Api.Common.SearchParams) {
  return request.get<Api.Common.PageRecord>('/sport/list', params);
}
/** 创建运动系统 */
export function fetchCreateSport(params: Api.ResourceManage.SportCreate) {
  return request.post('/sport/create', params);
}

/** 修改运动系统 */
export function fetchUpdateSport(params: Api.ResourceManage.SportUpdate) {
  return request.post('/sport/update', params);
}

/** 更改运动系统状态 */
export function fetchSetSportStatus(params: Api.Common.BatchStatusParams) {
  return request.post('/sport/status', params);
}

/** 删除运动系统 */
export function fetchDeleteSport(params: Api.Common.IDsParams) {
  return request.post('/sport/delete', params);
}

/** 批量排序运动系统 */
export function fetchSortSport(params: Api.Common.SortParams) {
  return request.post('/sport/sort', params);
}

/** 批量移动运动系统到分类 */
export function fetchMoveSport(params: Api.ResourceManage.ResourceMove) {
  return request.post('/sport/move', params);
}

/** 推荐运动系统 */
export function fetchRecommendSport(params: Api.Common.IDParams) {
  return request.post('/sport/recommend', params);
}

/** 获取运动系统分类 */
export function fetchGetCategory(params?: Api.Common.SearchParams) {
  return request.get<Api.Common.ListRecord>('/sport/category/list', params);
}

/** 创建运动系统分类 */
export function fetchCreateCategory(params: Api.ResourceManage.CategoryCreate) {
  return request.post('/sport/category/create', params);
}

/** 修改运动系统分类 */
export function fetchUpdateCategory(params: Api.ResourceManage.CategoryUpdate) {
  return request.post('/sport/category/update', params);
}

/** 删除运动系统分类 */
export function fetchDeleteCategory(params: Api.Common.IDParams) {
  return request.post('/sport/category/delete', params);
}

/** 排序运动系统分类 */
export function fetchStatusCategory(params: Api.Common.IDParams) {
  return request.post('/sport/category/status', params);
}

/** 排序运动系统分类 */
export function fetchSortCategory(params: Api.Common.IDParams) {
  return request.post('/sport/category/sort', params);
}

/** 获取运动系统分类 */
export function fetchGetSportModelTree() {
  return request.get<Api.Common.ListRecord>('/sport/model/tree');
}
