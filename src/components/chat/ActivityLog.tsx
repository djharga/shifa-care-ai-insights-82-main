import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { 
  Activity, 
  Search, 
  Filter, 
  Download, 
  Calendar,
  User,
  MessageSquare,
  Users,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Trash2,
  RefreshCw,
  FileText,
  Settings,
  Lock,
  Unlock,
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ActivityLogEntry {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  userAvatar?: string;
  action: string;
  description: string;
  type: 'message' | 'group' | 'user' | 'security' | 'system';
  severity: 'info' | 'warning' | 'error' | 'success';
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: any;
}

interface ActivityLogProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserId: string;
  isCurrentUserAdmin: boolean;
}

const ActivityLog: React.FC<ActivityLogProps> = ({
  isOpen,
  onClose,
  currentUserId,
  isCurrentUserAdmin
}) => {
  const { toast } = useToast();
  const [logs, setLogs] = useState<ActivityLogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'message' | 'group' | 'user' | 'security' | 'system'>('all');
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'info' | 'warning' | 'error' | 'success'>('all');
  const [dateRange, setDateRange] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [selectedLog, setSelectedLog] = useState<ActivityLogEntry | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchActivityLogs();
    }
  }, [isOpen]);

  const fetchActivityLogs = async () => {
    try {
      setLoading(true);
      // محاكاة جلب السجلات من قاعدة البيانات
      const mockLogs: ActivityLogEntry[] = [
        {
          id: '1',
          userId: '1',
          userName: 'أحمد محمد',
          userRole: 'مدير النظام',
          action: 'login',
          description: 'تسجيل دخول ناجح',
          type: 'security',
          severity: 'success',
          timestamp: new Date().toISOString(),
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        {
          id: '2',
          userId: '2',
          userName: 'سارة أحمد',
          userRole: 'مشرف',
          action: 'send_message',
          description: 'إرسال رسالة في مجموعة "قسم الطب النفسي"',
          type: 'message',
          severity: 'info',
          timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          metadata: { groupId: 'group1', groupName: 'قسم الطب النفسي' }
        },
        {
          id: '3',
          userId: '3',
          userName: 'محمد علي',
          userRole: 'معالج',
          action: 'create_group',
          description: 'إنشاء مجموعة جديدة "فريق العلاج"',
          type: 'group',
          severity: 'info',
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          metadata: { groupId: 'group2', groupName: 'فريق العلاج' }
        },
        {
          id: '4',
          userId: '1',
          userName: 'أحمد محمد',
          userRole: 'مدير النظام',
          action: 'update_permissions',
          description: 'تحديث صلاحيات المستخدم "فاطمة حسن"',
          type: 'user',
          severity: 'warning',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          metadata: { targetUserId: '4', targetUserName: 'فاطمة حسن' }
        },
        {
          id: '5',
          userId: '4',
          userName: 'فاطمة حسن',
          userRole: 'مراقب',
          action: 'failed_login',
          description: 'محاولة تسجيل دخول فاشلة',
          type: 'security',
          severity: 'error',
          timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
          ipAddress: '192.168.1.101'
        },
        {
          id: '6',
          userId: '2',
          userName: 'سارة أحمد',
          userRole: 'مشرف',
          action: 'delete_message',
          description: 'حذف رسالة من محادثة فردية',
          type: 'message',
          severity: 'warning',
          timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
          metadata: { messageId: 'msg123', conversationType: 'individual' }
        },
        {
          id: '7',
          userId: 'system',
          userName: 'النظام',
          userRole: 'System',
          action: 'backup_completed',
          description: 'اكتمل النسخ الاحتياطي التلقائي',
          type: 'system',
          severity: 'success',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          metadata: { backupSize: '2.5GB', duration: '15 minutes' }
        },
        {
          id: '8',
          userId: '1',
          userName: 'أحمد محمد',
          userRole: 'مدير النظام',
          action: 'encryption_enabled',
          description: 'تفعيل تشفير الرسائل',
          type: 'security',
          severity: 'success',
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
        }
      ];

      setLogs(mockLogs);
    } catch (error) {
      console.error('Error fetching activity logs:', error);
      toast({
        title: "خطأ في تحميل السجلات",
        description: "فشل في تحميل سجل النشاط",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExportLogs = async () => {
    try {
      const exportData = {
        logs: filteredLogs,
        exported_at: new Date().toISOString(),
        exported_by: currentUserId,
        filters: {
          type: filterType,
          severity: filterSeverity,
          dateRange,
          searchQuery
        }
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `activity-logs-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "تم التصدير",
        description: "تم تصدير سجل النشاط بنجاح",
      });
    } catch (error) {
      console.error('Error exporting logs:', error);
      toast({
        title: "خطأ في التصدير",
        description: "فشل في تصدير سجل النشاط",
        variant: "destructive",
      });
    }
  };

  const handleClearLogs = async () => {
    if (!confirm('هل أنت متأكد من حذف جميع السجلات؟ لا يمكن التراجع عن هذا الإجراء.')) {
      return;
    }

    try {
      // حذف السجلات من قاعدة البيانات
      // await clearActivityLogs();
      
      setLogs([]);
      toast({
        title: "تم الحذف",
        description: "تم حذف جميع السجلات بنجاح",
      });
    } catch (error: any) {
      console.error('Error clearing logs:', error);
      toast({
        title: "خطأ في الحذف",
        description: error.message || "فشل في حذف السجلات",
        variant: "destructive",
      });
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'login':
      case 'logout':
        return <User className="w-4 h-4" />;
      case 'send_message':
      case 'delete_message':
      case 'edit_message':
        return <MessageSquare className="w-4 h-4" />;
      case 'create_group':
      case 'join_group':
      case 'leave_group':
        return <Users className="w-4 h-4" />;
      case 'update_permissions':
      case 'manage_users':
        return <Shield className="w-4 h-4" />;
      case 'encryption_enabled':
      case 'encryption_disabled':
        return <Lock className="w-4 h-4" />;
      case 'backup_completed':
      case 'system_maintenance':
        return <Settings className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'info':
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'success':
        return <CheckCircle className="w-4 h-4" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4" />;
      case 'error':
        return <XCircle className="w-4 h-4" />;
      case 'info':
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'message':
        return 'bg-blue-50 text-blue-700';
      case 'group':
        return 'bg-green-50 text-green-700';
      case 'user':
        return 'bg-purple-50 text-purple-700';
      case 'security':
        return 'bg-red-50 text-red-700';
      case 'system':
        return 'bg-gray-50 text-gray-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'الآن';
    if (diffInMinutes < 60) return `منذ ${diffInMinutes} دقيقة`;
    if (diffInMinutes < 1440) return `منذ ${Math.floor(diffInMinutes / 60)} ساعة`;
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // فلترة وترتيب السجلات
  const filteredLogs = logs
    .filter(log => {
      const matchesSearch = log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           log.action.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = filterType === 'all' || log.type === filterType;
      const matchesSeverity = filterSeverity === 'all' || log.severity === filterSeverity;
      
      let matchesDate = true;
      if (dateRange !== 'all') {
        const logDate = new Date(log.timestamp);
        const now = new Date();
        
        switch (dateRange) {
          case 'today':
            matchesDate = logDate.toDateString() === now.toDateString();
            break;
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            matchesDate = logDate >= weekAgo;
            break;
          case 'month':
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            matchesDate = logDate >= monthAgo;
            break;
        }
      }
      
      return matchesSearch && matchesType && matchesSeverity && matchesDate;
    })
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Activity className="w-5 h-5" />
            <span>سجل النشاط</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* شريط البحث والفلترة */}
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="البحث في السجلات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="text-sm border rounded px-2 py-1"
              >
                <option value="all">جميع الأنواع</option>
                <option value="message">رسائل</option>
                <option value="group">مجموعات</option>
                <option value="user">مستخدمين</option>
                <option value="security">أمان</option>
                <option value="system">نظام</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value as any)}
                className="text-sm border rounded px-2 py-1"
              >
                <option value="all">جميع المستويات</option>
                <option value="info">معلومات</option>
                <option value="warning">تحذير</option>
                <option value="error">خطأ</option>
                <option value="success">نجح</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as any)}
                className="text-sm border rounded px-2 py-1"
              >
                <option value="all">جميع الأوقات</option>
                <option value="today">اليوم</option>
                <option value="week">الأسبوع</option>
                <option value="month">الشهر</option>
              </select>
            </div>
          </div>

          {/* أزرار الإجراءات */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchActivityLogs}
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                تحديث
              </Button>
              <Badge variant="secondary">
                {filteredLogs.length} سجل
              </Badge>
            </div>
            
            {isCurrentUserAdmin && (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportLogs}
                >
                  <Download className="w-4 h-4 mr-2" />
                  تصدير
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearLogs}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  حذف الكل
                </Button>
              </div>
            )}
          </div>

          {/* قائمة السجلات */}
          <ScrollArea className="h-96">
            {loading ? (
              <div className="text-center text-gray-500 py-8">
                جاري تحميل السجلات...
              </div>
            ) : filteredLogs.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <Activity className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>لا توجد سجلات</p>
                {searchQuery && <p className="text-sm">جرب كلمات بحث مختلفة</p>}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredLogs.map((log) => (
                  <div
                    key={log.id}
                    className={`p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer ${
                      selectedLog?.id === log.id ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                    onClick={() => setSelectedLog(log)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        log.severity === 'success' ? 'bg-green-100 text-green-600' :
                        log.severity === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                        log.severity === 'error' ? 'bg-red-100 text-red-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {getActionIcon(log.action)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-sm">{log.userName}</span>
                            <Badge className={`text-xs ${getSeverityColor(log.severity)}`}>
                              {getSeverityIcon(log.severity)}
                            </Badge>
                            <Badge className={`text-xs ${getTypeColor(log.type)}`}>
                              {log.type === 'message' ? 'رسالة' :
                               log.type === 'group' ? 'مجموعة' :
                               log.type === 'user' ? 'مستخدم' :
                               log.type === 'security' ? 'أمان' : 'نظام'}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            <span>{formatTimestamp(log.timestamp)}</span>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-700">{log.description}</p>
                        
                        {log.ipAddress && (
                          <div className="flex items-center space-x-2 mt-1 text-xs text-gray-500">
                            <span>IP: {log.ipAddress}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* تفاصيل السجل المختار */}
          {selectedLog && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium">تفاصيل السجل</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedLog(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">المستخدم:</span>
                  <span className="font-medium mr-2">{selectedLog.userName}</span>
                </div>
                <div>
                  <span className="text-gray-600">الدور:</span>
                  <span className="font-medium mr-2">{selectedLog.userRole}</span>
                </div>
                <div>
                  <span className="text-gray-600">الإجراء:</span>
                  <span className="font-medium mr-2">{selectedLog.action}</span>
                </div>
                <div>
                  <span className="text-gray-600">النوع:</span>
                  <span className="font-medium mr-2">{selectedLog.type}</span>
                </div>
                <div>
                  <span className="text-gray-600">المستوى:</span>
                  <span className="font-medium mr-2">{selectedLog.severity}</span>
                </div>
                <div>
                  <span className="text-gray-600">التاريخ:</span>
                  <span className="font-medium mr-2">
                    {new Date(selectedLog.timestamp).toLocaleString('ar-EG')}
                  </span>
                </div>
                {selectedLog.ipAddress && (
                  <div>
                    <span className="text-gray-600">عنوان IP:</span>
                    <span className="font-medium mr-2">{selectedLog.ipAddress}</span>
                  </div>
                )}
                {selectedLog.metadata && (
                  <div className="col-span-2">
                    <span className="text-gray-600">بيانات إضافية:</span>
                    <pre className="text-xs bg-white p-2 rounded mt-1 overflow-auto">
                      {JSON.stringify(selectedLog.metadata, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            إغلاق
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ActivityLog; 