import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, HelpCircle, History, Shield, Unlink } from 'lucide-react';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background text-on-surface flex flex-col overflow-hidden">

            {/* Navbar */}
            <nav className="bg-slate-900/60 backdrop-blur-xl w-full h-16 sticky top-0 z-50 flex items-center justify-between px-6 shadow-sm shadow-blue-500/5">
                <span className="text-xl font-bold tracking-tight text-slate-100 font-headline">
                    CollabDocs
                </span>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="px-4 py-2 text-sm text-on-surface-variant hover:text-on-surface transition-colors"
                >
                    Go to Dashboard
                </button>
            </nav>

            {/* Main */}
            <main className="flex-1 relative flex items-center justify-center p-6">

                {/* Background decorative 404 text */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center select-none">
                    <span
                        className="font-headline font-extrabold text-[20rem] leading-none"
                        style={{
                            WebkitTextStroke: '1px rgba(195, 198, 215, 0.07)',
                            color: 'transparent',
                        }}
                    >
                        404
                    </span>
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center text-center max-w-xl">

                    {/* Icon */}
                    <div className="w-24 h-24 mb-8 rounded-2xl bg-surface-container-high flex items-center justify-center ring-1 ring-outline-variant/20 shadow-2xl shadow-primary/5">
                        <Unlink size={48} className="text-primary-fixed-dim" strokeWidth={1.5} />
                    </div>

                    {/* Heading */}
                    <h1 className="font-headline text-5xl md:text-6xl font-bold text-on-surface tracking-tight mb-4">
                        Page not found
                    </h1>

                    <p className="text-lg text-on-surface-variant leading-relaxed mb-10">
                        The link you followed might be broken, or the document has been
                        moved to a restricted workspace. Verify your access permissions
                        or head back home.
                    </p>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-br from-primary-fixed-dim to-primary-container text-on-primary-fixed font-semibold rounded-lg hover:shadow-lg hover:shadow-primary/20 active:scale-95 transition-all"
                        >
                            <LayoutDashboard size={18} fill="currentColor" />
                            Go to Dashboard
                        </button>
                        <button className="px-8 py-3.5 bg-surface-container-highest text-on-surface font-medium rounded-lg border border-outline-variant/10 hover:bg-surface-bright active:scale-95 transition-all">
                            Report an Issue
                        </button>
                    </div>

                    {/* Bottom links */}
                    <div className="mt-16 pt-8 border-t border-outline-variant/10 w-full">
                        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
                            {[
                                { icon: HelpCircle, label: 'Help Center' },
                                { icon: History, label: 'Recent Docs' },
                                { icon: Shield, label: 'Privacy' },
                            ].map(({ icon: Icon, label }) => (
                                <button
                                    key={label}
                                    className="flex items-center gap-2 text-on-surface-variant/60 hover:text-on-surface transition-colors"
                                >
                                    <Icon size={14} />
                                    <span className="text-xs font-label uppercase tracking-widest">
                                        {label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="h-12 flex items-center justify-center text-[10px] uppercase tracking-[0.2em] text-on-surface-variant/30">
                © {new Date().getFullYear()} CollabDocs • Encrypted Workspace Engine
            </footer>
        </div>
    );
};

export default NotFound;