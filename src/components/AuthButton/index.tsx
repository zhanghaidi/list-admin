import { Button } from 'antd';
import { useRouteLoaderData } from 'react-router-dom';

import { IAuthLoader } from '@/router/AuthLoader';

interface AuthButtonProps {
  auth?: string;
  children: React.ReactNode;
  [key: string]: any; // 允许其他 Button 属性传入
}

export default function AuthButton(props: AuthButtonProps) {
  const data = useRouteLoaderData('layout') as IAuthLoader;

  // 如果没有指定权限属性或者权限列表包含指定的权限属性，渲染按钮
  if (!props.auth || data.buttonList.includes(props.auth)) {
    return <Button {...props}>{props.children}</Button>;
  }

  // 如果不包含指定的权限属性，返回空内容
  return null;
}
