import { CSSProperties } from 'react';

import { getImageUrl } from '@/utils';
import request from '@/utils/request';

/** 根据类型获取资源分类
 * type:  model | specimen | slice | video
 */
export function fetchGetCategory(type: string) {
  return request.get<Api.Common.ListRecord>(`/${type}/category/list`);
}

/** 获取模型列表 */
export function fetchGetModelList(params?: Api.Common.SearchParams) {
  return request.get<Api.Common.PageRecord>('/model/list', params);
}

/** 获取标本列表 */
export function fetchGetSpecimenList(params?: Api.Common.SearchParams) {
  return request.get<Api.Common.PageRecord>('/specimen/list', params);
}

/** 获取切片列表 */
export function fetchGetSliceList(params?: Api.Common.SearchParams) {
  return request.get<Api.Common.PageRecord>('/slice/list', params);
}

/** 获取视频列表 */
export function fetchGetVideoList(params?: Api.Common.SearchParams) {
  return request.get<Api.Common.PageRecord>('/video/list', params);
}

/** 获取文章列表 */
export function fetchGetArticleList(params?: Api.Common.SearchParams) {
  return request.get<Api.Common.PageRecord>('/article/list', params);
}

export interface LabelDataItem {
  context: string;
  entext: string;
  id: string;
  link: string;
  description: string;
  shapes: Array<{
    type: 'round' | 'rect';
    geometry: {
      x: number;
      y: number;
      width?: number;
      height?: number;
      radius?: number;
    };
    properties?: CSSProperties;
    style?: CSSProperties;
  }>;
  src: string;
  text: string;
}

export const getLabelData = async (src: string): Promise<LabelDataItem[]> => {
  const response = await fetch(`${getImageUrl(src)}test.json`);
  if (!response.ok) {
    console.error(`${getImageUrl(src)}test.json`, response.status);
    return [];
  }
  const data = await response.json();
  return data;
};
