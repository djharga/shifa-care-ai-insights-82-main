import { useEffect } from 'react';

interface KeyboardShortcutsProps {
  onAdd?: () => void;
  onSave?: () => void;
  onSearch?: () => void;
  onEscape?: () => void;
  onRefresh?: () => void;
  onDelete?: () => void;
  enabled?: boolean;
}

export const useKeyboardShortcuts = ({
  onAdd,
  onSave,
  onSearch,
  onEscape,
  onRefresh,
  onDelete,
  enabled = true
}: KeyboardShortcutsProps) => {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // منع الاختصارات في حقول الإدخال
      if (event.target instanceof HTMLInputElement || 
          event.target instanceof HTMLTextAreaElement || 
          event.target instanceof HTMLSelectElement) {
        return;
      }

      // Alt + N لإضافة جديد
      if (event.altKey && event.key === 'n' && onAdd) {
        event.preventDefault();
        onAdd();
      }

      // Ctrl + S للحفظ
      if (event.ctrlKey && event.key === 's' && onSave) {
        event.preventDefault();
        onSave();
      }

      // Ctrl + F للبحث
      if (event.ctrlKey && event.key === 'f' && onSearch) {
        event.preventDefault();
        onSearch();
      }

      // Escape لإغلاق النوافذ المنبثقة
      if (event.key === 'Escape' && onEscape) {
        event.preventDefault();
        onEscape();
      }

      // F5 أو Ctrl + R للتحديث
      if ((event.key === 'F5' || (event.ctrlKey && event.key === 'r')) && onRefresh) {
        event.preventDefault();
        onRefresh();
      }

      // Delete للحذف
      if (event.key === 'Delete' && onDelete) {
        event.preventDefault();
        onDelete();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onAdd, onSave, onSearch, onEscape, onRefresh, onDelete, enabled]);
}; 