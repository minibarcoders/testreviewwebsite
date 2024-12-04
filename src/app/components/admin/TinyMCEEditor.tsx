'use client';

import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

interface TinyMCEEditorProps {
  value: string;
  onChange: (content: string) => void;
  height?: number;
}

const TinyMCEEditor: React.FC<TinyMCEEditorProps> = ({
  value,
  onChange,
  height = 500,
}) => {
  const editorRef = useRef<any>(null);

  return (
    <Editor
      apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
      onInit={(_, editor) => editorRef.current = editor}
      value={value}
      init={{
        height,
        menubar: true,
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
          'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
          'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
        ],
        toolbar: 'undo redo | blocks | ' +
          'bold italic forecolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'removeformat | help',
        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
        branding: false,
        promotion: false,
        skin_url: 'https://cdn.tiny.cloud/1/no-api-key/tinymce/6.8.3/skins/ui/oxide',
        content_css: 'https://cdn.tiny.cloud/1/no-api-key/tinymce/6.8.3/skins/content/default/content.css',
        setup: (editor) => {
          editor.on('init', () => {
            editor.setContent(value);
          });
        },
        images_upload_handler: async (blobInfo) => {
          try {
            const formData = new FormData();
            formData.append('file', blobInfo.blob(), blobInfo.filename());
            
            const response = await fetch('/api/upload', {
              method: 'POST',
              body: formData,
            });
            
            if (!response.ok) {
              throw new Error('Upload failed');
            }
            
            const data = await response.json();
            return data.url;
          } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
          }
        },
      }}
      onEditorChange={(content) => {
        onChange(content);
      }}
    />
  );
};

export default TinyMCEEditor;
