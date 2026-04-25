/**
 * PresenceAvatars — overlapping avatar circles
 *
 * Props:
 * - presence: array of { userId, username } from socket presenceUpdated event
 *
 * Implementation notes:
 * - Show max 3 avatars, then "+N more" circle for the rest
 * - Each avatar shows first letter of username
 * - Color is deterministic based on userId (use COLORS array like your existing code)
 * - Add a tooltip (title attr) showing the full username on hover
 */

import { getInitials } from "../../helpers";

const COLORS = [
    'bg-blue-500',
    'bg-emerald-500',
    'bg-amber-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-red-500',
];

const getColor = (userId) => {
    if (!userId) return COLORS[0];
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
        hash = (hash + userId.charCodeAt(i)) * 31;
    }
    return COLORS[Math.abs(hash) % COLORS.length];
};

const PresenceAvatars = ({ presence = [] }) => {
    const visible = presence.slice(0, 3);
    const remaining = presence.length - visible.length;

    if (presence.length === 0) return null;

    return (
        <div className="flex items-center -space-x-2">
            {visible.map((doc) => (
                <div
                    key={doc?.user?.id}
                    title={doc?.user?.username}
                    className={`w-8 h-8 rounded-full border-2 border-slate-900 flex items-center justify-center text-[11px] font-bold text-white overflow-hidden ${!doc?.user?.avatarUrl ? getColor(doc?.user?.id) : ''}`}
                >
                    {doc?.user?.avatarUrl ? (
                        <img
                            src={doc.user.avatarUrl}
                            alt={doc?.user?.username}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        getInitials(doc?.user?.fullName)
                    )}
                </div>
            ))}

            {remaining > 0 && (
                <div className="w-8 h-8 rounded-full border-2 border-slate-900 bg-surface-variant flex items-center justify-center text-[10px] font-bold text-on-surface-variant">
                    +{remaining}
                </div>
            )}
        </div>
    );
};

export default PresenceAvatars;