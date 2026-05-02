import { useState } from 'react';
import { X, Clock, UserCheck, Users } from 'lucide-react';
import { getInitials } from '../../helpers';
import { CollaboratorAPI } from '../../utils/api';
import { pushToast } from '../../utils/toaster';

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

const CollaboratorRow = ({ collab, isPending, document, onRefresh }) => {
    const user = collab?.user;
    const avatarUrl = user?.avatarUrl;

    const statusLabel = collab.isEditing
        ? 'Editing...'
        : collab.isOnline
            ? 'Online'
            : 'Offline';

    const statusColor = collab.isEditing
        ? 'text-green-400'
        : collab.isOnline
            ? 'text-blue-400'
            : 'text-slate-500';

    const dotColor = collab.isEditing
        ? 'bg-green-400 animate-pulse'
        : collab.isOnline
            ? 'bg-blue-400'
            : 'bg-slate-600';

    const handleRemoveCollaborator = async (collabId) => {
        try {
            const response = await CollaboratorAPI.removeCollaborator(document.id, collabId);
            pushToast({ message: response.message, type: 'success' });
            if (onRefresh) await onRefresh();
        } catch (error) {
            pushToast({ message: 'Failed to remove collaborator', type: 'error' });
        }
    };

    return (
        <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-high/50 hover:bg-surface-container-high border border-outline-variant/10 hover:border-outline-variant/25 transition-all duration-200 group">
            <div className="flex items-center gap-3 min-w-0">
                <div className="relative flex-shrink-0">
                    <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold text-white overflow-hidden ring-2 ring-surface-container"
                        style={{
                            backgroundColor: avatarUrl ? 'transparent' : (collab.color || '#6366f1')
                        }}
                    >
                        {avatarUrl ? (
                            <img
                                src={avatarUrl}
                                alt={user?.username}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            getInitials(user?.fullName || user?.username || collab?.invitedEmail)
                        )}
                    </div>

                    {!isPending ? (
                        <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-surface-container ${dotColor}`} />
                    ) : (
                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-surface-container bg-amber-400" />
                    )}
                </div>

                <div className="min-w-0">
                    <p className="text-xs font-semibold text-on-surface truncate">
                        {user?.username || collab?.invitedEmail}
                    </p>
                    {isPending ? (
                        <p className="text-[10px] text-amber-400">Invitation sent</p>
                    ) : (
                        <p className={`text-[10px] ${statusColor}`}>{statusLabel}</p>
                    )}
                </div>
            </div>

            {/* Role badge + remove button */}
            <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`text-[10px] px-2 py-1 rounded-lg font-bold capitalize ${roleBadgeStyles[collab.role] ?? roleBadgeStyles.viewer}`}>
                    {collab.role}
                </span>
                {!isPending && collab.role !== 'owner' && (
                    <button
                        className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-error/10 rounded-lg transition-all active:scale-95"
                        title="Remove collaborator"
                        onClick={() => handleRemoveCollaborator(collab.id)}
                    >
                        <X size={13} className="text-error" />
                    </button>
                )}
            </div>
        </div>
    );
};

const CollabPanel = ({
    document,
    activeCollaborators = [],
    pendingCollaborators = [],
    presence = [],
    cursors = {},
    isOpen,
    onClose,
    onRefresh
}) => {
    const [activeTab, setActiveTab] = useState('active');

    if (!isOpen) return null;

    const activeWithPresence = activeCollaborators.map((c) => {
        const userId = c.user?.id ?? c.id;
        const isOnline = presence.some((p) => p.userId === userId);
        const isEditing = !!cursors[userId];
        return { ...c, isOnline, isEditing };
    });

    const onlineCount = activeWithPresence.filter(c => c.isOnline).length;
    const currentList = activeTab === 'active' ? activeWithPresence : pendingCollaborators;
    const isPending = activeTab === 'pending';

    return (
        <aside className="w-72 sm:w-80 h-full bg-surface-container-low flex flex-col border-l border-outline-variant/10">

            {/* ── Panel header ── */}
            <div className="px-5 py-4 flex items-center justify-between border-b border-outline-variant/10 bg-surface-container/50">
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Users size={14} className="text-primary" />
                    </div>
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-300">
                            Collaboration
                        </h3>
                        <p className="text-[10px] text-slate-500">
                            {onlineCount} online · {activeCollaborators.length} total
                        </p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="p-1.5 hover:bg-surface-bright rounded-lg transition-colors"
                >
                    <X size={15} className="text-slate-500" />
                </button>
            </div>

            {/* ── Tabs ── */}
            <div className="flex p-2 gap-1 border-b border-outline-variant/10 bg-surface-container/30">
                {TABS.map(({ key, label, icon: Icon }) => (
                    <button
                        key={key}
                        onClick={() => setActiveTab(key)}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${activeTab === key
                            ? 'bg-surface-container-highest text-primary shadow-sm'
                            : 'text-slate-500 hover:text-slate-300 hover:bg-surface-container-high/50'
                            }`}
                    >
                        <Icon size={13} />
                        {label}
                        {key === 'pending' && pendingCollaborators.length > 0 && (
                            <span className="w-4 h-4 flex items-center justify-center rounded-full bg-amber-500/20 text-amber-400 text-[9px] font-bold">
                                {pendingCollaborators.length}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* ── Collaborator list ── */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                {currentList.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                        <div className="w-12 h-12 rounded-2xl bg-surface-container-high flex items-center justify-center mb-3 border border-outline-variant/10">
                            {isPending
                                ? <Clock size={22} className="text-slate-500" />
                                : <UserCheck size={22} className="text-slate-500" />
                            }
                        </div>
                        <p className="text-sm font-semibold text-on-surface-variant mb-1">
                            {isPending ? 'No pending invites' : 'No collaborators yet'}
                        </p>
                        <p className="text-xs text-slate-600 leading-relaxed">
                            {isPending
                                ? 'Share this document to invite people'
                                : 'Active collaborators appear here when they join'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {currentList.map((collab) => (
                            <CollaboratorRow
                                key={collab.id || collab.invitedEmail}
                                collab={collab}
                                isPending={isPending}
                                document={document}
                                onRefresh={onRefresh}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* ── Comment input ── */}
            <div className="p-3 border-t border-outline-variant/10 bg-surface-container/30">
                <div className="flex items-center gap-2 bg-surface-container-highest/60 rounded-xl px-3 py-2 border border-outline-variant/10 focus-within:border-primary/30 focus-within:ring-1 focus-within:ring-primary/10 transition-all">
                    <input
                        type="text"
                        placeholder="Add a comment..."
                        className="bg-transparent border-none focus:ring-0 text-xs text-on-surface flex-1 outline-none placeholder:text-slate-600"
                    />
                    <button className="w-7 h-7 flex items-center justify-center bg-primary-container text-on-primary-container rounded-lg hover:brightness-110 transition-all active:scale-95 flex-shrink-0">
                        <span className="text-xs font-bold">↑</span>
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default CollabPanel;