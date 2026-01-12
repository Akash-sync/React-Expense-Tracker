import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Calendar } from './Calendar';
import { format } from 'date-fns';

export function DatePicker({ value, onChange, placeholder = 'Select date' }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(value ? new Date(value) : undefined);
    const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
    const popoverRef = useRef(null);
    const buttonRef = useRef(null);

    // Update selectedDate when value prop changes
    useEffect(() => {
        if (value) {
            setSelectedDate(new Date(value));
        }
    }, [value]);

    // Calculate popover position when opening
    useEffect(() => {
        if (isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setPopoverPosition({
                top: rect.bottom + window.scrollY + 4,
                left: rect.left + window.scrollX,
            });
        }
    }, [isOpen]);

    // Close popover when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                popoverRef.current &&
                !popoverRef.current.contains(event.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleSelect = (date) => {
        setSelectedDate(date);
        if (date) {
            // Convert to yyyy-mm-dd format for form
            const formattedDate = format(date, 'yyyy-MM-dd');
            onChange?.(formattedDate);
            setIsOpen(false);
        }
    };

    return (
        <>
            <button
                ref={buttonRef}
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '6px',
                    border: '1px solid var(--border)',
                    background: 'var(--card-bg)',
                    color: 'var(--text)',
                    fontSize: '14px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <span>{selectedDate ? format(selectedDate, 'MMM dd, yyyy') : placeholder}</span>
                <span style={{ opacity: 0.5 }}>▼</span>
            </button>

            {isOpen &&
                createPortal(
                    <div
                        ref={popoverRef}
                        style={{
                            position: 'absolute',
                            top: `${popoverPosition.top}px`,
                            left: `${popoverPosition.left}px`,
                            zIndex: 9999,
                            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.8)',
                            borderRadius: '12px',
                            overflow: 'visible',
                        }}
                    >
                        <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={handleSelect}
                            defaultMonth={selectedDate}
                            fromYear={2000}
                            toYear={2030}
                        />
                    </div>,
                    document.body
                )}
        </>
    );
}
