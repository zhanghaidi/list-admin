import { UserOutlined, LockOutlined, SafetyOutlined } from '@ant-design/icons';
import { Form, Input, Image, Button } from 'antd';

export default function Login() {
  const handleLogin = (values: any) => {
    console.log('登录数据:', values);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-400 to-purple-500">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-700">登录</h1>
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={handleLogin}
          autoComplete="off"
          layout="vertical"
          className="space-y-6"
        >
          {/* 账号输入 */}
          <Form.Item name="username" rules={[{ required: true, message: '账号不能为空' }]}>
            <Input
              size="large"
              placeholder="请输入账号"
              prefix={<UserOutlined style={{ color: 'rgba(0, 0, 0, 0.25)' }} />}
              className="w-full"
            />
          </Form.Item>

          {/* 密码输入 */}
          <Form.Item name="password" rules={[{ required: true, message: '密码不能为空' }]}>
            <Input.Password
              size="large"
              placeholder="请输入密码"
              prefix={<LockOutlined style={{ color: 'rgba(0, 0, 0, 0.25)' }} />}
            />
          </Form.Item>

          {/* 验证码输入 */}
          <div className="flex gap-3">
            <Form.Item name="captcha" rules={[{ required: true, message: '请输入验证码' }]} className="flex-1">
              <Input
                size="large"
                placeholder="请输入验证码"
                prefix={<SafetyOutlined style={{ color: 'rgba(0, 0, 0, 0.25)' }} />}
              />
            </Form.Item>
            <Form.Item className="mb-0">
              <Image
                preview={false}
                width={100}
                height={40}
                src=""
                alt="验证码"
                className="cursor-pointer border border-gray-300 rounded"
              />
            </Form.Item>
          </div>

          {/* 登录按钮 */}
          <Form.Item className="mb-0">
            <Button size="large" type="primary" block htmlType="submit">
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
