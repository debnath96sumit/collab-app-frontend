import Sidebar from './Sidebar';
import DashboardHeader from './DashboardHeader';

const DashboardLayout = ({ children, searchQuery, onSearchChange, activeTab,
    onTabChange,
    onNewDocument }) => {
    return (
        <div className="flex h-screen overflow-hidden bg-background text-on-surface">
            <Sidebar activeTab={activeTab}
                onTabChange={onTabChange}
                onNewDocument={onNewDocument} />
            <div className="flex flex-col flex-1 overflow-hidden">
                <DashboardHeader
                    searchQuery={searchQuery}
                    onSearchChange={onSearchChange}
                />
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;