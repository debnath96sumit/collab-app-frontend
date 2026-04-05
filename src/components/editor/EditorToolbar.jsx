import {
    Bold,
    Italic,
    Underline,
    Heading1,
    Heading2,
    List,
    ListOrdered,
    Link,
    Image,
} from 'lucide-react';

/**
 * EditorToolbar — floating formatting toolbar above the editor canvas
 *
 * For MVP this is visual only — buttons don't apply formatting yet.
 * Real formatting requires either:
 * - document.execCommand (deprecated but simple)
 * - A rich text library like TipTap or Quill
 *
 * For now render the buttons and wire them up later.
 *
 * Props:
 * - onFormat: fn(formatType) — called when a format button is clicked
 *   formatType: 'bold' | 'italic' | 'underline' | 'h1' | 'h2' | 'ul' | 'ol' | 'link' | 'image'
 *
 * Implementation notes:
 * - TODO: call document.execCommand(formatType) inside onFormat handler in Editor.jsx
 *   Example: document.execCommand('bold') toggles bold on selected text
 * - Each button group is separated by a divider
 */

const ToolbarButton = ({ icon: Icon, label, onClick }) => (
    <button
        onClick={onClick}
        title={label}
        className="p-2 hover:bg-surface-bright rounded-lg text-on-surface-variant hover:text-on-surface transition-colors active:scale-95"
    >
        <Icon size={16} />
    </button>
);

const Divider = () => (
    <div className="w-px h-5 bg-outline-variant/20 mx-1" />
);

const EditorToolbar = ({ onFormat }) => {
    return (
        <div className="mt-6 mb-4 z-10 flex items-center gap-1 p-1.5 bg-surface-container-high/80 backdrop-blur-md rounded-xl shadow-2xl border border-outline-variant/10">

            {/* ── Text formatting group ── */}
            <div className="flex items-center px-1">
                {/*
         * TODO: onClick → onFormat('bold')
         * In Editor.jsx: onFormat = (type) => document.execCommand(type)
         */}
                <ToolbarButton icon={Bold} label="Bold" onClick={() => onFormat?.('bold')} />
                <ToolbarButton icon={Italic} label="Italic" onClick={() => onFormat?.('italic')} />
                <ToolbarButton icon={Underline} label="Underline" onClick={() => onFormat?.('underline')} />
            </div>

            <Divider />

            {/* ── Heading + list group ── */}
            <div className="flex items-center px-1">
                {/*
         * TODO: H1 and H2 need formatBlock command not execCommand
         * document.execCommand('formatBlock', false, 'h1')
         */}
                <ToolbarButton icon={Heading1} label="Heading 1" onClick={() => onFormat?.('h1')} />
                <ToolbarButton icon={Heading2} label="Heading 2" onClick={() => onFormat?.('h2')} />
                <ToolbarButton icon={List} label="Bullet List" onClick={() => onFormat?.('ul')} />
                <ToolbarButton icon={ListOrdered} label="Numbered List" onClick={() => onFormat?.('ol')} />
            </div>

            <Divider />

            {/* ── Insert group ── */}
            <div className="flex items-center px-1">
                {/*
         * TODO: Link → prompt user for URL, then execCommand('createLink', false, url)
         * TODO: Image → for MVP skip or open file picker
         */}
                <ToolbarButton icon={Link} label="Insert Link" onClick={() => onFormat?.('link')} />
                <ToolbarButton icon={Image} label="Insert Image" onClick={() => onFormat?.('image')} />
            </div>
        </div>
    );
};

export default EditorToolbar;