import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  FolderAddOutlined,
  OrderedListOutlined,
  PlusOutlined,
  QrcodeOutlined,
  TruckOutlined
} from '@ant-design/icons';
import { useAntdTable } from 'ahooks';
import { Button, Table, Form, Input, Space, Modal, message, Image, Select, Switch, InputNumber, Card, Col, Row, QRCode, Typography, Badge, Tag } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { ColumnsType } from 'antd/es/table';
import React, { useEffect, useRef, useState } from 'react';

import {
  fetchGetSportList,
  fetchDeleteSport,
  fetchGetCategory,
  fetchSetSportStatus,
  fetchSortSport,
  fetchCreateCategory,
  fetchUpdateCategory,
  fetchStatusCategory,
  fetchDeleteCategory
} from '@/api/sport';
import errorImg from '@/assets/images/image-error.png';
import BasicTree, { BasicTreeRef } from '@/components/CategoryTree/BasicTree';
import { getImageUrl } from '@/utils';

import MoveSport from './MoveSport';
import OperateSport from './OperateSport';
import Preview from './Preview';

export default function SportList() {
  const [form] = useForm();
  const [sortForm] = useForm();
  const [categoryList, setCategoryList] = useState<Api.ResourceManage.CategoryNodes[]>([]);
  const [ids, setIds] = useState<number[]>([]);
  const sportRef = useRef<{ open: (type: ModalProp.OperateAction, data?: Api.ResourceManage.Sport) => void }>({
    open: () => {}
  });
  const moveSportRef = useRef<{ open: (type: ModalProp.OperateAction, data: number[]) => void }>({
    open: () => {}
  });
  const previewRef = useRef<{ open: (type: ModalProp.OperateAction, data: Api.ResourceManage.Sport) => void }>({
    open: () => {}
  });
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
    return fetchGetSportList({
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

  const columns: ColumnsType<Api.ResourceManage.Sport> = [
    {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
      width: 80,
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
      width: 50,
      render: (_: any, __: Api.ResourceManage.Sport, index: number) => (tableProps.pagination.current - 1) * tableProps.pagination.pageSize + index + 1
    },
    { title: 'ID', dataIndex: 'id', align: 'center', key: 'id', fixed: 'left', width: 80 },
    {
      title: '封面图',
      dataIndex: 'thumb',
      key: 'thumb',
      align: 'center',
      fixed: 'left',
      width: 80,
      render: (_, record) => <Image style={{ borderRadius: '5%' }} width={75} src={getImageUrl(record.thumb)} fallback={errorImg} />
    },
    {
      title: '标题',
      dataIndex: 'title',
      width: 100,
      key: 'title',
      align: 'center',
      fixed: 'left'
    },
    {
      title: '所属分类',
      dataIndex: 'categoryPath',
      key: 'categoryPath',
      align: 'center',
      width: 120,
      render(_, record) {
        return record.categoryPath;
      }
    },
    {
      title: '运动单位',
      key: 'angle',
      align: 'center',
      width: 150,
      render: (_, record) => {
        if (record.unit > 0) {
          return (
            <Space size={'small'} direction="vertical">
              <Tag color="green">
                {record.start} ~ {record.end} {record.unit === 2 ? ' cm' : ' °'}
              </Tag>
              {record.joint && (
                <span>
                  <Typography.Text code>{record.joint}</Typography.Text>
                </span>
              )}
              {record.range && (
                <span>
                  <Typography.Text code>{record.range}</Typography.Text>
                </span>
              )}
            </Space>
          );
        }
        return <Tag color="red">关闭</Tag>;
      }
    },
    {
      title: '内容描述',
      dataIndex: 'content',
      align: 'center',
      width: 150,
      key: 'content',
      ellipsis: true
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 90,
      align: 'center',
      render(type: number) {
        return {
          2: <Badge status="success" text="模型" />,
          3: <Badge status="processing" text="动画" />
        }[type];
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      align: 'center',
      render(_, record) {
        return <Switch checkedChildren="显示" unCheckedChildren="隐藏" checked={record.status === 1} onChange={() => handleStatusChange(record)} />;
      }
    },

    { title: '创建时间', dataIndex: 'createdAt', align: 'center', width: 150, key: 'createdAt' },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      fixed: 'right',
      width: 200,
      render(_, record) {
        return (
          <Space size={0}>
            <Button icon={<EyeOutlined />} size="small" type="link" onClick={() => handlePreview(record)}>
              预览
            </Button>
            <Button icon={<QrcodeOutlined />} size="small" type="link" onClick={() => handleQrcode(record)}>
              二维码
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

  // 运动解剖预览
  const handlePreview = (record: Api.ResourceManage.Sport) => {
    previewRef.current?.open('edit', record);
  };
  const handleCreate = () => {
    sportRef.current?.open('create');
  };
  const handleUpdate = (record: Api.ResourceManage.Sport) => {
    sportRef.current?.open('edit', record);
  };
  // 批量移动
  const handleBatchMove = () => {
    moveSportRef.current?.open('create', ids);
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
      await fetchSortSport({ sort: sortList });
      message.success('排序成功');
    }
  };
  // 批量设置状态操作
  const handleBatchSetStatus = (status: number) => {
    const statusText = status == 0 ? '批量上架' : '批量下架';
    Modal.confirm({
      title: '批量更改状态',
      content: status === 1 ? '确认批量上架选中运动解剖吗?' : '确认批量下架选中运动解剖吗?',
      async onOk() {
        await fetchSetSportStatus({ ids, status });
        message.success(statusText + '成功');
        setIds([]);
        refresh();
      }
    });
  };
  // 删除操作
  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '删除确认',
      content: '确认删除该运动解剖吗?',
      async onOk() {
        await fetchDeleteSport({ ids: [id] });
        message.success('删除成功');
        refresh();
      }
    });
  };
  // 批量删除操作
  const handleBatchDelete = () => {
    Modal.confirm({
      title: '批量删除确认',
      content: <span>确认批量删除选中的运动解剖吗？</span>,
      async onOk() {
        await fetchDeleteSport({ ids });
        message.success('删除成功');
        setIds([]);
        refresh();
      }
    });
  };

  // 更改状态
  const handleStatusChange = (record: Api.ResourceManage.Sport) => {
    const statusText = record.status == 0 ? '显示' : '隐藏';
    Modal.confirm({
      title: '更新确认',
      content: `确认${statusText}此运动解剖吗?`,
      async onOk() {
        await fetchSetSportStatus({ ids: [record.id], status: record.status == 0 ? 1 : 0 });
        message.success(statusText + `成功`);
        refresh();
      },
      onCancel() {}
    });
  };

  // 二维码
  const handleQrcode = (record: Api.ResourceManage.Sport) => {
    Modal.info({
      title: `${record.title}`,
      content: (
        <Space align="center" direction="vertical">
          <div>
            <QRCode
              errorLevel="H"
              size={200}
              value={`${import.meta.env.VITE_WEBSITE_BASE_URL}/web/external/model/${record.id}`}
              icon={getImageUrl(record.thumb)}
            />
          </div>
          <div>
            <Typography.Paragraph copyable>{`${import.meta.env.VITE_WEBSITE_BASE_URL}/web/external/model/${record.id}`}</Typography.Paragraph>
          </div>
        </Space>
      )
    });
  };

  // 点击选中的分类获筛选取相应运动解剖列表
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
          <Form.Item name="keywords" label="运动解剖名称">
            <Input style={{ width: 300 }} placeholder="请输入运动解剖ID/名称搜索" allowClear></Input>
          </Form.Item>
          <Form.Item hidden name="categoryId">
            <Input />
          </Form.Item>
          <Form.Item name="status" label="显示状态">
            <Select style={{ width: 130 }} placeholder="选择显示状态" allowClear>
              <Select.Option value={1}>显示</Select.Option>
              <Select.Option value={0}>隐藏</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="type" label="选择类型">
            <Select style={{ width: 130 }} placeholder="选择模型类型" allowClear>
              <Select.Option value={2}>模型</Select.Option>
              <Select.Option value={3}>动画</Select.Option>
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
            <div className="title">运动解剖列表</div>
            <div className="action">
              <Button type="primary" onClick={handleCreate}>
                <PlusOutlined /> 新增
              </Button>
              <Button type="default" onClick={handleSort}>
                <OrderedListOutlined />
                批量排序
              </Button>
              <Button type="default" onClick={() => handleBatchSetStatus(1)} disabled={ids.length <= 0}>
                <CheckCircleOutlined />
                批量上架
              </Button>
              <Button type="default" onClick={() => handleBatchSetStatus(0)} disabled={ids.length <= 0}>
                <CloseCircleOutlined />
                批量下架
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
              scroll={{ x: 2000 }}
            />
          </Form>
        </div>
        <OperateSport mRef={sportRef} update={refresh} />
        <Preview mRef={previewRef} update={refresh} />
        <MoveSport
          mRef={moveSportRef}
          update={() => {
            setIds([]);
            refresh();
          }}
        />
      </Col>
    </Row>
  );
}
