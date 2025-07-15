import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { 
  Shield, 
  User, 
  Users, 
  Settings, 
  Eye, 
  EyeOff,
  Lock,
  Unlock,
  Key,
  Check,
  X,
  AlertTriangle,
  Crown,
  UserCheck,
  UserX,
  MessageSquare,
  Search
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Permission {
  id: string;
  name: string;
  description: string;
  category: 'chat' | 'group' | 'admin' | 'security';
  enabled: boolean;
}

interface UserPermission {
  userId: string;
  userName: string;
  userRole: string;
  userAvatar?: string;
  permissions: Permission[];
  role: 'admin' | 'moderator' | 'member' | 'viewer';
}

interface PermissionManagerProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserId: string;
  isCurrentUserAdmin: boolean;
}

const PermissionManager: React.FC<PermissionManagerProps> = ({
  isOpen,
  onClose,
  currentUserId,
  isCurrentUserAdmin
}) => {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserPermission[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserPermission | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'admin' | 'moderator' | 'member' | 'viewer'>('all');

  // تعريف الصلاحيات المتاحة
  const availablePermissions: Permission[] = [
    // صلاحيات الشات
    {
      id: 'send_messages',
      name: 'إرسال رسائل',
      description: 'إمكانية إرسال رسائل نصية',
      category: 'chat',
      enabled: true
    },
    {
      id: 'send_files',
      name: 'إرسال ملفات',
      description: 'إمكانية إرسال ملفات وصور',
      category: 'chat',
      enabled: true
    },
    {
      id: 'send_voice',
      name: 'رسائل صوتية',
      description: 'إمكانية إرسال رسائل صوتية',
      category: 'chat',
      enabled: true
    },
    {
      id: 'delete_messages',
      name: 'حذف رسائل',
      description: 'إمكانية حذف الرسائل',
      category: 'chat',
      enabled: false
    },
    {
      id: 'edit_messages',
      name: 'تعديل رسائل',
      description: 'إمكانية تعديل الرسائل المرسلة',
      category: 'chat',
      enabled: false
    },

    // صلاحيات المجموعات
    {
      id: 'create_groups',
      name: 'إنشاء مجموعات',
      description: 'إمكانية إنشاء مجموعات جديدة',
      category: 'group',
      enabled: false
    },
    {
      id: 'manage_groups',
      name: 'إدارة المجموعات',
      description: 'إدارة المجموعات الموجودة',
      category: 'group',
      enabled: false
    },
    {
      id: 'add_members',
      name: 'إضافة أعضاء',
      description: 'إضافة أعضاء للمجموعات',
      category: 'group',
      enabled: false
    },
    {
      id: 'remove_members',
      name: 'إزالة أعضاء',
      description: 'إزالة أعضاء من المجموعات',
      category: 'group',
      enabled: false
    },

    // صلاحيات الإدارة
    {
      id: 'view_all_messages',
      name: 'عرض جميع الرسائل',
      description: 'عرض جميع الرسائل في النظام',
      category: 'admin',
      enabled: false
    },
    {
      id: 'manage_users',
      name: 'إدارة المستخدمين',
      description: 'إدارة حسابات المستخدمين',
      category: 'admin',
      enabled: false
    },
    {
      id: 'manage_permissions',
      name: 'إدارة الصلاحيات',
      description: 'إدارة صلاحيات المستخدمين',
      category: 'admin',
      enabled: false
    },
    {
      id: 'view_logs',
      name: 'عرض السجلات',
      description: 'عرض سجلات النظام',
      category: 'admin',
      enabled: false
    },

    // صلاحيات الأمان
    {
      id: 'encrypt_messages',
      name: 'تشفير الرسائل',
      description: 'تشفير الرسائل المرسلة',
      category: 'security',
      enabled: true
    },
    {
      id: 'two_factor_auth',
      name: 'المصادقة الثنائية',
      description: 'تفعيل المصادقة الثنائية',
      category: 'security',
      enabled: false
    },
    {
      id: 'session_management',
      name: 'إدارة الجلسات',
      description: 'إدارة جلسات المستخدمين',
      category: 'security',
      enabled: false
    }
  ];

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // محاكاة جلب المستخدمين من قاعدة البيانات
      const mockUsers: UserPermission[] = [
        {
          userId: '1',
          userName: 'أحمد محمد',
          userRole: 'مدير النظام',
          userAvatar: '',
          role: 'admin',
          permissions: availablePermissions.map(p => ({ ...p, enabled: true }))
        },
        {
          userId: '2',
          userName: 'سارة أحمد',
          userRole: 'مشرف',
          userAvatar: '',
          role: 'moderator',
          permissions: availablePermissions.map(p => ({ 
            ...p, 
            enabled: ['send_messages', 'send_files', 'send_voice', 'manage_groups', 'add_members'].includes(p.id)
          }))
        },
        {
          userId: '3',
          userName: 'محمد علي',
          userRole: 'معالج',
          userAvatar: '',
          role: 'member',
          permissions: availablePermissions.map(p => ({ 
            ...p, 
            enabled: ['send_messages', 'send_files', 'send_voice', 'encrypt_messages'].includes(p.id)
          }))
        },
        {
          userId: '4',
          userName: 'فاطمة حسن',
          userRole: 'مراقب',
          userAvatar: '',
          role: 'viewer',
          permissions: availablePermissions.map(p => ({ 
            ...p, 
            enabled: ['send_messages', 'encrypt_messages'].includes(p.id)
          }))
        }
      ];

      setUsers(mockUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "خطأ في تحميل المستخدمين",
        description: "فشل في تحميل قائمة المستخدمين",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionToggle = async (userId: string, permissionId: string, enabled: boolean) => {
    try {
      // تحديث الصلاحية في قاعدة البيانات
      // await updateUserPermission(userId, permissionId, enabled);
      
      setUsers(prev => 
        prev.map(user => 
          user.userId === userId 
            ? {
                ...user,
                permissions: user.permissions.map(p => 
                  p.id === permissionId ? { ...p, enabled } : p
                )
              }
            : user
        )
      );

      toast({
        title: "تم تحديث الصلاحية",
        description: `تم ${enabled ? 'تفعيل' : 'إلغاء'} الصلاحية بنجاح`,
      });
    } catch (error: any) {
      console.error('Error updating permission:', error);
      toast({
        title: "خطأ في تحديث الصلاحية",
        description: error.message || "فشل في تحديث الصلاحية",
        variant: "destructive",
      });
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      // تحديث دور المستخدم في قاعدة البيانات
      // await updateUserRole(userId, newRole);
      
      setUsers(prev => 
        prev.map(user => 
          user.userId === userId 
            ? { ...user, role: newRole as any }
            : user
        )
      );

      toast({
        title: "تم تحديث الدور",
        description: "تم تحديث دور المستخدم بنجاح",
      });
    } catch (error: any) {
      console.error('Error updating role:', error);
      toast({
        title: "خطأ في تحديث الدور",
        description: error.message || "فشل في تحديث دور المستخدم",
        variant: "destructive",
      });
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'moderator':
        return 'bg-orange-100 text-orange-800';
      case 'member':
        return 'bg-blue-100 text-blue-800';
      case 'viewer':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown className="w-4 h-4" />;
      case 'moderator':
        return <Shield className="w-4 h-4" />;
      case 'member':
        return <UserCheck className="w-4 h-4" />;
      case 'viewer':
        return <Eye className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'chat':
        return <MessageSquare className="w-4 h-4" />;
      case 'group':
        return <Users className="w-4 h-4" />;
      case 'admin':
        return <Settings className="w-4 h-4" />;
      case 'security':
        return <Lock className="w-4 h-4" />;
      default:
        return <Key className="w-4 h-4" />;
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.userRole.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const canManageUser = (user: UserPermission) => {
    if (!isCurrentUserAdmin) return false;
    if (user.userId === currentUserId) return false; // لا يمكن إدارة نفسه
    return true;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>إدارة الصلاحيات</span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex h-[600px]">
          {/* قائمة المستخدمين */}
          <div className="w-1/3 border-l p-4">
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="البحث في المستخدمين..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>

            <div className="mb-4">
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value as any)}
                className="w-full text-sm border rounded px-2 py-1"
              >
                <option value="all">جميع الأدوار</option>
                <option value="admin">مدير</option>
                <option value="moderator">مشرف</option>
                <option value="member">عضو</option>
                <option value="viewer">مراقب</option>
              </select>
            </div>

            <ScrollArea className="h-[450px]">
              {loading ? (
                <div className="text-center text-gray-500 py-8">
                  جاري تحميل المستخدمين...
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <User className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>لا يوجد مستخدمون</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.userId}
                      className={`p-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedUser?.userId === user.userId ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                      }`}
                      onClick={() => setSelectedUser(user)}
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={user.userAvatar} />
                          <AvatarFallback>{user.userName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-sm">{user.userName}</h3>
                            <Badge className={`text-xs ${getRoleColor(user.role)}`}>
                              {getRoleIcon(user.role)}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600">{user.userRole}</p>
                          <div className="flex items-center space-x-1 mt-1">
                            <span className="text-xs text-gray-500">
                              {user.permissions.filter(p => p.enabled).length} صلاحية
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>

          {/* تفاصيل الصلاحيات */}
          <div className="flex-1 p-4">
            {selectedUser ? (
              <div className="space-y-6">
                {/* معلومات المستخدم */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={selectedUser.userAvatar} />
                        <AvatarFallback>{selectedUser.userName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="text-lg font-semibold">{selectedUser.userName}</h2>
                        <p className="text-gray-600">{selectedUser.userRole}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className={getRoleColor(selectedUser.role)}>
                            {getRoleIcon(selectedUser.role)}
                            <span className="mr-1">
                              {selectedUser.role === 'admin' ? 'مدير' :
                               selectedUser.role === 'moderator' ? 'مشرف' :
                               selectedUser.role === 'member' ? 'عضو' : 'مراقب'}
                            </span>
                          </Badge>
                        </div>
                      </div>
                    </div>
                    {canManageUser(selectedUser) && (
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="role-select">تغيير الدور:</Label>
                        <Select
                          value={selectedUser.role}
                          onValueChange={(value) => handleRoleChange(selectedUser.userId, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">مدير</SelectItem>
                            <SelectItem value="moderator">مشرف</SelectItem>
                            <SelectItem value="member">عضو</SelectItem>
                            <SelectItem value="viewer">مراقب</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                </div>

                {/* الصلاحيات */}
                <div>
                  <h3 className="text-lg font-medium mb-4">الصلاحيات</h3>
                  <div className="space-y-4">
                    {['chat', 'group', 'admin', 'security'].map(category => (
                      <div key={category} className="border rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-3">
                          {getCategoryIcon(category)}
                          <h4 className="font-medium">
                            {category === 'chat' ? 'صلاحيات الشات' :
                             category === 'group' ? 'صلاحيات المجموعات' :
                             category === 'admin' ? 'صلاحيات الإدارة' : 'صلاحيات الأمان'}
                          </h4>
                        </div>
                        <div className="space-y-3">
                          {selectedUser.permissions
                            .filter(p => p.category === category)
                            .map(permission => (
                              <div key={permission.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                                <div className="flex-1">
                                  <div className="font-medium text-sm">{permission.name}</div>
                                  <div className="text-xs text-gray-600">{permission.description}</div>
                                </div>
                                {canManageUser(selectedUser) ? (
                                  <Switch
                                    checked={permission.enabled}
                                    onCheckedChange={(enabled) => 
                                      handlePermissionToggle(selectedUser.userId, permission.id, enabled)
                                    }
                                  />
                                ) : (
                                  <div className="flex items-center space-x-1">
                                    {permission.enabled ? (
                                      <Check className="w-4 h-4 text-green-600" />
                                    ) : (
                                      <X className="w-4 h-4 text-red-600" />
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ملخص الصلاحيات */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">ملخص الصلاحيات</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">الصلاحيات المفعلة:</span>
                      <span className="font-medium mr-2">
                        {selectedUser.permissions.filter(p => p.enabled).length}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">إجمالي الصلاحيات:</span>
                      <span className="font-medium mr-2">
                        {selectedUser.permissions.length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-500">
                  <Shield className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">اختر مستخدم</h3>
                  <p>اختر مستخدم من القائمة لعرض وإدارة صلاحياته</p>
                </div>
              </div>
            )}
          </div>
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

export default PermissionManager; 