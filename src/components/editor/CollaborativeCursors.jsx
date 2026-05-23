import { useEffect, useState, useMemo } from 'react';

const CollaborativeCursors = ({ editor, cursors, onlineUsers }) => {
    const [cursorCoords, setCursorCoords] = useState({});

    // Update coordinates whenever cursors or editor state changes
    useEffect(() => {
        if (!editor || editor.isDestroyed) return;

        const updateCoords = () => {
            const nextCoords = {};

            Object.entries(cursors).forEach(([userId, data]) => {
                try {
                    // Don't show our own cursor from socket updates
                    // (Tiptap handles local cursor natively)
                    // We assume userId comes from the socket data

                    const pos = data.position;
                    // Check if the position is within document bounds
                    if (pos >= 0 && pos <= editor.state.doc.content.size) {
                        const coords = editor.view.coordsAtPos(pos);

                        // Get editor container position to make coords relative
                        const editorContainer = editor.view.dom.offsetParent;
                        const rect = editorContainer.getBoundingClientRect();

                        nextCoords[userId] = {
                            top: coords.top - rect.top,
                            left: coords.left - rect.left,
                            height: coords.bottom - coords.top,
                        };
                    }
                } catch (e) {
                    // Position might be out of sync during fast edits
                }
            });

            setCursorCoords(nextCoords);
        };

        // Update on next tick and also listen to scroll/resize if needed
        const timer = requestAnimationFrame(updateCoords);
        return () => cancelAnimationFrame(timer);
    }, [editor, cursors]);

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10" aria-hidden="true">
            {Object.entries(cursorCoords).map(([userId, coords]) => {
                const presenceUser = onlineUsers.find(u => u.userId === userId || u.id === userId);
                if (!presenceUser) return null;

                const name = presenceUser.username || presenceUser.email || 'Anonymous';
                const color = presenceUser.color || '#6366f1';

                return (
                    <div
                        key={userId}
                        className="collaboration-cursor"
                        style={{
                            top: `${coords.top}px`,
                            left: `${coords.left}px`,
                            color: color,
                        }}
                    >
                        <div className="collaboration-cursor__caret" style={{ height: `${coords.height}px` }} />
                        <div className="collaboration-cursor__label">
                            {name}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default CollaborativeCursors;
