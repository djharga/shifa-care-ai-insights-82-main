import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { 
  Bell, 
  MessageSquare, 
  Users, 
  Settings, 
  Check, 
  X,
  Clock,
  User,
  FileText,
  Image as ImageIcon,
  FileAudio
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getNotifications, markNotificationAsRead } from '@/services/internal-chat-service';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'message' | 'group' | 'system';
  is_read: boolean;
  created_at: string;
  data?: any;
  sender?: {
    id: string;
    name: string;
    avatar?: string;
  };
}

interface NotificationCenterProps {
  currentUserId: string;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ currentUserId }) => {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen, currentUserId]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await getNotifications(currentUserId);
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast({
        title: "خطأ في تحميل الإشعارات",
        description: "فشل في تحميل الإشعارات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, is_read: true }
            : notif
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.is_read);
      await Promise.all(
        unreadNotifications.map(notif => markNotificationAsRead(notif.id))
      );
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, is_read: true }))
      );
      toast({
        title: "تم تحديث الإشعارات",
        description: "تم تحديد جميع الإشعارات كمقروءة",
      });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast({
        title: "خطأ في تحديث الإشعارات",
        description: "فشل في تحديث حالة الإشعارات",
        variant: "destructive",
      });
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <MessageSquare className="w-4 h-4" />;
      case 'group':
        return <Users className="w-4 h-4" />;
      case 'system':
        return <Settings className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'message':
        return 'text-blue-600 bg-blue-100';
      case 'group':
        return 'text-green-600 bg-green-100';
      case 'system':
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'الآن';
    if (diffInMinutes < 60) return `منذ ${diffInMinutes} دقيقة`;
    if (diffInMinutes < 1440) return `منذ ${Math.floor(diffInMinutes / 60)} ساعة`;
    return `منذ ${Math.floor(diffInMinutes / 1440)} يوم`;
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 w-5 h-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">الإشعارات</h3>
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleMarkAllAsRead}
                className="text-xs"
              >
                تحديد الكل كمقروء
              </Button>
            )}
          </div>
        </div>

        <ScrollArea className="h-96">
          {loading ? (
            <div className="p-4 text-center text-gray-500">
              جاري تحميل الإشعارات...
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Bell className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>لا توجد إشعارات جديدة</p>
            </div>
          ) : (
            <div className="p-2">
              {notifications.map((notification, index) => (
                <div key={notification.id}>
                  <div className={`p-3 rounded-lg hover:bg-gray-50 transition-colors ${
                    !notification.is_read ? 'bg-blue-50' : ''
                  }`}>
                    <div className="flex items-start space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getNotificationColor(notification.type)}`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{notification.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                            
                            {notification.sender && (
                              <div className="flex items-center space-x-2 mt-2">
                                <Avatar className="w-6 h-6">
                                  <AvatarImage src={notification.sender.avatar} />
                                  <AvatarFallback className="text-xs">
                                    {notification.sender.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-xs text-gray-500">
                                  {notification.sender.name}
                                </span>
                              </div>
                            )}
                            
                            <div className="flex items-center space-x-2 mt-2">
                              <Clock className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-500">
                                {formatTime(notification.created_at)}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            {!notification.is_read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleMarkAsRead(notification.id)}
                                className="h-6 w-6 p-0"
                              >
                                <Check className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {index < notifications.length - 1 && <Separator className="my-1" />}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {notifications.length > 0 && (
          <div className="p-3 border-t bg-gray-50">
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full text-sm"
              onClick={() => setIsOpen(false)}
            >
              إغلاق
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default NotificationCenter; 