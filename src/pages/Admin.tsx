import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Users, Settings, BarChart3, Shield, UserPlus, 
  Edit, Trash2, Save, X, Plus, AlertTriangle,
  TrendingUp, TrendingDown, CheckCircle, Crown,
  Brain
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AIStatusIndicator from '@/components/ai/AIStatusIndicator';
import AIConfigPanel from '@/components/ai/AIConfigPanel';

interface User {
  id: string;
  full_name: string;
  email: string;
  role: 'admin' | 'supervisor' | 'therapist' | 'accountant';
  permissions: any;
  is_active: boolean;
}

interface SystemSetting {
  id: string;
  setting_key: string;
  setting_value: any;
  description: string;
}

interface RelapseIndicator {
  id: string;
  patient_name: string;
  indicator_name: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  detected_at: string;
}

const Admin = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [relapseIndicators, setRelapseIndicators] = useState<RelapseIndicator[]>([]);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('users');
  const [newUser, setNewUser] = useState({
    full_name: '',
    email: '',
    role: 'therapist' as const,
    permissions: {}
  });

  useEffect(() => {
    fetchUsers();
    fetchSettings();
    fetchRelapseIndicators();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error: any) {
      toast({
        title: "خطأ في تحميل المستخدمين",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .order('setting_key');

      if (error) throw error;
      setSettings(data || []);
    } catch (error: any) {
      toast({
        title: "خطأ في تحميل الإعدادات",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const fetchRelapseIndicators = async () => {
    try {
      const { data, error } = await supabase
        .from('relapse_indicators')
        .select(`
          *,
          patients(name)
        `)
        .is('resolved_at', null)
        .order('detected_at', { ascending: false });

      if (error) throw error;
      setRelapseIndicators(data || []);
    } catch (error: any) {
      toast({
        title: "خطأ في تحميل مؤشرات الانتكاس",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleAddUser = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .insert([newUser]);

      if (error) throw error;

      toast({
        title: "تم إضافة المستخدم",
        description: "تم إضافة المستخدم بنجاح",
      });

      setIsAddUserDialogOpen(false);
      setNewUser({
        full_name: '',
        email: '',
        role: 'therapist',
        permissions: {}
      });
      fetchUsers();
    } catch (error: any) {
      toast({
        title: "خطأ في إضافة المستخدم",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update(selectedUser)
        .eq('id', selectedUser.id);

      if (error) throw error;

      toast({
        title: "تم تحديث المستخدم",
        description: "تم تحديث بيانات المستخدم بنجاح",
      });

      setIsEditUserDialogOpen(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error: any) {
      toast({
        title: "خطأ في تحديث المستخدم",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المستخدم؟')) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "تم حذف المستخدم",
        description: "تم حذف المستخدم بنجاح",
      });

      fetchUsers();
    } catch (error: any) {
      toast({
        title: "خطأ في حذف المستخدم",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      admin: { label: 'مدير', variant: 'destructive' as const },
      supervisor: { label: 'مشرف', variant: 'default' as const },
      therapist: { label: 'معالج', variant: 'secondary' as const },
      accountant: { label: 'محاسب', variant: 'outline' as const }
    };
    
    const config = roleConfig[role as keyof typeof roleConfig];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getSeverityBadge = (severity: string) => {
    const severityConfig = {
      low: { label: 'منخفض', variant: 'secondary' as const },
      medium: { label: 'متوسط', variant: 'default' as const },
      high: { label: 'عالي', variant: 'destructive' as const },
      critical: { label: 'حرج', variant: 'destructive' as const }
    };
    
    const config = severityConfig[severity as keyof typeof severityConfig];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">لوحة تحكم المدير</h1>
          <p className="text-muted-foreground">إدارة المستخدمين والإعدادات والمؤشرات</p>
          {users.find(u => u.email === 'djharga@gmail.com')?.email === 'djharga@gmail.com' && (
            <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-blue-800">المدير الرئيسي</h3>
              </div>
              <p className="text-sm text-blue-700 mt-1">
                لديك صلاحيات كاملة لإدارة جميع أقسام النظام
              </p>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي المستخدمين</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">المعالجين النشطين</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.filter(u => u.role === 'therapist' && u.is_active).length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">مؤشرات الانتكاس</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{relapseIndicators.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">الذكاء الاصطناعي</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">نشط</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content with Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users" className="flex items-center space-x-2 rtl:space-x-reverse">
              <Users className="h-4 w-4" />
              <span>المستخدمين</span>
            </TabsTrigger>
            <TabsTrigger value="indicators" className="flex items-center space-x-2 rtl:space-x-reverse">
              <AlertTriangle className="h-4 w-4" />
              <span>المؤشرات</span>
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center space-x-2 rtl:space-x-reverse">
              <Brain className="h-4 w-4" />
              <span>الذكاء الاصطناعي</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2 rtl:space-x-reverse">
              <Settings className="h-4 w-4" />
              <span>الإعدادات</span>
            </TabsTrigger>
          </TabsList>

          {/* Users Management Tab */}
          <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Shield className="h-5 w-5" />
                  <span>إدارة المستخدمين</span>
                </CardTitle>
                <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <UserPlus className="h-4 w-4 mr-2" />
                      إضافة مستخدم
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>إضافة مستخدم جديد</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>الاسم الكامل</Label>
                        <Input
                          value={newUser.full_name}
                          onChange={(e) => setNewUser({...newUser, full_name: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label>البريد الإلكتروني</Label>
                        <Input
                          type="email"
                          value={newUser.email}
                          onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label>الدور</Label>
                        <Select value={newUser.role} onValueChange={(value: any) => setNewUser({...newUser, role: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="therapist">معالج</SelectItem>
                            <SelectItem value="supervisor">مشرف</SelectItem>
                            <SelectItem value="accountant">محاسب</SelectItem>
                            <SelectItem value="admin">مدير</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button onClick={handleAddUser} className="w-full">إضافة المستخدم</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{user.full_name}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      {getRoleBadge(user.role)}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user);
                          setIsEditUserDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          </TabsContent>

          {/* Relapse Indicators Tab */}
          <TabsContent value="indicators" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                <AlertTriangle className="h-5 w-5" />
                <span>مؤشرات الانتكاس</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {relapseIndicators.map((indicator) => (
                  <div key={indicator.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">{indicator.patient_name}</div>
                      {getSeverityBadge(indicator.severity)}
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      {indicator.indicator_name}
                    </div>
                    <div className="text-sm">{indicator.description}</div>
                  </div>
                ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Management Tab */}
          <TabsContent value="ai" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AIStatusIndicator />
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Brain className="h-5 w-5" />
                    <span>إحصائيات الذكاء الاصطناعي</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>الجلسات المحللة</span>
                      <Badge variant="outline">156</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>الخطط العلاجية</span>
                      <Badge variant="outline">89</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>التقارير الذكية</span>
                      <Badge variant="outline">234</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>دقة التحليل</span>
                      <Badge variant="outline" className="bg-green-100 text-green-800">94%</Badge>
                    </div>
              </div>
            </CardContent>
          </Card>
        </div>
            
            <AIConfigPanel />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Settings className="h-5 w-5" />
                  <span>إعدادات النظام</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">إعدادات النظام</h3>
                  <p className="text-gray-600 mb-4">سيتم إضافة إعدادات النظام هنا قريباً</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit User Dialog */}
        <Dialog open={isEditUserDialogOpen} onOpenChange={setIsEditUserDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>تعديل المستخدم</DialogTitle>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-4">
                <div>
                  <Label>الاسم الكامل</Label>
                  <Input
                    value={selectedUser.full_name}
                    onChange={(e) => setSelectedUser({...selectedUser, full_name: e.target.value})}
                  />
                </div>
                <div>
                  <Label>البريد الإلكتروني</Label>
                  <Input
                    type="email"
                    value={selectedUser.email}
                    onChange={(e) => setSelectedUser({...selectedUser, email: e.target.value})}
                  />
                </div>
                <div>
                  <Label>الدور</Label>
                  <Select value={selectedUser.role} onValueChange={(value: any) => setSelectedUser({...selectedUser, role: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="therapist">معالج</SelectItem>
                      <SelectItem value="supervisor">مشرف</SelectItem>
                      <SelectItem value="accountant">محاسب</SelectItem>
                      <SelectItem value="admin">مدير</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex space-x-2 rtl:space-x-reverse">
                  <Button onClick={handleUpdateUser} className="flex-1">حفظ التغييرات</Button>
                  <Button variant="outline" onClick={() => setIsEditUserDialogOpen(false)}>إلغاء</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Admin; 