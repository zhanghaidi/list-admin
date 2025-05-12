import { ReactNode } from 'react';
import { Navigate, useLocation, useRouteLoaderData } from 'react-router-dom';

import { IAuthLoader } from '@/router/AuthLoader';
import storage from '@/utils/storage';

export const GuardRoute = ({ children }: { children: ReactNode }) => {
  const whiteList: string[] = ['/welcome', '/403', '/404', '/editor/slice/'];
  const { pathname } = useLocation();

  const getToken = (): string => {
    return storage.get('x-token');
  };

  const isPathMatching = (path: string, route: string): boolean => {
    const pathSegments = path.split('/').filter(Boolean);
    const routeSegments = route.split('/').filter(Boolean);

    if (pathSegments.length !== routeSegments.length) return false;

    return routeSegments.every((segment, index) => {
      return segment.startsWith(':') || segment === pathSegments[index];
    });
  };

  // 通过路由加载器获取用户权限信息
  const data = useRouteLoaderData('layout') as IAuthLoader;

  // 检查路径是否在菜单路径中
  const isMenuPath = data.menuPathList.some((menuPath) => isPathMatching(pathname, menuPath));

  // 如果没有 token，则跳转到登录页
  if (!getToken()) {
    if (whiteList.includes(pathname)) {
      return <Navigate to="/login" replace />;
    } else {
      return <Navigate to={`/login?redirect=${pathname}`} replace />;
    }
  }

  // 如果路径不在菜单路径中且不在白名单中，则跳转到 403 页

  if (!isMenuPath && whiteList.findIndex((item) => pathname.includes(item)) === -1) {
    return <Navigate to="/403" replace />;
  }

  return <>{children}</>;
};
