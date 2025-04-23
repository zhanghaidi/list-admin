import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

function NotFound() {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/');
  };
  return (
    <Result
      status={500}
      title="500"
      subTitle="对不起，服务器发生错误。"
      extra={
        <Button type="primary" onClick={handleClick}>
          回首页
        </Button>
      }
    />
  );
}

export default NotFound;
