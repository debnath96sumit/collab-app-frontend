import { useState } from 'react';
import Sidebar from './Sidebar';
import DashboardHeader from './DashboardHeader';

const DashboardLayout = ({ children, searchQuery, onSearchChange, activeTab, onTabChange, onNewDocument }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-background text-on-surface">
            <DashboardHeader
                searchQuery={searchQuery}
                onSearchChange={onSearchChange}
                onMenuClick={() => setSidebarOpen(prev => !prev)}
            />

            <div className="flex flex-1 overflow-hidden relative">
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-20 md:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                <div className={`
                    fixed md:static inset-y-0 left-0 z-30 md:z-auto
                    transform transition-transform duration-300 ease-in-out
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                `}>
                    <Sidebar
                        activeTab={activeTab}
                        onTabChange={(tab) => {
                            onTabChange(tab);
                            setSidebarOpen(false);
                        }}
                        onNewDocument={() => {
                            onNewDocument();
                            setSidebarOpen(false);
                        }}
                    />
                </div>

                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;