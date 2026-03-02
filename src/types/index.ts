export interface InventoryItem {
    id: string;
    name: string;
    category: string;
    stockLevel: number;
    reorderPoint: number;
    price: number;
}

export interface SaleTransaction {
    id: string;
    itemId: string;
    quantity: number;
    amountPaid?: number;
    totalAmount: number;
    customerName: string;
    date: string;
}

export interface RestockEntry {
    id: string;
    itemId: string;
    quantityAdded: number;
    supplierName: string;
    costPerUnit: number;
    date: string;
}

export interface StaffMember {
    id: string;
    name: string;
    staffNumber: string;
    dateJoined: string;
}

export type UserRole = 'owner' | 'staff' | null;
