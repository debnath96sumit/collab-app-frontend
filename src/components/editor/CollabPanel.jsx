import { useState } from 'react';
import { X, Clock, UserCheck } from 'lucide-react';
import { getInitials } from '../../helpers';

const roleBadgeStyles = {
    owner: 'bg-primary-container text-on-primary-container',
    editor: 'bg-emerald-900/40 text-emerald-400',
    commenter: 'bg-amber-900/40 text-amber-400',
    viewer: 'bg-surface-variant text-on-surface-variant',
};

const TABS = [
    { key: 'active', label: 'Active', icon: UserCheck },
    { key: 'pending', label: 'Pending', icon: Clock },
];

const CollaboratorRow = ({ collab, isPending }) => {
    const user = collab?.user;
    const avatarUrl = user?.avatarUrl;

    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white overflow-hidden"
                    style={{ backgroundColor: avatarUrl ? 'transparent' : (collab.color || '#6366f1') }}
                >
                    {avatarUrl ? (
                        <img
                            src={avatarUrl}
                            alt={user?.username}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        getInitials(user?.fullName || user?.username)
                    )}
                </div>
                <div>
                    <p className="text-xs font-semibold text-on-surface">
                        {user?.username || collab?.email}
                    </p>
                    {isPending ? (
                        <p className="text-[10px] text-amber-400">Invitation sent</p>
                    ) : (
                        <p className="text-[10px] text-slate-500">
                            {collab?.isActive ? 'Editing...' : 'Idle'}
                        </p>
                    )}
                </div>
            </div>

            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold capitalize ${roleBadgeStyles[collab.role] ?? roleBadgeStyles.viewer}`}>
                {collab.role}
            </span>
        </div>
    );
};

const CollabPanel = ({ activeCollaborators = [], pendingCollaborators = [], presence = [], isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState('active');

    if (!isOpen) return null;

    const activeWithPresence = activeCollaborators.map((c) => ({
        ...c,
        isActive: presence.some((p) => p.userId === c.id || p.userId === c.user?.id),
    }));

    const currentList = activeTab === 'active' ? activeWithPresence : pendingCollaborators;
    const isPending = activeTab === 'pending';

    return (
        <aside className="w-80 flex-shrink-0 bg-surface-container flex flex-col border-l border-outline-variant/10">

            {/* ── Panel header ── */}
            <div className="p-6 flex items-center justify-between border-b border-outline-variant/10">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    Collaboration
                </h3>
                <button
                    onClick={onClose}
                    className="p-1 hover:bg-surface-bright rounded-lg transition-colors"
                >
                    <X size={16} className="text-slate-500" />
                </button>
            </div>

            {/* ── Tabs ── */}
            <div className="flex border-b border-outline-variant/10">
                {TABS.map(({ key, label, icon: Icon }) => (
                    <button
                        key={key}
                        onClick={() => setActiveTab(key)}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold uppercase tracking-wider transition-colors relative
                            ${activeTab === key
                                ? 'text-primary-container'
                                : 'text-slate-500 hover:text-slate-300'
                            }`}
                    >
                        <Icon size={14} />
                        {label}
                        {key === 'pending' && pendingCollaborators.length > 0 && (
                            <span className="ml-1 w-4 h-4 flex items-center justify-center rounded-full bg-amber-500/20 text-amber-400 text-[9px] font-bold">
                                {pendingCollaborators.length}
                            </span>
                        )}
                        {activeTab === key && (
                            <span className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-primary-container rounded-full" />
                        )}
                    </button>
                ))}
            </div>

            {/* ── Collaborator list ── */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
                {currentList.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <p className="text-sm text-on-surface-variant">
                            {isPending ? 'No pending invitations' : 'No active collaborators'}
                        </p>
                        <p className="text-xs text-slate-600 mt-1">
                            {isPending
                                ? 'Share this document to invite collaborators'
                                : 'Collaborators will appear here when they join'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {currentList.map((collab) => (
                            <CollaboratorRow
                                key={collab.id || collab.email}
                                collab={collab}
                                isPending={isPending}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* ── Comment input ── */}
            <div className="p-4 border-t border-outline-variant/10">
                <div className="flex items-center gap-2 bg-surface-container-highest rounded-xl p-1 border border-outline-variant/10">
                    <input
                        type="text"
                        placeholder="Add a comment..."
                        className="bg-transparent border-none focus:ring-0 text-xs text-on-surface flex-1 px-3 py-2 outline-none placeholder:text-outline/50"
                    />
                    <button className="w-8 h-8 flex items-center justify-center bg-primary-container text-on-primary-container rounded-lg hover:brightness-110 transition-all">
                        <span className="text-sm">↑</span>
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default CollabPanel;