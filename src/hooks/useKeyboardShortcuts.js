import { useEffect } from 'react';

export const useKeyboardShortcuts = (handlers) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger shortcuts if user is typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
        if (e.key === 'Escape' && handlers.onEscape) {
          handlers.onEscape(e);
        }
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        handlers.onNewTask && handlers.onNewTask(e);
      }
      
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        handlers.onSearch && handlers.onSearch(e);
      }
      
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          handlers.onRedo && handlers.onRedo(e);
        } else {
          e.preventDefault();
          handlers.onUndo && handlers.onUndo(e);
        }
      }

      if (e.key === 'Delete' || e.key === 'Backspace') {
        handlers.onDelete && handlers.onDelete(e);
      }

      if (e.key === 'Escape') {
        handlers.onEscape && handlers.onEscape(e);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlers]);
};