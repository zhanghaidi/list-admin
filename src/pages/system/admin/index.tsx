import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useAntdTable } from 'ahooks';
import { Button, Form, Input, Modal, Select, Space, Switch, Table, Tag, message } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useEffect, useRef, useState } from 'react';

import { fetchDeleteAdmin, fetchGetAdminList, fetchSetAdminStatus } from '@/api/admin';
import { fetchGetRoleList } from '@/api/role';
import UserAvatarNickname from '@/components/UserAvatarNickname';
import { getImageUrl } from '@/utils';

import OperateAdmin from './OperateAdmin';

export default function AdminList() {
  const [form] = Form.useForm();
  const [roleList, setRoleList] = useState<Api.SystemManage.Role[]>([]);
  useEffect(() => {
    getRoleList();
  }, []);
  // 获取角色列表
  const getRoleList = async () => {
    const list = await fetchGetRoleList();
    setRoleList(list.list);
  };

  // 自定义Ref
  const adminRef = useRef<{
    open: (type: ModalProp.OperateAction, data?: ModalProp.AdminProp) => void;
  }>({
    open: () => {},
  });
  // 表格数据
  const getTableData = (
    { current, pageSize }: { current: number; pageSize: number },
    formData: Api.Common.SearchParams,
  ) => {
    return fetchGetAdminList({
      ...formData,
      page: current,
      pageSize: pageSize,
    }).then((data) => {
      return { total: data.total, list: data.list };
    });
  };
  const { tableProps, search, refresh } = useAntdTable(getTableData, { form });
  const handleCreate = () => {
    adminRef.current?.open('create', { roles: roleList });
  };
  const handleUpdate = (record: Api.SystemManage.Admin) => {
    adminRef.current?.open('edit', { admin: record, roles: roleList });
  };
  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '删除确认',
      content: <span>确认删除该管理员吗？</span>,
      async onOk() {
        await fetchDeleteAdmin({ id });
        message.success('删除成功');
        refresh();
      },
    });
  };

  // 更改用户状态
  const handleStatusChange = (record: Api.SystemManage.Admin) => {
    const statusText = record.enable == 0 ? '启用' : '禁用';
    Modal.confirm({
      title: '更新确认',
      content: `确认${statusText}此管理员用户吗?`,
      async onOk() {
        await fetchSetAdminStatus({ id: record.id });
        message.success(statusText + `成功`);
        refresh();
      },
      onCancel() {},
    });
  };

  const columns: ColumnsType<Api.SystemManage.Admin> = [
    {
      title: '用户ID',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
    },
    {
      title: '头像昵称',
      dataIndex: 'nickName',
      key: 'nickName',
      align: 'center',
      render: (_, record) => <UserAvatarNickname avatar={getImageUrl(record.avatar)} nickName={record.nickName} />,
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      align: 'center',
    },
    {
      title: '姓名',
      dataIndex: 'realName',
      key: 'realName',
      align: 'center',
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
      key: 'mobile',
      align: 'center',
    },
    {
      title: '用户角色',
      dataIndex: 'role',
      key: 'role',
      align: 'center',
      render: (role: Api.SystemManage.Role) => (
        <Tag color="processing" key={role.id}>
          {role.name}
        </Tag>
      ),
    },
    {
      title: '注册时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      align: 'center',
    },
    {
      title: '用户状态',
      dataIndex: 'enable',
      key: 'enable',
      align: 'center',
      render(_, record) {
        return (
          <Switch
            checkedChildren="启用"
            unCheckedChildren="禁用"
            checked={record.enable === 1}
            onChange={() => handleStatusChange(record)}
          />
        );
      },
    },
    {
      title: '操作',
      key: 'address',
      align: 'center',
      render(record: Api.SystemManage.Admin) {
        return (
          <Space size={0}>
            <Button type="link" onClick={() => handleUpdate(record)}>
              <EditOutlined /> 编辑
            </Button>
            <Button type="link" danger onClick={() => handleDelete(record.id)}>
              <DeleteOutlined /> 删除
            </Button>
          </Space>
        );
      },
    },
  ];
  return (
    <div>
      <Form className="search-form" form={form} layout="inline">
        <Form.Item name="keywords" label="用户名称">
          <Input style={{ width: 300 }} placeholder="请输入ID/账号/昵称/手机号搜索" allowClear />
        </Form.Item>
        <Form.Item label="系统角色" name="roleId">
          <Select style={{ width: 150 }} placeholder="请选择角色" allowClear>
            {roleList.map((item) => {
              return (
                <Select.Option value={item.id} key={item.id}>
                  {item.name}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item name="status" label="状态">
          <Select style={{ width: 120 }} placeholder="用户状态" allowClear>
            <Select.Option value={0}>禁用</Select.Option>
            <Select.Option value={1}>启用</Select.Option>
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
          <div className="title">管理员列表</div>
          <div className="action">
            <Button type="primary" onClick={handleCreate}>
              <PlusOutlined /> 新增
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
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </div>
      <OperateAdmin mRef={adminRef} update={refresh} />
    </div>
  );
}
