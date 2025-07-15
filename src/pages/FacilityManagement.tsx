import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Building, 
  Users, 
  Plus, 
  Edit, 
  Trash2,
  Calculator,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import supabase from '@/integrations/supabase/client';

interface FacilityStats {
  totalRooms: number;
  totalBeds: number;
  availableBeds: number;
  occupiedBeds: number;
  totalExpenses: number;
  paidExpenses: number;
  pendingExpenses: number;
  monthlyRevenue: number;
  monthlyExpenses: number;
  netProfit: number;
}

const FacilityManagement = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [pageLoaded, setPageLoaded] = useState(false);
  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);
  const [isEditRoomsOpen, setIsEditRoomsOpen] = useState(false);
  const [isExpensesOpen, setIsExpensesOpen] = useState(false);
  const [stats, setStats] = useState<FacilityStats>({
    totalRooms: 0,
    totalBeds: 0,
    availableBeds: 0,
    occupiedBeds: 0,
    totalExpenses: 0,
    paidExpenses: 0,
    pendingExpenses: 0,
    monthlyRevenue: 0,
    monthlyExpenses: 0,
    netProfit: 0
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFacilityStats();
    console.log('FacilityManagement component loaded successfully');
    setPageLoaded(true);
    toast({
      title: "تم تحميل صفحة إدارة المرافق",
      description: "الصفحة تعمل بشكل صحيح",
    });
  }, [toast]);

  const fetchFacilityStats = async () => {
    try {
      setLoading(true);
      
      // جلب إحصائيات الغرف
      const { data: roomsData, error: roomsError } = await supabase
        .from('rooms')
        .select('*');

      if (roomsError) throw roomsError;

      // جلب إحصائيات المصاريف
      const { data: expensesData, error: expensesError } = await supabase
        .from('expenses')
        .select('*');

      if (expensesError) throw expensesError;

      // جلب إحصائيات الإيرادات
      const { data: revenueData, error: revenueError } = await supabase
        .from('revenue')
        .select('*');

      if (revenueError) throw revenueError;

      // حساب الإحصائيات
      const totalRooms = roomsData?.length || 0;
      const totalBeds = roomsData?.reduce((sum, room) => sum + room.beds, 0) || 0;
      const occupiedBeds = roomsData?.reduce((sum, room) => sum + room.occupied_beds, 0) || 0;
      const availableBeds = totalBeds - occupiedBeds;

      const totalExpenses = expensesData?.reduce((sum, expense) => sum + expense.amount, 0) || 0;
      const paidExpenses = expensesData?.filter(e => e.status === 'paid').reduce((sum, expense) => sum + expense.amount, 0) || 0;
      const pendingExpenses = totalExpenses - paidExpenses;

      const monthlyRevenue = revenueData?.reduce((sum, revenue) => sum + revenue.amount, 0) || 0;
      const monthlyExpenses = totalExpenses;
      const netProfit = monthlyRevenue - monthlyExpenses;

      setStats({
        totalRooms,
        totalBeds,
        availableBeds,
        occupiedBeds,
        totalExpenses,
        paidExpenses,
        pendingExpenses,
        monthlyRevenue,
        monthlyExpenses,
        netProfit
      });
    } catch (error: any) {
      console.error('Error fetching facility stats:', error);
      toast({
        title: "خطأ في تحميل إحصائيات المرافق",
        description: error.message || "حدث خطأ أثناء تحميل إحصائيات المرافق",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleManageRooms = () => {
    navigate('/rooms');
    toast({
      title: "إدارة الغرف",
      description: "سيتم نقلك إلى صفحة إدارة الغرف",
    });
  };

  const handleFacilityExpenses = () => {
    navigate('/facility-expenses');
    toast({
      title: "مصاريف المرافق",
      description: "سيتم نقلك إلى صفحة مصاريف المرافق",
    });
  };

  const handleFinance = () => {
    navigate('/finance');
    toast({
      title: "الحسابات المالية",
      description: "سيتم نقلك إلى صفحة الحسابات المالية",
    });
  };

  const handleAddRoom = async () => {
    try {
      setLoading(true);
      const newRoom = {
        number: `F${Date.now()}`,
        type: 'عادي' as const,
        status: 'متاحة' as const,
        beds: 2,
        occupied_beds: 0,
        price: 500,
        floor: '1',
        notes: 'غرفة مرافق جديدة'
      };

      const { data, error } = await supabase
        .from('rooms')
        .insert([newRoom])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "تم إضافة غرفة جديدة",
        description: "تم إضافة الغرفة بنجاح",
      });

      fetchFacilityStats();
    } catch (error: any) {
      console.error('Error adding room:', error);
      toast({
        title: "خطأ في إضافة الغرفة",
        description: error.message || "حدث خطأ أثناء إضافة الغرفة",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditRooms = () => {
    setIsEditRoomsOpen(true);
    toast({
      title: "تعديل الغرف",
      description: "سيتم فتح قائمة الغرف للتعديل",
    });
  };

  const handleManageBookings = () => {
    toast({
      title: "إدارة الحجوزات",
      description: "سيتم فتح صفحة إدارة الحجوزات",
    });
  };

  const handleViewExpenses = () => {
    setIsExpensesOpen(true);
    toast({
      title: "عرض المصاريف",
      description: "سيتم فتح تفاصيل مصاريف المرافق",
    });
  };

  const handleDownloadReport = async () => {
    try {
      toast({
        title: "تحميل التقرير",
        description: "جاري تحميل تقرير المرافق...",
      });
      
      const reportData = {
        facility_stats: stats,
        generated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('reports')
        .insert([{
          type: 'facility_report',
          data: reportData,
          created_at: new Date().toISOString()
        }]);

      if (error) throw error;

      setTimeout(() => {
        toast({
          title: "تم التحميل",
          description: "تم تحميل تقرير المرافق بنجاح",
        });
      }, 2000);
    } catch (error: any) {
      console.error('Error downloading report:', error);
      toast({
        title: "خطأ في تحميل التقرير",
        description: error.message || "حدث خطأ أثناء تحميل التقرير",
        variant: "destructive",
      });
    }
  };

  const handleCreateReport = async () => {
    try {
      toast({
        title: "إنشاء التقرير",
        description: "جاري إنشاء تقرير المرافق...",
      });
      
      const reportData = {
        facility_summary: stats,
        generated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('reports')
        .insert([{
          type: 'detailed_facility_report',
          data: reportData,
          created_at: new Date().toISOString()
        }]);

      if (error) throw error;

      setTimeout(() => {
        toast({
          title: "تم الإنشاء",
          description: "تم إنشاء تقرير المرافق بنجاح",
        });
      }, 2500);
    } catch (error: any) {
      console.error('Error creating report:', error);
      toast({
        title: "خطأ في إنشاء التقرير",
        description: error.message || "حدث خطأ أثناء إنشاء التقرير",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Building className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">إدارة المرافق</h1>
                <p className="text-muted-foreground">إدارة شاملة لجميع مرافق المصحة</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {pageLoaded && (
                <Badge variant="secondary" className="bg-green-500">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  محملة
                </Badge>
              )}
              <Button variant="outline" onClick={handleBackToHome}>
                العودة للرئيسية
              </Button>
            </div>
          </div>

          {/* إحصائيات سريعة */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
            <Card className="text-center">
              <CardContent className="p-4">
                <Building className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold text-blue-600">{stats.totalRooms}</div>
                <div className="text-sm text-gray-600">إجمالي الغرف</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <Building className="h-6 w-6 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold text-green-600">{stats.totalBeds}</div>
                <div className="text-sm text-gray-600">إجمالي الأسرّة</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <Building className="h-6 w-6 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold text-green-600">{stats.availableBeds}</div>
                <div className="text-sm text-gray-600">أسرّة متاحة</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <Users className="h-6 w-6 mx-auto mb-2 text-red-600" />
                <div className="text-2xl font-bold text-red-600">{stats.occupiedBeds}</div>
                <div className="text-sm text-gray-600">أسرّة مشغولة</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <Building className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                <div className="text-2xl font-bold text-purple-600">{stats.monthlyRevenue.toLocaleString()}</div>
                <div className="text-sm text-gray-600">إيرادات الشهر</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <Calculator className="h-6 w-6 mx-auto mb-2 text-indigo-600" />
                <div className="text-2xl font-bold text-indigo-600">{stats.netProfit.toLocaleString()}</div>
                <div className="text-sm text-gray-600">صافي الربح</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* التبويبات الرئيسية */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
            <TabsTrigger value="rooms">الغرف والأسرّة</TabsTrigger>
            <TabsTrigger value="expenses">مصاريف المصحة</TabsTrigger>
            <TabsTrigger value="finance">الحسابات المالية</TabsTrigger>
          </TabsList>

          {/* نظرة عامة */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* حالة الغرف */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building className="h-5 w-5" />
                    <span>حالة الغرف</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Building className="h-5 w-5 text-green-600" />
                        <span>متاحة</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800">18 غرفة</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Users className="h-5 w-5 text-red-600" />
                        <span>مشغولة</span>
                      </div>
                      <Badge className="bg-red-100 text-red-800">4 غرف</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Building className="h-5 w-5 text-yellow-600" />
                        <span>صيانة</span>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800">2 غرف</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* مصاريف الشهر */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building className="h-5 w-5" />
                    <span>مصاريف الشهر</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Building className="h-4 w-4 text-yellow-600" />
                        <span>كهرباء</span>
                      </div>
                      <span className="font-medium">2,500 ج.م</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Building className="h-4 w-4 text-blue-600" />
                        <span>مياه</span>
                      </div>
                      <span className="font-medium">800 ج.م</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Building className="h-4 w-4 text-orange-600" />
                        <span>طعام</span>
                      </div>
                      <span className="font-medium">5,000 ج.م</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Building className="h-4 w-4 text-gray-600" />
                        <span>صيانة</span>
                      </div>
                      <span className="font-medium">1,200 ج.م</span>
                    </div>
                    <hr />
                    <div className="flex items-center justify-between font-bold">
                      <span>الإجمالي</span>
                      <span>{stats.totalExpenses.toLocaleString()} ج.م</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* روابط سريعة */}
            <Card>
              <CardHeader>
                <CardTitle>إجراءات سريعة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2" onClick={handleManageRooms}>
                      <Building className="h-6 w-6" />
                    <span>إدارة الغرف</span>
                    </Button>
                  <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2" onClick={handleFacilityExpenses}>
                    <Calculator className="h-6 w-6" />
                    <span>مصاريف المرافق</span>
                    </Button>
                  <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2" onClick={handleFinance}>
                    <Calculator className="h-6 w-6" />
                      <span>الحسابات المالية</span>
                    </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* الغرف والأسرّة */}
          <TabsContent value="rooms" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>إدارة الغرف والأسرّة</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  يمكنك إدارة الغرف والأسرّة من صفحة الغرف المخصصة
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button onClick={handleManageRooms}>
                    <Building className="h-4 w-4 mr-2" />
                    الذهاب لإدارة الغرف
                  </Button>
                  <Button variant="outline" onClick={handleAddRoom}>
                    <Plus className="h-4 w-4 mr-2" />
                    إضافة غرفة جديدة
                  </Button>
                  <Button variant="outline" onClick={handleEditRooms}>
                    <Edit className="h-4 w-4 mr-2" />
                    تعديل الغرف
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* مصاريف المصحة */}
          <TabsContent value="expenses" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>مصاريف المصحة</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  يمكنك إدارة مصاريف المصحة من صفحة المصاريف المخصصة
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button onClick={handleFacilityExpenses}>
                    <Calculator className="h-4 w-4 mr-2" />
                    الذهاب لمصاريف المرافق
                  </Button>
                  <Button variant="outline" onClick={handleViewExpenses}>
                    <Building className="h-4 w-4 mr-2" />
                    عرض المصاريف
                  </Button>
                  <Button variant="outline" onClick={handleDownloadReport}>
                    <Calculator className="h-4 w-4 mr-2" />
                    تحميل التقرير
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* الحسابات المالية */}
          <TabsContent value="finance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>الحسابات المالية</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  يمكنك إدارة الحسابات المالية من صفحة المالية المخصصة
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button onClick={handleFinance}>
                    <Calculator className="h-4 w-4 mr-2" />
                    الذهاب للحسابات المالية
                  </Button>
                  <Button variant="outline" onClick={handleCreateReport}>
                    <Calculator className="h-4 w-4 mr-2" />
                    إنشاء التقرير
                  </Button>
                  <Button variant="outline" onClick={handleDownloadReport}>
                    <Calculator className="h-4 w-4 mr-2" />
                    تحميل التقرير
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default FacilityManagement; 