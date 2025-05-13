import { UserOutlined, LockOutlined, SafetyOutlined } from '@ant-design/icons';
import { Form, Input, Image, Button } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { fetchGetCaptcha, fetchLogin } from '@/api/auth';
import storage from '@/utils/storage';

import styles from './index.module.scss';

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [captcha, setCaptcha] = useState({ imgPath: '', captchaKey: '' });

  useEffect(() => {
    handleChangeCaptcha();
  }, []);

  const handleChangeCaptcha = async () => {
    const { imgPath, captchaKey } = await fetchGetCaptcha();
    setCaptcha({ imgPath, captchaKey });
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
      window.message.success('登录成功');
      navigate('/welcome');
    } catch (error) {
      console.error('登录失败:', error);
      handleChangeCaptcha();
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>任务单管理平台</h1>
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={handleLogin}
          autoComplete="off"
          layout="vertical"
          className={styles.form}
        >
          <Form.Item name="username" rules={[{ required: true, message: '账号不能为空' }]}>
            <Input size="large" placeholder="请输入账号" prefix={<UserOutlined className={styles.icon} />} />
          </Form.Item>

          <Form.Item name="password" rules={[{ required: true, message: '密码不能为空' }]}>
            <Input.Password size="large" placeholder="请输入密码" prefix={<LockOutlined className={styles.icon} />} />
          </Form.Item>

          <div className={styles.captchaRow}>
            <Form.Item name="captcha" rules={[{ required: true, message: '请输入验证码' }]}>
              <Input size="large" placeholder="请输入验证码" prefix={<SafetyOutlined className={styles.icon} />} />
            </Form.Item>
            <Form.Item>
              <div className={styles.captchaBox} onClick={handleChangeCaptcha}>
                {captcha.imgPath ? (
                  <Image preview={false} src={captcha.imgPath} />
                ) : (
                  <span className={styles.loadingText}>加载中...</span>
                )}
              </div>
            </Form.Item>
          </div>

          <Form.Item>
            <Button size="large" type="primary" block htmlType="submit" loading={loading}>
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
