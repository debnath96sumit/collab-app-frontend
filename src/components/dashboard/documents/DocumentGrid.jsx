import { FileText, Plus } from 'lucide-react';
import DocumentCard from './DocumentCard';

const EmptyState = ({ onNewDocument, isShared = false }) => (
    <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-outline-variant/20 rounded-xl text-center">
        <div className="w-14 h-14 rounded-full bg-surface-container-highest flex items-center justify-center mb-4">
            <FileText size={24} className="text-on-surface-variant" />
        </div>
        <h3 className="text-base font-semibold text-on-surface mb-2">
            {isShared ? 'No shared documents yet' : 'No documents yet'}
        </h3>
        <p className="text-sm text-on-surface-variant mb-6 max-w-xs">
            {isShared
                ? 'Documents shared with you will appear here'
                : 'Create your first document to get started'}
        </p>
        {!isShared && (
            <button
                onClick={onNewDocument}
                className="flex items-center gap-2 px-4 py-2 bg-primary-container text-on-primary-container text-sm font-semibold rounded-lg hover:brightness-110 transition-all active:scale-95"
            >
                <Plus size={16} />
                New Document
            </button>
        )}
    </div>
);

const DocumentGrid = ({
    documents,
    activeTab,
    onOpen,
    onRename,
    onDelete,
    onNewDocument,
}) => {
    const isShared = activeTab === 'shared';

    if (documents.length === 0) {
        return <EmptyState onNewDocument={onNewDocument} isShared={isShared} />;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {documents.map((doc) => {
                // For owned docs role is always owner
                // For shared docs role comes from the collaborator record
                const role = isShared
                    ? doc.role?.toLowerCase() ?? 'viewer'
                    : 'owner';

                return (
                    <DocumentCard
                        key={doc.id}
                        doc={doc}
                        role={role}
                        onOpen={onOpen}
                        onRename={onRename}
                        onDelete={onDelete}
                    />
                );
            })}

            {/* New document card — only on my docs tab */}
            {!isShared && (
                <button
                    onClick={onNewDocument}
                    className="group relative bg-surface-container-low hover:bg-surface-bright rounded-xl transition-all duration-300 overflow-hidden flex flex-col items-center justify-center h-64 border-2 border-dashed border-outline-variant/30 hover:border-primary/30"
                >
                    <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center mb-3 group-hover:bg-primary/10 transition-colors">
                        <Plus size={24} className="text-on-surface-variant group-hover:text-primary transition-colors" />
                    </div>
                    <p className="text-sm font-semibold text-on-surface-variant group-hover:text-primary transition-colors">
                        New Document
                    </p>
                </button>
            )}
        </div>
    );
};

export default DocumentGrid;