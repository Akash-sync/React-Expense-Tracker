import { formatCurrency } from '../utils/currency';
import { format } from 'date-fns';

export const createTransactionColumns = (onEdit, onDelete) => [
    {
        id: 'select',
        header: ({ table }) => (
            <input
                type="checkbox"
                checked={table.getIsAllPageRowsSelected()}
                onChange={(e) => table.toggleAllPageRowsSelected(e.target.checked)}
                style={{ cursor: 'pointer' }}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <input
                type="checkbox"
                checked={row.getIsSelected()}
                onChange={(e) => row.toggleSelected(e.target.checked)}
                style={{ cursor: 'pointer' }}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'date',
        header: ({ column }) => (
            <button
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                style={{
                    background: 'none',
                    border: 'none',
                    color: 'inherit',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: 0,
                    fontWeight: 600,
                }}
            >
                Date
                {column.getIsSorted() === 'asc' ? ' ↑' : column.getIsSorted() === 'desc' ? ' ↓' : ' ↕'}
            </button>
        ),
        cell: ({ row }) => {
            const date = new Date(row.getValue('date'));
            return <div style={{ fontSize: '13px' }}>{format(date, 'MMM dd, yyyy')}</div>;
        },
    },
    {
        accessorKey: 'type',
        header: 'Type',
        cell: ({ row }) => {
            const type = row.getValue('type');
            return (
                <span
                    className={`badge ${type}`}
                    style={{
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        backgroundColor: type === 'income' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        color: type === 'income' ? '#22c55e' : '#ef4444',
                    }}
                >
                    {type}
                </span>
            );
        },
    },
    {
        accessorKey: 'category',
        header: ({ column }) => (
            <button
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                style={{
                    background: 'none',
                    border: 'none',
                    color: 'inherit',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: 0,
                    fontWeight: 600,
                }}
            >
                Category
                {column.getIsSorted() === 'asc' ? ' ↑' : column.getIsSorted() === 'desc' ? ' ↓' : ' ↕'}
            </button>
        ),
        cell: ({ row }) => {
            return <div style={{ fontWeight: 500 }}>{row.getValue('category') || 'Uncategorized'}</div>;
        },
    },
    {
        accessorKey: 'note',
        header: 'Description',
        cell: ({ row }) => {
            const note = row.getValue('note');
            return (
                <div style={{ color: 'var(--muted)', fontSize: '13px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {note || '—'}
                </div>
            );
        },
    },
    {
        accessorKey: 'amount',
        header: ({ column }) => (
            <button
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                style={{
                    background: 'none',
                    border: 'none',
                    color: 'inherit',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: 0,
                    fontWeight: 600,
                    marginLeft: 'auto',
                }}
            >
                Amount
                {column.getIsSorted() === 'asc' ? ' ↑' : column.getIsSorted() === 'desc' ? ' ↓' : ' ↕'}
            </button>
        ),
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue('amount'));
            const type = row.getValue('type');
            const formatted = formatCurrency(amount);
            return (
                <div
                    style={{
                        textAlign: 'right',
                        fontWeight: 600,
                        color: type === 'income' ? '#22c55e' : '#ef4444',
                    }}
                >
                    {type === 'expense' ? '-' : '+'} {formatted}
                </div>
            );
        },
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const transaction = row.original;
            return (
                <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                    <button
                        onClick={() => onEdit(transaction)}
                        style={{
                            padding: '4px 10px',
                            fontSize: '12px',
                            cursor: 'pointer',
                            border: '1px solid var(--border)',
                            borderRadius: '4px',
                            background: 'var(--card-bg)',
                        }}
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => onDelete(transaction.id)}
                        style={{
                            padding: '4px 10px',
                            fontSize: '12px',
                            cursor: 'pointer',
                            border: '1px solid #ef4444',
                            borderRadius: '4px',
                            background: 'rgba(239, 68, 68, 0.1)',
                            color: '#ef4444',
                        }}
                    >
                        Delete
                    </button>
                </div>
            );
        },
        enableSorting: false,
        enableHiding: false,
    },
];
