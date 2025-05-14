import type { GetProp, UploadProps } from 'antd';
export type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

// 半路径转为完整地址
export function getImageUrl(path: string): string {
  if (!path) {
    return ''; // 如果 path 为空，直接返回空字符串
  }

  const baseURL = window.STORAGE_URL || ''; // 使用环境变量中的 OSS 地址，未配置时默认为空字符串

  if (path.startsWith('http')) {
    return path; // 如果是完整的 URL，直接返回
  }

  // 统一拼接路径，确保地址格式正确
  return baseURL + (path.startsWith('/') ? path : `/${path}`);
}

export const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

// 日期格式化
export const formatDate = (date?: Date | string | number, rule?: string) => {
  let curDate = new Date();

  //检查日期是否为整数（Unix时间戳以毫秒为单位）
  if (typeof date === 'number' && Number.isInteger(date)) {
    curDate = new Date(date);
  } else if (date instanceof Date) {
    curDate = date;
  } else if (typeof date === 'string' && date.trim() !== '') {
    curDate = new Date(date);
  }

  let fmt = rule || 'yyyy-MM-dd HH:mm:ss';
  fmt = fmt.replace(/(y+)/, curDate.getFullYear().toString());

  const O: Record<string, number> = {
    'M+': curDate.getMonth() + 1,
    'd+': curDate.getDate(),
    'H+': curDate.getHours(),
    'm+': curDate.getMinutes(),
    's+': curDate.getSeconds()
  };

  for (const k in O) {
    if (Object.prototype.hasOwnProperty.call(O, k)) {
      fmt = fmt.replace(new RegExp(`(${k})`), O[k] > 9 ? O[k].toString() : '0' + O[k].toString());
    }
  }

  return fmt;
};

// 格式化金额
export const formatMoney = (num?: number | string) => {
  if (!num) return '0.00';
  const a = parseFloat(num.toString());
  return a.toLocaleString('zh-CN', { style: 'currency', currency: 'CNY' });
};

// 格式化数字
export const formatNum = (num?: number | string) => {
  if (!num) return 0;
  const a = num.toString();
  if (a.indexOf('.') > -1) return a.replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
  return a.replace(/(\d)(?=(\d{3})+$)/g, '$1,');
};

// 禁止全页面滚动
function preventPageScroll(event: Event) {
  event.preventDefault();
  event.stopPropagation();
}
export function bodyNoScroll() {
  const elements: HTMLElement[] = [].slice.call(document.getElementsByClassName('bodyScroll'));
  elements.forEach((element) => {
    element.addEventListener('wheel', preventPageScroll, { passive: false });
  });
  document.body.addEventListener('wheel', preventPageScroll, { passive: false });
}
// 恢复全页面滚动
export function bodyYesScroll() {
  const elements: HTMLElement[] = [].slice.call(document.getElementsByClassName('bodyScroll'));
  elements.forEach((element) => {
    element.removeEventListener('wheel', preventPageScroll);
  });
  document.body.removeEventListener('wheel', preventPageScroll);
}

// 去除图片背景
export function removeImgBackground(url: string): Promise<string> {
  return new Promise<string>((resolve) => {
    const rgba = [0, 0, 0, 255];
    const tolerance = 60; // 容差率
    const canvas = document.createElement('canvas');
    const canvasText = canvas.getContext('2d');
    const img = new Image();
    img.src = url;
    let imgData = null;
    const [r0, g0, b0, a0] = rgba;
    let r, g, b, a;
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      if (!canvasText) {
        resolve(url);
        return;
      }
      canvasText.drawImage(img, 0, 0);
      imgData = canvasText.getImageData(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < imgData.data.length; i += 4) {
        r = imgData.data[i];
        g = imgData.data[i + 1];
        b = imgData.data[i + 2];
        a = imgData.data[i + 3];
        const t = Math.sqrt((r - r0) ** 2 + (g - g0) ** 2 + (b - b0) ** 2 + (a - a0) ** 2);
        if (t < tolerance) {
          imgData.data[i] = 0;
          imgData.data[i + 1] = 0;
          imgData.data[i + 2] = 0;
          imgData.data[i + 3] = 0;
        }
      }
      canvasText.putImageData(imgData, 0, 0);
      resolve(canvas.toDataURL('png'));
    };
    img.onerror = () => {
      resolve(url);
    };
    img.onabort = () => {
      resolve(url);
    };
  });
}
