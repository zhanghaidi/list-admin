import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Form, Input, Modal, TreeSelect, Upload, message } from 'antd';
import { RcFile } from 'antd/es/upload';
import { useImperativeHandle, useState } from 'react';

import { fetchCreateArticle, fetchGetCategory, fetchUpdateArticle } from '@/api/article';
import { fetchUpload } from '@/api/upload';
import TinymceEditor from '@/components/TinymceEditor';
import { getImageUrl } from '@/utils';

export default function OperateArticle(props: ModalProp.OperateModalProp<Api.ResourceManage.Article>) {
  const [form] = Form.useForm();

  const [action, setAction] = useState<ModalProp.OperateAction>('create');
  const [visible, setVisible] = useState(false);
  const [img, setImg] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Api.ResourceManage.CategoryNodes[]>([]);

  // 获取文章列表
  const getCategoryList = async () => {
    const res = await fetchGetCategory();
    setCategories(res.list);
  };

  // 组件暴露open方法
  useImperativeHandle(props.mRef, () => ({
    open
  }));

  // 打开弹框函数
  const open = (type: ModalProp.OperateAction, data?: Api.ResourceManage.Article) => {
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
        await fetchCreateArticle(params);
      } else {
        await fetchUpdateArticle(params);
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
    formData.append('module', 'article');
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
      title={action === 'create' ? '新增文章' : '编辑文章'}
      width={1400}
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
        <Form.Item label="文章标题" name="title" rules={[{ required: true, message: '请输入文章标题' }]}>
          <Input placeholder="请输入文章标题" />
        </Form.Item>
        <Form.Item label="文章分类" name="categoryId" rules={[{ required: true, message: '请选择文章分类' }]}>
          <TreeSelect placeholder="请选择文章分类" allowClear fieldNames={{ label: 'name', value: 'id', children: 'child' }} treeData={categories} />
        </Form.Item>
        <Form.Item label="文章封面">
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
        <Form.Item
          label="内容"
          name="content"
          getValueProps={(value) => ({ initialValue: value })}
          shouldUpdate={(prevValues, currentValues) => prevValues !== currentValues}
          getValueFromEvent={(e) => e.target.getContent()}
          rules={[{ required: true, message: '请输入文章内容' }]}
        >
          <TinymceEditor />
        </Form.Item>
      </Form>
    </Modal>
  );
}
