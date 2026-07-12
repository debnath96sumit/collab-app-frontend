export const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    });
};

export const getInitials = (name) => {
    if (!name) return 'U';
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
};

export const getNotificationText = (notification) => {
    const docTitle = notification.metadata?.documentTitle || 'a document';

    switch (notification.type) {
        case 'collaborator_invited':
            return `invited you to collaborate on "${docTitle}"`;
        case 'collaborator_added':
            return `added you as ${notification.metadata?.role || 'a collaborator'} on "${docTitle}"`;
        case 'invitation_accepted':
            return `accepted your invite to "${docTitle}"`;
        case 'role_changed':
            return `changed your role to ${notification.metadata?.role} on "${docTitle}"`;
        case 'collaborator_removed':
            return `removed you from "${docTitle}"`;
        case 'document_renamed':
            return `renamed a document to "${notification.metadata?.newTitle}"`;
        default:
            return 'sent you a notification';
    }
};

export const formatRelativeTime = (date) => {
    const diffMins = Math.floor((new Date() - new Date(date)) / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(date);
};