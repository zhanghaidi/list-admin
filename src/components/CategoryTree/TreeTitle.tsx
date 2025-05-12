import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Form, Space, Input, TreeDataNode } from 'antd';
import { InputRef } from 'antd/lib/input';
import { useRef, useState, useEffect } from 'react';

import styles from './TreeTitle.module.scss';

// 定义 TreeTitle 组件的属性接口
interface TreeTitleProps {
  node: TreeDataNode;
  id?: React.Key;
  isEditing: boolean;
  onSave?: (value: string) => void;
  onCancel?: () => void;
}

const TreeTitle = ({ node, id, isEditing, onSave, onCancel }: TreeTitleProps) => {
  const inputRef = useRef<InputRef>(null); // 用于获取输入框的引用
  const [titleValue, setTitleValue] = useState<string>(node.title as string); // 当前节点的标题值

  // 当组件挂载时，自动聚焦输入框
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // 处理输入框内容变化
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitleValue(e.target.value);
  };

  // 处理取消编辑操作
  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止事件冒泡
    onCancel?.(); // 调用取消回调
  };

  // 如果当前节点正在编辑且编辑的节点ID与当前节点ID匹配
  if (isEditing && id === node.key) {
    return (
      <Form onFinish={() => onSave?.(titleValue)}>
        {/* 提交表单时调用保存回调 */}
        <Input
          ref={inputRef}
          size="middle"
          suffix={
            <Space>
              <CheckCircleOutlined onClick={() => onSave?.(titleValue)} /> {/* 保存按钮 */}
              <CloseCircleOutlined onClick={handleCancel} /> {/* 取消按钮 */}
            </Space>
          }
          value={titleValue}
          onChange={handleChange}
        />
      </Form>
    );
  }

  // 默认显示节点标题
  return (
    <span className={styles.title}>
      <span className={styles['title-text']}>
        {typeof node.title === 'function' ? node.title(node) : node.title} {/* 支持动态标题 */}
      </span>
    </span>
  );
};

export default TreeTitle;
