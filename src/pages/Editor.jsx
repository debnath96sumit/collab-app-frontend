import { useEffect, useState } from 'react';
import EditorHeader from '../components/editor/EditorHeader';
import EditorSidebar from '../components/editor/EditorSidebar';
import EditorToolbar from '../components/editor/EditorToolbar';
import EditorCanvas from '../components/editor/EditorCanvas';
import CollabPanel from '../components/editor/CollabPanel';
import { useAuth } from '../context/AuthContext';
import { useParams } from "react-router-dom";
import { DocumentAPI } from '../utils/api';
import io from 'socket.io-client';
import ShareModal from '../components/ShareModal';

const Editor = () => {
    const { user } = useAuth();
    const { id } = useParams();
    const [saveStatus, setSaveStatus] = useState('saved');
    const [isConnected, setIsConnected] = useState(false);
    // doc state
    const [document, setDocument] = useState({
        id: null,
        title: '',
        content: '',
        collaborators: []
    });
    // socket state
    const [socket, setSocket] = useState(null);

    // presence state
    // save status state
    // collab panel open/close state

    const [showShareModal, setShowShareModal] = useState(false);
    useEffect(() => {
        const token = localStorage.getItem('access_token');
        const socketInstance = io(`${import.meta.env.VITE_API_URL}/document-edits`, {
            auth: { token },
            transports: ['websocket'],
        });

        setSocket(socketInstance);

        socketInstance.on('connect', async () => {
            console.log('✅ Connected:', socketInstance.id);
            setIsConnected(true);

            try {
                const response = await DocumentAPI.getDocument(id);
                setDocument(response.data);
                console.log(response.data);

                socketInstance.emit('joinDocument', id);
            } catch (error) {
                console.error('Failed to fetch document:', error);
            }
        });

        socketInstance.on('disconnect', () => {
            console.log('❌ Disconnected');
            setIsConnected(false);
        });

        return () => {
            socketInstance.disconnect();
        };
    }, [id]);
    return (
        <div className="bg-background text-on-surface h-screen w-screen overflow-hidden flex flex-col">
            <EditorHeader
                title={document.title}
                // onTitleChange={...}
                // onTitleBlur={...}
                saveStatus={saveStatus}
                presence={document.collaborators}
                isConnected={isConnected}
                onShare={() => setShowShareModal(true)}
            />

            <div className="flex flex-1 overflow-hidden">
                <EditorSidebar />

                <main className="flex-1 bg-surface-dim flex flex-col items-center overflow-hidden relative">
                    <EditorToolbar />

                    <div className="flex-1 w-full max-w-4xl px-12 overflow-y-auto">
                        <EditorCanvas />
                    </div>
                </main>

                <CollabPanel
                    collaborators={document.collaborators}
                    presence={document.collaborators}
                    isOpen={true}
                    onClose={() => { }}
                />
            </div>
            {showShareModal && (
                <ShareModal
                    document={document}
                    onClose={() => setShowShareModal(false)}
                />
            )}
        </div>
    );
};

export default Editor;