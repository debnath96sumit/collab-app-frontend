import { Edit, Trash2, ExternalLink } from 'lucide-react';

const DocumentCardMenu = ({ doc, role, onRename, onDelete, onClose }) => {
    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-10"
                onClick={onClose}
            />

            {/* Menu */}
            <div className="absolute right-0 top-7 z-20 w-44 bg-surface-container-high border border-outline-variant/20 rounded-xl shadow-xl overflow-hidden">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                        // open document
                    }}
                    className="w-full px-4 py-2.5 flex items-center gap-3 text-sm text-on-surface hover:bg-surface-bright transition-colors"
                >
                    <ExternalLink size={15} className="text-on-surface-variant" />
                    Open
                </button>

                {(role === 'owner' || role === 'editor') && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onRename();
                        }}
                        className="w-full px-4 py-2.5 flex items-center gap-3 text-sm text-on-surface hover:bg-surface-bright transition-colors"
                    >
                        <Edit size={15} className="text-on-surface-variant" />
                        Rename
                    </button>
                )}

                {role === 'owner' && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete();
                        }}
                        className="w-full px-4 py-2.5 flex items-center gap-3 text-sm text-error hover:bg-surface-bright transition-colors"
                    >
                        <Trash2 size={15} />
                        Delete
                    </button>
                )}
            </div>
        </>
    );
};

export default DocumentCardMenu;