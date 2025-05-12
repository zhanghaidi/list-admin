import request from '@/utils/request';

/** 获取菜单列表 */
export function fetchGetMenuList(params?: Api.Common.SearchParams) {
  return request.get<Api.Common.ListRecord>('/menu/list', params);
}

/** 获取菜单详情 */
export function fetchGetMenu(id: number) {
  return request.get<Api.SystemManage.Menu>('/menu/' + id);
}

/** 创建菜单 */
export function fetchCreateMenu(params: Api.SystemManage.MenuCreate) {
  return request.post('/menu/create', params);
}

/** 修改菜单 */
export function fetchUpdateMenu(params: Api.SystemManage.MenuUpdate) {
  return request.post('/menu/update', params);
}

/** 删除菜单 */
export function fetchDeleteMenu(params: Api.Common.IDParams) {
  return request.post('/menu/delete', params);
}

/** 更改菜单状态 */
export function fetchSetMenuStatus(params: Api.Common.IDParams) {
  return request.post('/menu/status', params);
}

/** 获取菜单按钮 */
export function fetchGetMenuActions() {
  return request.get<Api.Common.ListRecord>('/menu/actions');
}
