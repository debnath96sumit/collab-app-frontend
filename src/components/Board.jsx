import React, { useState, useEffect, useCallback } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { debounce } from 'lodash';
import { useParams } from "react-router-dom";
const CollaborativeEditor = () => {
   const { id } = useParams();
  const [socket, setSocket] = useState(null);
  const [saveStatus, setSaveStatus] = useState('saved');
  const [isConnected, setIsConnected] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [document, setDocument] = useState({
    id: null,
    title: null,
    content: null,
  });

  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL);
    setSocket(socket);

    const fetchDocument = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/documents/${id}`);
        console.log(response.data);
        
        setDocument(response.data);
        socket.emit('joinDocument', id);
      } catch (error) {
        console.error('Failed to fetch document:', error);
      }
    };
    fetchDocument();
  }, []);

  // Connected users (mock data)
  const users = [
    { id: 1, name: 'You', color: '#3b82f6' },
    { id: 2, name: 'Alice', color: '#ef4444' },
    { id: 3, name: 'Bob', color: '#10b981' }
  ];

  useEffect(() => {
    if (!socket) return;
    socket.on('connected', (data) => {
      console.log(data);
      setIsConnected(true);
    })

    socket.on('documentUpdated', (content) => {
      setDocument(prev => ({ ...prev, content }));

    });
  }, [socket]);


  const debouncedEmit = useCallback(
    debounce((docId, content) => {
      socket.emit('editDocument', { docId, content });
      setSaveStatus('saved');
    }, 1000), 
    [socket] 
  );
  
  const handleContentChange = (e) => {
    const newContent = e.target.value;

    setDocument(prev => ({ ...prev, content: newContent }));
    setSaveStatus('saving');

    debouncedEmit(document.id, newContent);
  };
  
  // Handle title changes
  const handleTitleChange = (e) => {
    setDocument(prev => ({ ...prev, title: e.target.value || 'Untitled Document' }));
    setSaveStatus('saving');
    socket.emit('renameDocument', { docId: document.id, name: document.title });
  };

  // Copy share link
  const copyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/doc/${document.id}`);
    alert('Link copied to clipboard!');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div style={{ 
        backgroundColor: 'white', 
        borderBottom: '1px solid #e0e0e0',
        padding: '12px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ 
            width: '32px', 
            height: '32px', 
            backgroundColor: '#4285f4',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold'
          }}>
            📄
          </div>
          
          <input
            type="text"
            value={document.title}
            onChange={handleTitleChange}
            style={{
              fontSize: '18px',
              fontWeight: '500',
              border: 'none',
              background: 'transparent',
              outline: 'none',
              padding: '8px',
              borderRadius: '4px',
              minWidth: '200px'
            }}
            placeholder="Document title"
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Save Status */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            color: saveStatus === 'saving' ? '#fbbc04' : saveStatus === 'saved' ? '#34a853' : '#ea4335',
            fontSize: '14px'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: saveStatus === 'saving' ? '#fbbc04' : saveStatus === 'saved' ? '#34a853' : '#ea4335'
            }}></div>
            {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'All changes saved' : 'Error saving'}
          </div>

          {/* Users */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {users.map((user) => (
              <div
                key={user.id}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: user.color,
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  border: '2px solid white',
                  marginLeft: user.id > 1 ? '-8px' : '0'
                }}
                title={user.name}
              >
                {user.name[0]}
              </div>
            ))}
          </div>

          <button
            onClick={() => setShowShareModal(true)}
            style={{
              padding: '8px 16px',
              backgroundColor: '#4285f4',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            🔗 Share
          </button>
        </div>
      </div>

      {/* Connection Status */}
      <div style={{ 
        backgroundColor: '#e8f0fe',
        padding: '8px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '13px',
        color: '#1a73e8'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: isConnected ? '#34a853' : '#ea4335'
          }}></div>
          {isConnected ? 'Connected to server' : 'Connecting...'}
        </div>
        <div>Last modified: {document.updatedAt}</div>
      </div>

      {/* Editor */}
      <div style={{ maxWidth: '800px', margin: '24px auto', padding: '0 24px' }}>
        <div style={{ 
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          {/* Toolbar */}
          <div style={{ 
            backgroundColor: '#f8f9fa',
            borderBottom: '1px solid #e0e0e0',
            padding: '12px 16px',
            display: 'flex',
            gap: '8px'
          }}>
            <button style={{ padding: '6px 12px', border: 'none', background: 'transparent', borderRadius: '4px', cursor: 'pointer' }}>
              <strong>B</strong>
            </button>
            <button style={{ padding: '6px 12px', border: 'none', background: 'transparent', borderRadius: '4px', cursor: 'pointer' }}>
              <em>I</em>
            </button>
            <button style={{ padding: '6px 12px', border: 'none', background: 'transparent', borderRadius: '4px', cursor: 'pointer' }}>
              <u>U</u>
            </button>
            <span style={{ margin: '0 8px', color: '#ccc' }}>|</span>
            <button style={{ padding: '6px 12px', border: 'none', background: 'transparent', borderRadius: '4px', cursor: 'pointer' }}>
              H1
            </button>
            <button style={{ padding: '6px 12px', border: 'none', background: 'transparent', borderRadius: '4px', cursor: 'pointer' }}>
              •
            </button>
          </div>

          {/* Text Area */}
          <div style={{ padding: '32px' }}>
            <textarea
              value={document.content}
              onChange={handleContentChange}
              placeholder="Start typing your document here..."
              style={{
                width: '100%',
                height: '500px',
                border: 'none',
                outline: 'none',
                fontFamily: 'Times New Roman, serif',
                fontSize: '16px',
                lineHeight: '1.6',
                resize: 'none',
                backgroundColor: 'transparent'
              }}
            />
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '24px',
            width: '90%',
            maxWidth: '500px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '500', margin: 0 }}>Share Document</h3>
              <button 
                onClick={() => setShowShareModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}
              >
                ×
              </button>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Share Link
              </label>
              <div style={{ display: 'flex' }}>
                <input
                  type="text"
                  value={`${window.location.origin}/doc/${document.id}`}
                  readOnly
                  style={{
                    flex: 1,
                    padding: '12px',
                    border: '1px solid #e0e0e0',
                    borderRight: 'none',
                    borderRadius: '4px 0 0 4px',
                    backgroundColor: '#f5f5f5'
                  }}
                />
                <button
                  onClick={copyLink}
                  style={{
                    padding: '12px 16px',
                    backgroundColor: '#4285f4',
                    color: 'white',
                    border: '1px solid #4285f4',
                    borderRadius: '0 4px 4px 0',
                    cursor: 'pointer'
                  }}
                >
                  Copy
                </button>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Access Level
              </label>
              <select style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #e0e0e0',
                borderRadius: '4px'
              }}>
                <option>Can edit</option>
                <option>Can comment</option>
                <option>Can view</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
              <button
                onClick={() => setShowShareModal(false)}
                style={{
                  padding: '8px 16px',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  color: '#666'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => setShowShareModal(false)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#4285f4',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollaborativeEditor;