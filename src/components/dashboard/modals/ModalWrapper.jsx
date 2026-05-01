const ModalWrapper = ({ children, onClose }) => {
    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="bg-surface-container-high border border-outline-variant/20 rounded-xl p-6 w-full max-w-2xl shadow-2xl max-h-[95vh] flex flex-col overflow-hidden">
                {children}
            </div>
        </div>
    );
};

export default ModalWrapper;