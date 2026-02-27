
import { Department } from './types/hrm';

export interface DepartmentNode extends Department {
    children?: DepartmentNode[];
}

export const buildDeptTree = (departments: Department[]): DepartmentNode[] => {
    const map = new Map<string, DepartmentNode>();
    const roots: DepartmentNode[] = [];

    // Initialize map
    departments.forEach(dept => {
        map.set(dept.id, { ...dept, children: [] });
    });

    // Build relationship
    departments.forEach(dept => {
        const node = map.get(dept.id);
        if (!node) return;

        if (dept.parentId && map.has(dept.parentId)) {
            const parent = map.get(dept.parentId);
            if (parent && parent.children) {
                parent.children.push(node);
            }
        } else {
            roots.push(node);
        }
    });

    return roots;
};
