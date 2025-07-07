import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
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
import { 
  DollarSign, 
  Zap, 
  Droplets, 
  Utensils, 
  Sparkles, 
  Wrench, 
  Shield, 
  Wifi, 
  Phone, 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Plus, 
  Edit, 
  Trash2
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface FacilityExpense {
  id: string;
  expense_category: 'electricity' | 'water' | 'food' | 'cleaning' | 'maintenance' | 'security' | 'internet' | 'phone' | 'other';
  expense_name: string;
  amount: number;
  expense_date: string;
  due_date: string | null;
  payment_status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  payment_method: string | null;
  receipt_number: string | null;
  vendor_name: string | null;
  vendor_phone: string | null;
  description: string | null;
}

const FacilityExpenses = () => {
  const { toast } = useToast();
  const [expenses, setExpenses] = useState<FacilityExpense[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  
  const [newExpense, setNewExpense] = useState({
    expense_category: 'electricity' as const,
    expense_name: '',
    amount: '',
    expense_date: '',
    due_date: '',
    payment_status: 'pending' as const,
    payment_method: '',
    receipt_number: '',
    vendor_name: '',
    vendor_phone: '',
    description: ''
  });

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const { data, error } = await supabase
        .from('facility_expenses')
        .select('*')
        .order('expense_date', { ascending: false });
      
      if (error) throw error;
      setExpenses(data || []);
    } catch (error: any) {
      toast({
        title: "خطأ في تحميل مصاريف المصحة",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleAddExpense = async () => {
    try {
      const { error } = await supabase
        .from('facility_expenses')
        .insert([{
          expense_category: newExpense.expense_category,
          expense_name: newExpense.expense_name,
          amount: parseFloat(newExpense.amount),
          expense_date: newExpense.expense_date,
          due_date: newExpense.due_date || null,
          payment_status: newExpense.payment_status,
          payment_method: newExpense.payment_method || null,
          receipt_number: newExpense.receipt_number || null,
          vendor_name: newExpense.vendor_name || null,
          vendor_phone: newExpense.vendor_phone || null,
          description: newExpense.description || null
        }]);

      if (error) throw error;

      toast({
        title: "تم إضافة المصروف",
        description: "تم إضافة مصروف المصحة بنجاح",
      });

      setIsAddExpenseOpen(false);
      setNewExpense({
        expense_category: 'electricity',
        expense_name: '',
        amount: '',
        expense_date: '',
        due_date: '',
        payment_status: 'pending',
        payment_method: '',
        receipt_number: '',
        vendor_name: '',
        vendor_phone: '',
        description: ''
      });
      fetchExpenses();
    } catch (error: any) {
      toast({
        title: "خطأ في إضافة المصروف",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'electricity': return <Zap className="w-4 h-4" />;
      case 'water': return <Droplets className="w-4 h-4" />;
      case 'food': return <Utensils className="w-4 h-4" />;
      case 'cleaning': return <Sparkles className="w-4 h-4" />;
      case 'maintenance': return <Wrench className="w-4 h-4" />;
      case 'security': return <Shield className="w-4 h-4" />;
      case 'internet': return <Wifi className="w-4 h-4" />;
      case 'phone': return <Phone className="w-4 h-4" />;
      case 'other': return <FileText className="w-4 h-4" />;
      default: return <DollarSign className="w-4 h-4" />;
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'electricity': return 'كهرباء';
      case 'water': return 'مياه';
      case 'food': return 'طعام';
      case 'cleaning': return 'تنظيف';
      case 'maintenance': return 'صيانة';
      case 'security': return 'أمن';
      case 'internet': return 'إنترنت';
      case 'phone': return 'هاتف';
      case 'other': return 'أخرى';
      default: return category;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      overdue: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800'
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800'}>
        {status === 'pending' && 'في الانتظار'}
        {status === 'paid' && 'مدفوع'}
        {status === 'overdue' && 'متأخر'}
        {status === 'cancelled' && 'ملغي'}
      </Badge>
    );
  };

  const calculateTotalExpenses = () => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  };

  const calculatePaidExpenses = () => {
    return expenses
      .filter(expense => expense.payment_status === 'paid')
      .reduce((total, expense) => total + expense.amount, 0);
  };

  const calculatePendingExpenses = () => {
    return expenses
      .filter(expense => expense.payment_status === 'pending')
      .reduce((total, expense) => total + expense.amount, 0);
  };

  const calculateOverdueExpenses = () => {
    return expenses
      .filter(expense => expense.payment_status === 'overdue')
      .reduce((total, expense) => total + expense.amount, 0);
  };

  const getFilteredExpenses = () => {
    if (activeTab === 'all') return expenses;
    return expenses.filter(expense => expense.expense_category === activeTab);
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">مصاريف المصحة</h1>
            <p className="text-muted-foreground">إدارة مصاريف الكهرباء والمياه والطعام والخدمات</p>
          </div>
        </div>

        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي المصاريف</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{calculateTotalExpenses().toLocaleString()} ج.م</div>
              <p className="text-xs text-muted-foreground">جميع المصاريف</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">المصاريف المدفوعة</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{calculatePaidExpenses().toLocaleString()} ج.م</div>
              <p className="text-xs text-muted-foreground">تم دفعها</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">مصاريف معلقة</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{calculatePendingExpenses().toLocaleString()} ج.م</div>
              <p className="text-xs text-muted-foreground">في الانتظار</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">مصاريف متأخرة</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{calculateOverdueExpenses().toLocaleString()} ج.م</div>
              <p className="text-xs text-muted-foreground">متأخرة الدفع</p>
            </CardContent>
          </Card>
        </div>

        {/* التبويبات */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex justify-between items-center">
            <TabsList className="grid w-full grid-cols-9">
              <TabsTrigger value="all">الكل</TabsTrigger>
              <TabsTrigger value="electricity">كهرباء</TabsTrigger>
              <TabsTrigger value="water">مياه</TabsTrigger>
              <TabsTrigger value="food">طعام</TabsTrigger>
              <TabsTrigger value="cleaning">تنظيف</TabsTrigger>
              <TabsTrigger value="maintenance">صيانة</TabsTrigger>
              <TabsTrigger value="security">أمن</TabsTrigger>
              <TabsTrigger value="internet">إنترنت</TabsTrigger>
              <TabsTrigger value="phone">هاتف</TabsTrigger>
            </TabsList>
            
            <Dialog open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  إضافة مصروف جديد
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>إضافة مصروف مصحة جديد</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="category">فئة المصروف</Label>
                    <Select value={newExpense.expense_category} onValueChange={(value: any) => setNewExpense({...newExpense, expense_category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر فئة المصروف" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="electricity">كهرباء</SelectItem>
                        <SelectItem value="water">مياه</SelectItem>
                        <SelectItem value="food">طعام</SelectItem>
                        <SelectItem value="cleaning">تنظيف</SelectItem>
                        <SelectItem value="maintenance">صيانة</SelectItem>
                        <SelectItem value="security">أمن</SelectItem>
                        <SelectItem value="internet">إنترنت</SelectItem>
                        <SelectItem value="phone">هاتف</SelectItem>
                        <SelectItem value="other">أخرى</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="name">اسم المصروف</Label>
                    <Input
                      id="name"
                      value={newExpense.expense_name}
                      onChange={(e) => setNewExpense({...newExpense, expense_name: e.target.value})}
                      placeholder="مثال: فاتورة الكهرباء - يناير 2024"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="amount">المبلغ</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={newExpense.amount}
                      onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                      placeholder="مثال: 2500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="expense-date">تاريخ المصروف</Label>
                      <Input
                        id="expense-date"
                        type="date"
                        value={newExpense.expense_date}
                        onChange={(e) => setNewExpense({...newExpense, expense_date: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="due-date">تاريخ الاستحقاق</Label>
                      <Input
                        id="due-date"
                        type="date"
                        value={newExpense.due_date}
                        onChange={(e) => setNewExpense({...newExpense, due_date: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="status">حالة الدفع</Label>
                    <Select value={newExpense.payment_status} onValueChange={(value: any) => setNewExpense({...newExpense, payment_status: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر حالة الدفع" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">في الانتظار</SelectItem>
                        <SelectItem value="paid">مدفوع</SelectItem>
                        <SelectItem value="overdue">متأخر</SelectItem>
                        <SelectItem value="cancelled">ملغي</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="payment-method">طريقة الدفع</Label>
                    <Input
                      id="payment-method"
                      value={newExpense.payment_method}
                      onChange={(e) => setNewExpense({...newExpense, payment_method: e.target.value})}
                      placeholder="مثال: تحويل بنكي"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="receipt">رقم الإيصال</Label>
                    <Input
                      id="receipt"
                      value={newExpense.receipt_number}
                      onChange={(e) => setNewExpense({...newExpense, receipt_number: e.target.value})}
                      placeholder="مثال: ELEC001"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="vendor">اسم المورد</Label>
                      <Input
                        id="vendor"
                        value={newExpense.vendor_name}
                        onChange={(e) => setNewExpense({...newExpense, vendor_name: e.target.value})}
                        placeholder="مثال: شركة الكهرباء"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="vendor-phone">هاتف المورد</Label>
                      <Input
                        id="vendor-phone"
                        value={newExpense.vendor_phone}
                        onChange={(e) => setNewExpense({...newExpense, vendor_phone: e.target.value})}
                        placeholder="مثال: +20123456789"
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">الوصف</Label>
                    <Textarea
                      id="description"
                      value={newExpense.description}
                      onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                      placeholder="وصف تفصيلي للمصروف"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsAddExpenseOpen(false)}>
                    إلغاء
                  </Button>
                  <Button onClick={handleAddExpense}>
                    إضافة
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <TabsContent value={activeTab} className="space-y-6">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>فئة المصروف</TableHead>
                      <TableHead>اسم المصروف</TableHead>
                      <TableHead>المبلغ</TableHead>
                      <TableHead>تاريخ المصروف</TableHead>
                      <TableHead>حالة الدفع</TableHead>
                      <TableHead>المورد</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getFilteredExpenses().map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getCategoryIcon(expense.expense_category)}
                            <span>{getCategoryName(expense.expense_category)}</span>
                          </div>
                        </TableCell>
                        <TableCell>{expense.expense_name}</TableCell>
                        <TableCell>{expense.amount.toLocaleString()} ج.م</TableCell>
                        <TableCell>{new Date(expense.expense_date).toLocaleDateString('ar-EG')}</TableCell>
                        <TableCell>{getStatusBadge(expense.payment_status)}</TableCell>
                        <TableCell>{expense.vendor_name || '-'}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default FacilityExpenses; 