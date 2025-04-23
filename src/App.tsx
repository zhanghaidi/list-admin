import { ConfigProvider, App as AntdApp } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import '@ant-design/v5-patch-for-react-19';
import 'dayjs/locale/zh-cn';

import Router from './router';

const App: React.FC = () => {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        cssVar: true, // ✅ 开启 CSS 变量
        hashed: false, // ✅ 禁用哈希类名，方便 SCSS 直接使用类名
        token: {
          colorPrimary: '#0063f2',
        },
      }}
    >
      <AntdApp>
        <Router />
      </AntdApp>
    </ConfigProvider>
  );
};

export default App;
