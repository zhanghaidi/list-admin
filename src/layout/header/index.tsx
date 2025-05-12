import { LoginOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Avatar, Button, Dropdown, MenuProps, Space } from 'antd';
import clsx from 'clsx';
import { Sun, Moon, Palette } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import useUserStore from '@/store/user';
import { getImageUrl } from '@/utils';
import storage from '@/utils/storage';

import BreadCrumb from './components/BreadCrumb';
import styles from './index.module.scss';
const NavHeader = () => {
  const navigate = useNavigate();
  const { userInfo, collapsed, isDark, updateCollapsed, updateTheme, colorPrimary, updateColorPrimary } =
    useUserStore();
  const themeColors = [
    {
      name: '拂晓蓝',
      color: '#1677ff',
    },
    {
      name: '法式洋红',
      color: '#eb2f96',
    },
    {
      name: '火山',
      color: '#fa541c',
    },
    {
      name: '日暮',
      color: '#fa8c16',
    },
    {
      name: '明青',
      color: '#13c2c2',
    },
    {
      name: '极光绿',
      color: '#52c41a',
    },
    {
      name: '青柠',
      color: '#a0d911',
    },
    {
      name: '酱紫',
      color: '#722ed1',
    },
    {
      name: '极客蓝',
      color: '#1890ff',
    },
  ];
  const colors: MenuProps['items'] = [
    ...themeColors.map((color) => {
      return {
        key: color.color,
        label: (
          <Space
            onClick={() => {
              storage.set('colorPrimary', color);
              updateColorPrimary(color);
            }}
          >
            <Button
              style={{
                backgroundColor: color.color,
                borderColor: color.color,
                width: 30,
                height: 30,
              }}
            />
            <span style={{ color: color.color }}>{color.name}</span>
          </Space>
        ),
      };
    }),
  ];
  const items: MenuProps['items'] = [
    {
      key: 'nickName',
      label: '用户名：' + userInfo.nickName,
    },
    {
      key: '姓名',
      label: '手机号：' + userInfo.realName,
    },
    {
      key: 'logout',
      icon: <LoginOutlined />,
      label: '退出登录',
    },
  ];

  useEffect(() => {
    handleThemeSwitch(isDark);
  }, []);

  // 切换主题
  const handleThemeSwitch = (isDark: boolean) => {
    if (isDark) {
      document.documentElement.dataset.theme = 'dark';
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.dataset.theme = 'light';
      document.documentElement.classList.remove('dark');
    }
    storage.set('isDark', isDark);
    updateTheme(isDark);
  };
  // 点击退出
  const onClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'logout') {
      storage.remove('x-token');
      storage.remove('refreshToken');
      navigate('/login');
    }
  };
  return (
    <div className={styles.navHeader}>
      <div className={clsx(styles.left, styles.alignItemsCenter)}>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => updateCollapsed()}
          style={{
            fontSize: '16px',
            width: 30,
            height: 30,
          }}
        />
        <BreadCrumb />
      </div>

      <div className={clsx(styles.right, styles.alignItemsCenter)}>
        <Button type="text" size="small" onClick={() => handleThemeSwitch(!isDark)}>
          {isDark ? <Sun size={24} color="white" /> : <Moon size={24} />}
        </Button>
        <Dropdown menu={{ items: colors }} trigger={['click']}>
          <Button
            type="text"
            size="small"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              marginRight: 10,
            }}
          >
            <Palette size={24} color={colorPrimary.color} />
          </Button>
        </Dropdown>

        <Dropdown menu={{ items, onClick }} trigger={['click']}>
          <Space size={0}>
            <span>
              <Avatar size="small" src={getImageUrl(userInfo.avatar)} />
            </span>
            <span className={styles.nickName}>{userInfo.username}</span>
          </Space>
        </Dropdown>
      </div>
    </div>
  );
};
export default NavHeader;
