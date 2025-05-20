import { Layout } from 'antd';
import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import { fetchGetUserInfo } from '@/api/auth';
import Header from '@/layout/header';
import Menu from '@/layout/menu';
import useUserStore from '@/store/user';

import styles from './index.module.scss';
import LayoutTabs from './tabs';

const { Sider, Footer } = Layout;

const BaseLayout: React.FC = () => {
  const { collapsed, updateUserInfo } = useUserStore();

  useEffect(() => {
    GetUserInfo();
  }, []);

  const GetUserInfo = async () => {
    try {
      const data = await fetchGetUserInfo();
      updateUserInfo(data); // 用户信息状态
    } catch (error) {
      console.error('获取用户信息失败:', error);
    }
  };

  return (
    <Layout>
      {/* 侧边栏 */}
      <Sider className={styles.sider} collapsed={collapsed}>
        <Menu />
      </Sider>
      <Layout>
        {/* 头部 */}
        <Header />
        <LayoutTabs />
        <div className={styles.content}>
          <div className={styles.wrapper}>
            <Outlet />
          </div>
          <Footer style={{ textAlign: 'center' }}>
            河南中博科技有限公司 ©{new Date().getFullYear()}{' '}
            <a target="_blank" href="https://list.evdo.vip" rel="noreferrer">
              任务单管理系统
            </a>
          </Footer>
        </div>
      </Layout>
    </Layout>
  );
};

export default BaseLayout;
