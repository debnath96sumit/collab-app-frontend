const EditorCanvas = ({ content, onChange, onCursorMove, cursors = {} }) => {
    return (
        <article className="bg-surface-container-low min-h-screen p-16 shadow-2xl shadow-black/40 rounded-t-2xl relative">
            {/*
       * TODO: replace textarea with contentEditable div if you want
       * rich text formatting from the toolbar to work.
       * For now textarea is simpler and safer.
       */}
            <textarea
                value={content}
                onChange={(e) => {
                    onChange(e);
                    onCursorMove?.(e.target.selectionStart);
                }}
                onSelect={(e) => onCursorMove?.(e.target.selectionStart)}
                onClick={(e) => onCursorMove?.(e.target.selectionStart)}
                onKeyUp={(e) => onCursorMove?.(e.target.selectionStart)}
                placeholder="Start typing your document here..."
                className="w-full min-h-[600px] bg-transparent border-none outline-none text-on-surface font-body text-base leading-relaxed resize-none placeholder:text-outline/40"
            />

            {/* Note: Rendering floating cursors inside a true <textarea> is difficult because it strictly parses plain text. 
                We store the text index in `cursors`, but for a rich visual overlay, you'd integrate a fake mirror div or switch to Tiplap/ProseMirror. */}
            <div className="absolute top-4 right-4 text-xs text-slate-500">
                {Object.keys(cursors).length} active cursors tracking across sockets
            </div>
        </article>
    );
};

export default EditorCanvas;