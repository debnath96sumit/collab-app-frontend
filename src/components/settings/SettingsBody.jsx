import { useState } from 'react';
import {
    User,
    Lock,
    Bell,
    CreditCard,
    AlertTriangle,
    Camera,
    Eye,
    EyeOff,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserAPI } from '../../utils/api';
import { changePasswordSchema, updateProfileSchema } from '../../lib/validations/user';
import { pushToast } from '../../utils/toaster';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

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
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    // // ── Profile state ─────────────────────────────────────────────────────────
    // const [profileData, setProfileData] = useState({
    //     fullName: user?.fullName ?? '',
    //     email: user?.email ?? '',
    //     username: user?.username ?? '',
    // });

    const {
        register: registerProfile,
        handleSubmit: handleProfileSubmit,
        formState: { errors: profileErrors, isDirty: isProfileDirty },
        reset: resetProfileForm
    } = useForm({
        resolver: zodResolver(updateProfileSchema),
        defaultValues: {
            fullName: user?.fullName ?? '',
            email: user?.email ?? '',
            username: user?.username ?? '',
        }
    });

    const [profileLoading, setProfileLoading] = useState(false);
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            pushToast({ message: 'Please upload an image file', type: 'error' });
            return;
        }
        setAvatarFile(file);
        setAvatarPreview(URL.createObjectURL(file));
    };

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

    const onProfileSubmit = async (data) => {
        setProfileLoading(true);
        try {
            const formData = new FormData();
            formData.append('fullName', data.fullName);
            formData.append('username', data.username);
            formData.append('email', data.email);

            console.log(avatarFile);

            if (avatarFile) {
                formData.append('avatar', avatarFile);
            }

            const res = await UserAPI.updateProfile(formData);
            if (res.statusCode === 200) {
                pushToast({ message: res.message, type: 'success' });
                resetProfileForm();
            } else {
                pushToast({ message: res.message, type: 'error' });
            }
        } catch (error) {
            console.error('Failed to update profile:', error);
        } finally {
            setProfileLoading(false);
        }
    };


    const handlePasswordInputChange = (e) => {
        const { name, value } = e.target;
        setPasswordData((prev) => ({ ...prev, [name]: value }));
        if (fieldErrors[name]) {
            setFieldErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    const handlePasswordUpdate = async (e) => {
        if (e) e.preventDefault();
        setFieldErrors({});
        const validation = changePasswordSchema.safeParse(passwordData);
        if (!validation.success) {
            setFieldErrors(validation.error.flatten().fieldErrors);
            return;
        }
        setPasswordLoading(true);
        try {
            const res = await UserAPI.changePassword({
                oldPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            });
            if (res.statusCode === 200) {
                pushToast({ message: res.message, type: 'success' });
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                pushToast({ message: res.message, type: 'error' });
            }
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
                        <form onSubmit={handleProfileSubmit(onProfileSubmit)}>
                            <div className="flex items-center gap-4 mb-8">
                                <User size={20} className="text-primary" />
                                <h3 className="text-xl font-headline font-bold text-on-surface">
                                    Profile Information
                                </h3>
                            </div>

                            <div className="flex flex-col md:flex-row gap-10 items-start">
                                <div className="flex flex-col items-center gap-3 flex-shrink-0">
                                    <div className="relative w-32 h-32 rounded-full overflow-visible">
                                        <div className="w-full h-full rounded-full border-4 border-surface-container-highest bg-primary-container flex items-center justify-center text-4xl font-bold text-on-primary-container overflow-hidden">
                                            {avatarPreview || user?.avatar ? (
                                                <img src={avatarPreview || user?.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                            ) : (
                                                user?.fullName?.[0]?.toUpperCase() ?? 'U'
                                            )}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => document.getElementById('profile-upload').click()}
                                            disabled={profileLoading}
                                            className="absolute bottom-0 right-0 bg-purple-600 rounded-full p-2 text-white hover:bg-purple-700 transition-colors disabled:opacity-50 shadow-md"
                                        >
                                            <Camera size={14} />
                                        </button>
                                        <input
                                            id="profile-upload"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleFileChange}
                                        />
                                    </div>
                                    <span className="text-xs text-on-surface-variant">
                                        Click camera icon to upload
                                    </span>
                                </div>

                                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-label text-on-surface-variant px-1">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            {...registerProfile("fullName")}
                                            className={inputClass}
                                        />
                                        {profileErrors.fullName && (
                                            <p className="text-xs text-error px-1">
                                                {profileErrors.fullName.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-label text-on-surface-variant px-1">
                                            Username
                                        </label>
                                        <input
                                            type="text"
                                            {...registerProfile("username")}
                                            className={inputClass}
                                        />
                                        {profileErrors.username && (
                                            <p className="text-xs text-error px-1">
                                                {profileErrors.username.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-2 md:col-span-2">
                                        <label className="text-xs font-label text-on-surface-variant px-1">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            {...registerProfile("email")}
                                            className={inputClass}
                                        />
                                        {profileErrors.email && (
                                            <p className="text-xs text-error px-1">
                                                {profileErrors.email.message}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-8 border-t border-outline-variant/10 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={profileLoading}
                                    className="bg-gradient-to-br from-primary-fixed-dim to-primary-container text-on-primary-container font-semibold py-3 px-8 rounded-xl shadow-lg hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
                                >
                                    {profileLoading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>

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
                                <div className="relative">
                                    <input
                                        type={showOldPassword ? 'text' : 'password'}
                                        name="currentPassword"
                                        value={passwordData.currentPassword}
                                        onChange={handlePasswordInputChange}
                                        placeholder="••••••••••••"
                                        className={inputClass}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowOldPassword(!showOldPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
                                    >
                                        {showOldPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                                    </button>
                                </div>
                                {fieldErrors.currentPassword && (
                                    <p className="text-xs text-error px-1">
                                        {fieldErrors.currentPassword}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-label text-on-surface-variant px-1">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showNewPassword ? 'text' : 'password'}
                                            name="newPassword"
                                            value={passwordData.newPassword}
                                            onChange={handlePasswordInputChange}
                                            className={inputClass}
                                            placeholder="••••••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
                                        >
                                            {showNewPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                                        </button>
                                    </div>
                                    {fieldErrors.newPassword && (
                                        <p className="text-xs text-error px-1">
                                            {fieldErrors.newPassword}
                                        </p>
                                    )}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-label text-on-surface-variant px-1">
                                        Confirm New Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            name="confirmPassword"
                                            value={passwordData.confirmPassword}
                                            onChange={handlePasswordInputChange}
                                            className={inputClass}
                                            placeholder="••••••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
                                        >
                                            {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                                        </button>
                                    </div>
                                    {fieldErrors.confirmPassword && (
                                        <p className="text-xs text-error px-1">
                                            {fieldErrors.confirmPassword}
                                        </p>
                                    )}
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