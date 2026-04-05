import { X } from 'lucide-react';

/**
 * CollabPanel — right side panel showing collaborators and discussion
 *
 * Props:
 * - collaborators: array of { id, username, color, role } — from document data
 * - presence: array of { userId, username } — who is currently active in the room
 * - isOpen: boolean — controls visibility
 * - onClose: fn — collapses the panel
 *
 * Implementation notes:
 * - "Active Now" section → cross-reference collaborators with presence array
 *   A collaborator is "active" if their userId exists in the presence array
 * - Status text: if user is in presence → "Editing..." else → "Idle"
 * - Comments section is visual only for MVP — no comments API built yet
 * - TODO: when comments API is ready, fetch GET /documents/:id/comments
 *   and render here
 */

const roleBadgeStyles = {
    owner: 'bg-primary-container text-on-primary-container',
    editor: 'bg-emerald-900/40 text-emerald-400',
    commenter: 'bg-amber-900/40 text-amber-400',
    viewer: 'bg-surface-variant text-on-surface-variant',
};

const CollabPanel = ({ collaborators = [], presence = [], isOpen, onClose }) => {
    if (!isOpen) return null;

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

            {/* ── Active collaborators ── */}
            <div className="px-6 py-4 border-b border-outline-variant/10">
                <p className="text-[11px] font-bold text-slate-600 uppercase mb-4">
                    Active Now
                </p>

                <div className="space-y-4">
                    {collaborators.map((collab) => {
                        /*
                         * TODO: check if this collaborator is currently in the presence array
                         * hint: const isActive = presence.some(p => p.userId === collab.id)
                         * then show "Editing..." if active, "Idle" if not
                         */
                        const isActive = presence.some((p) => p.userId === collab.id);

                        return (
                            <div key={collab.id} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {/*
                   * TODO: avatar circle with first letter of username
                   * use collab.color for background
                   * hint: style={{ backgroundColor: collab.color }}
                   */}
                                    <div
                                        className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white"
                                        style={{ backgroundColor: collab.color }}
                                    >
                                        {collab?.user?.username?.[0]?.toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-on-surface">
                                            {collab?.user?.username}
                                        </p>
                                        <p className="text-[10px] text-slate-500">
                                            {isActive ? 'Editing...' : 'Idle'}
                                        </p>
                                    </div>
                                </div>

                                {/*
                 * TODO: show role badge from collab.role
                 * use roleBadgeStyles object above
                 */}
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold capitalize ${roleBadgeStyles[collab.role] ?? roleBadgeStyles.viewer}`}>
                                    {collab.role}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ── Discussion / comments ── */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
                <p className="text-[11px] font-bold text-slate-600 uppercase mb-4">
                    Discussion
                </p>

                {/*
         * TODO: map over comments array when comments API is ready
         * For now show empty state
         */}
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <p className="text-sm text-on-surface-variant">No comments yet</p>
                    <p className="text-xs text-slate-600 mt-1">
                        Start a discussion about this document
                    </p>
                </div>
            </div>

            {/* ── Comment input ── */}
            <div className="p-4 border-t border-outline-variant/10">
                {/*
         * TODO: wire up comment submission when comments API is ready
         * For now input is visual only
         */}
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