import { DeleteOutlined, EditOutlined, EyeOutlined, FolderAddOutlined, OrderedListOutlined, PlusOutlined, TruckOutlined } from '@ant-design/icons';
import { useAntdTable } from 'ahooks';
import { Button, Table, Form, Input, Space, Modal, message, Image, Select, Switch, InputNumber, Card, Col, Row } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { ColumnsType } from 'antd/es/table';
import React, { useEffect, useRef, useState } from 'react';

import {
  fetchGetArticleList,
  fetchDeleteArticle,
  fetchGetCategory,
  fetchSetArticleStatus,
  fetchSortArticle,
  fetchCreateCategory,
  fetchUpdateCategory,
  fetchStatusCategory,
  fetchDeleteCategory
} from '@/api/article';
import errorImg from '@/assets/images/image-error.png';
import BasicTree, { BasicTreeRef } from '@/components/CategoryTree/BasicTree';
import { getImageUrl } from '@/utils';

import ArticleViewer from './ArticleViewer';
import MoveArticle from './MoveArticle';
import OperateArticle from './OperateArticle';

export default function ArticleList() {
  const [form] = useForm();
  const [sortForm] = useForm();
  const [categoryList, setCategoryList] = useState<Api.ResourceManage.CategoryNodes[]>([]);
  const [ids, setIds] = useState<number[]>([]);
  const articleRef = useRef<{ open: (type: ModalProp.OperateAction, data?: Api.ResourceManage.Article) => void }>({ open: () => {} });
  const moveArticleRef = useRef<{ open: (type: ModalProp.OperateAction, data: number[]) => void }>({ open: () => {} });
  const treeRef = useRef<BasicTreeRef>(null);

  useEffect(() => {
    getCategoryList();
  }, []);

  // 获取分类列表
  const getCategoryList = async (keywords?: string) => {
    const res = await fetchGetCategory({ keywords: keywords });
    setCategoryList(res.list);
  };

  const getTableData = ({ current, pageSize }: { current: number; pageSize: number }, formData: Api.Common.SearchParams) => {
    return fetchGetArticleList({
      ...formData,
      page: current,
      pageSize: pageSize
    }).then((data) => {
      return {
        total: data.total,
        list: data.list
      };
    });
  };
  const { tableProps, search, refresh } = useAntdTable(getTableData, {
    form
  });

  const columns: ColumnsType<Api.ResourceManage.Article> = [
    {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
      width: 100,
      align: 'center',
      render: (_, record) => (
        <Form.Item name={record.id} initialValue={record.sort} style={{ margin: 0 }}>
          <InputNumber min={0} style={{ width: '80px', fontSize: '14px' }} />
        </Form.Item>
      )
    },
    {
      title: '序号',
      key: 'index',
      align: 'center',
      width: 80,
      render: (_: any, __: Api.ResourceManage.Article, index: number) => (tableProps.pagination.current - 1) * tableProps.pagination.pageSize + index + 1
    },
    { title: 'ID', dataIndex: 'id', align: 'center', width: 100, key: 'id' },
    {
      title: '文章封面',
      dataIndex: 'thumb',
      key: 'thumb',
      width: 100,
      align: 'center',
      render: (_, record) => <Image style={{ borderRadius: '5%' }} width={85} src={getImageUrl(record.thumb)} fallback={errorImg} />
    },
    {
      title: '文章标题',
      dataIndex: 'title',
      width: 200,
      align: 'center',
      key: 'title'
    },
    {
      title: '所属分类',
      dataIndex: 'category',
      key: 'category',
      width: 100,
      align: 'center',
      render(_, record) {
        return record.category?.path;
      }
    },
    {
      title: '文章描述',
      dataIndex: 'description',
      align: 'center',
      width: 450,
      key: 'description'
    },
    {
      title: '文章状态',
      dataIndex: 'status',
      width: 100,
      align: 'center',
      render(_, record) {
        return <Switch checkedChildren="显示" unCheckedChildren="隐藏" checked={record.status === 1} onChange={() => handleStatusChange(record)} />;
      }
    },
    { title: '创建时间', dataIndex: 'createdAt', align: 'center', width: 200, key: 'createdAt' },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      width: 100,
      render(_, record) {
        return (
          <Space size={0}>
            <Button icon={<EyeOutlined />} size="small" type="link" onClick={() => handlePreview(record)}>
              预览
            </Button>
            <Button icon={<EditOutlined />} size="small" type="link" onClick={() => handleUpdate(record)}>
              编辑
            </Button>
            <Button icon={<DeleteOutlined />} size="small" type="link" danger onClick={() => handleDelete(record.id)}>
              删除
            </Button>
          </Space>
        );
      }
    }
  ];

  const handleCreate = () => {
    articleRef.current.open('create');
  };
  const handleUpdate = (record: Api.ResourceManage.Article) => {
    articleRef.current.open('edit', record);
  };
  // 批量移动
  const handleBatchMove = () => {
    moveArticleRef.current.open('create', ids);
  };
  // 批量排序
  const handleSort = async () => {
    const sortList = tableProps.dataSource.map((item) => {
      return {
        id: item.id,
        value: sortForm.getFieldValue(item.id) !== undefined ? sortForm.getFieldValue(item.id) : item.sort
      };
    });

    if (sortList.length) {
      await fetchSortArticle({ sort: sortList });
      message.success('排序成功');
    }
  };
  // 删除操作
  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '删除确认',
      content: '确认删除该文章吗?',
      async onOk() {
        await fetchDeleteArticle({ ids: [id] });
        message.success('删除成功');
        refresh();
      }
    });
  };
  // 批量删除操作
  const handleBatchDelete = () => {
    Modal.confirm({
      title: '批量删除确认',
      content: <span>确认批量删除选中的文章吗？</span>,
      async onOk() {
        await fetchDeleteArticle({ ids });
        message.success('删除成功');
        setIds([]);
        refresh();
      }
    });
  };

  // 更改状态
  const handleStatusChange = (record: Api.ResourceManage.Article) => {
    const statusText = record.status == 0 ? '显示' : '隐藏';
    Modal.confirm({
      title: '更新确认',
      content: `确认${statusText}此文章吗?`,
      async onOk() {
        await fetchSetArticleStatus({ ids: [record.id], status: record.status == 0 ? 1 : 0 });
        message.success(statusText + `成功`);
        refresh();
      },
      onCancel() {}
    });
  };
  const handlePreview = (record: Api.ResourceManage.Article) => {
    Modal.confirm({
      width: '80%',
      content: <ArticleViewer article={record} />,
      icon: null, // 可选：不显示默认 icon
      okText: '关闭',
      cancelButtonProps: { style: { display: 'none' } } // 只保留一个“关闭”按钮
    });
  };

  // 点击选中的分类获筛选取相应文章列表
  const onTreeSelect = (selectedKeys: React.Key[]) => {
    form.setFieldsValue({ categoryId: selectedKeys[0] });
    search.submit();
  };

  const handleCreateCategory = async (key: React.Key, value: string) => {
    await fetchCreateCategory({ parentId: Number(key), name: value, status: 1 });
    message.success('创建成功');
    await getCategoryList();
  };

  const handleUpdateCategory = async (pid: React.Key, node: Api.ResourceManage.CategoryNodes, value: string) => {
    await fetchUpdateCategory({
      parentId: Number(pid),
      id: node.id,
      name: value,
      status: node.status // ✅ 直接用 node.status
    });
    message.success('更新成功');
    await getCategoryList();
  };

  const handleStatusCategory = async (key: React.Key) => {
    await fetchStatusCategory({ id: Number(key) });
    message.success('更新成功');
    await getCategoryList();
  };
  const handleDelCategory = async (key: React.Key) => {
    await fetchDeleteCategory({ id: Number(key) });
    message.success('删除成功');
    await getCategoryList();
  };

  return (
    <Row gutter={6}>
      <Col span={3}>
        <Card
          title="分类"
          style={{ height: '100%' }}
          extra={<FolderAddOutlined style={{ fontSize: '16px', color: '#1890ff' }} onClick={() => treeRef.current?.addRootNode()} />}
        >
          <BasicTree
            ref={treeRef}
            treeDataFromOutside={categoryList}
            fieldNames={{ key: 'id', title: 'name', children: 'child' }}
            onCreate={handleCreateCategory}
            onUpdate={handleUpdateCategory}
            onDelete={handleDelCategory}
            onSelect={onTreeSelect}
            onStatus={handleStatusCategory}
          />
        </Card>
      </Col>
      <Col span={21}>
        <Form className="search-form" layout="inline" form={form}>
          <Form.Item name="keywords" label="文章名称">
            <Input style={{ width: 300 }} placeholder="请输入文章ID/名称搜索" allowClear></Input>
          </Form.Item>
          <Form.Item hidden name="categoryId">
            <Input />
          </Form.Item>
          <Form.Item name="status" label="文章状态">
            <Select style={{ width: 130 }} placeholder="选择文章状态" allowClear>
              <Select.Option value={1}>显示</Select.Option>
              <Select.Option value={0}>隐藏</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" onClick={search.submit}>
                搜索
              </Button>
              <Button type="default" onClick={search.reset}>
                重置
              </Button>
            </Space>
          </Form.Item>
        </Form>
        <div className="base-table">
          <div className="header-wrapper">
            <div className="title">文章列表</div>
            <div className="action">
              <Button type="primary" onClick={handleCreate}>
                <PlusOutlined /> 新增
              </Button>
              <Button type="default" onClick={handleSort}>
                <OrderedListOutlined />
                批量排序
              </Button>
              <Button type="default" onClick={() => handleBatchMove()} disabled={ids.length <= 0}>
                <TruckOutlined />
                批量移动
              </Button>
              <Button type="default" danger onClick={handleBatchDelete} disabled={ids.length <= 0}>
                <DeleteOutlined /> 批量删除
              </Button>
            </div>
          </div>
          <Form form={sortForm}>
            <Table
              rowKey="id"
              rowSelection={{
                type: 'checkbox',
                selectedRowKeys: ids,
                onChange(selectedRowKeys) {
                  setIds(selectedRowKeys as number[]);
                }
              }}
              columns={columns}
              {...tableProps}
              pagination={{
                ...tableProps.pagination,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 条`
              }}
            />
          </Form>
        </div>
        <OperateArticle mRef={articleRef} update={refresh} />
        <MoveArticle
          mRef={moveArticleRef}
          update={() => {
            setIds([]);
            refresh();
          }}
        />
      </Col>
    </Row>
  );
}
