import { InfoCircleOutlined } from '@ant-design/icons';
import { Modal, Form, TreeSelect, Input, InputNumber, Radio, Row, Col, Transfer, message } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useImperativeHandle, useState } from 'react';

import { fetchGetMenuActions, fetchGetMenuList, fetchCreateMenu, fetchUpdateMenu, fetchGetMenu } from '@/api/menu';
import IconSelect from '@/components/IconSelect';

import type { TransferProps } from 'antd';

export default function OperateMenu(props: ModalProp.OperateModalProp<Api.SystemManage.MenuUpdate>) {
  const [form] = useForm();
  const [action, setAction] = useState<ModalProp.OperateAction>('create');
  const [visible, setVisible] = useState(false);
  const [menuList, setMenuList] = useState<Api.SystemManage.Menu[]>([]);
  const [menuActions, setMenuActions] = useState<Api.SystemManage.MenuActions[]>([]);
  const [targetKeys, setTargetKeys] = useState<TransferProps['targetKeys']>([]);
  const [selectedKeys, setSelectedKeys] = useState<TransferProps['targetKeys']>([]);

  // 组件暴露open方法
  useImperativeHandle(props.mRef, () => ({
    open
  }));

  // 打开弹框函数
  const open = async (type: ModalProp.OperateAction, data?: Api.SystemManage.MenuUpdate | { parentId: number; id: number }) => {
    setAction(type);
    setVisible(true);
    getMenuList();
    getMenuActions();

    if (data) {
      if (type === 'edit') {
        // 编辑时调详情拿按钮权限
        const res = await fetchGetMenu(data.id);
        setTargetKeys(res.permissionActions);
        data = res;
      }

      form.setFieldsValue(data);
    }
  };

  const getMenuList = async () => {
    const data = await fetchGetMenuList({ type: 0 });
    setMenuList(data.list);
  };

  const getMenuActions = async () => {
    const data = await fetchGetMenuActions();
    setMenuActions(data.list);
  };

  // 表单提交
  const handleSubmit = async () => {
    const valid = form.validateFields();

    if (await valid) {
      if (action === 'create') {
        await fetchCreateMenu(form.getFieldsValue());
      } else {
        await fetchUpdateMenu(form.getFieldsValue());
      }
    }

    message.success('操作成功');
    handleCancel();
    props.update();
  };

  // 关闭和重置弹框
  const handleCancel = () => {
    setVisible(false);
    setTargetKeys([]);
    form.resetFields();
  };
  // 按钮权限选择
  const handleTransferChange: TransferProps['onChange'] = (newTargetKeys) => {
    setTargetKeys(newTargetKeys);
  };
  const handleTransferSelectChange: TransferProps['onSelectChange'] = (sourceSelectedKeys, targetSelectedKeys) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  };

  return (
    <Modal title="创建菜单" width={1000} open={visible} okText="确定" cancelText="取消" onOk={handleSubmit} onCancel={handleCancel}>
      <div className="modal-from">
        <Form form={form} labelCol={{ span: 5 }} initialValues={{ type: 0, status: 1 }}>
          <Form.Item hidden name="id">
            <Input />
          </Form.Item>

          <Row gutter={48}>
            <Col span={12}>
              <Form.Item label="菜单名称" name="name" rules={[{ required: true, message: '请输入菜单名称' }]}>
                <Input placeholder="请输入菜单名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="菜单图标" name="icon">
                <IconSelect />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="上级菜单" name="parentId">
                <TreeSelect
                  placeholder="请选择父级菜单"
                  allowClear
                  treeDefaultExpandAll
                  fieldNames={{ label: 'name', value: 'id', children: 'child' }}
                  treeData={menuList}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="权限标识" name="permission">
                <Input placeholder="请输入权限标识" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="路由地址" name="path">
                <Input placeholder="请输入路由地址" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="组件名称" name="component">
                <Input placeholder="请输入组件名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="排序" name="sort" tooltip={{ title: '排序值越大越靠后', icon: <InfoCircleOutlined rev={undefined} /> }}>
                <InputNumber min={0} style={{ width: 335 }} placeholder="请输入排序值" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="菜单类型" name="type">
                <Radio.Group>
                  <Radio value={0}>菜单</Radio>
                  <Radio value={1}>按钮</Radio>
                  <Radio value={2}>页面</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="菜单状态" name="status">
                <Radio.Group>
                  <Radio value={1}>启用</Radio>
                  <Radio value={0}>停用</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item noStyle shouldUpdate>
                {() => {
                  return (
                    form.getFieldValue('type') !== 1 && (
                      <Form.Item labelCol={{ offset: 0 }} label="菜单按钮权限" name="permissionActions">
                        <Transfer
                          className="tree-transfer"
                          titles={['全部节点', '已赋予节点']}
                          dataSource={menuActions}
                          targetKeys={targetKeys}
                          selectedKeys={selectedKeys}
                          onChange={handleTransferChange}
                          onSelectChange={handleTransferSelectChange}
                          render={(item) => item.describe}
                          rowKey={(record) => record.id}
                        />
                      </Form.Item>
                    )
                  );
                }}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </Modal>
  );
}
