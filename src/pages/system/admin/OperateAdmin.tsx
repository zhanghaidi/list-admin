import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Modal, message } from 'antd';
import { Form, Input, Select, Upload } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useImperativeHandle, useState } from 'react';

import { fetchCreateAdmin, fetchUpdateAdmin } from '@/api/admin';
import { fetchUpload } from '@/api/upload';
import { getImageUrl } from '@/utils';

import type { RcFile } from 'antd/es/upload/interface';

export default function OperateAdmin(props: ModalProp.OperateModalProp<Api.SystemManage.Admin>) {
  const [form] = useForm();
  const [visible, setVisible] = useState(false);
  const [action, setAction] = useState<ModalProp.OperateAction>('create');
  const [loading, setLoading] = useState(false);
  const [img, setImg] = useState<string | undefined>();
  const [roles, setRoles] = useState<Api.SystemManage.Role[]>([]);
  // 暴露子组件open方法
  useImperativeHandle(props.mRef, () => {
    return { open };
  });

  // 调用弹框显示方法
  const open = (type: ModalProp.OperateAction, data?: ModalProp.AdminProp) => {
    setAction(type);
    setVisible(true);
    if (data) {
      setRoles(data.roles);
      if (type === 'edit' && data.admin) {
        form.setFieldsValue(data.admin);
        form.setFieldValue('roleId', data.admin.roleId);
        setImg(data.admin.avatar);
      }
    }
  };

  // 用户创建/更新表单提交
  const handleSubmit = async () => {
    const valid = await form.validateFields();
    if (valid) {
      const params = { ...form.getFieldsValue(), avatar: img };
      if (action === 'create') {
        await fetchCreateAdmin(params);
        message.success('创建成功');
      } else {
        await fetchUpdateAdmin(params);
        message.success('修改成功');
      }
      handleCancel();
      props.update();
    }
  };

  // 取消
  const handleCancel = () => {
    setVisible(false);
    setImg('');
    form.resetFields();
  };

  // 上传之前接口处理
  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('只能上传png或jpeg格式的图片');
      return false;
    }
    const isLt1M = file.size / 1024 / 1024 < 1;
    if (!isLt1M) {
      message.error('图片不能超过1M');
    }
    return isJpgOrPng && isLt1M;
  };

  // 自定义上传操作
  const handleUpload = async (file: any) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('module', 'avatar');
    formData.append('type', 'images');
    formData.append('file', file.file);
    try {
      const res = await fetchUpload(formData);
      setImg(res.path);
      setLoading(false);
    } catch (e) {
      message.error('上传失败:' + e);
      setLoading(false);
    }
  };
  return (
    <Modal
      title={action === 'create' ? '创建管理员' : '编辑管理员'}
      width={800}
      open={visible}
      okText="确定"
      cancelText="取消"
      onOk={handleSubmit}
      onCancel={handleCancel}
    >
      <Form className="modal-from" form={form} labelCol={{ span: 4 }} labelAlign="right">
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>
        <Form.Item
          label="用户账号"
          name="username"
          rules={[
            { required: true, message: '请输入用户账号' },
            { min: 2, max: 20, message: '用户名称最小2个字符，最大20个字符' }
          ]}
        >
          <Input placeholder="请输入用户账号"></Input>
        </Form.Item>
        <Form.Item label="用户密码" name="password" rules={action === 'edit' ? [] : [{ required: true, message: '请输入用户密码' }]}>
          <Input.Password placeholder="请输入密码" />
        </Form.Item>
        <Form.Item label="真实姓名" name="realName" rules={[{ required: true, message: '请输入真实姓名' }]}>
          <Input placeholder="请输入用户真实姓名" />
        </Form.Item>
        <Form.Item
          label="手机号"
          name="mobile"
          rules={[
            { len: 11, message: '请输入11位手机号' },
            { pattern: /1[1-9]\d{9}/, message: '请输入1开头的11位手机号' }
          ]}
        >
          <Input type="number" placeholder="请输入手机号" />
        </Form.Item>

        <Form.Item label="系统角色" name="roleId" rules={[{ required: true, message: '请选择角色' }]}>
          <Select placeholder="请选择角色">
            {roles.map((role) => {
              return (
                <Select.Option value={role.id} key={role.id}>
                  {role.name}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item label="用户头像">
          <Upload name="avatar" listType="picture-circle" showUploadList={false} customRequest={handleUpload} beforeUpload={beforeUpload}>
            {img ? (
              <img src={getImageUrl(img)} style={{ width: '100%', height: '100%', borderRadius: '100%' }} />
            ) : (
              <div>
                {loading ? <LoadingOutlined /> : <PlusOutlined />}
                <div style={{ marginTop: 5 }}>上传头像</div>
              </div>
            )}
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
}
