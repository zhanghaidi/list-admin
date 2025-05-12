import { FolderOutlined, FolderOpenOutlined } from '@ant-design/icons';
import { Tree, TreeDataNode } from 'antd';
import { EventDataNode, TreeProps } from 'antd/es/tree';
import { forwardRef, Ref, useEffect, useImperativeHandle, useState } from 'react';

import styles from './BasicTree.module.scss';
import RightMenu from './RightClickMenu';
import TreeTitle from './TreeTitle';

const { DirectoryTree } = Tree;

// 扩展的树节点接口
interface ExtendTreeDataNode extends TreeDataNode, Partial<Api.ResourceManage.CategoryNodes> {
  children?: ExtendTreeDataNode[];
}

// 基础树组件的属性接口
interface BasicTreeProps extends TreeProps {
  heightFromOthers?: string;
  loadingTree?: boolean;
  onCreate?: (pid: React.Key, title: string) => Promise<void>;
  onDelete?: (id: React.Key) => Promise<void>;
  onUpdate?: (pid: React.Key, node: Api.ResourceManage.CategoryNodes, title: string) => Promise<void>;
  onStatus?: (id: React.Key) => Promise<void>;
  treeDataFromOutside: Api.ResourceManage.CategoryNodes[];
}

// 基础树组件的引用接口
export interface BasicTreeRef {
  addRootNode: () => void;
}

