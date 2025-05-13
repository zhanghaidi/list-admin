import { LoginOutlined, MenuFoldOutlined, MenuUnfoldOutlined, MoonOutlined, SunOutlined } from '@ant-design/icons';
import { Avatar, Button, ColorPicker, Dropdown, Space, Switch, Tooltip } from 'antd';
import clsx from 'clsx';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import useUserStore from '@/store/user';
import { getImageUrl } from '@/utils';
import storage from '@/utils/storage';

import BreadCrumb from './components/BreadCrumb';
import styles from './index.module.scss';

const presetColors = [
  '#1677ff', // 拂晓蓝
  '#eb2f96', // 法式洋红
  '#fa541c', // 火山
  '#fa8c16', // 日暮
  '#13c2c2', // 明青
  '#52c41a', // 极光绿
  '#a0d911', // 青柠
  '#722ed1', // 酱紫
  '#1890ff', // 极客蓝
];

const NavHeader = () => {
  const navigate = useNavigate();
  const { userInfo, collapsed, isDark, updateCollapsed, updateTheme, colorPrimary, updateColorPrimary } =
    useUserStore();

  useEffect(() => {
    handleThemeSwitch(isDark);
  }, []);

  const handleThemeSwitch = (isDark: boolean) => {
    document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
    document.documentElement.classList.toggle('dark', isDark);
    updateTheme(isDark);
  };

  const handleColorChange = (color: string) => {
    const themeColor = { name: '', color };
    storage.set('colorPrimary', themeColor);
    updateColorPrimary(themeColor);
  };

  const onClick: any = ({ key }: { key: string }) => {
    if (key === 'logout') {
      storage.remove('x-token');
      storage.remove('refreshToken');
      navigate('/login');
    }
  };

  const userMenu = [
    {
      key: 'nickName',
      label: '用户名：' + userInfo.nickName,
    },
    {
      key: 'realName',
      label: '手机号：' + userInfo.realName,
    },
    {
      key: 'logout',
      icon: <LoginOutlined />,
      label: '退出登录',
    },
  ];

  return (
    <div className={styles.navHeader}>
      <div className={clsx(styles.left, styles.alignItemsCenter)}>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => updateCollapsed()}
          style={{ fontSize: '16px', width: 30, height: 30 }}
        />
        <BreadCrumb />
      </div>

      <div className={clsx(styles.right, styles.alignItemsCenter)}>
        <Tooltip title="主题切换">
          <Switch
            checked={isDark}
            onChange={handleThemeSwitch}
            checkedChildren={<MoonOutlined />}
            unCheckedChildren={<SunOutlined />}
          />
        </Tooltip>

        <Tooltip title="主题色">
          <ColorPicker
            defaultValue={colorPrimary.color}
            value={colorPrimary.color}
            onChangeComplete={(color) => handleColorChange(color.toHexString())}
            presets={[
              {
                label: '推荐主题色',
                colors: presetColors,
              },
            ]}
            style={{ margin: 12 }}
          />
        </Tooltip>

        <Dropdown menu={{ items: userMenu, onClick }} trigger={['click']}>
          <Space size={0}>
            <Avatar size="small" src={getImageUrl(userInfo.avatar)} />
            <span className={styles.nickName}>{userInfo.username}</span>
          </Space>
        </Dropdown>
      </div>
    </div>
  );
};

export default NavHeader;
