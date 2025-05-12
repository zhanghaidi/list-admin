import { Typography, Divider } from 'antd';
import React from 'react';

const { Title, Text, Paragraph } = Typography;

interface ArticleViewerProps {
  article: {
    title: string;
    content: string;
    description?: string;
    createdAt?: string;
  };
}

const ArticleViewer: React.FC<ArticleViewerProps> = ({ article }) => {
  const { title, content, description, createdAt } = article;

  return (
    <Typography>
      <Title level={3}>{title}</Title>

      {createdAt && (
        <Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>
          发布时间：{createdAt}
        </Text>
      )}

      {description && (
        <>
          <Paragraph type="secondary">{description}</Paragraph>
          <Divider />
        </>
      )}

      {/* 正文内容：直接展示 HTML */}
      <div dangerouslySetInnerHTML={{ __html: content }} style={{ lineHeight: '1.8em' }} />
    </Typography>
  );
};

export default ArticleViewer;
