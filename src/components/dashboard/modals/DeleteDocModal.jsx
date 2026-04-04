import { Trash2, X } from 'lucide-react';
import ModalWrapper from './ModalWrapper';

const DeleteDocModal = ({ onClose, onConfirm, document, loading }) => {
    return (
        <ModalWrapper onClose={onClose}>
            <div className="flex justify-end mb-2">
                <button
                    onClick={onClose}
                    className="p-1.5 hover:bg-surface-bright rounded-lg transition-colors"
                >
                    <X size={18} className="text-on-surface-variant" />
                </button>
            </div>

            <div className="flex flex-col items-center text-center mb-6">
                <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center mb-4">
                    <Trash2 size={22} className="text-error" />
                </div>
                <h2 className="font-headline text-xl font-bold text-on-surface mb-2">
                    Delete Document
                </h2>
                <p className="text-sm text-on-surface-variant max-w-xs">
                    Are you sure you want to delete{' '}
                    <span className="font-semibold text-on-surface">
                        "{document?.title}"
                    </span>
                    ? This action cannot be undone.
                </p>
            </div>

            <div className="flex gap-3">
                <button
                    onClick={onClose}
                    className="flex-1 px-4 py-2.5 text-sm font-medium text-on-surface-variant border border-outline-variant/20 rounded-lg hover:bg-surface-bright transition-colors"
                >
                    Cancel
                </button>
                <button
                    onClick={onConfirm}
                    disabled={loading}
                    className="flex-1 px-4 py-2.5 text-sm font-semibold bg-error/10 text-error border border-error/20 rounded-lg hover:bg-error/20 transition-colors active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Deleting...' : 'Delete'}
                </button>
            </div>
        </ModalWrapper>
    );
};

export default DeleteDocModal;