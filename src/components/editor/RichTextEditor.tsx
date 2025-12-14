'use client';

import React, { useCallback, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Underline } from '@tiptap/extension-underline';
import { TextAlign } from '@tiptap/extension-text-align';
import { Link } from '@tiptap/extension-link';
import { Image } from '@tiptap/extension-image';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const MenuBar = ({ editor }: any) => {
  if (!editor) {
    return null;
  }

  const addImage = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const url = window.prompt('Enter image URL');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const setLink = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter URL', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  return (
    <div className="border-b border-neutral-700 bg-neutral-800/50 p-3 flex flex-wrap gap-2 rounded-t-xl">
      {/* Text Formatting */}
      <div className="flex gap-1 border-r border-neutral-700 pr-2">
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleBold().run(); }}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`p-2 rounded-lg hover:bg-neutral-700 transition-colors ${
            editor.isActive('bold') ? 'bg-primary-500 text-white' : 'text-neutral-300'
          }`}
          title="Bold (Ctrl+B)"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z" />
          </svg>
        </button>
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleItalic().run(); }}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`p-2 rounded-lg hover:bg-neutral-700 transition-colors ${
            editor.isActive('italic') ? 'bg-primary-500 text-white' : 'text-neutral-300'
          }`}
          title="Italic (Ctrl+I)"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 4h8M8 20h8M12 4l-4 16" />
          </svg>
        </button>
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleUnderline().run(); }}
          className={`p-2 rounded-lg hover:bg-neutral-700 transition-colors ${
            editor.isActive('underline') ? 'bg-primary-500 text-white' : 'text-neutral-300'
          }`}
          title="Underline (Ctrl+U)"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 20h14M7 4v7a5 5 0 0010 0V4" />
          </svg>
        </button>
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleStrike().run(); }}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={`p-2 rounded-lg hover:bg-neutral-700 transition-colors ${
            editor.isActive('strike') ? 'bg-primary-500 text-white' : 'text-neutral-300'
          }`}
          title="Strikethrough"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M7 4h10M7 20h10" />
          </svg>
        </button>
      </div>

      {/* Headings */}
      <div className="flex gap-1 border-r border-neutral-700 pr-2">
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 1 }).run(); }}
          className={`px-3 py-2 rounded-lg hover:bg-neutral-700 transition-colors font-bold ${
            editor.isActive('heading', { level: 1 }) ? 'bg-primary-500 text-white' : 'text-neutral-300'
          }`}
          title="Heading 1"
        >
          H1
        </button>
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 2 }).run(); }}
          className={`px-3 py-2 rounded-lg hover:bg-neutral-700 transition-colors font-bold ${
            editor.isActive('heading', { level: 2 }) ? 'bg-primary-500 text-white' : 'text-neutral-300'
          }`}
          title="Heading 2"
        >
          H2
        </button>
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 3 }).run(); }}
          className={`px-3 py-2 rounded-lg hover:bg-neutral-700 transition-colors font-bold ${
            editor.isActive('heading', { level: 3 }) ? 'bg-primary-500 text-white' : 'text-neutral-300'
          }`}
          title="Heading 3"
        >
          H3
        </button>
      </div>

      {/* Text Color */}
      <div className="flex gap-1 border-r border-neutral-700 pr-2">
        <input
          type="color"
          onInput={(e) => editor.chain().focus().setColor((e.target as HTMLInputElement).value).run()}
          value={editor.getAttributes('textStyle').color || '#ffffff'}
          className="w-10 h-10 rounded-lg cursor-pointer"
          title="Text Color"
        />
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().unsetColor().run(); }}
          className="p-2 rounded-lg hover:bg-neutral-700 transition-colors text-neutral-300"
          title="Reset Color"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Lists */}
      <div className="flex gap-1 border-r border-neutral-700 pr-2">
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleBulletList().run(); }}
          className={`p-2 rounded-lg hover:bg-neutral-700 transition-colors ${
            editor.isActive('bulletList') ? 'bg-primary-500 text-white' : 'text-neutral-300'
          }`}
          title="Bullet List"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleOrderedList().run(); }}
          className={`p-2 rounded-lg hover:bg-neutral-700 transition-colors ${
            editor.isActive('orderedList') ? 'bg-primary-500 text-white' : 'text-neutral-300'
          }`}
          title="Numbered List"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20h14M7 12h14M7 4h14M3 20h1M3 12h1M3 4h1" />
          </svg>
        </button>
      </div>

      {/* Alignment */}
      <div className="flex gap-1 border-r border-neutral-700 pr-2">
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().setTextAlign('left').run(); }}
          className={`p-2 rounded-lg hover:bg-neutral-700 transition-colors ${
            editor.isActive({ textAlign: 'left' }) ? 'bg-primary-500 text-white' : 'text-neutral-300'
          }`}
          title="Align Left"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h14" />
          </svg>
        </button>
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().setTextAlign('center').run(); }}
          className={`p-2 rounded-lg hover:bg-neutral-700 transition-colors ${
            editor.isActive({ textAlign: 'center' }) ? 'bg-primary-500 text-white' : 'text-neutral-300'
          }`}
          title="Align Center"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M7 12h10M5 18h14" />
          </svg>
        </button>
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().setTextAlign('right').run(); }}
          className={`p-2 rounded-lg hover:bg-neutral-700 transition-colors ${
            editor.isActive({ textAlign: 'right' }) ? 'bg-primary-500 text-white' : 'text-neutral-300'
          }`}
          title="Align Right"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M10 12h10M6 18h14" />
          </svg>
        </button>
      </div>

      {/* Link and Image */}
      <div className="flex gap-1 border-r border-neutral-700 pr-2">
        <button
          type="button"
          onClick={setLink}
          className={`p-2 rounded-lg hover:bg-neutral-700 transition-colors ${
            editor.isActive('link') ? 'bg-primary-500 text-white' : 'text-neutral-300'
          }`}
          title="Add Link"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </button>
        <button
          type="button"
          onClick={addImage}
          className="p-2 rounded-lg hover:bg-neutral-700 transition-colors text-neutral-300"
          title="Add Image"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>
      </div>

      {/* Other Actions */}
      <div className="flex gap-1">
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleBlockquote().run(); }}
          className={`p-2 rounded-lg hover:bg-neutral-700 transition-colors ${
            editor.isActive('blockquote') ? 'bg-primary-500 text-white' : 'text-neutral-300'
          }`}
          title="Quote"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleCodeBlock().run(); }}
          className={`p-2 rounded-lg hover:bg-neutral-700 transition-colors ${
            editor.isActive('codeBlock') ? 'bg-primary-500 text-white' : 'text-neutral-300'
          }`}
          title="Code Block"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </button>
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().setHorizontalRule().run(); }}
          className="p-2 rounded-lg hover:bg-neutral-700 transition-colors text-neutral-300"
          title="Horizontal Line"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ content, onChange, placeholder = 'Start writing your blog post...' }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      TextStyle,
      Color,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary-400 underline hover:text-primary-300 transition-colors',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg my-4',
        },
      }),
    ],
    content: content,
    immediatelyRender: false,
    editable: true,
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[500px] p-6 text-neutral-100',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Update editor content when the content prop changes (e.g., when loading a draft)
  useEffect(() => {
    if (editor && content && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]); // Only depend on content to avoid infinite loop

  if (!editor) {
    return (
      <div className="border border-neutral-700 rounded-xl bg-neutral-900/50 shadow-xl overflow-hidden">
        <div className="h-[500px] flex items-center justify-center text-neutral-500">
          Loading editor...
        </div>
      </div>
    );
  }

  return (
    <div className="border border-neutral-700 rounded-xl bg-neutral-900/50 shadow-xl overflow-hidden">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};
