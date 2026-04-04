import { FileText, Globe, Mail, MessageSquare } from 'lucide-react';

const footerLinks = {
    Product: ['Features', 'Pricing', 'Security', 'Templates'],
    Company: ['About Us', 'Careers', 'Blog', 'Press'],
    Support: ['Help Center', 'API Docs', 'Privacy', 'Terms'],
};

const Footer = () => {
    return (
        <footer className="bg-surface-container-lowest py-16 px-6 border-t border-outline-variant/10">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-2 md:col-span-1">
                        <div className="flex items-center gap-2 mb-6">
                            <FileText size={20} className="text-primary" fill="currentColor" />
                            <span className="text-xl font-bold font-headline">CollabDocs</span>
                        </div>
                        <p className="text-on-surface-variant text-sm leading-relaxed">
                            The premium workspace for cinematic documentation and team
                            collaboration.
                        </p>
                    </div>

                    {Object.entries(footerLinks).map(([category, links]) => (
                        <div key={category}>
                            <h4 className="font-bold mb-6">{category}</h4>
                            <ul className="space-y-4 text-sm text-on-surface-variant">
                                {links.map((link) => (
                                    <li key={link}>
                                        <a className="hover:text-primary transition-colors cursor-pointer">
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="pt-8 border-t border-outline-variant/10 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-on-surface-variant">
                        © {new Date().getFullYear()} CollabDocs Inc. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <Globe size={20} className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer" />
                        <Mail size={20} className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer" />
                        <MessageSquare size={20} className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer" />
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;