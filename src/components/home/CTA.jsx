import { useNavigate } from 'react-router-dom';

const CTA = () => {
    const navigate = useNavigate();

    return (
        <section className="py-24 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="relative bg-gradient-to-br from-primary-container to-blue-900 rounded-3xl p-12 md:p-20 overflow-hidden text-center">
                    <div className="relative z-10 max-w-3xl mx-auto">
                        <h2 className="text-3xl md:text-5xl font-extrabold font-headline text-on-primary-container mb-6">
                            Ready to Elevate Your Team's Knowledge?
                        </h2>
                        <p className="text-blue-100 text-lg mb-10">
                            Join over 10,000+ teams who have switched to the most elegant
                            document workspace in the world.
                        </p>
                        <button
                            onClick={() => navigate('/register')}
                            className="bg-surface-bright text-on-surface px-10 py-5 rounded-xl font-bold text-lg hover:bg-white hover:text-slate-900 transition-all cursor-pointer active:scale-95 shadow-xl"
                        >
                            Start Your 14-Day Free Trial
                        </button>
                    </div>

                    {/* Background shapes */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
                </div>
            </div>
        </section>
    );
};

export default CTA;