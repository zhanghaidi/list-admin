import * as Icons from '@ant-design/icons';
import { Menu, MenuProps } from 'antd';
import clsx from 'clsx';
import React from 'react';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { useLocation, useNavigate, useRouteLoaderData } from 'react-router-dom';

import { IAuthLoader } from '@/router/AuthLoader';
import useUserStore from '@/store/user';

import styles from './index.module.scss';

type MenuItem = Required<MenuProps>['items'][number];

const SideMenu = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { collapsed, isDark } = useUserStore();
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const data = useRouteLoaderData('layout') as IAuthLoader;

  // 菜单点击
  const handleClickMenu = ({ key }: { key: string }) => {
    setSelectedKeys([key]);
    navigate(key);
  };
  // 生成每一个菜单项
  const getItem = (label: React.ReactNode, key: React.Key, icon?: React.ReactNode, children?: MenuItem[]) => ({
    key,
    icon,
    children,
    label
  });
  // 创建图标
  const createIcon = (name?: string) => {
    if (!name) return null;
    const customerIcons: { [key: string]: any } = Icons;
    const IconComponent = customerIcons[name];
    return IconComponent ? React.createElement(IconComponent) : null;
  };

  // 递归生成菜单树
  const getTreeMenu = useCallback((menuList: Api.SystemManage.Menu[]): MenuItem[] => {
    return menuList
      .filter((item) => item.type === 0)
      .map((item) => {
        const menuItem = getItem(item.name, item.path, createIcon(item.icon));
        if (item.child && item.child.length > 0) {
          menuItem.children = getTreeMenu(item.child);
        }
        return menuItem;
      });
  }, []);

  // 初始化，获取接口菜单列表数据
  useEffect(() => {
    setSelectedKeys([pathname]);
  }, [pathname]);

  // 菜单数据
  const menuList = useMemo(() => getTreeMenu(data.menuList), [data.menuList, getTreeMenu]);

  return (
    <div className={clsx(styles.navSide, { [styles.collapsed]: collapsed })}>
      <div className={styles.logo}>
        <img src={`${import.meta.env.BASE_URL}evdo.svg`} className={styles.img} />
        {!collapsed && <span>任务单管理平台</span>}
      </div>
      <Menu
        mode="inline"
        theme={isDark ? 'light' : 'dark'}
        style={{
          width: collapsed ? 80 : 'auto',
          height: 'calc(100vh - 50px)'
        }}
        selectedKeys={selectedKeys}
        onClick={handleClickMenu}
        items={menuList}
      />
    </div>
  );
};

export default SideMenu;
