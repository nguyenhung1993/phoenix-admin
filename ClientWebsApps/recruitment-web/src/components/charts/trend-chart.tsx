'use client';

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

interface TrendChartProps {
    data: {
        month: string;
        applied: number;
        interviewed: number;
        hired: number;
    }[];
}

export function TrendChart({ data }: TrendChartProps) {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <LineChart
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
                    dataKey="month"
                    tick={{ fontSize: 12 }}
                />
                <YAxis />
                <Tooltip
                    contentStyle={{
                        borderRadius: '8px',
                        border: 'none',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                />
                <Legend />
                <Line
                    type="monotone"
                    dataKey="applied"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="Ứng tuyển"
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                />
                <Line
                    type="monotone"
                    dataKey="interviewed"
                    stroke="#eab308"
                    strokeWidth={2}
                    name="Phỏng vấn"
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                />
                <Line
                    type="monotone"
                    dataKey="hired"
                    stroke="#22c55e"
                    strokeWidth={2}
                    name="Đã tuyển"
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
}
