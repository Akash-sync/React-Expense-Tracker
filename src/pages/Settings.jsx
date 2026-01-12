export default function Settings() {
  return (
    <div className="container">
      <h1 style={{ marginTop: '80px', marginBottom: '24px' }}>Settings</h1>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Data Management</h2>
        <div style={{ marginBottom: '16px' }}>
          <p style={{ color: 'var(--muted)', marginBottom: '12px' }}>
            All your transaction data is stored locally in your browser's localStorage for privacy.
          </p>
          <button
            style={{
              padding: '10px 14px',
              backgroundColor: 'var(--danger)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600
            }}
            onClick={() => {
              if (window.confirm('Are you sure you want to delete all transactions? This cannot be undone.')) {
                localStorage.removeItem('transactions');
                window.location.reload();
              }
            }}
          >
            Clear All Data
          </button>
        </div>
      </div>

      <div className="card" style={{ marginTop: '24px' }}>
        <h2 style={{ marginTop: 0 }}>About</h2>
        <p style={{ color: 'var(--text)' }}>
          <strong>Expense Tracker v1.0</strong>
        </p>
        <p style={{ color: 'var(--muted)' }}>
          A clean and intuitive personal finance management application. Track income, expenses, and manage your
          balance with ease.
        </p>
        <p style={{ color: 'var(--muted)', fontSize: '12px' }}>
          Built with React, featuring real-time calculations, advanced filtering, and persistent local storage.
        </p>
      </div>

      <div className="card" style={{ marginTop: '24px' }}>
        <h2 style={{ marginTop: 0 }}>Features</h2>
        <ul style={{ color: 'var(--text)', paddingLeft: '20px' }}>
          <li>Transaction Management - Add, edit, and delete transactions</li>
          <li>Financial Summary - Real-time balance calculations</li>
          <li>Advanced Filtering - By type, category, date, and keywords</li>
          <li>Persistent Storage - Automatic localStorage backup</li>
          <li>Responsive Design - Works on desktop and mobile</li>
          <li>Category Support - Organize transactions by category</li>
        </ul>
      </div>
    </div>
  );
}
