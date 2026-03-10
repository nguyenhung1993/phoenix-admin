import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ResponsiveTable } from '../responsive-table';

// Mock matchMedia behavior for JSDOM
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

describe('ResponsiveTable Component', () => {
    const columns = [
        { label: 'Tên nhân viên', key: 'name' },
        { label: 'Phòng ban', key: 'department' },
        { label: 'Trạng thái', key: 'status' },
    ];

    const data = [
        { id: 1, name: 'Nguyễn Văn A', department: 'IT', status: 'Active' },
        { id: 2, name: 'Trần Thị B', department: 'HR', status: 'Inactive' },
    ];

    it('renders the table with headers correctly', () => {
        render(<ResponsiveTable columns={columns} data={data} />);

        expect(screen.getByText('Tên nhân viên')).toBeInTheDocument();
        expect(screen.getByText('Phòng ban')).toBeInTheDocument();
        expect(screen.getByText('Trạng thái')).toBeInTheDocument();
    });

    it('renders data rows correctly', () => {
        render(<ResponsiveTable columns={columns} data={data} />);

        expect(screen.getByText('Nguyễn Văn A')).toBeInTheDocument();
        expect(screen.getByText('IT')).toBeInTheDocument();
        expect(screen.getByText('Active')).toBeInTheDocument();

        expect(screen.getByText('Trần Thị B')).toBeInTheDocument();
        expect(screen.getByText('HR')).toBeInTheDocument();
        expect(screen.getByText('Inactive')).toBeInTheDocument();
    });

    it('shows empty message when data is empty', () => {
        render(
            <ResponsiveTable
                columns={columns}
                data={[]}
                emptyMessage="Không có dữ liệu nhân viên"
            />
        );

        expect(screen.getByText('Không có dữ liệu nhân viên')).toBeInTheDocument();
    });
});
