import request from '@/utils/request';

/** 获取切片列表 */
export function fetchGetSliceList(params?: Api.Common.SearchParams) {
  return request.get<Api.Common.PageRecord>('/slice/list', params);
}
/** 创建切片 */
export function fetchCreateSlice(params: Api.ResourceManage.SliceCreate) {
  return request.post('/slice/create', params);
}

/** 修改切片 */
export function fetchUpdateSlice(params: Api.ResourceManage.SliceUpdate) {
  return request.post('/slice/update', params);
}

/** 删除切片 */
export function fetchDeleteSlice(params: Api.Common.IDsParams) {
  return request.post('/slice/delete', params);
}

/** 查询切片详细 */
export function fetchSlice(id: number) {
  return request.get<Api.ResourceManage.Slice>(`/slice/${id}`);
}

/** 更改切片状态 */
export function fetchSetSliceStatus(params: Api.Common.BatchStatusParams) {
  return request.post('/slice/status', params);
}

/** 批量移动切片到分类 */
export function fetchMoveSlice(params: Api.ResourceManage.ResourceMove) {
  return request.post('/slice/move', params);
}

/** 推荐切片 */
export function fetchRecommendSlice(params: Api.Common.IDParams) {
  return request.post('/slice/recommend', params);
}

/** 推荐切片 */
export function fetchSetSliceRecommend(params: Api.Common.IDParams) {
  return request.post('/slice/recommend', params);
}

/** 更改切片VIP权限 */
export function fetchSetSliceVipAuth(params: Api.Common.IDParams) {
  return request.post('/slice/auth', params);
}

/** 更改切片GLTF */
export function fetchSetSliceGltf(params: Api.Common.IDParams) {
  return request.post('/slice/gltf', params);
}

/** 转换切片为标本 */
export function fetchTransformSlice(params: Api.Common.IDParams) {
  return request.post('/slice/transform', params);
}

/** 批量排序切片 */
export function fetchSortSlice(params: Api.Common.SortParams) {
  return request.post('/slice/sort', params);
}

/** 切片复制 */
export function fetchCopySlice(params: Api.Common.IDParams) {
  return request.post('/slice/copy', params);
}

/** 编辑切片标注 */
export function fetchEditSlice(params: any) {
  return request.post('/slice/edit', params);
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
