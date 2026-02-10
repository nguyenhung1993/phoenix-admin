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
    mockContractTypes,
    mockShiftTypes,
    // Note: formatCurrency and formatDate already exported from recruitment
} from './hrm';

// C&B Module (Compensation & Benefits)
export * from './cb';

// Training Module
export * from './training';

// Performance Module (KPI & Đánh giá)
export * from './performance';

// Assets Module
export * from './assets';

// Offboarding Module
export * from './offboarding';

// Workplace Module
export * from './workplace';

// BPA Module
export * from './approvals';

// Settings Module
export * from './settings';

// Attendance Module
export * from './attendance';

// Leave Module
export * from './leave';
