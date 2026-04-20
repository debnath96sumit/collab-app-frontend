import { X } from 'lucide-react';
import SettingsBody from './SettingsBody';

const SettingsModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative z-10 w-[95vw] max-w-5xl max-h-[85vh] bg-surface-dim rounded-2xl shadow-2xl shadow-black/40 border border-outline-variant/15 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Modal header */}
                <div className="flex items-center justify-between px-8 py-5 border-b border-outline-variant/10 flex-shrink-0">
                    <h2 className="text-2xl font-headline font-extrabold text-on-surface tracking-tight">
                        Settings
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest rounded-lg transition-colors active:scale-95"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto">
                    <SettingsBody />
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
