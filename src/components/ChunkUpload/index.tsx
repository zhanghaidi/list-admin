import { UploadOutlined } from '@ant-design/icons';
import { Upload, Button, Progress, message } from 'antd';
import { useEffect } from 'react';
import React, { useState } from 'react';

import { initMultipartUpload, uploadPart, completeMultipartUpload } from '@/api/upload';
import { getImageUrl } from '@/utils';

import type { RcFile } from 'antd/es/upload';

interface ChunkUploadProps {
  value?: string; // 回显的文件路径
  onChange?: (path: string) => void; // 用于 Form 组件的受控组件绑定
  onSuccess?: (path: string) => void; // 上传成功后的回调
  maxFileSize?: number; // 最大文件大小（以 MB 为单位）
  allowedFileTypes?: string[]; // 允许上传的文件类型
}

const CHUNK_SIZE = 5 * 1024 * 1024; // 每个分片 5MB

const ChunkUpload: React.FC<ChunkUploadProps> = ({
  value,
  onChange,
  onSuccess,
  maxFileSize = 1024, // 默认最大文件大小 1GB
  allowedFileTypes = ['jpg', 'png', 'mp4', 'pdf', 'docx', 'zip'], // 默认允许的文件类型
}) => {
  const [progress, setProgress] = useState(0);
  const [fileList, setFileList] = useState<any[]>([]);
  // 初始化 fileList
  useEffect(() => {
    if (value) {
      setFileList([{ uid: '-1', name: value.split('/').pop() || '文件', status: 'done', url: getImageUrl(value) }]);
    }
  }, [value]);
  // 上传前检查文件类型和大小
  const beforeUpload = (file: RcFile) => {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!fileExtension || !allowedFileTypes.includes(fileExtension)) {
      message.error(`仅允许上传 ${allowedFileTypes.join('/')} 格式的文件`);
      return Upload.LIST_IGNORE;
    }

    if (file.size / 1024 / 1024 > maxFileSize) {
      message.error(`文件不能超过 ${maxFileSize} MB`);
      return Upload.LIST_IGNORE;
    }

    return true;
  };

  // 单个分片上传函数，便于分离逻辑和错误处理
  const uploadChunk = async (chunk: Blob, uploadData: any) => {
    const formData = new FormData();
    formData.append('file', chunk);
    formData.append('uploadId', uploadData.uploadId);
    formData.append('filePath', uploadData.filePath);
    formData.append('partNumber', uploadData.partNumber);
    formData.append('partSize', chunk.size.toString());

    return await uploadPart(formData);
  };

  // 主分片上传逻辑
  const handleChunkUpload = async ({ file, onError }: any) => {
    try {
      const { uploadId, filePath } = await initMultipartUpload({ filename: file.name });
      const chunkCount = Math.ceil(file.size / CHUNK_SIZE);
      const partETags: Api.UploadManage.Parts[] = [];

      for (let i = 0; i < chunkCount; i++) {
        const chunk = file.slice(i * CHUNK_SIZE, Math.min(file.size, (i + 1) * CHUNK_SIZE));

        try {
          const partRes = await uploadChunk(chunk, {
            uploadId,
            filePath,
            partNumber: (i + 1).toString(),
          });
          partETags.push({ partNumber: i + 1, etag: partRes.etag });
          setProgress(Math.round(((i + 1) / chunkCount) * 100));
        } catch (err) {
          message.error(`分片 ${i + 1} 上传失败`);
          throw err;
        }
      }

      // 完成多部分上传
      const completeRes = await completeMultipartUpload({
        uploadId,
        filePath,
        filename: file.name,
        parts: partETags,
      });

      if (completeRes.path) {
        setFileList([{ uid: file.uid, name: file.name, status: 'done', url: completeRes.path }]);
        setProgress(0);
        message.success('文件上传成功');
        onSuccess?.(completeRes.path); // 确保成功时调用，并传递路径
        onChange?.(completeRes.path); // 触发 Form 组件的 onChange
      }
    } catch (error) {
      message.error('文件上传失败');
      console.error(error); // 捕获更多的错误信息
      onError(error);
    }
  };

  return (
    <div>
      <Upload
        listType="picture"
        maxCount={1}
        beforeUpload={beforeUpload}
        customRequest={handleChunkUpload}
        fileList={fileList}
        onRemove={() => {
          setFileList([]);
          setProgress(0);
        }}
      >
        <Button icon={<UploadOutlined />}>选择上传</Button>
      </Upload>
      {progress > 0 && <Progress percent={progress} />}
    </div>
  );
};

export default ChunkUpload;
