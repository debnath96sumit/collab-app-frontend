import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect } from 'react';

const EditorCanvas = ({ content, onChange, onCursorMove, onEditorReady }) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link.configure({
                openOnClick: false, // so clicking a link doesn't navigate away while editing
            }),
            Placeholder.configure({
                placeholder: 'Start typing your document here...',
            }),
        ],
        content: content || '',

        onCreate({ editor }) {
            onEditorReady?.(editor);
        },

        onUpdate({ editor }) {
            onChange(editor.getHTML());
        },

        onSelectionUpdate({ editor }) {
            const pos = editor.state.selection.anchor;
            onCursorMove?.(pos);
        },
    });

    // Sync incoming socket content without triggering echo loop
    useEffect(() => {
        if (!editor || editor.isDestroyed) return;

        const incoming = content || '';
        const current = editor.getHTML();

        if (incoming !== current) {
            // Preserve cursor position
            const { from, to } = editor.state.selection;
            editor.commands.setContent(incoming, false);
            // Restore cursor if still valid
            const docSize = editor.state.doc.content.size;
            if (from <= docSize && to <= docSize) {
                editor.commands.setTextSelection({ from, to });
            }
        }
    }, [content]);

    return (
        <article className="bg-surface-container-low min-h-screen p-8 md:p-16 shadow-2xl shadow-black/40 rounded-t-2xl relative">
            <EditorContent
                editor={editor}
                className="tiptap-editor"
            />
        </article>
    );
};

export default EditorCanvas;