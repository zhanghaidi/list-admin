import { Avatar, Form, Input, Modal, Select, Space, TreeSelect, message } from 'antd';
import { useImperativeHandle, useState } from 'react';

import { fetchGetSliceList, fetchGetSpecimenList, fetchGetModelList, fetchGetArticleList } from '@/api/resource';
import { fetchGetCategory, fetchCreateSlice, fetchUpdateSlice } from '@/api/slice';
import ChunkUpload from '@/components/ChunkUpload'; // 导入分片上传组件
import { getImageUrl } from '@/utils';

export default function OperateSlice(props: ModalProp.OperateModalProp<Api.ResourceManage.Slice>) {
  const [form] = Form.useForm();
  const [action, setAction] = useState<ModalProp.OperateAction>('create');
  const [visible, setVisible] = useState(false);
  const [categories, setCategories] = useState<Api.ResourceManage.CategoryNodes[]>([]);
  const [modelList, setModelList] = useState<Api.ResourceManage.Resource[]>([]);
  const [sliceList, setSliceList] = useState<Api.ResourceManage.Resource[]>([]);
  const [specimenList, setSpecimenList] = useState<Api.ResourceManage.Resource[]>([]);
  const [ArticleList, setArticleList] = useState<Api.ResourceManage.Article[]>([]);

  // 获取切片列表
  const getCategoryList = async () => {
    const res = await fetchGetCategory();
    setCategories(res.list);
  };

  const getModelList = async () => {
    const res = await fetchGetModelList({ page: 1, pageSize: 10000 });
    setModelList(res.list);
  };
  const getSliceList = async () => {
    const res = await fetchGetSliceList({ page: 1, pageSize: 10000 });
    setSliceList(res.list);
  };
  const getSpecimenList = async () => {
    const res = await fetchGetSpecimenList({ page: 1, pageSize: 10000 });
    setSpecimenList(res.list);
  };
  const getArticleList = async () => {
    const res = await fetchGetArticleList({ page: 1, pageSize: 10000 });
    setArticleList(res.list);
  };

  // 组件暴露open方法
  useImperativeHandle(props.mRef, () => ({
    open,
  }));

  // 打开弹框函数
  const open = (type: ModalProp.OperateAction, data?: Api.ResourceManage.Slice) => {
    getCategoryList();
    getModelList();
    getSliceList();
    getSpecimenList();
    getArticleList();
    setAction(type);
    setVisible(true);
    if (data) {
      form.setFieldsValue(data);
      if (data.modelId === 0) {
        form.setFieldValue('modelId', undefined);
      }
    }
  };

  const filterOption = (input: string, option?: { key: string; children: string; value: number }) => {
    return (option?.key ?? '').toLowerCase().includes(input.toLowerCase());
  };

  // 提交表单
  const handleSubmit = async () => {
    const valid = await form.validateFields();
    if (valid) {
      const params = { ...form.getFieldsValue() };
      if (action === 'create') {
        await fetchCreateSlice(params);
      } else {
        await fetchUpdateSlice(params);
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
  };

  return (
    <Modal
      title={action === 'create' ? '新增切片' : '编辑切片'}
      width={1000}
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
        <Form.Item label="所属分类" name="categoryId" rules={[{ required: true, message: '请选择切片所属分类' }]}>
          <TreeSelect
            placeholder="请选择切片所属分类"
            allowClear
            fieldNames={{ label: 'name', value: 'id', children: 'child' }}
            treeData={categories}
          />
        </Form.Item>
        <Form.Item label="切片标题" name="title" rules={[{ required: true, message: '请输入切片标题' }]}>
          <Input placeholder="请输入切片标题" />
        </Form.Item>
        <Form.Item label="英文标题" name="enTitle">
          <Input placeholder="请输入英文标题" />
        </Form.Item>
        <Form.Item label="关联模型" name="modelId">
          <Select placeholder="请选择模型" showSearch allowClear filterOption={filterOption}>
            {modelList.map((item) => {
              return (
                <Select.Option value={item.id} key={item.title}>
                  <Space>
                    <span>
                      <Avatar src={getImageUrl(item.thumb)} shape="square" />
                    </span>
                    <span>{item.title}</span>
                  </Space>
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item label="关联标本" name="specimenId">
          <Select mode="multiple" placeholder="请选择标本" showSearch allowClear filterOption={filterOption}>
            {specimenList.map((item) => {
              return (
                <Select.Option value={item.id} key={item.title}>
                  <Space>
                    <span>
                      <Avatar src={getImageUrl(item.thumb)} shape="square" />
                    </span>
                    <span>{item.title}</span>
                  </Space>
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item label="关联切片" name="sliceId">
          <Select mode="multiple" placeholder="请选择切片" showSearch allowClear filterOption={filterOption}>
            {sliceList.map((item) => {
              return (
                <Select.Option value={item.id} key={item.title}>
                  <Space>
                    <span>
                      <Avatar src={getImageUrl(item.thumb)} shape="square" />
                    </span>
                    <span>{item.title}</span>
                  </Space>
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item label="关联文章" name="articleId">
          <Select mode="multiple" placeholder="请选择文章" showSearch allowClear filterOption={filterOption}>
            {ArticleList.map((item) => {
              return (
                <Select.Option value={item.id} key={item.title}>
                  <Space>
                    <span>
                      <Avatar src={getImageUrl(item.thumb)} shape="square" />
                    </span>
                    <span>{item.title}</span>
                  </Space>
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item label="染色方式" name="dyeing">
          <Input placeholder="请输入染色方式" />
        </Form.Item>
        <Form.Item label="实验目的" name="purpose">
          <Input.TextArea placeholder="请输入实验目的" />
        </Form.Item>
        <Form.Item label="材料与方法" name="method">
          <Input.TextArea placeholder="请输入实验材料与方法" />
        </Form.Item>
        <Form.Item label="肉眼观察" name="eyeObserve">
          <Input.TextArea placeholder="请输入肉眼观察" />
        </Form.Item>
        <Form.Item label="低倍镜观察" name="lowPower">
          <Input.TextArea placeholder="请输入低倍镜观察" />
        </Form.Item>
        <Form.Item label="高倍镜观察" name="highPower">
          <Input.TextArea placeholder="请输入高倍镜观察" />
        </Form.Item>
        {/* <Form.Item label='切片文件' name='svs'>
          <ChunkUpload
            maxFileSize={1024} // 设置最大上传文件大小MB
            allowedFileTypes={['tif', 'svs']} // 仅允许上传 tif 和 svs 格式的文件,
            onSuccess={path => {
              form.setFieldValue('svs', path)
            }}
          />
        </Form.Item> */}
        <Form.Item noStyle shouldUpdate>
          {() => {
            return (
              action === 'create' && (
                <Form.Item label="切片文件" name="svs" rules={[{ required: true, message: '请选择切片' }]}>
                  <ChunkUpload
                    maxFileSize={1024} // 设置最大上传文件大小MB
                    allowedFileTypes={['tif', 'svs']} // 仅允许上传 tif 和 svs 格式的文件,
                    onSuccess={(path) => {
                      form.setFieldValue('svs', path);
                    }}
                  />
                </Form.Item>
              )
            );
          }}
        </Form.Item>
      </Form>
    </Modal>
  );
}
