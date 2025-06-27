import React, { useState } from "react";
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { Bold, Italic, Underline as UnderlineIcon, List, ListOrdered, Link as LinkIcon, AlignLeft, AlignCenter, AlignRight, Quote, Code, Minus } from 'lucide-react';

function EditorMenuBar({ editor }) {
    if (!editor) return null;
    const ToolbarButton = ({ isActive, onClick, children, title }) => (
        <button
            type="button"
            title={title}
            className={`
        relative p-2 rounded-lg transition-all duration-200 ease-in-out
        hover:bg-slate-100 dark:hover:bg-slate-800
        active:scale-95 active:bg-slate-200 dark:active:bg-slate-700
        ${isActive
                    ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }
      `}
            onClick={onClick}
        >
            {children}
            {isActive && (
                <div className="absolute inset-0 bg-blue-500/10 rounded-lg animate-pulse pointer-events-none" />
            )}
        </button>
    );
    const Divider = () => (
        <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1" />
    );
    return (
        <div className="flex items-center gap-1 p-3 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-b border-slate-200 dark:border-slate-700 rounded-t-xl">
            <div className="flex items-center gap-1">
                <ToolbarButton
                    isActive={editor.isActive('bold')}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    title="Bold (Ctrl+B)"
                >
                    <Bold size={16} />
                </ToolbarButton>
                <ToolbarButton
                    isActive={editor.isActive('italic')}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    title="Italic (Ctrl+I)"
                >
                    <Italic size={16} />
                </ToolbarButton>
                <ToolbarButton
                    isActive={editor.isActive('underline')}
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    title="Underline (Ctrl+U)"
                >
                    <UnderlineIcon size={16} />
                </ToolbarButton>
            </div>
            <Divider />
            <div className="flex items-center gap-1">
                <ToolbarButton
                    isActive={editor.isActive({ textAlign: 'left' })}
                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    title="Align Left"
                >
                    <AlignLeft size={16} />
                </ToolbarButton>
                <ToolbarButton
                    isActive={editor.isActive({ textAlign: 'center' })}
                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    title="Align Center"
                >
                    <AlignCenter size={16} />
                </ToolbarButton>
                <ToolbarButton
                    isActive={editor.isActive({ textAlign: 'right' })}
                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    title="Align Right"
                >
                    <AlignRight size={16} />
                </ToolbarButton>
            </div>
            <Divider />
            <div className="flex items-center gap-1">
                <ToolbarButton
                    isActive={editor.isActive('bulletList')}
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    title="Bullet List"
                >
                    <List size={16} />
                </ToolbarButton>
                <ToolbarButton
                    isActive={editor.isActive('orderedList')}
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    title="Numbered List"
                >
                    <ListOrdered size={16} />
                </ToolbarButton>
            </div>
            <Divider />
            <div className="flex items-center gap-1">
                <ToolbarButton
                    isActive={editor.isActive('blockquote')}
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    title="Quote"
                >
                    <Quote size={16} />
                </ToolbarButton>
                <ToolbarButton
                    isActive={editor.isActive('code')}
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    title="Inline Code"
                >
                    <Code size={16} />
                </ToolbarButton>
                <ToolbarButton
                    isActive={editor.isActive('link')}
                    onClick={() => {
                        const url = window.prompt('Enter URL:');
                        if (url) editor.chain().focus().setLink({ href: url }).run();
                    }}
                    title="Add Link"
                >
                    <LinkIcon size={16} />
                </ToolbarButton>
            </div>
            <Divider />
            <ToolbarButton
                isActive={false}
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
                title="Horizontal Rule"
            >
                <Minus size={16} />
            </ToolbarButton>
        </div>
    );
}

export default function RichTextEditor({ value = '', onChange, placeholder = 'Add a detailed description...' }) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link,
            Placeholder.configure({ placeholder }),
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'p-4 min-h-[160px] prose prose-sm max-w-none focus:outline-none bg-transparent text-slate-900 dark:text-slate-100 font-medium leading-relaxed',
            },
        },
    });
    const [isFocused, setIsFocused] = useState(false);
    return (
        <div className={`
      relative overflow-hidden rounded-xl border transition-all duration-300 ease-in-out
      ${isFocused
                ? 'border-blue-400 dark:border-blue-500 shadow-lg shadow-blue-500/20'
                : 'border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md'
            }
      bg-white dark:bg-slate-900
    `}>
            <EditorMenuBar editor={editor} />
            <div className="relative">
                <EditorContent
                    editor={editor}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />
                <div className={`
          absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500
          transition-all duration-300 ease-in-out
          ${isFocused ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}
        `} />
            </div>
            <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 rounded-b-xl">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>Rich text editor</span>
                    <span>{(editor?.getText() || '').length} characters</span>
                </div>
            </div>
        </div>
    );
} 