import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, Clock, TrendingUp, X } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const NotificationCenter = () => {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'warning',
      title: 'جلسة متأخرة',
      message: 'المريض أحمد محمد لم يحضر للجلسة المجدولة في 10:00',
      time: 'منذ 15 دقيقة',
      action: 'اتصال'
    },
    {
      id: '2',
      type: 'success',
      title: 'تحسن ملحوظ',
      message: 'المريضة فاطمة علي تظهر تحسناً كبيراً في آخر تقييم',
      time: 'منذ ساعة',
      action: 'عرض التقرير'
    },
    {
      id: '3',
      type: 'info',
      title: 'تذكير موعد',
      message: 'الجلسة القادمة مع محمد عبدالله في 2:00 م',
      time: 'منذ ساعتين',
      action: 'تحضير'
    },
    {
      id: '4',
      type: 'success',
      title: 'إكمال برنامج',
      message: 'المريض سارة أحمد أكملت برنامج العلاج بنجاح',
      time: 'اليوم',
      action: 'تهنئة'
    }
  ]);

  const handleAction = (notification: any) => {
    toast({
      title: "تم تنفيذ الإجراء",
      description: `تم تنفيذ: ${notification.action}`,
    });
  };

  const handleDelete = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast({
      title: "تم حذف التنبيه",
      description: "تم حذف التنبيه بنجاح",
    });
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'info':
        return <Clock className="h-4 w-4 text-info" />;
      default:
        return <TrendingUp className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getBorderColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'border-l-warning';
      case 'success':
        return 'border-l-success';
      case 'info':
        return 'border-l-info';
      default:
        return 'border-l-muted';
    }
  };

  return (
    <Card>
      <CardContent className="p-0">
        <div className="p-4 border-b border-border">
          <h3 className="font-medium text-foreground">التنبيهات والإشعارات</h3>
          <p className="text-sm text-muted-foreground">آخر التحديثات والتنبيهات المهمة</p>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {notifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`p-4 border-l-4 ${getBorderColor(notification.type)} border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors`}
            >
              <div className="flex items-start space-x-3 rtl:space-x-reverse">
                <div className="flex-shrink-0 mt-1">
                  {getIcon(notification.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-medium text-foreground truncate">
                      {notification.title}
                    </h4>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <span className="text-xs text-muted-foreground">
                        {notification.time}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                        onClick={() => handleDelete(notification.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">
                    {notification.message}
                  </p>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs"
                    onClick={() => handleAction(notification)}
                  >
                    {notification.action}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-4 border-t border-border">
          <Button variant="ghost" className="w-full text-sm">
            عرض جميع التنبيهات
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationCenter;