import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  MoreVertical, 
  Edit, 
  Trash2, 
  LogOut,
  User,
  Calendar,
  Clock,
  X,
  Check
} from 'lucide-react';
import ApiService from "../services/api";
import { useNavigate } from "react-router-dom";
import { formatDate } from '../helpers';
const DocumentDashboard = () => {
  const [documents, setDocuments] = useState([]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newDocTitle, setNewDocTitle] = useState('');
  const [editDocTitle, setEditDocTitle] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  // Load documents from API
  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const data = await ApiService.getAllDocuments();
      setDocuments(data.data);
    } catch (error) {
      console.error('Error loading documents:', error);
      setDocuments([]);
    }
  };
  const handleCreateDocument = async () => {
    if (!newDocTitle.trim()) {
      alert('Please enter a document title');
      return;
    }

    try {
      const data = await ApiService.createDocument({ title: newDocTitle, content: '' });
      setDocuments([data.data, ...documents]);
      setShowCreateModal(false);
      setNewDocTitle('');
    } catch (error) {
      console.error('Error creating document:', error);
      alert('Failed to create document');
    }
  };

  const handleEditDocument = async () => {
    if (!editDocTitle.trim()) {
      alert('Please enter a document title');
      return;
    }

    try {
      const response = await ApiService.updateDocument(selectedDocument.id, {
        title: editDocTitle,
      });
      if (response.statusText === 'OK') {
        const updatedDoc = response.data;
        setDocuments(documents.map(doc => 
          doc.id === updatedDoc.id ? updatedDoc : doc
        ));
        setShowEditModal(false);
        setSelectedDocument(null);
        setEditDocTitle('');
      }
    } catch (error) {
      console.error('Error updating document:', error);
      alert('Failed to update document');
    }
  };

  const handleDeleteDocument = async () => {
    try {
      const response = await ApiService.deleteDocument(selectedDocument.id);
      if (response.data) {
        setDocuments(documents.filter(doc => doc.id !== selectedDocument.id));
        setShowDeleteModal(false);
        setSelectedDocument(null);
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      alert('Failed to delete document');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    window.location.href = '/';
  };

  const openEditModal = (doc) => {
    setSelectedDocument(doc);
    setEditDocTitle(doc.title);
    setShowEditModal(true);
  };

  const openDeleteModal = (doc) => {
    setSelectedDocument(doc);
    setShowDeleteModal(true);
  };

  const openDocument = (doc) => {
    navigate(`/board/${doc.id}`);
  };

  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );


  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: '16px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            backgroundColor: '#4f46e5',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px'
          }}>
            📄
          </div>
          <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
            CollabDocs
          </span>
        </div>

        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              backgroundColor: '#f3f4f6',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              color: '#374151'
            }}
          >
            <User style={{ width: '20px', height: '20px' }} />
            <span>Account</span>
          </button>

          {showUserMenu && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '50px',
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              minWidth: '200px',
              zIndex: 50
            }}>
              <button
                onClick={handleLogout}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: '#ef4444',
                  textAlign: 'left'
                }}
              >
                <LogOut style={{ width: '18px', height: '18px' }} />
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 32px' }}>
        {/* Top Actions */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <h1 style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '8px'
            }}>
              My Documents
            </h1>
            <p style={{ color: '#6b7280', fontSize: '16px' }}>
              {documents.length} {documents.length === 1 ? 'document' : 'documents'}
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              backgroundColor: '#4f46e5',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            <Plus style={{ width: '20px', height: '20px' }} />
            New Document
          </button>
        </div>

        {/* Search Bar */}
        <div style={{
          position: 'relative',
          marginBottom: '32px'
        }}>
          <Search style={{
            position: 'absolute',
            left: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '20px',
            height: '20px',
            color: '#9ca3af'
          }} />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px 12px 48px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '16px',
              outline: 'none',
              backgroundColor: 'white',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Documents Grid */}
        {filteredDocuments.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '80px 20px',
            backgroundColor: 'white',
            borderRadius: '12px',
            border: '2px dashed #e5e7eb'
          }}>
            <FileText style={{
              width: '64px',
              height: '64px',
              color: '#d1d5db',
              margin: '0 auto 16px'
            }} />
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '8px'
            }}>
              {searchQuery ? 'No documents found' : 'No documents yet'}
            </h3>
            <p style={{ color: '#6b7280', marginBottom: '24px' }}>
              {searchQuery ? 'Try a different search term' : 'Create your first document to get started'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setShowCreateModal(true)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#4f46e5',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Create Document
              </button>
            )}
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '24px'
          }}>
            {filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                style={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '24px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '16px'
                }}>
                  <div
                    onClick={() => openDocument(doc)}
                    style={{ flex: 1 }}
                  >
                    <div style={{
                      width: '40px',
                      height: '40px',
                      backgroundColor: '#eff6ff',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '12px'
                    }}>
                      <FileText style={{ width: '24px', height: '24px', color: '#3b82f6' }} />
                    </div>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#1f2937',
                      marginBottom: '8px',
                      wordBreak: 'break-word'
                    }}>
                      {doc.title}
                    </h3>
                  </div>

                  <div style={{ position: 'relative' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const menu = e.currentTarget.nextSibling;
                        menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
                      }}
                      style={{
                        padding: '4px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        borderRadius: '4px'
                      }}
                    >
                      <MoreVertical style={{ width: '20px', height: '20px', color: '#6b7280' }} />
                    </button>

                    <div
                      style={{
                        display: 'none',
                        position: 'absolute',
                        right: 0,
                        top: '30px',
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        minWidth: '150px',
                        zIndex: 10
                      }}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(doc);
                        }}
                        style={{
                          width: '100%',
                          padding: '10px 16px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          border: 'none',
                          background: 'none',
                          cursor: 'pointer',
                          fontSize: '14px',
                          color: '#374151',
                          textAlign: 'left'
                        }}
                      >
                        <Edit style={{ width: '16px', height: '16px' }} />
                        Rename
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openDeleteModal(doc);
                        }}
                        style={{
                          width: '100%',
                          padding: '10px 16px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          border: 'none',
                          background: 'none',
                          cursor: 'pointer',
                          fontSize: '14px',
                          color: '#ef4444',
                          textAlign: 'left'
                        }}
                      >
                        <Trash2 style={{ width: '16px', height: '16px' }} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => openDocument(doc)}
                  style={{
                    display: 'flex',
                    gap: '16px',
                    fontSize: '14px',
                    color: '#6b7280'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar style={{ width: '14px', height: '14px' }} />
                    {formatDate(doc.createdAt)}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock style={{ width: '14px', height: '14px' }} />
                    {formatDate(doc.updatedAt)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Document Modal */}
      {showCreateModal && (
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
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '32px',
            width: '100%',
            maxWidth: '500px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '600',
                color: '#1f2937'
              }}>
                Create New Document
              </h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewDocTitle('');
                }}
                style={{
                  padding: '4px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <X style={{ width: '24px', height: '24px', color: '#6b7280' }} />
              </button>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '500',
                color: '#374151'
              }}>
                Document Title
              </label>
              <input
                type="text"
                value={newDocTitle}
                onChange={(e) => setNewDocTitle(e.target.value)}
                placeholder="Enter document title..."
                autoFocus
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleCreateDocument();
                  }
                }}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewDocTitle('');
                }}
                style={{
                  padding: '10px 20px',
                  backgroundColor: 'transparent',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateDocument}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#4f46e5',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                Create Document
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Document Modal */}
      {showEditModal && (
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
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '32px',
            width: '100%',
            maxWidth: '500px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '600',
                color: '#1f2937'
              }}>
                Rename Document
              </h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedDocument(null);
                  setEditDocTitle('');
                }}
                style={{
                  padding: '4px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <X style={{ width: '24px', height: '24px', color: '#6b7280' }} />
              </button>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '500',
                color: '#374151'
              }}>
                Document Title
              </label>
              <input
                type="text"
                value={editDocTitle}
                onChange={(e) => setEditDocTitle(e.target.value)}
                placeholder="Enter document title..."
                autoFocus
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleEditDocument();
                  }
                }}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedDocument(null);
                  setEditDocTitle('');
                }}
                style={{
                  padding: '10px 20px',
                  backgroundColor: 'transparent',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleEditDocument}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#4f46e5',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
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
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '32px',
            width: '100%',
            maxWidth: '450px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#fee2e2',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <Trash2 style={{ width: '24px', height: '24px', color: '#ef4444' }} />
            </div>

            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#1f2937',
              textAlign: 'center',
              marginBottom: '8px'
            }}>
              Delete Document
            </h2>

            <p style={{
              color: '#6b7280',
              textAlign: 'center',
              marginBottom: '24px'
            }}>
              Are you sure you want to delete "{selectedDocument?.title}"? This action cannot be undone.
            </p>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedDocument(null);
                }}
                style={{
                  flex: 1,
                  padding: '10px 20px',
                  backgroundColor: 'transparent',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteDocument}
                style={{
                  flex: 1,
                  padding: '10px 20px',
                  backgroundColor: '#ef4444',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentDashboard;