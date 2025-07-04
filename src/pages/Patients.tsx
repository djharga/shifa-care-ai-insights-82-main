import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Search, Edit, Eye } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';

interface Patient {
  id: string;
  name: string;
  phone: string;
  email: string;
  date_of_birth: string;
  gender: 'male' | 'female';
  addiction_type: string;
  status: 'active' | 'completed' | 'paused' | 'dropped_out';
  admission_date: string;
  notes?: string;
}

const Patients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newPatient, setNewPatient] = useState({
    name: '',
    phone: '',
    email: '',
    date_of_birth: '',
    gender: 'male' as 'male' | 'female',
    addiction_type: '',
    notes: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      // Mock data for demonstration since database types are not available
      const mockPatients: Patient[] = [
        {
          id: '1',
          name: 'أحمد محمد',
          phone: '0501234567',
          email: 'ahmed@example.com',
          date_of_birth: '1990-01-01',
          gender: 'male',
          addiction_type: 'المخدرات',
          status: 'active',
          admission_date: '2024-01-15',
          notes: 'مريض متعاون'
        },
        {
          id: '2',
          name: 'فاطمة علي',
          phone: '0507654321',
          email: 'fatima@example.com',
          date_of_birth: '1985-05-10',
          gender: 'female',
          addiction_type: 'التدخين',
          status: 'active',
          admission_date: '2024-02-20',
          notes: 'تحسن ملحوظ'
        }
      ];
      
      setPatients(mockPatients);
      
      // Uncomment this when database is properly set up:
      /*
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPatients(data || []);
      */
    } catch (error: any) {
      toast({
        title: "خطأ في تحميل البيانات",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleAddPatient = async () => {
    try {
      // Mock implementation for demonstration
      const newPatientWithId: Patient = {
        ...newPatient,
        id: Date.now().toString(),
        status: 'active',
        admission_date: new Date().toISOString().split('T')[0]
      };
      
      setPatients(prev => [newPatientWithId, ...prev]);

      toast({
        title: "تم إضافة المريض بنجاح",
        description: "تم حفظ بيانات المريض الجديد",
      });

      setIsAddDialogOpen(false);
      setNewPatient({
        name: '',
        phone: '',
        email: '',
        date_of_birth: '',
        gender: 'male',
        addiction_type: '',
        notes: ''
      });
      
      // Uncomment this when database is properly set up:
      /*
      const { error } = await supabase
        .from('patients')
        .insert([newPatient]);

      if (error) throw error;
      fetchPatients();
      */
    } catch (error: any) {
      toast({
        title: "خطأ في إضافة المريض",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: 'نشط', variant: 'default' as const },
      completed: { label: 'مكتمل', variant: 'default' as const },
      paused: { label: 'متوقف مؤقتاً', variant: 'secondary' as const },
      dropped_out: { label: 'منسحب', variant: 'destructive' as const }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm) ||
    patient.addiction_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">إدارة المرضى</h1>
            <p className="text-muted-foreground">إدارة ومتابعة ملفات المرضى</p>
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center space-x-2 rtl:space-x-reverse">
                <Plus className="h-4 w-4" />
                <span>إضافة مريض جديد</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>إضافة مريض جديد</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">الاسم الكامل</Label>
                  <Input
                    id="name"
                    value={newPatient.name}
                    onChange={(e) => setNewPatient({...newPatient, name: e.target.value})}
                    placeholder="أدخل الاسم الكامل"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">رقم الهاتف</Label>
                  <Input
                    id="phone"
                    value={newPatient.phone}
                    onChange={(e) => setNewPatient({...newPatient, phone: e.target.value})}
                    placeholder="أدخل رقم الهاتف"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newPatient.email}
                    onChange={(e) => setNewPatient({...newPatient, email: e.target.value})}
                    placeholder="أدخل البريد الإلكتروني"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dob">تاريخ الميلاد</Label>
                  <Input
                    id="dob"
                    type="date"
                    value={newPatient.date_of_birth}
                    onChange={(e) => setNewPatient({...newPatient, date_of_birth: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">الجنس</Label>
                  <Select value={newPatient.gender} onValueChange={(value: 'male' | 'female') => setNewPatient({...newPatient, gender: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الجنس" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">ذكر</SelectItem>
                      <SelectItem value="female">أنثى</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="addiction">نوع الإدمان</Label>
                  <Input
                    id="addiction"
                    value={newPatient.addiction_type}
                    onChange={(e) => setNewPatient({...newPatient, addiction_type: e.target.value})}
                    placeholder="مثال: المخدرات، الكحول، التدخين"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">ملاحظات</Label>
                  <Textarea
                    id="notes"
                    value={newPatient.notes}
                    onChange={(e) => setNewPatient({...newPatient, notes: e.target.value})}
                    placeholder="أدخل أي ملاحظات إضافية"
                  />
                </div>

                <Button onClick={handleAddPatient} className="w-full">
                  إضافة المريض
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="البحث عن مريض..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الاسم</TableHead>
                  <TableHead>رقم الهاتف</TableHead>
                  <TableHead>نوع الإدمان</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>تاريخ الدخول</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-medium">{patient.name}</TableCell>
                    <TableCell>{patient.phone}</TableCell>
                    <TableCell>{patient.addiction_type}</TableCell>
                    <TableCell>{getStatusBadge(patient.status)}</TableCell>
                    <TableCell>{new Date(patient.admission_date).toLocaleDateString('ar-SA')}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Patients;