import { fetchGetUserInfo } from '@/api/auth';
import { getMenuPath } from '@/utils/menu';

export interface IAuthLoader {
  buttonList: string[];
  menuList: Api.SystemManage.Menu[];
  menuPathList: string[];
}

export default async function AuthLoader() {
  // AuthLoader不允许使用状态管理
  try {
    const data = await fetchGetUserInfo();
    const menuPathList = getMenuPath(data.menuList);
    return {
      buttonList: data.buttons,
      menuList: data.menuList,
      menuPathList
    };
  } catch (error) {
    console.error(error);
    return {
      buttonList: [],
      menuList: [],
      menuPathList: []
    };
  }
}
