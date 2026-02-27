'use client';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    Legend,
} from 'recharts';

interface BarChartProps {
    data: any[];
    dataKey?: string;
    fill?: string;
    nameKey?: string;
}

export const DynamicBarChart = ({ data, dataKey = 'employees', fill = 'hsl(var(--primary))', nameKey = 'name' }: BarChartProps) => (
    <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={nameKey} fontSize={12} tickLine={false} axisLine={false} />
            <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
            <Tooltip />
            <Bar dataKey={dataKey} fill={fill} radius={[4, 4, 0, 0]} />
        </BarChart>
    </ResponsiveContainer>
);

interface LineChartProps {
    data: any[];
    lines?: { dataKey: string; stroke: string; name?: string }[];
}

export const DynamicLineChart = ({ data, lines }: LineChartProps) => {
    const defaultLines = [
        { dataKey: 'hired', stroke: 'hsl(var(--primary))', name: 'Tuyển mới' },
        { dataKey: 'resigned', stroke: 'hsl(var(--destructive))', name: 'Nghỉ việc' },
    ];
    const lineConfig = lines || defaultLines;

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Legend />
                {lineConfig.map((line) => (
                    <Line
                        key={line.dataKey}
                        type="monotone"
                        dataKey={line.dataKey}
                        stroke={line.stroke}
                        strokeWidth={2}
                        name={line.name || line.dataKey}
                    />
                ))}
            </LineChart>
        </ResponsiveContainer>
    );
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8b5cf6', '#ec4899'];

export const DynamicPieChart = ({ data }: { data: any[] }) => {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );
};
