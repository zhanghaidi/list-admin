import clsx from 'clsx';
import React from 'react';

import styles from './LoadMorePlaceholder.module.scss';

interface LoadMorePlaceholderProps {
  compact?: boolean;
  loading?: boolean;
  empty?: boolean;
  noMore?: boolean;
  onLoadMore?: () => void;
}

export const LoadMorePlaceholder: React.FC<LoadMorePlaceholderProps> = ({
  compact,
  loading,
  empty,
  noMore,
  onLoadMore,
}) => {
  const loadMoreHandler = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
    if (onLoadMore) {
      onLoadMore();
    }
  };

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

  return (
    <div className={clsx(styles.placeholder, { [styles.compact]: compact })}>
      {text ? (
        <p>{text}</p>
      ) : (
        <a role="button" onClick={loadMoreHandler}>
          加载更多
        </a>
      )}
    </div>
  );
};
