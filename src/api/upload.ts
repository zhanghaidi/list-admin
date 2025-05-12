import request from '@/utils/request';

// 文件上传
export function fetchUpload(params: any) {
  return request.post<Api.UploadManage.UploadResponse>('/upload', params);
}

// 初始化分片上传
export async function initMultipartUpload(params: Api.UploadManage.InitMultipartParams) {
  return request.post<Api.UploadManage.InitMultipartResponse>('/initMultipartUpload', params);
}

// 上传分片
export async function uploadPart(params: any) {
  return request.post<Api.UploadManage.UploadPartResponse>('/uploadPart', params);
}

// 合并分片
export async function completeMultipartUpload(params: Api.UploadManage.CompleteMultipartParams) {
  return request.post<Api.UploadManage.CompleteMultipartResponse>('/completeMultipartUpload ', params);
}
