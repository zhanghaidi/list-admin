import { message } from 'antd';
import { Editor } from 'tinymce';

export default function (editor: Editor) {
  return () =>
    editor.windowManager.open({
      title: '插入视频',
      body: {
        type: 'panel',
        items: [
          {
            type: 'htmlpanel',
            html: '<div>视频地址</div>',
          },
          {
            type: 'urlinput',
            name: 'src',
            filetype: 'media',
          },
          {
            type: 'htmlpanel',
            html: '<div>视频宽度</div>',
          },
          {
            type: 'input',
            name: 'width',
          },
          {
            type: 'htmlpanel',
            html: '<div>视频高度</div>',
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
        isRatio: true,
        src: { value: '' },
        width: '860',
        height: '485',
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
          message.warning('请输入视频地址，或者上传本地视频！');
          return;
        }
        if (!width) {
          message.warning('视频宽度不能为空！');
          return;
        }
        if (!height) {
          message.warning('视频高度不能为空！');
          return;
        }
        editor.insertContent('<p></p>');
        const html = `
                    <p></p>
                    <video width="${width}" height="${height}" controls muted>
                        <source src="${src.value}" type="video/mp4">
                        <source src="${src.value}" type="video/ogg">
                        <source src="${src.value}" type="video/webm">
                        您的浏览器不支持 video 标签。
                    </video>
                    <p></p>
                `;
        editor.insertContent(html);
        api.close();
      },
      onChange: (api, details) => {
        const { isRatio, width, height } = api.getData();
        if (details.name === 'src') {
          api.setData({ isRatio, width, height });
        } else if (details.name === 'width' || details.name === 'height') {
          if (isRatio) {
            let widthVal = 0;
            let heightVal = 0;
            if (details.name === 'width') {
              widthVal = Number(width) > 860 ? 860 : Number(width);
              heightVal = Math.ceil(widthVal * (485 / 860));
            } else if (details.name === 'height') {
              widthVal = Number(height) / (485 / 860) > 860 ? 860 : Number(height) / (485 / 860);
              heightVal = Math.ceil(widthVal * (485 / 860));
            }
            api.setData({ width: widthVal.toString(), height: heightVal.toString() });
          } else {
            const widthVal = Number(width) > 860 ? 860 : width;
            const heightVal = Number(height) > 2000 ? 2000 : height;
            api.setData({ width: widthVal.toString(), height: heightVal.toString() });
          }
        }
      },
    });
}
