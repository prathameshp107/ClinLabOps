import React, { useEffect, useState, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';
import { ySyncPlugin, yUndoPlugin, yCursorPlugin } from 'y-prosemirror';
import { Button } from '@/components/ui/button';
import { Undo, Redo } from 'lucide-react';

const CollaborativeEditor = ({
    content,
    onUpdate,
    elnId,
    onConnect,
    onDisconnect,
    userName = 'Anonymous'
}) => {
    const [ydoc, setYDoc] = useState(null);
    const [awareness, setAwareness] = useState(null);
    const providerRef = useRef(null);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: 'Start writing your lab notes here...',
            }),
            ySyncPlugin(ydoc?.get('richtext', Y.XmlFragment) || new Y.XmlFragment()),
            yUndoPlugin(),
        ],
        content: content,
        onUpdate: ({ editor }) => {
            if (onUpdate) {
                onUpdate(editor.getHTML());
            }
        },
    });

    useEffect(() => {
        if (!elnId) return;

        // Create Yjs document
        const doc = new Y.Doc();
        setYDoc(doc);

        // Configure WebsocketProvider
        const provider = new WebsocketProvider(
            process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:5000',
            `eln-${elnId}`,
            doc
        );

        providerRef.current = provider;

        // Set up awareness
        const awarenessInstance = provider.awareness;
        setAwareness(awarenessInstance);

        awarenessInstance.setLocalState({
            user: {
                name: userName,
                color: '#' + Math.floor(Math.random() * 16777215).toString(16), // Random color
            },
        });

        // Notify parent about connection
        if (onConnect) {
            onConnect(awarenessInstance);
        }

        // Cleanup on unmount
        return () => {
            if (provider) {
                provider.destroy();
            }
            if (doc) {
                doc.destroy();
            }
            if (onDisconnect) {
                onDisconnect();
            }
        };
    }, [elnId, userName, onConnect, onDisconnect]);

    // Update editor content when prop changes
    useEffect(() => {
        if (editor && content && content !== editor.getHTML()) {
            editor.commands.setContent(content, false);
        }
    }, [editor, content]);

    if (!editor) {
        return <div>Loading editor...</div>;
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center space-x-2 mb-2">
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                >
                    <Undo className="h-4 w-4" />
                </Button>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                >
                    <Redo className="h-4 w-4" />
                </Button>
            </div>
            <EditorContent
                editor={editor}
                className="flex-1 min-h-[400px] p-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>
    );
};

export default CollaborativeEditor;