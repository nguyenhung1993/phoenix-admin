// Mock Data - Centralized Exports
// Re-export all mock data from a single entry point

// Recruitment Module
export * from './recruitment';

// HRM Core Module - use explicit exports to avoid conflicts with recruitment
export {
    // Types
    type Department,
    type Position,
    type Employee,
    type Contract,
    // Data
    mockDepartments,
    mockPositions,
    mockEmployees,
    mockContracts,
    // Labels
    levelLabels,
    employeeStatusLabels,
    contractTypeLabels,
    contractStatusLabels,
    // Note: formatCurrency and formatDate already exported from recruitment
} from './hrm';

// C&B Module (Compensation & Benefits)
export * from './cb';

// Training Module
export * from './training';

// Performance Module (KPI & Đánh giá)
export * from './performance';
