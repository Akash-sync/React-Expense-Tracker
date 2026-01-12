export const EXPENSE_CATEGORIES = [
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Housing',
    'Utilities',
    'Entertainment',
    'Health & Fitness',
    'Personal Care',
    'Education',
    'Travel',
    'Debt & Loans',
    'Gifts & Donations',
    'Other'
];

export const INCOME_CATEGORIES = [
    'Salary',
    'Freelance / Contract',
    'Business',
    'Investments',
    'Gifts',
    'Other'
];

export const getCategoriesByType = (type) => {
    return type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
};
