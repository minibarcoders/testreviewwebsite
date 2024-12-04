import { Editor } from '@tinymce/tinymce-react';
import { useState, useRef } from 'react';
import { Upload, X, ImageIcon } from 'lucide-react';
import ImageGallery from './ImageGallery';

interface ArticleEditorProps {
  initialData?: {
    title: string;
    content: string;
    coverImage?: string;
    tags: string[];
  };
  onSave: (data: any) => void;
}

export default function ArticleEditor({ initialData, onSave }: ArticleEditorProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [coverImage, setCoverImage] = useState(initialData?.coverImage);
  const [tagInput, setTagInput] = useState('');
  const [showImageGallery, setShowImageGallery] = useState(false);
  const editorRef = useRef<any>(null);

  const handleSave = async () => {
    if (!title || !content) {
      alert('Please fill in all required fields');
      return;
    }

    // Use OpenAI to generate tags if none are provided
    if (tags.length === 0) {
      try {
        const response = await fetch('/api/generate-tags', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content }),
        });
        const data = await response.json();
        setTags(data.tags);
      } catch (error) {
        console.error('Error generating tags:', error);
      }
    }

    onSave({
      title,
      content,
      tags,
      coverImage,
    });
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      setCoverImage(data.url);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const addTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleImageSelect = (url: string) => {
    // Insert image at cursor position
    const content = `<img src="${url}" alt="Article image" class="rounded-lg max-w-full h-auto" />`;
    (window as any).tinymce.activeEditor.insertContent(content);
    setShowImageGallery(false);
  };

  return (
    <div className="space-y-6">
      {/* Title Input */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="Enter article title"
        />
      </div>

      {/* Cover Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Cover Image</label>
        <div className="mt-1 flex items-center">
          {coverImage ? (
            <div className="relative">
              <img
                src={coverImage}
                alt="Cover"
                className="h-32 w-48 object-cover rounded-lg"
              />
              <button
                onClick={() => setCoverImage(undefined)}
                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <label className="flex justify-center items-center h-32 w-48 rounded-lg border-2 border-dashed border-gray-300 hover:border-indigo-500 cursor-pointer">
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
              <Upload className="h-6 w-6 text-gray-400" />
            </label>
          )}
        </div>
      </div>

      {/* Rich Text Editor */}
      <div className="relative">
        <div className="mb-4 flex gap-2">
          <button
            onClick={() => setShowImageGallery(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <ImageIcon className="h-4 w-4" />
            <span>Add Image</span>
          </button>
        </div>

        <Editor
          onInit={(evt, editor) => editorRef.current = editor}
          value={content}
          onEditorChange={(newContent) => setContent(newContent)}
          init={{
            height: 500,
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
            content_style: 'body { font-family:Inter,Arial,sans-serif; font-size:16px }'
          }}
        />

        {showImageGallery && (
          <ImageGallery
            onImageSelect={handleImageSelect}
            onClose={() => setShowImageGallery(false)}
          />
        )}
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Tags</label>
        <div className="mt-1">
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 inline-flex items-center p-0.5 rounded-full text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTag()}
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Add a tag"
            />
            <button
              type="button"
              onClick={addTag}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Add Tag
            </button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Save Article
        </button>
      </div>
    </div>
  );
}
