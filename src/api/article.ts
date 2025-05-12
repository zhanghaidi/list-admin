import request from '@/utils/request';

/** 获取文章列表 */
export function fetchGetArticleList(params?: Api.Common.SearchParams) {
  return request.get<Api.Common.PageRecord>('/article/list', params);
}
/** 创建文章 */
export function fetchCreateArticle(params: Api.ResourceManage.ArticleCreate) {
  return request.post('/article/create', params);
}

/** 修改文章 */
export function fetchUpdateArticle(params: Api.ResourceManage.ArticleUpdate) {
  return request.post('/article/update', params);
}

/** 更改文章状态 */
export function fetchSetArticleStatus(params: Api.Common.BatchStatusParams) {
  return request.post('/article/status', params);
}

/** 推荐文章 */
export function fetchSetArticleRecommend(params: Api.Common.IDParams) {
  return request.post('/article/recommend', params);
}

/** 删除文章 */
export function fetchDeleteArticle(params: Api.Common.IDsParams) {
  return request.post('/article/delete', params);
}

/** 批量排序文章 */
export function fetchSortArticle(params: Api.Common.SortParams) {
  return request.post('/article/sort', params);
}

/** 批量移动文章到分类 */
export function fetchMoveArticle(params: Api.ResourceManage.ResourceMove) {
  return request.post('/article/move', params);
}

/** 推荐文章 */
export function fetchRecommendArticle(params: Api.Common.IDParams) {
  return request.post('/article/recommend', params);
}

/** 获取文章分类 */
export function fetchGetCategory(params?: Api.Common.SearchParams) {
  return request.get<Api.Common.ListRecord>('/article/category/list', params);
}

/** 创建文章分类 */
export function fetchCreateCategory(params: Api.ResourceManage.CategoryCreate) {
  return request.post('/article/category/create', params);
}

/** 修改文章分类 */
export function fetchUpdateCategory(params: Api.ResourceManage.CategoryUpdate) {
  return request.post('/article/category/update', params);
}

/** 删除文章分类 */
export function fetchDeleteCategory(params: Api.Common.IDParams) {
  return request.post('/article/category/delete', params);
}

/** 排序文章分类 */
export function fetchSortCategory(params: Api.Common.IDParams) {
  return request.post('/article/category/sort', params);
}
/** 更改状态分类 */
export function fetchStatusCategory(params: Api.Common.IDParams) {
  return request.post('/article/category/status', params);
}
