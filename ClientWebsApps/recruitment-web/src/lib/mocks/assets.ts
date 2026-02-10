
// Mock data for Asset Management

export interface Asset {
    id: string;
    code: string;
    name: string;
    type: 'LAPTOP' | 'MONITOR' | 'PHONE' | 'FURNITURE' | 'VEHICLE' | 'OTHER';
    status: 'AVAILABLE' | 'IN_USE' | 'BROKEN' | 'MAINTENANCE' | 'LIQUIDATED';
    purchaseDate: string;
    price: number;
    description?: string;
    // Holder info
    holderId?: string;
    holderName?: string;
    assignedDate?: string;

    createdAt: string;
    updatedAt: string;
}

// Initial Mock Data
let mockAssetsData: Asset[] = [
    {
        id: '1',
        code: 'AST001',
        name: 'MacBook Pro 14 M3',
        type: 'LAPTOP',
        status: 'IN_USE',
        purchaseDate: '2025-01-15',
        price: 45000000,
        holderId: '1',
        holderName: 'Nguyễn Văn Minh',
        assignedDate: '2025-01-20',
        createdAt: '2025-01-15T08:00:00Z',
        updatedAt: '2025-01-20T09:00:00Z'
    },
    {
        id: '2',
        code: 'AST002',
        name: 'Dell UltraSharp U2723QE',
        type: 'MONITOR',
        status: 'IN_USE',
        purchaseDate: '2025-01-15',
        price: 12500000,
        holderId: '1',
        holderName: 'Nguyễn Văn Minh',
        assignedDate: '2025-01-20',
        createdAt: '2025-01-15T08:00:00Z',
        updatedAt: '2025-01-20T09:00:00Z'
    },
    {
        id: '3',
        code: 'AST003',
        name: 'MacBook Air M2',
        type: 'LAPTOP',
        status: 'AVAILABLE',
        purchaseDate: '2024-06-10',
        price: 25000000,
        createdAt: '2024-06-10T10:00:00Z',
        updatedAt: '2024-06-10T10:00:00Z'
    },
    {
        id: '4',
        code: 'AST004',
        name: 'Ghế Công thái học Epione',
        type: 'FURNITURE',
        status: 'IN_USE',
        purchaseDate: '2024-05-05',
        price: 8500000,
        holderId: '2',
        holderName: 'Trần Thị Hương',
        assignedDate: '2024-05-10',
        createdAt: '2024-05-05T08:30:00Z',
        updatedAt: '2024-05-10T09:15:00Z'
    },
    {
        id: '5',
        code: 'AST005',
        name: 'iPhone 15 Pro Max',
        type: 'PHONE',
        status: 'MAINTENANCE',
        purchaseDate: '2024-01-10',
        price: 33000000,
        description: 'Đang bảo hành màn hình',
        createdAt: '2024-01-10T14:00:00Z',
        updatedAt: '2025-02-01T10:00:00Z'
    },
    {
        id: '6',
        code: 'AST006',
        name: 'Xe máy Honda Vision',
        type: 'VEHICLE',
        status: 'AVAILABLE',
        purchaseDate: '2023-11-20',
        price: 42000000,
        description: 'Xe công tác chung',
        createdAt: '2023-11-20T09:00:00Z',
        updatedAt: '2023-11-20T09:00:00Z'
    }
];

export const getMockAssets = (): Asset[] => {
    return mockAssetsData;
};

export const addAsset = (asset: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>): Asset => {
    const newAsset: Asset = {
        ...asset,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    mockAssetsData = [newAsset, ...mockAssetsData];
    return newAsset;
};

export const updateAsset = (id: string, updates: Partial<Asset>): boolean => {
    const index = mockAssetsData.findIndex(a => a.id === id);
    if (index === -1) return false;

    mockAssetsData[index] = {
        ...mockAssetsData[index],
        ...updates,
        updatedAt: new Date().toISOString()
    };
    return true;
};

export const deleteAsset = (id: string): boolean => {
    const initialLength = mockAssetsData.length;
    mockAssetsData = mockAssetsData.filter(a => a.id !== id);
    return mockAssetsData.length < initialLength;
};

// Backwards compatibility for existing imports (if any, though we should update them)
export const mockAssets = mockAssetsData;

export const assetTypeLabels: Record<string, string> = {
    LAPTOP: 'Laptop',
    MONITOR: 'Màn hình',
    PHONE: 'Điện thoại',
    FURNITURE: 'Nội thất',
    VEHICLE: 'Phương tiện',
    OTHER: 'Khác'
};

export const assetStatusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
    AVAILABLE: { label: 'Sẵn sàng', variant: 'default' },
    IN_USE: { label: 'Đang sử dụng', variant: 'secondary' },
    BROKEN: { label: 'Hỏng', variant: 'destructive' },
    MAINTENANCE: { label: 'Bảo trì', variant: 'secondary' }, // Shadcn Badge doesn't support 'warning' by default
    LIQUIDATED: { label: 'Thanh lý', variant: 'outline' },
};
