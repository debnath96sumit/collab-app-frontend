import { useState } from 'react';
import {
    User,
    Lock,
    Bell,
    CreditCard,
    AlertTriangle,
    Camera,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const inputClass =
    'w-full bg-surface-container-highest border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-container text-on-surface outline-none text-sm';

const sectionClass = 'bg-surface-container-low rounded-3xl p-8 shadow-sm';

const Toggle = ({ isOn }) => (
    <button
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isOn ? 'bg-primary-container' : 'bg-surface-container-highest'
            }`}
    >
        <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isOn ? 'translate-x-6' : 'translate-x-1'
                }`}
        />
    </button>
);

const navItems = [
    { icon: User, label: 'Profile', id: 'profile' },
    { icon: Lock, label: 'Security', id: 'security' },
    { icon: Bell, label: 'Preferences', id: 'preferences' },
    { icon: CreditCard, label: 'Billing', id: 'billing' },
];

const SettingsBody = () => {
    const { user } = useAuth();

    const [activeSection, setActiveSection] = useState('profile');

    // ── Profile state ─────────────────────────────────────────────────────────
    const [profileData, setProfileData] = useState({
        fullName: user?.fullName ?? '',
        username: user?.username ?? '',
    });
    const [profileLoading, setProfileLoading] = useState(false);

    // ── Security state ────────────────────────────────────────────────────────
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [passwordLoading, setPasswordLoading] = useState(false);

    // ── Preferences state ─────────────────────────────────────────────────────
    const [preferences, setPreferences] = useState({
        emailNotifications: true,
        documentMentions: true,
        directMessages: false,
    });

    // ── Handlers ──────────────────────────────────────────────────────────────

    /**
     * handleProfileSave
     * TODO: call UserAPI.updateProfile({ fullName, username })
     * On success → update user in AuthContext
     */
    const handleProfileSave = async () => {
        setProfileLoading(true);
        try {
            // TODO: await UserAPI.updateProfile(profileData)
        } catch (error) {
            console.error('Failed to update profile:', error);
        } finally {
            setProfileLoading(false);
        }
    };

    /**
     * handlePasswordUpdate
     * TODO: call UserAPI.updatePassword({ currentPassword, newPassword })
     * Validate newPassword === confirmPassword before calling
     */
    const handlePasswordUpdate = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        setPasswordLoading(true);
        try {
            // TODO: await UserAPI.updatePassword(passwordData)
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            console.error('Failed to update password:', error);
        } finally {
            setPasswordLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-6 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-10 items-start">

                {/* ── Settings nav ── */}
                <nav className="flex flex-col gap-2 sticky top-6">
                    {navItems.map(({ icon: Icon, label, id }) => (
                        <button
                            key={id}
                            onClick={() => setActiveSection(id)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${activeSection === id
                                ? 'bg-surface-container-highest text-primary font-semibold shadow-sm'
                                : 'text-on-surface-variant hover:bg-surface-container-high'
                                }`}
                        >
                            <Icon size={18} />
                            <span className="text-sm">{label}</span>
                        </button>
                    ))}
                </nav>

                {/* ── Settings content ── */}
                <div className="flex flex-col gap-10 pb-24">

                    {/* Profile section */}
                    {activeSection === 'profile' && <section className={sectionClass}>
                        <div className="flex items-center gap-4 mb-8">
                            <User size={20} className="text-primary" />
                            <h3 className="text-xl font-headline font-bold text-on-surface">
                                Profile Information
                            </h3>
                        </div>

                        <div className="flex flex-col md:flex-row gap-10 items-start">
                            {/*
                     * Avatar upload — visual only for MVP
                     * TODO: wire up file input → upload to server → update avatarUrl
                     */}
                            <div className="flex flex-col items-center gap-3 group cursor-pointer flex-shrink-0">
                                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-surface-container-highest group-hover:border-primary-container/40 transition-all">
                                    <div className="w-full h-full bg-primary-container flex items-center justify-center text-4xl font-bold text-on-primary-container">
                                        {user?.fullName?.[0]?.toUpperCase() ?? 'U'}
                                    </div>
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Camera size={24} className="text-white" />
                                    </div>
                                </div>
                                <span className="text-xs text-on-surface-variant">
                                    Click to upload avatar
                                </span>
                            </div>

                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-label text-on-surface-variant px-1">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        value={profileData.fullName}
                                        onChange={(e) =>
                                            setProfileData((prev) => ({ ...prev, fullName: e.target.value }))
                                        }
                                        className={inputClass}
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-label text-on-surface-variant px-1">
                                        Username
                                    </label>
                                    <input
                                        type="text"
                                        value={profileData.username}
                                        onChange={(e) =>
                                            setProfileData((prev) => ({ ...prev, username: e.target.value }))
                                        }
                                        className={inputClass}
                                    />
                                </div>

                                <div className="flex flex-col gap-2 md:col-span-2">
                                    <label className="text-xs font-label text-on-surface-variant px-1">
                                        Email Address
                                    </label>
                                    {/*
                         * Email is read-only — cannot be changed
                         * matches backend where email is unique and not updatable via profile endpoint
                         */}
                                    <input
                                        type="email"
                                        value={user?.email ?? ''}
                                        readOnly
                                        className="w-full bg-surface-container-lowest text-on-surface-variant border-none rounded-xl px-4 py-3 cursor-not-allowed italic text-sm outline-none"
                                    />
                                    <span className="text-[10px] text-on-surface-variant/60 px-1">
                                        Email cannot be changed manually. Contact support for help.
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-outline-variant/10 flex justify-end">
                            <button
                                onClick={handleProfileSave}
                                disabled={profileLoading}
                                className="bg-gradient-to-br from-primary-fixed-dim to-primary-container text-on-primary-container font-semibold py-3 px-8 rounded-xl shadow-lg hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
                            >
                                {profileLoading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </section>}

                    {/* Security section */}
                    {activeSection === 'security' && <section className={sectionClass}>
                        <div className="flex items-center gap-4 mb-8">
                            <Lock size={20} className="text-primary" />
                            <h3 className="text-xl font-headline font-bold text-on-surface">
                                Security & Password
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 gap-6 max-w-xl">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-label text-on-surface-variant px-1">
                                    Current Password
                                </label>
                                <input
                                    type="password"
                                    value={passwordData.currentPassword}
                                    onChange={(e) =>
                                        setPasswordData((prev) => ({ ...prev, currentPassword: e.target.value }))
                                    }
                                    placeholder="••••••••••••"
                                    className={inputClass}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-label text-on-surface-variant px-1">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordData.newPassword}
                                        onChange={(e) =>
                                            setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))
                                        }
                                        className={inputClass}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-label text-on-surface-variant px-1">
                                        Confirm New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordData.confirmPassword}
                                        onChange={(e) =>
                                            setPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))
                                        }
                                        className={inputClass}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-outline-variant/10 flex justify-end">
                            <button
                                onClick={handlePasswordUpdate}
                                disabled={passwordLoading}
                                className="border border-primary-container/30 text-primary hover:bg-primary-container/10 font-semibold py-3 px-8 rounded-xl active:scale-95 transition-all disabled:opacity-50 text-sm"
                            >
                                {passwordLoading ? 'Updating...' : 'Update Password'}
                            </button>
                        </div>
                    </section>}

                    {/* Preferences section */}
                    {activeSection === 'preferences' && <section className={sectionClass}>
                        <div className="flex items-center gap-4 mb-8">
                            <Bell size={20} className="text-primary" />
                            <h3 className="text-xl font-headline font-bold text-on-surface">
                                Notification Preferences
                            </h3>
                        </div>

                        <div className="space-y-4">
                            {/*
                     * TODO: wire each toggle to preferences state
                     * and persist via UserAPI.updatePreferences()
                     */}
                            {[
                                {
                                    key: 'emailNotifications',
                                    label: 'Email Notifications',
                                    desc: 'Receive daily summaries and activity alerts',
                                },
                                {
                                    key: 'documentMentions',
                                    label: 'Document Mentions',
                                    desc: 'Get notified immediately when someone tags you',
                                },
                                {
                                    key: 'directMessages',
                                    label: 'Direct Messages',
                                    desc: 'Allow team members to send you private messages',
                                },
                            ].map(({ key, label, desc }) => (
                                <div
                                    key={key}
                                    className="flex items-center justify-between p-4 rounded-2xl hover:bg-surface-container-highest/30 transition-colors"
                                >
                                    <div className="flex flex-col">
                                        <span className="text-on-surface font-semibold text-sm">{label}</span>
                                        <span className="text-xs text-on-surface-variant">{desc}</span>
                                    </div>
                                    <div
                                        onClick={() =>
                                            setPreferences((prev) => ({ ...prev, [key]: !prev[key] }))
                                        }
                                    >
                                        <Toggle isOn={preferences[key]} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>}

                    {/* Danger zone (shown under billing) */}
                    {activeSection === 'billing' && <section className="bg-error-container/10 border border-error-container/20 rounded-3xl p-8">
                        <div className="flex items-center gap-4 mb-4">
                            <AlertTriangle size={20} className="text-error" />
                            <h3 className="text-xl font-headline font-bold text-on-surface">
                                Danger Zone
                            </h3>
                        </div>
                        <p className="text-sm text-on-surface-variant mb-6">
                            Permanently delete your account and all associated document data.
                            This action is irreversible.
                        </p>
                        {/*
                   * TODO: onClick → show confirmation modal before deleting
                   * Call UserAPI.deleteAccount() only after user confirms
                   */}
                        <button className="text-error font-semibold hover:underline text-sm px-1">
                            Delete Account...
                        </button>
                    </section>}
                </div>
            </div>
        </div>
    );
};

export default SettingsBody;