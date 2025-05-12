import { Spin } from 'antd';
import React from 'react';

import styles from './ListPlaceholder.module.scss';

interface ListPlaceholderProps {
  loading?: boolean;
  empty?: boolean;
  noMore?: boolean;
  textStyle?: React.CSSProperties;
}

export const ListPlaceholder: React.FC<ListPlaceholderProps> = ({ loading, empty, noMore, textStyle }) => {
  const getText = () => {
    if (loading) {
      return '正在加载~';
    } else if (empty) {
      return '没有内容';
    } else if (noMore) {
      return '没有更多了~';
    }
    return '';
  };

  const text = getText();

  if (!text) {
    return null;
  }

  return (
    <div className={styles.placeholder}>
      <p style={textStyle}>
        {text}
        {loading && <Spin />}
      </p>
    </div>
  );
};
