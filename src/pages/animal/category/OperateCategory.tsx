import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Form, Input, Modal, Radio, Upload, message } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { RcFile } from 'antd/es/upload';
import { useImperativeHandle, useState } from 'react';

import { fetchCreateCategory, fetchUpdateCategory } from '@/api/animal';
import { fetchUpload } from '@/api/upload';
import { getImageUrl } from '@/utils';
export default function OperateCategory(props: ModalProp.OperateModalProp<Api.AnimalManger.AnimalCategory>) {
  const [form] = useForm();
  const [action, setAction] = useState<ModalProp.OperateAction>('create');
  const [visible, setVisible] = useState(false);
  const [img, setImg] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  // 组件暴露open方法
  useImperativeHandle(props.mRef, () => ({
    open
  }));

  // 打开弹框函数
  const open = (type: ModalProp.OperateAction, data?: Api.AnimalManger.AnimalCategory) => {
    setAction(type);
    setVisible(true);

    if (data) {
      form.setFieldsValue(data);
      setImg(data.thumb);
    }
  };

  // 提交表单
  const handleSubmit = async () => {
    const valid = await form.validateFields();
    const params = { ...form.getFieldsValue(), thumb: img };
    if (valid) {
      if (action === 'create') {
        await fetchCreateCategory(params);
      } else {
        await fetchUpdateCategory(params);
      }
      message.success('操作成功');
      handleCancel();
      props.update();
    }
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
    formData.append('module', 'animals');
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
  // 关闭和重置弹框
  const handleCancel = () => {
    setVisible(false);
    form.resetFields();
    setImg('');
  };

  return (
    <Modal
      title={action === 'create' ? '新增分类' : '编辑分类'}
      width={800}
      open={visible}
      okText="确定"
      cancelText="取消"
      onOk={handleSubmit}
      onCancel={handleCancel}
    >
      <div className="modal-from">
        <Form form={form} labelAlign="right" labelCol={{ span: 4 }} initialValues={{ status: 1 }}>
          <Form.Item hidden name="id">
            <Input />
          </Form.Item>
          <Form.Item label="分类名称" name="name" rules={[{ required: true, message: '请输入分类名称' }]}>
            <Input placeholder="请输入分类名称" />
          </Form.Item>

          <Form.Item label="分类封面图">
            <Upload name="thumb" listType="picture-card" showUploadList={false} customRequest={handleUpload} beforeUpload={beforeUpload}>
              {img ? (
                <img src={getImageUrl(img)} style={{ width: '100%', height: '100%', borderRadius: '5%' }} />
              ) : (
                <div>
                  {loading ? <LoadingOutlined /> : <PlusOutlined />}
                  <div style={{ marginTop: 5 }}>上传封面图</div>
                </div>
              )}
            </Upload>
          </Form.Item>
          <Form.Item label="显示状态" name="status" rules={[{ required: true, message: '请选择分类显示状态' }]}>
            <Radio.Group>
              <Radio value={1}>显示</Radio>
              <Radio value={0}>隐藏</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
}
