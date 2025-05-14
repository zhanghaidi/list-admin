import { Form, Input, Modal, TreeSelect, message } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useImperativeHandle, useState } from 'react';

import { fetchGetCategory, fetchMoveSlice } from '@/api/slice';

export default function MoveSlice(props: ModalProp.OperateModalProp<number[]>) {
  const [form] = useForm();
  const [action, setAction] = useState<ModalProp.OperateAction>('create');
  const [visible, setVisible] = useState(false);
  const [categoryList, setCategoryList] = useState<Api.ResourceManage.CategoryNodes[]>([]);

  // 获取切片列表
  const getCategoryList = async () => {
    const res = await fetchGetCategory();
    setCategoryList(res.list);
  };

  // 组件暴露open方法
  useImperativeHandle(props.mRef, () => ({
    open
  }));

  // 打开弹框函数
  const open = (type: ModalProp.OperateAction, data: number[]) => {
    setAction(type);
    setVisible(true);
    getCategoryList();
    form.setFieldValue('ids', data);
  };

  // 移动分类表单提交
  const handleSubmit = async () => {
    const valid = await form.validateFields();
    if (valid) {
      const params = { ...form.getFieldsValue() };
      if (action === 'create') {
        await fetchMoveSlice(params);
        message.success('移动成功');
      }
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
      title={action === 'create' ? '移动切片到分类' : '移动切片到分类'}
      width={800}
      open={visible}
      okText="确定"
      cancelText="取消"
      onOk={handleSubmit}
      onCancel={handleCancel}
      forceRender
    >
      <Form form={form} className="modal-from" labelAlign="right" labelCol={{ span: 4 }}>
        <Form.Item hidden name="ids">
          <Input />
        </Form.Item>
        <Form.Item label="选择移动分类" name="categoryId" rules={[{ required: true, message: '请选择移动所属分类' }]}>
          <TreeSelect placeholder="请选择切片所属分类" allowClear fieldNames={{ label: 'name', value: 'id', children: 'child' }} treeData={categoryList} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
