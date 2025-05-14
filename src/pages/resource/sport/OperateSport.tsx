import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Form, Input, InputNumber, Modal, Radio, Select, Space, TreeSelect, Upload, message } from 'antd';
import { RcFile } from 'antd/es/upload';
import { useImperativeHandle, useState } from 'react';

import { fetchCreateSport, fetchGetCategory, fetchGetSportModelTree, fetchUpdateSport } from '@/api/sport';
import { fetchUpload } from '@/api/upload';
import ChunkUpload from '@/components/ChunkUpload';
import { getImageUrl } from '@/utils';

export default function OperateSport(props: ModalProp.OperateModalProp<Api.ResourceManage.Sport>) {
  const [form] = Form.useForm();
  const unit = Form.useWatch('unit', form); // 实时监听 unit 字段的变化
  const [action, setAction] = useState<ModalProp.OperateAction>('create');
  const [visible, setVisible] = useState(false);
  const [img, setImg] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Api.ResourceManage.CategoryNodes[]>([]);
  const [locationList, setLocationList] = useState<Api.ResourceManage.SportModelTree[]>([]);
  // 获取运动解剖列表
  const getCategoryList = async () => {
    const res = await fetchGetCategory();
    setCategories(res.list);
  };

  const getLocationList = async () => {
    const res = await fetchGetSportModelTree();
    setLocationList(res.list);
  };

  // 组件暴露open方法
  useImperativeHandle(props.mRef, () => ({
    open
  }));

  // 打开弹框函数
  const open = (type: ModalProp.OperateAction, data?: Api.ResourceManage.Sport) => {
    setAction(type);
    setVisible(true);
    getCategoryList();
    getLocationList();
    if (data) {
      // 检查是否存在 camera 字段
      if (data.camera) {
        const [cameraPosition, cameraDistance] = data.camera.split('|');
        // 拆解 camera 字段，设置 cameraPosition 和 cameraDistance
        form.setFieldsValue({
          ...data,
          cameraPosition,
          cameraDistance: cameraDistance ? parseFloat(cameraDistance) : undefined // 如果没有距离值，设置为 undefined
        });
      } else {
        // 如果没有 camera 字段，直接设置 form
        form.setFieldsValue(data);
      }
      setImg(data.thumb);
    }
  };

  // 提交表单
  const handleSubmit = async () => {
    const valid = await form.validateFields();
    if (valid) {
      const raw = form.getFieldsValue();
      let cameraValue = '';
      // 如果相机位置有值，才传递 camera 字段
      if (raw.cameraPosition) {
        cameraValue = `${raw.cameraPosition}|${raw.cameraDistance || 1}`;
      }
      const params = {
        ...raw,
        thumb: img,
        location: raw.location ?? [],
        camera: cameraValue // 只在相机位置有值时，拼接相机字段
      };
      if (action === 'create') {
        await fetchCreateSport(params);
      } else {
        await fetchUpdateSport(params);
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
    formData.append('module', 'sport');
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
  // 选择相机位置时设置默认相机距离
  const handleCameraPositionChange = (value: string) => {
    const currentCameraDistance = form.getFieldValue('cameraDistance');
    if (!value) {
      form.setFieldsValue({
        cameraPosition: value,
        cameraDistance: undefined // 清空距离
      });
    } else {
      form.setFieldsValue({
        cameraPosition: value,
        cameraDistance: currentCameraDistance !== undefined ? currentCameraDistance : 1
      });
    }
  };

  return (
    <Modal
      title={action === 'create' ? '新增运动解剖' : '编辑运动解剖'}
      width={1400}
      open={visible}
      okText="确定"
      cancelText="取消"
      onOk={handleSubmit}
      onCancel={handleCancel}
    >
      <Form className="modal-from" form={form} labelAlign="right" labelCol={{ span: 4 }} initialValues={{ type: 3, unit: 0 }}>
        <Form.Item hidden name="id">
          <Input />
        </Form.Item>
        <Form.Item label="所属分类" name="categoryId" rules={[{ required: true, message: '请选择所属分类' }]}>
          <TreeSelect placeholder="请选择所属分类" allowClear fieldNames={{ label: 'name', value: 'id', children: 'child' }} treeData={categories} />
        </Form.Item>
        <Form.Item label="肌肉关联" name="location">
          <TreeSelect
            treeLine={true}
            treeCheckable={true}
            placeholder="请选择肌肉关联部位"
            allowClear
            fieldNames={{ label: 'name', value: 'name', children: 'child' }}
            treeData={locationList}
            filterTreeNode={
              (input, node) => (node?.name ?? '').toLowerCase().includes(input.toLowerCase()) // ✅ 支持模糊搜索
            }
          />
        </Form.Item>
        <Form.Item label="模型标题" name="title" rules={[{ required: true, message: '请输入模型标题' }]}>
          <Input placeholder="请输入模型标题" />
        </Form.Item>

        <Form.Item label="资源类型" name="type" rules={[{ required: true, message: '请选择类型' }]}>
          <Radio.Group>
            <Radio value={2}>模型</Radio>
            <Radio value={3}>动画</Radio>
          </Radio.Group>
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
        {/* 相机位置和距离 */}
        <Form.Item label="相机位置" name="camera" extra="选择相机位置和输入相机距离">
          <Space>
            <Form.Item name="cameraPosition" noStyle>
              <Select
                placeholder="请选择相机位置"
                style={{ width: 200 }}
                allowClear
                onChange={handleCameraPositionChange} // 监听位置变化
              >
                <Select.Option value={'0,0,1'}>前</Select.Option>
                <Select.Option value={'0,1,1'}>前上</Select.Option>
                <Select.Option value={'-1,0,0'}>左</Select.Option>
                <Select.Option value={'-1,1,0'}>左上</Select.Option>
                <Select.Option value={'-1,0,1'}>左前</Select.Option>
                <Select.Option value={'-1,1,1'}>左前上</Select.Option>
                <Select.Option value={'-1,0,-1'}>左后</Select.Option>
                <Select.Option value={'-1,1,-1'}>左后上</Select.Option>
                <Select.Option value={'1,0,0'}>右</Select.Option>
                <Select.Option value={'1,1,0'}>右上</Select.Option>
                <Select.Option value={'1,0,1'}>右前</Select.Option>
                <Select.Option value={'1,1,1'}>右前上</Select.Option>
                <Select.Option value={'1,0,-1'}>右后</Select.Option>
                <Select.Option value={'1,1,-1'}>右后上</Select.Option>
                <Select.Option value={'0,0,-1'}>后</Select.Option>
              </Select>
            </Form.Item>
            <span style={{ marginLeft: 18 }}>相机距离：</span>
            <Form.Item name="cameraDistance" noStyle>
              <InputNumber min={0} style={{ width: 130 }} placeholder="相机距离" />
            </Form.Item>
          </Space>
        </Form.Item>
        {/* 运动单位 */}
        <Form.Item label="运动单位" name="unit" rules={[{ required: true, message: '请选择运动单位' }]}>
          <Radio.Group>
            <Radio value={0}>关闭</Radio>
            <Radio value={1}>角度</Radio>
            <Radio value={2}>距离</Radio>
          </Radio.Group>
        </Form.Item>
        {/* 动态显示运动起止 */}
        {unit !== 0 && (
          <>
            <Form.Item label="起始结束值" extra="运动起始值 ~ 运动结束值">
              <Space>
                <Form.Item name="start" noStyle>
                  <InputNumber min={-180} max={360} style={{ width: 130 }} placeholder="起始值" addonAfter={unit === 2 ? 'cm' : '°'} />
                </Form.Item>
                <span>~</span>
                <Form.Item name="end" noStyle>
                  <InputNumber min={-180} max={360} style={{ width: 130 }} placeholder="结束值" addonAfter={unit === 2 ? 'cm' : '°'} />
                </Form.Item>
              </Space>
            </Form.Item>
            <Form.Item label="关节部位" name="joint">
              <Input placeholder="请输入运动关节部位" />
            </Form.Item>
            <Form.Item label="运动范围" name="range">
              <Input placeholder="请输入运动范围描述" />
            </Form.Item>
          </>
        )}
        <Form.Item label="剖封面图">
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
        <Form.Item label="运动解剖动画" name="scene" rules={[{ required: true, message: '运动解剖动画' }]}>
          <ChunkUpload
            value={form.getFieldValue('scene')}
            maxFileSize={1024} // 设置最大上传文件大小MB
            allowedFileTypes={['gltf', 'glb', 'json']} // 仅允许上传 gltf 和 gltf 格式的文件,
            onChange={(path) => form.setFieldValue('scene', path)}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
