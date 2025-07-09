import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  TrendingDown, 
  Plus, 
  Edit, 
  Trash2,
  CheckCircle,
  AlertCircle,
  Building,
  Zap,
  Droplets,
  Utensils,
  Wrench
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

const FacilityExpenses = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [pageLoaded, setPageLoaded] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isEditExpensesOpen, setIsEditExpensesOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  // بيانات وهمية للمصاريف
  const expenses = [
    { id: 1, category: 'كهرباء', amount: 2500, date: '2024-01-15', status: 'مدفوع', description: 'فاتورة الكهرباء الشهرية' },
    { id: 2, category: 'مياه', amount: 800, date: '2024-01-10', status: 'مدفوع', description: 'فاتورة المياه الشهرية' },
    { id: 3, category: 'طعام', amount: 5000, date: '2024-01-20', status: 'معلق', description: 'مصاريف الطعام للمرضى' },
    { id: 4, category: 'صيانة', amount: 1200, date: '2024-01-05', status: 'مدفوع', description: 'صيانة المكيفات' },
    { id: 5, category: 'تنظيف', amount: 1500, date: '2024-01-12', status: 'معلق', description: 'خدمات التنظيف' },
    { id: 6, category: 'أدوية', amount: 3000, date: '2024-01-18', status: 'مدفوع', description: 'مشتريات الأدوية' },
  ];

  const stats = {
    totalExpenses: expenses.reduce((sum, exp) => sum + exp.amount, 0),
    paidExpenses: expenses.filter(exp => exp.status === 'مدفوع').reduce((sum, exp) => sum + exp.amount, 0),
    pendingExpenses: expenses.filter(exp => exp.status === 'معلق').reduce((sum, exp) => sum + exp.amount, 0),
    monthlyExpenses: 14000,
    lastMonthExpenses: 12000,
    percentageChange: 16.7
  };

  // اختبار تحميل الصفحة
  useEffect(() => {
    console.log('FacilityExpenses component loaded successfully');
    setPageLoaded(true);
    toast({
      title: "تم تحميل صفحة مصاريف المرافق",
      description: "الصفحة تعمل بشكل صحيح",
    });
  }, [toast]);

  const handleBackToHome = () => {
    navigate('/');
  };

  // وظائف الأزرار
  const handleAddExpense = () => {
    setIsAddExpenseOpen(true);
    toast({
      title: "إضافة مصروف جديد",
      description: "سيتم فتح نموذج إضافة المصروف",
    });
  };

  const handleEditExpenses = () => {
    setIsEditExpensesOpen(true);
    toast({
      title: "تعديل المصاريف",
      description: "سيتم فتح قائمة المصاريف للتعديل",
    });
  };

  const handleExpenseReport = () => {
    setIsReportOpen(true);
    toast({
      title: "تقرير المصاريف",
      description: "سيتم إنشاء تقرير المصاريف",
    });
  };

  const handleDownloadReport = () => {
    toast({
      title: "تحميل التقرير",
      description: "جاري تحميل تقرير المصاريف...",
    });
    
    setTimeout(() => {
      toast({
        title: "تم التحميل",
        description: "تم تحميل تقرير المصاريف بنجاح",
      });
    }, 2000);
  };

  const handleCreateReport = () => {
    toast({
      title: "إنشاء التقرير",
      description: "جاري إنشاء تقرير المصاريف...",
    });
    
    setTimeout(() => {
      toast({
        title: "تم الإنشاء",
        description: "تم إنشاء تقرير المصاريف بنجاح",
      });
    }, 2500);
  };

  const handleAddCategory = () => {
    toast({
      title: "إضافة فئة جديدة",
      description: "سيتم فتح نموذج إضافة فئة المصاريف",
    });
  };

  const handleEditCategories = () => {
    toast({
      title: "تعديل الفئات",
      description: "سيتم فتح قائمة فئات المصاريف للتعديل",
    });
  };

  const handleMonthlyReport = () => {
    toast({
      title: "تقرير شهري",
      description: "جاري إنشاء التقرير الشهري...",
    });
    
    setTimeout(() => {
      toast({
        title: "تم الإنشاء",
        description: "تم إنشاء التقرير الشهري بنجاح",
      });
    }, 2000);
  };

  const handleYearlyReport = () => {
    toast({
      title: "تقرير سنوي",
      description: "جاري إنشاء التقرير السنوي...",
    });
    
    setTimeout(() => {
      toast({
        title: "تم الإنشاء",
        description: "تم إنشاء التقرير السنوي بنجاح",
      });
    }, 3000);
  };

  const handleEditExpense = (expenseId: number) => {
    toast({
      title: "تعديل المصروف",
      description: `سيتم فتح نموذج تعديل المصروف رقم ${expenseId}`,
    });
  };

  const handleDeleteExpense = (expenseId: number) => {
    toast({
      title: "حذف المصروف",
      description: `سيتم حذف المصروف رقم ${expenseId}`,
    });
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-pink-600 rounded-xl flex items-center justify-center">
                <DollarSign className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">مصاريف المرافق</h1>
                <p className="text-muted-foreground">إدارة شاملة لمصاريف المصحة والمرافق</p>
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
                <DollarSign className="h-6 w-6 mx-auto mb-2 text-red-600" />
                <div className="text-2xl font-bold text-red-600">{stats.totalExpenses.toLocaleString()}</div>
                <div className="text-sm text-gray-600">إجمالي المصاريف</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <CheckCircle className="h-6 w-6 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold text-green-600">{stats.paidExpenses.toLocaleString()}</div>
                <div className="text-sm text-gray-600">مصاريف مدفوعة</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <AlertCircle className="h-6 w-6 mx-auto mb-2 text-yellow-600" />
                <div className="text-2xl font-bold text-yellow-600">{stats.pendingExpenses.toLocaleString()}</div>
                <div className="text-sm text-gray-600">مصاريف معلقة</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <TrendingDown className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold text-blue-600">{stats.monthlyExpenses.toLocaleString()}</div>
                <div className="text-sm text-gray-600">مصاريف الشهر</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <Building className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                <div className="text-2xl font-bold text-purple-600">{expenses.length}</div>
                <div className="text-sm text-gray-600">عدد الفواتير</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <TrendingDown className="h-6 w-6 mx-auto mb-2 text-indigo-600" />
                <div className="text-2xl font-bold text-indigo-600">{stats.percentageChange}%</div>
                <div className="text-sm text-gray-600">زيادة عن الشهر السابق</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* التبويبات الرئيسية */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
            <TabsTrigger value="expenses">قائمة المصاريف</TabsTrigger>
            <TabsTrigger value="categories">فئات المصاريف</TabsTrigger>
            <TabsTrigger value="reports">التقارير</TabsTrigger>
          </TabsList>

          {/* نظرة عامة */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* ملخص المصاريف */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5" />
                    <span>ملخص المصاريف</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <TrendingDown className="h-5 w-5 text-red-600" />
                        <span>إجمالي المصاريف</span>
                      </div>
                      <span className="font-bold text-red-600">{stats.totalExpenses.toLocaleString()} ج.م</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span>مصاريف مدفوعة</span>
                      </div>
                      <span className="font-bold text-green-600">{stats.paidExpenses.toLocaleString()} ج.م</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="h-5 w-5 text-yellow-600" />
                        <span>مصاريف معلقة</span>
                      </div>
                      <span className="font-bold text-yellow-600">{stats.pendingExpenses.toLocaleString()} ج.م</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* فئات المصاريف */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building className="h-5 w-5" />
                    <span>فئات المصاريف</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Zap className="h-4 w-4 text-yellow-600" />
                        <span>كهرباء</span>
                      </div>
                      <span className="font-medium">2,500 ج.م</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Droplets className="h-4 w-4 text-blue-600" />
                        <span>مياه</span>
                      </div>
                      <span className="font-medium">800 ج.م</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Utensils className="h-4 w-4 text-orange-600" />
                        <span>طعام</span>
                      </div>
                      <span className="font-medium">5,000 ج.م</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Wrench className="h-4 w-4 text-gray-600" />
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
                  <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2" onClick={handleAddExpense}>
                    <Plus className="h-6 w-6" />
                    <span>إضافة مصروف جديد</span>
                  </Button>
                  <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2" onClick={handleEditExpenses}>
                    <Edit className="h-6 w-6" />
                    <span>تعديل المصاريف</span>
                  </Button>
                  <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2" onClick={handleExpenseReport}>
                    <DollarSign className="h-6 w-6" />
                    <span>تقرير المصاريف</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* قائمة المصاريف */}
          <TabsContent value="expenses" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>قائمة المصاريف</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {expenses.map((expense) => (
                    <div key={expense.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <DollarSign className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">{expense.category}</h3>
                          <p className="text-sm text-gray-600">{expense.description}</p>
                          <p className="text-xs text-gray-500">{expense.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="font-bold">{expense.amount.toLocaleString()} ج.م</span>
                        <Badge 
                          variant={expense.status === 'مدفوع' ? 'default' : 'secondary'}
                          className={expense.status === 'مدفوع' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                        >
                          {expense.status}
                        </Badge>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" onClick={() => handleEditExpense(expense.id)}>
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDeleteExpense(expense.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* فئات المصاريف */}
          <TabsContent value="categories" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>إدارة فئات المصاريف</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  يمكنك إدارة فئات المصاريف المختلفة
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button onClick={handleAddCategory}>
                    <Plus className="h-4 w-4 mr-2" />
                    إضافة فئة جديدة
                  </Button>
                  <Button variant="outline" onClick={handleEditCategories}>
                    <Edit className="h-4 w-4 mr-2" />
                    تعديل الفئات
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* التقارير */}
          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>تقارير المصاريف</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  يمكنك إنشاء وعرض تقارير المصاريف المختلفة
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button onClick={handleMonthlyReport}>
                    <DollarSign className="h-4 w-4 mr-2" />
                    تقرير شهري
                  </Button>
                  <Button variant="outline" onClick={handleYearlyReport}>
                    <TrendingDown className="h-4 w-4 mr-2" />
                    تقرير سنوي
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

export default FacilityExpenses; 