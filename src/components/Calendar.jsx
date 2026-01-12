import { DayPicker } from 'react-day-picker';
import './Calendar.css';

export function Calendar({ className, classNames, ...props }) {
    return (
        <DayPicker
            showOutsideDays
            captionLayout="dropdown"
            className={className}
            {...props}
        />
    );
}
