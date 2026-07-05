import {
    X,
    Reply,
    UserPlus,
    AtSign,
    Pencil,
    Info,
} from "lucide-react";

const NotificationModal = ({ onClose }) => {
    return (
        <div className="flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant/10">
                <h2 className="text-xl font-headline font-bold text-on-surface">
                    Notifications
                </h2>

                <div className="flex items-center gap-3">
                    <button className="text-xs font-semibold text-primary hover:underline">
                        Mark all as read
                    </button>

                    <button
                        onClick={onClose}
                        className="p-1 rounded-lg hover:bg-surface-container-highest transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>
            </div>

            {/* Body */}
            <div className="max-h-[65vh] overflow-y-auto custom-scrollbar">

                {/* NEW */}
                <div className="px-5 pt-4 pb-2">
                    <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-on-surface-variant/60">
                        New
                    </p>
                </div>

                {/* Notification 1 */}
                <div className="relative flex gap-3 p-5 hover:bg-surface-container-highest transition-colors">

                    <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0 text-primary">
                        <UserPlus size={18} />
                    </div>

                    <div className="flex-1">
                        <p className="text-sm leading-relaxed text-on-surface">
                            <span className="font-bold">
                                Sarah Jenkins
                            </span>{" "}
                            invited you to{" "}
                            <span className="font-semibold text-primary">
                                Q4 Product Strategy
                            </span>
                        </p>

                        <div className="flex gap-2 mt-3">
                            <button className="px-4 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-semibold hover:brightness-110">
                                Accept
                            </button>

                            <button className="px-4 py-1.5 rounded-lg bg-surface-container-highest text-xs font-semibold hover:bg-outline-variant/20">
                                Decline
                            </button>
                        </div>
                    </div>

                    <div className="absolute top-5 right-4 h-2 w-2 rounded-full bg-primary" />
                </div>

                {/* Notification 2 */}
                <div className="relative flex gap-3 p-5 hover:bg-surface-container-highest transition-colors">

                    <div className="w-10 h-10 rounded-full bg-secondary/15 flex items-center justify-center flex-shrink-0 text-secondary">
                        <AtSign size={18} />
                    </div>

                    <div className="flex-1">
                        <p className="text-sm leading-relaxed text-on-surface">
                            <span className="font-bold">
                                Alex Morgan
                            </span>{" "}
                            mentioned you in{" "}
                            <span className="font-semibold text-primary">
                                User Interview Notes
                            </span>
                        </p>

                        <div className="mt-3 rounded-lg border-l-2 border-primary bg-surface-container-highest p-2">
                            <p className="text-xs italic text-on-surface-variant">
                                "Can you check this?"
                            </p>
                        </div>

                        <button className="mt-3 flex items-center gap-2 text-xs font-semibold text-primary hover:underline">
                            <Reply size={14} />
                            Reply
                        </button>
                    </div>

                    <div className="absolute top-5 right-4 h-2 w-2 rounded-full bg-primary" />
                </div>

                {/* EARLIER */}
                <div className="px-5 pt-4 pb-2">
                    <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-on-surface-variant/60">
                        Earlier
                    </p>
                </div>

                {/* Notification 3 */}
                <div className="flex gap-3 p-5 opacity-80 hover:bg-surface-container-highest transition-colors">

                    <div className="w-10 h-10 rounded-full bg-outline-variant/20 flex items-center justify-center flex-shrink-0">
                        <Pencil size={18} />
                    </div>

                    <div className="flex-1">
                        <p className="text-sm text-on-surface">
                            <span className="font-bold">
                                Felix Vane
                            </span>{" "}
                            edited{" "}
                            <span className="font-semibold">
                                Project Alpha Roadmap
                            </span>
                        </p>

                        <p className="mt-1 text-[11px] text-on-surface-variant">
                            2 hours ago
                        </p>
                    </div>
                </div>

                {/* Notification 4 */}
                <div className="flex gap-3 p-5 opacity-80 hover:bg-surface-container-highest transition-colors">

                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Info size={18} />
                    </div>

                    <div className="flex-1">
                        <p className="text-sm text-on-surface">
                            <span className="font-bold">
                                System update:
                            </span>{" "}
                            Collaborative Presence is now live.
                        </p>

                        <p className="mt-1 text-[11px] text-on-surface-variant">
                            5 hours ago
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <button className="border-t border-outline-variant/10 py-3 text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors">
                View all notifications
            </button>
        </div>
    );
};

export default NotificationModal;