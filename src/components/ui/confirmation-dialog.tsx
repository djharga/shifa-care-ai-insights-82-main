import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Trash2 } from 'lucide-react';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'delete' | 'warning' | 'info';
  isLoading?: boolean;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'تأكيد',
  cancelText = 'إلغاء',
  variant = 'warning',
  isLoading = false
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'delete':
        return {
          icon: <Trash2 className="h-6 w-6 text-red-600" />,
          confirmButton: 'bg-red-600 hover:bg-red-700 text-white',
          titleColor: 'text-red-600'
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="h-6 w-6 text-yellow-600" />,
          confirmButton: 'bg-yellow-600 hover:bg-yellow-700 text-white',
          titleColor: 'text-yellow-600'
        };
      case 'info':
        return {
          icon: <AlertTriangle className="h-6 w-6 text-blue-600" />,
          confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white',
          titleColor: 'text-blue-600'
        };
      default:
        return {
          icon: <AlertTriangle className="h-6 w-6 text-yellow-600" />,
          confirmButton: 'bg-yellow-600 hover:bg-yellow-700 text-white',
          titleColor: 'text-yellow-600'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className={`flex items-center space-x-2 ${styles.titleColor}`}>
            {styles.icon}
            <span>{title}</span>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{message}</p>
          <div className="flex space-x-2 rtl:space-x-reverse">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1"
            >
              {cancelText}
            </Button>
            <Button
              onClick={onConfirm}
              disabled={isLoading}
              className={`flex-1 ${styles.confirmButton}`}
            >
              {isLoading ? 'جاري...' : confirmText}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationDialog; 