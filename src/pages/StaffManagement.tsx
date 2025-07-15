import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Plus, 
  Edit, 
  Trash2,
  UserPlus,
  CalendarDays,
  TrendingUp,
  Star,
  Phone,
  Mail,
  Briefcase,
  Activity,
  BarChart3,
  Search
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import supabase from '@/integrations/supabase/client';

interface Staff {
  id: string;
  name: string;
  position: string;
  email: string;
  phone: string;
  department: string;
  hire_date: string;
  status: 'active' | 'inactive' | 'on_leave';
  performance: number;
  attendance: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

interface Shift {
  id: string;
  staff_id: string;
  staff_name: string;
  date: string;
  start_time: string;
  end_time: string;
  type: 'morning' | 'afternoon' | 'night';
  status: 'scheduled' | 'completed' | 'absent';
  created_at?: string;
}

interface Leave {
  id: string;
  staff_id: string;
  staff_name: string;
  type: 'annual' | 'sick' | 'emergency' | 'other';
  start_date: string;
  end_date: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at?: string;
}

const StaffManagement = () => {
  const { toast } = useToast();
  const [staff, setStaff] = useState<Staff[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [selectedTab, setSelectedTab] = useState('staff');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [showExtraFields, setShowExtraFields] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAddStaffDialogOpen, setIsAddStaffDialogOpen] = useState(false);
  const [newStaff, setNewStaff] = useState({
    name: '',
    position: '',
    phone: '',
    email: '',
    hire_date: '',
    notes: '',
  });

  useEffect(() => {
    fetchStaff();
    fetchShifts();
    fetchLeaves();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStaff(data || []);
    } catch (error: any) {
      console.error('Error fetching staff:', error);
      toast({
        title: "خطأ في تحميل بيانات الموظفين",
        description: error.message || "حدث خطأ أثناء تحميل بيانات الموظفين",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchShifts = async () => {
    try {
      const { data, error } = await supabase
        .from('shifts')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      setShifts(data || []);
    } catch (error: any) {
      console.error('Error fetching shifts:', error);
    }
  };

  const fetchLeaves = async () => {
    try {
      const { data, error } = await supabase
        .from('leaves')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeaves(data || []);
    } catch (error: any) {
      console.error('Error fetching leaves:', error);
    }
  };

  const handleAddStaff = async () => {
    if (!newStaff.name || !newStaff.position || !newStaff.phone) {
      toast({
        title: "بيانات مطلوبة",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const staffData = {
        ...newStaff,
        status: 'active' as const,
        performance: 85,
        attendance: 95,
        department: newStaff.position.includes('طبيب') ? 'الطب النفسي' : 
                   newStaff.position.includes('ممرضة') ? 'التمريض' :
                   newStaff.position.includes('معالج') ? 'العلاج النفسي' : 'الإدارة'
      };

      const { data, error } = await supabase
        .from('staff')
        .insert([staffData])
        .select()
        .single();

      if (error) throw error;

      setStaff(prev => [data, ...prev]);
      toast({
        title: "تم إضافة الموظف بنجاح",
        description: "تم حفظ بيانات الموظف الجديد",
      });

      setIsAddStaffDialogOpen(false);
      setNewStaff({
        name: '',
        position: '',
        phone: '',
        email: '',
        hire_date: '',
        notes: '',
      });
      setShowExtraFields(false);
    } catch (error: any) {
      console.error('Error adding staff:', error);
      toast({
        title: "خطأ في إضافة الموظف",
        description: error.message || "حدث خطأ أثناء إضافة الموظف",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStaff = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الموظف؟')) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('staff')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setStaff(prev => prev.filter(s => s.id !== id));
      toast({
        title: "تم حذف الموظف",
        description: "تم حذف بيانات الموظف بنجاح",
      });
    } catch (error: any) {
      console.error('Error deleting staff:', error);
      toast({
        title: "خطأ في حذف الموظف",
        description: error.message || "حدث خطأ أثناء حذف الموظف",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleShift = async (staffId: string, staffName: string) => {
    try {
      const shiftData = {
        staff_id: staffId,
        staff_name: staffName,
        date: new Date().toISOString().split('T')[0],
        start_time: '08:00',
        end_time: '16:00',
        type: 'morning' as const,
        status: 'scheduled' as const
      };

      const { error } = await supabase
        .from('shifts')
        .insert([shiftData]);

      if (error) throw error;

      toast({
        title: "تم جدولة المناوبة",
        description: "تم إضافة المناوبة بنجاح",
      });

      fetchShifts();
    } catch (error: any) {
      console.error('Error scheduling shift:', error);
      toast({
        title: "خطأ في جدولة المناوبة",
        description: error.message || "حدث خطأ أثناء جدولة المناوبة",
        variant: "destructive",
      });
    }
  };

  const handleApproveLeave = async (id: string) => {
    try {
      const { error } = await supabase
        .from('leaves')
        .update({ status: 'approved' })
        .eq('id', id);

      if (error) throw error;

      setLeaves(prev => prev.map(l => 
        l.id === id ? { ...l, status: 'approved' } : l
      ));

      toast({
        title: "تم الموافقة على الإجازة",
        description: "تم تحديث حالة الإجازة بنجاح",
      });
    } catch (error: any) {
      console.error('Error approving leave:', error);
      toast({
        title: "خطأ في الموافقة على الإجازة",
        description: error.message || "حدث خطأ أثناء الموافقة على الإجازة",
        variant: "destructive",
      });
    }
  };

  const filteredStaff = staff.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === 'all' || employee.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'on_leave': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">إدارة الموظفين والورديات</h1>
          <p className="text-gray-600 mt-2">إدارة الموظفين والورديات والإجازات</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddStaffDialogOpen} onOpenChange={setIsAddStaffDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <UserPlus className="w-4 h-4 mr-2" />
                إضافة موظف جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>إضافة موظف جديد</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">اسم الموظف <span style={{color: 'red'}}>*</span></Label>
                  <Input id="name" value={newStaff.name} onChange={e => setNewStaff({...newStaff, name: e.target.value})} placeholder="اسم الموظف" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">الوظيفة <span style={{color: 'red'}}>*</span></Label>
                  <Input id="position" value={newStaff.position} onChange={e => setNewStaff({...newStaff, position: e.target.value})} placeholder="الوظيفة" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">رقم الهاتف <span style={{color: 'red'}}>*</span></Label>
                  <Input id="phone" value={newStaff.phone} onChange={e => setNewStaff({...newStaff, phone: e.target.value})} placeholder="رقم الهاتف" required />
                </div>
                {!showExtraFields && (
                  <Button variant="outline" type="button" onClick={() => setShowExtraFields(true)}>
                    تفاصيل إضافية
                  </Button>
                )}
                {showExtraFields && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="email">البريد الإلكتروني</Label>
                      <Input id="email" type="email" value={newStaff.email} onChange={e => setNewStaff({...newStaff, email: e.target.value})} placeholder="البريد الإلكتروني" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hire_date">تاريخ التعيين</Label>
                      <Input id="hire_date" type="date" value={newStaff.hire_date} onChange={e => setNewStaff({...newStaff, hire_date: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notes">ملاحظات</Label>
                      <Textarea id="notes" value={newStaff.notes} onChange={e => setNewStaff({...newStaff, notes: e.target.value})} placeholder="ملاحظات إضافية" />
                    </div>
                  </>
                )}
                <Button onClick={handleAddStaff} className="w-full" disabled={loading}>
                  إضافة الموظف
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm text-gray-600">إجمالي الموظفين</p>
                <p className="text-2xl font-bold">{staff.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm text-gray-600">الورديات اليوم</p>
                <p className="text-2xl font-bold">{shifts.filter(s => s.status === 'scheduled').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <CalendarDays className="w-8 h-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm text-gray-600">الإجازات المعلقة</p>
                <p className="text-2xl font-bold">{leaves.filter(l => l.status === 'pending').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-orange-600" />
              <div className="ml-3">
                <p className="text-sm text-gray-600">متوسط الأداء</p>
                <p className="text-2xl font-bold">
                  {Math.round(staff.reduce((acc, s) => acc + s.performance, 0) / staff.length)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="staff">الموظفين</TabsTrigger>
          <TabsTrigger value="shifts">الورديات</TabsTrigger>
          <TabsTrigger value="leaves">الإجازات</TabsTrigger>
          <TabsTrigger value="reports">التقارير</TabsTrigger>
        </TabsList>

        {/* Staff Tab */}
        <TabsContent value="staff" className="space-y-4">
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="البحث في الموظفين..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterDepartment} onValueChange={setFilterDepartment}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="اختر القسم" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأقسام</SelectItem>
                <SelectItem value="الطب النفسي">الطب النفسي</SelectItem>
                <SelectItem value="التمريض">التمريض</SelectItem>
                <SelectItem value="العلاج النفسي">العلاج النفسي</SelectItem>
                <SelectItem value="الإدارة">الإدارة</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              <p>جاري تحميل البيانات...</p>
            ) : filteredStaff.length === 0 ? (
              <p>لا يوجد موظفين مطابقين للبحث أو الفلتر.</p>
            ) : (
              filteredStaff.map((employee) => (
                <Card key={employee.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{employee.name}</CardTitle>
                        <p className="text-sm text-gray-600">{employee.position}</p>
                      </div>
                      <Badge className={getStatusColor(employee.status)}>
                        {employee.status === 'active' ? 'نشط' : 
                         employee.status === 'inactive' ? 'غير نشط' : 'في إجازة'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center text-sm">
                      <Mail className="w-4 h-4 text-gray-400 mr-2" />
                      {employee.email}
                    </div>
                    <div className="flex items-center text-sm">
                      <Phone className="w-4 h-4 text-gray-400 mr-2" />
                      {employee.phone}
                    </div>
                    <div className="flex items-center text-sm">
                      <Briefcase className="w-4 h-4 text-gray-400 mr-2" />
                      {employee.department}
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        <span className={`text-sm font-medium ${getPerformanceColor(employee.performance)}`}>
                          {employee.performance}%
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Activity className="w-4 h-4 text-blue-500 mr-1" />
                        <span className="text-sm font-medium text-blue-600">
                          {employee.attendance}%
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleScheduleShift(employee.id, employee.name)}
                        className="flex-1"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        جدولة وردية
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteStaff(employee.id)}
                        className="text-red-600 hover:text-red-700"
                        disabled={loading}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Shifts Tab */}
        <TabsContent value="shifts" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">جدول الورديات</h3>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  جدولة وردية جديدة
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>جدولة وردية جديدة</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="staff">الموظف</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الموظف" />
                      </SelectTrigger>
                      <SelectContent>
                        {staff.map(s => (
                          <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="date">التاريخ</Label>
                    <Input id="date" type="date" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startTime">وقت البداية</Label>
                      <Input id="startTime" type="time" />
                    </div>
                    <div>
                      <Label htmlFor="endTime">وقت النهاية</Label>
                      <Input id="endTime" type="time" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="shiftType">نوع الوردية</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر نوع الوردية" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="morning">صباحية</SelectItem>
                        <SelectItem value="afternoon">مسائية</SelectItem>
                        <SelectItem value="night">ليلية</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={() => handleScheduleShift('placeholder_staff_id', 'placeholder_staff_name')} className="w-full" disabled={loading}>
                    جدولة الوردية
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              <p>جاري تحميل الورديات...</p>
            ) : shifts.length === 0 ? (
              <p>لا يوجد ورديات مجدولة حتى الآن.</p>
            ) : (
              shifts.map((shift) => (
                <Card key={shift.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">{shift.staff_name}</h4>
                        <p className="text-sm text-gray-600">{shift.date}</p>
                      </div>
                      <Badge className={
                        shift.status === 'completed' ? 'bg-green-100 text-green-800' :
                        shift.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }>
                        {shift.status === 'completed' ? 'مكتملة' :
                         shift.status === 'scheduled' ? 'مجدولة' : 'غائب'}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>وقت البداية:</span>
                        <span className="font-medium">{shift.start_time}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>وقت النهاية:</span>
                        <span className="font-medium">{shift.end_time}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>نوع الوردية:</span>
                        <span className="font-medium">
                          {shift.type === 'morning' ? 'صباحية' :
                           shift.type === 'afternoon' ? 'مسائية' : 'ليلية'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Leaves Tab */}
        <TabsContent value="leaves" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">طلبات الإجازات</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              <p>جاري تحميل طلبات الإجازات...</p>
            ) : leaves.length === 0 ? (
              <p>لا يوجد طلبات إجازة معلقة حتى الآن.</p>
            ) : (
              leaves.map((leave) => (
                <Card key={leave.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">{leave.staff_name}</h4>
                        <p className="text-sm text-gray-600">
                          {leave.start_date} - {leave.end_date}
                        </p>
                      </div>
                      <Badge className={
                        leave.status === 'approved' ? 'bg-green-100 text-green-800' :
                        leave.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }>
                        {leave.status === 'approved' ? 'موافق عليها' :
                         leave.status === 'pending' ? 'في الانتظار' : 'مرفوضة'}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>نوع الإجازة:</span>
                        <span className="font-medium">
                          {leave.type === 'annual' ? 'سنوية' :
                           leave.type === 'sick' ? 'مرضية' :
                           leave.type === 'emergency' ? 'طارئة' : 'أخرى'}
                        </span>
                      </div>
                      <div className="text-sm">
                        <span>السبب:</span>
                        <p className="text-gray-600 mt-1">{leave.reason}</p>
                      </div>
                    </div>
                    {leave.status === 'pending' && (
                      <div className="flex gap-2 mt-3 pt-3 border-t">
                        <Button
                          size="sm"
                          onClick={() => handleApproveLeave(leave.id)}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                          disabled={loading}
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          موافقة
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700"
                          disabled={loading}
                        >
                          <XCircle className="w-3 h-3 mr-1" />
                          رفض
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  تقرير الأداء
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loading ? (
                    <p>جاري تحميل تقرير الأداء...</p>
                  ) : staff.length === 0 ? (
                    <p>لا يوجد بيانات لتقرير الأداء حتى الآن.</p>
                  ) : (
                    staff.map((employee) => (
                      <div key={employee.id} className="flex justify-between items-center">
                        <span className="text-sm">{employee.name}</span>
                        <div className="flex items-center">
                          <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className={`h-2 rounded-full ${getPerformanceColor(employee.performance).replace('text-', 'bg-')}`}
                              style={{ width: `${employee.performance}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{employee.performance}%</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  تقرير الحضور
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loading ? (
                    <p>جاري تحميل تقرير الحضور...</p>
                  ) : staff.length === 0 ? (
                    <p>لا يوجد بيانات لتقرير الحضور حتى الآن.</p>
                  ) : (
                    staff.map((employee) => (
                      <div key={employee.id} className="flex justify-between items-center">
                        <span className="text-sm">{employee.name}</span>
                        <div className="flex items-center">
                          <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className="h-2 rounded-full bg-blue-500"
                              style={{ width: `${employee.attendance}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{employee.attendance}%</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StaffManagement; 