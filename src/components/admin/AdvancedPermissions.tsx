import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Shield, 
  Users, 
  Settings, 
  Plus,
  Trash2,
  Edit,
  Brain,
  UserPlus,
  Bot,
  FileText,
  Calendar,
  Heart,
  MessageSquare,
  Download,
  Key,
  Send
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
  enabled: boolean;
  level: 'basic' | 'advanced' | 'admin';
  icon: React.ComponentType<any>;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  users: number;
  color: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  permissions: string[];
}

const AdvancedPermissions = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('roles');
  const [editingRole, setEditingRole] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingRoleData, setEditingRoleData] = useState<Role | null>(null);
  
  // نظام إدارة حالة حقيقي
  const [roles, setRoles] = useState<Role[]>([
    {
      id: 'admin',
      name: 'مدير النظام',
      description: 'صلاحيات كاملة على النظام',
      permissions: ['patients.view', 'patients.create', 'patients.edit', 'patients.delete', 'sessions.view', 'sessions.create', 'sessions.edit', 'sessions.delete', 'ai.sessions', 'ai.treatment', 'ai.assistant', 'reports.view', 'reports.create', 'reports.export', 'staff.view', 'staff.manage', 'communication.view', 'communication.send', 'admin.settings', 'admin.permissions'],
      users: 1,
      color: 'bg-red-500'
    },
    {
      id: 'therapist',
      name: 'معالج نفسي',
      description: 'معالج نفسي متخصص',
      permissions: ['patients.view', 'patients.create', 'patients.edit', 'sessions.view', 'sessions.create', 'sessions.edit', 'ai.sessions', 'ai.treatment', 'ai.assistant', 'reports.view', 'reports.create', 'communication.view', 'communication.send'],
      users: 3,
      color: 'bg-blue-500'
    },
    {
      id: 'supervisor',
      name: 'مشرف',
      description: 'مشرف على المعالجين والمرضى',
      permissions: ['patients.view', 'patients.create', 'patients.edit', 'sessions.view', 'sessions.create', 'sessions.edit', 'ai.sessions', 'ai.treatment', 'ai.assistant', 'reports.view', 'reports.create', 'reports.export', 'staff.view', 'communication.view', 'communication.send'],
      users: 2,
      color: 'bg-green-500'
    },
    {
      id: 'assistant',
      name: 'مساعد',
      description: 'مساعد إداري',
      permissions: ['patients.view', 'sessions.view', 'reports.view', 'communication.view'],
      users: 2,
      color: 'bg-purple-500'
    }
  ]);

  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'أحمد محمد',
      email: 'ahmed@shifacare.com',
      role: 'admin',
      status: 'active',
      lastLogin: '2024-12-20 10:30',
      permissions: ['patients.view', 'patients.create', 'patients.edit', 'patients.delete', 'sessions.view', 'sessions.create', 'sessions.edit', 'sessions.delete', 'ai.sessions', 'ai.treatment', 'ai.assistant', 'reports.view', 'reports.create', 'reports.export', 'staff.view', 'staff.manage', 'communication.view', 'communication.send', 'admin.settings', 'admin.permissions']
    },
    {
      id: '2',
      name: 'سارة أحمد',
      email: 'sara@shifacare.com',
      role: 'therapist',
      status: 'active',
      lastLogin: '2024-12-20 09:15',
      permissions: ['patients.view', 'patients.create', 'patients.edit', 'sessions.view', 'sessions.create', 'sessions.edit', 'ai.sessions', 'ai.treatment', 'ai.assistant', 'reports.view', 'reports.create', 'communication.view', 'communication.send']
    },
    {
      id: '3',
      name: 'محمد علي',
      email: 'mohamed@shifacare.com',
      role: 'supervisor',
      status: 'active',
      lastLogin: '2024-12-20 08:45',
      permissions: ['patients.view', 'patients.create', 'patients.edit', 'sessions.view', 'sessions.create', 'sessions.edit', 'ai.sessions', 'ai.treatment', 'ai.assistant', 'reports.view', 'reports.create', 'reports.export', 'staff.view', 'communication.view', 'communication.send']
    },
    {
      id: '4',
      name: 'فاطمة حسن',
      email: 'fatima@shifacare.com',
      role: 'assistant',
      status: 'active',
      lastLogin: '2024-12-20 08:30',
      permissions: ['patients.view', 'sessions.view', 'reports.view', 'communication.view']
    }
  ]);

  // إضافة console.log للتأكد من تحميل المكون
  console.log('AdvancedPermissions component loaded successfully');

  // حفظ البيانات في localStorage
  const saveToLocalStorage = (data: any, key: string) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  // تحميل البيانات من localStorage
  const loadFromLocalStorage = (key: string, defaultValue: any) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return defaultValue;
    }
  };

  // تحميل البيانات المحفوظة عند بدء التطبيق
  React.useEffect(() => {
    const savedRoles = loadFromLocalStorage('shifacare_roles', roles);
    const savedUsers = loadFromLocalStorage('shifacare_users', users);
    
    if (savedRoles.length > 0) {
      setRoles(savedRoles);
    }
    if (savedUsers.length > 0) {
      setUsers(savedUsers);
    }
    
    toast({
      title: "تم تحميل الصفحة",
      description: "صفحة إدارة الصلاحيات المتقدمة جاهزة",
    });
  }, [toast]);

  // حفظ البيانات عند تغييرها
  React.useEffect(() => {
    saveToLocalStorage(roles, 'shifacare_roles');
  }, [roles]);

  React.useEffect(() => {
    saveToLocalStorage(users, 'shifacare_users');
  }, [users]);

  // الصلاحيات المتاحة
  const availablePermissions: Permission[] = [
    // إدارة المرضى
    {
      id: 'patients.view',
      name: 'عرض المرضى',
      description: 'إمكانية عرض قائمة المرضى',
      category: 'المرضى',
      enabled: true,
      level: 'basic',
      icon: Users
    },
    {
      id: 'patients.create',
      name: 'إضافة مرضى',
      description: 'إمكانية إضافة مرضى جدد',
      category: 'المرضى',
      enabled: true,
      level: 'basic',
      icon: UserPlus
    },
    {
      id: 'patients.edit',
      name: 'تعديل المرضى',
      description: 'إمكانية تعديل بيانات المرضى',
      category: 'المرضى',
      enabled: true,
      level: 'advanced',
      icon: Edit
    },
    {
      id: 'patients.delete',
      name: 'حذف المرضى',
      description: 'إمكانية حذف المرضى',
      category: 'المرضى',
      enabled: true,
      level: 'admin',
      icon: Trash2
    },

    // إدارة الجلسات
    {
      id: 'sessions.view',
      name: 'عرض الجلسات',
      description: 'إمكانية عرض الجلسات العلاجية',
      category: 'الجلسات',
      enabled: true,
      level: 'basic',
      icon: Calendar
    },
    {
      id: 'sessions.create',
      name: 'إنشاء جلسات',
      description: 'إمكانية إنشاء جلسات جديدة',
      category: 'الجلسات',
      enabled: true,
      level: 'advanced',
      icon: Plus
    },
    {
      id: 'sessions.edit',
      name: 'تعديل الجلسات',
      description: 'إمكانية تعديل الجلسات',
      category: 'الجلسات',
      enabled: true,
      level: 'advanced',
      icon: Edit
    },
    {
      id: 'sessions.delete',
      name: 'حذف الجلسات',
      description: 'إمكانية حذف الجلسات',
      category: 'الجلسات',
      enabled: true,
      level: 'admin',
      icon: Trash2
    },

    // الذكاء الاصطناعي
    {
      id: 'ai.sessions',
      name: 'جلسات الذكاء الاصطناعي',
      description: 'إمكانية استخدام جلسات الذكاء الاصطناعي',
      category: 'الذكاء الاصطناعي',
      enabled: true,
      level: 'advanced',
      icon: Brain
    },
    {
      id: 'ai.treatment',
      name: 'العلاج بالذكاء الاصطناعي',
      description: 'إمكانية استخدام العلاج الذكي',
      category: 'الذكاء الاصطناعي',
      enabled: true,
      level: 'advanced',
      icon: Heart
    },
    {
      id: 'ai.assistant',
      name: 'المساعد الذكي',
      description: 'إمكانية استخدام المساعد الذكي',
      category: 'الذكاء الاصطناعي',
      enabled: true,
      level: 'basic',
      icon: Bot
    },

    // التقارير
    {
      id: 'reports.view',
      name: 'عرض التقارير',
      description: 'إمكانية عرض التقارير',
      category: 'التقارير',
      enabled: true,
      level: 'basic',
      icon: FileText
    },
    {
      id: 'reports.create',
      name: 'إنشاء تقارير',
      description: 'إمكانية إنشاء تقارير جديدة',
      category: 'التقارير',
      enabled: true,
      level: 'advanced',
      icon: Plus
    },
    {
      id: 'reports.export',
      name: 'تصدير التقارير',
      description: 'إمكانية تصدير التقارير',
      category: 'التقارير',
      enabled: true,
      level: 'advanced',
      icon: Download
    },

    // إدارة الموظفين
    {
      id: 'staff.view',
      name: 'عرض الموظفين',
      description: 'إمكانية عرض قائمة الموظفين',
      category: 'الموظفين',
      enabled: true,
      level: 'basic',
      icon: Users
    },
    {
      id: 'staff.manage',
      name: 'إدارة الموظفين',
      description: 'إمكانية إدارة الموظفين والورديات',
      category: 'الموظفين',
      enabled: true,
      level: 'admin',
      icon: Settings
    },

    // التواصل مع الأسر
    {
      id: 'communication.view',
      name: 'عرض الرسائل',
      description: 'إمكانية عرض الرسائل مع الأسر',
      category: 'التواصل',
      enabled: true,
      level: 'basic',
      icon: MessageSquare
    },
    {
      id: 'communication.send',
      name: 'إرسال رسائل',
      description: 'إمكانية إرسال رسائل للأسر',
      category: 'التواصل',
      enabled: true,
      level: 'advanced',
      icon: Send
    },

    // الإدارة
    {
      id: 'admin.system',
      name: 'إدارة النظام',
      description: 'إمكانية إدارة إعدادات النظام',
      category: 'الإدارة',
      enabled: true,
      level: 'admin',
      icon: Settings
    },
    {
      id: 'admin.users',
      name: 'إدارة المستخدمين',
      description: 'إمكانية إدارة المستخدمين والصلاحيات',
      category: 'الإدارة',
      enabled: true,
      level: 'admin',
      icon: Shield
    },
    {
      id: 'admin.permissions',
      name: 'إدارة الصلاحيات',
      description: 'إمكانية إدارة الصلاحيات والأدوار',
      category: 'الإدارة',
      enabled: true,
      level: 'admin',
      icon: Key
    }
  ];



  const getPermissionIcon = (permissionId: string) => {
    const permission = availablePermissions.find(p => p.id === permissionId);
    return permission ? permission.icon : Settings;
  };

  const getPermissionName = (permissionId: string) => {
    const permission = availablePermissions.find(p => p.id === permissionId);
    return permission ? permission.name : permissionId;
  };

  const getPermissionLevel = (permissionId: string) => {
    const permission = availablePermissions.find(p => p.id === permissionId);
    return permission ? permission.level : 'basic';
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'basic': return 'bg-green-100 text-green-800';
      case 'advanced': return 'bg-blue-100 text-blue-800';
      case 'admin': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case 'basic': return 'أساسي';
      case 'advanced': return 'متقدم';
      case 'admin': return 'مدير';
      default: return 'غير محدد';
    }
  };

  const handleRolePermissionToggle = (roleId: string, permissionId: string) => {
    setRoles(prev => prev.map(role => {
      if (role.id === roleId) {
        const hasPermission = role.permissions.includes(permissionId);
        const newPermissions = hasPermission 
          ? role.permissions.filter(p => p !== permissionId)
          : [...role.permissions, permissionId];
        
        // تحديث عدد المستخدمين لهذا الدور
        const usersWithRole = users.filter(user => user.role === roleId).length;
        
        toast({
          title: hasPermission ? "إلغاء الصلاحية" : "منح الصلاحية",
          description: `${hasPermission ? 'تم إلغاء' : 'تم منح'} صلاحية "${getPermissionName(permissionId)}" للدور "${role.name}"`,
        });

        return {
          ...role,
          permissions: newPermissions,
          users: usersWithRole
        };
      }
      return role;
    }));
  };

  const handleUserRoleChange = (userId: string, newRole: string) => {
    const role = roles.find(r => r.id === newRole);
    if (role) {
      setUsers(prev => prev.map(user => {
        if (user.id === userId) {
          // تحديث صلاحيات المستخدم بناءً على الدور الجديد
          const updatedUser = {
            ...user,
            role: newRole,
            permissions: role.permissions
          };
          
          toast({
            title: "تغيير دور المستخدم",
            description: `تم تغيير دور "${user.name}" إلى "${role.name}"`,
          });
          
          return updatedUser;
        }
        return user;
      }));
      
      // تحديث عدد المستخدمين في الأدوار
      setRoles(prev => prev.map(r => ({
        ...r,
        users: users.filter(u => u.role === r.id).length
      })));
    }
  };

  const handleUserStatusChange = (userId: string, newStatus: string) => {
    setUsers(prev => prev.map(user => {
      if (user.id === userId) {
        const statusText = getStatusText(newStatus);
        toast({
          title: "تغيير حالة المستخدم",
          description: `تم تغيير حالة "${user.name}" إلى "${statusText}"`,
        });
        
        return {
          ...user,
          status: newStatus as 'active' | 'inactive' | 'suspended'
        };
      }
      return user;
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'نشط';
      case 'inactive': return 'غير نشط';
      case 'suspended': return 'معلق';
      default: return 'غير محدد';
    }
  };

  // وظائف نافذة تعديل الدور
  const handleEditRole = (role: Role) => {
    setEditingRoleData(role);
    setIsEditDialogOpen(true);
  };

  const handleSaveRole = () => {
    if (editingRoleData) {
      // تحديث الدور في القائمة
      setRoles(prev => prev.map(role => {
        if (role.id === editingRoleData.id) {
          return {
            ...editingRoleData,
            users: users.filter(u => u.role === role.id).length
          };
        }
        return role;
      }));
      
      // تحديث صلاحيات جميع المستخدمين الذين لديهم هذا الدور
      setUsers(prev => prev.map(user => {
        if (user.role === editingRoleData.id) {
          return {
            ...user,
            permissions: editingRoleData.permissions
          };
        }
        return user;
      }));
      
      toast({
        title: "تم حفظ الدور",
        description: `تم تحديث دور "${editingRoleData.name}" وتم تحديث صلاحيات ${users.filter(u => u.role === editingRoleData.id).length} مستخدم`,
      });
      
      setIsEditDialogOpen(false);
      setEditingRoleData(null);
    }
  };

  const handleCancelEdit = () => {
    setIsEditDialogOpen(false);
    setEditingRoleData(null);
  };

  // وظائف إضافية حقيقية
  const handleAddNewRole = () => {
    const newRole: Role = {
      id: `role-${Date.now()}`,
      name: 'دور جديد',
      description: 'وصف الدور الجديد',
      permissions: [],
      users: 0,
      color: 'bg-blue-500'
    };
    
    setRoles(prev => [...prev, newRole]);
    setEditingRoleData(newRole);
    setIsEditDialogOpen(true);
    
    toast({
      title: "إضافة دور جديد",
      description: "تم إنشاء دور جديد، يمكنك الآن تخصيصه",
    });
  };

  const handleDeleteRole = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    if (role && role.users > 0) {
      toast({
        title: "لا يمكن حذف الدور",
        description: `لا يمكن حذف الدور "${role.name}" لأنه يحتوي على ${role.users} مستخدم`,
        variant: "destructive",
      });
      return;
    }
    
    setRoles(prev => prev.filter(r => r.id !== roleId));
    toast({
      title: "تم حذف الدور",
      description: `تم حذف الدور "${role?.name}" بنجاح`,
    });
  };

  const handleAddNewUser = () => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: 'مستخدم جديد',
      email: 'newuser@shifacare.com',
      role: 'assistant',
      status: 'active',
      lastLogin: new Date().toLocaleString('ar-EG'),
      permissions: roles.find(r => r.id === 'assistant')?.permissions || []
    };
    
    setUsers(prev => [...prev, newUser]);
    
    // تحديث عدد المستخدمين في الدور
    setRoles(prev => prev.map(r => ({
      ...r,
      users: users.filter(u => u.role === r.id).length + (r.id === 'assistant' ? 1 : 0)
    })));
    
    toast({
      title: "إضافة مستخدم جديد",
      description: "تم إضافة مستخدم جديد بنجاح",
    });
  };

  const groupedPermissions = availablePermissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <div className="min-h-screen bg-white p-8" style={{ fontFamily: 'Cairo, sans-serif', direction: 'rtl' }}>
      {/* Test Element للتأكد من التحميل */}
      <div className="bg-green-100 border-4 border-green-400 text-green-700 px-6 py-4 rounded-lg mb-6 text-center text-xl font-bold">
        ✅ تم تحميل صفحة إدارة الصلاحيات المتقدمة بنجاح
      </div>
      
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">إدارة الصلاحيات المتقدمة</h1>
        <p className="text-gray-600 text-lg">إدارة الأدوار والصلاحيات والمستخدمين</p>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-gray-100 p-1 rounded-lg">
          <TabsTrigger value="roles" className="bg-white rounded-md">الأدوار</TabsTrigger>
          <TabsTrigger value="users" className="bg-white rounded-md">المستخدمين</TabsTrigger>
          <TabsTrigger value="permissions" className="bg-white rounded-md">الصلاحيات</TabsTrigger>
          <TabsTrigger value="logs" className="bg-white rounded-md">سجل النشاط</TabsTrigger>
        </TabsList>

        {/* الأدوار */}
        <TabsContent value="roles" className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <h2 className="text-2xl font-bold text-blue-800 mb-2">قسم الأدوار</h2>
            <p className="text-blue-600">هذا القسم يعرض الأدوار المتاحة في النظام</p>
          </div>
          
          {/* Test Section */}
          <div className="bg-yellow-50 border-2 border-yellow-400 p-4 rounded-lg mb-4">
            <h3 className="text-lg font-bold text-yellow-800 mb-2">اختبار النظام</h3>
            <p className="text-yellow-700 mb-2">عدد الأدوار المتاحة: {roles.length}</p>
            <p className="text-yellow-700 mb-2">عدد المستخدمين: {users.length}</p>
            <p className="text-yellow-700">عدد الصلاحيات: {availablePermissions.length}</p>
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">الأدوار المتاحة ({roles.length})</h3>
            <Button onClick={handleAddNewRole} className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              إضافة دور جديد
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roles.map((role) => (
              <Card key={role.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <div className={`w-8 h-8 rounded-full ${role.color} flex items-center justify-center mr-3`}>
                        <Shield className="w-4 h-4 text-white" />
                      </div>
                      {role.name}
                    </CardTitle>
                    <Badge className={getLevelColor(role.permissions.some(p => getPermissionLevel(p) === 'admin') ? 'admin' : 'advanced')}>
                      {getLevelText(role.permissions.some(p => getPermissionLevel(p) === 'admin') ? 'admin' : 'advanced')}
                    </Badge>
                  </div>
                  <p className="text-gray-600 text-sm">{role.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">{role.permissions.length} صلاحية</span>
                    <span className="text-gray-500">{role.users} مستخدم</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">الصلاحيات الممنوحة:</h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {role.permissions.slice(0, 5).map((permissionId) => {
                        const Icon = getPermissionIcon(permissionId);
                        return (
                          <div key={permissionId} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div className="flex items-center">
                              <Icon className="w-4 h-4 text-gray-600 mr-2" />
                              <span className="text-sm">{getPermissionName(permissionId)}</span>
                            </div>
                            <Badge className={getLevelColor(getPermissionLevel(permissionId))} variant="outline">
                              {getLevelText(getPermissionLevel(permissionId))}
                            </Badge>
                          </div>
                        );
                      })}
                      {role.permissions.length > 5 && (
                        <div className="text-center text-sm text-gray-500">
                          +{role.permissions.length - 5} صلاحية أخرى
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-2 space-x-reverse">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => handleEditRole(role)}
                      >
                        تعديل الدور
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteRole(role.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        disabled={role.users > 0}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>


        </TabsContent>

        {/* المستخدمين */}
        <TabsContent value="users" className="space-y-6">
          <div className="bg-green-50 p-4 rounded-lg mb-4">
            <h2 className="text-2xl font-bold text-green-800 mb-2">قسم المستخدمين</h2>
            <p className="text-green-600">هذا القسم يعرض المستخدمين في النظام</p>
          </div>
          
          {/* Test Section */}
          <div className="bg-purple-50 border-2 border-purple-400 p-4 rounded-lg mb-4">
            <h3 className="text-lg font-bold text-purple-800 mb-2">اختبار المستخدمين</h3>
            <p className="text-purple-700 mb-2">إجمالي المستخدمين: {users.length}</p>
            <p className="text-purple-700 mb-2">المستخدمين النشطين: {users.filter(u => u.status === 'active').length}</p>
            <p className="text-purple-700">المستخدمين المعلقين: {users.filter(u => u.status === 'suspended').length}</p>
          </div>
          
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>إدارة المستخدمين</CardTitle>
                <Button onClick={handleAddNewUser} className="bg-blue-600 hover:bg-blue-700">
                  <UserPlus className="w-4 h-4 mr-2" />
                  إضافة مستخدم جديد
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4 space-x-reverse">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                        <div className="text-xs text-gray-400">آخر دخول: {user.lastLogin}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <Select
                        value={user.role}
                        onValueChange={(value) => handleUserRoleChange(user.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.map((role) => (
                            <SelectItem key={role.id} value={role.id}>
                              {role.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <Select
                        value={user.status}
                        onValueChange={(value) => handleUserStatusChange(user.id, value)}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">نشط</SelectItem>
                          <SelectItem value="inactive">غير نشط</SelectItem>
                          <SelectItem value="suspended">معلق</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Badge className={getStatusColor(user.status)}>
                        {getStatusText(user.status)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* الصلاحيات */}
        <TabsContent value="permissions" className="space-y-6">
          <div className="bg-orange-50 p-4 rounded-lg mb-4">
            <h2 className="text-2xl font-bold text-orange-800 mb-2">قسم الصلاحيات</h2>
            <p className="text-orange-600">هذا القسم يعرض الصلاحيات المتاحة في النظام</p>
          </div>
          
          {/* Test Section */}
          <div className="bg-red-50 border-2 border-red-400 p-4 rounded-lg mb-4">
            <h3 className="text-lg font-bold text-red-800 mb-2">اختبار الصلاحيات</h3>
            <p className="text-red-700 mb-2">إجمالي الصلاحيات: {availablePermissions.length}</p>
            <p className="text-red-700 mb-2">الصلاحيات الأساسية: {availablePermissions.filter(p => p.level === 'basic').length}</p>
            <p className="text-red-700 mb-2">الصلاحيات المتقدمة: {availablePermissions.filter(p => p.level === 'advanced').length}</p>
            <p className="text-red-700">صلاحيات المدير: {availablePermissions.filter(p => p.level === 'admin').length}</p>
          </div>
          
          <div className="space-y-6">
            {Object.entries(groupedPermissions).map(([category, permissions]) => (
              <Card key={category}>
                <CardHeader>
                  <CardTitle>{category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {permissions.map((permission) => {
                      const Icon = permission.icon;
                      return (
                        <div key={permission.id} className="p-4 border rounded-lg">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center">
                              <Icon className="w-5 h-5 text-gray-600 mr-2" />
                              <div>
                                <div className="font-semibold">{permission.name}</div>
                              </div>
                            </div>
                            <Badge className={getLevelColor(permission.level)}>
                              {getLevelText(permission.level)}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">المستخدمون المصرح لهم:</span>
                            <span className="font-semibold">
                              {users.filter(user => user.permissions.includes(permission.id)).length}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* سجل النشاط */}
        <TabsContent value="logs" className="space-y-6">
          <div className="bg-indigo-50 p-4 rounded-lg mb-4">
            <h2 className="text-2xl font-bold text-indigo-800 mb-2">قسم سجل النشاط</h2>
            <p className="text-indigo-600">هذا القسم يعرض سجل النشاط في النظام</p>
          </div>
          
          {/* Test Section */}
          <div className="bg-teal-50 border-2 border-teal-400 p-4 rounded-lg mb-4">
            <h3 className="text-lg font-bold text-teal-800 mb-2">اختبار سجل النشاط</h3>
            <p className="text-teal-700 mb-2">تم تحميل صفحة إدارة الصلاحيات المتقدمة بنجاح</p>
            <p className="text-teal-700 mb-2">الوقت الحالي: {new Date().toLocaleString('ar-EG')}</p>
            <p className="text-teal-700">حالة النظام: نشط ✅</p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>سجل النشاط</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    user: 'أحمد محمد',
                    action: 'تعديل صلاحيات الدور: معالج نفسي',
                    time: '2024-12-20 10:30',
                    type: 'edit'
                  },
                  {
                    user: 'سارة أحمد',
                    action: 'تسجيل دخول جديد',
                    time: '2024-12-20 09:15',
                    type: 'login'
                  },
                  {
                    user: 'محمد علي',
                    action: 'إضافة مستخدم جديد',
                    time: '2024-12-20 08:45',
                    type: 'create'
                  },
                  {
                    user: 'أحمد محمد',
                    action: 'تغيير دور المستخدم: سارة أحمد',
                    time: '2024-12-20 08:30',
                    type: 'role'
                  }
                ].map((log, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        log.type === 'edit' ? 'bg-blue-100 text-blue-600' :
                        log.type === 'login' ? 'bg-green-100 text-green-600' :
                        log.type === 'create' ? 'bg-purple-100 text-purple-600' :
                        'bg-orange-100 text-orange-600'
                      }`}>
                        {log.type === 'edit' ? <Edit className="w-4 h-4" /> :
                         log.type === 'login' ? <Settings className="w-4 h-4" /> :
                         log.type === 'create' ? <UserPlus className="w-4 h-4" /> :
                         <Settings className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="font-semibold">{log.user}</div>
                        <div className="text-sm text-gray-500">{log.action}</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-400">{log.time}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* نافذة تعديل الدور */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Edit className="w-5 h-5 mr-2" />
              تعديل الدور: {editingRoleData?.name}
            </DialogTitle>
            <DialogDescription>
              يمكنك تعديل معلومات الدور والصلاحيات الممنوحة له
            </DialogDescription>
          </DialogHeader>

          {editingRoleData && (
            <div className="space-y-6">
              {/* معلومات الدور الأساسية */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="roleName">اسم الدور</Label>
                  <Input
                    id="roleName"
                    value={editingRoleData.name}
                    onChange={(e) => setEditingRoleData({
                      ...editingRoleData,
                      name: e.target.value
                    })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="roleColor">لون الدور</Label>
                  <Select
                    value={editingRoleData.color}
                    onValueChange={(value) => setEditingRoleData({
                      ...editingRoleData,
                      color: value
                    })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bg-blue-500">أزرق</SelectItem>
                      <SelectItem value="bg-green-500">أخضر</SelectItem>
                      <SelectItem value="bg-purple-500">بنفسجي</SelectItem>
                      <SelectItem value="bg-orange-500">برتقالي</SelectItem>
                      <SelectItem value="bg-red-500">أحمر</SelectItem>
                      <SelectItem value="bg-pink-500">وردي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="roleDescription">وصف الدور</Label>
                <Textarea
                  id="roleDescription"
                  value={editingRoleData.description}
                  onChange={(e) => setEditingRoleData({
                    ...editingRoleData,
                    description: e.target.value
                  })}
                  className="mt-1"
                  rows={3}
                />
              </div>

              {/* الصلاحيات */}
              <div>
                <h3 className="font-semibold text-lg mb-4">الصلاحيات الممنوحة</h3>
                <div className="space-y-4">
                  {Object.entries(groupedPermissions).map(([category, permissions]) => (
                    <div key={category} className="border rounded-lg p-4">
                      <h4 className="font-semibold text-md mb-3 text-blue-600">{category}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {permissions.map((permission) => {
                          const hasPermission = editingRoleData.permissions.includes(permission.id);
                          const Icon = permission.icon;
                          
                          return (
                            <div key={permission.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                              <div className="flex items-center">
                                <Icon className="w-4 h-4 text-gray-600 mr-2" />
                                <div>
                                  <div className="font-medium text-sm">{permission.name}</div>
                                  <div className="text-xs text-gray-500">{permission.description}</div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2 space-x-reverse">
                                <Badge className={getLevelColor(permission.level)} variant="outline">
                                  {getLevelText(permission.level)}
                                </Badge>
                                <Switch
                                  checked={hasPermission}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setEditingRoleData({
                                        ...editingRoleData,
                                        permissions: [...editingRoleData.permissions, permission.id]
                                      });
                                    } else {
                                      setEditingRoleData({
                                        ...editingRoleData,
                                        permissions: editingRoleData.permissions.filter(p => p !== permission.id)
                                      });
                                    }
                                  }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={handleCancelEdit}>
              إلغاء
            </Button>
            <Button onClick={handleSaveRole}>
              حفظ التغييرات
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdvancedPermissions; 