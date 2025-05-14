import request from '@/utils/request';

/** 获取题库列表 */
export function fetchGetQuestionList(params?: Api.Common.SearchParams) {
  return request.get<Api.Common.PageRecord>('/exercise/question/list', params);
}
/** 创建题库 */
export function fetchCreateQuestion(params: Api.ExerciseManger.QuestionCreate) {
  return request.post('/exercise/question/create', params);
}

/** 修改题库 */
export function fetchUpdateQuestion(params: Api.ExerciseManger.QuestionUpdate) {
  return request.post('/exercise/question/update', params);
}

/** 更改题库状态 */
export function fetchSetQuestionStatus(params: Api.Common.BatchStatusParams) {
  return request.post('/exercise/question/status', params);
}

/** 删除题库 */
export function fetchDeleteQuestion(params: Api.Common.IDsParams) {
  return request.post('/exercise/question/delete', params);
}

/** 批量排序题库 */
export function fetchSortQuestion(params: Api.Common.SortParams) {
  return request.post('/exercise/question/sort', params);
}

/** 导入题库 */
export function fetchImportQuestion(params: any) {
  return request.post('/exercise/question/import', params);
}

/** 批量移动题库到分类 */
export function fetchMoveQuestion(params: Api.ResourceManage.ResourceMove) {
  return request.post('/exercise/question/move', params);
}
