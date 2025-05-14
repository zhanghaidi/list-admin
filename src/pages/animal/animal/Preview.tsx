import { ExpandOutlined, CompressOutlined, CloseOutlined } from '@ant-design/icons';
import { Modal, Button } from 'antd';
import { useImperativeHandle, useState } from 'react';

// import { SpecimenViewer } from '@/components/viewer';
// import { ModelViewer } from '@/components/viewer';
// import { getImageUrl } from '@/utils';

export default function Preview(props: ModalProp.OperateModalProp<Api.AnimalManger.Animal>) {
  const [, setAction] = useState<ModalProp.OperateAction>('create');
  const [visible, setVisible] = useState(false);
  const [record, setRecord] = useState<Api.AnimalManger.Animal | null>(null); // 存储当前预览数据
  const [isFullScreen, setIsFullScreen] = useState(false); // 是否全屏

  // 组件暴露 open 方法
  useImperativeHandle(props.mRef, () => ({
    open
  }));

  // 打开弹框函数
  const open = (type: ModalProp.OperateAction, data: Api.AnimalManger.Animal) => {
    setAction(type);
    setRecord(data); // ✅ 直接更新 record，避免 setTimeout
    setVisible(true); // ✅ 立即打开 Modal
  };

  // 关闭和重置弹框
  const handleCancel = () => {
    setRecord(null);
    setVisible(false);
    setIsFullScreen(false); // 关闭时恢复默认大小
  };

  // 切换全屏模式
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  return (
    <Modal
      key={record?.id}
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <span>模型预览</span>
          <div>
            <Button type="text" icon={isFullScreen ? <CompressOutlined /> : <ExpandOutlined />} onClick={toggleFullScreen}>
              {isFullScreen ? '退出全屏' : '全屏'}
            </Button>
            <Button type="text" icon={<CloseOutlined />} onClick={handleCancel} />
          </div>
        </div>
      }
      width={isFullScreen ? '100vw' : 1400} // 全屏时宽度 100vw，否则 1200px
      style={isFullScreen ? { top: 0, paddingBottom: 0 } : {}} // 全屏时去掉顶部间距
      styles={{ body: isFullScreen ? { height: 'calc(100vh - 100px)' } : {} }} // ✅ 替换 bodyStyle
      open={visible}
      onCancel={handleCancel} // 允许点击外部关闭
      closeIcon={null} // ❌ 隐藏默认 X 按钮
      footer={null} // ✅ 移除页脚，去掉“确定”和“取消”按钮
    >
      <div style={{ height: isFullScreen ? 'calc(100vh - 100px)' : '700px', textAlign: 'center' }}>
        {
          record &&
            (record.type === 1
              ? ''
              : // <SpecimenViewer
                //   id={record.id}
                //   url={getImageUrl(record.scene)}
                //   domain={window.STORAGE_URL}
                //   thumb={getImageUrl(record.thumb)}
                // />
                '')
          // <ModelViewer
          //   id={record.id}
          //   url={getImageUrl(record.scene)}
          //   domain={window.STORAGE_URL}
          //   thumb={getImageUrl(record.thumb)}
          // />
        }
      </div>
    </Modal>
  );
}
