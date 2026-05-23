import { EditorContent } from '@tiptap/react';
import CollaborativeCursors from './CollaborativeCursors';

const EditorCanvas = ({ editor, cursors, onlineUsers }) => {
    if (!editor) {
        return (
            <div className="flex items-center justify-center min-h-[600px] text-on-surface-variant/40">
                Loding Editor...
            </div>
        )
    }

    return (
        <article className="bg-surface-container-low min-h-screen p-8 md:p-16 shadow-2xl shadow-black/40 rounded-t-2xl relative">
            <div className="relative">
                <CollaborativeCursors
                    editor={editor}
                    cursors={cursors}
                    onlineUsers={onlineUsers}
                />
                <EditorContent
                    editor={editor}
                    className="tiptap-editor"
                />
            </div>
        </article>
    );
};

export default EditorCanvas;
