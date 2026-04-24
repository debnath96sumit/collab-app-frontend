import { ArrowLeft, Share2, Bell, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PresenceAvatars from './PresenceAvatars';
import SaveStatus from './SaveStatus';

/**
 * EditorHeader — top bar of the editor page
 *
 * Props:
 * - title: string — current document title
 * - onTitleChange: fn — called with new title string on input change
 * - onTitleBlur: fn — called when title input loses focus (good place to emit renameDocument)
 * - saveStatus: 'saving' | 'saved' | 'error'
 * - presence: array of { userId, username } — users currently in the document room
 * - isConnected: boolean — socket connection status
 * - onShare: fn — opens share modal
 */
const EditorHeader = ({
    title,
    onTitleChange,
    saveStatus,
    presence,
    isConnected,
    onShare,
}) => {
    const navigate = useNavigate();

    return (
        <header className="w-full h-16 sticky top-0 z-50 bg-slate-900/60 backdrop-blur-xl flex items-center justify-between px-6 shadow-sm shadow-blue-500/5 border-b border-outline-variant/10">

            {/* ── Left: back button + logo + title input ── */}
            <div className="flex items-center gap-4 flex-1">
                {/* Back to dashboard */}
                <button
                    onClick={() => navigate('/dashboard')}
                    className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 rounded-lg transition-colors active:scale-95"
                >
                    <ArrowLeft size={18} />
                </button>

                <div className="flex items-center gap-3">
                    <span className="text-lg font-bold tracking-tight text-slate-100 font-headline">
                        CollabDocs
                    </span>
                    <span className="text-slate-600">/</span>

                    {/*
           * Title input — inline editable
           * - value comes from document.title in Editor.jsx
           * - onChange calls onTitleChange (updates local state only)
           * - onBlur calls onTitleBlur (emits renameDocument to socket)
           * This way we don't emit on every keystroke, only when user finishes editing
           */}
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => onTitleChange(e.target.value)}
                        placeholder="Untitled Document"
                        className="bg-transparent border-none focus:ring-0 text-slate-200 font-semibold text-base p-1 w-64 outline-none focus:bg-slate-800/40 rounded-lg transition-colors placeholder:text-slate-600"
                    />
                </div>
            </div>

            {/* ── Center: presence avatars + save status ── */}
            <div className="flex items-center justify-center gap-4 flex-1">
                {/*
         * PresenceAvatars — renders overlapping circles for each user in the room
         * presence array comes from socket 'presenceUpdated' event in Editor.jsx
         */}
                <PresenceAvatars presence={presence} />

                {/*
         * SaveStatus — shows saving/saved/error indicator
         * saveStatus is set to 'saving' on every content change
         * and back to 'saved' after debouncedEmit fires
         */}
                <SaveStatus status={saveStatus} />
            </div>

            {/* ── Right: share button + actions ── */}
            <div className="flex items-center justify-end gap-2 flex-1">
                {/*
         * Connection indicator — small dot showing socket status
         * isConnected comes from socket 'connect'/'disconnect' events
         */}
                <div className="flex items-center gap-1.5 mr-2">
                    <div
                        className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'
                            }`}
                    />
                    <span className="text-xs text-on-surface-variant">
                        {isConnected ? 'Connected' : 'Disconnected'}
                    </span>
                </div>

                {/*
         * Share button — opens ShareModal
         * onShare sets showShareModal(true) in Editor.jsx
         */}
                <button
                    onClick={onShare}
                    className="bg-primary-container text-on-primary-container px-5 py-2 rounded-lg font-bold text-sm hover:bg-blue-600 transition-colors active:scale-95"
                >
                    <span className="flex items-center gap-2">
                        <Share2 size={15} />
                        Share
                    </span>
                </button>

                <button className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 rounded-lg transition-colors active:scale-95">
                    <Bell size={16} />
                </button>

                <button className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 rounded-lg transition-colors active:scale-95">
                    <Settings size={16} />
                </button>
            </div>
        </header>
    );
};

export default EditorHeader;