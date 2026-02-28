import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { format } from 'date-fns';
import { PlusCircle, Search, Filter } from 'lucide-react';

export const Sales: React.FC = () => {
    const { sales, inventory, addSale } = useAppContext();
    const [showForm, setShowForm] = useState(false);

    // Form State
    const [itemId, setItemId] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [customerName, setCustomerName] = useState('');

    useEffect(() => {
        if (inventory.length > 0 && !itemId) {
            setItemId(inventory[0].id);
        }
    }, [inventory]);

    const handleRecordSale = (e: React.FormEvent) => {
        e.preventDefault();

        addSale({
            itemId,
            quantity,
            customerName
        });

        setShowForm(false);
        setQuantity(1);
        setCustomerName('');
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h2 className="text-2xl font-bold">Sales & Transactions</h2>
                    <p className="text-secondary">Record new sales and view transaction history.</p>
                </div>
                <button
                    className="btn-primary"
                    onClick={() => setShowForm(!showForm)}
                >
                    <PlusCircle size={20} />
                    Record Sale
                </button>
            </div>

            {showForm && (
                <div className="glass-panel p-6 animate-fade-in border-l-4 border-l-accent-blue">
                    <h3 className="font-bold text-lg mb-4">New Sale Entry</h3>
                    <form onSubmit={handleRecordSale} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                        <div className="form-group mb-0">
                            <label>Product</label>
                            <select
                                value={itemId}
                                onChange={(e) => setItemId(e.target.value)}
                                required
                            >
                                {inventory.map(item => (
                                    <option key={item.id} value={item.id}>
                                        {item.name} (${item.price}) - Qty: {item.stockLevel}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group mb-0">
                            <label>Quantity</label>
                            <input
                                type="number"
                                min="1"
                                value={quantity}
                                onChange={(e) => setQuantity(Number(e.target.value))}
                                required
                            />
                        </div>

                        <div className="form-group mb-0">
                            <label>Customer Name</label>
                            <input
                                type="text"
                                placeholder="e.g. John Doe, ACME Corp"
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="btn-primary w-full h-[42px]">
                            Confirm Sale
                        </button>
                    </form>
                </div>
            )}

            {/* Toolbar */}
            <div className="flex gap-4 mb-2">
                <div className="relative flex-1 max-w-md">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                    <input
                        type="text"
                        placeholder="Search transactions..."
                        className="pl-10 bg-card/40"
                    />
                </div>
                <button className="btn-secondary">
                    <Filter size={18} />
                    Filter
                </button>
            </div>

            {/* Transactions Table */}
            <div className="glass-panel">
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Transaction ID</th>
                                <th>Product</th>
                                <th>Customer</th>
                                <th>Date</th>
                                <th>Quantity</th>
                                <th>Amount</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sales.map(sale => {
                                const item = inventory.find(i => i.id === sale.itemId);
                                return (
                                    <tr key={sale.id}>
                                        <td><span className="text-muted">{sale.id}</span></td>
                                        <td className="font-medium">{item?.name || 'Unknown Item'}</td>
                                        <td>{sale.customerName}</td>
                                        <td>{format(new Date(sale.date), 'MMM dd, yyyy HH:mm')}</td>
                                        <td>{sale.quantity}</td>
                                        <td className="font-bold text-gradient">${sale.totalAmount.toFixed(2)}</td>
                                        <td><span className="badge success">Paid</span></td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
