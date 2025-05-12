import * as AntdIcons from '@ant-design/icons'; // 引入 Ant Design 的图标库
import Icon from '@ant-design/icons';
import { Card, Input, Popover, Segmented } from 'antd'; // 引入需要的组件
import React, { useState, useMemo } from 'react';

interface IconSelectProps {
  value?: string;
  onChange?: (value: string) => void;
}
// 图标组件定义
const OutlinedIcon = (props: any) => (
  <Icon
    {...props}
    component={() => (
      <svg width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" viewBox="0 0 1024 1024">
        <path d="M864 64H160C107 64 64 107 64 160v704c0 53 43 96 96 96h704c53 0 96-43 96-96V160c0-53-43-96-96-96z m-12 800H172c-6.6 0-12-5.4-12-12V172c0-6.6 5.4-12 12-12h680c6.6 0 12 5.4 12 12v680c0 6.6-5.4 12-12 12z"></path>
      </svg>
    )}
  />
);

const FilledIcon = (props: any) => (
  <Icon
    {...props}
    component={() => (
      <svg width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" viewBox="0 0 1024 1024">
        <path d="M864 64H160C107 64 64 107 64 160v704c0 53 43 96 96 96h704c53 0 96-43 96-96V160c0-53-43-96-96-96z"></path>
      </svg>
    )}
  />
);

const TwoToneIcon = (props: any) => (
  <Icon
    {...props}
    component={() => (
      <svg width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" viewBox="0 0 1024 1024">
        <path d="M16 512c0 273.932 222.066 496 496 496s496-222.068 496-496S785.932 16 512 16 16 238.066 16 512z m496 368V144c203.41 0 368 164.622 368 368 0 203.41-164.622 368-368 368z"></path>
      </svg>
    )}
  />
);

const MoreIcon = (props: any) => (
  <Icon
    {...props}
    component={() => (
      <svg width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" viewBox="0 0 1024 1024">
        <path
          d="M249.787181 328.164281A74.553827 74.553827 0 1 0 175.233354 254.884879a73.916615 73.916615 0 0 0 74.553827 73.279402zM509.769757 328.164281A74.553827 74.553827 0 1 0 435.21593 254.884879 74.553827 74.553827 0 0 0 509.769757 328.164281zM769.752334 328.164281A74.553827 74.553827 0 1 0 695.835719 254.884879a73.916615 73.916615 0 0 0 73.916615 73.916614zM249.787181 588.78407a74.553827 74.553827 0 1 0-74.553827-74.553827 73.916615 73.916615 0 0 0 74.553827 74.553827zM509.769757 588.78407a74.553827 74.553827 0 1 0-74.553827-74.553827A74.553827 74.553827 0 0 0 509.769757 588.78407zM769.752334 588.78407a74.553827 74.553827 0 1 0-73.916615-74.553827 74.553827 74.553827 0 0 0 73.916615 74.553827zM249.787181 848.766646a74.553827 74.553827 0 1 0-74.553827-74.553827 73.916615 73.916615 0 0 0 74.553827 74.553827zM509.769757 848.766646a74.553827 74.553827 0 1 0-74.553827-74.553827A74.553827 74.553827 0 0 0 509.769757 848.766646zM769.752334 848.766646a74.553827 74.553827 0 1 0-73.916615-74.553827 74.553827 74.553827 0 0 0 73.916615 74.553827z"
          fill="#555555"
        ></path>
      </svg>
    )}
  />
);

// 所有 Ant Design 图标的集合
const allIcons: {
  [key: string]: any;
} = AntdIcons;

// 图标选择组件
const IconSelect: React.FC<IconSelectProps> = ({ value, onChange }) => {
  // 状态管理
  const [popoverOpen, setPopoverOpen] = useState(false); // 是否打开弹出框
  const [iconTheme, setIconTheme] = useState<'Outlined' | 'Filled' | 'TwoTone'>('Outlined'); // 当前图标风格选择

  // 根据当前风格选择过滤可见的图标列表
  const visibleIconList = useMemo(
    () =>
      Object.keys(allIcons).filter(
        (iconName) => iconName.includes(iconTheme) && iconName !== 'getTwoToneColor' && iconName !== 'setTwoToneColor',
      ),
    [iconTheme],
  );

  // 根据选中的值展示对应的图标组件
  const SelectedIcon = value ? allIcons[value] : MoreIcon;

  return (
    <Popover
      title="选择图标"
      placement="bottomRight"
      arrow={true}
      trigger="click"
      open={popoverOpen}
      content={
        <div style={{ width: 600 }}>
          {/* 图标风格切换按钮 */}
          <Segmented
            options={[
              { label: '线框风格', value: 'Outlined', icon: <OutlinedIcon /> },
              { label: '实底风格', value: 'Filled', icon: <FilledIcon /> },
              { label: '双色风格', value: 'TwoTone', icon: <TwoToneIcon /> },
            ]}
            block
            onChange={(value: any) => {
              setIconTheme(value);
            }}
          />

          {/* 图标展示区域 */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              marginTop: 8,
              height: 500,
              overflowY: 'auto',
              padding: 0,
              gap: 16,
            }}
          >
            {visibleIconList.map((iconName) => {
              const Component = allIcons[iconName];
              return (
                <Card
                  key={iconName}
                  style={{
                    width: 'calc(16.666% - 16px)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                    border: value === iconName ? '1px solid #1890ff' : '1px solid #f0f0f0',
                  }}
                  onClick={() => {
                    onChange?.(iconName);
                    setPopoverOpen(false);
                  }}
                >
                  <Component style={{ fontSize: '24px' }} />
                </Card>
              );
            })}
          </div>
        </div>
      }
    >
      {/* 输入框部分 */}
      <Input
        type="text"
        value={value}
        onFocus={() => setPopoverOpen(true)}
        placeholder="点击选择图标"
        readOnly
        onChange={(e) => {
          onChange?.(e.target.value);
        }}
        suffix={
          <a
            onClick={(e) => {
              e.stopPropagation();
              onChange?.('');
              setPopoverOpen(false);
            }}
          >
            清除
          </a>
        }
        addonAfter={
          <SelectedIcon
            style={{
              cursor: 'pointer',
            }}
            onClick={() => setPopoverOpen(!popoverOpen)}
          />
        }
      />
    </Popover>
  );
};

export default IconSelect;
