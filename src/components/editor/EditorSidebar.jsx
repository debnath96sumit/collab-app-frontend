import { useNavigate } from 'react-router-dom';
import { FolderOpen, Users, History, Star, Trash2, Plus, HelpCircle, Zap } from 'lucide-react';

/**
 * EditorSidebar — left navigation panel in the editor
 *
 * This is simpler than the dashboard sidebar — no tab switching needed.
 * It just shows navigation links and a new document button.
 *
 * Props:
 * - none for now — all navigation is route-based
 *
 * Implementation notes:
 * - "New Document" button → navigate('/dashboard') and open create modal
 *   For MVP just navigate to dashboard, creating from editor is out of scope
 * - Nav items are visual only for now — only "My Workspace" navigates anywhere
 */

const navItems = [
    { icon: FolderOpen, label: 'My Workspace', path: '/dashboard' },
    { icon: Users, label: 'Team Space', path: null },
    { icon: History, label: 'Recent', path: null },
    { icon: Star, label: 'Starred', path: null },
    { icon: Trash2, label: 'Trash', path: null },
];

const EditorSidebar = () => {
    const navigate = useNavigate();

    return (
        <aside className="w-64 flex-shrink-0 bg-slate-950 flex flex-col h-full py-4 border-r border-outline-variant/10">

            {/* ── Workspace label + new doc button ── */}
            <div className="px-6 mb-6">
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <FolderOpen size={16} className="text-blue-400" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-200 leading-tight">
                            My Workspace
                        </p>
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider">
                            Collaborative Space
                        </p>
                    </div>
                </div>

                {/*
         * TODO: onClick → navigate('/dashboard')
         * For MVP we don't create documents from the editor
         */}
                <button
                    onClick={() => navigate('/dashboard')}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-blue-400 border border-blue-500/20 py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-semibold transition-all"
                >
                    <Plus size={14} />
                    New Document
                </button>
            </div>

            {/* ── Nav items ── */}
            <nav className="flex-1 space-y-1 px-3">
                <p className="text-[10px] uppercase tracking-widest text-slate-600 font-bold px-3 mb-2">
                    Outline
                </p>

                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = item.path === '/dashboard';

                    return (
                        <button
                            key={item.label}
                            onClick={() => item.path && navigate(item.path)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                ${isActive
                                    ? 'text-blue-400 bg-blue-500/10 border-r-2 border-blue-500'
                                    : 'text-slate-500 hover:bg-slate-900/40 hover:text-slate-200'
                                }
                ${!item.path ? 'cursor-default' : 'cursor-pointer'}
              `}
                        >
                            <Icon size={16} />
                            <span>{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            {/* ── Bottom actions ── */}
            <div className="px-4 pb-4 space-y-1 border-t border-slate-900 pt-4">
                <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-500 hover:bg-slate-800/40 hover:text-slate-200 rounded-lg transition-all text-sm">
                    <HelpCircle size={16} />
                    <span>Help</span>
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-500 hover:bg-slate-800/40 hover:text-slate-200 rounded-lg transition-all text-sm">
                    <Zap size={16} />
                    <span>Upgrade</span>
                </button>
            </div>
        </aside>
    );
};

export default EditorSidebar;