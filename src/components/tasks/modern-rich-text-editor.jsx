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
        hover:bg-zinc-100 dark:hover:bg-zinc-700
        active:scale-95
        ${isActive
                    ? 'bg-primary/10 text-primary shadow-sm dark:bg-primary/20'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }
      `}
            onClick={onClick}
        >
            {children}
        </button>
    );
    const Divider = () => (
        <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-700 mx-1" />
    );
    return (
        <div className="flex items-center gap-1 p-2 bg-zinc-50 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
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
            Placeholder.configure({
                placeholder,
                emptyNodeClass: 'is-empty before:content-[attr(data-placeholder)] before:text-zinc-400 before:dark:text-zinc-500 before:absolute before:top-3'
            }),
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'p-3 min-h-[100px] prose prose-sm max-w-none focus:outline-none bg-transparent text-zinc-900 dark:text-zinc-100 font-normal leading-relaxed relative',
            },
        },
    });
    const [isFocused, setIsFocused] = useState(false);
    return (
        <div className={`
      relative overflow-hidden rounded-b-xl
      ${isFocused
                ? 'ring-2 ring-primary/30 dark:ring-primary/50'
                : ''
            }
      bg-white dark:bg-zinc-900
    `}>
            <EditorMenuBar editor={editor} />
            <div className="relative">
                <EditorContent
                    editor={editor}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className="dark:bg-zinc-900"
                />
                {/* Dark mode specific styling for the content area */}
                <style jsx global>{`
                    .dark .ProseMirror {
                        background-color: #18181b;
                        color: #e4e4e7;
                    }
                    .dark .ProseMirror p {
                        color: #e4e4e7;
                    }
                    .dark .ProseMirror h1,
                    .dark .ProseMirror h2,
                    .dark .ProseMirror h3 {
                        color: #fafafa;
                    }
                    .dark .ProseMirror a {
                        color: #60a5fa;
                    }
                    .dark .ProseMirror blockquote {
                        border-left-color: #3f3f46;
                        color: #d4d4d8;
                    }
                    .dark .ProseMirror code {
                        background-color: #27272a;
                        color: #e4e4e7;
                    }
                    .dark .ProseMirror pre {
                        background-color: #27272a;
                        color: #e4e4e7;
                    }
                    .dark .ProseMirror ul li::marker,
                    .dark .ProseMirror ol li::marker {
                        color: #a1a1aa;
                    }
                    .dark .ProseMirror hr {
                        border-color: #3f3f46;
                    }
                `}</style>
            </div>
        </div>
    );
}