const BasicTreeComponent = (props: BasicTreeProps, ref: Ref<BasicTreeRef>) => {
  const { treeDataFromOutside, fieldNames = { key: 'key', title: 'title', children: 'children' } } = props;

  const [treeData, setTreeData] = useState<ExtendTreeDataNode[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [parentNodeKey, setParentNodeKey] = useState<React.Key>();
  const [editNodeKey, setEditNodeKey] = useState<React.Key>();
  const [rightClickNode, setRightClickNode] = useState<ExtendTreeDataNode>();
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isRightMenuVisible, setIsRightMenuVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // 转换外部传入的树数据
  useEffect(() => {
    const transformTreeData = (data: any[]): ExtendTreeDataNode[] => {
      return data.map((item) => {
        const { key = 'key', title = 'title', children = 'children' } = fieldNames;
        return {
          key: item[key],
          title: item[title],
          children: Array.isArray(item[children]) ? transformTreeData(item[children]) : [],
          ...item,
        } as ExtendTreeDataNode;
      });
    };

    if (Array.isArray(treeDataFromOutside)) {
      setTreeData(transformTreeData(treeDataFromOutside));
    }
  }, [treeDataFromOutside, fieldNames]);

  // 添加新节点
  const addNode = (newNode: ExtendTreeDataNode, parentNodeKey?: React.Key) => {
    setTreeData((prev) => updateTreeData(prev, newNode, parentNodeKey));
  };

  // 更新树数据
  const updateTreeData = (
    treeData: ExtendTreeDataNode[],
    newNode: ExtendTreeDataNode,
    parentNodeKey?: React.Key,
  ): ExtendTreeDataNode[] => {
    if (typeof parentNodeKey === 'undefined') {
      return [newNode, ...treeData];
    }
    return treeData.map((node) => ({
      ...node,
      children:
        node.key === parentNodeKey
          ? [newNode, ...(node.children || [])]
          : updateTreeData(node.children || [], newNode, parentNodeKey),
    }));
  };

  // 删除节点
  const removeNodeById = (data: ExtendTreeDataNode[], targetId?: React.Key): ExtendTreeDataNode[] => {
    if (!targetId) return data;
    return data
      .map((node) => ({
        ...node,
        children: node.children ? removeNodeById(node.children, targetId) : [],
      }))
      .filter((node) => node.key !== targetId || (node.children && node.children.length > 0));
  };

  // 处理添加节点
  const handleAddNode = () => {
    if (rightClickNode) {
      const pid = rightClickNode.key;
      const newNode: ExtendTreeDataNode = { key: Date.now(), title: '', parentId: Number(pid) };
      setIsRightMenuVisible(false);
      setEditNodeKey(newNode.key);
      setIsEditing(true);
      setParentNodeKey(pid);
      if (pid) {
        addNode(newNode, pid);
        setIsAdding(true);
        setExpandedKeys((prev) => [...prev, pid]);
      }
    }
  };

  // 处理编辑节点
  const handleEditNode = () => {
    const pid = rightClickNode?.parentId;
    setParentNodeKey(pid);
    setEditNodeKey(rightClickNode?.key);
    setIsEditing(true);
    setIsRightMenuVisible(false);
  };

  // 处理保存节点
  const handleSaveNode = async (value: string) => {
    if (parentNodeKey !== undefined && editNodeKey !== undefined) {
      if (isAdding) {
        await props.onCreate?.(parentNodeKey, value);
      } else {
        const node = findNodeByKey(treeData, editNodeKey);
        if (!node) return;

        await props.onUpdate?.(parentNodeKey, node as Api.ResourceManage.CategoryNodes, value);
      }
      setIsEditing(false);
      setIsAdding(false);
    }
  };
  const findNodeByKey = (data: ExtendTreeDataNode[], key?: React.Key): ExtendTreeDataNode | undefined => {
    for (const node of data) {
      if (node.key === key) return node;
      if (node.children) {
        const found = findNodeByKey(node.children, key);
        if (found) return found;
      }
    }
    return undefined;
  };

  // 添加切换显示隐藏逻辑
  const handleToggleVisible = async () => {
    if (!rightClickNode) return;
    await props.onStatus?.(rightClickNode.key);
    // 更新前端状态（乐观更新）
    const updated = toggleNodeStatus(treeData, rightClickNode.key);
    setTreeData(updated);
    setIsRightMenuVisible(false);
  };

  // 辅助函数：递归修改节点 status
  const toggleNodeStatus = (data: ExtendTreeDataNode[], targetId: React.Key): ExtendTreeDataNode[] => {
    return data.map((node) => {
      if (node.key === targetId) {
        return { ...node, status: node.status === 1 ? 0 : 1 };
      }
      return { ...node, children: node.children ? toggleNodeStatus(node.children, targetId) : [] };
    });
  };

  // 处理删除节点
  const handleDeleteNode = async () => {
    if (rightClickNode) {
      await props.onDelete?.(rightClickNode.key);
      setIsRightMenuVisible(false);
    }
  };

  // 处理取消编辑
  const handleCancelEdit = () => {
    if (isAdding) {
      setTreeData((prev) => removeNodeById(prev, editNodeKey));
      setExpandedKeys((prev) => prev.filter((key) => key !== editNodeKey));
      setIsAdding(false);
    }
    setEditNodeKey(undefined);
    setIsEditing(false);
  };

  // 处理右键点击
  const handleRightClick = ({ event, node }: { event: React.MouseEvent; node: EventDataNode<ExtendTreeDataNode> }) => {
    setMenuPosition({ x: event.pageX, y: event.pageY });
    setRightClickNode(node);
    setIsRightMenuVisible(true);
  };

  // 关闭右键菜单
  const handleCloseRightMenu = () => setIsRightMenuVisible(false);

  // 暴露给父组件的方法
  useImperativeHandle(ref, () => ({
    addRootNode: () => {
      const pid = 0;
      setParentNodeKey(pid);
      const newNode: ExtendTreeDataNode = { key: Date.now(), title: '', parentId: Number(pid) };
      setEditNodeKey(newNode.key);
      addNode(newNode);
      setIsEditing(true);
      setIsAdding(true);
    },
  }));

  return (
    <div className={styles.treeContainer}>
      <DirectoryTree
        blockNode
        selectable
        treeData={treeData}
        expandedKeys={expandedKeys}
        showIcon
        icon={({ expanded }) =>
          expanded ? (
            <FolderOpenOutlined style={{ color: '#1890ff' }} />
          ) : (
            <FolderOutlined style={{ color: '#1890ff' }} />
          )
        }
        titleRender={(nodeData) => (
          <span style={{ color: nodeData.status === 0 ? '#999' : 'inherit' }}>
            <TreeTitle
              node={nodeData}
              id={editNodeKey}
              isEditing={isEditing}
              onSave={handleSaveNode}
              onCancel={handleCancelEdit}
            />
          </span>
        )}
        onRightClick={handleRightClick}
        onExpand={setExpandedKeys}
        onSelect={(selectedKeys, info) => !isEditing && props.onSelect?.(selectedKeys, info)}
      />
      <RightMenu
        visible={isRightMenuVisible}
        position={menuPosition}
        onClose={handleCloseRightMenu}
        onAdd={handleAddNode}
        onEdit={handleEditNode}
        onDelete={handleDeleteNode}
        onToggleVisible={handleToggleVisible}
        isHidden={rightClickNode?.status === 0}
      />
    </div>
  );
};

const BasicTree = forwardRef<BasicTreeRef, BasicTreeProps>(BasicTreeComponent);

export default BasicTree;
