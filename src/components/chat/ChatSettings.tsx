import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { 
  Settings, 
  Bell, 
  Shield, 
  Eye, 
  EyeOff, 
  Volume2, 
  VolumeX,
  Smartphone,
  Monitor,
  Globe,
  Lock,
  Key,
  User,
  Users,
  Archive,
  Trash2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { updateUserStatus } from '@/services/internal-chat-service';

interface ChatSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserId: string;
  currentUser: {
    name: string;
    role: string;
    avatar?: string;
    status: 'online' | 'offline' | 'busy';
  };
}

const ChatSettings: React.FC<ChatSettingsProps> = ({
  isOpen,
  onClose,
  currentUserId,
  currentUser
}) => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    // الإشعارات
    notifications: {
      enabled: true,
      sound: true,
      vibration: true,
      desktop: true,
      email: false,
    },
    // الخصوصية
    privacy: {
      showStatus: true,
      showLastSeen: true,
      allowReadReceipts: true,
      allowTypingIndicator: true,
    },
    // المظهر
    appearance: {
      theme: 'light' as 'light' | 'dark' | 'auto',
      fontSize: 'medium' as 'small' | 'medium' | 'large',
      compactMode: false,
    },
    // الأمان
    security: {
      twoFactorAuth: false,
      autoLock: false,
      encryption: true,
    },
    // الحالة
    status: currentUser.status,
    customStatus: '',
  });

  const handleSettingChange = (category: string, setting: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: value
      }
    }));
  };

  const handleStatusChange = async (newStatus: 'online' | 'offline' | 'busy') => {
    try {
      await updateUserStatus(currentUserId, newStatus);
      setSettings(prev => ({ ...prev, status: newStatus }));
      toast({
        title: "تم تحديث الحالة",
        description: `تم تغيير حالتك إلى ${newStatus === 'online' ? 'متصل' : newStatus === 'busy' ? 'مشغول' : 'غير متصل'}`,
      });
    } catch (error) {
      toast({
        title: "خطأ في تحديث الحالة",
        description: "فشل في تحديث حالة المستخدم",
        variant: "destructive",
      });
    }
  };

  const handleSaveSettings = async () => {
    try {
      // حفظ الإعدادات في localStorage أو قاعدة البيانات
      localStorage.setItem('chatSettings', JSON.stringify(settings));
      
      toast({
        title: "تم حفظ الإعدادات",
        description: "تم حفظ إعدادات الشات بنجاح",
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "خطأ في حفظ الإعدادات",
        description: "فشل في حفظ الإعدادات",
        variant: "destructive",
      });
    }
  };

  const handleResetSettings = () => {
    const defaultSettings = {
      notifications: {
        enabled: true,
        sound: true,
        vibration: true,
        desktop: true,
        email: false,
      },
      privacy: {
        showStatus: true,
        showLastSeen: true,
        allowReadReceipts: true,
        allowTypingIndicator: true,
      },
      appearance: {
        theme: 'light',
        fontSize: 'medium',
        compactMode: false,
      },
      security: {
        twoFactorAuth: false,
        autoLock: false,
        encryption: true,
      },
      status: 'online',
      customStatus: '',
    };
    
    setSettings(defaultSettings);
    toast({
      title: "تم إعادة تعيين الإعدادات",
      description: "تم إعادة تعيين جميع الإعدادات إلى القيم الافتراضية",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'busy':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online':
        return 'متصل';
      case 'busy':
        return 'مشغول';
      case 'offline':
        return 'غير متصل';
      default:
        return 'غير متصل';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>إعدادات الشات</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* معلومات المستخدم */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(settings.status)}`} />
              </div>
              <div>
                <h3 className="font-medium">{currentUser.name}</h3>
                <p className="text-sm text-gray-600">{currentUser.role}</p>
              </div>
            </div>
          </div>

          {/* الحالة */}
          <div>
            <Label className="text-base font-medium">الحالة</Label>
            <div className="mt-3 space-y-3">
              <div className="flex items-center justify-between">
                <span>الحالة الحالية</span>
                <Select value={settings.status} onValueChange={handleStatusChange}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">متصل</SelectItem>
                    <SelectItem value="busy">مشغول</SelectItem>
                    <SelectItem value="offline">غير متصل</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="customStatus">رسالة حالة مخصصة</Label>
                <Input
                  id="customStatus"
                  value={settings.customStatus}
                  onChange={(e) => setSettings(prev => ({ ...prev, customStatus: e.target.value }))}
                  placeholder="مثال: في اجتماع..."
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* الإشعارات */}
          <div>
            <Label className="text-base font-medium flex items-center space-x-2">
              <Bell className="w-4 h-4" />
              <span>الإشعارات</span>
            </Label>
            <div className="mt-3 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span>تفعيل الإشعارات</span>
                  <p className="text-sm text-gray-600">استقبال إشعارات الرسائل الجديدة</p>
                </div>
                <Switch
                  checked={settings.notifications.enabled}
                  onCheckedChange={(checked) => handleSettingChange('notifications', 'enabled', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span>صوت الإشعارات</span>
                  <p className="text-sm text-gray-600">تشغيل صوت عند استقبال رسالة</p>
                </div>
                <Switch
                  checked={settings.notifications.sound}
                  onCheckedChange={(checked) => handleSettingChange('notifications', 'sound', checked)}
                  disabled={!settings.notifications.enabled}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span>اهتزاز</span>
                  <p className="text-sm text-gray-600">اهتزاز الجهاز عند استقبال رسالة</p>
                </div>
                <Switch
                  checked={settings.notifications.vibration}
                  onCheckedChange={(checked) => handleSettingChange('notifications', 'vibration', checked)}
                  disabled={!settings.notifications.enabled}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span>إشعارات سطح المكتب</span>
                  <p className="text-sm text-gray-600">إشعارات على سطح المكتب</p>
                </div>
                <Switch
                  checked={settings.notifications.desktop}
                  onCheckedChange={(checked) => handleSettingChange('notifications', 'desktop', checked)}
                  disabled={!settings.notifications.enabled}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span>إشعارات البريد الإلكتروني</span>
                  <p className="text-sm text-gray-600">إرسال إشعارات على البريد الإلكتروني</p>
                </div>
                <Switch
                  checked={settings.notifications.email}
                  onCheckedChange={(checked) => handleSettingChange('notifications', 'email', checked)}
                  disabled={!settings.notifications.enabled}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* الخصوصية */}
          <div>
            <Label className="text-base font-medium flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>الخصوصية</span>
            </Label>
            <div className="mt-3 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span>إظهار الحالة</span>
                  <p className="text-sm text-gray-600">السماح للآخرين برؤية حالتك</p>
                </div>
                <Switch
                  checked={settings.privacy.showStatus}
                  onCheckedChange={(checked) => handleSettingChange('privacy', 'showStatus', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span>آخر ظهور</span>
                  <p className="text-sm text-gray-600">إظهار آخر وقت ظهور لك</p>
                </div>
                <Switch
                  checked={settings.privacy.showLastSeen}
                  onCheckedChange={(checked) => handleSettingChange('privacy', 'showLastSeen', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span>إيصال القراءة</span>
                  <p className="text-sm text-gray-600">إظهار علامة "تمت القراءة"</p>
                </div>
                <Switch
                  checked={settings.privacy.allowReadReceipts}
                  onCheckedChange={(checked) => handleSettingChange('privacy', 'allowReadReceipts', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span>مؤشر الكتابة</span>
                  <p className="text-sm text-gray-600">إظهار "يكتب الآن..."</p>
                </div>
                <Switch
                  checked={settings.privacy.allowTypingIndicator}
                  onCheckedChange={(checked) => handleSettingChange('privacy', 'allowTypingIndicator', checked)}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* المظهر */}
          <div>
            <Label className="text-base font-medium flex items-center space-x-2">
              <Monitor className="w-4 h-4" />
              <span>المظهر</span>
            </Label>
            <div className="mt-3 space-y-4">
              <div className="flex items-center justify-between">
                <span>المظهر</span>
                <Select 
                  value={settings.appearance.theme} 
                  onValueChange={(value) => handleSettingChange('appearance', 'theme', value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">فاتح</SelectItem>
                    <SelectItem value="dark">داكن</SelectItem>
                    <SelectItem value="auto">تلقائي</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <span>حجم الخط</span>
                <Select 
                  value={settings.appearance.fontSize} 
                  onValueChange={(value) => handleSettingChange('appearance', 'fontSize', value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">صغير</SelectItem>
                    <SelectItem value="medium">متوسط</SelectItem>
                    <SelectItem value="large">كبير</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span>الوضع المضغوط</span>
                  <p className="text-sm text-gray-600">تقليل المسافات بين العناصر</p>
                </div>
                <Switch
                  checked={settings.appearance.compactMode}
                  onCheckedChange={(checked) => handleSettingChange('appearance', 'compactMode', checked)}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* الأمان */}
          <div>
            <Label className="text-base font-medium flex items-center space-x-2">
              <Lock className="w-4 h-4" />
              <span>الأمان</span>
            </Label>
            <div className="mt-3 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span>المصادقة الثنائية</span>
                  <p className="text-sm text-gray-600">حماية إضافية لحسابك</p>
                </div>
                <Switch
                  checked={settings.security.twoFactorAuth}
                  onCheckedChange={(checked) => handleSettingChange('security', 'twoFactorAuth', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span>قفل تلقائي</span>
                  <p className="text-sm text-gray-600">قفل الشات بعد فترة من عدم النشاط</p>
                </div>
                <Switch
                  checked={settings.security.autoLock}
                  onCheckedChange={(checked) => handleSettingChange('security', 'autoLock', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span>تشفير الرسائل</span>
                  <p className="text-sm text-gray-600">تشفير جميع الرسائل</p>
                </div>
                <Switch
                  checked={settings.security.encryption}
                  onCheckedChange={(checked) => handleSettingChange('security', 'encryption', checked)}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* إجراءات متقدمة */}
          <div>
            <Label className="text-base font-medium">إجراءات متقدمة</Label>
            <div className="mt-3 space-y-2">
              <Button variant="outline" className="w-full justify-start" onClick={handleResetSettings}>
                <Archive className="w-4 h-4 mr-2" />
                إعادة تعيين الإعدادات
              </Button>
              <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                <Trash2 className="w-4 h-4 mr-2" />
                حذف جميع المحادثات
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            إلغاء
          </Button>
          <Button onClick={handleSaveSettings}>
            حفظ الإعدادات
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChatSettings; 