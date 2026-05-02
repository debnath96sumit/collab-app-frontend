import { Search, Bell, Settings, Menu, X } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FileText, LogOut, User } from 'lucide-react';
import { getInitials } from '../../../helpers';
import SettingsModal from '../../settings/SettingsModal';

const DashboardHeader = ({ searchQuery, onSearchChange, onMenuClick }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [searchExpanded, setSearchExpanded] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <>
            <header className="w-full h-16 sticky top-0 z-50 bg-slate-900/60 backdrop-blur-xl flex items-center justify-between px-4 sm:px-6 shadow-sm shadow-blue-500/5 border-b border-outline-variant/10">

                {searchExpanded && (
                    <div className="absolute inset-0 z-10 md:hidden flex items-center px-4 bg-slate-900/95 backdrop-blur-xl">
                        <Search size={16} className="text-slate-400 flex-shrink-0 mr-3" />
                        <input
                            type="text"
                            placeholder="Search documents..."
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            autoFocus
                            className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-slate-200 placeholder-slate-500 outline-none"
                        />
                        <button
                            onClick={() => {
                                setSearchExpanded(false);
                                onSearchChange('');
                            }}
                            className="ml-3 p-1.5 text-slate-400 hover:text-slate-200 rounded-lg transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>
                )}

                <div className="flex items-center gap-3 sm:gap-6">
                    <button
                        onClick={onMenuClick}
                        className="md:hidden p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 rounded-lg transition-colors"
                    >
                        <Menu size={18} />
                    </button>

                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <FileText size={20} className="text-primary" fill="currentColor" />
                        <span className="text-lg font-bold tracking-tight text-slate-100 font-headline hidden sm:block">
                            CollabDocs
                        </span>
                    </div>

                    {/* Desktop search — hidden on mobile */}
                    <div className="hidden md:flex items-center bg-slate-800/50 rounded-lg px-3 py-1.5 w-72 focus-within:ring-1 ring-blue-500/50 transition-all">
                        <Search size={16} className="text-slate-400 flex-shrink-0" />
                        <input
                            type="text"
                            placeholder="Search documents..."
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="bg-transparent border-none focus:ring-0 text-sm text-slate-200 placeholder-slate-500 w-full ml-2 outline-none"
                        />
                    </div>
                </div>

                {/* ── Right: search icon (mobile) + bell + settings + avatar ── */}
                <div className="flex items-center gap-1 sm:gap-2">
                    {/* Search icon — mobile only, toggles expanded search */}
                    <button
                        onClick={() => setSearchExpanded(true)}
                        className="md:hidden p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 rounded-lg transition-colors active:scale-95"
                    >
                        <Search size={18} />
                    </button>

                    <button className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors rounded-lg active:scale-95">
                        <Bell size={18} />
                    </button>
                    <button
                        onClick={() => setShowSettings(true)}
                        className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors rounded-lg active:scale-95"
                    >
                        <Settings size={18} />
                    </button>

                    {/* Avatar + dropdown */}
                    <div className="relative ml-1">
                        <button
                            onClick={() => setShowUserMenu((prev) => !prev)}
                            className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container text-xs font-bold border border-outline-variant/30 hover:ring-2 ring-primary/30 transition-all"
                        >
                            {user?.avatarUrl ? (
                                <img src={user?.avatarUrl} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                            ) : (
                                getInitials(user?.fullName)
                            )}
                        </button>

                        {showUserMenu && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setShowUserMenu(false)}
                                />
                                <div className="absolute right-0 top-10 z-20 w-48 bg-surface-container-high border border-outline-variant/20 rounded-xl shadow-xl overflow-hidden">
                                    <div className="px-4 py-3 border-b border-outline-variant/10">
                                        <p className="text-sm font-semibold text-on-surface truncate">
                                            {user?.fullName}
                                        </p>
                                        <p className="text-xs text-on-surface-variant truncate">
                                            {user?.email}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setShowUserMenu(false);
                                            setShowSettings(true);
                                        }}
                                        className="w-full px-4 py-2.5 flex items-center gap-3 text-sm text-on-surface hover:bg-surface-bright transition-colors"
                                    >
                                        <User size={16} className="text-on-surface-variant" />
                                        Profile
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full px-4 py-2.5 flex items-center gap-3 text-sm text-error hover:bg-surface-bright transition-colors"
                                    >
                                        <LogOut size={16} />
                                        Logout
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </header>

            <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
        </>
    );
};

export default DashboardHeader;