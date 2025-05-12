import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Select, Space, Switch, Table, Tag, message } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { ColumnsType } from 'antd/es/table';
import { useEffect, useRef, useState } from 'react';

import { fetchGetMenuList, fetchDeleteMenu, fetchSetMenuStatus } from '@/api/menu';

import OperateMenu from './OperateMenu';

export default function MenuList() {
  const [form] = useForm();
  const [data, setData] = useState<Api.SystemManage.Menu[]>([]);

  // 修改后：
  const menuRef = useRef<{
    open: (
      type: ModalProp.OperateAction,
      data?: Api.SystemManage.MenuUpdate | { parentId?: number; sort?: number },
    ) => void;
  }>({
    open: () => {
      // 可选：可留空或抛出错误提示未实现
    },
  });

  useEffect(() => {
    getMenuList();
  }, []);

  // 获取菜单列表
  const getMenuList = async () => {
    const data = await fetchGetMenuList(form.getFieldsValue());
    setData(data.list);
  };

  // 重置搜索框
  const handleReset = () => {
    form.resetFields();
  };

  // 创建方法
  const handleCreate = () => {
    menuRef.current?.open('create', {
      sort: data.length,
    });
  };

  // 创建子菜单
  const handleSubCreate = (record: Api.SystemManage.Menu) => {
    menuRef.current?.open('create', { parentId: record.id, sort: record.child?.length ?? 0 });
  };

  // 编辑菜单
  const handleUpdate = (record: Api.SystemManage.Menu) => {
    menuRef.current?.open('edit', record);
  };

  // 删除操作
  const handleDelete = (record: Api.SystemManage.Menu) => {
    const text = record.type == 0 ? '菜单' : '按钮';
    Modal.confirm({
      title: '删除确认',
      content: `确认删除该${text}吗?`,
      async onOk() {
        await fetchDeleteMenu({ id: record.id });
        message.success('删除成功');
        getMenuList();
      },
    });
  };

  // 更改菜单状态
  const handleStatusChange = (record: Api.SystemManage.Menu) => {
    const typeText = record.type == 0 ? '菜单' : '按钮';
    const statusText = record.status == 0 ? '启用' : '停用';
    Modal.confirm({
      title: '更新确认',
      content: `确认${statusText}此${typeText}吗?`,
      async onOk() {
        await fetchSetMenuStatus({ id: record.id });
        message.success(statusText + typeText + `成功`);
        getMenuList();
      },
      onCancel() {},
    });
  };

  const columns: ColumnsType<Api.SystemManage.Menu> = [
    {
      title: '菜单名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '菜单图标',
      dataIndex: 'icon',
      key: 'icon',
      align: 'center',
    },
    {
      title: '菜单类型',
      dataIndex: 'type',
      key: 'type',
      align: 'center',
      render(type: number) {
        return {
          0: <Tag color="processing">菜单</Tag>,
          1: <Tag color="default">按钮</Tag>,
          2: <Tag color="success">页面</Tag>,
        }[type];
      },
    },
    {
      title: '权限标识',
      dataIndex: 'permission',
      key: 'permission',
      align: 'center',
    },
    {
      title: '路由地址',
      dataIndex: 'path',
      key: 'path',
      align: 'center',
    },
    {
      title: '组件名称',
      dataIndex: 'component',
      key: 'component',
      align: 'center',
    },
    {
      title: '菜单状态',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render(_, record) {
        return (
          <Switch
            checkedChildren="启用"
            unCheckedChildren="停用"
            checked={record.status === 1}
            onChange={() => handleStatusChange(record)}
          />
        );
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      align: 'center',
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      align: 'center',
      render(_, record) {
        return (
          <Space size={0}>
            <Button type="link" onClick={() => handleSubCreate(record)}>
              <PlusOutlined />
              新增
            </Button>
            <Button type="link" onClick={() => handleUpdate(record)}>
              <EditOutlined /> 编辑
            </Button>
            <Button type="link" danger onClick={() => handleDelete(record)}>
              <DeleteOutlined /> 删除
            </Button>
          </Space>
        );
      },
    },
  ];

  return (
    <div>
      <Form className="search-form" layout="inline" form={form}>
        <Form.Item label="菜单名称" name="keywords">
          <Input placeholder="请输入菜单名称" allowClear />
        </Form.Item>
        <Form.Item label="菜单状态" name="status">
          <Select style={{ width: 120 }} placeholder="菜单状态" allowClear>
            <Select.Option value={1}>正常</Select.Option>
            <Select.Option value={0}>停用</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" className="mr10" onClick={getMenuList}>
            搜索
          </Button>
          <Button type="default" onClick={handleReset}>
            重置
          </Button>
        </Form.Item>
      </Form>
      <div className="base-table">
        <div className="header-wrapper">
          <div className="title">菜单列表</div>
          <div className="action">
            <Button type="primary" onClick={handleCreate}>
              <PlusOutlined />
              新增
            </Button>
          </div>
        </div>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={data}
          pagination={false}
          expandable={{ childrenColumnName: 'child' }}
        />
        <OperateMenu mRef={menuRef} update={getMenuList} />
      </div>
    </div>
  );
}
