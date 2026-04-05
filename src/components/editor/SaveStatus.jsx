import { Cloud, Loader2, CloudOff } from 'lucide-react';

/**
 * SaveStatus — shows current save state
 *
 * Props:
 * - status: 'saving' | 'saved' | 'error'
 *
 * Implementation notes:
 * - 'saving' → spinning loader + "Saving..." text
 * - 'saved'  → cloud icon + "All changes saved" text
 * - 'error'  → cloudoff icon + "Error saving" text in red
 */
const SaveStatus = ({ status }) => {
    // TODO: render different icon + text + color based on status
    // hint: use an object map instead of if/else

    const config = {
        saving: {
            icon: <Loader2 size={14} className="animate-spin" />,
            text: 'Saving...',
            className: 'text-amber-400',
        },
        saved: {
            icon: <Cloud size={14} />,
            text: 'All changes saved',
            className: 'text-on-surface-variant',
        },
        error: {
            icon: <CloudOff size={14} />,
            text: 'Error saving',
            className: 'text-error',
        },
    };

    const current = config[status] ?? config.saved;

    return (
        <div className={`flex items-center gap-1.5 text-xs ${current.className}`}>
            {current.icon}
            <span>{current.text}</span>
        </div>
    );
};

export default SaveStatus;