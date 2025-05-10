import { UserOutlined, LockOutlined, SafetyOutlined } from '@ant-design/icons';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import { Form, Input, Image, Button } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { fetchGetCaptcha, fetchLogin } from '@/api/auth';
import storage from '@/utils/storage';

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [captcha, setCaptcha] = useState({ imgPath: '', captchaKey: '' });

  useEffect(() => {
    handleChangeCaptcha();
  }, []);
  const handleChangeCaptcha = async () => {
    const { imgPath, captchaKey } = await fetchGetCaptcha();
    setCaptcha({ imgPath: imgPath, captchaKey: captchaKey });
  };
  const handleLogin = async (values: any) => {
    try {
      setLoading(true);
      const res = await fetchLogin({
        username: values.username,
        password: values.password,
        captcha: values.captcha,
        captchaKey: captcha.captchaKey,
      });
      storage.set('x-token', res.token);
      storage.set('refreshToken', res.refreshToken);
      setLoading(true);
      window.message.success('登录成功');
      navigate('/home'); // 成功跳转页面
    } catch (error) {
      console.error('登录失败:', error);
      handleChangeCaptcha();
      setLoading(false);
    }
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
              iconRender={(visible) => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
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
              <div className="w-[120px] h-[40px] border border-gray-300 rounded-lg flex items-center justify-center bg-gray-100 cursor-pointer">
                {captcha.imgPath ? (
                  <Image
                    preview={false}
                    width={120}
                    height={40}
                    src={captcha.imgPath}
                    onClick={handleChangeCaptcha}
                    className="rounded-lg"
                  />
                ) : (
                  <span className="text-xs text-gray-400">加载中...</span>
                )}
              </div>
            </Form.Item>
          </div>

          {/* 登录按钮 */}
          <Form.Item className="mb-0">
            <Button size="large" type="primary" block htmlType="submit" loading={loading}>
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
