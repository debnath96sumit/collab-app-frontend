import { useState } from 'react';
import { X, Link, Copy, ChevronDown, Check } from 'lucide-react';
import { CollaboratorAPI, DocumentAPI } from '../utils/api';
import ModalWrapper from '../components/dashboard/modals/ModalWrapper';
import { pushToast } from '../utils/toaster';

const roleBadgeStyles = {
    owner: 'bg-primary-container/20 text-primary',
    editor: 'bg-emerald-900/40 text-emerald-400',
    commenter: 'bg-amber-900/40 text-amber-400',
    viewer: 'bg-secondary-container text-on-secondary-container',
    pending: 'bg-amber-900/40 text-amber-400',
};

const roleOptions = ['editor', 'commenter', 'viewer'];

const ShareModal = ({ document, onClose, activeCollaborators }) => {
    // ── Invite section state ─────────────────────────────────────────────────
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState('editor');
    const [inviteLoading, setInviteLoading] = useState(false);
    const [inviteError, setInviteError] = useState('');

    const [linkAccess, setLinkAccess] = useState(document?.linkAccess ?? 'restricted');
    const [linkPermission, setLinkPermission] = useState(document?.linkPermission ?? 'viewer');
    const [linkSettingsLoading, setLinkSettingsLoading] = useState(false);
    const [showLinkDropdown, setShowLinkDropdown] = useState(false);
    const [copied, setCopied] = useState(false);
    const [collaborators, setCollaborators] = useState(
        activeCollaborators ?? [],
    );
    const handleInvite = async () => {
        if (!inviteEmail.trim()) return;
        setInviteError('');
        setInviteLoading(true);

        try {
            const response = await CollaboratorAPI.invite(document.id, {
                email: inviteEmail,
                role: inviteRole,
            });
            setInviteEmail('');
            pushToast({ message: response.message, type: 'success' });
        } catch (error) {
            console.log(error);
            setInviteError(error?.response?.data?.message ?? 'Failed to send invite');
        } finally {
            setInviteLoading(false);
        }
    };


    const handleCopyLink = async () => {
        const shareUrl = `${window.location.origin}/document/shared/${document?.shareToken}`;
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleLinkSettingsChange = async (newAccess) => {
        setLinkAccess(newAccess);
        setShowLinkDropdown(false);
        setLinkSettingsLoading(true);

        try {
            const response = await CollaboratorAPI.updateDocSettings(document.id, {
                linkAccess: newAccess,
                linkPermission,
            });
            pushToast({ message: response.message, type: 'success' });
        } catch (error) {
            console.error('Failed to update link settings:', error);
            setLinkAccess(document?.linkAccess ?? 'restricted');
        } finally {
            setLinkSettingsLoading(false);
        }
    };

    const handleLinkPermissionChange = async (newPermission) => {
        setLinkPermission(newPermission);
        setLinkSettingsLoading(true);
        try {
            const response = await CollaboratorAPI.updateDocSettings(document.id, {
                linkAccess,
                linkPermission: newPermission,
            });
            pushToast({ message: response.message, type: 'success' });
        } catch (error) {
            console.error('Failed to update link permission:', error);
            setLinkPermission(document?.linkPermission ?? 'viewer');
        } finally {
            setLinkSettingsLoading(false);
        }
    };

    const handleRoleChange = async (collabId, newRole) => {
        const previousCollaborators = collaborators;
        setCollaborators((prev) =>
            prev.map((c) => (c.id === collabId ? { ...c, role: newRole } : c)),
        );
        try {
            const response = await CollaboratorAPI.updateCollaboratorRole(
                document.id,
                collabId,
                { role: newRole }
            );
            pushToast({ message: response.message, type: 'success' });
        } catch (error) {
            setCollaborators(previousCollaborators);
        }
    };
    const handleRemoveCollaborator = async (collabId) => {
        try {
            const response = await CollaboratorAPI.removeCollaborator(document.id, collabId);
            setCollaborators((prev) => prev.filter((c) => c.id !== collabId));
            pushToast({ message: response.message, type: 'success' });
        } catch (error) {
            console.log(error);
        }
    };

    const shareUrl = `${window.location.origin}/documents/shared/${document?.shareToken}`;

    return (
        <ModalWrapper onClose={onClose}>
            {linkSettingsLoading && (
                <div className="absolute top-0 left-0 right-0 h-1 overflow-hidden rounded-t-xl z-20">
                    <div className="absolute top-0 h-full bg-primary animate-progress"></div>
                </div>
            )}

            {/* ── Header ── */}
            <div className="flex items-center justify-between mb-6 flex-shrink-0">
                <h2 className="text-xl font-headline font-bold text-on-surface">
                    Share Document
                </h2>
                <button
                    onClick={onClose}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-bright transition-colors"
                >
                    <X size={18} className="text-on-surface-variant" />
                </button>
            </div>

            <div className="space-y-8 flex-1 overflow-y-auto min-h-0 custom-scrollbar">
                {/* ── Section 1: Invite people ── */}
                <section>
                    <label className="block text-sm font-medium text-on-surface-variant mb-3">
                        Invite people
                    </label>

                    <div className="flex flex-col gap-3">
                        {/* Email input — full width */}
                        <input
                            type="email"
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleInvite()}
                            placeholder="Add email address..."
                            className="w-full bg-surface-container-highest/30 border border-outline-variant/20 rounded-lg px-4 py-3 text-on-surface placeholder:text-outline/50 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-sm"
                        />

                        {/* Role select + Send button on same row */}
                        <div className="flex gap-3">
                            <select
                                value={inviteRole}
                                onChange={(e) => setInviteRole(e.target.value)}
                                className="flex-1 bg-surface-container-highest/30 border border-outline-variant/20 rounded-lg px-3 py-2.5 text-on-surface text-sm focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer"
                            >
                                {roleOptions.map((role) => (
                                    <option key={role} value={role} className="bg-surface-container-high capitalize">
                                        {role.charAt(0).toUpperCase() + role.slice(1)}
                                    </option>
                                ))}
                            </select>

                            <button
                                onClick={handleInvite}
                                disabled={inviteLoading || !inviteEmail.trim()}
                                className="bg-primary-container text-on-primary-container px-5 py-2.5 rounded-lg font-bold text-sm hover:brightness-110 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                            >
                                {inviteLoading ? 'Sending...' : 'Send Invite'}
                            </button>
                        </div>
                    </div>

                    {inviteError && (
                        <p className="text-sm text-error mt-2">{inviteError}</p>
                    )}
                </section>

                {/* ── Section 2: People with access ── */}
                <section>
                    <h3 className="text-sm font-medium text-on-surface-variant mb-4">
                        People with access
                    </h3>

                    <div className="space-y-1">
                        {/*
             * TODO: map over collaborators array
             * Each item shows avatar (initials), username, email, role badge
             * Owner row has no remove button
             * Other rows show a remove button on hover
             *
             * Pending collaborators show 'pending' badge in amber
             * Active collaborators show their role badge
             */}
                        {collaborators.length === 0 ? (
                            <p className="text-sm text-on-surface-variant text-center py-4">
                                No collaborators yet
                            </p>
                        ) : (
                            collaborators.map((collab) => {
                                const username = collab.user?.username ?? collab.invitedEmail;
                                const email = collab.invitedEmail ?? collab.user?.email;
                                const initial = username?.[0]?.toUpperCase() ?? '?';
                                const isOwner = collab.role === 'owner';

                                return (
                                    <div
                                        key={collab.id}
                                        className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-bright transition-colors group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-primary-container flex items-center justify-center text-sm font-bold text-on-primary-container flex-shrink-0">
                                                {collab.user?.avatarUrl ? (
                                                    <img
                                                        src={collab.user.avatarUrl}
                                                        alt={username}
                                                        className="w-full h-full rounded-full object-cover"
                                                    />
                                                ) : (
                                                    initial
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-on-surface truncate">
                                                    {username}
                                                </p>
                                                <p className="text-xs text-on-surface-variant truncate">{email}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            {isOwner ? (
                                                /* Owner — static badge, no actions */
                                                <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase ${roleBadgeStyles.owner}`}>
                                                    Owner
                                                </span>
                                            ) : (
                                                <>
                                                    <select
                                                        value={collab.role}
                                                        onChange={(e) => handleRoleChange(collab.id, e.target.value)}
                                                        className="opacity-0 group-hover:opacity-100 bg-surface-container-high border border-outline-variant/20 rounded-lg px-2 py-1 text-on-surface text-xs outline-none cursor-pointer transition-all w-28"
                                                    >
                                                        {roleOptions.map((role) => (
                                                            <option key={role} value={role} className="capitalize">
                                                                {role.charAt(0).toUpperCase() + role.slice(1)}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <span className={`group-hover:hidden px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase ${roleBadgeStyles[collab.role] ?? roleBadgeStyles.viewer}`}>
                                                        {collab.role}
                                                    </span>
                                                    <button
                                                        onClick={() => handleRemoveCollaborator(collab.id)}
                                                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-error/10 rounded-lg transition-all"
                                                        title="Remove collaborator"
                                                    >
                                                        <X size={14} className="text-error" />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </section>

                <section className="pt-4 border-t border-outline-variant/10">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center flex-shrink-0">
                                <Link size={18} className="text-on-surface-variant" />
                            </div>
                            <div className="relative">
                                <h4 className="text-sm font-semibold text-on-surface">General Access</h4>
                                <button
                                    onClick={() => setShowLinkDropdown((prev) => !prev)}
                                    className="flex items-center gap-1 text-xs text-on-surface-variant hover:text-primary transition-colors"
                                >
                                    <span>
                                        {linkAccess === 'public'
                                            ? 'Anyone with the link can access'
                                            : 'Restricted — only invited people'}
                                    </span>
                                    <ChevronDown size={12} />
                                </button>

                                {showLinkDropdown && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={() => setShowLinkDropdown(false)} />
                                        <div className="absolute left-0 top-6 z-20 w-56 bg-surface-container-high border border-outline-variant/20 rounded-xl shadow-xl overflow-hidden">
                                            <button
                                                onClick={() => handleLinkSettingsChange('restricted')}
                                                className="w-full px-4 py-2.5 text-left text-sm text-on-surface hover:bg-surface-bright transition-colors flex items-center justify-between"
                                            >
                                                Restricted
                                                {linkAccess === 'restricted' && <Check size={14} className="text-primary" />}
                                            </button>
                                            <button
                                                onClick={() => handleLinkSettingsChange('public')}
                                                className="w-full px-4 py-2.5 text-left text-sm text-on-surface hover:bg-surface-bright transition-colors flex items-center justify-between"
                                            >
                                                Anyone with the link
                                                {linkAccess === 'public' && <Check size={14} className="text-primary" />}
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Link permission — only shown when public */}
                    {linkAccess === 'public' && (
                        <div className="flex items-center gap-3 mb-4 p-3 bg-surface-container-highest/30 rounded-lg">
                            <span className="text-xs text-on-surface-variant flex-1">
                                People with the link can:
                            </span>
                            <select
                                value={linkPermission}
                                onChange={(e) => handleLinkPermissionChange(e.target.value)}
                                className="bg-surface-container-high border border-outline-variant/20 rounded-lg px-3 py-1.5 text-on-surface text-xs outline-none cursor-pointer"
                            >
                                <option value="viewer">View only</option>
                                <option value="commenter">Comment</option>
                                <option value="editor">Edit</option>
                            </select>
                        </div>
                    )}

                    {/* Share URL */}
                    <div className="bg-surface-container-lowest rounded-lg p-3 flex items-center gap-3 border border-outline-variant/10">
                        <Link size={14} className="text-on-surface-variant flex-shrink-0" />
                        <input
                            readOnly
                            value={shareUrl}
                            className="bg-transparent border-none text-xs text-outline w-full focus:ring-0 outline-none cursor-text select-all "
                        />
                    </div>
                </section>
            </div>

            {/* ── Footer ── */}
            <div className="mt-6 pt-4 border-t border-outline-variant/10 flex items-center justify-between flex-shrink-0">
                <button
                    onClick={handleCopyLink}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-primary/20 text-primary text-sm font-bold hover:bg-primary/5 transition-all active:scale-95"
                >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? 'Copied!' : 'Copy Link'}
                </button>
            </div>
        </ModalWrapper>
    );
};

export default ShareModal;