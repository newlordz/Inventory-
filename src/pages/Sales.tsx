import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { format } from 'date-fns';
import { PlusCircle, Search, Filter, Edit } from 'lucide-react';
import type { SaleTransaction } from '../types';

export const Sales: React.FC = () => {
    const { sales, inventory, addSale, updateSale } = useAppContext();
    const [showForm, setShowForm] = useState(false);

    // Form State
    const [itemId, setItemId] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [customerName, setCustomerName] = useState('');
    const [amountPaid, setAmountPaid] = useState<number | ''>('');

    // Edit State
    const [editingSale, setEditingSale] = useState<SaleTransaction | null>(null);
    const [editAmountPaid, setEditAmountPaid] = useState<number | ''>('');

    useEffect(() => {
        if (inventory.length > 0 && !itemId) {
            setItemId(inventory[0].id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inventory]);

    const handleRecordSale = (e: React.FormEvent) => {
        e.preventDefault();

        addSale({
            itemId,
            quantity,
            customerName,
            amountPaid: Number(amountPaid) || undefined
        });

        setShowForm(false);
        setQuantity(1);
        setCustomerName('');
        setAmountPaid('');
    };

    const handleUpdatePayment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingSale) return;

        const currentPaid = editingSale.amountPaid || 0;
        const additionalAmount = Number(editAmountPaid) || 0;
        const newTotalPaid = currentPaid + additionalAmount;

        // Prevent paying more than total amount
        const finalAmount = Math.min(newTotalPaid, editingSale.totalAmount);

        updateSale(editingSale.id, { amountPaid: finalAmount });
        setEditingSale(null);
        setEditAmountPaid('');
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
                    <form onSubmit={handleRecordSale} className="sales-form-grid">
                        <div className="form-group mb-0">
                            <label>Product</label>
                            <select
                                value={itemId}
                                onChange={(e) => setItemId(e.target.value)}
                                required
                            >
                                {inventory.map(item => (
                                    <option key={item.id} value={item.id}>
                                        {item.name} (GH₵{item.price}) - Qty: {item.stockLevel}
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

                        <div className="form-group mb-0">
                            <label>Amount Paid (GH₵) <span className="text-secondary text-xs opacity-70">(Optional, leaves balance if partial)</span></label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="Full amount if empty"
                                value={amountPaid}
                                onChange={(e) => setAmountPaid(e.target.value === '' ? '' : Number(e.target.value))}
                            />
                        </div>

                        <button type="submit" className="btn-primary w-full h-[42px] mt-4">
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
                                <th>Balance Owed</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sales.map(sale => {
                                const item = inventory.find(i => i.id === sale.itemId);
                                const balance = sale.amountPaid !== undefined ? sale.totalAmount - sale.amountPaid : 0;
                                const isPartial = balance > 0;

                                return (
                                    <tr key={sale.id}>
                                        <td><span className="text-muted">{sale.id}</span></td>
                                        <td className="font-medium">{item?.name || 'Unknown Item'}</td>
                                        <td>{sale.customerName}</td>
                                        <td>{format(new Date(sale.date), 'MMM dd, yyyy HH:mm')}</td>
                                        <td>{sale.quantity}</td>
                                        <td className="font-bold text-gradient">GH₵{sale.totalAmount.toFixed(2)}</td>
                                        <td className={isPartial ? 'text-warning font-medium' : 'text-muted'}>
                                            {isPartial ? `GH₵${balance.toFixed(2)}` : 'None'}
                                        </td>
                                        <td>
                                            <span className={`badge ${isPartial ? 'warning' : 'success'}`}>
                                                {isPartial ? 'Partial/Pending' : 'Paid'}
                                            </span>
                                        </td>
                                        <td>
                                            {isPartial && (
                                                <button
                                                    className="btn-secondary text-xs py-1 px-2 flex items-center gap-1"
                                                    onClick={() => {
                                                        setEditingSale(sale);
                                                        setEditAmountPaid('');
                                                    }}
                                                >
                                                    <Edit size={12} />
                                                    Pay
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Update Payment Modal */}
            {editingSale && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-card w-full max-w-sm rounded-xl border border-white/10 p-6 animate-fade-in shadow-2xl">
                        <h3 className="font-bold text-xl mb-4 text-gradient">Update Payment</h3>

                        <div className="mb-6 space-y-3">
                            <div className="flex justify-between py-2 border-b border-white/5">
                                <span className="text-secondary">Total Amount</span>
                                <span className="font-medium">GH₵{editingSale.totalAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-white/5">
                                <span className="text-secondary">Current Paid</span>
                                <span className="font-medium text-success">GH₵{(editingSale.amountPaid || 0).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between py-2 bg-warning/10 px-3 rounded-lg border border-warning/20">
                                <span className="text-warning font-medium">Outstanding Balance Owed</span>
                                <span className="font-bold text-warning">GH₵{(editingSale.totalAmount - (editingSale.amountPaid || 0)).toFixed(2)}</span>
                            </div>

                            <form onSubmit={handleUpdatePayment} className="pt-4">
                                <div className="form-group mb-4">
                                    <label>Additional Payment Amount (GH₵)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max={(editingSale.totalAmount - (editingSale.amountPaid || 0)).toFixed(2)}
                                        step="0.01"
                                        className="w-full text-lg p-3"
                                        value={editAmountPaid}
                                        onChange={(e) => setEditAmountPaid(e.target.value === '' ? '' : Number(e.target.value))}
                                        required
                                    />
                                    <p className="text-xs text-secondary mt-1">Enter the new amount being paid today.</p>
                                </div>
                                <div className="flex justify-end gap-3 mt-6">
                                    <button type="button" className="btn-secondary" onClick={() => setEditingSale(null)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn-primary">
                                        Save Updates
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
