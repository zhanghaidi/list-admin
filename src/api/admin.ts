import request from '@/utils/request';

/** 获取管理员列表 */
export function fetchGetAdminList(params?: Api.Common.SearchParams) {
  return request.get<Api.Common.PageRecord>('/admin/list', params);
}

/** 获取管理员详情 */
export function fetchGetAdmin(id: number) {
  return request.get<Api.SystemManage.Admin>('/admin/' + id);
}

/** 创建管理员 */
export function fetchCreateAdmin(params: Api.SystemManage.AdminCreate) {
  return request.post('/admin/create', params);
}

/** 修改管理员 */
export function fetchUpdateAdmin(params: Api.SystemManage.AdminUpdate) {
  return request.post('/admin/update', params);
}

/** 删除管理员 */
export function fetchDeleteAdmin(params: Api.Common.IDParams) {
  return request.post('/admin/delete', params);
}

/** 更改管理员状态 */
export function fetchSetAdminStatus(params: Api.Common.IDParams) {
  return request.post('/admin/status', params);
}

/** 获取管理员登录日志 */
export function fetchGetAdminLogs() {
  return request.get<Api.Common.ListRecord>('/admin/log');
}
