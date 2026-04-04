import {
    Zap,
    Users,
    Sparkles,
    Lock,
    LayoutTemplate,
    Code2,
} from 'lucide-react';

const features = [
    {
        icon: Zap,
        title: 'Real-Time Editing',
        desc: 'Experience zero-latency synchronization. See changes as they happen, pixel-perfect and instant.',
    },
    {
        icon: Users,
        title: 'Team Collaboration',
        desc: 'Advanced permission sets and guest access ensure the right people have the right eyes on your data.',
    },
    {
        icon: Sparkles,
        title: 'AI Intelligence',
        desc: 'Summarize threads, generate drafts, and fix grammar with our integrated semantic engine.',
    },
    {
        icon: Lock,
        title: 'Military-Grade Security',
        desc: 'End-to-end encryption and regional data residency for complete peace of mind.',
    },
    {
        icon: LayoutTemplate,
        title: 'Infinite Templates',
        desc: 'Start with professional templates for PRDs, meeting notes, and roadmap planning.',
    },
    {
        icon: Code2,
        title: 'API First',
        desc: 'Connect CollabDocs to your existing stack with our robust developer API and webhooks.',
    },
];

const Features = () => {
    return (
        <section className="py-24 px-6 bg-surface-container-lowest">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold font-headline mb-4">
                        Precision-Engineered for Productivity
                    </h2>
                    <p className="text-on-surface-variant">
                        The tools you need, refined for the modern team.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={index}
                                className="bg-surface-container-high p-8 rounded-xl border border-outline-variant/10 hover:border-primary/30 transition-all duration-300"
                            >
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                                    <Icon size={20} className="text-primary" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-on-surface-variant text-sm leading-relaxed">
                                    {feature.desc}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Features;