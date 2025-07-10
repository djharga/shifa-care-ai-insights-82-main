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
import { Plus, Calendar, Clock, User, Edit, Trash2, Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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
  updated_at?: string;
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
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
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
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [showExtraFields, setShowExtraFields] = useState(false);

  useEffect(() => {
    fetchSessions();
    fetchPatients();
    fetchTherapists();
  }, []);

  const fetchSessions = async () => {
    try {
      setIsLoading(true);
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
    } catch (error: any) {
      console.error('Error fetching sessions:', error);
      toast({
        title: "خطأ في تحميل الجلسات",
        description: error.message || "حدث خطأ أثناء تحميل الجلسات",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('id, name')
        .eq('status', 'active');

      if (error) throw error;
      setPatients(data || []);
    } catch (error: any) {
      console.error('Error fetching patients:', error);
    }
  };

  const fetchTherapists = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('role', 'therapist');

      if (error) throw error;
      setTherapists(data || []);
    } catch (error: any) {
      console.error('Error fetching therapists:', error);
    }
  };

  const handleAddSession = async () => {
    if (!newSession.patient_id || !newSession.therapist_id || !newSession.session_date || !newSession.session_time) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const sessionData = {
        ...newSession,
        status: 'scheduled' as const
      };

      const { data, error } = await supabase
        .from('sessions')
        .insert([sessionData])
        .select(`
          *,
          patients (name),
          profiles (full_name)
        `)
        .single();

      if (error) throw error;

      setSessions(prev => [data, ...prev]);

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
      setShowExtraFields(false);
    } catch (error: any) {
      console.error('Error adding session:', error);
      toast({
        title: "خطأ في إضافة الجلسة",
        description: error.message || "حدث خطأ أثناء إضافة الجلسة",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewSession = (session: Session) => {
    setSelectedSession(session);
    setIsViewDialogOpen(true);
  };

  const handleEditSession = (session: Session) => {
    setEditingSession(session);
    setIsEditDialogOpen(true);
  };

  const handleUpdateSession = async () => {
    if (!editingSession) return;

    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('sessions')
        .update({
          patient_id: editingSession.patient_id,
          therapist_id: editingSession.therapist_id,
          session_date: editingSession.session_date,
          session_time: editingSession.session_time,
          session_type: editingSession.session_type,
          status: editingSession.status,
          duration: editingSession.duration,
          notes: editingSession.notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingSession.id);

      if (error) throw error;

      setSessions(prev => prev.map(s => 
        s.id === editingSession.id ? { ...editingSession, updated_at: new Date().toISOString() } : s
      ));

      toast({
        title: "تم تحديث الجلسة بنجاح",
        description: "تم حفظ التغييرات",
      });

      setIsEditDialogOpen(false);
      setEditingSession(null);
    } catch (error: any) {
      console.error('Error updating session:', error);
      toast({
        title: "خطأ في تحديث الجلسة",
        description: error.message || "حدث خطأ أثناء تحديث الجلسة",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الجلسة؟')) return;

    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('sessions')
        .delete()
        .eq('id', sessionId);

      if (error) throw error;

      setSessions(prev => prev.filter(s => s.id !== sessionId));
      toast({
        title: "تم حذف الجلسة بنجاح",
        description: "تم حذف الجلسة من النظام",
      });
    } catch (error: any) {
      console.error('Error deleting session:', error);
      toast({
        title: "خطأ في حذف الجلسة",
        description: error.message || "حدث خطأ أثناء حذف الجلسة",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{t('manage_sessions')}</h1>
            <p className="text-muted-foreground">{t('schedule_and_track_therapy_sessions')}</p>
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center space-x-2 rtl:space-x-reverse">
                <Plus className="h-4 w-4" />
                <span>{t('add_new_session')}</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>إضافة جلسة جديدة</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="patient">اسم المريض <span style={{color: 'red'}}>*</span></Label>
                  <Input id="patient" value={newSession.patient_id} onChange={e => setNewSession({...newSession, patient_id: e.target.value})} placeholder="اسم المريض" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="therapist">المعالج <span style={{color: 'red'}}>*</span></Label>
                  <Input id="therapist" value={newSession.therapist_id} onChange={e => setNewSession({...newSession, therapist_id: e.target.value})} placeholder="المعالج" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">تاريخ الجلسة <span style={{color: 'red'}}>*</span></Label>
                  <Input id="date" type="date" value={newSession.session_date} onChange={e => setNewSession({...newSession, session_date: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">الوقت <span style={{color: 'red'}}>*</span></Label>
                  <Input id="time" type="time" value={newSession.session_time} onChange={e => setNewSession({...newSession, session_time: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">نوع الجلسة <span style={{color: 'red'}}>*</span></Label>
                  <Select value={newSession.session_type} onValueChange={(value: 'individual' | 'group' | 'family') => setNewSession({...newSession, session_type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">فردية</SelectItem>
                      <SelectItem value="group">جماعية</SelectItem>
                      <SelectItem value="family">عائلية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">المدة (دقيقة) <span style={{color: 'red'}}>*</span></Label>
                  <Input id="duration" type="number" value={newSession.duration} onChange={e => setNewSession({...newSession, duration: parseInt(e.target.value)})} required min="15" max="180" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">ملاحظات</Label>
                  <Textarea id="notes" value={newSession.notes} onChange={e => setNewSession({...newSession, notes: e.target.value})} placeholder="ملاحظات الجلسة" />
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
              <CardTitle className="text-sm font-medium">{t('sessions_today')}</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">+2 عن الأمس</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('completed_sessions')}</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">هذا الشهر</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('attendance_rate')}</CardTitle>
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
            <CardTitle>{t('scheduled_sessions')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('patient')}</TableHead>
                    <TableHead>{t('therapist')}</TableHead>
                    <TableHead>{t('date')}</TableHead>
                    <TableHead>{t('time')}</TableHead>
                    <TableHead>{t('type')}</TableHead>
                    <TableHead>{t('duration')}</TableHead>
                    <TableHead>{t('status')}</TableHead>
                    <TableHead>الإجراءات</TableHead>
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
                      <TableCell>
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewSession(session)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditSession(session)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteSession(session.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* View Session Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>تفاصيل الجلسة</DialogTitle>
            </DialogHeader>
            {selectedSession && (
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">المريض</Label>
                  <p className="text-sm text-muted-foreground">{selectedSession.patients?.name || 'غير محدد'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">المعالج</Label>
                  <p className="text-sm text-muted-foreground">{selectedSession.profiles?.full_name || 'غير محدد'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">التاريخ</Label>
                  <p className="text-sm text-muted-foreground">{new Date(selectedSession.session_date).toLocaleDateString('ar-SA')}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">الوقت</Label>
                  <p className="text-sm text-muted-foreground">{selectedSession.session_time}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">نوع الجلسة</Label>
                  <p className="text-sm text-muted-foreground">{getSessionTypeLabel(selectedSession.session_type)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">المدة</Label>
                  <p className="text-sm text-muted-foreground">{selectedSession.duration} دقيقة</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">الحالة</Label>
                  <div className="mt-1">{getStatusBadge(selectedSession.status)}</div>
                </div>
                {selectedSession.notes && (
                  <div>
                    <Label className="text-sm font-medium">ملاحظات</Label>
                    <p className="text-sm text-muted-foreground">{selectedSession.notes}</p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Session Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>تعديل الجلسة</DialogTitle>
            </DialogHeader>
            {editingSession && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-patient">المريض</Label>
                  <Select value={editingSession.patient_id} onValueChange={(value) => setEditingSession({...editingSession, patient_id: value})}>
                    <SelectTrigger>
                      <SelectValue />
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
                  <Label htmlFor="edit-therapist">المعالج</Label>
                  <Select value={editingSession.therapist_id} onValueChange={(value) => setEditingSession({...editingSession, therapist_id: value})}>
                    <SelectTrigger>
                      <SelectValue />
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
                  <Label htmlFor="edit-date">التاريخ</Label>
                  <Input
                    id="edit-date"
                    type="date"
                    value={editingSession.session_date}
                    onChange={(e) => setEditingSession({...editingSession, session_date: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-time">الوقت</Label>
                  <Input
                    id="edit-time"
                    type="time"
                    value={editingSession.session_time}
                    onChange={(e) => setEditingSession({...editingSession, session_time: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-type">نوع الجلسة</Label>
                  <Select value={editingSession.session_type} onValueChange={(value: 'individual' | 'group' | 'family') => setEditingSession({...editingSession, session_type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">فردية</SelectItem>
                      <SelectItem value="group">جماعية</SelectItem>
                      <SelectItem value="family">عائلية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-duration">المدة (دقيقة)</Label>
                  <Input
                    id="edit-duration"
                    type="number"
                    value={editingSession.duration}
                    onChange={(e) => setEditingSession({...editingSession, duration: parseInt(e.target.value)})}
                    min="15"
                    max="180"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-status">الحالة</Label>
                  <Select value={editingSession.status} onValueChange={(value: 'scheduled' | 'completed' | 'cancelled' | 'no_show') => setEditingSession({...editingSession, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scheduled">مجدولة</SelectItem>
                      <SelectItem value="completed">مكتملة</SelectItem>
                      <SelectItem value="cancelled">ملغية</SelectItem>
                      <SelectItem value="no_show">لم يحضر</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-notes">ملاحظات</Label>
                  <Textarea
                    id="edit-notes"
                    value={editingSession.notes || ''}
                    onChange={(e) => setEditingSession({...editingSession, notes: e.target.value})}
                  />
                </div>

                <div className="flex space-x-2 rtl:space-x-reverse">
                  <Button onClick={handleUpdateSession} className="flex-1">
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

export default Sessions;