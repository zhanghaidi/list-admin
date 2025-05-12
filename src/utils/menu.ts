// 获取菜单树页面路径
export const getMenuPath = (list: Api.SystemManage.Menu[]): string[] => {
  return list.reduce((result: string[], item: Api.SystemManage.Menu) => {
    return result.concat(item.child?.length ? getMenuPath(item.child) : item.path + '');
  }, []);
};

// 递归获取路由对象
export const searchRoute: any = (path: string, routes: Api.SystemManage.Menu[] = []) => {
  for (const item of routes) {
    if (item.path === path) return item;
    if (item.child) {
      const result = searchRoute(path, item.child);
      if (result) return result;
    }
  }
  return '';
};

/**
 * 递归查找树的路径
 */
export const findTreeNode = (tree: Api.SystemManage.Menu[], pathName: string, path: string[]): string[] => {
  if (!tree) return [];
  for (const node of tree) {
    path.push(node.name);
    if (node.path === pathName) return path;
    if (node.child?.length) {
      const children = findTreeNode(node.child, pathName, path);
      if (children?.length) return children;
    }
    path.pop();
  }
  return [];
};
