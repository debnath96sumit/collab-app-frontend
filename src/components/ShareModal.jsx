import React, { useState } from 'react';
import { X, UserPlus, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import ApiService from '../services/api';

const ShareModal = ({ onClose, document, onUpdate }) => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleInvite = async (e) => {
        e.preventDefault();
        if (!email) return;

        setIsLoading(true);
        try {
            await ApiService.addCollaborator(document.id, email);
            toast.success(`Invited ${email} to collaborate`);
            setEmail('');
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to invite user');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemove = async (userId) => {
        if (!window.confirm('Are you sure you want to remove this collaborator?')) return;

        try {
            await ApiService.removeCollaborator(document.id, userId);
            toast.success('Collaborator removed');
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error(error);
            toast.error('Failed to remove collaborator');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h3 className="text-xl font-semibold text-gray-900">Share Document</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    <form onSubmit={handleInvite} className="mb-8">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Invite by email
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="colleague@example.com"
                                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 outline-none transition-all"
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !email}
                                className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                            >
                                {isLoading ? <Loader2 className="animate-spin" size={18} /> : <UserPlus size={18} />}
                                Invite
                            </button>
                        </div>
                    </form>

                    <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3">
                            Who has access
                        </h4>
                        <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                            {/* Owner (Mocked for now as we don't have owner info in doc structure explicitly, assuming first or separate) */}
                            {/* <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">
                    You
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">You</p>
                    <p className="text-xs text-gray-500">Owner</p>
                  </div>
                </div>
              </div> */}

                            {document.collaborators && document.collaborators.length > 0 ? (
                                document.collaborators.map((collab) => (
                                    <div key={collab.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center font-bold text-sm uppercase">
                                                {collab.user?.username?.charAt(0) || '?'}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{collab.user?.username || 'Unknown User'}</p>
                                                <p className="text-xs text-gray-500">{collab.user?.email}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleRemove(collab.user?.id)}
                                            className="text-gray-400 hover:text-red-600 p-1.5 rounded-md hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                                            title="Remove access"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500 italic text-center py-4">
                                    No other collaborators yet.
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 p-4 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShareModal;
