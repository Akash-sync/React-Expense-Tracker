import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';

export default function TransactionDataTable({ columns, data }) {
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [rowSelection, setRowSelection] = useState({});
    const [globalFilter, setGlobalFilter] = useState('');
    const [isColumnMenuOpen, setIsColumnMenuOpen] = useState(false);
    const [columnMenuPosition, setColumnMenuPosition] = useState({ top: 0, left: 0 });
    const columnButtonRef = useRef(null);
    const columnMenuRef = useRef(null);

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onGlobalFilterChange: setGlobalFilter,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            globalFilter,
        },
        initialState: {
            pagination: {
                pageSize: 10,
            },
        },
    });

    // Calculate menu position when opening
    useEffect(() => {
        if (isColumnMenuOpen && columnButtonRef.current) {
            const rect = columnButtonRef.current.getBoundingClientRect();
            setColumnMenuPosition({
                top: rect.bottom + window.scrollY + 4,
                left: rect.right + window.scrollX - 150, // Align right edge
            });
        }
    }, [isColumnMenuOpen]);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                columnMenuRef.current &&
                !columnMenuRef.current.contains(event.target) &&
                columnButtonRef.current &&
                !columnButtonRef.current.contains(event.target)
            ) {
                setIsColumnMenuOpen(false);
            }
        };

        if (isColumnMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isColumnMenuOpen]);

    return (
        <div style={{ width: '100%' }}>
            {/* Filter and Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
                <input
                    placeholder="Search transactions..."
                    value={globalFilter ?? ''}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    style={{
                        padding: '10px 12px',
                        borderRadius: '6px',
                        border: '1px solid var(--border)',
                        background: 'var(--card-bg)',
                        color: 'var(--text)',
                        fontSize: '14px',
                        flex: '1',
                        minWidth: '200px',
                        maxWidth: '400px',
                    }}
                />

                {/* Column Visibility Toggle */}
                <button
                    ref={columnButtonRef}
                    type="button"
                    onClick={() => setIsColumnMenuOpen(!isColumnMenuOpen)}
                    style={{
                        padding: '10px 16px',
                        borderRadius: '6px',
                        border: '1px solid var(--border)',
                        background: 'var(--card-bg)',
                        cursor: 'pointer',
                        fontSize: '14px',
                        color: 'var(--text)',
                    }}
                >
                    Columns ▼
                </button>

                {/* Column Menu Portal */}
                {isColumnMenuOpen &&
                    createPortal(
                        <div
                            ref={columnMenuRef}
                            style={{
                                position: 'absolute',
                                top: `${columnMenuPosition.top}px`,
                                left: `${columnMenuPosition.left}px`,
                                background: '#111827',
                                border: '1px solid var(--border)',
                                borderRadius: '6px',
                                padding: '8px',
                                minWidth: '150px',
                                zIndex: 9999,
                                boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                            }}
                        >
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => (
                                    <label
                                        key={column.id}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            padding: '6px 8px',
                                            cursor: 'pointer',
                                            fontSize: '13px',
                                            borderRadius: '4px',
                                        }}
                                        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={column.getIsVisible()}
                                            onChange={(e) => column.toggleVisibility(e.target.checked)}
                                            style={{ cursor: 'pointer' }}
                                        />
                                        <span style={{ textTransform: 'capitalize' }}>{column.id}</span>
                                    </label>
                                ))}
                        </div>,
                        document.body
                    )}

                {/* Rows per page */}
                <select
                    value={table.getState().pagination.pageSize}
                    onChange={(e) => table.setPageSize(Number(e.target.value))}
                    style={{
                        padding: '10px 12px',
                        borderRadius: '6px',
                        border: '1px solid var(--border)',
                        background: 'var(--card-bg)',
                        color: 'var(--text)',
                        fontSize: '14px',
                        cursor: 'pointer',
                    }}
                >
                    {[5, 10, 20, 50].map((pageSize) => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </select>
            </div>

            {/* Table */}
            <div
                style={{
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    background: 'var(--card-bg)',
                }}
            >
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            key={header.id}
                                            style={{
                                                padding: '14px 16px',
                                                textAlign: 'left',
                                                fontSize: '13px',
                                                fontWeight: 600,
                                                color: 'var(--muted)',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px',
                                                background: 'rgba(0,0,0,0.2)',
                                            }}
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(header.column.columnDef.header, header.getContext())}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <tr
                                        key={row.id}
                                        style={{
                                            borderBottom: '1px solid var(--border)',
                                            transition: 'background 0.15s',
                                        }}
                                        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <td key={cell.id} style={{ padding: '14px 16px', fontSize: '14px' }}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={columns.length}
                                        style={{
                                            padding: '48px 16px',
                                            textAlign: 'center',
                                            color: 'var(--muted)',
                                        }}
                                    >
                                        No transactions found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: '16px',
                    flexWrap: 'wrap',
                    gap: '12px',
                }}
            >
                <div style={{ fontSize: '13px', color: 'var(--muted)' }}>
                    {table.getFilteredSelectedRowModel().rows.length} of{' '}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        style={{
                            padding: '8px 14px',
                            borderRadius: '6px',
                            border: '1px solid var(--border)',
                            background: 'var(--card-bg)',
                            color: 'var(--text)',
                            fontSize: '13px',
                            cursor: table.getCanPreviousPage() ? 'pointer' : 'not-allowed',
                            opacity: table.getCanPreviousPage() ? 1 : 0.5,
                        }}
                    >
                        Previous
                    </button>
                    <button
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        style={{
                            padding: '8px 14px',
                            borderRadius: '6px',
                            border: '1px solid var(--border)',
                            background: 'var(--card-bg)',
                            color: 'var(--text)',
                            fontSize: '13px',
                            cursor: table.getCanNextPage() ? 'pointer' : 'not-allowed',
                            opacity: table.getCanNextPage() ? 1 : 0.5,
                        }}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}
