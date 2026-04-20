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

const COLORS = [
    'bg-blue-500',
    'bg-emerald-500',
    'bg-amber-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-red-500',
];

const getColor = (userId) => {
    // TODO: derive index from userId to pick a consistent color
    // hint: use charCodeAt(0) % COLORS.length like your existing getUserColor
    const index = userId?.charCodeAt(0) % COLORS.length || 0;
    return COLORS[index];
};

const PresenceAvatars = ({ presence = [] }) => {
    // TODO: slice presence to max 3 visible, calculate remainder
    const visible = presence.slice(0, 3);
    const remaining = presence.length - visible.length;

    if (presence.length === 0) return null;

    return (
        <div className="flex items-center -space-x-2">
            {visible.map((user) => (
                <div
                    key={user.userId}
                    title={user.username}
                    className={`w-8 h-8 rounded-full border-2 border-slate-900 flex items-center justify-center text-[11px] font-bold text-white ${getColor(user.userId)}`}
                >
                    {/*
           * TODO: show first letter of username
           * hint: user.username?.[0]?.toUpperCase()
           */}
                    {user.username?.[0]?.toUpperCase()}
                </div>
            ))}

            {/* "+N more" bubble */}
            {remaining > 0 && (
                <div className="w-8 h-8 rounded-full border-2 border-slate-900 bg-surface-variant flex items-center justify-center text-[10px] font-bold text-on-surface-variant">
                    +{remaining}
                </div>
            )}
        </div>
    );
};

export default PresenceAvatars;