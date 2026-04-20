import { ArrowRight, PlayCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
    const navigate = useNavigate();

    return (
        <section id="how-it-works" className="relative pt-24 pb-32 px-6 overflow-hidden">
            <div className="max-w-5xl mx-auto text-center relative z-10">
                <h1 className="text-5xl md:text-7xl font-extrabold font-headline tracking-tight text-on-surface mb-6 leading-[1.1]">
                    Where Focus Meets <br />
                    <span className="bg-gradient-to-r from-primary to-primary-container bg-clip-text text-transparent">
                        Collaborative Flow
                    </span>
                </h1>
                <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto mb-10 leading-relaxed">
                    Craft stunning documents in a high-end, cinematic workspace designed
                    for teams who value precision and aesthetic excellence.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                        onClick={() => navigate('/register')}
                        className="bg-primary-container text-on-primary-container px-8 py-4 rounded-xl font-bold text-lg hover:brightness-110 transition-all cursor-pointer active:scale-95"
                    >
                        Get Started Free
                    </button>
                    <button className="flex items-center gap-2 text-on-surface border border-outline-variant/30 px-8 py-4 rounded-xl font-bold text-lg hover:bg-surface-bright transition-all cursor-pointer active:scale-95">
                        <PlayCircle size={20} />
                        Watch Demo
                    </button>
                </div>
            </div>

            {/* Editor Mockup */}
            <div className="mt-20 max-w-6xl mx-auto relative px-4">
                <div className="bg-surface-container-low rounded-2xl p-1 border border-outline-variant/10 overflow-hidden" style={{ boxShadow: '0 0 80px -20px rgba(37, 99, 235, 0.15)' }}>
                    {/* Title Bar */}
                    <div className="bg-surface-container-highest h-8 flex items-center px-4 gap-2 border-b border-outline-variant/10">
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-error/40"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-tertiary-container/40"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-primary/40"></div>
                        </div>
                        <div className="mx-auto text-[10px] text-on-surface-variant font-medium tracking-widest uppercase">
                            Project Alpha — Product Requirements
                        </div>
                    </div>

                    <div className="flex h-[500px]">
                        {/* Sidebar */}
                        <aside className="w-48 bg-surface-container-lowest p-4 hidden md:flex flex-col gap-6">
                            <div className="space-y-2">
                                <div className="h-2 w-12 bg-outline-variant/20 rounded"></div>
                                <div className="h-4 w-full bg-primary/10 rounded border-r-2 border-primary"></div>
                                <div className="h-4 w-4/5 bg-outline-variant/10 rounded"></div>
                                <div className="h-4 w-3/4 bg-outline-variant/10 rounded"></div>
                            </div>
                            <div className="mt-auto flex -space-x-2">
                                <div className="w-8 h-8 rounded-full border-2 border-surface-container-lowest bg-slate-400 flex items-center justify-center text-[10px] font-bold text-white">
                                    SJ
                                </div>
                                <div className="w-8 h-8 rounded-full border-2 border-surface-container-lowest bg-blue-500 flex items-center justify-center text-[10px] font-bold text-white">
                                    AM
                                </div>
                                <div className="w-8 h-8 rounded-full border-2 border-surface-container-lowest bg-primary-container flex items-center justify-center text-[10px] font-bold text-on-primary-container">
                                    +3
                                </div>
                            </div>
                        </aside>

                        {/* Document Canvas */}
                        <div className="flex-1 bg-surface-container p-12 overflow-hidden relative">
                            <div className="max-w-2xl mx-auto space-y-6">
                                <div className="h-10 w-3/4 bg-on-surface/5 rounded-lg"></div>
                                <div className="space-y-3">
                                    <div className="h-4 w-full bg-on-surface-variant/5 rounded"></div>
                                    <div className="h-4 w-full bg-on-surface-variant/5 rounded"></div>
                                    <div className="h-4 w-5/6 bg-on-surface-variant/5 rounded"></div>
                                </div>
                                <div className="pt-8 grid grid-cols-2 gap-4">
                                    <div className="aspect-video rounded-xl bg-surface-variant/30 flex items-center justify-center">
                                        <span className="text-outline-variant text-sm">image</span>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-4 w-full bg-on-surface-variant/5 rounded"></div>
                                        <div className="h-4 w-4/5 bg-on-surface-variant/5 rounded"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Collaborative Cursor */}
                            <div className="absolute top-1/2 left-1/3 flex flex-col items-start">
                                <ArrowRight size={16} className="text-primary rotate-45" />
                                <div className="bg-primary text-on-primary-fixed text-[10px] font-bold px-1.5 py-0.5 rounded shadow-lg">
                                    Sarah Jenkins
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Background Glows */}
                <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-[100px] -z-10"></div>
                <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-primary-container/10 rounded-full blur-[100px] -z-10"></div>
            </div>
        </section>
    );
};

export default Hero;