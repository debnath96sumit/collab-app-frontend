import { CheckCircle, Circle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const plans = [
    {
        label: 'Personal',
        name: 'Free',
        price: '$0',
        period: '/forever',
        popular: false,
        features: [
            { text: '10 Workspace Documents', included: true },
            { text: 'Real-time Collaboration', included: true },
            { text: 'Basic Support', included: false },
        ],
        cta: 'Get Started',
        ctaStyle: 'outline',
    },
    {
        label: 'Professional',
        name: 'Pro',
        price: '$12',
        period: '/user/mo',
        popular: true,
        features: [
            { text: 'Unlimited Documents', included: true },
            { text: 'Shared Team Workspaces', included: true },
            { text: 'Custom Domain Publishing', included: true },
            { text: 'Priority 24/7 Support', included: true },
        ],
        cta: 'Go Pro Now',
        ctaStyle: 'filled',
    },
    {
        label: 'Organization',
        name: 'Enterprise',
        price: '$39',
        period: '/user/mo',
        popular: false,
        features: [
            { text: 'Enterprise Single Sign-On (SSO)', included: true },
            { text: 'Advanced Audit Logs', included: true },
            { text: 'Dedicated Success Manager', included: true },
        ],
        cta: 'Contact Sales',
        ctaStyle: 'outline',
    },
];

const Pricing = () => {
    const navigate = useNavigate();

    return (
        <section className="py-32 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-20">
                    <h2 className="text-3xl md:text-5xl font-bold font-headline mb-6 tracking-tight">
                        Flexible Plans for Every Scale
                    </h2>
                    <p className="text-on-surface-variant max-w-xl mx-auto">
                        Whether you're a solo founder or a global enterprise, we have a
                        plan that fits your workflow.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`relative flex flex-col p-10 rounded-xl
                ${plan.popular
                                    ? 'bg-surface-container-highest border-2 border-primary-container scale-105 shadow-2xl shadow-primary/10'
                                    : 'bg-surface-container-low border border-outline-variant/10'
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary-container text-on-primary-container text-xs font-bold px-4 py-1 rounded-full uppercase tracking-widest whitespace-nowrap">
                                    Most Popular
                                </div>
                            )}

                            <div className="mb-8">
                                <span
                                    className={`text-sm font-bold tracking-widest uppercase mb-2 block
                    ${plan.popular ? 'text-primary' : 'text-on-surface-variant'}`}
                                >
                                    {plan.label}
                                </span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold">{plan.price}</span>
                                    <span className="text-on-surface-variant">{plan.period}</span>
                                </div>
                            </div>

                            <ul className="space-y-4 mb-10 flex-1">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        {feature.included ? (
                                            <CheckCircle
                                                size={18}
                                                className="text-primary flex-shrink-0"
                                                fill={plan.popular ? 'currentColor' : 'none'}
                                            />
                                        ) : (
                                            <Circle
                                                size={18}
                                                className="text-outline-variant flex-shrink-0"
                                            />
                                        )}
                                        <span className={!feature.included ? 'text-on-surface-variant' : ''}>
                                            {feature.text}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => navigate('/register')}
                                className={`w-full py-4 rounded-xl font-bold transition-all cursor-pointer active:scale-95
                  ${plan.ctaStyle === 'filled'
                                        ? 'bg-primary-container text-on-primary-container hover:brightness-110'
                                        : 'border border-outline-variant/30 text-on-surface hover:bg-surface-bright'
                                    }`}
                            >
                                {plan.cta}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Pricing;