import { Bar, BarChart, CartesianGrid, XAxis, ResponsiveContainer, Tooltip } from 'recharts';

export default function ExpenseChart({ data }) {
    // Transform data for the chart - only show categories with expenses
    const chartData = Object.entries(data)
        .filter(([_, values]) => values.expense > 0) // Only show categories with expenses
        .map(([category, values]) => ({
            category: category,
            total: values.expense, // Show expenses primarily
        }));

    // Custom tooltip matching reference style
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div
                    style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.9)',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        borderRadius: '6px',
                        padding: '8px 12px',
                        backdropFilter: 'blur(10px)',
                    }}
                >
                    <p style={{ margin: '0 0 4px 0', fontWeight: 600, fontSize: '12px', color: '#fff' }}>
                        {payload[0].payload.category}
                    </p>
                    <p style={{ margin: 0, color: '#3b82f6', fontSize: '13px', fontWeight: '500' }}>
                        ${payload[0].value.toFixed(2)}
                    </p>
                </div>
            );
        }
        return null;
    };

    if (chartData.length === 0) {
        return (
            <div
                style={{
                    padding: '48px 0',
                    textAlign: 'center',
                    color: 'var(--muted)',
                }}
            >
                No data to display
            </div>
        );
    }

    return (
        <div
            style={{
                width: '100%',
                height: '320px',
                padding: '24px 16px',
                background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.2))',
                borderRadius: '12px',
            }}
        >
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={chartData}
                    margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
                    barGap={2}
                    barCategoryGap="15%"
                >
                    <defs>
                        <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#60a5fa" stopOpacity={1} />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.8} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid
                        strokeDasharray="0"
                        stroke="rgba(255, 255, 255, 0.05)"
                        vertical={false}
                        horizontalPoints={[0, 50, 100, 150, 200, 250]}
                    />
                    <XAxis
                        dataKey="category"
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: 'rgba(255, 255, 255, 0.5)', fontSize: 11 }}
                        tickMargin={12}
                        interval={0}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                    />
                    <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }}
                    />
                    <Bar
                        dataKey="total"
                        fill="url(#blueGradient)"
                        radius={[2, 2, 0, 0]}
                        animationDuration={1000}
                        animationBegin={0}
                        maxBarSize={40}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
