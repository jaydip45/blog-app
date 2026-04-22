'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, List, ListOrdered, Quote, Heading1, Heading2 } from 'lucide-react';

export default function Editor({ content, onChange }: { content: string, onChange: (content: string) => void }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-slate dark:prose-invert max-w-none min-h-[300px] p-4 outline-none',
      },
    },
  });

  if (!editor) return null;

  const MenuButton = ({ onClick, isActive, children }: any) => (
    <button
      onClick={(e) => { e.preventDefault(); onClick(); }}
      className={`p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${isActive ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30' : ''}`}
    >
      {children}
    </button>
  );

  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
      <div className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-2 flex flex-wrap gap-1">
        <MenuButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')}>
          <Bold className="w-5 h-5" />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')}>
          <Italic className="w-5 h-5" />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive('heading', { level: 1 })}>
          <Heading1 className="w-5 h-5" />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })}>
          <Heading2 className="w-5 h-5" />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')}>
          <List className="w-5 h-5" />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')}>
          <ListOrdered className="w-5 h-5" />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')}>
          <Quote className="w-5 h-5" />
        </MenuButton>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
