import { ConfigProvider, App as AntdApp, theme } from 'antd';
import zhCN from 'antd/locale/zh_CN';

import '@ant-design/v5-patch-for-react-19';
import 'dayjs/locale/zh-cn';
import Router from './router';
import './index.scss';
import useUserStore from './store/user';
function ContextHolder() {
  const { message, modal, notification } = AntdApp.useApp();
  window.message = message;
  window.modal = modal;
  window.notification = notification;
  return null;
}
const App: React.FC = () => {
  const { isDark, colorPrimary } = useUserStore();
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        cssVar: true, // ✅ 开启 CSS 变量
        hashed: false, // ✅ 禁用哈希类名，方便 SCSS 直接使用类名
        token: {
          colorPrimary: colorPrimary.color,
        },
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        components: { Tree: { titleHeight: 32 } },
      }}
    >
      <AntdApp>
        <ContextHolder />
        <Router />
      </AntdApp>
    </ConfigProvider>
  );
};

export default App;
