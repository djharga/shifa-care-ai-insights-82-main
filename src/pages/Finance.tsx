import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  DollarSign, Bed, CreditCard, Receipt, Plus, Edit, Trash2, 
  Calendar, User, Building, TrendingUp, TrendingDown, CheckCircle,
  AlertCircle, Clock, FileText, Calculator
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

interface Patient {
  id: string;
  name: string;
  email: string;
}

interface AccommodationRecord {
  id: string;
  patient_id: string;
  patient_name: string;
  room_number: string;
  daily_rate: number;
  check_in_date: string;
  check_out_date: string | null;
  total_days: number | null;
  total_cost: number | null;
  status: 'active' | 'completed' | 'cancelled';
  notes: string;
}

interface Payment {
  id: string;
  patient_id: string;
  patient_name: string;
  accommodation_id: string;
  amount: number;
  payment_type: 'cash' | 'card' | 'bank_transfer' | 'insurance';
  payment_date: string;
  payment_method: string;
  receipt_number: string;
  notes: string;
}

interface PersonalExpense {
  id: string;
  patient_id: string;
  patient_name: string;
  expense_type: 'medication' | 'personal_care' | 'food' | 'transportation' | 'entertainment' | 'other';
  amount: number;
  expense_date: string;
  description: string;
  receipt_available: boolean;
  receipt_number: string;
  status: 'pending' | 'approved' | 'rejected';
}

