import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DocumentAPI } from '../utils/api';

import DashboardLayout from '../components/dashboard/layout/DashboardLayout';
import DocumentGrid from '../components/dashboard/documents/DocumentGrid';
import CreateDocModal from '../components/dashboard/modals/CreateDocModal';
import RenameDocModal from '../components/dashboard/modals/RenameDocModal';
import DeleteDocModal from '../components/dashboard/modals/DeleteDocModal';
import { pushToast } from '../utils/toaster';

const Dashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [myDocuments, setMyDocuments] = useState([]);
    const [sharedDocuments, setSharedDocuments] = useState([]);
    const [loading, setLoading] = useState(true);

    // UI state
    const [activeTab, setActiveTab] = useState('my');
    const [searchQuery, setSearchQuery] = useState('');

    // Selected document for modals
    const [selectedDocument, setSelectedDocument] = useState(null);

    // Modal visibility
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showRenameModal, setShowRenameModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Modal input values
    const [newDocTitle, setNewDocTitle] = useState('');
    const [editDocTitle, setEditDocTitle] = useState('');

    // Modal loading states
    const [createLoading, setCreateLoading] = useState(false);
    const [renameLoading, setRenameLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        document.title = 'Dashboard - CollabDocs';
        loadDocuments();
    }, []);

    // ─── Data fetching ────────────────────────────────────────────────────────

    const loadDocuments = async () => {
        setLoading(true);
        try {
            const data = await DocumentAPI.getAllDocuments();
            setMyDocuments(data.data.myDocs ?? []);
            setSharedDocuments(data.data.sharedWithMe ?? []);
        } catch (error) {
            console.error('Error loading documents:', error);
        } finally {
            setLoading(false);
        }
    };

    // ─── CRUD handlers ────────────────────────────────────────────────────────

    const handleCreateDocument = async () => {
        if (!newDocTitle.trim()) return;
        setCreateLoading(true);
        try {
            const data = await DocumentAPI.createDocument({ title: newDocTitle });
            setMyDocuments((prev) => [data.data, ...prev]);
            setShowCreateModal(false);
            setNewDocTitle('');
            pushToast({ message: data.message, type: 'success' });
        } catch (error) {
            console.error('Error creating document:', error);
        } finally {
            setCreateLoading(false);
        }
    };

    const handleRenameDocument = async () => {
        if (!editDocTitle.trim()) return;
        setRenameLoading(true);
        try {
            const response = await DocumentAPI.updateDocument(selectedDocument.id, {
                title: editDocTitle,
            });
            const updatedDoc = response.data;
            setMyDocuments((prev) =>
                prev.map((doc) => (doc.id === updatedDoc.id ? updatedDoc : doc)),
            );
            setSharedDocuments((prev) =>
                prev.map((doc) => (doc.id === updatedDoc.id ? updatedDoc : doc)),
            );
            pushToast({ message: response.message, type: 'success' });
            closeRenameModal();
        } catch (error) {
            console.error('Error renaming document:', error);
        } finally {
            setRenameLoading(false);
        }
    };

    const handleDeleteDocument = async () => {
        setDeleteLoading(true);
        try {
            const response = await DocumentAPI.deleteDocument(selectedDocument.id);
            setMyDocuments((prev) =>
                prev.filter((doc) => doc.id !== selectedDocument.id),
            );
            pushToast({ message: response.message, type: 'success' });
            closeDeleteModal();
        } catch (error) {
            console.log('Error deleting document:', error);
        } finally {
            setDeleteLoading(false);
        }
    };

    // ─── Modal openers ────────────────────────────────────────────────────────

    const openRenameModal = (doc) => {
        setSelectedDocument(doc);
        setEditDocTitle(doc.title);
        setShowRenameModal(true);
    };

    const openDeleteModal = (doc) => {
        setSelectedDocument(doc);
        setShowDeleteModal(true);
    };

    const openDocument = (doc) => {
        navigate(`/board/${doc.id}`);
    };

    // ─── Modal closers ────────────────────────────────────────────────────────

    const closeCreateModal = () => {
        setShowCreateModal(false);
        setNewDocTitle('');
    };

    const closeRenameModal = () => {
        setShowRenameModal(false);
        setSelectedDocument(null);
        setEditDocTitle('');
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setSelectedDocument(null);
    };

    // ─── Filtering ────────────────────────────────────────────────────────────

    const filteredDocuments = (
        activeTab === 'my' ? myDocuments : sharedDocuments
    ).filter((doc) =>
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    // ─── Greeting ────────────────────────────────────────────────────────────

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    return (
        <>
            <DashboardLayout
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onNewDocument={() => setShowCreateModal(true)}
            >
                <div className="max-w-7xl mx-auto px-8 pt-8 pb-20">
                    {/* Greeting + tab toggle */}
                    <div className="flex items-end justify-between mb-10">
                        <div>
                            <h1 className="text-3xl font-headline font-bold text-on-surface mb-1">
                                {getGreeting()}, {user?.fullName?.split(' ')[0] ?? user?.username}
                            </h1>
                            <p className="text-on-surface-variant text-sm">
                                {filteredDocuments.length}{' '}
                                {filteredDocuments.length === 1 ? 'document' : 'documents'}{' '}
                                {searchQuery ? 'found' : 'in your workspace'}
                            </p>
                        </div>

                        {/* Tab toggle */}
                        <div className="flex items-center bg-surface-container-low rounded-xl p-1 gap-1">
                            <button
                                onClick={() => setActiveTab('my')}
                                className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === 'my'
                                    ? 'bg-primary-container text-on-primary-container shadow-lg'
                                    : 'text-on-surface-variant hover:text-on-surface'
                                    }`}
                            >
                                My Documents
                            </button>
                            <button
                                onClick={() => setActiveTab('shared')}
                                className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === 'shared'
                                    ? 'bg-primary-container text-on-primary-container shadow-lg'
                                    : 'text-on-surface-variant hover:text-on-surface'
                                    }`}
                            >
                                Shared With Me
                            </button>
                        </div>
                    </div>

                    {/* Document grid */}
                    {loading ? (
                        <SkeletonGrid />
                    ) : (
                        <DocumentGrid
                            documents={filteredDocuments}
                            activeTab={activeTab}
                            onOpen={openDocument}
                            onRename={openRenameModal}
                            onDelete={openDeleteModal}
                            onNewDocument={() => setShowCreateModal(true)}
                        />
                    )}
                </div>
            </DashboardLayout>

            {/* Modals */}
            {showCreateModal && (
                <CreateDocModal
                    value={newDocTitle}
                    onChange={setNewDocTitle}
                    onSubmit={handleCreateDocument}
                    onClose={closeCreateModal}
                    loading={createLoading}
                />
            )}

            {showRenameModal && (
                <RenameDocModal
                    value={editDocTitle}
                    onChange={setEditDocTitle}
                    onSubmit={handleRenameDocument}
                    onClose={closeRenameModal}
                    loading={renameLoading}
                />
            )}

            {showDeleteModal && (
                <DeleteDocModal
                    document={selectedDocument}
                    onConfirm={handleDeleteDocument}
                    onClose={closeDeleteModal}
                    loading={deleteLoading}
                />
            )}
        </>
    );
};

// ─── Skeleton loader ──────────────────────────────────────────────────────────

const SkeletonCard = () => (
    <div className="bg-surface-container-low rounded-xl overflow-hidden h-64 animate-pulse">
        <div className="h-32 bg-surface-container-highest" />
        <div className="p-5 space-y-3">
            <div className="h-4 bg-surface-container-highest rounded w-3/4" />
            <div className="h-3 bg-surface-container-highest rounded w-1/2" />
        </div>
    </div>
);

const SkeletonGrid = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
        ))}
    </div>
);

export default Dashboard;