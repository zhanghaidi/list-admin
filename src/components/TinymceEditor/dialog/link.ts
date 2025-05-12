import { Editor } from 'tinymce';

export default function (
  editor: Editor,
  isEdit?: boolean,
  url?: string,
  text?: string,
  node?: HTMLElement,
  noteStore?: any,
) {
  return () =>
    editor.windowManager.open({
      title: isEdit ? '编辑链接' : '插入链接',
      body: {
        type: 'panel',
        items: [
          {
            type: 'htmlpanel',
            html: '<div>网址</div>',
          },
          {
            type: 'input',
            name: 'url',
          },
          {
            type: 'htmlpanel',
            html: '<div>显示文本</div>',
          },
          {
            type: 'input',
            name: 'text',
          },
        ],
      },
      initialData: {
        url: url ?? '',
        text: text ?? '',
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
        const { url, text } = api.getData();
        let linkUrl = '';
        if (url) {
          if (!/^http[s]*:/.test(url)) {
            linkUrl = 'http://' + url;
          }
          if (!isEdit) {
            editor.insertContent('<p></p>');
            const newElement = editor.getDoc().createElement('a');
            newElement.setAttribute('href', linkUrl);
            newElement.setAttribute('data-url', url);
            newElement.setAttribute('data-text', text);
            newElement.setAttribute('data-alt', 'link');
            newElement.setAttribute('target', '_blank');
            newElement.innerHTML = text !== '' ? text : url;
            editor.insertContent(newElement.outerHTML);
          } else if (isEdit && node) {
            node.setAttribute('href', linkUrl);
            node.setAttribute('data-url', url);
            node.setAttribute('data-text', text);
            node.innerHTML = text ?? url;
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
          }
        }
        api.close();
      },
    });
}
