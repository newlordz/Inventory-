import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { InventoryItem, SaleTransaction, RestockEntry, UserRole, StaffMember } from '../types';
import { initialInventory, initialSales, initialRestocks, initialStaff } from '../data/mockData';

interface AppContextType {
    inventory: InventoryItem[];
    sales: SaleTransaction[];
    restocks: RestockEntry[];
    staff: StaffMember[];
    role: UserRole;
    login: (role: UserRole) => void;
    logout: () => void;
    addSale: (sale: Omit<SaleTransaction, 'id' | 'date' | 'totalAmount'>) => void;
    addRestock: (restock: Omit<RestockEntry, 'id' | 'date'>) => void;
    addNewEquipment: (item: Omit<InventoryItem, 'id'>, initialRestockDetails: Omit<RestockEntry, 'id' | 'date' | 'itemId'>) => void;
    addStaff: (name: string, staffNumber: string) => void;
    updateInventoryItem: (id: string, updates: Partial<InventoryItem>) => void;
    updateStaffItem: (id: string, updates: Partial<StaffMember>) => void;
    updateSale: (id: string, updates: Partial<SaleTransaction>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Initialize state from LocalStorage or mock data if first load
    const [role, setRole] = useState<UserRole>(() => {
        const saved = localStorage.getItem('osil_role');
        return saved ? JSON.parse(saved) : null;
    });

    const [inventory, setInventory] = useState<InventoryItem[]>(() => {
        const saved = localStorage.getItem('osil_inventory_v2');
        return saved ? JSON.parse(saved) : initialInventory;
    });

    const [sales, setSales] = useState<SaleTransaction[]>(() => {
        const saved = localStorage.getItem('osil_sales_v2');
        return saved ? JSON.parse(saved) : initialSales;
    });

    const [restocks, setRestocks] = useState<RestockEntry[]>(() => {
        const saved = localStorage.getItem('osil_restocks_v2');
        return saved ? JSON.parse(saved) : initialRestocks;
    });

    const [staff, setStaff] = useState<StaffMember[]>(() => {
        const saved = localStorage.getItem('osil_staff');
        return saved ? JSON.parse(saved) : initialStaff;
    });

    // ... (rest of useEffect hooks)
    useEffect(() => {
        if (role !== undefined) localStorage.setItem('osil_role', JSON.stringify(role));
    }, [role]);

    useEffect(() => {
        localStorage.setItem('osil_inventory_v2', JSON.stringify(inventory));
    }, [inventory]);

    useEffect(() => {
        localStorage.setItem('osil_sales_v2', JSON.stringify(sales));
    }, [sales]);

    useEffect(() => {
        localStorage.setItem('osil_restocks_v2', JSON.stringify(restocks));
    }, [restocks]);

    useEffect(() => {
        localStorage.setItem('osil_staff', JSON.stringify(staff));
    }, [staff]);

    // Actions
    const login = (selectedRole: UserRole) => {
        setRole(selectedRole);
    };

    const logout = () => {
        setRole(null);
    };

    const addStaff = (name: string, staffNumber: string) => {
        const newStaff: StaffMember = {
            id: `staff-${Date.now()}`,
            name,
            staffNumber,
            dateJoined: new Date().toISOString()
        };
        setStaff([newStaff, ...staff]);
    };

    const updateStaffItem = (id: string, updates: Partial<StaffMember>) => {
        setStaff(staff.map(s => s.id === id ? { ...s, ...updates } : s));
    };

    const updateInventoryItem = (id: string, updates: Partial<InventoryItem>) => {
        setInventory(inventory.map(inv => inv.id === id ? { ...inv, ...updates } : inv));
    };

    const updateSale = (id: string, updates: Partial<SaleTransaction>) => {
        setSales(sales.map(s => s.id === id ? { ...s, ...updates } : s));
    };

    const addSale = (saleData: Omit<SaleTransaction, 'id' | 'date' | 'totalAmount'>) => {
        const item = inventory.find(i => i.id === saleData.itemId);
        if (!item) return;

        if (item.stockLevel < saleData.quantity) {
            alert("Insufficient stock to complete this sale!");
            return;
        }

        const newSale: SaleTransaction = {
            ...saleData,
            id: `sale-${Date.now()}`,
            date: new Date().toISOString(),
            totalAmount: item.price * saleData.quantity
        };

        setSales([newSale, ...sales]);

        // Deduct from inventory
        setInventory(inventory.map(inv =>
            inv.id === saleData.itemId
                ? { ...inv, stockLevel: inv.stockLevel - saleData.quantity }
                : inv
        ));
    };

    const addRestock = (restockData: Omit<RestockEntry, 'id' | 'date'>) => {
        const newRestock: RestockEntry = {
            ...restockData,
            id: `restock-${Date.now()}`,
            date: new Date().toISOString()
        };

        setRestocks([newRestock, ...restocks]);

        // Add to inventory
        setInventory(inventory.map(inv =>
            inv.id === restockData.itemId
                ? { ...inv, stockLevel: inv.stockLevel + restockData.quantityAdded }
                : inv
        ));
    };

    const addNewEquipment = (itemData: Omit<InventoryItem, 'id'>, initialRestockDetails: Omit<RestockEntry, 'id' | 'date' | 'itemId'>) => {
        const generatedItemId = `item-${Date.now()}`;

        // 1. Create the new inventory item
        const newItem: InventoryItem = {
            ...itemData,
            id: generatedItemId,
            stockLevel: initialRestockDetails.quantityAdded // initial stock comes from the restock
        };

        setInventory([newItem, ...inventory]);

        // 2. Log the initial shipment for this new item
        const firstRestock: RestockEntry = {
            ...initialRestockDetails,
            itemId: generatedItemId,
            id: `restock-${Date.now()}-init`,
            date: new Date().toISOString()
        };

        setRestocks([firstRestock, ...restocks]);
    };

    return (
        <AppContext.Provider value={{ inventory, sales, restocks, staff, role, login, logout, addSale, addRestock, addNewEquipment, addStaff, updateInventoryItem, updateStaffItem, updateSale }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
