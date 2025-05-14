import { Form, Input, Modal, Tree, message } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useImperativeHandle, useState } from 'react';

import { fetchGetMenuList } from '@/api/menu';
import { fetchCreateRole, fetchUpdateRole } from '@/api/role';

export default function OperateRole(props: ModalProp.OperateModalProp<Api.SystemManage.Role>) {
  const [form] = useForm();
  const [action, setAction] = useState<ModalProp.OperateAction>('create');
  const [visible, setVisible] = useState(false);
  const [menuList, setMenuList] = useState<Api.SystemManage.Menu[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<number[]>([]);
  const [permissions, setPermissions] = useState<number[]>([]);

  // 组件暴露open方法
  useImperativeHandle(props.mRef, () => ({
    open
  }));

  const getMenuList = async () => {
    const data = await fetchGetMenuList({ status: 1 });
    setMenuList(data.list);
  };

  // 打开弹框函数
  const open = (type: ModalProp.OperateAction, data?: Api.SystemManage.Role) => {
    setAction(type);
    setVisible(true);
    getMenuList();
    if (data) {
      setCheckedKeys(data.checkedKeys);
      setPermissions(data.permissions);
      form.setFieldsValue(data);
    }
  };

  // 提交表单
  const handleSubmit = async () => {
    form.setFieldValue('checkedKeys', checkedKeys);
    const valid = await form.validateFields();
    if (valid) {
      const params = { ...form.getFieldsValue(), permissions: permissions };
      if (action === 'create') {
        await fetchCreateRole(params);
      } else {
        await fetchUpdateRole(params);
      }
      message.success('操作成功');
      handleCancel();
      props.update();
    }
  };

  // 关闭和重置弹框
  const handleCancel = () => {
    setCheckedKeys([]);
    setPermissions([]);
    setVisible(false);
    form.resetFields();
  };

  const onCheck = (checkedKeysValue: any, info: any) => {
    setCheckedKeys(checkedKeysValue); // 更新选中权限保存在role表中

    const allCheckedKeys: number[] = [...checkedKeysValue, ...info.halfCheckedKeys];
    setPermissions(allCheckedKeys); // 全部权限存储在RoleMenu表中
  };

  return (
    <Modal
      title={action === 'create' ? '新增角色' : '编辑角色'}
      width={800}
      open={visible}
      okText="确定"
      cancelText="取消"
      onOk={handleSubmit}
      onCancel={handleCancel}
    >
      <Form form={form} labelAlign="right" labelCol={{ span: 4 }}>
        <Form.Item hidden name="id">
          <Input />
        </Form.Item>

        <Form.Item label="角色名称" name="name" rules={[{ required: true, message: '请输入角色名称' }]}>
          <Input placeholder="请输入角色名称" />
        </Form.Item>

        <Form.Item name="description" label="备注" rules={[{ required: true, message: '请输入备注' }]}>
          <Input.TextArea placeholder="请输入备注" />
        </Form.Item>

        <Form.Item label="权限" name="checkedKeys" rules={[{ required: true, message: '请选择权限' }]}>
          <Tree
            checkable
            fieldNames={{
              key: 'id',
              title: 'name',
              children: 'child'
            }}
            onCheck={onCheck}
            checkedKeys={checkedKeys}
            treeData={menuList}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
