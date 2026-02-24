import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useEditor, EditorContent, BubbleMenu, FloatingMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import Image from '@tiptap/extension-image';
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import CharacterCount from '@tiptap/extension-character-count';
import Color from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';
import { Button } from '@/components/ui/button';
import {
    Undo, Redo, Bold as BoldIcon, Italic as ItalicIcon, Underline as UnderlineIcon,
    Strikethrough, AlignLeft, AlignCenter, AlignRight, AlignJustify,
    Image as ImageIcon, Type, Heading1, Heading2, List, ListOrdered,
    Quote, Code, Table as TableIcon, Square, Highlighter, CheckSquare,
    Palette, MoreHorizontal, Maximize2, Minimize2, Superscript as SupraIcon, Subscript as SubIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

const CollaborativeEditor = ({
    content,
    onUpdate,
    elnId,
    onConnect,
    onDisconnect,
    userName = 'Anonymous',
    onImageInsert = null
}) => {
    const [provider, setProvider] = useState(null);
    const [ydoc] = useState(() => new Y.Doc());
    const [isFullScreen, setIsFullScreen] = useState(false);

    // Initialize Yjs Provider
    useEffect(() => {
        if (!elnId) return;

        const newProvider = new WebsocketProvider(
            process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:5000',
            `eln-${elnId}`,
            ydoc
        );

        setProvider(newProvider);

        if (onConnect) {
            onConnect(newProvider.awareness);
        }

        return () => {
            newProvider.destroy();
            if (onDisconnect) onDisconnect();
        };
    }, [elnId, ydoc]);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                // The Collaboration extension handles its own history,
                // so we disable the standard history if elnId is present.
                history: elnId ? false : true,
                bold: true,
                italic: true,
                strike: true,
                underline: false,
                code: true,
                blockquote: true,
                codeBlock: true,
                horizontalRule: true,
                dropcursor: true,
                gapcursor: true,
                hardBreak: true,
                heading: { levels: [1, 2, 3] },
                listItem: true,
                orderedList: true,
                bulletList: true,
                paragraph: true,
                text: true,
            }),
            Underline,
            Subscript,
            Superscript,
            Highlight.configure({ multicolor: true }),
            TextStyle,
            Color,
            TaskList,
            TaskItem.configure({
                nested: true,
            }),
            CharacterCount.configure({
                limit: 20000,
            }),
            Image.configure({
                inline: true,
                allowBase64: true,
                HTMLAttributes: {
                    class: 'max-w-full h-auto rounded-lg shadow-md my-4 transition-all hover:ring-2 hover:ring-blue-400',
                },
            }),
            Table.configure({
                resizable: true,
                HTMLAttributes: {
                    class: 'border-collapse border border-gray-300 w-full my-4',
                },
            }),
            TableRow,
            TableHeader,
            TableCell,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Placeholder.configure({
                placeholder: ({ node }) => {
                    if (node.type.name === 'heading') {
                        return 'Report Heading...';
                    }
                    return 'Document your lab findings here...';
                },
            }),
            // Official Collaboration extensions
            ...(elnId ? [
                Collaboration.configure({
                    document: ydoc,
                    field: 'richtext',
                }),
                CollaborationCursor.configure({
                    provider: provider,
                    user: {
                        name: userName,
                        color: '#' + Math.floor(Math.random() * 16777215).toString(16),
                    },
                }),
            ] : []),
        ],
        // If elnId is present, Collaboration extension handles the content from Yjs.
        // If not, we use the content prop.
        content: elnId ? null : content,
        onUpdate: ({ editor }) => {
            if (onUpdate) {
                onUpdate(editor.getHTML());
            }
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none max-w-none min-h-[600px] p-10 bg-white selection:bg-blue-100',
            },
        },
    }, [provider, elnId]); // Re-init editor when provider is ready

    // Sync content if not using collaboration
    useEffect(() => {
        if (editor && content && content !== editor.getHTML() && !elnId) {
            editor.commands.setContent(content, false);
        }
    }, [editor, content, elnId]);

    const addImage = () => {
        if (onImageInsert) {
            onImageInsert((url) => {
                editor.chain().focus().setImage({ src: url }).run();
            });
        } else {
            const url = window.prompt('Enter image URL');
            if (url) {
                editor.chain().focus().setImage({ src: url }).run();
            }
        }
    };

    if (!editor) {
        return (
            <div className="flex flex-col items-center justify-center h-[500px] border rounded-xl bg-gray-50/50 space-y-4">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-muted-foreground animate-pulse">Initializing Laboratory Editor...</p>
            </div>
        );
    }

    return (
        <div className={cn(
            "flex flex-col transition-all duration-300 rounded-xl border shadow-sm overflow-hidden bg-white mt-4",
            isFullScreen ? "fixed inset-0 z-[100] bg-white rounded-none" : "relative h-full border-gray-200"
        )}>
            {/* Action Bar */}
            <div className="sticky top-0 z-20 flex flex-wrap items-center gap-1 p-2 bg-white/95 backdrop-blur-sm border-b shadow-sm">
                <div className="flex items-center gap-1 pr-2 border-r mr-1">
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().undo()}
                        className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-500 transition-colors"
                        title="Undo (Ctrl+Z)"
                    >
                        <Undo className="h-4 w-4" />
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={!editor.can().redo()}
                        className="h-8 w-8 p-0 hover:bg-green-50 hover:text-green-500 transition-colors"
                        title="Redo (Ctrl+Y)"
                    >
                        <Redo className="h-4 w-4" />
                    </Button>
                </div>

                <div className="flex items-center gap-1 pr-2 border-r mr-1">
                    <Button
                        size="sm"
                        variant={editor.isActive('heading', { level: 1 }) ? 'secondary' : 'ghost'}
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        className="h-8 w-8 p-0"
                        title="Main Heading"
                    >
                        <Heading1 className="h-4 w-4" />
                    </Button>
                    <Button
                        size="sm"
                        variant={editor.isActive('heading', { level: 2 }) ? 'secondary' : 'ghost'}
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        className="h-8 w-8 p-0"
                        title="Sub Heading"
                    >
                        <Heading2 className="h-4 w-4" />
                    </Button>
                    <Button
                        size="sm"
                        variant={editor.isActive('paragraph') ? 'secondary' : 'ghost'}
                        onClick={() => editor.chain().focus().setParagraph().run()}
                        className="h-8 w-8 p-0"
                        title="Normal Text"
                    >
                        <Type className="h-4 w-4" />
                    </Button>
                </div>

                <div className="flex items-center gap-1 pr-2 border-r mr-1">
                    <Button
                        size="sm"
                        variant={editor.isActive('bold') ? 'secondary' : 'ghost'}
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className="h-8 w-8 p-0 font-bold"
                        title="Bold"
                    >
                        <BoldIcon className="h-4 w-4" />
                    </Button>
                    <Button
                        size="sm"
                        variant={editor.isActive('italic') ? 'secondary' : 'ghost'}
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className="h-8 w-8 p-0 italic"
                        title="Italic"
                    >
                        <ItalicIcon className="h-4 w-4" />
                    </Button>
                    <Button
                        size="sm"
                        variant={editor.isActive('underline') ? 'secondary' : 'ghost'}
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        className="h-8 w-8 p-0 underline"
                        title="Underline"
                    >
                        <UnderlineIcon className="h-4 w-4" />
                    </Button>
                    <Button
                        size="sm"
                        variant={editor.isActive('strike') ? 'secondary' : 'ghost'}
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        className="h-8 w-8 p-0 line-through"
                        title="Strikethrough"
                    >
                        <Strikethrough className="h-4 w-4" />
                    </Button>
                    <Button
                        size="sm"
                        variant={editor.isActive('highlight') ? 'secondary' : 'ghost'}
                        onClick={() => editor.chain().focus().toggleHighlight().run()}
                        className="h-8 w-8 p-0"
                        title="Highlight"
                    >
                        <Highlighter className="h-4 w-4" />
                    </Button>
                    <Button
                        size="sm"
                        variant={editor.isActive('superscript') ? 'secondary' : 'ghost'}
                        onClick={() => editor.chain().focus().toggleSuperscript().run()}
                        className="h-8 w-8 p-0"
                        title="Superscript"
                    >
                        <SupraIcon className="h-4 w-4" />
                    </Button>
                    <Button
                        size="sm"
                        variant={editor.isActive('subscript') ? 'secondary' : 'ghost'}
                        onClick={() => editor.chain().focus().toggleSubscript().run()}
                        className="h-8 w-8 p-0"
                        title="Subscript"
                    >
                        <SubIcon className="h-4 w-4" />
                    </Button>
                </div>

                <div className="flex items-center gap-1 pr-2 border-r mr-1">
                    <Button
                        size="sm"
                        variant={editor.isActive('bulletList') ? 'secondary' : 'ghost'}
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className="h-8 w-8 p-0"
                        title="Bullet List"
                    >
                        <List className="h-4 w-4" />
                    </Button>
                    <Button
                        size="sm"
                        variant={editor.isActive('orderedList') ? 'secondary' : 'ghost'}
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        className="h-8 w-8 p-0"
                        title="Numbered List"
                    >
                        <ListOrdered className="h-4 w-4" />
                    </Button>
                    <Button
                        size="sm"
                        variant={editor.isActive('taskList') ? 'secondary' : 'ghost'}
                        onClick={() => editor.chain().focus().toggleTaskList().run()}
                        className="h-8 w-8 p-0"
                        title="Task Checklist"
                    >
                        <CheckSquare className="h-4 w-4" />
                    </Button>
                </div>

                <div className="flex items-center gap-1 pr-2 border-r mr-1">
                    <Button
                        size="sm"
                        variant={editor.isActive({ textAlign: 'left' }) ? 'secondary' : 'ghost'}
                        onClick={() => editor.chain().focus().setTextAlign('left').run()}
                        className="h-8 w-8 p-0"
                    >
                        <AlignLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        size="sm"
                        variant={editor.isActive({ textAlign: 'center' }) ? 'secondary' : 'ghost'}
                        onClick={() => editor.chain().focus().setTextAlign('center').run()}
                        className="h-8 w-8 p-0"
                    >
                        <AlignCenter className="h-4 w-4" />
                    </Button>
                    <Button
                        size="sm"
                        variant={editor.isActive({ textAlign: 'right' }) ? 'secondary' : 'ghost'}
                        onClick={() => editor.chain().focus().setTextAlign('right').run()}
                        className="h-8 w-8 p-0"
                    >
                        <AlignRight className="h-4 w-4" />
                    </Button>
                </div>

                <div className="flex items-center gap-1 mr-2">
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
                        className="h-8 w-8 p-0 hover:text-blue-600 transition-colors"
                        title="Insert Data Table"
                    >
                        <TableIcon className="h-4 w-4" />
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={addImage}
                        className="h-8 w-8 p-0 hover:text-blue-600 transition-colors"
                        title="Insert Image/Chart"
                    >
                        <ImageIcon className="h-4 w-4" />
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                        className="h-8 w-8 p-0 hover:text-blue-600 transition-colors"
                        title="Code/Formula Block"
                    >
                        <Code className="h-4 w-4" />
                    </Button>
                </div>

                <div className="ml-auto flex items-center gap-2">
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setIsFullScreen(!isFullScreen)}
                        className={cn("h-8 w-8 p-0", isFullScreen && "text-blue-600 bg-blue-50")}
                    >
                        {isFullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                    </Button>
                </div>
            </div>

            {/* Bubble Menu */}
            {editor && (
                <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }} className="flex overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl">
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={cn("h-8 rounded-none border-r px-2", editor.isActive('bold') && "bg-gray-100")}
                    >
                        <BoldIcon className="h-4 w-4 text-gray-700" />
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={cn("h-8 rounded-none border-r px-2", editor.isActive('italic') && "bg-gray-100")}
                    >
                        <ItalicIcon className="h-4 w-4 text-gray-700" />
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => editor.chain().focus().toggleHighlight().run()}
                        className={cn("h-8 rounded-none border-r px-2", editor.isActive('highlight') && "bg-gray-100")}
                    >
                        <Highlighter className="h-4 w-4 text-gray-700" />
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => editor.chain().focus().toggleSuperscript().run()}
                        className={cn("h-8 rounded-none border-r px-2", editor.isActive('superscript') && "bg-gray-100")}
                    >
                        <SupraIcon className="h-4 w-4 text-gray-700" />
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => editor.chain().focus().toggleSubscript().run()}
                        className={cn("h-8 rounded-none px-2", editor.isActive('subscript') && "bg-gray-100")}
                    >
                        <SubIcon className="h-4 w-4 text-gray-700" />
                    </Button>
                </BubbleMenu>
            )}

            {/* Main Editor Content */}
            <div className="flex-1 overflow-auto bg-gray-50/30">
                <div className="max-w-[900px] mx-auto min-h-full py-8">
                    <EditorContent
                        editor={editor}
                        className="bg-white shadow-sm border border-gray-100 rounded-lg"
                    />
                </div>
            </div>

            {/* Footer Stats */}
            <div className="flex items-center justify-between px-6 py-3 bg-white border-t text-[10px] text-gray-500 font-bold tracking-widest uppercase">
                <div className="flex items-center gap-6">
                    <span className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-gray-300" />
                        {editor.storage.characterCount.characters()} characters
                    </span>
                    <span className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-gray-300" />
                        {editor.storage.characterCount.words()} words
                    </span>
                </div>
                {elnId ? (
                    <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        Live Synchronized
                    </div>
                ) : (
                    <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        Offline Mode
                    </div>
                )}
            </div>

            <style jsx global>{`
                .ProseMirror p.is-editor-empty:first-child::before {
                    content: attr(data-placeholder);
                    float: left;
                    color: #adb5bd;
                    pointer-events: none;
                    height: 0;
                }
                .ProseMirror {
                    outline: none !important;
                }
                .ProseMirror table {
                    border-collapse: collapse;
                    table-layout: fixed;
                    width: 100%;
                    margin: 0;
                    overflow: hidden;
                }
                .ProseMirror td, .ProseMirror th {
                    min-width: 1em;
                    border: 1px solid #e2e8f0;
                    padding: 8px 12px;
                    vertical-align: top;
                    box-sizing: border-box;
                    position: relative;
                }
                .ProseMirror th {
                    font-weight: bold;
                    text-align: left;
                    background-color: #f8fafc;
                }
                .ProseMirror .selectedCell:after {
                    z-index: 2;
                    position: absolute;
                    content: "";
                    left: 0; right: 0; top: 0; bottom: 0;
                    background: rgba(59, 130, 246, 0.05);
                    pointer-events: none;
                }
                .ProseMirror .column-resize-handle {
                    position: absolute;
                    right: -2px;
                    top: 0;
                    bottom: -2px;
                    width: 4px;
                    background-color: #3b82f6;
                    pointer-events: none;
                }
                ul[data-type="taskList"] {
                    list-style: none;
                    padding: 0;
                }
                ul[data-type="taskList"] li {
                    display: flex;
                    align-items: flex-start;
                    margin-bottom: 0.5rem;
                }
                ul[data-type="taskList"] label {
                    flex: 0 0 auto;
                    margin-right: 0.75rem;
                    user-select: none;
                    margin-top: 0.25rem;
                }
                ul[data-type="taskList"] div {
                    flex: 1 1 auto;
                }
                /* Collaborative Cursor Styles */
                .collaboration-cursor__caret {
                    border-left: 2px solid #0d0d0d;
                    border-right: 2px solid #0d0d0d;
                    margin-left: -1px;
                    margin-right: -1px;
                    pointer-events: none;
                    position: relative;
                    word-break: normal;
                }
                .collaboration-cursor__label {
                    border-radius: 3px 3px 3px 0;
                    color: #fff;
                    font-size: 10px;
                    font-style: normal;
                    font-weight: 700;
                    left: -1px;
                    line-height: normal;
                    padding: 1px 4px;
                    position: absolute;
                    top: -1.4em;
                    user-select: none;
                    white-space: nowrap;
                }
            `}</style>
        </div>
    );
};

export default CollaborativeEditor;

