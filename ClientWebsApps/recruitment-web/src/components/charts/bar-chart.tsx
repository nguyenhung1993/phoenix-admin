'use client';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell,
} from 'recharts';

interface BarChartProps {
    data: {
        name: string; // label (e.g., Department)
        value: number; // count
        fill?: string;
    }[];
}

export function SimpleBarChart({ data }: BarChartProps) {
    // Calculate a dynamic width. For example, 60px per bar, but at least 100% of container (e.g., 500px).
    const minWidth = Math.max(data.length * 60, 500);

    return (
        <div className="w-full overflow-x-auto pb-4 scrollbar-thin">
            <div style={{ minWidth: `${minWidth}px`, height: 350 }}>
                <ResponsiveContainer width="100%" height="100%">
            <BarChart
                data={data}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={70}
                />
                <YAxis />
                <Tooltip
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} name="Số lượng">
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill || '#3b82f6'} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
            </div>
        </div>
    );
}
