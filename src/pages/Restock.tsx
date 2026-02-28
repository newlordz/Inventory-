import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { format } from 'date-fns';
import { PackagePlus, Search, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Restock.css';

export const Restock: React.FC = () => {
    const { restocks, inventory, addRestock, addNewEquipment } = useAppContext();
    const [showForm, setShowForm] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Form State
    const [isNewEquipment, setIsNewEquipment] = useState(false);
    const [itemId, setItemId] = useState('');
    const [quantityAdded, setQuantityAdded] = useState(10);
    const [supplierName, setSupplierName] = useState('');
    const [costPerUnit, setCostPerUnit] = useState(0);

    // New Equipment State
    const [newItemName, setNewItemName] = useState('');
    const [newItemCategory, setNewItemCategory] = useState('');
    const [newItemPrice, setNewItemPrice] = useState(0);
    const [newItemReorderPoint, setNewItemReorderPoint] = useState(5);

    useEffect(() => {
        if (inventory.length > 0 && !itemId) {
            setItemId(inventory[0].id);
        }
    }, [inventory]);

    const handleRecordRestock = (e: React.FormEvent) => {
        e.preventDefault();

        if (isNewEquipment) {
            addNewEquipment(
                {
                    name: newItemName,
                    category: newItemCategory,
                    price: newItemPrice,
                    reorderPoint: newItemReorderPoint,
                    stockLevel: quantityAdded
                },
                {
                    quantityAdded,
                    supplierName,
                    costPerUnit
                }
            );
        } else {
            addRestock({
                itemId,
                quantityAdded,
                supplierName,
                costPerUnit
            });
        }

        setShowForm(false);
        setQuantityAdded(10);
        setSupplierName('');
        setCostPerUnit(0);

        setIsNewEquipment(false);
        setNewItemName('');
        setNewItemCategory('');
        setNewItemPrice(0);
        setNewItemReorderPoint(5);
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h2 className="text-2xl font-bold">Inventory & Restock</h2>
                    <p className="text-secondary">Manage OSIL Technology inventory and log incoming shipments.</p>
                </div>
                <button
                    className="btn-primary"
                    onClick={() => setShowForm(!showForm)}
                >
                    <PackagePlus size={20} />
                    Log Shipment
                </button>
            </div>

            {showForm && (
                <div className="glass-panel p-6 animate-fade-in border-l-4 border-l-accent-blue w-full relative overflow-hidden">
                    <div className="restock-bg-orb"></div>

                    <div className="restock-form-header">
                        <div className="restock-form-title">
                            <h3 className="font-bold text-lg text-white">New Restock Entry</h3>
                            <p className="text-xs text-secondary mt-1">Select the restock mode to log arriving supply ships.</p>
                        </div>

                        {/* Premium Mode Switch */}
                        <div className="mode-switch-container">
                            <button
                                type="button"
                                onClick={() => setIsNewEquipment(false)}
                                className={`mode-switch-btn ${!isNewEquipment ? 'active' : ''}`}
                            >
                                Existing Item
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsNewEquipment(true)}
                                className={`mode-switch-btn ${isNewEquipment ? 'active new-equipment' : ''}`}
                            >
                                <span>+</span> New Equipment
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleRecordRestock} className="restock-form-grid">

                        {!isNewEquipment ? (
                            <div className="form-group mb-0 lg-col-span-2">
                                <label className="text-accent-blue font-medium flex items-center gap-2">
                                    <div className="custom-pulse-dot"></div>
                                    Equipment Selection
                                </label>
                                <select
                                    value={itemId}
                                    onChange={(e) => setItemId(e.target.value)}
                                    required
                                    className="custom-select"
                                >
                                    {inventory.map(item => (
                                        <option key={item.id} value={item.id}>
                                            {item.name} (Qty: {item.stockLevel})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ) : (
                            <div className="new-equipment-card restock-new-grid">
                                <div className="card-accent-border"></div>

                                <div className="col-span-full mb-1">
                                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                                        <div className="purple-dot"></div>
                                        Hardware Onboarding Setup
                                    </h4>
                                    <p className="text-xs text-muted">Define the base properties for this new piece of equipment.</p>
                                </div>

                                <div className="form-group mb-0 lg-col-span-2">
                                    <label>Equipment Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. OSIL Technology Smart Lock"
                                        value={newItemName}
                                        onChange={(e) => setNewItemName(e.target.value)}
                                        required
                                        className="inset-input"
                                    />
                                </div>
                                <div className="form-group mb-0 lg-col-span-1">
                                    <label>Category</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Access Control"
                                        value={newItemCategory}
                                        onChange={(e) => setNewItemCategory(e.target.value)}
                                        required
                                        className="inset-input"
                                    />
                                </div>
                                <div className="form-group mb-0 lg-col-span-1">
                                    <label>Retail Price ($)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={newItemPrice}
                                        onChange={(e) => setNewItemPrice(Number(e.target.value))}
                                        required
                                        className="inset-input"
                                    />
                                </div>
                                <div className="form-group mb-0 lg-col-span-1">
                                    <label className="text-warning">Alert Stock ↓</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={newItemReorderPoint}
                                        onChange={(e) => setNewItemReorderPoint(Number(e.target.value))}
                                        required
                                        className="inset-input warning-input"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="shipment-details-divider col-span-full">
                            <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></div>
                                Shipment Details
                            </h4>
                        </div>

                        <div className="form-group mb-0 lg-col-span-1">
                            <label>Qty Received</label>
                            <input
                                type="number"
                                min="1"
                                value={quantityAdded}
                                onChange={(e) => setQuantityAdded(Number(e.target.value))}
                                required
                            />
                        </div>

                        <div className="form-group mb-0 lg-col-span-1">
                            <label>Supplier</label>
                            <input
                                type="text"
                                placeholder="e.g. Hikvision"
                                value={supplierName}
                                onChange={(e) => setSupplierName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group mb-0 lg-col-span-1">
                            <label>Unit Cost ($)</label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={costPerUnit}
                                onChange={(e) => setCostPerUnit(Number(e.target.value))}
                                required
                            />
                        </div>

                        <div className="form-group mb-0 lg-col-span-1 md-col-span-2">
                            <button type="submit" className="btn-primary w-full h-[42px]">
                                Save Entry
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="dashboard-main-grid">
                {/* Inventory Overview */}
                <div className="glass-panel p-6">
                    <div className="panel-header mb-4">
                        <h3 className="font-bold text-lg">Current Inventory Status</h3>
                        <div className="relative">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                            <input
                                type="text"
                                placeholder="Search equipment..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 py-1 text-sm bg-card/40 w-48"
                            />
                        </div>
                    </div>

                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Item ID</th>
                                    <th>Equipment Name</th>
                                    <th>Category</th>
                                    <th>Stock Level</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {inventory
                                    .filter(item =>
                                        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                        item.category.toLowerCase().includes(searchQuery.toLowerCase())
                                    )
                                    .map(item => {
                                        const isLowSotck = item.stockLevel <= item.reorderPoint;
                                        return (
                                            <tr key={item.id}>
                                                <td><span className="text-muted text-sm">{item.id}</span></td>
                                                <td className="font-medium">{item.name}</td>
                                                <td><span className="badge">{item.category}</span></td>
                                                <td className="font-bold">{item.stockLevel}</td>
                                                <td>
                                                    {isLowSotck ? (
                                                        <span className="badge danger">Low Stock</span>
                                                    ) : (
                                                        <span className="badge success">Optimal</span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Recent Restocks Log */}
                <div className="glass-panel p-6">
                    <div className="panel-header mb-4">
                        <h3 className="font-bold text-lg">Shipment Log</h3>
                        <Link to="/shipments" className="btn-secondary text-sm flex items-center gap-1 py-1 px-3">
                            View All <ArrowUpRight size={14} />
                        </Link>
                    </div>

                    <div className="shipment-log-list">
                        {restocks.slice(0, 5).map(restock => {
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
                    </div>
                </div>
            </div>
        </div>
    );
};
