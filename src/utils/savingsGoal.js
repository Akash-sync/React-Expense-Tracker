// Utility functions for savings goal management

const STORAGE_KEY = 'expense_tracker_savings_goal';

// Default goal structure
const DEFAULT_GOAL = {
    amount: 5000,
    period: 'monthly', // 'weekly', 'monthly', 'custom'
    customDays: 30,
    startDate: new Date().toISOString(),
};

// Save goal to localStorage
export const saveSavingsGoal = (goal) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(goal));
        return true;
    } catch (error) {
        console.error('Error saving goal:', error);
        return false;
    }
};

// Load goal from localStorage
export const loadSavingsGoal = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
        return DEFAULT_GOAL;
    } catch (error) {
        console.error('Error loading goal:', error);
        return DEFAULT_GOAL;
    }
};

// Calculate daily savings from transactions
export const calculateDailySavings = (transactions, days = 14) => {
    const today = new Date();
    const dailyData = [];

    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];

        const dayTransactions = transactions.filter((t) => {
            return t.date === dateStr;
        });

        const income = dayTransactions
            .filter((t) => t.type === 'income')
            .reduce((sum, t) => sum + Number(t.amount), 0);

        const expenses = dayTransactions
            .filter((t) => t.type === 'expense')
            .reduce((sum, t) => sum + Number(t.amount), 0);

        const savings = income - expenses;

        dailyData.push({
            date: dateStr,
            day: date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
            income,
            expenses,
            savings,
        });
    }

    return dailyData;
};

// Calculate total savings for current period
export const calculatePeriodSavings = (transactions, goal) => {
    const startDate = new Date(goal.startDate);
    const today = new Date();

    // Calculate period end based on goal type
    let periodDays = goal.customDays;
    if (goal.period === 'weekly') {
        periodDays = 7;
    } else if (goal.period === 'monthly') {
        // Days in current month
        periodDays = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    }

    // Filter transactions within period
    const periodTransactions = transactions.filter((t) => {
        const transDate = new Date(t.date);
        return transDate >= startDate && transDate <= today;
    });

    const totalIncome = periodTransactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalExpenses = periodTransactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + Number(t.amount), 0);

    const currentSavings = totalIncome - totalExpenses;
    const progress = (currentSavings / goal.amount) * 100;
    const remaining = goal.amount - currentSavings;

    return {
        totalIncome,
        totalExpenses,
        currentSavings,
        goalAmount: goal.amount,
        progress: Math.min(progress, 100),
        remaining: remaining > 0 ? remaining : 0,
        achieved: currentSavings >= goal.amount,
        periodDays,
    };
};

// Check if we should reset the goal (new period started)
export const shouldResetGoal = (goal) => {
    const startDate = new Date(goal.startDate);
    const today = new Date();

    if (goal.period === 'weekly') {
        const daysDiff = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
        return daysDiff >= 7;
    } else if (goal.period === 'monthly') {
        return today.getMonth() !== startDate.getMonth() || today.getFullYear() !== startDate.getFullYear();
    } else {
        // custom period
        const daysDiff = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
        return daysDiff >= goal.customDays;
    }
};

// Reset goal for new period
export const resetGoalPeriod = (goal) => {
    return {
        ...goal,
        startDate: new Date().toISOString(),
    };
};
