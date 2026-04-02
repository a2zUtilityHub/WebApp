import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { Link } from '@tiptap/extension-link';
import { Toggle } from '@/components/ui/toggle';
import { Bold, Italic, List, ListOrdered, Link as LinkIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const RichTextEditor = ({ value, onChange, className }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: value || '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[100px] p-3',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className={cn("border rounded-md bg-transparent", className)}>
      <div className="flex flex-wrap items-center gap-1 p-1 border-b bg-muted/30">
        <Toggle
          size="sm"
          pressed={editor.isActive('bold')}
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
          aria-label="Toggle bold"
        >
          <Bold className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive('italic')}
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}
          aria-label="Toggle italic"
        >
          <Italic className="h-4 w-4" />
        </Toggle>
        <div className="w-px h-6 bg-border mx-1" />
        <Toggle
          size="sm"
          pressed={editor.isActive('bulletList')}
          onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
          aria-label="Toggle bullet list"
        >
          <List className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive('orderedList')}
          onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
          aria-label="Toggle ordered list"
        >
          <ListOrdered className="h-4 w-4" />
        </Toggle>
        <div className="w-px h-6 bg-border mx-1" />
        <Toggle
            size="sm"
            pressed={editor.isActive('link')}
            onPressedChange={() => {
                const previousUrl = editor.getAttributes('link').href
                const url = window.prompt('URL', previousUrl)
                if (url === null) return
                if (url === '') {
                    editor.chain().focus().extendMarkRange('link').unsetLink().run()
                    return
                }
                editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
            }}
        >
            <LinkIcon className="h-4 w-4" />
        </Toggle>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;