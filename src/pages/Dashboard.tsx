import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, User, Bed, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { hasPermission, Role } from '@/utils/permissions';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [patientsCount, setPatientsCount] = useState(0);
  const [sessionsCount, setSessionsCount] = useState(0);
  const [roomsCount, setRoomsCount] = useState(0);
  const [availableRooms, setAvailableRooms] = useState(0);
  const [occupiedRooms, setOccupiedRooms] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [userRole, setUserRole] = useState<Role | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserRole();
  }, []);

  useEffect(() => {
    if (userRole && !hasPermission(userRole, 'view_dashboard')) {
      navigate('/not-authorized'); // أو يمكنك توجيهه للرئيسية
    } else if (userRole) {
      fetchStats();
    }
  }, [userRole]);

  const fetchUserRole = async () => {
    // جلب دور المستخدم الحالي من Supabase أو localStorage
    const { data } = await supabase.from('profiles').select('role').limit(1);
    setUserRole(data?.[0]?.role || null);
  };

  const fetchStats = async () => {
    // Fetch patients count
    const { count: patients } = await supabase.from('patients').select('id', { count: 'exact', head: true });
    setPatientsCount(patients || 0);
    // Fetch sessions count
    const { count: sessions } = await supabase.from('sessions').select('id', { count: 'exact', head: true });
    setSessionsCount(sessions || 0);
    // Fetch rooms and their status
    const { data: rooms } = await supabase.from('rooms').select('*');
    setRoomsCount(rooms?.length || 0);
    setAvailableRooms(rooms?.filter((r: any) => r.status === 'available').length || 0);
    setOccupiedRooms(rooms?.filter((r: any) => r.status === 'occupied').length || 0);
    // Fetch payments (revenue)
    const { data: payments } = await supabase.from('payments').select('amount');
    setTotalRevenue(payments?.reduce((sum: number, p: any) => sum + (p.amount || 0), 0) || 0);
    // Fetch expenses
    const { data: expenses } = await supabase.from('personal_expenses').select('amount');
    setTotalExpenses(expenses?.reduce((sum: number, e: any) => sum + (e.amount || 0), 0) || 0);
  };

  if (userRole && !hasPermission(userRole, 'view_dashboard')) {
    return <div className="text-center text-red-600 text-xl mt-20">غير مصرح لك بالدخول إلى هذه الصفحة</div>;
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4" dir="rtl">
      <h1 className="text-3xl font-bold mb-8">لوحة التحكم</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">عدد المرضى</CardTitle>
            <User className="h-6 w-6 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{patientsCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">عدد الجلسات</CardTitle>
            <Calendar className="h-6 w-6 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sessionsCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">الغرف المتاحة</CardTitle>
            <Bed className="h-6 w-6 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableRooms} / {roomsCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">الغرف المشغولة</CardTitle>
            <Bed className="h-6 w-6 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{occupiedRooms}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الإيرادات</CardTitle>
            <DollarSign className="h-6 w-6 text-green-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRevenue.toLocaleString()} ج.م</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المصروفات</CardTitle>
            <DollarSign className="h-6 w-6 text-red-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalExpenses.toLocaleString()} ج.م</div>
          </CardContent>
        </Card>
      </div>
      {/* يمكن إضافة رسوم بيانية وتنبيهات هنا لاحقاً */}
    </div>
  );
};

export default Dashboard; 