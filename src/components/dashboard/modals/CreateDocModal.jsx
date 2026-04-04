import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import ModalWrapper from './ModalWrapper';

const CreateDocModal = ({ onClose, onSubmit, value, onChange, loading }) => {
    const inputRef = useRef(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') onSubmit();
        if (e.key === 'Escape') onClose();
    };

    return (
        <ModalWrapper onClose={onClose}>
            <div className="flex justify-between items-center mb-6">
                <h2 className="font-headline text-xl font-bold text-on-surface">
                    New Document
                </h2>
                <button
                    onClick={onClose}
                    className="p-1.5 hover:bg-surface-bright rounded-lg transition-colors"
                >
                    <X size={18} className="text-on-surface-variant" />
                </button>
            </div>

            <div className="space-y-2 mb-6">
                <label className="block text-sm font-medium text-on-surface-variant">
                    Document Title
                </label>
                <input
                    ref={inputRef}
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter document title..."
                    className="w-full bg-surface-container-highest/30 border border-outline-variant/20 rounded-lg py-3 px-4 text-on-surface placeholder:text-outline/50 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-sm"
                />
            </div>

            <div className="flex gap-3 justify-end">
                <button
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-on-surface-variant border border-outline-variant/20 rounded-lg hover:bg-surface-bright transition-colors"
                >
                    Cancel
                </button>
                <button
                    onClick={onSubmit}
                    disabled={loading || !value.trim()}
                    className="px-4 py-2 text-sm font-semibold bg-primary-container text-on-primary-container rounded-lg hover:brightness-110 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Creating...' : 'Create Document'}
                </button>
            </div>
        </ModalWrapper>
    );
};

export default CreateDocModal;