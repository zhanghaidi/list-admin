import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { useClickAway } from 'ahooks';
import { Menu, MenuProps } from 'antd';
import cn from 'classnames';
import { useRef } from 'react';

import styles from './RightMenu.module.scss';

// 定义右键菜单项
type MenuItem = Required<MenuProps>['items'][number];

// 定义右键菜单组件的属性接口
interface RightMenuProps {
  visible: boolean;
  position: { x: number; y: number };
  onClose?: () => void;
  onAdd?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onToggleVisible?: () => void;
  isHidden?: boolean; // 当前是否隐藏状态
}

const menuItems = (isHidden: boolean): MenuItem[] => [
  { key: 'add', label: '添加子分类', icon: <PlusOutlined /> },
  { key: 'edit', label: '编辑', icon: <EditOutlined /> },
  { key: 'toggle', label: isHidden ? '显示' : '隐藏', icon: isHidden ? <EyeOutlined /> : <EyeInvisibleOutlined /> },
  { key: 'del', label: '删除', icon: <DeleteOutlined />, danger: true },
];
const RightMenu = ({
  visible,
  position,
  onClose,
  onAdd,
  onEdit,
  onDelete,
  onToggleVisible,
  isHidden,
}: RightMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null); // 用于获取菜单容器的引用

  // 使用 useClickAway 钩子，当点击菜单外部时关闭菜单
  useClickAway(() => {
    onClose?.();
  }, menuRef);

  // 处理菜单项点击
  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'add') onAdd?.();
    if (key === 'edit') onEdit?.();
    if (key === 'toggle') onToggleVisible?.();
    if (key === 'del') onDelete?.();
  };

  return (
    <div
      ref={menuRef}
      className={cn(styles.rightMenu, { [styles.show]: visible })}
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
    >
      {visible && <Menu mode="vertical" items={menuItems(isHidden!)} onClick={handleMenuClick} />}
    </div>
  );
};

export default RightMenu;
