import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  FileSearchOutlined,
  FolderAddOutlined,
  OrderedListOutlined,
  PlusOutlined,
  QrcodeOutlined,
  TruckOutlined,
} from '@ant-design/icons';
import { useAntdTable } from 'ahooks';
import {
  Button,
  Table,
  Form,
  Input,
  Space,
  Modal,
  message,
  Image,
  Select,
  Switch,
  QRCode,
  Typography,
  InputNumber,
  Card,
  Col,
  Row,
} from 'antd';
import { useForm } from 'antd/es/form/Form';
import { ColumnsType } from 'antd/es/table';
import React, { useEffect, useRef, useState } from 'react';

import {
  fetchGetCategory,
  fetchCreateCategory,
  fetchUpdateCategory,
  fetchDeleteCategory,
  fetchStatusCategory,
  fetchGetSliceList,
  fetchDeleteSlice,
  fetchSetSliceStatus,
  fetchCopySlice,
  fetchSortSlice,
} from '@/api/slice';
import errorImg from '@/assets/images/image-error.png';
import BasicTree, { BasicTreeRef } from '@/components/CategoryTree/BasicTree';
import { getImageUrl } from '@/utils';

import MoveSlice from './MoveSlice';
import OperateSlice from './OperateSlice';

export default function SliceList() {
  const [form] = useForm();
  const [sortForm] = useForm();

  const [ids, setIds] = useState<number[]>([]);
  const treeRef = useRef<BasicTreeRef>(null);
  const sliceRef = useRef<{ open: (type: ModalProp.OperateAction, data?: Api.ResourceManage.Slice) => void }>({
    open: () => {},
  });
  const moveSliceRef = useRef<{ open: (type: ModalProp.OperateAction, data: number[]) => void }>({
    open: () => {},
  });
  const [categoryList, setCategoryList] = useState<Api.ResourceManage.CategoryNodes[]>([]);
  useEffect(() => {
    getCategoryList();
  }, []);

  // 获取分类列表
  const getCategoryList = async (keywords?: string) => {
    const res = await fetchGetCategory({ keywords: keywords });
    setCategoryList(res.list);
  };

  const getTableData = (
    { current, pageSize }: { current: number; pageSize: number },
    formData: Api.Common.SearchParams,
  ) => {
    return fetchGetSliceList({
      ...formData,
      page: current,
      pageSize: pageSize,
    }).then((data) => {
      return {
        total: data.total,
        list: data.list,
      };
    });
  };
  const { tableProps, search, refresh } = useAntdTable(getTableData, {
    form,
    defaultPageSize: 10,
  });

  const columns: ColumnsType<Api.ResourceManage.Slice> = [
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
      ),
    },
    {
      title: '序号',
      key: 'index',
      align: 'center',
      width: 80,
      render: (_: any, __: Api.ResourceManage.Slice, index: number) =>
        (tableProps.pagination.current - 1) * tableProps.pagination.pageSize + index + 1,
    },
    { title: 'ID', dataIndex: 'id', key: 'id', fixed: 'left', width: 100, align: 'center' },
    {
      title: '切片封面',
      dataIndex: 'thumb',
      key: 'thumb',
      fixed: 'left',
      width: 100,
      align: 'center',
      render: (_, record) => (
        <Image style={{ borderRadius: '5%' }} width={55} src={getImageUrl(record.thumb)} fallback={errorImg} />
      ),
    },
    {
      title: '切片标题',
      dataIndex: 'title',
      key: 'title',
      width: 200,
      align: 'center',
      fixed: 'left',
    },
    {
      title: '所属分类',
      dataIndex: 'categoryPath',
      key: 'categoryPath',
      width: 150,
      align: 'center',
      render(_, record) {
        return record.categoryPath;
      },
    },
    {
      title: '切片状态',
      width: 100,
      align: 'center',
      dataIndex: 'status',
      render(_, record) {
        return (
          <Switch
            checkedChildren="上架"
            unCheckedChildren="下架"
            checked={record.status === 1}
            onChange={() => handleStatusChange(record)}
          />
        );
      },
    },
    {
      title: '切片路径',
      dataIndex: 'scene',
      key: 'scene',
      width: 150,
      align: 'center',
    },
    {
      title: '切片尺寸',
      dataIndex: 'size',
      key: 'size',
      width: 120,
      align: 'center',
    },

    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 150, align: 'center' },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      align: 'center',
      width: 425,
      render(_, record) {
        return (
          <Space size={0}>
            <Button icon={<EyeOutlined />} size="small" type="link" onClick={() => handlePreview(record)}>
              预览
            </Button>
            <Button icon={<FileSearchOutlined />} size="small" type="link" onClick={() => handleInfo(record)}>
              信息
            </Button>
            <Button icon={<EditOutlined />} size="small" type="link" onClick={() => handleUpdate(record)}>
              编辑
            </Button>
            <Button icon={<CopyOutlined />} size="small" type="link" onClick={() => handleCopy(record)}>
              复制
            </Button>
            <Button icon={<QrcodeOutlined />} size="small" type="link" onClick={() => handleQrcode(record)}>
              二维码
            </Button>
            <Button icon={<DeleteOutlined />} size="small" type="link" danger onClick={() => handleDelete(record.id)}>
              删除
            </Button>
          </Space>
        );
      },
    },
  ];

  const handleCreate = () => {
    sliceRef.current?.open('create');
  };
  // 切片标注编辑操作
  const handleUpdate = (record: Api.ResourceManage.Slice) => {
    window.open(`${window.location.origin}${window.location.pathname}#/editor/slice/${record.id}`, '_blank');
  };
  // 切片查看预览
  const handlePreview = (record: Api.ResourceManage.Slice) => {
    window.open(`${window.location.origin}${window.location.pathname}#/editor/slice/${record.id}`, '_blank');
  };
  // 批量移动
  const handleBatchMove = () => {
    moveSliceRef.current?.open('create', ids);
  };
  // 批量排序
  const handleSort = async () => {
    const sortList = tableProps.dataSource.map((item) => {
      return {
        id: item.id,
        value: sortForm.getFieldValue(item.id) !== undefined ? sortForm.getFieldValue(item.id) : item.sort,
      };
    });

    if (sortList.length) {
      await fetchSortSlice({ sort: sortList });
      message.success('排序成功');
    }
  };
  // 删除操作
  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '删除确认',
      content: '确认删除该切片吗?',
      async onOk() {
        await fetchDeleteSlice({ ids: [id] });
        message.success('删除成功');
        refresh();
      },
    });
  };
  // 批量删除操作
  const handleBatchDelete = () => {
    Modal.confirm({
      title: '批量删除确认',
      content: <span>确认批量删除选中的切片吗？</span>,
      async onOk() {
        await fetchDeleteSlice({ ids });
        message.success('删除成功');
        setIds([]);
        refresh();
      },
    });
  };
  // 批量设置状态操作
  const handleBatchSetStatus = (status: number) => {
    const statusText = status == 0 ? '批量上架' : '批量下架';
    Modal.confirm({
      title: '批量更改状态',
      content: status === 1 ? '确认批量上架选中切片吗?' : '确认批量下架选中切片吗?',
      async onOk() {
        await fetchSetSliceStatus({ ids, status });
        message.success(statusText + '成功');
        setIds([]);
        refresh();
      },
    });
  };
  // 更改状态
  const handleStatusChange = (record: Api.ResourceManage.Slice) => {
    const statusText = record.status == 0 ? '上架' : '下架';
    Modal.confirm({
      title: '更新确认',
      content: `确认${statusText}此切片吗?`,
      async onOk() {
        await fetchSetSliceStatus({ ids: [record.id], status: record.status == 0 ? 1 : 0 });
        message.success(statusText + `成功`);
        refresh();
      },
      onCancel() {},
    });
  };

  // 信息编辑
  const handleInfo = (record: Api.ResourceManage.Slice) => {
    sliceRef.current?.open('edit', record);
  };
  // 复制
  const handleCopy = (record: Api.ResourceManage.Slice) => {
    Modal.confirm({
      title: '复制确认',
      content: `确认复制此切片吗?`,
      async onOk() {
        await fetchCopySlice({ id: record.id });
        message.success(`复制${record.title}成功`);
        refresh();
      },
      onCancel() {},
    });
  };

  // 二维码
  const handleQrcode = (record: Api.ResourceManage.Slice) => {
    Modal.info({
      title: `${record.title}`,
      content: (
        <Space align="center" direction="vertical">
          <div>
            <QRCode
              errorLevel="H"
              size={200}
              value={`${import.meta.env.VITE_WEBSITE_BASE_URL}/web/external/slice/${record.id}`}
              icon={getImageUrl(record.thumb)}
            />
          </div>
          <div>
            <Typography.Paragraph
              copyable
            >{`${import.meta.env.VITE_WEBSITE_BASE_URL}/web/external/slice/${record.id}`}</Typography.Paragraph>
          </div>
        </Space>
      ),
    });
  };

  // 点击选中的分类获筛选取相应切片列表
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
      status: node.status, // ✅ 直接用 node.status
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
          extra={
            <FolderAddOutlined
              style={{ fontSize: '16px', color: '#1890ff' }}
              onClick={() => treeRef.current?.addRootNode()}
            />
          }
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
          <Form.Item name="keywords" label="切片名称">
            <Input style={{ width: 300 }} placeholder="请输入切片ID/名称搜索" allowClear></Input>
          </Form.Item>
          <Form.Item hidden name="categoryId">
            <Input />
          </Form.Item>
          <Form.Item name="status" label="切片状态">
            <Select style={{ width: 130 }} placeholder="选择切片状态" allowClear>
              <Select.Option value={0}>下架</Select.Option>
              <Select.Option value={1}>上架</Select.Option>
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
            <div className="title">切片列表</div>
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
                },
              }}
              columns={columns}
              {...tableProps}
              pagination={{
                ...tableProps.pagination,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 条`,
              }}
              scroll={{ x: 2000 }}
            />
          </Form>
        </div>
        <OperateSlice mRef={sliceRef} update={refresh} />
        <MoveSlice
          mRef={moveSliceRef}
          update={() => {
            setIds([]);
            refresh();
          }}
        />
      </Col>
    </Row>
  );
}
