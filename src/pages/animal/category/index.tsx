import { DeleteOutlined, EditOutlined, OrderedListOutlined, PlusOutlined } from '@ant-design/icons';
import { useAntdTable } from 'ahooks';
import { Button, Table, Space, Modal, message, Switch, Form, InputNumber, Input, Select, Image } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { ColumnsType } from 'antd/es/table';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { fetchGetCategory, fetchDeleteCategory, fetchSortCategory, fetchSetCategoryStatus } from '@/api/animal';
import errorImg from '@/assets/images/image-error.png';
import { getImageUrl } from '@/utils';

import OperateCategory from './OperateCategory';
export default function CategoryList() {
  const [form] = useForm();
  const [sortForm] = useForm();
  const navigate = useNavigate();
  const categoryRef = useRef<{
    open: (type: ModalProp.OperateAction, data?: Api.AnimalManger.AnimalCategory) => void;
  }>();

  const getTableData = ({ current, pageSize }: { current: number; pageSize: number }, formData: Api.Common.SearchParams) => {
    return fetchGetCategory({
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

  const columns: ColumnsType<Api.AnimalManger.AnimalCategory> = [
    {
      title: '排序',
      dataIndex: 'sort',
      width: 100,
      key: 'sort',
      render: (_, record) => (
        <Form.Item name={record.id} initialValue={record.sort} style={{ margin: 0 }}>
          <InputNumber min={0} style={{ width: '80px', fontSize: '14px' }} />
        </Form.Item>
      )
    },
    { title: 'ID', dataIndex: 'id', key: 'id', width: 100 },
    {
      title: '分类封面',
      dataIndex: 'thumb',
      key: 'thumb',
      fixed: 'left',
      align: 'center',
      render: (_, record) => <Image style={{ borderRadius: '5%', backgroundColor: '#2F5257' }} width={75} src={getImageUrl(record.thumb)} fallback={errorImg} />
    },
    { title: '分类名称', dataIndex: 'name', key: 'name' },
    {
      title: '资源统计',
      dataIndex: 'count',
      key: 'count',
      render: (_, record) => (
        <Button type="link" onClick={() => navigate(`/animal/animal?categoryId=${record.id}`)}>
          {record.count}
        </Button>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (_, record) => (
        <Switch checkedChildren="显示" unCheckedChildren="隐藏" checked={record.status === 1} onChange={() => handleStatusChange(record)} />
      )
    },
    {
      title: '操作',
      key: 'action',
      render(_, record) {
        return (
          <Space size={0}>
            <Button type="link" onClick={() => handleUpdate(record)}>
              <EditOutlined /> 编辑
            </Button>
            <Button type="link" danger onClick={() => handleDelete(record)}>
              <DeleteOutlined /> 删除
            </Button>
          </Space>
        );
      }
    }
  ];

  const handleCreate = () => {
    categoryRef.current?.open('create');
  };
  const handleUpdate = (record: Api.AnimalManger.AnimalCategory) => {
    categoryRef.current?.open('edit', record);
  };
  const handleDelete = (id: Api.Common.IDParams) => {
    Modal.confirm({
      title: '删除确认',
      content: '确认删除该分类吗?',
      async onOk() {
        await fetchDeleteCategory(id);
        message.success('删除成功');
        refresh();
      }
    });
  };

  // 更改分类状态
  const handleStatusChange = (record: Api.AnimalManger.AnimalCategory) => {
    const statusText = record.status == 0 ? '显示' : '隐藏';
    Modal.confirm({
      title: '更新确认',
      content: `确认${statusText}此分类吗?`,
      async onOk() {
        await fetchSetCategoryStatus({ id: record.id });
        message.success(statusText + `成功`);
        refresh();
      },
      onCancel() {}
    });
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
      await fetchSortCategory({ sort: sortList });
      message.success('排序成功');
    }
  };

  return (
    <>
      <Form className="search-form" layout="inline" form={form}>
        <Form.Item name="keywords" label="分类名称">
          <Input style={{ width: 300 }} placeholder="请输入分类ID/名称搜索" allowClear></Input>
        </Form.Item>
        <Form.Item name="status" label="分类状态">
          <Select style={{ width: 130 }} placeholder="选择分类状态" allowClear>
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
        <Form form={sortForm}>
          <div className="header-wrapper">
            <div className="title">分类列表</div>
            <div className="action">
              <Button type="primary" onClick={handleCreate}>
                <PlusOutlined /> 新增
              </Button>
              <Button type="default" onClick={handleSort}>
                <OrderedListOutlined />
                批量排序
              </Button>
            </div>
          </div>
          <Table
            rowKey="id"
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
      <OperateCategory mRef={categoryRef} update={refresh} />
    </>
  );
}
