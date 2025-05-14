import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Form, Input, Modal, Radio, TreeSelect, Upload, message } from 'antd';
import { RcFile } from 'antd/es/upload';
import { useImperativeHandle, useState } from 'react';

import { fetchGetCategory, fetchCreateSpecimen, fetchUpdateSpecimen } from '@/api/specimen';
import { fetchUpload } from '@/api/upload';
import { getImageUrl } from '@/utils';

export default function OperateSpecimen(props: ModalProp.OperateModalProp<Api.ResourceManage.Specimen>) {
  const [form] = Form.useForm();

  const [action, setAction] = useState<ModalProp.OperateAction>('create');
  const [visible, setVisible] = useState(false);
  const [img, setImg] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Api.ResourceManage.CategoryNodes[]>([]);

  // 获取标本列表
  const getCategoryList = async () => {
    const res = await fetchGetCategory();
    setCategories(res.list);
  };

  // 组件暴露open方法
  useImperativeHandle(props.mRef, () => ({
    open
  }));

  // 打开弹框函数
  const open = (type: ModalProp.OperateAction, data?: Api.ResourceManage.Specimen) => {
    setAction(type);
    setVisible(true);
    getCategoryList();
    if (data) {
      form.setFieldsValue(data);
      setImg(data.thumb);
    }
  };

  // 提交表单
  const handleSubmit = async () => {
    const valid = await form.validateFields();
    if (valid) {
      const params = { ...form.getFieldsValue(), thumb: img };
      if (action === 'create') {
        await fetchCreateSpecimen(params);
      } else {
        await fetchUpdateSpecimen(params);
      }
      message.success('操作成功');
      handleCancel();
      props.update();
    }
  };

  // 关闭和重置弹框
  const handleCancel = () => {
    setVisible(false);
    form.resetFields();
    setImg('');
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
    formData.append('module', 'model');
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
      title={action === 'create' ? '新增标本' : '编辑标本'}
      width={1000}
      open={visible}
      okText="确定"
      cancelText="取消"
      onOk={handleSubmit}
      onCancel={handleCancel}
    >
      <Form className="modal-from" form={form} labelAlign="right" labelCol={{ span: 4 }} initialValues={{ is_slice_type: 0 }}>
        <Form.Item hidden name="id">
          <Input />
        </Form.Item>

        <Form.Item label="所属分类" name="categoryId" rules={[{ required: true, message: '请选择标本所属分类' }]}>
          <TreeSelect placeholder="请选择标本所属分类" allowClear fieldNames={{ label: 'name', value: 'id', children: 'child' }} treeData={categories} />
        </Form.Item>
        <Form.Item label="标本标题" name="title" rules={[{ required: true, message: '请输入标本标题' }]}>
          <Input placeholder="请输入标本标题" />
        </Form.Item>
        <Form.Item label="英文标题" name="enTitle">
          <Input placeholder="请输入英文标题" />
        </Form.Item>
        <Form.Item label="百科地址" name="bkAddress">
          <Input.TextArea autoSize={true} placeholder="请输入百科地址" />
        </Form.Item>
        <Form.Item label="内容介绍" name="content">
          <Input.TextArea placeholder="请输入模型内容介绍" />
        </Form.Item>
        <Form.Item label="切片类型" name="isSliceType">
          <Radio.Group>
            <Radio value={1}>是</Radio>
            <Radio value={0}>否</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="标本封面">
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
      </Form>
    </Modal>
  );
}
