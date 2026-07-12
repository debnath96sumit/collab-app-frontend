import { X, UserPlus, UserCheck, UserMinus, ShieldCheck, Pencil, Bell } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../../context/NotificationContext";
import { getNotificationText, formatRelativeTime } from "../../helpers";

const typeIconMap = {
    collaborator_invited: { icon: UserPlus, className: "bg-primary/15 text-primary" },
    collaborator_added: { icon: UserPlus, className: "bg-primary/15 text-primary" },
    invitation_accepted: { icon: UserCheck, className: "bg-emerald-500/15 text-emerald-400" },
    role_changed: { icon: ShieldCheck, className: "bg-amber-500/15 text-amber-400" },
    collaborator_removed: { icon: UserMinus, className: "bg-error/15 text-error" },
    document_renamed: { icon: Pencil, className: "bg-secondary/15 text-secondary" },
};

const NotificationItem = ({ notification, onOpen }) => {
    const { icon: Icon, className } = typeIconMap[notification.type] || {
        icon: Bell,
        className: "bg-outline-variant/20 text-on-surface-variant",
    };
    const actorName = notification.actor?.fullName || notification.actor?.username || "Someone";

    return (
        <div
            onClick={() => onOpen(notification)}
            className={`relative flex gap-3 p-5 cursor-pointer transition-colors hover:bg-surface-container-highest ${notification.isRead ? "opacity-70" : ""
                }`}
        >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${className}`}>
                <Icon size={18} />
            </div>

            <div className="flex-1 min-w-0">
                <p className="text-sm leading-relaxed text-on-surface">
                    <span className="font-bold">{actorName}</span>{" "}
                    {getNotificationText(notification)}
                </p>
                <p className="mt-1 text-[11px] text-on-surface-variant">
                    {formatRelativeTime(notification.createdAt)}
                </p>
            </div>

            {!notification.isRead && (
                <div className="absolute top-5 right-4 h-2 w-2 rounded-full bg-primary" />
            )}
        </div>
    );
};

const NotificationModal = ({ onClose }) => {
    const navigate = useNavigate();
    const { notifications, unreadCount, loading, hasMore, fetchNotifications, markAsRead, markAllAsRead } =
        useNotifications();

    useEffect(() => {
        fetchNotifications(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleOpenNotification = (notification) => {
        if (!notification.isRead) markAsRead(notification.id);
        if (notification.documentId) {
            navigate(`/board/${notification.documentId}`);
            onClose();
        }
    };

    const unread = notifications.filter((n) => !n.isRead);
    const read = notifications.filter((n) => n.isRead);

    return (
        <div className="flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant/10">
                <h2 className="text-xl font-headline font-bold text-on-surface">Notifications</h2>
                <div className="flex items-center gap-3">
                    {unreadCount > 0 && (
                        <button onClick={markAllAsRead} className="text-xs font-semibold text-primary hover:underline">
                            Mark all as read
                        </button>
                    )}
                    <button onClick={onClose} className="p-1 rounded-lg hover:bg-surface-container-highest transition-colors">
                        <X size={18} />
                    </button>
                </div>
            </div>

            <div className="max-h-[65vh] overflow-y-auto custom-scrollbar">
                {loading && notifications.length === 0 ? (
                    <p className="text-sm text-on-surface-variant text-center py-16">Loading notifications...</p>
                ) : notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                        <div className="w-12 h-12 rounded-2xl bg-surface-container-high flex items-center justify-center mb-3 border border-outline-variant/10">
                            <Bell size={22} className="text-on-surface-variant" />
                        </div>
                        <p className="text-sm font-semibold text-on-surface-variant mb-1">No notifications yet</p>
                        <p className="text-xs text-on-surface-variant/70 leading-relaxed">
                            You'll see updates about your documents here
                        </p>
                    </div>
                ) : (
                    <>
                        {unread.length > 0 && (
                            <>
                                <div className="px-5 pt-4 pb-2">
                                    <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-on-surface-variant/60">New</p>
                                </div>
                                {unread.map((n) => (
                                    <NotificationItem key={n.id} notification={n} onOpen={handleOpenNotification} />
                                ))}
                            </>
                        )}
                        {read.length > 0 && (
                            <>
                                <div className="px-5 pt-4 pb-2">
                                    <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-on-surface-variant/60">Earlier</p>
                                </div>
                                {read.map((n) => (
                                    <NotificationItem key={n.id} notification={n} onOpen={handleOpenNotification} />
                                ))}
                            </>
                        )}
                    </>
                )}
            </div>

            {hasMore && notifications.length > 0 && (
                <button
                    onClick={() => fetchNotifications(false)}
                    disabled={loading}
                    className="border-t border-outline-variant/10 py-3 text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors disabled:opacity-50"
                >
                    {loading ? "Loading..." : "Load more"}
                </button>
            )}
        </div>
    );
};

export default NotificationModal;