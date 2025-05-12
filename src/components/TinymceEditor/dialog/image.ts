import { message } from 'antd';
import { Editor } from 'tinymce';

export default function (
  editor: Editor,
  isEdit?: boolean,
  node?: HTMLElement,
  noteStore?: any,
  imgSrc?: string,
  imgWidth?: string,
  imgHeight?: string,
) {
  const getRatio = (url: string, callback: (radio: number, width: number, height: number) => void) => {
    const img = new Image();
    img.src = url;
    img.onload = function () {
      const ratio = img.height / img.width;
      callback(ratio, img.width, img.height);
    };
    img.onerror = function () {
      callback(0, 0, 0);
    };
  };
  return () => {
    editor.windowManager.open({
      title: isEdit ? '编辑图片' : '插入图片',
      body: {
        type: 'panel',
        items: [
          {
            type: 'htmlpanel',
            html: '<div>图片地址</div>',
          },
          {
            type: 'urlinput',
            name: 'src',
            filetype: 'image',
          },
          {
            type: 'htmlpanel',
            html: '<div>图片宽度</div>',
          },
          {
            type: 'input',
            name: 'width',
          },
          {
            type: 'htmlpanel',
            html: '<div>图片高度</div>',
          },
          {
            type: 'input',
            name: 'height',
          },
          {
            type: 'checkbox',
            name: 'isRatio',
            label: '保持比例',
          },
        ],
      },
      initialData: {
        src: { value: imgSrc ?? '' },
        width: imgWidth ?? '',
        height: imgHeight ?? '',
        isRatio: true,
      },
      buttons: [
        {
          type: 'cancel',
          name: 'closeButton',
          text: '取消',
        },
        {
          type: 'submit',
          name: 'submitButton',
          text: '确定',
          primary: true,
        },
      ],
      onSubmit: function (api) {
        const { src, width, height } = api.getData();
        if (!src.value) {
          message.warning('请输入图片地址，或者上传本地图片！');
          return;
        }
        if (!width) {
          message.warning('图片宽度不能为空！');
          return;
        }
        if (!height) {
          message.warning('图片高度不能为空！');
          return;
        }
        if (isEdit && node) {
          node.setAttribute('src', src.value);
          node.setAttribute('width', width);
          node.setAttribute('height', height);

          // 获取要替换的元素的 HTML 代码
          const newHtml = node.outerHTML;
          // 获取要替换的元素的起点和终点
          const range = editor.dom.createRng();
          range.setStartBefore(node);
          range.setEndAfter(node);
          // 替换旧元素
          editor.selection.setRng(range);
          editor.selection.setContent(newHtml);
          noteStore.editorVal = editor.getContent();
        } else {
          editor.insertContent('<p></p>');
          editor.insertContent(`<p></p><img src="${src.value}" width="${width}" height="${height}" /><p></p>`);
        }
        api.close();
      },
      onChange: function (api, details) {
        const { width, height, src, isRatio } = api.getData();
        if (details.name === 'src') {
          getRatio(src.value, (ratio, width) => {
            if (ratio !== 0) {
              const widthVal = width > 860 ? 860 : width;
              const heightVal = Math.ceil(widthVal * ratio);
              api.setData({ isRatio: true, width: widthVal.toString(), height: heightVal.toString() });
            } else {
              api.setData({ isRatio: true, width: imgWidth, height: imgHeight });
            }
          });
        } else if (details.name === 'width' || details.name === 'height') {
          const reg = /^[1-9][0-9]*$/;
          if (reg.test(width.toString()) && reg.test(height.toString())) {
            if (isRatio) {
              getRatio(src.value, (ratio) => {
                if (ratio !== 0) {
                  let widthVal = 0;
                  let heightVal = 0;
                  if (details.name === 'width') {
                    widthVal = Number(width) > 860 ? 860 : Number(width);
                    heightVal = Math.ceil(widthVal * ratio);
                  } else if (details.name === 'height') {
                    widthVal = Number(width) / ratio > 860 ? 860 : Number(width) / ratio;
                    heightVal = Math.ceil(widthVal * ratio);
                  }
                  api.setData({ width: widthVal.toString(), height: heightVal.toString() });
                }
              });
            } else {
              const widthVal = Number(width) > 860 ? 860 : Number(width);
              const heightVal = Number(height) > 2000 ? 2000 : Number(height);
              api.setData({ width: widthVal.toString(), height: heightVal.toString() });
            }
          } else {
            getRatio(src.value, (ratio, width) => {
              if (ratio !== 0) {
                api.setData({ width: width.toString(), height: (width * ratio).toString() });
              }
            });
          }
        }
      },
    });
  };
}
