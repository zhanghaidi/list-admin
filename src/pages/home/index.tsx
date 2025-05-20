import { Avatar, Card, Col, Row, Space, Typography } from 'antd';

import avatar from '@/assets/images/cover.png';
import useUserStore from '@/store/user';

const { Title, Text } = Typography;

export default function Home() {
  const { userInfo } = useUserStore();

  //   const statisticData = [
  //     { id: 0, title: '项目数', value: '25' },
  //     { id: 1, title: '待办', value: '4/16' },
  //     { id: 2, title: '消息', value: '12' }
  //   ];

  //   const cardStats = [
  //     { title: '模型数', value: 111 },
  //     { title: '标本数', value: 222 },
  //     { title: '切片数', value: 333 },
  //     { title: '文章数', value: 444 }
  //   ];

  return (
    <Space direction="vertical" style={{ width: '100%' }} size={[16, 16]}>
      <Card variant="borderless">
        <Row gutter={[16, 16]} align="middle">
          <Col md={18} span={24}>
            <Space align="center" size="middle" wrap={false}>
              <Avatar size={{ xs: 48, sm: 56, md: 64, lg: 72, xl: 80, xxl: 100 }} src={avatar} />
              <Space direction="vertical" size={4}>
                <Title level={4} style={{ margin: 0 }}>
                  欢迎 {userInfo.username}，今天又是充满活力的一天
                </Title>
                <Text type="secondary">幸福像花儿一样</Text>
              </Space>
            </Space>
          </Col>
          {/* <Col md={6} span={24}>
            <Space size={24} style={{ width: '100%', justifyContent: 'flex-end', display: 'flex' }}>
              {statisticData.map((item) => (
                <Statistic key={item.id} {...item} />
              ))}
            </Space>
          </Col> */}
        </Row>
      </Card>

      {/* <Card size="small" variant="borderless">
        <Row gutter={[16, 16]}>
          {cardStats.map((item, index) => (
            <Col key={index} xs={12} sm={12} md={6}>
              <Statistic title={item.title} value={item.value} style={{ textAlign: 'center' }} />
            </Col>
          ))}
        </Row>
      </Card> */}
    </Space>
  );
}
