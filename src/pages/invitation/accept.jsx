import { useEffect, useState } from 'react';
import { CollaboratorAPI } from '../../utils/api';
import Loading from '../../components/Loading';

const InvitationAccept = () => {
    const [inviteDetails, setInviteDetails] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(null);

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const inviteToken = searchParams.get('token');

        if (!inviteToken) {
            setError('Invalid invitation link');
            setLoading(false);
            return;
        }

        setToken(inviteToken);
        validateInvitation(inviteToken);
    }, []);

    const validateInvitation = async (inviteToken) => {
        try {
            const res = await CollaboratorAPI.validateInvitation(inviteToken);
            console.log('Invitation details', res.data);
            setInviteDetails(res.data);
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = () => {
        const accessToken = localStorage.getItem('access_token');

        if (accessToken) {
            acceptInvitation(token);
        } else {
            if (inviteDetails?.email) {
                localStorage.setItem('inviteEmail', inviteDetails.email);
            }
            window.location.href = `/login?redirect=/invitation/accept?token=${token}`;
        }
    };

    const acceptInvitation = async (token) => {
        try {
            const res = await CollaboratorAPI.acceptInvitation(token);
            if (res.status === 200) {
                window.location.href = `/documents/${res.data.data.documentId}`;
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        }
    };

    // --- LOADING STATE ---
    if (loading) {
        return (
            <Loading message='Validating invitation...' />
        );
    }

    // --- ERROR STATE ---
    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-red-500">Oops!</h2>
                    <p className="text-gray-600 mt-2">{error}</p>
                    <a href="/" className="mt-4 inline-block text-blue-500 underline">
                        Go to Home
                    </a>
                </div>
            </div>
        );
    }

    // --- INVITE DETAILS STATE ---
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="bg-white rounded-xl shadow-md p-8 max-w-md w-full text-center">
                <h1 className="text-2xl font-bold text-gray-800">You're Invited!</h1>

                <p className="text-gray-500 mt-2">
                    <span className="font-medium text-gray-700">{inviteDetails.inviterName}</span>{' '}
                    invited you to collaborate on
                </p>

                <div className="mt-4 bg-gray-100 rounded-lg p-4">
                    <p className="text-lg font-semibold text-gray-800">{inviteDetails.docTitle}</p>
                    <p className="text-sm text-gray-500 mt-1">
                        Role: <span className="capitalize font-medium">{inviteDetails.role}</span>
                    </p>
                </div>

                <p className="text-sm text-gray-400 mt-4">
                    Invited email: {inviteDetails.email}
                </p>

                <button
                    onClick={handleAccept}
                    className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                >
                    Accept Invitation
                </button>

                <a href="/" className="mt-3 inline-block text-sm text-gray-400 hover:underline">
                    Decline
                </a>
            </div>
        </div>
    );
};

export default InvitationAccept;