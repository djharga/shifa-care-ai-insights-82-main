import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  CreditCard, 
  TrendingUp, 
  TrendingDown,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  Users,
  Calendar
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

const Finance = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [pageLoaded, setPageLoaded] = useState(false);
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);
  const [isEditPaymentsOpen, setIsEditPaymentsOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  // بيانات وهمية للإحصائيات المالية
  const stats = {
    totalRevenue: 125000,
    totalExpenses: 85000,
    netProfit: 40000,
    pendingPayments: 15000,
    paidPayments: 110000,
    monthlyRevenue: 45000,
    monthlyExpenses: 32000,
    monthlyProfit: 13000
  };

  // اختبار تحميل الصفحة
  useEffect(() => {
    console.log('Finance component loaded successfully');
    setPageLoaded(true);
    toast({
      title: "تم تحميل صفحة الحسابات المالية",
      description: "الصفحة تعمل بشكل صحيح",
    });
  }, [toast]);

  const handleBackToHome = () => {
    navigate('/');
  };

  // وظائف الأزرار
  const handleAddPayment = () => {
    setIsAddPaymentOpen(true);
    toast({
      title: "إضافة دفعة جديدة",
      description: "سيتم فتح نموذج إضافة الدفعة",
    });
  };

  const handleEditPayments = () => {
    setIsEditPaymentsOpen(true);
    toast({
      title: "تعديل المدفوعات",
      description: "سيتم فتح قائمة المدفوعات للتعديل",
    });
  };

  const handleFinancialReport = () => {
    setIsReportOpen(true);
    toast({
      title: "تقرير مالي",
      description: "سيتم إنشاء التقرير المالي",
    });
  };

  const handleDownloadReport = () => {
    // محاكاة تحميل التقرير
    toast({
      title: "تحميل التقرير",
      description: "جاري تحميل التقرير المالي...",
    });
    
    // محاكاة تأخير التحميل
    setTimeout(() => {
      toast({
        title: "تم التحميل",
        description: "تم تحميل التقرير المالي بنجاح",
      });
    }, 2000);
  };

  const handleSendMessage = () => {
    toast({
      title: "إرسال رسالة",
      description: "سيتم فتح نموذج إرسال الرسالة",
    });
  };

  const handleScheduleVisit = () => {
    toast({
      title: "جدولة زيارة",
      description: "سيتم فتح نموذج جدولة الزيارة",
    });
  };

  const handleCreateSmartReport = () => {
    toast({
      title: "إنشاء تقرير ذكي",
      description: "جاري إنشاء التقرير الذكي...",
    });
    
    setTimeout(() => {
      toast({
        title: "تم الإنشاء",
        description: "تم إنشاء التقرير الذكي بنجاح",
      });
    }, 3000);
  };

  const handleCreateReport = () => {
    toast({
      title: "إنشاء التقرير",
      description: "جاري إنشاء التقرير...",
    });
    
    setTimeout(() => {
      toast({
        title: "تم الإنشاء",
        description: "تم إنشاء التقرير بنجاح",
      });
    }, 2000);
  };

  const handleViewReport = () => {
    toast({
      title: "عرض التقرير",
      description: "سيتم فتح التقرير للعرض",
    });
  };

  const handleDownload = () => {
    toast({
      title: "تحميل",
      description: "جاري تحميل الملف...",
    });
    
    setTimeout(() => {
      toast({
        title: "تم التحميل",
        description: "تم تحميل الملف بنجاح",
      });
    }, 1500);
  };

  const handleScheduleVisitAction = () => {
    toast({
      title: "جدولة الزيارة",
      description: "سيتم فتح نموذج جدولة الزيارة",
    });
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
                <DollarSign className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">الحسابات المالية</h1>
                <p className="text-muted-foreground">إدارة شاملة للحسابات المالية للمصحة</p>
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
                <DollarSign className="h-6 w-6 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold text-green-600">{stats.totalRevenue.toLocaleString()}</div>
                <div className="text-sm text-gray-600">إجمالي الإيرادات</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <TrendingDown className="h-6 w-6 mx-auto mb-2 text-red-600" />
                <div className="text-2xl font-bold text-red-600">{stats.totalExpenses.toLocaleString()}</div>
                <div className="text-sm text-gray-600">إجمالي المصاريف</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <TrendingUp className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold text-blue-600">{stats.netProfit.toLocaleString()}</div>
                <div className="text-sm text-gray-600">صافي الربح</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <CreditCard className="h-6 w-6 mx-auto mb-2 text-yellow-600" />
                <div className="text-2xl font-bold text-yellow-600">{stats.pendingPayments.toLocaleString()}</div>
                <div className="text-sm text-gray-600">مدفوعات معلقة</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <CheckCircle className="h-6 w-6 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold text-green-600">{stats.paidPayments.toLocaleString()}</div>
                <div className="text-sm text-gray-600">مدفوعات محصلة</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <Calendar className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                <div className="text-2xl font-bold text-purple-600">{stats.monthlyProfit.toLocaleString()}</div>
                <div className="text-sm text-gray-600">ربح الشهر</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* التبويبات الرئيسية */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
            <TabsTrigger value="payments">المدفوعات</TabsTrigger>
            <TabsTrigger value="expenses">المصاريف</TabsTrigger>
            <TabsTrigger value="reports">التقارير</TabsTrigger>
          </TabsList>

          {/* نظرة عامة */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* ملخص مالي */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5" />
                    <span>ملخص مالي</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                        <span>إيرادات الشهر</span>
                      </div>
                      <span className="font-bold text-green-600">{stats.monthlyRevenue.toLocaleString()} ج.م</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <TrendingDown className="h-5 w-5 text-red-600" />
                        <span>مصاريف الشهر</span>
                      </div>
                      <span className="font-bold text-red-600">{stats.monthlyExpenses.toLocaleString()} ج.م</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-5 w-5 text-blue-600" />
                        <span>صافي الربح</span>
                      </div>
                      <span className="font-bold text-blue-600">{stats.monthlyProfit.toLocaleString()} ج.م</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* حالة المدفوعات */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CreditCard className="h-5 w-5" />
                    <span>حالة المدفوعات</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>مدفوعات محصلة</span>
                      </div>
                      <span className="font-medium">{stats.paidPayments.toLocaleString()} ج.م</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                        <span>مدفوعات معلقة</span>
                      </div>
                      <span className="font-medium">{stats.pendingPayments.toLocaleString()} ج.م</span>
                    </div>
                    <hr />
                    <div className="flex items-center justify-between font-bold">
                      <span>الإجمالي</span>
                      <span>{stats.totalRevenue.toLocaleString()} ج.م</span>
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
                  <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2" onClick={handleAddPayment}>
                    <Plus className="h-6 w-6" />
                    <span>إضافة دفعة جديدة</span>
                  </Button>
                  <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2" onClick={handleEditPayments}>
                    <Edit className="h-6 w-6" />
                    <span>تعديل المدفوعات</span>
                  </Button>
                  <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2" onClick={handleFinancialReport}>
                    <DollarSign className="h-6 w-6" />
                    <span>تقرير مالي</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* المدفوعات */}
          <TabsContent value="payments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>إدارة المدفوعات</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  يمكنك إدارة جميع المدفوعات والمدفوعات المعلقة
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button onClick={handleAddPayment}>
                    <Plus className="h-4 w-4 mr-2" />
                    إضافة دفعة جديدة
                  </Button>
                  <Button variant="outline" onClick={handleEditPayments}>
                    <Edit className="h-4 w-4 mr-2" />
                    تعديل المدفوعات
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* المصاريف */}
          <TabsContent value="expenses" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>إدارة المصاريف</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  يمكنك إدارة جميع مصاريف المصحة
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button onClick={handleAddPayment}>
                    <Plus className="h-4 w-4 mr-2" />
                    إضافة مصروف جديد
                  </Button>
                  <Button variant="outline" onClick={handleEditPayments}>
                    <Edit className="h-4 w-4 mr-2" />
                    تعديل المصاريف
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* التقارير */}
          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>التقارير المالية</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  يمكنك إنشاء وعرض التقارير المالية المختلفة
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button onClick={handleFinancialReport}>
                    <DollarSign className="h-4 w-4 mr-2" />
                    تقرير الإيرادات
                  </Button>
                  <Button variant="outline" onClick={handleDownloadReport}>
                    <TrendingDown className="h-4 w-4 mr-2" />
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

export default Finance;