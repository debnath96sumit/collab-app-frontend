import { FileText, MoreVertical } from 'lucide-react';
import { formatDate } from '../../../helpers';
import DocumentCardMenu from './DocumentCardMenu';
import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
const roleBadgeStyles = {
    owner: 'bg-primary-container/20 text-primary',
    editor: 'bg-green-900/40 text-green-400',
    commenter: 'bg-yellow-900/40 text-yellow-400',
    viewer: 'bg-surface-variant text-on-surface-variant',
};

const cardAccentStyles = {
    owner: 'from-primary/10',
    editor: 'from-green-500/10',
    commenter: 'from-yellow-500/10',
    viewer: 'from-slate-500/10',
};

const DocumentCard = ({ doc, role = 'owner', onOpen, onRename, onDelete }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    console.log(doc);

    const { user } = useAuth();
    const isOwner = user?.id === doc.owner_id;
    return (
        <div
            className="group relative bg-surface-container-low hover:bg-surface-bright rounded-xl transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-64 shadow-sm shadow-primary/5"
        >
            {/* Top preview area */}
            <div
                onClick={() => onOpen(doc)}
                className={`h-32 w-full bg-surface-container-highest overflow-hidden`}
            >
                <div
                    className={`w-full h-full bg-gradient-to-br ${cardAccentStyles[role]} to-transparent flex items-center justify-center opacity-40 group-hover:opacity-60 transition-opacity`}
                >
                    <FileText size={40} className="text-on-surface-variant/40" />
                </div>
            </div>

            {/* Card body */}
            <div className="p-5 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                    <h3
                        onClick={() => onOpen(doc)}
                        className="font-semibold text-on-surface truncate pr-4 text-sm"
                    >
                        {doc.title}
                    </h3>

                    {/* Three dot menu */}
                    <div className="relative">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setMenuOpen((prev) => !prev);
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-surface-variant rounded-md transition-all"
                        >
                            <MoreVertical size={16} className="text-on-surface-variant" />
                        </button>

                        {menuOpen && (
                            <DocumentCardMenu
                                doc={doc}
                                role={role}
                                onRename={() => {
                                    setMenuOpen(false);
                                    onRename(doc);
                                }}
                                onDelete={() => {
                                    setMenuOpen(false);
                                    onDelete(doc);
                                }}
                                onClose={() => setMenuOpen(false)}
                            />
                        )}
                    </div>
                </div>

                <p
                    onClick={() => onOpen(doc)}
                    className="text-xs text-on-surface-variant mb-auto"
                >
                    Edited {formatDate(doc.updatedAt)}
                </p>

                {/* Footer — owner info + role badge */}
                <div
                    onClick={() => onOpen(doc)}
                    className="flex items-center justify-between mt-4"
                >
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary-container flex items-center justify-center text-[10px] font-bold text-on-primary-container border-2 border-surface-container-low">
                            {doc.owner?.avatarUrl ? (
                                <img
                                    src={doc.owner.avatarUrl}
                                    alt={doc.owner.username}
                                    className="w-full h-full rounded-full object-cover"
                                />
                            ) : (
                                doc.owner?.username?.[0]?.toUpperCase() ?? 'U'
                            )}
                        </div>
                        <span className="text-xs text-on-surface-variant truncate max-w-[80px]">
                            {isOwner ? 'You' : doc.owner?.username ?? 'Unknown'}
                        </span>
                    </div>

                    <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${roleBadgeStyles[role]}`}
                    >
                        {role}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default DocumentCard;