import request from '@/utils/request';

/** 获取模型列表 */
export function fetchGetModelList(params?: Api.Common.SearchParams) {
  return request.get<Api.Common.PageRecord>('/model/list', params);
}

/** 获取模型详情 */
export function fetchGetModel(id: number) {
  return request.get<Api.ResourceManage.Model>('/model/' + id);
}

/** 创建模型 */
export function fetchCreateModel(params: Api.ResourceManage.ModelCreate) {
  return request.post('/model/create', params);
}

/** 修改模型 */
export function fetchUpdateModel(params: Api.ResourceManage.ModelUpdate) {
  return request.post('/model/update', params);
}

/** 删除模型 */
export function fetchDeleteModel(params: Api.Common.IDsParams) {
  return request.post('/model/delete', params);
}

/** 更改模型状态 */
export function fetchSetModelStatus(params: Api.Common.BatchStatusParams) {
  return request.post('/model/status', params);
}

/** 推荐模型 */
export function fetchSetModelRecommend(params: Api.Common.IDParams) {
  return request.post('/model/recommend', params);
}

/** 更改模型VIP权限 */
export function fetchSetModelVipAuth(params: Api.Common.IDParams) {
  return request.post('/model/auth', params);
}

/** 更改模型GLTF */
export function fetchSetModelGltf(params: any) {
  return request.post('/model/gltf', params);
}

/** 转换模型为标本 */
export function fetchTransformModel(params: Api.Common.IDParams) {
  return request.post('/model/transform', params);
}

/** 批量移动模型到分类 */
export function fetchMoveModel(params: Api.ResourceManage.ResourceMove) {
  return request.post('/model/move', params);
}

/** 批量排序模型 */
export function fetchSortModel(params: Api.Common.SortParams) {
  return request.post('/model/sort', params);
}

/** 获取模型贴图 */
export function fetchGetModelMaps(id: number) {
  return request.get<Api.Common.ListRecord>('/model/chartlet/' + id);
}

/** 模型复制 */
export function fetchCopyModel(params: Api.Common.IDParams) {
  return request.post('/model/copy', params);
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
