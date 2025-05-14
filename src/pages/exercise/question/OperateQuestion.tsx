import { InfoCircleOutlined, LoadingOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Avatar, Button, Checkbox, Form, Input, InputNumber, Modal, Radio, Select, Space, TreeSelect, Upload, message } from 'antd';
import { RcFile } from 'antd/es/upload';
import { useEffect, useImperativeHandle, useState } from 'react';

import { fetchGetCategory } from '@/api/category';
import { fetchCreateQuestion, fetchUpdateQuestion } from '@/api/exercise';
import { fetchGetSpecimenList } from '@/api/specimen';
import { fetchUpload } from '@/api/upload';
import { getImageUrl } from '@/utils';

export default function OperateQuestion(props: ModalProp.OperateModalProp<Api.ExerciseManger.Question>) {
  const [form] = Form.useForm();
  const [action, setAction] = useState<ModalProp.OperateAction>('create');
  const [visible, setVisible] = useState(false);
  const [img, setImg] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Api.ResourceManage.CategoryNodes[]>([]);
  const [specimens, setSpecimens] = useState<Api.ResourceManage.Resource[]>([]);
  const [correctOptionIndex, setCorrectOptionIndex] = useState<number | null>(null);

  // 初始化默认选项
  useEffect(() => {
    if (visible) {
      const options = form.getFieldValue('options') || [];
      if (!options.length) {
        form.setFieldValue('options', [
          { content: '', isCorrect: false },
          { content: '', isCorrect: false }
        ]);
      }
    }
  }, [visible]);

  // 获取分类列表
  const getCategoryList = async () => {
    const res = await fetchGetCategory();
    setCategories(res.list);
  };

  // 获取标本列表
  const getSpecimenList = async () => {
    const res = await fetchGetSpecimenList({ page: 1, pageSize: 10000 });
    setSpecimens(res.list);
  };

  useImperativeHandle(props.mRef, () => ({
    open
  }));

  // 打开模态框并加载数据
  const open = (type: ModalProp.OperateAction, data?: Api.ExerciseManger.Question) => {
    getCategoryList();
    getSpecimenList();
    setAction(type);
    setVisible(true);
    form.resetFields();
    setCorrectOptionIndex(null);
    setImg(undefined);

    let initialOptions = [];

    if (data) {
      const validOptions = (data.options || []).filter((opt) => opt?.content?.trim()) || [];
      initialOptions =
        validOptions.length > 0
          ? validOptions
          : [
              { content: '', isCorrect: false },
              { content: '', isCorrect: false }
            ];
      form.setFieldsValue({
        ...data,
        options: initialOptions
      });

      if (data.resource) {
        form.setFieldValue('resourceId', data.resource.id);
        form.setFieldValue('resourceType', data.resource.type);
        setImg(data.resource.image);
      }

      if (['单选题', '判断题'].includes(data.type)) {
        const correctIdx = initialOptions.findIndex((opt) => opt.isCorrect);
        setCorrectOptionIndex(correctIdx);
      }
    } else {
      initialOptions = [
        { content: '', isCorrect: false },
        { content: '', isCorrect: false }
      ];
      form.setFieldValue('options', initialOptions);
    }
  };

  // 搜索筛选标本
  const filterSpecimen = (input: string, option?: { key: string; children: string; value: number }) => {
    return (option?.key ?? '').toLowerCase().includes(input.toLowerCase());
  };

  // 标本选择变化
  const handleChangeSpecimen = (value: number) => {
    form.setFieldValue('resourceType', value > 0 ? 'specimen' : undefined);
  };

  // 图片上传前检查
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

  // 处理上传
  const handleUpload = async (file: any) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('module', 'question');
    formData.append('type', 'images');
    formData.append('file', file.file);
    try {
      const res = await fetchUpload(formData);
      setImg(res.path);
    } catch (e) {
      message.error(`上传失败：${e}`);
    } finally {
      setLoading(false);
    }
  };

  // 提交表单
  const handleSubmit = async () => {
    const values = await form.validateFields();
    const type = values.type;
    const options = values.options || [];

    // 清洗选项
    const filteredOptions = options
      .map((opt: Api.ExerciseManger.QuestionOption) => ({
        ...opt,
        content: typeof opt.content === 'string' ? opt.content.trim() : '',
        isCorrect: Boolean(opt.isCorrect)
      }))
      .filter((opt: Api.ExerciseManger.QuestionOption) => opt.content);

    if (filteredOptions.length < 2) {
      message.error('至少需要两个非空选项');
      return;
    }

    // 单选/判断题必须有一个正确答案
    if (['单选题', '判断题'].includes(type)) {
      const correctCount = filteredOptions.filter((opt: Api.ExerciseManger.QuestionOption) => opt.isCorrect).length;
      if (correctCount === 0) {
        message.error('单选题/判断题必须设置一个正确答案');
        return;
      }
    }

    // 设置选项 id 和 isCorrect
    const formattedOptions = filteredOptions.map((opt: Api.ExerciseManger.QuestionOption, index: number) => ({
      id: opt.id ?? index + 1,
      content: opt.content,
      isCorrect: opt.isCorrect
    }));

    const params = {
      ...values,
      options: formattedOptions
    };

    if (action === 'create') {
      await fetchCreateQuestion(params);
    } else {
      await fetchUpdateQuestion(params);
    }

    message.success('操作成功');
    handleCancel();
    props.update();
  };

  // 关闭模态框
  const handleCancel = () => {
    setVisible(false);
    form.resetFields();
  };

  return (
    <Modal
      title={action === 'create' ? '新增题目' : '编辑题目'}
      width={1000}
      open={visible}
      okText="确定"
      cancelText="取消"
      onOk={handleSubmit}
      onCancel={handleCancel}
    >
      <Form
        className="modal-form"
        form={form}
        labelAlign="right"
        labelCol={{ span: 4 }}
        initialValues={{ listOrder: 0, difficulty: '中等', type: '单选题', is3D: false }}
      >
        <Form.Item hidden name="id">
          <Input />
        </Form.Item>

        <Form.Item label="题库分类" name="categoryId" rules={[{ required: true, message: '请选择题库分类' }]}>
          <TreeSelect placeholder="请选择题库分类" allowClear fieldNames={{ label: 'name', value: 'id', children: 'child' }} treeData={categories} />
        </Form.Item>

        <Form.Item
          label="题目序号"
          name="listOrder"
          tooltip={{ title: '序号值越大越靠后', icon: <InfoCircleOutlined /> }}
          rules={[{ required: true, message: '请输入题目序号' }]}
        >
          <InputNumber min={0} style={{ width: '100%' }} placeholder="请输入题目序号值" />
        </Form.Item>

        <Form.Item label="题目" name="title" rules={[{ required: true, message: '请输入题目' }]}>
          <Input.TextArea autoSize placeholder="请输入题目" />
        </Form.Item>

        <Form.Item label="难度" name="difficulty" rules={[{ required: true, message: '请选择难度' }]}>
          <Radio.Group>
            <Radio value="简单">简单</Radio>
            <Radio value="中等">中等</Radio>
            <Radio value="困难">困难</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="题型" name="type" rules={[{ required: true, message: '请选择题型' }]}>
          <Radio.Group
            onChange={() => {
              const type = form.getFieldValue('type');
              const options = form.getFieldValue('options') || [];

              if (type === '单选题' || type === '判断题') {
                // 找出第一个 isCorrect 为 true 的索引作为 singleCorrectIndex
                const idx = options.findIndex((opt: any) => opt.isCorrect);
                setCorrectOptionIndex(idx);
              } else {
                // 多选题时清除 singleCorrectIndex，并保留 isCorrect 数组
                setCorrectOptionIndex(null);
              }
            }}
          >
            <Radio value="单选题">单选题</Radio>
            <Radio value="多选题">多选题</Radio>
            <Radio value="判断题">判断题</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.List name="options">
          {(fields, { add, remove }, { errors }) => {
            const type = form.getFieldValue('type');
            const isMultiple = type === '多选题';
            const handleCorrectChange = (index: number) => {
              if (!isMultiple) {
                const options = form.getFieldValue('options') || [];

                // 更新所有选项的 isCorrect 状态
                const newOptions = options.map((opt: any, i: number) => ({
                  ...opt,
                  isCorrect: i === index
                }));

                form.setFieldValue('options', newOptions);
                setCorrectOptionIndex(index);
              }
            };
            const OptionItem = ({ field, index }: { field: any; index: number }) => (
              <Form.Item label={`选项 ${index + 1}`} required={false} key={field.key}>
                <Space align="baseline" style={{ width: '100%', justifyContent: 'space-between' }}>
                  <Form.Item name={[field.name, 'id']} hidden>
                    <Input />
                  </Form.Item>
                  <Form.Item name={[field.name, 'content']} rules={[{ required: true, whitespace: true, message: '请输入选项内容' }]} style={{ flex: 1 }}>
                    <Input placeholder={`选项 ${index + 1}`} />
                  </Form.Item>
                  {isMultiple ? (
                    <Form.Item name={[field.name, 'isCorrect']} valuePropName="checked" noStyle>
                      <Checkbox>正确</Checkbox>
                    </Form.Item>
                  ) : (
                    <Radio checked={correctOptionIndex === index} onChange={() => handleCorrectChange(index)}>
                      正确
                    </Radio>
                  )}
                  <MinusCircleOutlined
                    onClick={() => {
                      if (fields.length > 2) {
                        if (index === correctOptionIndex) {
                          setCorrectOptionIndex(null);
                        }
                        remove(field.name);
                      } else {
                        message.warning('至少需要保留两个选项');
                      }
                    }}
                    style={{ visibility: index < 2 ? 'hidden' : 'visible' }}
                  />
                </Space>
              </Form.Item>
            );

            return (
              <>
                {fields.map((field, index) => (
                  <OptionItem field={field} index={index} key={field.key} />
                ))}
                <Form.Item label=" " colon={false} labelCol={{ span: 4 }}>
                  <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />} block>
                    添加选项
                  </Button>
                  <Form.ErrorList errors={errors} />
                </Form.Item>
              </>
            );
          }}
        </Form.List>

        <Form.Item label="解析" name="analysis">
          <Input.TextArea autoSize placeholder="请输入解析" />
        </Form.Item>

        <Form.Item label="标本试题" name="is3D">
          <Radio.Group>
            <Radio value={false}>普通试题</Radio>
            <Radio value={true}>标本试题</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item noStyle shouldUpdate>
          {() =>
            form.getFieldValue('is3D') === true && (
              <>
                <Form.Item label="标本" name="resourceId">
                  <Select placeholder="请选择标本" showSearch allowClear filterOption={filterSpecimen} onChange={handleChangeSpecimen}>
                    {specimens.map((item) => (
                      <Select.Option value={item.id} key={item.title}>
                        <Space>
                          <Avatar src={getImageUrl(item.thumb)} shape="square" />
                          <span>{item.title}</span>
                        </Space>
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item hidden name="resourceType">
                  <Input />
                </Form.Item>
                <Form.Item label="图片">
                  <Upload name="thumb" listType="picture-card" showUploadList={false} customRequest={handleUpload} beforeUpload={beforeUpload}>
                    {img ? (
                      <img src={getImageUrl(img)} style={{ width: '100%', height: '100%', borderRadius: '5%' }} />
                    ) : (
                      <div>
                        {loading ? <LoadingOutlined /> : <PlusOutlined />}
                        <div style={{ marginTop: 5 }}>上传图片</div>
                      </div>
                    )}
                  </Upload>
                </Form.Item>
              </>
            )
          }
        </Form.Item>
      </Form>
    </Modal>
  );
}
