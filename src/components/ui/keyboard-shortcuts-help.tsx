import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { HelpCircle, Keyboard } from 'lucide-react';

const KeyboardShortcutsHelp = () => {
  const shortcuts = [
    { key: 'Alt + N', description: 'إضافة جديد' },
    { key: 'Ctrl + S', description: 'حفظ' },
    { key: 'Ctrl + F', description: 'بحث' },
    { key: 'Escape', description: 'إغلاق النوافذ المنبثقة' },
    { key: 'F5', description: 'تحديث الصفحة' },
    { key: 'Delete', description: 'حذف' },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center space-x-2">
          <Keyboard className="h-4 w-4" />
          <span>اختصارات لوحة المفاتيح</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <HelpCircle className="h-5 w-5" />
            <span>اختصارات لوحة المفاتيح</span>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            استخدم هذه الاختصارات لتسريع عملك في النظام:
          </p>
          <div className="space-y-3">
            {shortcuts.map((shortcut, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-sm font-medium">{shortcut.description}</span>
                <kbd className="px-2 py-1 text-xs font-semibold bg-background border rounded">
                  {shortcut.key}
                </kbd>
              </div>
            ))}
          </div>
          <div className="text-xs text-muted-foreground mt-4 p-3 bg-blue-50 rounded-lg">
            <strong>ملاحظة:</strong> هذه الاختصارات لا تعمل عند الكتابة في حقول الإدخال.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KeyboardShortcutsHelp; 