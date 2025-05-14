import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  FileSearchOutlined,
  OrderedListOutlined,
  PlusOutlined,
  QrcodeOutlined,
  TruckOutlined
} from '@ant-design/icons';
import { useAntdTable } from 'ahooks';
import { Button, Table, Form, Input, Space, Modal, message, Image, Badge, Select, Switch, QRCode, Typography, InputNumber } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { ColumnsType } from 'antd/es/table';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

import {
  fetchGetAnimalList,
  fetchDeleteAnimal,
  fetchSetAnimalStatus,
  fetchSetAnimalGltf,
  fetchCopyAnimal,
  fetchSortAnimal,
  fetchGetCategory
} from '@/api/animal';
import errorImg from '@/assets/images/image-error.png';
import { getImageUrl } from '@/utils';
import storage from '@/utils/storage';

import OperateAnimal from './OperateAnimal';
import OperateGltf from './OperateGltf';
import Preview from './Preview';
export default function AnimalList() {
  const [form] = useForm();
  const [sortForm] = useForm();
  const location = useLocation();
  const [categoryList, setCategoryList] = useState<Api.AnimalManger.AnimalCategory[]>([]);
  const [ids, setIds] = useState<number[]>([]);
  const animalRef = useRef<{ open: (type: ModalProp.OperateAction, data?: Api.AnimalManger.Animal) => void }>({ open: () => {} });
  const gltfRef = useRef<{ open: (type: ModalProp.OperateAction, data: Api.AnimalManger.Animal) => void }>({ open: () => {} });
  const moveAnimalRef = useRef<{ open: (type: ModalProp.OperateAction, data: number[]) => void }>({ open: () => {} });
  const previewRef = useRef<{ open: (type: ModalProp.OperateAction, data: Api.AnimalManger.Animal) => void }>({ open: () => {} });
  const categoryId = new URLSearchParams(location.search).get('categoryId');

  useEffect(() => {
    getCategoryList();
    if (categoryId) {
      form.setFieldsValue({ categoryId: Number(categoryId) });
    }
  }, []);

  // 获取分类列表
  const getCategoryList = async (keywords?: string) => {
    const res = await fetchGetCategory({ keywords: keywords });
    setCategoryList(res.list);
  };

  const getTableData = ({ current, pageSize }: { current: number; pageSize: number }, formData: Api.Common.SearchParams) => {
    return fetchGetAnimalList({
      ...formData,
      page: current,
      pageSize: pageSize
    }).then((data) => {
      return {
        total: data.total,
        list: data.list
      };
    });
  };
  const { tableProps, search, refresh } = useAntdTable(getTableData, {
    form
  });

  const columns: ColumnsType<Api.AnimalManger.Animal> = [
    {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
      width: 100,
      align: 'center',
      render: (_, record) => (
        <Form.Item name={record.id} initialValue={record.sort} style={{ margin: 0 }}>
          <InputNumber min={0} style={{ width: '80px', fontSize: '14px' }} />
        </Form.Item>
      )
    },
    {
      title: '序号',
      key: 'index',
      align: 'center',
      width: 80,
      render: (_: any, __: Api.AnimalManger.Animal, index: number) => (tableProps.pagination.current - 1) * tableProps.pagination.pageSize + index + 1
    },
    { title: 'ID', dataIndex: 'id', key: 'id', fixed: 'left', width: 100, align: 'center' },
    {
      title: '动物模型封面',
      dataIndex: 'thumb',
      key: 'thumb',
      fixed: 'left',
      align: 'center',
      width: 100,
      render: (_, record) => <Image style={{ borderRadius: '5%' }} width={55} src={getImageUrl(record.thumb)} fallback={errorImg} />
    },
    {
      title: '动物模型标题',
      dataIndex: 'title',
      width: 150,
      key: 'title',
      align: 'center',
      fixed: 'left'
    },
    {
      title: '所属分类',
      dataIndex: 'categoryPath',
      key: 'categoryPath',
      align: 'center',
      width: 150,
      render(_, record) {
        return record.categoryPath;
      }
    },
    {
      title: '模型类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      align: 'center',
      render(type: number) {
        return {
          1: <Badge status="success" text="标本" />,
          2: <Badge status="processing" text="模型" />
        }[type];
      }
    },
    {
      title: '状态',
      width: 100,
      dataIndex: 'status',
      align: 'center',
      render(_, record) {
        return <Switch checkedChildren="上架" unCheckedChildren="下架" checked={record.status === 1} onChange={() => handleStatusChange(record)} />;
      }
    },

    {
      title: '开启GLTF',
      dataIndex: 'isGltf',
      key: 'isGltf',
      width: 100,
      align: 'center',
      render(_, record) {
        return <Switch checkedChildren="开启" unCheckedChildren="关闭" checked={record.isGltf === 1} onChange={() => handleGltfChange(record)} />;
      }
    },
    {
      title: '动物模型路径',
      dataIndex: 'scene',
      key: 'scene',
      align: 'center',
      width: 140
    },

    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 150, align: 'center' },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      fixed: 'right',
      width: 572,
      render(_, record) {
        return (
          <Space size={0}>
            <Button icon={<EyeOutlined />} size="small" type="link" onClick={() => handlePreview(record)}>
              预览
            </Button>

            <Button icon={<FileSearchOutlined />} size="small" type="link" onClick={() => handleInfo(record)}>
              信息
            </Button>
            <Button icon={<EditOutlined />} size="small" type="link" onClick={() => handleEdit(record)}>
              编辑
            </Button>
            <Button icon={<CopyOutlined />} size="small" type="link" onClick={() => handleCopy(record)}>
              复制
            </Button>
            <Button icon={<QrcodeOutlined />} size="small" type="link" onClick={() => handleQrcode(record)}>
              二维码
            </Button>
            <Button icon={<DeleteOutlined />} size="small" type="link" danger onClick={() => handleDelete(record.id)}>
              删除
            </Button>
          </Space>
        );
      }
    }
  ];

  const handlePreview = (record: Api.AnimalManger.Animal) => {
    previewRef.current?.open('edit', record);
  };
  const handleCreate = () => {
    // window.open(`${location.origin}/admin/editor?env=${import.meta.env.MODE}&type=animal`, '_blank')
    const host = window.BASE_URL;
    const oss = window.STORAGE_URL;
    const token = storage.get('x-token');
    window.open(`https://www.evdo.vip/admin/editor?type=specimen&app=histology&host=${host}&storage=${oss}&token=${token}`, '_blank');
  };
  const handleEdit = (record: Api.AnimalManger.Animal) => {
    const host = window.BASE_URL;
    const oss = window.STORAGE_URL;
    const token = storage.get('x-token');
    const modelType = record.type === 1 ? 'specimen' : 'model';

    window.open(`https://www.evdo.vip/admin/editor?id=${record.id}&type=${modelType}&app=histology&host=${host}&storage=${oss}&token=${token}`, '_blank');
    // window.open(`${location.origin}/admin/editor?env=${import.meta.env.MODE}&type=animal`, '_blank')
  };

  // 批量排序
  const handleSort = async () => {
    const sortList = tableProps.dataSource.map((item) => {
      return {
        id: item.id,
        value: sortForm.getFieldValue(item.id) !== undefined ? sortForm.getFieldValue(item.id) : item.sort
      };
    });

    if (sortList.length) {
      await fetchSortAnimal({ sort: sortList });
      message.success('排序成功');
    }
  };
  // 删除操作
  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '删除确认',
      content: '确认删除该动物模型吗?',
      async onOk() {
        await fetchDeleteAnimal({ ids: [id] });
        message.success('删除成功');
        refresh();
      }
    });
  };
  // 批量删除操作
  const handleBatchDelete = () => {
    Modal.confirm({
      title: '批量删除确认',
      content: <span>确认批量删除选中的动物模型吗？</span>,
      async onOk() {
        await fetchDeleteAnimal({ ids });
        message.success('删除成功');
        setIds([]);
        refresh();
      }
    });
  };
  // 批量设置状态操作
  const handleBatchSetStatus = (status: number) => {
    const statusText = status == 0 ? '批量上架' : '批量下架';
    Modal.confirm({
      title: '批量更改状态',
      content: status === 1 ? '确认批量上架选中动物模型吗?' : '确认批量下架选中动物模型吗?',
      async onOk() {
        await fetchSetAnimalStatus({ ids, status });
        message.success(statusText + '成功');
        setIds([]);
        refresh();
      }
    });
  };
  // 更改状态
  const handleStatusChange = (record: Api.AnimalManger.Animal) => {
    const statusText = record.status == 0 ? '上架' : '下架';
    Modal.confirm({
      title: '更新确认',
      content: `确认${statusText}此动物模型吗?`,
      async onOk() {
        await fetchSetAnimalStatus({ ids: [record.id], status: record.status == 0 ? 1 : 0 });
        message.success(statusText + `成功`);
        refresh();
      },
      onCancel() {}
    });
  };

  // GLTF设置
  const handleGltfChange = (record: Api.AnimalManger.Animal) => {
    const statusText = record.isGltf == 0 ? '开启GLTF' : '关闭GLTF';
    const formData = new FormData();
    formData.append('id', record.id.toString());
    formData.append('isGltf', String(record.isGltf === 0 ? 1 : 0));
    if (record.isGltf == 1) {
      Modal.confirm({
        title: '更新GLTF确认',
        content: `确认此动物模型${statusText}吗?`,
        async onOk() {
          await fetchSetAnimalGltf(formData);
          message.success(statusText + `成功`);
          refresh();
        },
        onCancel() {}
      });
    } else {
      gltfRef.current?.open('edit', record);
    }
  };

  // 信息编辑
  const handleInfo = (record: Api.AnimalManger.Animal) => {
    animalRef.current?.open('edit', record);
  };
  // 批量移动
  const handleBatchMove = () => {
    moveAnimalRef.current?.open('create', ids);
  };
  // 复制
  const handleCopy = (record: Api.AnimalManger.Animal) => {
    Modal.confirm({
      title: '复制确认',
      content: `确认复制此动物模型吗?`,
      async onOk() {
        await fetchCopyAnimal({ id: record.id });
        message.success(`复制${record.title}成功`);
        refresh();
      },
      onCancel() {}
    });
  };

  // 二维码
  const handleQrcode = (record: Api.AnimalManger.Animal) => {
    Modal.info({
      title: `${record.title}`,
      content: (
        <Space align="center" direction="vertical">
          <div>
            <QRCode
              errorLevel="H"
              size={200}
              value={`${import.meta.env.VITE_WEBSITE_BASE_URL}/web/external/animal/${record.id}`}
              icon={getImageUrl(record.thumb)}
            />
          </div>
          <div>
            <Typography.Paragraph copyable>{`${import.meta.env.VITE_WEBSITE_BASE_URL}/web/external/animal/${record.id}`}</Typography.Paragraph>
          </div>
        </Space>
      )
    });
  };

  return (
    <>
      <Form className="search-form" layout="inline" form={form}>
        <Form.Item name="keywords" label="动物模型名称">
          <Input style={{ width: 300 }} placeholder="请输入动物模型ID/名称搜索" allowClear></Input>
        </Form.Item>
        <Form.Item label="动物分类" name="categoryId">
          <Select style={{ width: 200 }} placeholder="请选择所属动物分类" allowClear>
            {categoryList.map((item) => {
              return (
                <Select.Option value={item.id} key={item.id}>
                  {item.name}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item name="status" label="动物模型状态">
          <Select style={{ width: 130 }} placeholder="选择动物模型状态" allowClear>
            <Select.Option value={0}>下架</Select.Option>
            <Select.Option value={1}>上架</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item name="type" label="动物模型类型">
          <Select style={{ width: 130 }} placeholder="选择动物模型类型" allowClear>
            <Select.Option value={1}>标本</Select.Option>
            <Select.Option value={2}>模型</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="isGltf" label="GLTF状态">
          <Select style={{ width: 130 }} placeholder="选择GLTF状态" allowClear>
            <Select.Option value={0}>关闭</Select.Option>
            <Select.Option value={1}>开启</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" onClick={search.submit}>
              搜索
            </Button>
            <Button type="default" onClick={search.reset}>
              重置
            </Button>
          </Space>
        </Form.Item>
      </Form>
      <div className="base-table">
        <div className="header-wrapper">
          <div className="title">动物模型列表</div>
          <div className="action">
            <Button type="primary" onClick={handleCreate}>
              <PlusOutlined /> 新增
            </Button>
            <Button type="default" onClick={handleSort}>
              <OrderedListOutlined />
              批量排序
            </Button>
            <Button type="default" onClick={() => handleBatchSetStatus(1)} disabled={ids.length <= 0}>
              <CheckCircleOutlined />
              批量上架
            </Button>
            <Button type="default" onClick={() => handleBatchSetStatus(0)} disabled={ids.length <= 0}>
              <CloseCircleOutlined />
              批量下架
            </Button>
            <Button type="default" onClick={() => handleBatchMove()} disabled={ids.length <= 0}>
              <TruckOutlined />
              批量移动
            </Button>
            <Button type="default" danger onClick={handleBatchDelete} disabled={ids.length <= 0}>
              <DeleteOutlined /> 批量删除
            </Button>
          </div>
        </div>
        <Form form={sortForm}>
          <Table
            rowKey="id"
            rowSelection={{
              type: 'checkbox',
              selectedRowKeys: ids,
              onChange(selectedRowKeys) {
                setIds(selectedRowKeys as number[]);
              }
            }}
            columns={columns}
            {...tableProps}
            pagination={{
              ...tableProps.pagination,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条`
            }}
            scroll={{ x: 2000 }}
          />
        </Form>
      </div>
      <OperateAnimal mRef={animalRef} update={refresh} />
      <OperateGltf mRef={gltfRef} update={refresh} />
      <Preview mRef={previewRef} update={refresh} />
    </>
  );
}
