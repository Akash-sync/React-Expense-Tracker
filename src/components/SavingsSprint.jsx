import { useState, useEffect } from 'react';
import { Drawer } from 'vaul';
import { useTransactions } from '../context/TransactionsContext';
import {
    loadSavingsGoal,
    saveSavingsGoal,
    calculateDailySavings,
    calculatePeriodSavings,
    shouldResetGoal,
    resetGoalPeriod,
} from '../utils/savingsGoal';
import AchievementBadge from './AchievementBadge';
import { Bar, BarChart, ResponsiveContainer, XAxis, Tooltip } from 'recharts';

export default function SavingsSprint() {
    const { transactions } = useTransactions();
    const [goal, setGoal] = useState(loadSavingsGoal());
    const [showBadge, setShowBadge] = useState(false);
    const [dailyData, setDailyData] = useState([]);
    const [periodStats, setPeriodStats] = useState(null);
    const [isEditingGoal, setIsEditingGoal] = useState(false);
    const [editValue, setEditValue] = useState('');

    // Calculate savings when transactions or goal changes
    useEffect(() => {
        // Check if period should reset
        if (shouldResetGoal(goal)) {
            const newGoal = resetGoalPeriod(goal);
            setGoal(newGoal);
            saveSavingsGoal(newGoal);
        }

        const days = goal.period === 'weekly' ? 7 : 14;
        const daily = calculateDailySavings(transactions, days);
        setDailyData(daily);

        const stats = calculatePeriodSavings(transactions, goal);
        setPeriodStats(stats);

        // Show achievement badge if goal just achieved
        if (stats.achieved && !showBadge) {
            setShowBadge(true);
        }
    }, [transactions, goal]);

    const adjustGoal = (amount) => {
        const newAmount = Math.max(500, goal.amount + amount);
        setGoal({ ...goal, amount: newAmount });
    };

    const changePeriod = (period) => {
        const newGoal = { ...goal, period, startDate: new Date().toISOString() };
        setGoal(newGoal);
    };

    const handleSubmit = () => {
        saveSavingsGoal(goal);
    };

    const handleGoalClick = () => {
        setIsEditingGoal(true);
        setEditValue(goal.amount.toString());
    };

    const handleGoalChange = (e) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        setEditValue(value);
    };

    const handleGoalBlur = () => {
        const numValue = parseInt(editValue) || 500;
        const newAmount = Math.max(500, Math.min(100000, numValue));
        setGoal({ ...goal, amount: newAmount });
        setIsEditingGoal(false);
    };

    const handleGoalKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleGoalBlur();
        } else if (e.key === 'Escape') {
            setIsEditingGoal(false);
        }
    };

    return (
        <>
            <Drawer.Root>
                <Drawer.Trigger asChild>
                    <button
                        style={{
                            padding: '8px 16px',
                            borderRadius: '8px',
                            border: '1px solid #14b8a6',
                            background: 'rgba(20, 184, 166, 0.1)',
                            color: '#14b8a6',
                            fontSize: '13px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(20, 184, 166, 0.15)';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(20, 184, 166, 0.1)';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                        title="Set your monthly savings target and track your sprint"
                    >
                        Savings Sprint
                    </button>
                </Drawer.Trigger>

                <Drawer.Portal>
                    <Drawer.Overlay
                        style={{
                            position: 'fixed',
                            inset: 0,
                            background: 'rgba(0, 0, 0, 0.6)',
                            zIndex: 9998,
                        }}
                    />
                    <Drawer.Content
                        style={{
                            position: 'fixed',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            maxWidth: '500px',
                            margin: '0 auto',
                            background: '#111827',
                            borderTopLeftRadius: '16px',
                            borderTopRightRadius: '16px',
                            border: '1px solid var(--border)',
                            zIndex: 9999,
                            outline: 'none',
                        }}
                    >
                        <div style={{ padding: '20px', maxHeight: '90vh', overflowY: 'auto' }}>
                            {/* Handle Bar */}
                            <div
                                style={{
                                    width: '48px',
                                    height: '4px',
                                    background: 'var(--muted)',
                                    borderRadius: '2px',
                                    margin: '0 auto 20px',
                                }}
                            />

                            {/* Header */}
                            <Drawer.Title
                                style={{
                                    fontSize: '24px',
                                    fontWeight: 700,
                                    color: 'var(--text)',
                                    marginBottom: '8px',
                                    textAlign: 'center',
                                }}
                            >
                                Savings Sprint
                            </Drawer.Title>
                            <Drawer.Description
                                style={{
                                    fontSize: '14px',
                                    color: 'var(--muted)',
                                    textAlign: 'center',
                                    marginBottom: '24px',
                                }}
                            >
                                Set your savings goal and track your progress
                            </Drawer.Description>

                            {/* Goal Adjuster */}
                            <div style={{ marginBottom: '24px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
                                    <button
                                        onClick={() => adjustGoal(-500)}
                                        disabled={goal.amount <= 500}
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                            border: '1px solid var(--border)',
                                            background: 'var(--card-bg)',
                                            color: 'var(--text)',
                                            fontSize: '20px',
                                            cursor: goal.amount > 500 ? 'pointer' : 'not-allowed',
                                            opacity: goal.amount > 500 ? 1 : 0.5,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        −
                                    </button>

                                    <div style={{ textAlign: 'center' }}>
                                        {isEditingGoal ? (
                                            <input
                                                type="text"
                                                value={editValue}
                                                onChange={handleGoalChange}
                                                onBlur={handleGoalBlur}
                                                onKeyDown={handleGoalKeyDown}
                                                autoFocus
                                                style={{
                                                    fontSize: '48px',
                                                    fontWeight: 700,
                                                    color: '#14b8a6',
                                                    background: 'transparent',
                                                    border: 'none',
                                                    outline: 'none',
                                                    textAlign: 'center',
                                                    width: '100%',
                                                    maxWidth: '250px',
                                                }}
                                            />
                                        ) : (
                                            <div
                                                onClick={handleGoalClick}
                                                style={{
                                                    fontSize: '48px',
                                                    fontWeight: 700,
                                                    color: '#14b8a6',
                                                    cursor: 'pointer',
                                                    userSelect: 'none',
                                                }}
                                                title="Click to edit amount"
                                            >
                                                ₹{goal.amount.toLocaleString('en-IN')}
                                            </div>
                                        )}
                                        <div style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase' }}>
                                            {goal.period} goal
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => adjustGoal(500)}
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                            border: '1px solid var(--border)',
                                            background: 'var(--card-bg)',
                                            color: 'var(--text)',
                                            fontSize: '20px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Period Selector */}
                            <div style={{ marginBottom: '24px' }}>
                                <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '8px', textAlign: 'center' }}>
                                    Period
                                </div>
                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                    {['weekly', 'monthly'].map((period) => (
                                        <button
                                            key={period}
                                            onClick={() => changePeriod(period)}
                                            style={{
                                                padding: '8px 16px',
                                                borderRadius: '6px',
                                                border: `1px solid ${goal.period === period ? '#14b8a6' : 'var(--border)'}`,
                                                background: goal.period === period ? 'rgba(20, 184, 166, 0.1)' : 'var(--card-bg)',
                                                color: goal.period === period ? '#14b8a6' : 'var(--text)',
                                                fontSize: '13px',
                                                fontWeight: 600,
                                                cursor: 'pointer',
                                                textTransform: 'capitalize',
                                            }}
                                        >
                                            {period}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Progress Stats */}
                            {periodStats && (
                                <div
                                    style={{
                                        background: 'rgba(20, 184, 166, 0.05)',
                                        border: '1px solid rgba(20, 184, 166, 0.2)',
                                        borderRadius: '12px',
                                        padding: '16px',
                                        marginBottom: '24px',
                                    }}
                                >
                                    <div style={{ marginBottom: '12px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                            <span style={{ fontSize: '13px', color: 'var(--muted)' }}>Progress</span>
                                            <span style={{ fontSize: '13px', fontWeight: 600, color: '#14b8a6' }}>
                                                {periodStats.progress.toFixed(1)}%
                                            </span>
                                        </div>
                                        <div
                                            style={{
                                                height: '8px',
                                                background: 'rgba(20, 184, 166, 0.1)',
                                                borderRadius: '4px',
                                                overflow: 'hidden',
                                            }}
                                        >
                                            <div
                                                style={{
                                                    height: '100%',
                                                    width: `${Math.min(periodStats.progress, 100)}%`,
                                                    background: 'linear-gradient(90deg, #14b8a6, #0891b2)',
                                                    transition: 'width 0.3s',
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                        <div>
                                            <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '4px' }}>
                                                Current Savings
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: '20px',
                                                    fontWeight: 700,
                                                    color: periodStats.currentSavings >= 0 ? '#22c55e' : '#ef4444',
                                                }}
                                            >
                                                {periodStats.currentSavings >= 0 ? '+' : ''}₹
                                                {Math.abs(periodStats.currentSavings).toLocaleString('en-IN')}
                                            </div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '4px' }}>
                                                {periodStats.remaining > 0 ? 'Remaining' : 'Exceeded'}
                                            </div>
                                            <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text)' }}>
                                                ₹{periodStats.remaining.toLocaleString('en-IN')}
                                            </div>
                                        </div>
                                    </div>

                                    {periodStats.currentSavings < 0 && (
                                        <div
                                            style={{
                                                marginTop: '12px',
                                                padding: '8px 12px',
                                                background: 'rgba(239, 68, 68, 0.1)',
                                                border: '1px solid rgba(239, 68, 68, 0.2)',
                                                borderRadius: '6px',
                                                fontSize: '13px',
                                                color: '#ef4444',
                                            }}
                                        >
                                            Cut ₹{Math.abs(periodStats.currentSavings).toLocaleString('en-IN')} in expenses to meet your goal
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Daily Savings Chart */}
                            <div style={{ marginBottom: '24px' }}>
                                <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '12px', textAlign: 'center' }}>
                                    Last {dailyData.length} Days
                                </div>
                                <div style={{ height: '120px' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={dailyData}>
                                            <XAxis
                                                dataKey="day"
                                                tick={{ fill: 'var(--muted)', fontSize: 11 }}
                                                axisLine={false}
                                                tickLine={false}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    background: '#1f2937',
                                                    border: '1px solid var(--border)',
                                                    borderRadius: '6px',
                                                    fontSize: '12px',
                                                }}
                                                formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Savings']}
                                            />
                                            <Bar
                                                dataKey="savings"
                                                fill="url(#savingsGradient)"
                                                radius={[4, 4, 0, 0]}
                                            />
                                            <defs>
                                                <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.8} />
                                                    <stop offset="100%" stopColor="#0891b2" stopOpacity={0.6} />
                                                </linearGradient>
                                            </defs>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Footer Buttons */}
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <Drawer.Close asChild>
                                    <button
                                        onClick={handleSubmit}
                                        style={{
                                            flex: 1,
                                            padding: '12px',
                                            borderRadius: '8px',
                                            border: 'none',
                                            background: 'linear-gradient(135deg, #14b8a6, #0891b2)',
                                            color: '#ffffff',
                                            fontSize: '14px',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Save Goal
                                    </button>
                                </Drawer.Close>
                                <Drawer.Close asChild>
                                    <button
                                        style={{
                                            flex: 1,
                                            padding: '12px',
                                            borderRadius: '8px',
                                            border: '1px solid var(--border)',
                                            background: 'var(--card-bg)',
                                            color: 'var(--text)',
                                            fontSize: '14px',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </Drawer.Close>
                            </div>
                        </div>
                    </Drawer.Content>
                </Drawer.Portal>
            </Drawer.Root>

            <AchievementBadge
                show={showBadge}
                onClose={() => setShowBadge(false)}
                amount={periodStats?.currentSavings}
            />
        </>
    );
}
