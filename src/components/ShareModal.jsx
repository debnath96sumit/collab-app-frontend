import { useState } from 'react';
import { X, Link, Copy, ChevronDown, Check } from 'lucide-react';
import { CollaboratorAPI } from '../utils/api';
import ModalWrapper from '../components/dashboard/modals/ModalWrapper';

/**
 * Role badge styles — same pattern as CollabPanel
 * Used for the "people with access" list
 */
const roleBadgeStyles = {
    owner: 'bg-primary-container/20 text-primary',
    editor: 'bg-emerald-900/40 text-emerald-400',
    commenter: 'bg-amber-900/40 text-amber-400',
    viewer: 'bg-secondary-container text-on-secondary-container',
    pending: 'bg-amber-900/40 text-amber-400',
};

/**
 * InvitableRole options for the dropdown
 * OWNER is excluded — you can't invite someone as owner
 */
const roleOptions = ['editor', 'commenter', 'viewer'];

/**
 * ShareModal — full share dialog for a document
 *
 * Props:
 * - document: { id, title, shareToken, linkAccess, linkPermission, collaborators }
 * - onClose: fn — closes the modal
 *
 * Sections:
 * 1. Invite people → POST /documents/:id/collaborators
 * 2. People with access → GET /documents/:id/collaborators (already on document)
 * 3. General access → PATCH /documents/:id/link-settings
 */
