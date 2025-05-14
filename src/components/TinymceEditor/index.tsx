import { Editor } from '@tinymce/tinymce-react';
import { message } from 'antd';
import React, { useState } from 'react';
import tinymce from 'tinymce/tinymce';

import { fetchUpload } from '@/api/upload';
import { getImageUrl } from '@/utils';

import ResourceLibraryModal from '../ResourceLibrary';

import customImage from './dialog/image';
import customLink from './dialog/link';
import customVideo from './dialog/video';
import { icons } from './icons';

import 'tinymce/models/dom/model'; // DOM model
import 'tinymce/themes/silver'; // 主题Theme
import 'tinymce/icons/default'; // Toolbar icons
import 'tinymce/plugins/image';
import 'tinymce/plugins/media';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/wordcount';
import 'tinymce/plugins/autosave';
import 'tinymce/plugins/code';
import 'tinymce/plugins/table';
import 'tinymce/plugins/link';
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/autoresize';

type MenuItem = {
  type: 'menuitem';
  icon?: string;
  text: string;
  onAction: () => boolean;
};
export default function TinymceEditor(props: React.ComponentProps<typeof Editor>) {
  const [isSelect, setIsSelect] = useState<boolean>(false);
  const [mediaType, setMediaType] = useState<string>('');

  // 编辑器插入资源
  const insertResource = (type: string, resource: any) => {
    const thumb = getImageUrl(resource.thumb);
    let content = '';
    if (type === 'video' && resource.video_url) {
      content = `
        <video
          src="${getImageUrl(resource.video_url)}"
          width="674px"
          height="380px"
          controls
          poster="${thumb}"
        >
        </video>
        <p></p>
      `;
    } else {
      let url = `${import.meta.env.VITE_WEBSITE_BASE_URL}/web/external/`;
      switch (type) {
        case 'model':
          url += `model/${resource.id}?minimal=1&note=1&lock=true`;
          break;
        case 'specimen':
          url += `specimen/${resource.id}?note=1&lock=true`;
          break;
        case 'slice':
          url += `slice/${resource.id}?note=1&lock=true`;
          break;
      }

      content = `
        <div style="display: inline-flex; flex-direction: column; align-items: center; padding-bottom: 5px; background-color: #f5f5f5;">
          <img src="${thumb}" width="180px" height="180px" />
          <a data-t="model" href="${url}" target="_blank">
            <span>查看模型</span>
          </a>
        </div>
        <p></p>
      `;
    }
    tinymce.activeEditor?.execCommand('mceInsertContent', false, content);
    tinymce.activeEditor?.fire('change');
  };

  return (
    <div className="tinymce-editor">
      <Editor
        {...props}
        init={{
          height: 600,
          menubar: false,
          branding: false, // 隐藏 TinyMCE 标识
          skin_url: `${import.meta.env.BASE_URL}tinymce/skins/ui/oxide`,
          language_url: `${import.meta.env.BASE_URL}tinymce/langs/zh_CN.js`, // 语言包 URL
          content_css: `${import.meta.env.BASE_URL}tinymce/skins/content/default/content.css`,
          language: 'zh_CN', // 语言设置
          plugins: 'lists advlist media image  wordcount link code table',
          toolbar:
            'code textFormat bold italic underline strikethrough forecolor backcolor alignleft aligncenter alignright alignjustify outdent indent table insertMore undo redo',
          file_picker_callback: (callback, _value, meta) => {
            //文件分类
            let fileType = 'file';
            //为不同插件指定文件类型及后端地址
            switch (meta.filetype) {
              case 'image':
                fileType = 'image';
                break;
              case 'media':
                fileType = 'video';
                break;
              case 'file':
              default:
            }
            // 打开本地文件上传对话框
            const input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.setAttribute('accept', `${fileType}/*`);
            input.onchange = async (e) => {
              const target = e.target as typeof input;
              if (target.files) {
                const file = target.files[0];
                if (file.size / 1024 / 1024 > 20) {
                  message.warning('请选择小于20M的图片、视频、音频上传');
                  return;
                }
                const formData = new FormData();
                formData.append('file', file);
                formData.append('type', fileType + 's');
                formData.append('module', 'note');

                try {
                  const response = await fetchUpload(formData);
                  callback(response.url);
                } catch (error) {
                  console.error('上传失败:', error);
                  message.warning('上传失败');
                }
              }
            };
            input.click();
          },
          setup: (editor) => {
            editor.ui.registry.addMenuButton('textFormat', {
              icon: 'format',
              tooltip: '文本格式',
              fetch: (callback) => {
                const items: MenuItem[] = [
                  {
                    type: 'menuitem',
                    icon: 'p',
                    text: '普通文本',
                    onAction: () => editor.execCommand('FormatBlock', false, 'p')
                  },
                  {
                    type: 'menuitem',
                    icon: 'h1',
                    text: '一级标题',
                    onAction: () => editor.execCommand('FormatBlock', false, 'h1')
                  },
                  {
                    type: 'menuitem',
                    icon: 'h2',
                    text: '二级标题',
                    onAction: () => editor.execCommand('FormatBlock', false, 'h2')
                  },
                  {
                    type: 'menuitem',
                    icon: 'h3',
                    text: '三级标题',
                    onAction: () => editor.execCommand('FormatBlock', false, 'h3')
                  },
                  {
                    type: 'menuitem',
                    icon: 'h4',
                    text: '四级标题',
                    onAction: () => editor.execCommand('FormatBlock', false, 'h4')
                  }
                ];
                callback(items);
              }
            });

            editor.ui.registry.addContextToolbar('imagealignment', {
              predicate: (node) => node.nodeName === 'IMG' || node.nodeName === 'A',
              items: 'edit delete',
              position: 'node',
              scope: 'node'
            });

            editor.ui.registry.addButton('delete', {
              icon: 'remove',
              tooltip: '删除',
              onAction: () => {
                const selectedBlock = editor.selection.getSelectedBlocks()[0];
                editor.selection.select(selectedBlock);
                editor.insertContent('<p></p>');
              }
            });

            editor.ui.registry.addButton('edit', {
              icon: 'highlight-bg-color',
              tooltip: '编辑',
              onAction: () => {
                const node = editor.selection.getNode();
                if (node.nodeName === 'A') {
                  editor.execCommand('mceLink');
                } else if (node.nodeName === 'IMG') {
                  editor.execCommand('mceImage');
                }
              }
            });

            editor.ui.registry.addMenuButton('insertMore', {
              icon: 'insertMore',
              tooltip: '插入更多',
              fetch: (success) => {
                success([
                  {
                    type: 'menuitem',
                    icon: 'insert-link',
                    text: '插入链接',
                    onAction: () => {
                      const action = customLink(editor);
                      action();
                    }
                  },
                  {
                    type: 'menuitem',
                    icon: 'insert-image',
                    text: '插入图片',
                    onAction: () => {
                      editor.focus();
                      const action = customImage(editor);
                      action();
                    }
                  },
                  {
                    type: 'nestedmenuitem',
                    icon: 'insert-video',
                    text: '插入视频',
                    getSubmenuItems: () => [
                      {
                        type: 'menuitem',
                        text: '本地上传',
                        onAction: () => {
                          setMediaType('video');
                          const action = customVideo(editor);
                          action();
                        }
                      },
                      {
                        type: 'menuitem',
                        text: '站内视频',
                        onAction: () => {
                          setMediaType('video');
                          setIsSelect(true);
                        }
                      }
                    ]
                  },
                  {
                    type: 'menuitem',
                    icon: 'insert-model',
                    text: '插入模型',
                    onAction: () => {
                      setMediaType('model');
                      setIsSelect(true);
                    }
                  }
                ]);
              }
            });
            // 切换按钮图标
            icons.forEach((item) => {
              editor.ui.registry.addIcon(item.name, item.icon);
            });
          }
        }}
      />
      {/* <FilterResource
        isOpen={isSelect}
        mediaType={mediaType}
        onSubmit={insertResource}
        onClose={() => setIsSelect(false)}
      /> */}
      <ResourceLibraryModal mediaType={mediaType} isOpen={isSelect} onCancel={() => setIsSelect(false)} onSubmit={insertResource} />
    </div>
  );
}
