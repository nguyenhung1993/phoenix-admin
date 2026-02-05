export interface CreateEmployeePayload {
    fullName: string;
    email: string;
    phoneNumber?: string;
    departmentId: string;
    positionId: string;
    hireDate: string;
    managerId?: string;
    gender?: 'MALE' | 'FEMALE';
    dob?: string;
    address?: string;
}

export interface EmployeeResponse {
    id: string;
    employeeCode: string;
    fullName: string;
    email: string;
    status: string;
}

const API_HOST = process.env.NEXT_PUBLIC_API_HOST || 'https://localhost:8100';
const ERP_PREFIX = process.env.NEXT_PUBLIC_ERP_SERVICE_PREFIX || '/erp';
const BASE_URL = `${API_HOST}${ERP_PREFIX}/api`;

export const hrmService = {
    createEmployee: async (data: CreateEmployeePayload): Promise<EmployeeResponse> => {
        const response = await fetch(`${BASE_URL}/employees`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Add authorization header if needed, similar to CentralWeb
                // 'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Failed to create employee');
        }

        return response.json();
    },
};