const ShareModal = ({ document, onClose }) => {
    // ── Invite section state ─────────────────────────────────────────────────
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState('editor');
    const [inviteLoading, setInviteLoading] = useState(false);
    const [inviteError, setInviteError] = useState('');

    // ── Link settings state ──────────────────────────────────────────────────
    const [linkAccess, setLinkAccess] = useState(document?.linkAccess ?? 'restricted');
    const [linkPermission, setLinkPermission] = useState(document?.linkPermission ?? 'viewer');
    const [linkSettingsLoading, setLinkSettingsLoading] = useState(false);
    const [showLinkDropdown, setShowLinkDropdown] = useState(false);

    // ── Copy link state ──────────────────────────────────────────────────────
    const [copied, setCopied] = useState(false);

    // ── Collaborators local state ────────────────────────────────────────────
    /*
     * Start with collaborators from the document prop
     * When invite succeeds, append the new collaborator to this list
     * so UI updates immediately without refetching
     */
    const [collaborators, setCollaborators] = useState(
        document?.collaborators ?? [],
    );

    // ── Handlers ─────────────────────────────────────────────────────────────

    /**
     * handleInvite — sends invite to POST /documents/:id/collaborators
     *
     * TODO:
     * 1. Validate inviteEmail is not empty
     * 2. Call CollaboratorAPI.invite(document.id, { email: inviteEmail, role: inviteRole })
     * 3. On success → append new collaborator to local collaborators state
     * 4. Clear inviteEmail input
     * 5. On error → set inviteError message
     */
    const handleInvite = async () => {
        if (!inviteEmail.trim()) return;
        setInviteError('');
        setInviteLoading(true);

        try {
            const response = await CollaboratorAPI.invite(document.id, {
                email: inviteEmail,
                role: inviteRole,
            });

            setCollaborators((prev) => [...prev, response.data]);
            setInviteEmail('');
        } catch (error) {
            console.log(error);
            setInviteError(error?.response?.data?.message ?? 'Failed to send invite');
        } finally {
            setInviteLoading(false);
        }
    };

    /**
     * handleCopyLink — copies share link to clipboard
     *
     * TODO:
     * - Build the share URL using document.shareToken
     * - navigator.clipboard.writeText(shareUrl)
     * - Set copied to true, reset after 2 seconds
     */
    const handleCopyLink = async () => {
        const shareUrl = `${window.location.origin}/documents/shared/${document?.shareToken}`;
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    /**
     * handleLinkSettingsChange — updates linkAccess + linkPermission
     *
     * TODO:
     * - Call DocumentAPI.updateLinkSettings(document.id, { linkAccess, linkPermission })
     * - This maps to PATCH /documents/:id/link-settings
     * - Call after user changes the dropdown selection
     */
    const handleLinkSettingsChange = async (newAccess) => {
        setLinkAccess(newAccess);
        setShowLinkDropdown(false);
        setLinkSettingsLoading(true);

        try {
            // TODO: replace with your actual API call
            // await DocumentAPI.updateLinkSettings(document.id, {
            //   linkAccess: newAccess,
            //   linkPermission,
            // });
        } catch (error) {
            console.error('Failed to update link settings:', error);
        } finally {
            setLinkSettingsLoading(false);
        }
    };

    const shareUrl = `${window.location.origin}/documents/shared/${document?.shareToken}`;

    return (
        <ModalWrapper onClose={onClose}>
            {/* ── Header ── */}
            <div className="flex items-center justify-between mb-6">
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

            <div className="space-y-8">
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

                    <div className="space-y-1 max-h-[200px] overflow-y-auto">
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
                                const isPending = collab.status === 'pending';
                                const displayRole = isPending ? 'pending' : collab.role;
                                const username = collab.user?.username ?? collab.invitedEmail;
                                const email = collab.invitedEmail ?? collab.user?.email;
                                const initial = username?.[0]?.toUpperCase() ?? '?';

                                return (
                                    <div
                                        key={collab.id}
                                        className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-bright transition-colors group"
                                    >
                                        <div className="flex items-center gap-3">
                                            {/* Avatar */}
                                            <div className="w-9 h-9 rounded-full bg-primary-container flex items-center justify-center text-sm font-bold text-on-primary-container flex-shrink-0">
                                                {initial}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-on-surface">
                                                    {username}
                                                    {isPending && (
                                                        <span className="ml-2 text-xs text-on-surface-variant font-normal">
                                                            (invite pending)
                                                        </span>
                                                    )}
                                                </p>
                                                <p className="text-xs text-on-surface-variant">{email}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase ${roleBadgeStyles[displayRole] ?? roleBadgeStyles.viewer}`}
                                            >
                                                {displayRole}
                                            </span>

                                            {/*
                       * TODO: remove button — only show for non-owner collaborators
                       * onClick → CollaboratorAPI.remove(document.id, collab.id)
                       * On success → filter collab out of local collaborators state
                       */}
                                            {collab.role !== 'owner' && (
                                                <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-error/10 rounded-lg transition-all">
                                                    <X size={14} className="text-error" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </section>

                {/* ── Section 3: General access (link settings) ── */}
                <section className="pt-4 border-t border-outline-variant/10">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center flex-shrink-0">
                                <Link size={18} className="text-on-surface-variant" />
                            </div>

                            <div>
                                <h4 className="text-sm font-semibold text-on-surface">
                                    General Access
                                </h4>

                                {/*
                 * TODO: clicking this should toggle showLinkDropdown
                 * Dropdown shows: Restricted, Anyone with link
                 * Selecting calls handleLinkSettingsChange(newAccess)
                 */}
                                <div className="relative">
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
                                            <div
                                                className="fixed inset-0 z-10"
                                                onClick={() => setShowLinkDropdown(false)}
                                            />
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

                        {/* Copy link button */}
                        <button
                            onClick={handleCopyLink}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-primary/20 text-primary text-sm font-bold hover:bg-primary/5 transition-all active:scale-95"
                        >
                            {copied ? <Check size={16} /> : <Copy size={16} />}
                            {copied ? 'Copied!' : 'Copy Link'}
                        </button>
                    </div>

                    {/* Share URL display */}
                    <div className="bg-surface-container-lowest rounded-lg p-3 flex items-center gap-3 border border-outline-variant/10">
                        <Link size={14} className="text-on-surface-variant flex-shrink-0" />
                        <input
                            readOnly
                            value={shareUrl}
                            className="bg-transparent border-none text-xs text-outline w-full focus:ring-0 outline-none cursor-text select-all"
                        />
                    </div>

                    {/*
           * TODO: if linkAccess is 'public', show linkPermission dropdown
           * so owner can set whether link visitors can view/comment/edit
           *
           * {linkAccess === 'public' && (
           *   <select value={linkPermission} onChange={...}>
           *     <option value="viewer">Viewer</option>
           *     <option value="commenter">Commenter</option>
           *     <option value="editor">Editor</option>
           *   </select>
           * )}
           */}
                </section>
            </div>

            {/* ── Footer ── */}
            <div className="mt-6 pt-4 border-t border-outline-variant/10 flex items-center justify-between">
                <p className="text-[10px] text-on-surface-variant">
                    Link expires in 30 days
                </p>
                <button className="text-xs font-bold text-on-surface-variant hover:text-on-surface transition-colors">
                    Manage Link Permissions
                </button>
            </div>
        </ModalWrapper>
    );
};

export default ShareModal;