import { Button, Typography } from 'antd';
const { Title } = Typography;
export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="text-blue-600 text-2xl font-bold bg-red-50">测试样式</div>
      <Button type="primary">测试按钮</Button>
      <Title level={2}>React19+ReactRouter7+AntD5+TypeScript+Vite6实现后台管理系统</Title>
    </div>
  );
}
