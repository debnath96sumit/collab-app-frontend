import {
    Bold, Italic, Underline as UnderlineIcon, Heading1, Heading2,
    List, ListOrdered, Link as LinkIcon, Undo, Redo,
} from 'lucide-react';

const ToolbarButton = ({ onClick, active, disabled, icon: Icon, label }) => (
    <button
        onMouseDown={(e) => {
            e.preventDefault();
            onClick?.();
        }}
        disabled={disabled}
        title={label}
        className={`p-2 rounded-lg transition-colors active:scale-95 ${active
            ? 'bg-primary/20 text-primary'
            : 'hover:bg-surface-bright text-on-surface-variant hover:text-on-surface'
            } disabled:opacity-30 disabled:cursor-not-allowed`}
    >
        <Icon size={16} />
    </button>
);

const Divider = () => <div className="w-px h-5 bg-outline-variant/20 mx-1" />;

const EditorToolbar = ({ editor }) => {
    if (!editor) return null;

    const handleLink = (e) => {
        e.preventDefault();
        const url = window.prompt('Enter URL');
        if (url) {
            editor.chain().focus().setLink({ href: url }).run();
        } else {
            editor.chain().focus().unsetLink().run();
        }
    };

    return (
        <div className="mt-6 mb-4 z-10 flex items-center gap-1 p-1.5 bg-surface-container-high/80 backdrop-blur-md rounded-xl shadow-2xl border border-outline-variant/10 flex-wrap">

            {/* Undo / Redo */}
            <div className="flex items-center px-1">
                <ToolbarButton
                    icon={Undo}
                    label="Undo"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                />
                <ToolbarButton
                    icon={Redo}
                    label="Redo"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                />
            </div>

            <Divider />

            {/* Text formatting */}
            <div className="flex items-center px-1">
                <ToolbarButton
                    icon={Bold}
                    label="Bold"
                    active={editor.isActive('bold')}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                />
                <ToolbarButton
                    icon={Italic}
                    label="Italic"
                    active={editor.isActive('italic')}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                />
                <ToolbarButton
                    icon={UnderlineIcon}
                    label="Underline"
                    active={editor.isActive('underline')}
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                />
            </div>

            <Divider />

            {/* Headings */}
            <div className="flex items-center px-1">
                <ToolbarButton
                    icon={Heading1}
                    label="Heading 1"
                    active={editor.isActive('heading', { level: 1 })}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                />
                <ToolbarButton
                    icon={Heading2}
                    label="Heading 2"
                    active={editor.isActive('heading', { level: 2 })}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                />
            </div>

            <Divider />

            {/* Lists */}
            <div className="flex items-center px-1">
                <ToolbarButton
                    icon={List}
                    label="Bullet List"
                    active={editor.isActive('bulletList')}
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                />
                <ToolbarButton
                    icon={ListOrdered}
                    label="Numbered List"
                    active={editor.isActive('orderedList')}
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                />
            </div>

            <Divider />

            {/* Link */}
            <div className="flex items-center px-1">
                <ToolbarButton
                    icon={LinkIcon}
                    label={editor.isActive('link') ? 'Remove Link' : 'Insert Link'}
                    active={editor.isActive('link')}
                    onClick={handleLink}
                />
            </div>
        </div>
    );
};

export default EditorToolbar;