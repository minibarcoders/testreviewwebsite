'use client';

import { ChangeEvent } from 'react';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const Editor: React.FC<EditorProps> = ({ value, onChange, className = '' }) => {
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <textarea
      value={value}
      onChange={handleChange}
      className={`min-h-[400px] ${className}`}
      placeholder="Write your content here..."
    />
  );
};

export default Editor;
