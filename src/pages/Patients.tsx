import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Eye, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';

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
  created_at?: string;
  updated_at?: string;
}

const Patients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(false);
  const [newPatient, setNewPatient] = useState({
    name: '',
    phone: '',
    email: '',
    date_of_birth: '',
    gender: 'male' as 'male' | 'female',
    addiction_type: '',
    notes: ''
  });
  const [showExtraFields, setShowExtraFields] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPatients(data || []);
    } catch (error: any) {
      console.error('Error fetching patients:', error);
      toast({
        title: "خطأ في تحميل البيانات",
        description: error.message || "حدث خطأ أثناء تحميل بيانات المرضى",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddPatient = async () => {
    if (!newPatient.name || !newPatient.phone || !newPatient.addiction_type) {
      toast({
        title: "بيانات مطلوبة",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const patientData = {
        ...newPatient,
        status: 'active' as const,
        admission_date: new Date().toISOString().split('T')[0]
      };

      const { data, error } = await supabase
        .from('patients')
        .insert([patientData])
        .select()
        .single();

      if (error) throw error;

      setPatients(prev => [data, ...prev]);
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
      setShowExtraFields(false);
    } catch (error: any) {
      console.error('Error adding patient:', error);
      toast({
        title: "خطأ في إضافة المريض",
        description: error.message || "حدث خطأ أثناء إضافة المريض",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsViewDialogOpen(true);
  };

  const handleEditPatient = (patient: Patient) => {
    setEditingPatient(patient);
    setIsEditDialogOpen(true);
  };

  const handleUpdatePatient = async () => {
    if (!editingPatient) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('patients')
        .update({
          name: editingPatient.name,
          phone: editingPatient.phone,
          email: editingPatient.email,
          date_of_birth: editingPatient.date_of_birth,
          gender: editingPatient.gender,
          addiction_type: editingPatient.addiction_type,
          status: editingPatient.status,
          notes: editingPatient.notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingPatient.id);

      if (error) throw error;

      setPatients(prev => prev.map(p => 
        p.id === editingPatient.id ? { ...editingPatient, updated_at: new Date().toISOString() } : p
      ));

      toast({
        title: "تم تحديث بيانات المريض",
        description: "تم حفظ التغييرات بنجاح",
      });

      setIsEditDialogOpen(false);
      setEditingPatient(null);
    } catch (error: any) {
      console.error('Error updating patient:', error);
      toast({
        title: "خطأ في تحديث البيانات",
        description: error.message || "حدث خطأ أثناء تحديث بيانات المريض",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePatient = async (patientId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المريض؟')) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('patients')
        .delete()
        .eq('id', patientId);

      if (error) throw error;

      setPatients(prev => prev.filter(p => p.id !== patientId));
      toast({
        title: "تم حذف المريض",
        description: "تم حذف بيانات المريض بنجاح",
      });
    } catch (error: any) {
      console.error('Error deleting patient:', error);
      toast({
        title: "خطأ في حذف المريض",
        description: error.message || "حدث خطأ أثناء حذف المريض",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
                  <Label htmlFor="name">الاسم الكامل <span style={{color: 'red'}}>*</span></Label>
                  <Input id="name" value={newPatient.name} onChange={e => setNewPatient({...newPatient, name: e.target.value})} placeholder="أدخل الاسم الكامل" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">رقم الهاتف <span style={{color: 'red'}}>*</span></Label>
                  <Input id="phone" value={newPatient.phone} onChange={e => setNewPatient({...newPatient, phone: e.target.value})} placeholder="أدخل رقم الهاتف" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="addiction">نوع الإدمان <span style={{color: 'red'}}>*</span></Label>
                  <Input id="addiction" value={newPatient.addiction_type} onChange={e => setNewPatient({...newPatient, addiction_type: e.target.value})} placeholder="مثال: المخدرات، الكحول، التدخين" required />
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
                      <Input id="email" type="email" value={newPatient.email} onChange={e => setNewPatient({...newPatient, email: e.target.value})} placeholder="أدخل البريد الإلكتروني" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dob">تاريخ الميلاد</Label>
                      <Input id="dob" type="date" value={newPatient.date_of_birth} onChange={e => setNewPatient({...newPatient, date_of_birth: e.target.value})} />
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
                      <Label htmlFor="notes">ملاحظات</Label>
                      <Textarea id="notes" value={newPatient.notes} onChange={e => setNewPatient({...newPatient, notes: e.target.value})} placeholder="أدخل أي ملاحظات إضافية" />
                    </div>
                  </>
                )}
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
            <div className="overflow-x-auto w-full">
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
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        جاري التحميل...
                      </TableCell>
                    </TableRow>
                  ) : filteredPatients.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        لا يوجد مرضى مطابقة للبحث.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPatients.map((patient) => (
                      <TableRow key={patient.id}>
                        <TableCell className="font-medium">{patient.name}</TableCell>
                        <TableCell>{patient.phone}</TableCell>
                        <TableCell>{patient.addiction_type}</TableCell>
                        <TableCell>{getStatusBadge(patient.status)}</TableCell>
                        <TableCell>{new Date(patient.admission_date).toLocaleDateString('ar-SA')}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2 rtl:space-x-reverse">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewPatient(patient)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditPatient(patient)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDeletePatient(patient.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* View Patient Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>تفاصيل المريض</DialogTitle>
            </DialogHeader>
            {selectedPatient && (
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">الاسم الكامل</Label>
                  <p className="text-sm text-muted-foreground">{selectedPatient.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">رقم الهاتف</Label>
                  <p className="text-sm text-muted-foreground">{selectedPatient.phone}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">البريد الإلكتروني</Label>
                  <p className="text-sm text-muted-foreground">{selectedPatient.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">تاريخ الميلاد</Label>
                  <p className="text-sm text-muted-foreground">{new Date(selectedPatient.date_of_birth).toLocaleDateString('ar-SA')}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">الجنس</Label>
                  <p className="text-sm text-muted-foreground">{selectedPatient.gender === 'male' ? 'ذكر' : 'أنثى'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">نوع الإدمان</Label>
                  <p className="text-sm text-muted-foreground">{selectedPatient.addiction_type}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">الحالة</Label>
                  <div className="mt-1">{getStatusBadge(selectedPatient.status)}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">تاريخ الدخول</Label>
                  <p className="text-sm text-muted-foreground">{new Date(selectedPatient.admission_date).toLocaleDateString('ar-SA')}</p>
                </div>
                {selectedPatient.notes && (
                  <div>
                    <Label className="text-sm font-medium">ملاحظات</Label>
                    <p className="text-sm text-muted-foreground">{selectedPatient.notes}</p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Patient Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>تعديل بيانات المريض</DialogTitle>
            </DialogHeader>
            {editingPatient && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">الاسم الكامل</Label>
                  <Input
                    id="edit-name"
                    value={editingPatient.name}
                    onChange={(e) => setEditingPatient({...editingPatient, name: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-phone">رقم الهاتف</Label>
                  <Input
                    id="edit-phone"
                    value={editingPatient.phone}
                    onChange={(e) => setEditingPatient({...editingPatient, phone: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-email">البريد الإلكتروني</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={editingPatient.email}
                    onChange={(e) => setEditingPatient({...editingPatient, email: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-dob">تاريخ الميلاد</Label>
                  <Input
                    id="edit-dob"
                    type="date"
                    value={editingPatient.date_of_birth}
                    onChange={(e) => setEditingPatient({...editingPatient, date_of_birth: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-gender">الجنس</Label>
                  <Select value={editingPatient.gender} onValueChange={(value: 'male' | 'female') => setEditingPatient({...editingPatient, gender: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">ذكر</SelectItem>
                      <SelectItem value="female">أنثى</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-addiction">نوع الإدمان</Label>
                  <Input
                    id="edit-addiction"
                    value={editingPatient.addiction_type}
                    onChange={(e) => setEditingPatient({...editingPatient, addiction_type: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-status">الحالة</Label>
                  <Select value={editingPatient.status} onValueChange={(value: 'active' | 'completed' | 'paused' | 'dropped_out') => setEditingPatient({...editingPatient, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">نشط</SelectItem>
                      <SelectItem value="completed">مكتمل</SelectItem>
                      <SelectItem value="paused">متوقف مؤقتاً</SelectItem>
                      <SelectItem value="dropped_out">منسحب</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-notes">ملاحظات</Label>
                  <Textarea
                    id="edit-notes"
                    value={editingPatient.notes || ''}
                    onChange={(e) => setEditingPatient({...editingPatient, notes: e.target.value})}
                  />
                </div>

                <div className="flex space-x-2 rtl:space-x-reverse">
                  <Button onClick={handleUpdatePatient} className="flex-1">
                    حفظ التغييرات
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditDialogOpen(false)}
                    className="flex-1"
                  >
                    إلغاء
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Patients;