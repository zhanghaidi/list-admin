import request from '@/utils/request';

/** 获取角色列表 */
export function fetchGetRoleList(params?: Api.Common.SearchParams) {
  return request.get<Api.Common.PageRecord>('/role/list', params);
}
/** 创建角色 */
export function fetchCreateRole(params: Api.SystemManage.RoleCreate) {
  return request.post('/role/create', params);
}

/** 修改角色 */
export function fetchUpdateRole(params: Api.SystemManage.RoleUpdate) {
  return request.post('/role/update', params);
}

/** 删除角色 */
export function fetchDeleteRole(params: Api.Common.IDParams) {
  return request.post('/role/delete', params);
}
