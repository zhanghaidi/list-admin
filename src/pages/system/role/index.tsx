import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useAntdTable } from 'ahooks';
import { Button, Table, Form, Input, Space, Modal, message } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { ColumnsType } from 'antd/es/table';
import { useRef } from 'react';

import { fetchGetRoleList, fetchDeleteRole } from '@/api/role';

import OperateRole from './OperateRole';
export default function RoleList() {
  const [form] = useForm();
  const roleRef = useRef<{ open: (type: ModalProp.OperateAction, data?: Api.SystemManage.Role) => void }>({ open: () => {} });
  const getTableData = ({ current, pageSize }: { current: number; pageSize: number }, formData: Api.Common.SearchParams) => {
    return fetchGetRoleList({
      keywords: formData.name,
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

  const columns: ColumnsType<Api.SystemManage.Role> = [
    { title: 'ID', dataIndex: 'id', key: 'id', align: 'center' },
    { title: '角色名称', dataIndex: 'name', key: 'name', align: 'center' },
    { title: '备注', dataIndex: 'description', key: 'description', align: 'center' },
    { title: '创建时间', dataIndex: 'created_at', key: 'created_at', align: 'center' },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render(_, record) {
        return (
          <Space>
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
    roleRef.current?.open('create');
  };
  const handleUpdate = (record: Api.SystemManage.Role) => {
    roleRef.current?.open('edit', record);
  };
  const handleDelete = (id: Api.Common.IDParams) => {
    Modal.confirm({
      title: '删除确认',
      content: '确认删除该角色吗?',
      async onOk() {
        await fetchDeleteRole(id);
        message.success('删除成功');
        refresh();
      }
    });
  };

  return (
    <div>
      <Form className="search-form" layout="inline" form={form}>
        <Form.Item name="name" label="角色名称">
          <Input placeholder="请输入角色名称" allowClear />
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
          <div className="title">角色列表</div>
          <div className="action">
            <Button type="primary" onClick={handleCreate}>
              <PlusOutlined /> 新增
            </Button>
          </div>
        </div>
        <Table rowKey="id" columns={columns} {...tableProps} />
      </div>
      <OperateRole mRef={roleRef} update={refresh} />
    </div>
  );
}
