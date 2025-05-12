import { UploadOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Radio, Upload, message } from 'antd';
import { useImperativeHandle, useState } from 'react';

import { fetchSetModelGltf } from '@/api/model';

export default function OperateGltf(props: ModalProp.OperateModalProp<Api.ResourceManage.Model>) {
  const [form] = Form.useForm();
  const [action, setAction] = useState<ModalProp.OperateAction>('create');
  const [visible, setVisible] = useState(false);
  const [gltf, setGltf] = useState<File | null>(null);
  // 组件暴露open方法
  useImperativeHandle(props.mRef, () => ({
    open,
  }));

  // 打开弹框函数
  const open = (type: ModalProp.OperateAction, data: Api.ResourceManage.Model) => {
    setAction(type);
    setVisible(true);
    form.setFieldsValue(data);
  };

  // 提交表单
  const handleSubmit = async () => {
    const valid = await form.validateFields();
    if (valid) {
      const params = { ...form.getFieldsValue() };
      const formData = new FormData();
      formData.append('id', params.id);
      formData.append('isGltf', params.isGltf);
      if (params.isGltf == 1) {
        if (gltf !== null) {
          formData.append('file', gltf);
        } else {
          return message.success('请选择Gltf文件');
        }
      }
      try {
        await fetchSetModelGltf(formData);
        if (params.isGltf == 1) {
          message.success('开启Gltf成功');
        } else {
          message.success('关闭Gltf成功');
        }
        handleCancel();
        props.update();
      } catch (e) {
        message.error('请求失败:' + e);
      }
    }
  };

  // 关闭和重置弹框
  const handleCancel = () => {
    setVisible(false);
    form.resetFields();
    setGltf(null);
  };

  // 监听Upload组件的change事件
  const handleGltfChange = (info: any) => {
    if (info.file.status !== 'removed') {
      setGltf(info.file);
    }
  };

  return (
    <Modal
      title={action === 'create' ? '管理Gltf' : '管理Gltf'}
      width={800}
      open={visible}
      okText="确定"
      cancelText="取消"
      onOk={handleSubmit}
      onCancel={handleCancel}
    >
      <Form className="modal-from" form={form} labelAlign="right" labelCol={{ span: 4 }}>
        <Form.Item hidden name="id">
          <Input />
        </Form.Item>

        <Form.Item label="Gltf状态" name="isGltf" rules={[{ required: true, message: '请选择Gltf状态' }]}>
          <Radio.Group>
            <Radio value={1}>开启</Radio>
            <Radio value={0}>关闭</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item noStyle shouldUpdate>
          {() => {
            return (
              form.getFieldValue('isGltf') === 1 && (
                <Form.Item label="Gltf文件">
                  <Upload
                    name="file"
                    maxCount={1}
                    beforeUpload={() => {
                      return false;
                    }}
                    onChange={handleGltfChange}
                    onRemove={() => {
                      setGltf(null);
                    }}
                    accept="model/gltf+json"
                  >
                    <Button icon={<UploadOutlined />}>上传GLTF文件</Button>
                  </Upload>
                </Form.Item>
              )
            );
          }}
        </Form.Item>
      </Form>
    </Modal>
  );
}
