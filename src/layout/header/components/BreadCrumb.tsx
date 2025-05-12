import { Breadcrumb } from 'antd';
import { ReactNode, useEffect, useState } from 'react';
import { useLocation, useRouteLoaderData } from 'react-router-dom';

import { IAuthLoader } from '@/router/AuthLoader';
import { findTreeNode } from '@/utils/menu';

// import userMenuStore from '@/store/menu'

export default function BreadCrumb() {
  const { pathname } = useLocation();
  // const { menuList } = userMenuStore()
  const [breadList, setBreadList] = useState<(string | ReactNode)[]>([]);
  // 获取权限
  const data = useRouteLoaderData('layout') as IAuthLoader;

  useEffect(() => {
    const list = findTreeNode(data.menuList, pathname, []);
    setBreadList([
      <a key={'home'} href="/home">
        首页
      </a>,
      ...list,
    ]);
  }, [pathname]);
  return <Breadcrumb items={breadList.map((item) => ({ title: item }))} style={{ marginLeft: 10 }} />;
}
