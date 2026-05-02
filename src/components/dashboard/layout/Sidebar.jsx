import { useNavigate, useLocation } from 'react-router-dom';
import {
    FolderOpen,
    Users,
    Plus,
    HelpCircle,
    Zap,
    Trash2,
    Clock
} from 'lucide-react';

const navItems = [
    { icon: FolderOpen, label: 'My Workspace', path: '/dashboard', tab: 'my' },
    { icon: Users, label: 'Shared With Me', path: '/dashboard', tab: 'shared' },
    // { icon: Clock, label: 'Recent', path: '/dashboard', tab: 'recent' },
    // { icon: Trash2, label: 'Trash', path: '/dashboard', tab: 'trash' },
];

const Sidebar = ({ activeTab, onTabChange, onNewDocument }) => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <aside className="h-screen w-64 flex-shrink-0 bg-slate-950 flex flex-col pt-5 border-r border-outline-variant/10">
            {/* Workspace label */}

            <div className="px-6 mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <FolderOpen size={16} className="text-blue-400" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-400 leading-tight">
                            My Workspace
                        </p>
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider pt-1">
                            Collaborative Space
                        </p>
                    </div>
                </div>
            </div>

            {/* Nav items */}
            <nav className="flex-1 space-y-1 px-3">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.tab;

                    return (
                        <button
                            key={item.tab}
                            onClick={() => onTabChange(item.tab)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                ${isActive
                                    ? 'text-blue-400 bg-blue-500/10 border-r-2 border-blue-500'
                                    : 'text-slate-500 hover:bg-slate-900 hover:text-slate-200'
                                }`}
                        >
                            <Icon size={18} />
                            <span>{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            {/* Bottom actions */}
            <div className="px-4 pb-8 space-y-3">
                <button
                    onClick={onNewDocument}
                    className="w-full bg-primary-container hover:bg-blue-500 text-on-primary-container font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-95 text-sm"
                >
                    <Plus size={16} />
                    New Document
                </button>

                <div className="space-y-1">
                    <button className="w-full flex items-center gap-3 px-2 py-2 text-slate-500 hover:bg-slate-800/40 rounded-lg transition-all text-sm">
                        <HelpCircle size={16} />
                        <span>Help</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-2 py-2 text-slate-500 hover:bg-slate-800/40 rounded-lg transition-all text-sm">
                        <Zap size={16} />
                        <span>Upgrade</span>
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;