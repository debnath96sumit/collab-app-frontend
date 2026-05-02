import { ArrowLeft, Share2, Bell, Settings, Users } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import PresenceAvatars from './PresenceAvatars';
import SaveStatus from './SaveStatus';

const EditorHeader = ({
    title,
    onTitleChange,
    saveStatus,
    presence,
    isConnected,
    onShare,
    onToggleCollabPanel,
    isOwner,
}) => {
    const navigate = useNavigate();

    return (
        <header className="w-full h-16 sticky top-0 z-50 bg-slate-900/60 backdrop-blur-xl flex items-center justify-between px-3 sm:px-6 shadow-sm shadow-blue-500/5 border-b border-outline-variant/10">

            <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 rounded-lg transition-colors active:scale-95 flex-shrink-0"
                >
                    <ArrowLeft size={18} />
                </button>

                <div className="flex items-center gap-2 min-w-0">
                    <Link to="/dashboard" className="text-base font-bold tracking-tight text-slate-100 font-headline hidden sm:block flex-shrink-0">
                        Docs
                    </Link>
                    <span className="text-slate-600 hidden sm:block flex-shrink-0">/</span>
                    <input
                        type="text"
                        value={title || ''}
                        onChange={(e) => onTitleChange(e.target.value)}
                        readOnly={!isOwner}
                        placeholder="Untitled Document"
                        className={`bg-transparent border-none focus:ring-0 text-slate-200 font-semibold text-sm sm:text-base p-1 w-28 sm:w-48 md:w-64 outline-none rounded-lg transition-colors placeholder:text-slate-600 truncate ${isOwner ? 'focus:bg-slate-800/40 cursor-text' : 'cursor-default'
                            }`}
                    />
                </div>
            </div>

            <div className="hidden sm:flex items-center justify-center gap-3 flex-shrink-0 px-4">
                <PresenceAvatars presence={presence} />
                <SaveStatus status={saveStatus} />
            </div>

            <div className="flex items-center justify-end gap-1 sm:gap-2 flex-shrink-0">
                <div className="flex items-center gap-1.5 mr-1 sm:mr-2">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
                    <span className="text-xs text-on-surface-variant hidden md:block">
                        {isConnected ? 'Connected' : 'Disconnected'}
                    </span>
                </div>

                {isOwner && (
                    <button
                        onClick={onShare}
                        className="bg-primary-container text-on-primary-container px-3 sm:px-5 py-2 rounded-lg font-bold text-sm hover:bg-blue-600 transition-colors active:scale-95 flex items-center gap-1.5"
                    >
                        <Share2 size={15} />
                        <span className="hidden sm:block">Share</span>
                    </button>
                )}

                <button
                    onClick={onToggleCollabPanel}
                    className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 rounded-lg transition-colors active:scale-95"
                    title="Toggle collaborators panel"
                >
                    <Users size={16} />
                </button>

                <button className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 rounded-lg transition-colors active:scale-95 hidden sm:flex">
                    <Bell size={16} />
                </button>
            </div>
        </header>
    );
};

export default EditorHeader;