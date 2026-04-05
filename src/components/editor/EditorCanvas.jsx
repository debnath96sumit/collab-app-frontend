/**
 * EditorCanvas — the main writing area
 *
 * For MVP we use a simple textarea. This is intentional —
 * rich text editors (TipTap, Quill) add significant complexity.
 * Textarea is reliable, works with socket sync, and is easy to reason about.
 *
 * Props:
 * - content: string — current document content from Editor.jsx state
 * - onChange: fn — called on every keystroke, updates state + triggers debounced emit
 *
 * Implementation notes:
 * - TODO: wire onChange to handleContentChange in Editor.jsx
 * - TODO: listen for 'documentUpdated' socket event in Editor.jsx
 *   and update content state with the incoming content
 *   socket.on('documentUpdated', ({ content }) => {
 *     setDocument(prev => ({ ...prev, content }))
 *   })
 * - The textarea grows with content via min-h — don't set a fixed height
 */
const EditorCanvas = ({ content, onChange }) => {
    return (
        <article className="bg-surface-container-low min-h-screen p-16 shadow-2xl shadow-black/40 rounded-t-2xl">
            {/*
       * TODO: replace textarea with contentEditable div if you want
       * rich text formatting from the toolbar to work.
       * For now textarea is simpler and safer.
       */}
            <textarea
                value={content}
                onChange={onChange}
                placeholder="Start typing your document here..."
                className="w-full min-h-[600px] bg-transparent border-none outline-none text-on-surface font-body text-base leading-relaxed resize-none placeholder:text-outline/40"
            />
        </article>
    );
};

export default EditorCanvas;