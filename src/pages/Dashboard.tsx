import React from 'react';
import { DollarSign, Package, TrendingUp, AlertTriangle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { format } from 'date-fns';
import './Dashboard.css';

export const Dashboard: React.FC = () => {
    const { sales, inventory } = useAppContext();

    // Dynamic Data Calculations
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const totalStock = inventory.reduce((sum, item) => sum + item.stockLevel, 0);
    const lowStockItems = inventory.filter(item => item.stockLevel <= item.reorderPoint);

    return (
        <div className="dashboard">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Owner Dashboard</h2>
                    <p className="text-secondary">Welcome back to the OSIL Technologies Business Portal.</p>
                </div>
            </div>
            {/* Stats Grid */}
            <div className="stats-grid">
                <div className="stat-card glass-panel">
                    <div className="stat-icon bg-blue">
                        <DollarSign size={24} />
                    </div>
                    <div className="stat-details">
                        <p className="stat-label">Total Revenue</p>
                        <h3 className="stat-value">GH₵{totalRevenue.toFixed(2)}</h3>
                    </div>
                </div>

                <div className="stat-card glass-panel">
                    <div className="stat-icon bg-purple">
                        <Package size={24} />
                    </div>
                    <div className="stat-details">
                        <p className="stat-label">Total Inventory</p>
                        <h3 className="stat-value">{totalStock} Units</h3>
                    </div>
                </div>

                <div className="stat-card glass-panel">
                    <div className="stat-icon bg-green">
                        <TrendingUp size={24} />
                    </div>
                    <div className="stat-details">
                        <p className="stat-label">Recent Sales</p>
                        <h3 className="stat-value">{sales.length}</h3>
                    </div>
                </div>

                <div className="stat-card glass-panel">
                    <div className="stat-icon bg-orange">
                        <AlertTriangle size={24} />
                    </div>
                    <div className="stat-details">
                        <p className="stat-label">Low Stock Alerts</p>
                        <h3 className="stat-value">{lowStockItems.length}</h3>
                    </div>
                </div>
            </div>

            {/* Main Grid */}
            <div className="dashboard-main-grid">
                {/* Recent Transactions */}
                <div className="glass-panel p-6">
                    <div className="panel-header mb-4">
                        <h3 className="font-bold text-lg">Recent Transactions</h3>
                        <button className="text-sm text-accent">View All</button>
                    </div>
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Transaction ID</th>
                                    <th>Customer</th>
                                    <th>Date</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sales.slice(0, 5).map(sale => (
                                    <tr key={sale.id}>
                                        <td><span className="text-muted">{sale.id}</span></td>
                                        <td className="font-medium">{sale.customerName}</td>
                                        <td>{format(new Date(sale.date), 'MMM dd, yyyy')}</td>
                                        <td className="font-bold text-gradient">GH₵{sale.totalAmount.toFixed(2)}</td>
                                        <td><span className="badge success">Completed</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Inventory Alerts */}
                <div className="glass-panel p-6">
                    <div className="panel-header mb-4">
                        <h3 className="font-bold text-lg text-warning flex-center gap-2">
                            <AlertTriangle size={20} /> Low Stock Alerts
                        </h3>
                    </div>
                    <div className="alert-list">
                        {lowStockItems.map(item => (
                            <div key={item.id} className="alert-item">
                                <div className="alert-info">
                                    <p className="font-medium">{item.name}</p>
                                    <p className="text-sm text-muted">ID: {item.id}</p>
                                </div>
                                <div className="alert-stock flex items-center justify-end gap-3">
                                    <span className="text-xs text-muted">Reorder: {item.reorderPoint}</span>
                                    <span className="badge danger">{item.stockLevel} left</span>
                                </div>
                            </div>
                        ))}
                        {lowStockItems.length === 0 && (
                            <p className="text-muted text-center py-4">All inventory levels are optimal.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
