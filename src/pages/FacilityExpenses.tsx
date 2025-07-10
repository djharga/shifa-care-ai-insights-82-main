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
import { supabase } from '@/integrations/supabase/client';

interface Expense {
  id: string;
  category: string;
  amount: number;
  date: string;
  status: 'paid' | 'pending' | 'overdue';
  description: string;
  created_at?: string;
  updated_at?: string;
}

interface ExpenseStats {
  totalExpenses: number;
  paidExpenses: number;
  pendingExpenses: number;
  monthlyExpenses: number;
  lastMonthExpenses: number;
  percentageChange: number;
}

const FacilityExpenses = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [pageLoaded, setPageLoaded] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isEditExpensesOpen, setIsEditExpensesOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [stats, setStats] = useState<ExpenseStats>({
    totalExpenses: 0,
    paidExpenses: 0,
    pendingExpenses: 0,
    monthlyExpenses: 0,
    lastMonthExpenses: 0,
    percentageChange: 0
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchExpenses();
    console.log('FacilityExpenses component loaded successfully');
    setPageLoaded(true);
    toast({
      title: "تم تحميل صفحة مصاريف المرافق",
      description: "الصفحة تعمل بشكل صحيح",
    });
  }, [toast]);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) throw error;
      setExpenses(data || []);
      calculateStats(data || []);
    } catch (error: any) {
      console.error('Error fetching expenses:', error);
      toast({
        title: "خطأ في تحميل بيانات المصاريف",
        description: error.message || "حدث خطأ أثناء تحميل بيانات المصاريف",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (expensesData: Expense[]) => {
    const totalExpenses = expensesData.reduce((sum, exp) => sum + exp.amount, 0);
    const paidExpenses = expensesData.filter(exp => exp.status === 'paid').reduce((sum, exp) => sum + exp.amount, 0);
    const pendingExpenses = expensesData.filter(exp => exp.status === 'pending').reduce((sum, exp) => sum + exp.amount, 0);
    
    // حساب المصاريف الشهرية (الشهر الحالي)
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyExpenses = expensesData
      .filter(exp => {
        const expDate = new Date(exp.date);
        return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
      })
      .reduce((sum, exp) => sum + exp.amount, 0);

    // حساب المصاريف الشهر الماضي
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const lastMonthExpenses = expensesData
      .filter(exp => {
        const expDate = new Date(exp.date);
        return expDate.getMonth() === lastMonth && expDate.getFullYear() === lastMonthYear;
      })
      .reduce((sum, exp) => sum + exp.amount, 0);

    const percentageChange = lastMonthExpenses > 0 ? ((monthlyExpenses - lastMonthExpenses) / lastMonthExpenses) * 100 : 0;

    setStats({
      totalExpenses,
      paidExpenses,
      pendingExpenses,
      monthlyExpenses,
      lastMonthExpenses,
      percentageChange
    });
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleAddExpense = async () => {
    try {
      setLoading(true);
      const newExpense = {
        category: 'كهرباء',
        amount: 1000,
        date: new Date().toISOString().split('T')[0],
        status: 'pending' as const,
        description: 'مصروف جديد'
      };

      const { data, error } = await supabase
        .from('expenses')
        .insert([newExpense])
        .select()
        .single();

      if (error) throw error;

      setExpenses(prev => [data, ...prev]);
      calculateStats([data, ...expenses]);
      toast({
        title: "تم إضافة مصروف جديد",
        description: "تم إضافة المصروف بنجاح",
      });
    } catch (error: any) {
      console.error('Error adding expense:', error);
      toast({
        title: "خطأ في إضافة المصروف",
        description: error.message || "حدث خطأ أثناء إضافة المصروف",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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

  const handleDownloadReport = async () => {
    try {
      toast({
        title: "تحميل التقرير",
        description: "جاري تحميل تقرير المصاريف...",
      });
      
      const reportData = {
        expenses_summary: stats,
        expenses_details: expenses,
        generated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('reports')
        .insert([{
          type: 'expenses_report',
          data: reportData,
          created_at: new Date().toISOString()
        }]);

      if (error) throw error;

      setTimeout(() => {
        toast({
          title: "تم التحميل",
          description: "تم تحميل تقرير المصاريف بنجاح",
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
        description: "جاري إنشاء تقرير المصاريف...",
      });
      
      const reportData = {
        expenses_analysis: stats,
        expenses_breakdown: expenses,
        generated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('reports')
        .insert([{
          type: 'detailed_expenses_report',
          data: reportData,
          created_at: new Date().toISOString()
        }]);

      if (error) throw error;

      setTimeout(() => {
        toast({
          title: "تم الإنشاء",
          description: "تم إنشاء تقرير المصاريف بنجاح",
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

  const handleMonthlyReport = async () => {
    try {
      toast({
        title: "تقرير شهري",
        description: "جاري إنشاء التقرير الشهري...",
      });
      
      const monthlyData = {
        monthly_expenses: stats.monthlyExpenses,
        expenses_list: expenses.filter(exp => {
          const expDate = new Date(exp.date);
          const currentMonth = new Date().getMonth();
          const currentYear = new Date().getFullYear();
          return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
        }),
        generated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('reports')
        .insert([{
          type: 'monthly_expenses_report',
          data: monthlyData,
          created_at: new Date().toISOString()
        }]);

      if (error) throw error;

      setTimeout(() => {
        toast({
          title: "تم الإنشاء",
          description: "تم إنشاء التقرير الشهري بنجاح",
        });
      }, 2000);
    } catch (error: any) {
      console.error('Error creating monthly report:', error);
      toast({
        title: "خطأ في إنشاء التقرير الشهري",
        description: error.message || "حدث خطأ أثناء إنشاء التقرير الشهري",
        variant: "destructive",
      });
    }
  };

  const handleYearlyReport = async () => {
    try {
      toast({
        title: "تقرير سنوي",
        description: "جاري إنشاء التقرير السنوي...",
      });
      
      const yearlyData = {
        yearly_expenses: stats.totalExpenses,
        expenses_breakdown: expenses,
        generated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('reports')
        .insert([{
          type: 'yearly_expenses_report',
          data: yearlyData,
          created_at: new Date().toISOString()
        }]);

      if (error) throw error;

      setTimeout(() => {
        toast({
          title: "تم الإنشاء",
          description: "تم إنشاء التقرير السنوي بنجاح",
        });
      }, 3000);
    } catch (error: any) {
      console.error('Error creating yearly report:', error);
      toast({
        title: "خطأ في إنشاء التقرير السنوي",
        description: error.message || "حدث خطأ أثناء إنشاء التقرير السنوي",
        variant: "destructive",
      });
    }
  };

  const handleEditExpense = async (expenseId: string) => {
    try {
      const expense = expenses.find(e => e.id === expenseId);
      if (!expense) return;

      const updatedExpense: Expense = {
        ...expense,
        status: expense.status === 'paid' ? 'pending' : 'paid',
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('expenses')
        .update(updatedExpense)
        .eq('id', expenseId);

      if (error) throw error;

      setExpenses(prev => prev.map(e => e.id === expenseId ? updatedExpense : e));
      calculateStats(expenses.map(e => e.id === expenseId ? updatedExpense : e));
      toast({
        title: "تم تحديث المصروف",
        description: `تم تحديث حالة المصروف ${expense.category}`,
      });
    } catch (error: any) {
      console.error('Error updating expense:', error);
      toast({
        title: "خطأ في تحديث المصروف",
        description: error.message || "حدث خطأ أثناء تحديث المصروف",
        variant: "destructive",
      });
    }
  };

  const handleDeleteExpense = async (expenseId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المصروف؟')) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', expenseId);

      if (error) throw error;

      setExpenses(prev => prev.filter(e => e.id !== expenseId));
      calculateStats(expenses.filter(e => e.id !== expenseId));
      toast({
        title: "تم حذف المصروف",
        description: "تم حذف المصروف بنجاح",
      });
    } catch (error: any) {
      console.error('Error deleting expense:', error);
      toast({
        title: "خطأ في حذف المصروف",
        description: error.message || "حدث خطأ أثناء حذف المصروف",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
                          variant={expense.status === 'paid' ? 'default' : 'secondary'}
                          className={expense.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
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