const Finance = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [accommodations, setAccommodations] = useState<AccommodationRecord[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [expenses, setExpenses] = useState<PersonalExpense[]>([]);
  const [activeTab, setActiveTab] = useState('accommodation');
  
  // Dialog states
  const [isAddAccommodationOpen, setIsAddAccommodationOpen] = useState(false);
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  
  // Form states
  const [newAccommodation, setNewAccommodation] = useState({
    patient_id: '',
    room_number: '',
    daily_rate: '',
    check_in_date: '',
    notes: ''
  });
  
  const [newPayment, setNewPayment] = useState({
    patient_id: '',
    accommodation_id: '',
    amount: '',
    payment_type: 'cash' as const,
    payment_date: '',
    payment_method: '',
    receipt_number: '',
    notes: ''
  });
  
  const [newExpense, setNewExpense] = useState({
    patient_id: '',
    expense_type: 'medication' as const,
    amount: '',
    expense_date: '',
    description: '',
    receipt_available: false,
    receipt_number: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await Promise.all([
      fetchPatients(),
      fetchAccommodations(),
      fetchPayments(),
      fetchExpenses()
    ]);
  };

  const fetchPatients = async () => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('id, name, email')
        .order('name');
      
      if (error) throw error;
      setPatients(data || []);
    } catch (error: any) {
      toast({
        title: "خطأ في تحميل المرضى",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const fetchAccommodations = async () => {
    try {
      const { data, error } = await supabase
        .from('accommodation_records')
        .select(`
          *,
          patients(name)
        `)
        .order('check_in_date', { ascending: false });
      
      if (error) throw error;
      
      const formattedData = data?.map(item => ({
        ...item,
        patient_name: item.patients?.name || 'غير محدد'
      })) || [];
      
      setAccommodations(formattedData);
    } catch (error: any) {
      toast({
        title: "خطأ في تحميل سجلات الإقامة",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const fetchPayments = async () => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          patients(name)
        `)
        .order('payment_date', { ascending: false });
      
      if (error) throw error;
      
      const formattedData = data?.map(item => ({
        ...item,
        patient_name: item.patients?.name || 'غير محدد'
      })) || [];
      
      setPayments(formattedData);
    } catch (error: any) {
      toast({
        title: "خطأ في تحميل المدفوعات",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const fetchExpenses = async () => {
    try {
      const { data, error } = await supabase
        .from('personal_expenses')
        .select(`
          *,
          patients(name)
        `)
        .order('expense_date', { ascending: false });
      
      if (error) throw error;
      
      const formattedData = data?.map(item => ({
        ...item,
        patient_name: item.patients?.name || 'غير محدد'
      })) || [];
      
      setExpenses(formattedData);
    } catch (error: any) {
      toast({
        title: "خطأ في تحميل المصاريف",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleAddAccommodation = async () => {
    try {
      const { error } = await supabase
        .from('accommodation_records')
        .insert([{
          patient_id: newAccommodation.patient_id,
          room_number: newAccommodation.room_number,
          daily_rate: parseFloat(newAccommodation.daily_rate),
          check_in_date: newAccommodation.check_in_date,
          notes: newAccommodation.notes
        }]);

      if (error) throw error;

      toast({
        title: "تم إضافة سجل الإقامة",
        description: "تم إضافة سجل الإقامة بنجاح",
      });

      setIsAddAccommodationOpen(false);
      setNewAccommodation({
        patient_id: '',
        room_number: '',
        daily_rate: '',
        check_in_date: '',
        notes: ''
      });
      fetchAccommodations();
    } catch (error: any) {
      toast({
        title: "خطأ في إضافة سجل الإقامة",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleAddPayment = async () => {
    try {
      const { error } = await supabase
        .from('payments')
        .insert([{
          patient_id: newPayment.patient_id,
          accommodation_id: newPayment.accommodation_id,
          amount: parseFloat(newPayment.amount),
          payment_type: newPayment.payment_type,
          payment_date: newPayment.payment_date,
          payment_method: newPayment.payment_method,
          receipt_number: newPayment.receipt_number,
          notes: newPayment.notes
        }]);

      if (error) throw error;

      toast({
        title: "تم إضافة المدفوع",
        description: "تم إضافة المدفوع بنجاح",
      });

      setIsAddPaymentOpen(false);
      setNewPayment({
        patient_id: '',
        accommodation_id: '',
        amount: '',
        payment_type: 'cash',
        payment_date: '',
        payment_method: '',
        receipt_number: '',
        notes: ''
      });
      fetchPayments();
    } catch (error: any) {
      toast({
        title: "خطأ في إضافة المدفوع",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleAddExpense = async () => {
    try {
      const { error } = await supabase
        .from('personal_expenses')
        .insert([{
          patient_id: newExpense.patient_id,
          expense_type: newExpense.expense_type,
          amount: parseFloat(newExpense.amount),
          expense_date: newExpense.expense_date,
          description: newExpense.description,
          receipt_available: newExpense.receipt_available,
          receipt_number: newExpense.receipt_number
        }]);

      if (error) throw error;

      toast({
        title: "تم إضافة المصروف",
        description: "تم إضافة المصروف بنجاح",
      });

      setIsAddExpenseOpen(false);
      setNewExpense({
        patient_id: '',
        expense_type: 'medication',
        amount: '',
        expense_date: '',
        description: '',
        receipt_available: false,
        receipt_number: ''
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

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800'}>
        {status === 'active' && 'نشط'}
        {status === 'completed' && 'مكتمل'}
        {status === 'cancelled' && 'ملغي'}
        {status === 'pending' && 'في الانتظار'}
        {status === 'approved' && 'موافق عليه'}
        {status === 'rejected' && 'مرفوض'}
      </Badge>
    );
  };

  const getPaymentTypeIcon = (type: string) => {
    switch (type) {
      case 'cash': return <DollarSign className="w-4 h-4" />;
      case 'card': return <CreditCard className="w-4 h-4" />;
      case 'bank_transfer': return <Building className="w-4 h-4" />;
      case 'insurance': return <FileText className="w-4 h-4" />;
      default: return <DollarSign className="w-4 h-4" />;
    }
  };

  const getExpenseTypeIcon = (type: string) => {
    switch (type) {
      case 'medication': return <Receipt className="w-4 h-4" />;
      case 'personal_care': return <User className="w-4 h-4" />;
      case 'food': return <TrendingUp className="w-4 h-4" />;
      case 'transportation': return <TrendingDown className="w-4 h-4" />;
      case 'entertainment': return <CheckCircle className="w-4 h-4" />;
      case 'other': return <AlertCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const calculateTotalRevenue = () => {
    return payments.reduce((total, payment) => total + payment.amount, 0);
  };

  const calculateTotalExpenses = () => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  };

  const calculateActiveAccommodations = () => {
    return accommodations.filter(acc => acc.status === 'active').length;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{t('finance')}</h1>
            <p className="text-muted-foreground">{t('accommodation_payments_expenses')}</p>
          </div>
        </div>

        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي الإيرادات</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{calculateTotalRevenue().toLocaleString()} ج.م</div>
              <p className="text-xs text-muted-foreground">من جميع المدفوعات</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي المصاريف</CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{calculateTotalExpenses().toLocaleString()} ج.م</div>
              <p className="text-xs text-muted-foreground">من المصاريف الشخصية</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">الإقامات النشطة</CardTitle>
              <Bed className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{calculateActiveAccommodations()}</div>
              <p className="text-xs text-muted-foreground">مرضى مقيمين حالياً</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">صافي الربح</CardTitle>
              <Calculator className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(calculateTotalRevenue() - calculateTotalExpenses()).toLocaleString()} ج.م</div>
              <p className="text-xs text-muted-foreground">الإيرادات - المصاريف</p>
            </CardContent>
          </Card>
        </div>

        {/* التبويبات */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="accommodation">الإقامة</TabsTrigger>
            <TabsTrigger value="payments">المدفوعات</TabsTrigger>
            <TabsTrigger value="expenses">المصاريف الشخصية</TabsTrigger>
          </TabsList>

          {/* تبويب الإقامة */}
          <TabsContent value="accommodation" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">سجلات الإقامة</h2>
              <Dialog open={isAddAccommodationOpen} onOpenChange={setIsAddAccommodationOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    إضافة إقامة جديدة
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>إضافة سجل إقامة جديد</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="patient">المريض</Label>
                      <Select value={newAccommodation.patient_id} onValueChange={(value) => setNewAccommodation({...newAccommodation, patient_id: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر المريض" />
                        </SelectTrigger>
                        <SelectContent>
                          {patients.map((patient) => (
                            <SelectItem key={patient.id} value={patient.id}>
                              {patient.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="room">رقم الغرفة</Label>
                      <Input
                        id="room"
                        value={newAccommodation.room_number}
                        onChange={(e) => setNewAccommodation({...newAccommodation, room_number: e.target.value})}
                        placeholder="مثال: 101"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="rate">السعر اليومي</Label>
                      <Input
                        id="rate"
                        type="number"
                        value={newAccommodation.daily_rate}
                        onChange={(e) => setNewAccommodation({...newAccommodation, daily_rate: e.target.value})}
                        placeholder="مثال: 500"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="checkin">تاريخ الدخول</Label>
                      <Input
                        id="checkin"
                        type="date"
                        value={newAccommodation.check_in_date}
                        onChange={(e) => setNewAccommodation({...newAccommodation, check_in_date: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="notes">ملاحظات</Label>
                      <Textarea
                        id="notes"
                        value={newAccommodation.notes}
                        onChange={(e) => setNewAccommodation({...newAccommodation, notes: e.target.value})}
                        placeholder="أي ملاحظات إضافية"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAddAccommodationOpen(false)}>
                      إلغاء
                    </Button>
                    <Button onClick={handleAddAccommodation}>
                      إضافة
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>المريض</TableHead>
                      <TableHead>رقم الغرفة</TableHead>
                      <TableHead>السعر اليومي</TableHead>
                      <TableHead>تاريخ الدخول</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {accommodations.map((accommodation) => (
                      <TableRow key={accommodation.id}>
                        <TableCell>{accommodation.patient_name}</TableCell>
                        <TableCell>{accommodation.room_number}</TableCell>
                        <TableCell>{accommodation.daily_rate.toLocaleString()} ج.م</TableCell>
                        <TableCell>{new Date(accommodation.check_in_date).toLocaleDateString('ar-EG')}</TableCell>
                        <TableCell>{getStatusBadge(accommodation.status)}</TableCell>
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

          {/* تبويب المدفوعات */}
          <TabsContent value="payments" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">المدفوعات</h2>
              <Dialog open={isAddPaymentOpen} onOpenChange={setIsAddPaymentOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    إضافة مدفوع جديد
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>إضافة مدفوع جديد</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="payment-patient">المريض</Label>
                      <Select value={newPayment.patient_id} onValueChange={(value) => setNewPayment({...newPayment, patient_id: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر المريض" />
                        </SelectTrigger>
                        <SelectContent>
                          {patients.map((patient) => (
                            <SelectItem key={patient.id} value={patient.id}>
                              {patient.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="amount">المبلغ</Label>
                      <Input
                        id="amount"
                        type="number"
                        value={newPayment.amount}
                        onChange={(e) => setNewPayment({...newPayment, amount: e.target.value})}
                        placeholder="مثال: 5000"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="payment-type">نوع الدفع</Label>
                      <Select value={newPayment.payment_type} onValueChange={(value: any) => setNewPayment({...newPayment, payment_type: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر نوع الدفع" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cash">نقدي</SelectItem>
                          <SelectItem value="card">بطاقة ائتمان</SelectItem>
                          <SelectItem value="bank_transfer">تحويل بنكي</SelectItem>
                          <SelectItem value="insurance">تأمين</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="payment-date">تاريخ الدفع</Label>
                      <Input
                        id="payment-date"
                        type="date"
                        value={newPayment.payment_date}
                        onChange={(e) => setNewPayment({...newPayment, payment_date: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="receipt">رقم الإيصال</Label>
                      <Input
                        id="receipt"
                        value={newPayment.receipt_number}
                        onChange={(e) => setNewPayment({...newPayment, receipt_number: e.target.value})}
                        placeholder="مثال: RCP001"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAddPaymentOpen(false)}>
                      إلغاء
                    </Button>
                    <Button onClick={handleAddPayment}>
                      إضافة
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>المريض</TableHead>
                      <TableHead>المبلغ</TableHead>
                      <TableHead>نوع الدفع</TableHead>
                      <TableHead>تاريخ الدفع</TableHead>
                      <TableHead>رقم الإيصال</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>{payment.patient_name}</TableCell>
                        <TableCell>{payment.amount.toLocaleString()} ج.م</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getPaymentTypeIcon(payment.payment_type)}
                            <span>
                              {payment.payment_type === 'cash' && 'نقدي'}
                              {payment.payment_type === 'card' && 'بطاقة ائتمان'}
                              {payment.payment_type === 'bank_transfer' && 'تحويل بنكي'}
                              {payment.payment_type === 'insurance' && 'تأمين'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{new Date(payment.payment_date).toLocaleDateString('ar-EG')}</TableCell>
                        <TableCell>{payment.receipt_number}</TableCell>
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

          {/* تبويب المصاريف الشخصية */}
          <TabsContent value="expenses" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">المصاريف الشخصية</h2>
              <Dialog open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    إضافة مصروف جديد
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>إضافة مصروف شخصي جديد</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="expense-patient">المريض</Label>
                      <Select value={newExpense.patient_id} onValueChange={(value) => setNewExpense({...newExpense, patient_id: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر المريض" />
                        </SelectTrigger>
                        <SelectContent>
                          {patients.map((patient) => (
                            <SelectItem key={patient.id} value={patient.id}>
                              {patient.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="expense-type">نوع المصروف</Label>
                      <Select value={newExpense.expense_type} onValueChange={(value: any) => setNewExpense({...newExpense, expense_type: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر نوع المصروف" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="medication">أدوية</SelectItem>
                          <SelectItem value="personal_care">رعاية شخصية</SelectItem>
                          <SelectItem value="food">طعام</SelectItem>
                          <SelectItem value="transportation">مواصلات</SelectItem>
                          <SelectItem value="entertainment">ترفيه</SelectItem>
                          <SelectItem value="other">أخرى</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="expense-amount">المبلغ</Label>
                      <Input
                        id="expense-amount"
                        type="number"
                        value={newExpense.amount}
                        onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                        placeholder="مثال: 150"
                      />
                    </div>
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
                      <Label htmlFor="expense-description">الوصف</Label>
                      <Textarea
                        id="expense-description"
                        value={newExpense.description}
                        onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                        placeholder="وصف المصروف"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="expense-receipt">رقم الإيصال</Label>
                      <Input
                        id="expense-receipt"
                        value={newExpense.receipt_number}
                        onChange={(e) => setNewExpense({...newExpense, receipt_number: e.target.value})}
                        placeholder="مثال: EXP001"
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

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>المريض</TableHead>
                      <TableHead>نوع المصروف</TableHead>
                      <TableHead>المبلغ</TableHead>
                      <TableHead>التاريخ</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expenses.map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell>{expense.patient_name}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getExpenseTypeIcon(expense.expense_type)}
                            <span>
                              {expense.expense_type === 'medication' && 'أدوية'}
                              {expense.expense_type === 'personal_care' && 'رعاية شخصية'}
                              {expense.expense_type === 'food' && 'طعام'}
                              {expense.expense_type === 'transportation' && 'مواصلات'}
                              {expense.expense_type === 'entertainment' && 'ترفيه'}
                              {expense.expense_type === 'other' && 'أخرى'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{expense.amount.toLocaleString()} ج.م</TableCell>
                        <TableCell>{new Date(expense.expense_date).toLocaleDateString('ar-EG')}</TableCell>
                        <TableCell>{getStatusBadge(expense.status)}</TableCell>
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
      </div>
    </div>
  );
};

export default Finance; 