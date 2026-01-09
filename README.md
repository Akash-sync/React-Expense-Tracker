# Expense Tracker

A clean and intuitive personal finance management application built with React. Track income, expenses, and manage your balance with ease.

## Overview

Expense Tracker is a single-page application that enables users to record, categorize, and analyze their financial transactions. All data is stored locally in the browser, ensuring privacy and accessibility without requiring a backend server.

## Features

- **Transaction Management**: Add, edit, and delete income and expense transactions
- **Financial Summary**: View real-time calculations of total income, expenses, and balance
- **Advanced Filtering**: Filter transactions by type, category, date, and search keywords
- **Persistent Storage**: Transactions are automatically saved to browser localStorage
- **Responsive Design**: Clean, modern UI optimized for desktop and mobile devices
- **Date Support**: Track transactions with specific dates and month-based filtering

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone or navigate to the project directory:
   ```bash
   cd expense-tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Usage

### Adding a Transaction
1. Fill in the transaction form with amount, category, type (income/expense), and date
2. Click **Add** to record the transaction
3. The summary and transaction list update automatically

### Filtering Transactions
- **Type Filter**: View only income, expenses, or all transactions
- **Search Filter**: Find transactions by note or category name
- **Month Filter**: Display transactions from a specific month

### Editing/Deleting
- Click **Edit** on any transaction to modify its details
- Click **Delete** to remove a transaction
- Changes are reflected immediately in the summary

## Project Structure

```
src/
├── components/          # React components
│   ├── Header.jsx
│   ├── Summary.jsx
│   ├── Filters.jsx
│   ├── TransactionForm.jsx
│   ├── TransactionItem.jsx
│   └── TransactionList.jsx
├── context/            # React context for state management
│   └── TransactionsContext.jsx
├── hooks/              # Custom React hooks
│   └── useLocalStorage.js
├── utils/              # Utility functions
│   └── currency.js
├── App.jsx
├── index.js
└── styles.css
```

## Available Scripts

### Development
```bash
npm start
```
Runs the app in development mode at `http://localhost:3000`

### Build
```bash
npm run build
```
Creates an optimized production build in the `build/` folder

### Testing
```bash
npm test
```
Runs the test suite in interactive watch mode

## Technologies

- **React** (v19.2.3) - UI library
- **date-fns** (v4.1.0) - Date manipulation
- **UUID** (v13.0.0) - Unique transaction IDs
- **React Scripts** (v5.0.1) - Build and development tools

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)


