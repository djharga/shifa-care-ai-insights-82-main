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

const FacilityManagement = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [pageLoaded, setPageLoaded] = useState(false);

  // بيانات وهمية للإحصائيات
  const stats = {
    totalRooms: 24,
    totalBeds: 48,
    availableBeds: 32,
    occupiedBeds: 16,
    totalExpenses: 45000,
    paidExpenses: 38000,
    pendingExpenses: 7000,
    monthlyRevenue: 85000,
    monthlyExpenses: 45000,
    netProfit: 40000
  };

  // اختبار تحميل الصفحة
  useEffect(() => {
    console.log('FacilityManagement component loaded successfully');
    setPageLoaded(true);
    toast({
      title: "تم تحميل صفحة إدارة المرافق",
      description: "الصفحة تعمل بشكل صحيح",
    });
  }, [toast]);

  const handleBackToHome = () => {
    navigate('/');
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
                  <Link to="/rooms">
                    <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                      <Building className="h-6 w-6" />
                      <span>إدارة الغرف</span>
                    </Button>
                  </Link>
                  <Link to="/facility-expenses">
                    <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                      <Calculator className="h-6 w-6" />
                      <span>مصاريف المرافق</span>
                    </Button>
                  </Link>
                  <Link to="/finance">
                    <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                      <Calculator className="h-6 w-6" />
                      <span>الحسابات المالية</span>
                    </Button>
                  </Link>
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
                <Link to="/rooms">
                  <Button>
                    <Building className="h-4 w-4 mr-2" />
                    الذهاب لإدارة الغرف
                  </Button>
                </Link>
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
                <Link to="/facility-expenses">
                  <Button>
                    <Calculator className="h-4 w-4 mr-2" />
                    الذهاب لمصاريف المرافق
                  </Button>
                </Link>
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
                <Link to="/finance">
                  <Button>
                    <Calculator className="h-4 w-4 mr-2" />
                    الذهاب للحسابات المالية
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default FacilityManagement; 