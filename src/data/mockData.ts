import type { InventoryItem, SaleTransaction, RestockEntry, StaffMember } from '../types';

export const initialInventory: InventoryItem[] = [
    { id: 'cam-001', name: 'OSIL Technologies Pro-Vision 4K Dome', category: 'Dome Cameras', stockLevel: 45, reorderPoint: 10, price: 129.99 },
    { id: 'cam-002', name: 'OSIL Technologies NightHawk Bullet', category: 'Bullet Cameras', stockLevel: 8, reorderPoint: 15, price: 89.99 },
    { id: 'cam-003', name: 'OSIL Technologies 360 PTZ Outdoor', category: 'PTZ Cameras', stockLevel: 12, reorderPoint: 5, price: 249.99 },
    { id: 'sys-001', name: 'OSIL Technologies 8-Channel NVR', category: 'Recording Systems', stockLevel: 5, reorderPoint: 5, price: 199.99 },
    { id: 'acc-001', name: '100ft BNC Cable', category: 'Accessories', stockLevel: 120, reorderPoint: 50, price: 24.99 },
];

export const initialSales: SaleTransaction[] = [];

export const initialRestocks: RestockEntry[] = [];

export const initialStaff: StaffMember[] = [
    { id: 'staff-001', name: 'Demo Staffer', staffNumber: '67890', dateJoined: new Date().toISOString() }
];
