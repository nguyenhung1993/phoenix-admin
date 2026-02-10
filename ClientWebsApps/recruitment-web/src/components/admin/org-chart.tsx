
import React from 'react';
import { DepartmentNode } from '@/lib/tree-utils';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, Users } from 'lucide-react';

interface OrgChartProps {
    data: DepartmentNode[];
}

const TreeNode = ({ node }: { node: DepartmentNode }) => {
    const hasChildren = node.children && node.children.length > 0;

    return (
        <div className="flex flex-col items-center">
            {/* Node Card */}
            <Card className="w-64 relative z-10 border-primary/20 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                        <div className="font-bold text-primary truncate" title={node.name}>
                            {node.name}
                        </div>
                        <Badge variant="outline" className="text-xs">
                            {node.code}
                        </Badge>
                    </div>

                    {node.managerName ? (
                        <div className="flex items-center gap-2 mb-2">
                            <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                                    {node.managerName.split(' ').map(n => n[0]).join('').slice(-2)}
                                </AvatarFallback>
                            </Avatar>
                            <span className="text-sm truncate font-medium">{node.managerName}</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                            <User className="h-4 w-4" />
                            <span className="text-sm italic">Chưa có quản lý</span>
                        </div>
                    )}

                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2 pt-2 border-t">
                        <Users className="h-3 w-3" />
                        <span>{node.employeeCount} nhân sự</span>
                    </div>
                </CardContent>
            </Card>

            {/* Connector to Children */}
            {hasChildren && (
                <div className="flex flex-col items-center">
                    {/* Vertical Line Down */}
                    <div className="w-px h-6 bg-border"></div>

                    {/* Children Container */}
                    <div className="flex gap-8 relative pt-6">
                        {/* Horizontal Connector Line covering all children */}
                        {node.children!.length > 1 && (
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[calc(100%-16rem)] h-px bg-border"></div>
                        )}

                        {/* Render Children */}
                        {node.children!.map((child, index) => (
                            <div key={child.id} className="relative flex flex-col items-center">
                                {/* Connector up from child to horizontal line */}
                                <div className="absolute -top-6 w-px h-6 bg-border"></div>
                                <TreeNode node={child} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default function OrgChart({ data }: OrgChartProps) {
    if (!data || data.length === 0) {
        return <div className="text-center p-8 text-muted-foreground">Không có dữ liệu sơ đồ</div>;
    }

    return (
        <div className="overflow-x-auto p-8 bg-muted/20 rounded-xl border min-h-[500px] flex justify-center">
            <div className="flex gap-16">
                {data.map((root) => (
                    <TreeNode key={root.id} node={root} />
                ))}
            </div>
        </div>
    );
}
