import Sidebar from './Sidebar';
import DashboardHeader from './DashboardHeader';

const DashboardLayout = ({ children, searchQuery, onSearchChange, activeTab,
    onTabChange,
    onNewDocument }) => {
    return (
        <div className="flex flex-col h-screen overflow-hidden bg-background text-on-surface">
            {/* Header spans full width */}
            <DashboardHeader
                searchQuery={searchQuery}
                onSearchChange={onSearchChange}
            />

            {/* Sidebar + content below header */}
            <div className="flex flex-1 overflow-hidden">
                <Sidebar
                    activeTab={activeTab}
                    onTabChange={onTabChange}
                    onNewDocument={onNewDocument}
                />
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;