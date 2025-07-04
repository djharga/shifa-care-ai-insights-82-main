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
import { Plus, Calendar, Clock, User } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';

interface Session {
  id: string;
  patient_id: string;
  therapist_id: string;
  session_date: string;
  session_time: string;
  session_type: 'individual' | 'group' | 'family';
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  duration: number;
  notes?: string;
  created_at: string;
  patients?: {
    name: string;
  };
  profiles?: {
    full_name: string;
  };
}

const Sessions = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [therapists, setTherapists] = useState<any[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newSession, setNewSession] = useState({
    patient_id: '',
    therapist_id: '',
    session_date: '',
    session_time: '',
    session_type: 'individual' as 'individual' | 'group' | 'family',
    duration: 60,
    notes: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchSessions();
    fetchPatients();
    fetchTherapists();
  }, []);

  const fetchSessions = async () => {
    try {
      // Mock data for demonstration
      const mockSessions: Session[] = [
        {
          id: '1',
          patient_id: '1',
          therapist_id: '1',
          session_date: '2024-07-04',
          session_time: '10:00',
          session_type: 'individual',
          status: 'scheduled',
          duration: 60,
          notes: 'جلسة علاج سلوكي',
          created_at: '2024-07-03T10:00:00Z',
          patients: { name: 'أحمد محمد' },
          profiles: { full_name: 'د. سارة أحمد' }
        }
      ];
      
      setSessions(mockSessions);
      
      // Uncomment when database is set up:
      /*
      const { data, error } = await supabase
        .from('sessions')
        .select(`
          *,
          patients (name),
          profiles (full_name)
        `)
        .order('session_date', { ascending: false });

      if (error) throw error;
      setSessions(data || []);
      */
    } catch (error: any) {
      toast({
        title: "خطأ في تحميل الجلسات",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const fetchPatients = async () => {
    try {
      // Mock data
      const mockPatients = [
        { id: '1', name: 'أحمد محمد' },
        { id: '2', name: 'فاطمة علي' }
      ];
      setPatients(mockPatients);
      
      // Uncomment when database is set up:
      /*
      const { data, error } = await supabase
        .from('patients')
        .select('id, name')
        .eq('status', 'active');

      if (error) throw error;
      setPatients(data || []);
      */
    } catch (error: any) {
      console.error('Error fetching patients:', error);
    }
  };

  const fetchTherapists = async () => {
    try {
      // Mock data
      const mockTherapists = [
        { id: '1', full_name: 'د. سارة أحمد' },
        { id: '2', full_name: 'د. محمد علي' }
      ];
      setTherapists(mockTherapists);
      
      // Uncomment when database is set up:
      /*
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('role', 'therapist');

      if (error) throw error;
      setTherapists(data || []);
      */
    } catch (error: any) {
      console.error('Error fetching therapists:', error);
    }
  };

  const handleAddSession = async () => {
    try {
      // Mock implementation
      const newSessionWithId: Session = {
        ...newSession,
        id: Date.now().toString(),
        status: 'scheduled',
        created_at: new Date().toISOString(),
        patients: { name: patients.find(p => p.id === newSession.patient_id)?.name || 'غير محدد' },
        profiles: { full_name: therapists.find(t => t.id === newSession.therapist_id)?.full_name || 'غير محدد' }
      };
      
      setSessions(prev => [newSessionWithId, ...prev]);

      toast({
        title: "تم إضافة الجلسة بنجاح",
        description: "تم حفظ موعد الجلسة الجديدة",
      });

      setIsAddDialogOpen(false);
      setNewSession({
        patient_id: '',
        therapist_id: '',
        session_date: '',
        session_time: '',
        session_type: 'individual',
        duration: 60,
        notes: ''
      });
      
      // Uncomment when database is set up:
      /*
      const { error } = await supabase
        .from('sessions')
        .insert([newSession]);

      if (error) throw error;
      fetchSessions();
      */
    } catch (error: any) {
      toast({
        title: "خطأ في إضافة الجلسة",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      scheduled: { label: 'مجدولة', variant: 'default' as const },
      completed: { label: 'مكتملة', variant: 'default' as const },
      cancelled: { label: 'ملغية', variant: 'destructive' as const },
      no_show: { label: 'لم يحضر', variant: 'secondary' as const }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.scheduled;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getSessionTypeLabel = (type: string) => {
    const types = {
      individual: 'فردية',
      group: 'جماعية',
      family: 'عائلية'
    };
    return types[type as keyof typeof types] || type;
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">إدارة الجلسات</h1>
            <p className="text-muted-foreground">جدولة ومتابعة الجلسات العلاجية</p>
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center space-x-2 rtl:space-x-reverse">
                <Plus className="h-4 w-4" />
                <span>إضافة جلسة جديدة</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>إضافة جلسة جديدة</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="patient">المريض</Label>
                  <Select value={newSession.patient_id} onValueChange={(value) => setNewSession({...newSession, patient_id: value})}>
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

                <div className="space-y-2">
                  <Label htmlFor="therapist">المعالج</Label>
                  <Select value={newSession.therapist_id} onValueChange={(value) => setNewSession({...newSession, therapist_id: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المعالج" />
                    </SelectTrigger>
                    <SelectContent>
                      {therapists.map((therapist) => (
                        <SelectItem key={therapist.id} value={therapist.id}>
                          {therapist.full_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">تاريخ الجلسة</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newSession.session_date}
                    onChange={(e) => setNewSession({...newSession, session_date: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">وقت الجلسة</Label>
                  <Input
                    id="time"
                    type="time"
                    value={newSession.session_time}
                    onChange={(e) => setNewSession({...newSession, session_time: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">نوع الجلسة</Label>
                  <Select value={newSession.session_type} onValueChange={(value: 'individual' | 'group' | 'family') => setNewSession({...newSession, session_type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر نوع الجلسة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">فردية</SelectItem>
                      <SelectItem value="group">جماعية</SelectItem>
                      <SelectItem value="family">عائلية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">المدة (بالدقائق)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={newSession.duration}
                    onChange={(e) => setNewSession({...newSession, duration: parseInt(e.target.value)})}
                    min="15"
                    max="180"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">ملاحظات</Label>
                  <Textarea
                    id="notes"
                    value={newSession.notes}
                    onChange={(e) => setNewSession({...newSession, notes: e.target.value})}
                    placeholder="أدخل أي ملاحظات حول الجلسة"
                  />
                </div>

                <Button onClick={handleAddSession} className="w-full">
                  إضافة الجلسة
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">جلسات اليوم</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">+2 عن الأمس</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">الجلسات المكتملة</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">هذا الشهر</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">معدل الحضور</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">92%</div>
              <p className="text-xs text-muted-foreground">+5% عن الشهر الماضي</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>الجلسات المجدولة</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>المريض</TableHead>
                  <TableHead>المعالج</TableHead>
                  <TableHead>التاريخ</TableHead>
                  <TableHead>الوقت</TableHead>
                  <TableHead>النوع</TableHead>
                  <TableHead>المدة</TableHead>
                  <TableHead>الحالة</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell className="font-medium">
                      {session.patients?.name || 'غير محدد'}
                    </TableCell>
                    <TableCell>{session.profiles?.full_name || 'غير محدد'}</TableCell>
                    <TableCell>{new Date(session.session_date).toLocaleDateString('ar-SA')}</TableCell>
                    <TableCell>{session.session_time}</TableCell>
                    <TableCell>{getSessionTypeLabel(session.session_type)}</TableCell>
                    <TableCell>{session.duration} دقيقة</TableCell>
                    <TableCell>{getStatusBadge(session.status)}</TableCell>
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

export default Sessions;