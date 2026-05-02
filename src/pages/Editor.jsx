import { useCallback, useEffect, useState, useRef } from 'react';
import EditorHeader from '../components/editor/EditorHeader';
import EditorSidebar from '../components/editor/EditorSidebar';
import EditorToolbar from '../components/editor/EditorToolbar';
import EditorCanvas from '../components/editor/EditorCanvas';
import CollabPanel from '../components/editor/CollabPanel';
import { useAuth } from '../context/AuthContext';
import { useParams } from "react-router-dom";
import { CollaboratorAPI, DocumentAPI } from '../utils/api';
import io from 'socket.io-client';
import ShareModal from '../components/ShareModal';
import { debounce } from 'lodash';

const Editor = () => {
    const { user } = useAuth();
    const { id } = useParams();
    const [saveStatus, setSaveStatus] = useState('saved');
    const [isConnected, setIsConnected] = useState(false);
    const [isCollabPanelOpen, setIsCollabPanelOpen] = useState(true);
    const [document, setDocument] = useState({
        id: null,
        title: '',
        content: '',
        collaborators: []
    });
    const [socket, setSocket] = useState(null);
    const socketRef = useRef(null)
    const [showShareModal, setShowShareModal] = useState(false);
    const [activeCollaborators, setActiveCollaborators] = useState([]);
    const [pendingCollaborators, setPendingCollaborators] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [cursors, setCursors] = useState({});
    const typingStopTimer = useRef(null);
    const isTypingRef = useRef(false);
    useEffect(() => {
        const token = localStorage.getItem('access_token');
        const socketInstance = io(`${import.meta.env.VITE_API_URL}/document-edits`, {
            auth: { token },
            transports: ['websocket'],
        });

        socketRef.current = socketInstance;
        setSocket(socketInstance);

        socketInstance.on('connect', async () => {
            console.log('✅ Connected:', socketInstance.id);
            setIsConnected(true);

            try {
                const response = await DocumentAPI.getDocument(id);
                if (response.data) {
                    setDocument(response.data);
                    const collaborator_resp = await CollaboratorAPI.getAllCollaborators(id);
                    setActiveCollaborators(collaborator_resp.data.active);
                    setPendingCollaborators(collaborator_resp.data.pending);
                }

                socketInstance.emit('joinDocument', id);
            } catch (error) {
                console.error('Failed to fetch document:', error);
            }
        });

        socketInstance.on('disconnect', () => {
            console.log('❌ Disconnected');
            setIsConnected(false);
        });

        socketInstance.on('documentUpdated', (data) => {
            setDocument(prev => ({ ...prev, content: data.content }));
        });

        socketInstance.on('documentRenamed', (data) => {
            const updatedTitle = data.title || data.name || data.newTitle;
            if (updatedTitle) {
                setDocument(prev => ({ ...prev, title: updatedTitle }));
            }
        });

        socketInstance.on('presenceUpdated', (users) => {
            setOnlineUsers(users);
        });

        socketInstance.on('joined', (data) => {
            if (data && data.presence) {
                setOnlineUsers(data.presence);
            }
        });

        socketInstance.on('cursor-update', (data) => {
            setCursors(prev => ({
                ...prev,
                [data.userId]: data
            }));
        });

        socketInstance.on('user-typing', (data) => {
            setCursors(prev => {
                if (!data.isTyping) {
                    const next = { ...prev };
                    delete next[data.userId];
                    return next;
                }
                return { ...prev, [data.userId]: data };
            });
        });

        return () => {
            if (isTypingRef.current) {
                socketRef.current?.emit('typing-stop', { documentId: id });
            }
            if (typingStopTimer.current) clearTimeout(typingStopTimer.current);
            socketInstance.disconnect();
        };
    }, [id]);

    const debouncedEmit = useCallback(
        debounce((event, payload) => {
            socketRef.current?.emit(event, payload);
            setSaveStatus('saved');
        }, 1000),
        []
    );

    const handleContentChange = (e) => {
        const newContent = e.target.value;

        setDocument(prev => ({ ...prev, content: newContent }));
        setSaveStatus('saving');

        if (!isTypingRef.current) {
            isTypingRef.current = true;
            socketRef.current?.emit('typing-start', { documentId: document.id });
        }

        if (typingStopTimer.current) clearTimeout(typingStopTimer.current);

        typingStopTimer.current = setTimeout(() => {
            isTypingRef.current = false;
            socketRef.current?.emit('typing-stop', { documentId: document.id });
        }, 2000);

        debouncedEmit('editDocument', { docId: document.id, content: newContent });
    };

    const handleTitleChange = (newTitle) => {
        if (newTitle.length > 50 || newTitle.length < 1) {
            return;
        }
        setDocument(prev => ({ ...prev, title: newTitle }));
        setSaveStatus('saving');

        debouncedEmit('renameDocument', { docId: document.id, newTitle });
    };

    const handleCursorMove = (position) => {
        if (!document.id || !socket) return;
        socket.emit('cursor-position', { documentId: document.id, position });
    };

    const isOwner = user?.id === document?.owner_id;

    return (
        <div className="bg-background text-on-surface h-screen w-screen overflow-hidden flex flex-col">
            <EditorHeader
                title={document.title}
                onTitleChange={handleTitleChange}
                saveStatus={saveStatus}
                presence={onlineUsers}
                isConnected={isConnected}
                onShare={() => setShowShareModal(true)}
                onToggleCollabPanel={() => setIsCollabPanelOpen(prev => !prev)}
                isOwner={isOwner}
            />

            <div className="flex flex-1 overflow-hidden">
                <EditorSidebar />

                <main className="flex-1 bg-surface-dim flex flex-col items-center overflow-hidden relative">
                    <EditorToolbar />

                    <div className="flex-1 w-full max-w-4xl px-12 overflow-y-auto relative">
                        <EditorCanvas
                            content={document.content}
                            onChange={handleContentChange}
                            onCursorMove={handleCursorMove}
                            cursors={cursors}
                        />
                    </div>
                </main>

                <CollabPanel
                    activeCollaborators={activeCollaborators}
                    pendingCollaborators={pendingCollaborators}
                    presence={activeCollaborators}
                    cursors={cursors}
                    isOpen={isCollabPanelOpen}
                    onClose={() => setIsCollabPanelOpen(false)}
                />
            </div>
            {showShareModal && (
                <ShareModal
                    document={document}
                    activeCollaborators={activeCollaborators}
                    onClose={() => setShowShareModal(false)}
                />
            )}
        </div>
    );
};

export default Editor;