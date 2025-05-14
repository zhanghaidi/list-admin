import { UploadOutlined } from '@ant-design/icons';
import { Button, Form, Modal, Select, Space, Upload, message, Typography } from 'antd';
import { useImperativeHandle, useState } from 'react';

import { fetchGetCategory } from '@/api/category';
import { fetchImportQuestion } from '@/api/exercise';
export default function ImportQuestion(props: ModalProp.OperateModalProp<Api.ExerciseManger.Question>) {
  const { Text } = Typography;
  const [form] = Form.useForm();
  const [action, setAction] = useState<ModalProp.OperateAction>('create');
  const [visible, setVisible] = useState(false);
  const [excel, setExcel] = useState<File | null>(null);
  const [categories, setCategories] = useState<Api.ResourceManage.CategoryNodes[]>([]);

  // 获取分类列表
  const getCategoryList = async () => {
    const res = await fetchGetCategory();
    setCategories(res.list);
  };

  // 组件暴露open方法
  useImperativeHandle(props.mRef, () => ({
    open
  }));

  // 打开弹框函数
  const open = (type: ModalProp.OperateAction) => {
    getCategoryList();
    setAction(type);
    setVisible(true);
  };
  const filterOption = (input: string, option?: { children: string; value: number }) => {
    return (option?.children ?? '').toLowerCase().includes(input.toLowerCase());
  };

  // 监听Upload组件的change事件
  const handleExcelChange = (info: any) => {
    if (info.file.status !== 'removed') {
      setExcel(info.file);
    }
  };

  // 提交表单
  const handleSubmit = async () => {
    const valid = await form.validateFields();
    if (valid) {
      const params = { ...form.getFieldsValue() };
      const formData = new FormData();
      formData.append('categoryId', params.categoryId);
      if (!excel) {
        return message.success('请选择文件');
      }
      formData.append('file', excel);
      try {
        await fetchImportQuestion(formData);
        message.success('导入成功');
        handleCancel();
        props.update();
      } catch (e) {
        message.error('上传失败:' + e);
      }
    }
  };

  // 关闭和重置弹框
  const handleCancel = () => {
    setVisible(false);
    form.resetFields();
    setExcel(null);
  };

  return (
    <Modal
      title={action === 'create' ? '导入题库' : '导入题库'}
      width={1000}
      open={visible}
      okText="确定"
      cancelText="取消"
      onOk={handleSubmit}
      onCancel={handleCancel}
    >
      <Form className="modal-from" form={form} labelAlign="right" labelCol={{ span: 4 }}>
        <Form.Item label="题目分类" name="categoryId" rules={[{ required: true, message: '请选择分类' }]}>
          <Select placeholder="请选择题目分类" showSearch allowClear filterOption={filterOption}>
            {categories.map((item) => {
              return (
                <Select.Option value={item.id} key={item.name}>
                  {item.name}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item
          label="题库Excel"
          name="file"
          valuePropName="fileList"
          getValueFromEvent={(e) => e.fileList.map((file: { originFileObj: any }) => file.originFileObj)}
        >
          <Upload
            name="file"
            maxCount={1}
            beforeUpload={() => {
              return false;
            }}
            onRemove={() => {
              setExcel(null);
            }}
            onChange={handleExcelChange}
            accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          >
            <Button icon={<UploadOutlined />}>上传题库Excel</Button>
          </Upload>
        </Form.Item>
        <Space direction="vertical">
          <Text>注意:</Text>
          <Text>一、表格从第4单元行开始。单元列格式为：C列：题目 D列：选项一 E列：选项二 F列：选项三 G列：选项四 H列：选项五 K列：正确选项 L列：答案解析</Text>
          <Text>二、只支持单选题/是非判断题。</Text>
          <Text>三、所导入题库的格式只能为Excel表格。表格内容请参照注意一格式。</Text>
          <Text>三、Excel表格后缀为.XLSX。暂不支持.XLS格式。</Text>
        </Space>
      </Form>
    </Modal>
  );
}
