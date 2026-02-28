import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { format } from 'date-fns';
import { ArrowUpRight, Search, FileText, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import './ShipmentLog.css';
import './Restock.css';

export const ShipmentLog: React.FC = () => {
    const { restocks, inventory } = useAppContext();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredRestocks = restocks.filter(restock => {
        const item = inventory.find(i => i.id === restock.itemId);
        const itemName = item?.name.toLowerCase() || '';
        const supplierName = restock.supplierName.toLowerCase();
        const query = searchQuery.toLowerCase();

        return itemName.includes(query) || supplierName.includes(query);
    });

    const totalSpent = filteredRestocks.reduce((sum, r) => sum + (r.costPerUnit * r.quantityAdded), 0);
    const totalItems = filteredRestocks.reduce((sum, r) => sum + r.quantityAdded, 0);

    return (
        <div className="shipments-container animate-fade-in">
            <div className="flex items-center gap-4 mb-2">
                <Link to="/restock" className="btn-secondary flex items-center gap-2 w-fit px-4 py-2">
                    <ArrowLeft size={16} /> Back to Restock
                </Link>
                <div className="flex-1"></div>
            </div>

            <div className="shipment-controls">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-3">
                        <FileText size={28} className="text-accent scroll-bounce" /> Complete Shipment Log
                    </h1>
                    <p className="text-secondary mt-1">Review all historical incoming hardware shipments and supplier costs.</p>
                </div>

                <div className="relative" style={{ minWidth: '0' }}>
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                    <input
                        type="text"
                        placeholder="Search shipments..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 py-2 text-sm bg-card/40 border border-light/10 rounded-md text-white focus:outline-none focus:border-accent-blue transition-colors"
                        style={{ width: '100%', maxWidth: '100%' }}
                    />
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-2">
                <div className="shipment-stat-card">
                    <div className="stat-icon bg-glass">
                        <FileText size={24} />
                    </div>
                    <div className="stat-details">
                        <span className="stat-label">Total Logs</span>
                        <span className="stat-value">{filteredRestocks.length}</span>
                    </div>
                </div>
                <div className="shipment-stat-card">
                    <div className="stat-icon bg-blue">
                        <ArrowUpRight size={24} />
                    </div>
                    <div className="stat-details">
                        <span className="stat-label">Units Received</span>
                        <span className="stat-value">{totalItems}</span>
                    </div>
                </div>
                <div className="shipment-stat-card">
                    <div className="stat-icon bg-purple">
                        <span className="font-bold text-xl">$</span>
                    </div>
                    <div className="stat-details">
                        <span className="stat-label">Total Expenditure</span>
                        <span className="stat-value text-gradient">${totalSpent.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            <div className="glass-panel p-6">
                <div className="shipments-grid">
                    {filteredRestocks.map(restock => {
                        const item = inventory.find(i => i.id === restock.itemId);
                        return (
                            <div key={restock.id} className="shipment-card">
                                <div className="shipment-header">
                                    <div className="shipment-title-group">
                                        <p className="shipment-item-name">
                                            <ArrowUpRight size={14} className="text-success" />
                                            {item?.name || 'Unknown Item'}
                                        </p>
                                        <p className="shipment-supplier">{restock.supplierName}</p>
                                    </div>
                                    <div>
                                        <span className="badge blue">+{restock.quantityAdded}</span>
                                    </div>
                                </div>
                                <div className="shipment-footer">
                                    <span>{format(new Date(restock.date), 'MMM dd, yyyy')}</span>
                                    <span className="shipment-total">Total: ${(restock.costPerUnit * restock.quantityAdded).toFixed(2)}</span>
                                </div>
                            </div>
                        );
                    })}

                    {filteredRestocks.length === 0 && (
                        <div className="col-span-full py-12 text-center text-muted">
                            <FileText size={48} className="mx-auto mb-4 opacity-20" />
                            <p>No shipment logs found matching your criteria.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
