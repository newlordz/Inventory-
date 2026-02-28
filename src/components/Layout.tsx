import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    ShoppingCart,
    Users,
    LogOut,
    Menu,
    X,
    Cpu,
    PackagePlus,
    User
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import './Layout.css';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { role, logout } = useAppContext();
    const [sidebarOpen, setSidebarOpen] = React.useState(false);

    const navItems = [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard, roles: ['owner'] },
        { name: 'Sales & Transactions', path: '/sales', icon: ShoppingCart, roles: ['owner', 'staff'] },
        { name: 'Restock Entries', path: '/restock', icon: PackagePlus, roles: ['owner'] },
        { name: 'Staff Management', path: '/staff', icon: Users, roles: ['owner'] },
    ];

    const visibleLinks = navItems.filter(item => role && item.roles.includes(role));

    return (
        <div className="layout-container">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`sidebar glass-panel ${sidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <div className="logo">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-blue to-purple-600 flex items-center justify-center shadow-lg shadow-accent-blue/20">
                                <Cpu size={24} className="text-white" />
                            </div>
                            <span className="text-gradient font-bold text-xl">OSIL Technology</span>
                        </div>
                    </div>
                    <button className="mobile-close" onClick={() => setSidebarOpen(false)}>
                        <X size={20} />
                    </button>
                </div>

                <nav className="sidebar-nav">
                    {visibleLinks.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                            onClick={() => setSidebarOpen(false)}
                        >
                            <item.icon size={20} />
                            <span>{item.name}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <div className="system-status">
                        <span className="status-dot"></span>
                        System Online
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="main-wrapper">
                {/* Header */}
                <header className="header glass-panel">
                    <div className="header-left">
                        <button className="mobile-menu-btn" onClick={() => setSidebarOpen(true)}>
                            <Menu size={24} />
                        </button>
                        <h1 className="page-title text-gradient">Business Portal</h1>
                    </div>

                    <div className="header-right">
                        <div className="user-profile">
                            <div className="avatar">
                                <User size={18} />
                            </div>
                            <div className="user-info">
                                <span className="user-name">{role === 'owner' ? 'Admin' : 'Staff'}</span>
                                <span className="user-role" style={{ textTransform: 'capitalize' }}>{role} Account</span>
                            </div>
                        </div>
                        <button className="icon-btn hover:text-danger" onClick={logout} title="Logout" style={{ marginLeft: '0.5rem', transition: 'color 0.2s' }}>
                            <LogOut size={20} />
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="content-area animate-fade-in">
                    {children}
                </main>
            </div>
        </div>
    );
};
