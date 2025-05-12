import request from '@/utils/request';

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
