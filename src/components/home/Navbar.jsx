import { FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Navbar = () => {
    const navigate = useNavigate();
    const [active, setActive] = useState('how-it-works');
    return (
        <nav className="bg-slate-900/60 backdrop-blur-xl font-headline antialiased w-full h-16 sticky top-0 z-50 shadow-sm shadow-blue-500/5 flex items-center justify-between px-6">
            <div className="flex items-center gap-8">
                <div className="flex items-center gap-2">
                    <FileText className="text-blue-500" size={22} fill="currentColor" />
                    <span className="text-xl font-bold tracking-tight text-slate-100">
                        CollabDocs
                    </span>
                </div>
                <div className="hidden md:flex items-center gap-6 text-sm font-medium">
                    <a
                        onClick={(e) => {
                            e.preventDefault();
                            setActive('how-it-works');
                            document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className={active === 'how-it-works' ? 'text-blue-400 border-b-2 border-blue-500 pb-1 cursor-pointer' : 'text-slate-400 hover:text-slate-200 transition-colors cursor-pointer'}>
                        How It Works
                    </a>
                    <a
                        onClick={(e) => {
                            e.preventDefault();
                            setActive('features');
                            document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className={active === 'features' ? 'text-blue-400 border-b-2 border-blue-500 pb-1 cursor-pointer' : 'text-slate-400 hover:text-slate-200 transition-colors cursor-pointer'}>
                        Features
                    </a>
                    <a
                        onClick={(e) => {
                            e.preventDefault();
                            setActive('pricing');
                            document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className={active === 'pricing' ? 'text-blue-400 border-b-2 border-blue-500 pb-1 cursor-pointer' : 'text-slate-400 hover:text-slate-200 transition-colors cursor-pointer'}
                    >
                        Pricing
                    </a>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/login')}
                    className="text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer active:scale-95 duration-200"
                >
                    Log in
                </button>
                <button
                    onClick={() => navigate('/register')}
                    className="bg-primary-container hover:bg-blue-600 text-on-primary-container px-5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer active:scale-95 duration-200"
                >
                    Sign up
                </button>
            </div>
        </nav>
    );
};

export default Navbar;