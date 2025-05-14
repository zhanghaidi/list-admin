import { DeleteOutlined, EditOutlined, FolderAddOutlined, ImportOutlined, OrderedListOutlined, PlusOutlined, TruckOutlined } from '@ant-design/icons';
import { useAntdTable } from 'ahooks';
import { Button, Table, Form, Input, Space, Modal, message, InputNumber, Tag, Select, Row, Col, Card, Image } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { ColumnsType } from 'antd/es/table';
import { useEffect, useRef, useState } from 'react';

import { fetchGetCategory, fetchCreateCategory, fetchUpdateCategory, fetchDeleteCategory, fetchStatusCategory } from '@/api/category';
import { fetchGetQuestionList, fetchDeleteQuestion, fetchSortQuestion } from '@/api/exercise';
import errorImg from '@/assets/images/image-error.png';
import BasicTree, { BasicTreeRef } from '@/components/CategoryTree/BasicTree';
import { getImageUrl } from '@/utils';

import ImportQuestion from './ImportQuestion';
import MoveQuestion from './MoveQuestion';
import OperateQuestion from './OperateQuestion';

export default function QuestionList() {
  const [form] = useForm();
  const [sortForm] = useForm();
  const [ids, setIds] = useState<number[]>([]);
  const [categoryList, setCategoryList] = useState<Api.ResourceManage.CategoryNodes[]>([]);
  const questionRef = useRef<{ open: (type: ModalProp.OperateAction, data?: Api.ExerciseManger.Question) => void }>({ open: () => {} });
  const importRef = useRef<{ open: (type: ModalProp.OperateAction) => void }>({ open: () => {} });
  const moveQuestionRef = useRef<{ open: (type: ModalProp.OperateAction, data: number[]) => void }>({ open: () => {} });
  const treeRef = useRef<BasicTreeRef>(null);
  useEffect(() => {
    getCategoryList();
  }, []);

  // 获取题库列表
  const getCategoryList = async () => {
    const res = await fetchGetCategory();
    setCategoryList(res.list);
  };

  const getTableData = ({ current, pageSize }: { current: number; pageSize: number }, formData: Api.Common.SearchParams) => {
    return fetchGetQuestionList({
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

  const columns: ColumnsType<Api.ExerciseManger.Question> = [
    {
      title: '章节',
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
      title: '排序',
      dataIndex: 'listOrder',
      key: 'listOrder',
      width: 100,
      align: 'center',
      render: (_, record) => (
        <Form.Item name={'listOrder:' + record.id} initialValue={record.listOrder} style={{ margin: 0 }}>
          <InputNumber min={0} style={{ width: '80px', fontSize: '14px' }} />
        </Form.Item>
      )
    },
    { title: 'ID', dataIndex: 'id', key: 'id', width: 100, align: 'center', fixed: 'left' },
    {
      title: '题型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      align: 'center',
      render: (type: string) => <Tag color="processing">{type}</Tag>
    },
    Table.EXPAND_COLUMN,
    {
      title: '题干',
      dataIndex: 'title',
      key: 'title',
      width: 400,
      ellipsis: true
    },
    {
      title: '难度',
      dataIndex: 'difficulty',
      key: 'difficulty',
      width: 100,
      align: 'center',
      render: (difficulty: string) => <Tag color="default">{difficulty}</Tag>
    },
    {
      title: '3D题型',
      dataIndex: 'is3D',
      key: 'is3D',
      width: 100,
      align: 'center',
      render: (is3D: boolean) => (is3D === true ? <Tag color="processing">3D试题</Tag> : <Tag color="default">普通试题</Tag>)
    },
    {
      title: '所属分类',
      dataIndex: 'categoryPath',
      key: 'categoryPath',
      width: 150,
      align: 'center'
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 100,
      align: 'center'
    },
    {
      title: '操作',
      key: 'action',
      width: 215,
      align: 'center',
      fixed: 'right',
      render(_, record) {
        return (
          <Space size={0}>
            <Button icon={<EditOutlined />} size="small" type="link" onClick={() => handleUpdate(record)}>
              编辑
            </Button>
            <Button icon={<DeleteOutlined />} size="small" type="link" danger onClick={() => handleDelete(record.id)}>
              删除
            </Button>
          </Space>
        );
      }
    }
  ];

  // 创建题目
  const handleCreate = () => {
    questionRef.current?.open('create');
  };
  // 编辑题目
  const handleUpdate = (record: Api.ExerciseManger.Question) => {
    questionRef.current?.open('edit', record);
  };
  // Excel导入题库
  const handleImport = () => {
    importRef.current?.open('create');
  };

  // 批量移动
  const handleBatchMove = () => {
    moveQuestionRef.current?.open('create', ids);
  };
  // 展开题目详情
  const expandedRowRender = (record: Api.ExerciseManger.Question) => {
    return (
      <Row style={{ padding: 20 }}>
        <Col span={24}>
          <Space direction="vertical" size="middle">
            <Space>
              <Tag color="processing">{record.type}</Tag>
              <strong>{record.title}</strong>
            </Space>
            <Space>{record.is3D ? <Image width={'50%'} src={getImageUrl(record.resource.image)} fallback={errorImg} /> : ''}</Space>
            <Space>
              选项：
              {record.options.map((item) => (
                <Tag key={item.id} color={item.isCorrect ? 'green' : 'red'}>
                  {item.content}
                </Tag>
              ))}
            </Space>
            <Space>
              解析：<strong> {record.analysis} </strong>
            </Space>
          </Space>
        </Col>
      </Row>
    );
  };

  // 章节排序
  const handleSort = async () => {
    const sortList = tableProps.dataSource.map((item) => {
      return {
        id: item.id,
        value: sortForm.getFieldValue(item.id) !== undefined ? sortForm.getFieldValue(item.id) : item.listOrder
      };
    });
    if (sortList.length) {
      await fetchSortQuestion({ sort: sortList });
      message.success('排序成功');
    }
  };
  // 题号排序
  const handleListOrder = async () => {
    const sortList = tableProps.dataSource.map((item) => {
      return {
        id: item.id,
        value: sortForm.getFieldValue('listOrder:' + item.id) !== undefined ? sortForm.getFieldValue('listOrder:' + item.id) : item.listOrder
      };
    });
    if (sortList.length) {
      await fetchSortQuestion({ sort: sortList });
      message.success('排序成功');
    }
  };

  // 删除操作
  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '删除确认',
      content: '确认删除该题库吗?',
      async onOk() {
        await fetchDeleteQuestion({ ids: [id] });
        message.success('删除成功');
        refresh();
      }
    });
  };
  // 批量删除操作
  const handleBatchDelete = () => {
    Modal.confirm({
      title: '批量删除确认',
      content: <span>确认批量删除选中的题库吗？</span>,
      async onOk() {
        await fetchDeleteQuestion({ ids });
        message.success('删除成功');
        setIds([]);
        refresh();
      }
    });
  };
  // 点击选中的分类获筛选取相应标本列表
  const onTreeSelect = (selectedKeys: React.Key[]) => {
    form.setFieldsValue({ categoryId: selectedKeys[0] });
    search.submit();
  };

  const handleCreateCategory = async (key: React.Key, value: string) => {
    await fetchCreateCategory({ parentId: Number(key), name: value, status: 1 });
    message.success('创建成功');
    await getCategoryList();
  };

  const handleUpdateCategory = async (pid: React.Key, node: Api.ResourceManage.CategoryNodes, value: string) => {
    await fetchUpdateCategory({
      parentId: Number(pid),
      id: node.id,
      name: value,
      status: node.status // ✅ 直接用 node.status
    });
    message.success('更新成功');
    await getCategoryList();
  };

  const handleStatusCategory = async (key: React.Key) => {
    await fetchStatusCategory({ id: Number(key) });
    message.success('更新成功');
    await getCategoryList();
  };

  const handleDelCategory = async (key: React.Key) => {
    await fetchDeleteCategory({ id: Number(key) });
    message.success('删除成功');
    await getCategoryList();
  };

  return (
    <Row gutter={8}>
      <Col span={4}>
        <Card
          title="分类"
          style={{ height: '100%' }}
          extra={<FolderAddOutlined style={{ fontSize: '16px', color: '#1890ff' }} onClick={() => treeRef.current?.addRootNode()} />}
        >
          <BasicTree
            ref={treeRef}
            treeDataFromOutside={categoryList}
            fieldNames={{ key: 'id', title: 'name', children: 'child' }}
            onCreate={handleCreateCategory}
            onUpdate={handleUpdateCategory}
            onDelete={handleDelCategory}
            onSelect={onTreeSelect}
            onStatus={handleStatusCategory}
          />
        </Card>
      </Col>
      <Col span={20}>
        <Form className="search-form" layout="inline" form={form}>
          <Form.Item name="keywords" label="题库名称">
            <Input style={{ width: 300 }} placeholder="请输入ID/名称搜索" allowClear></Input>
          </Form.Item>
          <Form.Item hidden name="categoryId">
            <Input />
          </Form.Item>
          <Form.Item name="type" label="题目类型">
            <Select style={{ width: 200 }} placeholder="请选择题型" allowClear>
              <Select.Option value={1}>单选题</Select.Option>
              <Select.Option value={2}>多选题</Select.Option>
              <Select.Option value={3}>判断题</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="is3D" label="标本题型">
            <Select style={{ width: 200 }} placeholder="请选择标本题型" allowClear>
              <Select.Option value={1}>3D试题</Select.Option>
              <Select.Option value={0}>普通试题</Select.Option>
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
            <div className="title">题库列表</div>
            <div className="action">
              <Button type="primary" onClick={handleCreate}>
                <PlusOutlined /> 新增
              </Button>
              <Button icon={<ImportOutlined />} onClick={handleImport}>
                导入题库
              </Button>
              <Button type="default" onClick={handleSort}>
                <OrderedListOutlined />
                章节排序
              </Button>
              <Button type="default" onClick={handleListOrder}>
                <OrderedListOutlined />
                题号排序
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
              expandable={{ expandedRowRender }}
              pagination={{
                ...tableProps.pagination,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 条`
              }}
              scroll={{ x: 2000 }}
            />
          </Form>
        </div>
        <OperateQuestion mRef={questionRef} update={refresh} />
        <ImportQuestion mRef={importRef} update={refresh} />
        <MoveQuestion
          mRef={moveQuestionRef}
          update={() => {
            setIds([]);
            refresh();
          }}
        />
      </Col>
    </Row>
  );
}
