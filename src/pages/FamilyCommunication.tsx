import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  MessageSquare, 
  Plus, 
  Star,
  Heart,
  Eye,
  Download,
  Search,
  UserPlus,
  Calendar,
  FileText,
  Phone,
  Mail,
  MapPin,
  Clock,
  Send
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { GoogleAIService } from '@/services/google-ai-service';
import { supabase } from '@/integrations/supabase/client';

interface Family {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  patient_name: string;
  patient_id: string;
  relationship: string;
  status: 'active' | 'inactive';
  last_contact: string;
  preferences: {
    notifications: boolean;
    reports: boolean;
    visits: boolean;
    language: 'ar' | 'en';
  };
  created_at?: string;
  updated_at?: string;
}

interface Message {
  id: string;
  family_id: string;
  family_name: string;
  type: 'notification' | 'report' | 'reminder' | 'general';
  title: string;
  content: string;
  status: 'sent' | 'delivered' | 'read';
  sent_at: string;
  priority: 'low' | 'medium' | 'high';
  created_at?: string;
}

interface Visit {
  id: string;
  family_id: string;
  family_name: string;
  patient_name: string;
  date: string;
  time: string;
  duration: string;
  purpose: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes: string;
  created_at?: string;
}

interface Report {
  id: string;
  family_id: string;
  family_name: string;
  patient_name: string;
  type: 'weekly' | 'monthly' | 'progress' | 'treatment';
  title: string;
  content: string;
  generated_at: string;
  status: 'draft' | 'sent' | 'read';
  created_at?: string;
}

const FamilyCommunication = () => {
  const { toast } = useToast();
  const [families, setFamilies] = useState<Family[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedTab, setSelectedTab] = useState('families');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [aiService] = useState(() => new GoogleAIService());
  const [isGeneratingMessage, setIsGeneratingMessage] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [showSendDialog, setShowSendDialog] = useState(false);
  const [showVisitDialog, setShowVisitDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // State for forms
  const [newFamily, setNewFamily] = useState({
    name: '',
    patient_name: '',
    relationship: '',
    phone: '',
    email: '',
    address: ''
  });
  
  const [newMessage, setNewMessage] = useState({
    family_id: '',
    type: '',
    title: '',
    content: '',
    priority: 'medium'
  });
  
  const [newVisit, setNewVisit] = useState({
    family_id: '',
    date: '',
    time: '',
    duration: '',
    purpose: ''
  });
  
  const [newReport, setNewReport] = useState({
    family_id: '',
    type: '',
    title: '',
    content: ''
  });

  useEffect(() => {
    fetchFamilies();
    fetchMessages();
    fetchVisits();
    fetchReports();
  }, []);

  const fetchFamilies = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('families')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFamilies(data || []);
    } catch (error: any) {
      console.error('Error fetching families:', error);
      toast({
        title: "خطأ في تحميل بيانات العائلات",
        description: error.message || "حدث خطأ أثناء تحميل بيانات العائلات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('family_messages')
        .select('*')
        .order('sent_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error: any) {
      console.error('Error fetching messages:', error);
    }
  };

  const fetchVisits = async () => {
    try {
      const { data, error } = await supabase
        .from('family_visits')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      setVisits(data || []);
    } catch (error: any) {
      console.error('Error fetching visits:', error);
    }
  };

  const fetchReports = async () => {
    try {
      const { data, error } = await supabase
        .from('family_reports')
        .select('*')
        .order('generated_at', { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (error: any) {
      console.error('Error fetching reports:', error);
    }
  };

  const handleAddFamily = async () => {
    if (!newFamily.name || !newFamily.patient_name || !newFamily.phone) {
      toast({
        title: "بيانات مطلوبة",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const familyData = {
        ...newFamily,
        status: 'active' as const,
        last_contact: new Date().toISOString().split('T')[0],
      preferences: {
        notifications: true,
        reports: true,
        visits: true,
          language: 'ar' as const
      }
    };

      const { data, error } = await supabase
        .from('families')
        .insert([familyData])
        .select()
        .single();

      if (error) throw error;

      setFamilies(prev => [data, ...prev]);
    toast({
        title: "تم إضافة العائلة بنجاح",
        description: "تم حفظ بيانات العائلة الجديدة",
    });

    setNewFamily({
      name: '',
        patient_name: '',
      relationship: '',
      phone: '',
      email: '',
      address: ''
    });
    } catch (error: any) {
      console.error('Error adding family:', error);
      toast({
        title: "خطأ في إضافة العائلة",
        description: error.message || "حدث خطأ أثناء إضافة العائلة",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.family_id || !newMessage.title || !newMessage.content) {
      toast({
        title: "بيانات مطلوبة",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const family = families.find(f => f.id === newMessage.family_id);
      if (!family) throw new Error('العائلة غير موجودة');

      const messageData = {
        family_id: newMessage.family_id,
        family_name: family.name,
        type: newMessage.type as 'notification' | 'report' | 'reminder' | 'general',
      title: newMessage.title,
      content: newMessage.content,
        status: 'sent' as const,
        sent_at: new Date().toISOString(),
        priority: newMessage.priority as 'low' | 'medium' | 'high'
    };

      const { data, error } = await supabase
        .from('family_messages')
        .insert([messageData])
        .select()
        .single();

      if (error) throw error;

      setMessages(prev => [data, ...prev]);
    toast({
        title: "تم إرسال الرسالة بنجاح",
        description: "تم إرسال الرسالة إلى العائلة",
    });

    setNewMessage({
        family_id: '',
      type: '',
      title: '',
      content: '',
      priority: 'medium'
    });
      setShowSendDialog(false);
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: "خطأ في إرسال الرسالة",
        description: error.message || "حدث خطأ أثناء إرسال الرسالة",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleVisit = async () => {
    if (!newVisit.family_id || !newVisit.date || !newVisit.time) {
      toast({
        title: "بيانات مطلوبة",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const family = families.find(f => f.id === newVisit.family_id);
      if (!family) throw new Error('العائلة غير موجودة');

      const visitData = {
        family_id: newVisit.family_id,
        family_name: family.name,
        patient_name: family.patient_name,
      date: newVisit.date,
      time: newVisit.time,
        duration: newVisit.duration,
      purpose: newVisit.purpose,
        status: 'scheduled' as const,
      notes: ''
    };

      const { data, error } = await supabase
        .from('family_visits')
        .insert([visitData])
        .select()
        .single();

      if (error) throw error;

      setVisits(prev => [data, ...prev]);
    toast({
        title: "تم جدولة الزيارة بنجاح",
        description: "تم إضافة الزيارة إلى الجدول",
    });

    setNewVisit({
        family_id: '',
      date: '',
      time: '',
      duration: '',
      purpose: ''
    });
      setShowVisitDialog(false);
    } catch (error: any) {
      console.error('Error scheduling visit:', error);
      toast({
        title: "خطأ في جدولة الزيارة",
        description: error.message || "حدث خطأ أثناء جدولة الزيارة",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    if (!newReport.family_id || !newReport.type) {
      toast({
        title: "بيانات مطلوبة",
        description: "يرجى اختيار العائلة ونوع التقرير",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsGeneratingReport(true);
      const family = families.find(f => f.id === newReport.family_id);
      if (!family) throw new Error('العائلة غير موجودة');

      const reportContent = await generateSmartReport(
        family.name,
        family.patient_name,
        newReport.type,
        'بيانات المريض الحالية'
      );

      const reportData = {
        family_id: newReport.family_id,
        family_name: family.name,
        patient_name: family.patient_name,
        type: newReport.type as 'weekly' | 'monthly' | 'progress' | 'treatment',
        title: newReport.title || `تقرير ${newReport.type} - ${family.patient_name}`,
        content: reportContent,
        generated_at: new Date().toISOString(),
        status: 'draft' as const
      };

      const { data, error } = await supabase
        .from('family_reports')
        .insert([reportData])
        .select()
        .single();

      if (error) throw error;

      setReports(prev => [data, ...prev]);
    toast({
        title: "تم إنشاء التقرير بنجاح",
        description: "تم إنشاء التقرير وحفظه",
    });

    setNewReport({
        family_id: '',
      type: '',
      title: '',
      content: ''
    });
    } catch (error: any) {
      console.error('Error generating report:', error);
      toast({
        title: "خطأ في إنشاء التقرير",
        description: error.message || "حدث خطأ أثناء إنشاء التقرير",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingReport(false);
    }
  };

  // دالة إنشاء رسالة ذكية باللهجة المصرية
  const generateSmartMessage = async (familyName: string, messageType: string, context: string) => {
    setIsGeneratingMessage(true);
    try {
      const prompt = `
      أنت مساعد ذكي لمركز علاج الإدمان. اكتب رسالة ${messageType} للعائلة "${familyName}" باللهجة المصرية المهنية.
      
      السياق: ${context}
      
      اكتب رسالة:
      - باللهجة المصرية المهنية
      - واضحة ومفهومة
      - محترمة ومشجعة
      - مناسبة لنوع الرسالة المطلوب
      
      اكتب الرسالة فقط بدون أي تعليقات إضافية.
      `;

      const result = await aiService.callGoogleAI([
        { role: 'system', content: 'أنت مساعد ذكي لمركز علاج الإدمان، تكتب رسائل للعائلات باللهجة المصرية المهنية.' },
        { role: 'user', content: prompt }
      ]);

      if (result.success && result.data) {
        return result.data;
      } else {
        throw new Error(result.error || 'فشل في إنشاء الرسالة');
      }
    } catch (error) {
      console.error('خطأ في إنشاء الرسالة الذكية:', error);
      toast({
        title: "خطأ",
        description: "فشل في إنشاء الرسالة الذكية",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsGeneratingMessage(false);
    }
  };

  // دالة إنشاء تقرير ذكي باللهجة المصرية
  const generateSmartReport = async (familyName: string, patientName: string, reportType: string, patientData: string) => {
    setIsGeneratingReport(true);
    try {
      const prompt = `
      أنت خبير في علاج الإدمان. اكتب تقرير ${reportType} للعائلة "${familyName}" عن المريض "${patientName}" باللهجة المصرية المهنية.
      
      بيانات المريض: ${patientData}
      
      اكتب تقرير شامل يتضمن:
      - ملخص الحالة الحالية
      - التقدم المحرز
      - التحديات والمخاوف
      - التوصيات للعائلة
      - خطة المتابعة
      
      اكتب التقرير باللهجة المصرية المهنية والواضحة.
      `;

      const result = await aiService.callGoogleAI([
        { role: 'system', content: 'أنت خبير في علاج الإدمان، تكتب تقارير للعائلات باللهجة المصرية المهنية.' },
        { role: 'user', content: prompt }
      ]);

      if (result.success && result.data) {
        return result.data;
      } else {
        throw new Error(result.error || 'فشل في إنشاء التقرير');
      }
    } catch (error) {
      console.error('خطأ في إنشاء التقرير الذكي:', error);
      toast({
        title: "خطأ",
        description: "فشل في إنشاء التقرير الذكي",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const filteredFamilies = families.filter(family => {
    const matchesSearch = family.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         family.patient_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || family.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMessageTypeColor = (type: string) => {
    switch (type) {
      case 'notification': return 'bg-blue-100 text-blue-800';
      case 'report': return 'bg-purple-100 text-purple-800';
      case 'reminder': return 'bg-orange-100 text-orange-800';
      case 'general': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">التواصل مع الأسر</h1>
          <p className="text-gray-600 mt-2">إدارة التواصل مع أسر المرضى والتقارير</p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <UserPlus className="w-4 h-4 mr-2" />
                إضافة عائلة جديدة
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>إضافة عائلة جديدة</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="familyName">اسم العائلة</Label>
                  <Input 
                    id="familyName" 
                    placeholder="اسم العائلة"
                    value={newFamily.name}
                    onChange={(e) => setNewFamily(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="patientName">اسم المريض</Label>
                  <Input 
                    id="patientName" 
                    placeholder="اسم المريض"
                    value={newFamily.patient_name}
                    onChange={(e) => setNewFamily(prev => ({ ...prev, patient_name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="relationship">صلة القرابة</Label>
                  <Select value={newFamily.relationship} onValueChange={(value) => setNewFamily(prev => ({ ...prev, relationship: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر صلة القرابة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="father">أب</SelectItem>
                      <SelectItem value="mother">أم</SelectItem>
                      <SelectItem value="brother">أخ</SelectItem>
                      <SelectItem value="sister">أخت</SelectItem>
                      <SelectItem value="spouse">زوج/زوجة</SelectItem>
                      <SelectItem value="other">أخرى</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="phone">رقم الهاتف</Label>
                  <Input 
                    id="phone" 
                    placeholder="0123456789"
                    value={newFamily.phone}
                    onChange={(e) => setNewFamily(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="example@email.com"
                    value={newFamily.email}
                    onChange={(e) => setNewFamily(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="address">العنوان</Label>
                  <Textarea 
                    id="address" 
                    placeholder="عنوان العائلة"
                    value={newFamily.address}
                    onChange={(e) => setNewFamily(prev => ({ ...prev, address: e.target.value }))}
                  />
                </div>
                <Button onClick={handleAddFamily} className="w-full">
                  إضافة العائلة
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm text-gray-600">إجمالي الأسر</p>
                <p className="text-2xl font-bold">{families.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <MessageSquare className="w-8 h-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm text-gray-600">الرسائل المرسلة</p>
                <p className="text-2xl font-bold">{messages.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm text-gray-600">الزيارات المجدولة</p>
                <p className="text-2xl font-bold">{visits.filter(v => v.status === 'scheduled').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <FileText className="w-8 h-8 text-orange-600" />
              <div className="ml-3">
                <p className="text-sm text-gray-600">التقارير المرسلة</p>
                <p className="text-2xl font-bold">{reports.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="families">الأسر</TabsTrigger>
          <TabsTrigger value="messages">الرسائل</TabsTrigger>
          <TabsTrigger value="visits">الزيارات</TabsTrigger>
          <TabsTrigger value="reports">التقارير</TabsTrigger>
        </TabsList>

        {/* Families Tab */}
        <TabsContent value="families" className="space-y-4">
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="البحث في الأسر..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="اختر الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="active">نشط</SelectItem>
                <SelectItem value="inactive">غير نشط</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFamilies.map((family) => (
              <Card key={family.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{family.name}</CardTitle>
                      <p className="text-sm text-gray-600">المريض: {family.patient_name}</p>
                    </div>
                    <Badge className={getStatusColor(family.status)}>
                      {family.status === 'active' ? 'نشط' : 'غير نشط'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center text-sm">
                    <Phone className="w-4 h-4 text-gray-400 mr-2" />
                    {family.phone}
                  </div>
                  <div className="flex items-center text-sm">
                    <Mail className="w-4 h-4 text-gray-400 mr-2" />
                    {family.email}
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                    {family.address}
                  </div>
                  <div className="flex items-center text-sm">
                    <Heart className="w-4 h-4 text-gray-400 mr-2" />
                    {family.relationship}
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-600">
                        آخر تواصل: {family.last_contact}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSendMessage()}
                      className="flex-1"
                    >
                      <MessageSquare className="w-3 h-3 mr-1" />
                      إرسال رسالة
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleScheduleVisit()}
                      className="flex-1"
                    >
                      <Calendar className="w-3 h-3 mr-1" />
                      جدولة زيارة
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Messages Tab */}
        <TabsContent value="messages" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">الرسائل والإشعارات</h3>
            <Dialog>
              <DialogTrigger asChild>
                <Button onClick={() => setShowSendDialog(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  إرسال رسالة جديدة
                </Button>
              </DialogTrigger>
              <Dialog open={showSendDialog} onOpenChange={setShowSendDialog}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>إرسال رسالة جديدة</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="recipient">المستقبل</Label>
                      <Select value={newMessage.family_id} onValueChange={(value) => setNewMessage(prev => ({ ...prev, family_id: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر العائلة" />
                        </SelectTrigger>
                        <SelectContent>
                          {families.map(f => (
                            <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="messageType">نوع الرسالة</Label>
                      <Select value={newMessage.type} onValueChange={(value) => setNewMessage(prev => ({ ...prev, type: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر نوع الرسالة" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="notification">إشعار</SelectItem>
                          <SelectItem value="report">تقرير</SelectItem>
                          <SelectItem value="reminder">تذكير</SelectItem>
                          <SelectItem value="general">عامة</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="title">العنوان</Label>
                      <Input 
                        id="title" 
                        placeholder="عنوان الرسالة"
                        value={newMessage.title}
                        onChange={(e) => setNewMessage(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="content">المحتوى</Label>
                      <div className="space-y-2">
                        <Textarea 
                          id="content" 
                          placeholder="محتوى الرسالة" 
                          rows={4}
                          value={newMessage.content}
                          onChange={(e) => setNewMessage(prev => ({ ...prev, content: e.target.value }))}
                        />
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={async () => {
                              const family = families.find(f => f.id === newMessage.family_id);
                              if (family && newMessage.type) {
                                const smartMessage = await generateSmartMessage(
                                  family.name,
                                  newMessage.type,
                                  'رسالة عامة للتواصل مع العائلة'
                                );
                                
                                if (smartMessage) {
                                  setNewMessage(prev => ({ ...prev, content: smartMessage }));
                                  toast({
                                    title: "تم إنشاء الرسالة",
                                    description: "تم إنشاء رسالة ذكية باللهجة المصرية",
                                  });
                                }
                              }
                            }}
                            disabled={isGeneratingMessage}
                            className="flex-1"
                          >
                            {isGeneratingMessage ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                                جاري الإنشاء...
                              </>
                            ) : (
                              <>
                                <Star className="w-4 h-4 mr-2" />
                                إنشاء رسالة ذكية
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="priority">الأولوية</Label>
                      <Select value={newMessage.priority} onValueChange={(value) => setNewMessage(prev => ({ ...prev, priority: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر الأولوية" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">منخفضة</SelectItem>
                          <SelectItem value="medium">متوسطة</SelectItem>
                          <SelectItem value="high">عالية</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={() => {
                      if (!newMessage.family_id || !newMessage.type || !newMessage.title || !newMessage.content) {
                        toast({
                          title: "خد بالك!",
                          description: "لازم تعبي كل البيانات قبل ما تبعت الرسالة.",
                          variant: "destructive"
                        });
                        return;
                      }
                      handleSendMessage();
                      setShowSendDialog(false);
                    }} className="w-full">
                      <Send className="w-4 h-4 mr-2" />
                      إرسال الرسالة
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {messages.map((message) => (
              <Card key={message.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold">{message.title}</h4>
                      <p className="text-sm text-gray-600">{message.family_name}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge className={getMessageTypeColor(message.type)}>
                        {message.type === 'notification' ? 'إشعار' :
                         message.type === 'report' ? 'تقرير' :
                         message.type === 'reminder' ? 'تذكير' : 'عامة'}
                      </Badge>
                      <span className={`text-xs font-medium ${getPriorityColor(message.priority)}`}>
                        {message.priority === 'high' ? 'عالية' :
                         message.priority === 'medium' ? 'متوسطة' : 'منخفضة'}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-700">{message.content}</p>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>{message.sent_at}</span>
                      <span className={
                        message.status === 'read' ? 'text-green-600' :
                        message.status === 'delivered' ? 'text-blue-600' : 'text-gray-600'
                      }>
                        {message.status === 'read' ? 'مقروءة' :
                         message.status === 'delivered' ? 'تم التسليم' : 'مرسلة'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Visits Tab */}
        <TabsContent value="visits" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">جدول الزيارات</h3>
            <Dialog>
              <DialogTrigger asChild>
                <Button onClick={() => setShowVisitDialog(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  جدولة زيارة جديدة
                </Button>
              </DialogTrigger>
              <Dialog open={showVisitDialog} onOpenChange={setShowVisitDialog}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>جدولة زيارة جديدة</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="family">العائلة</Label>
                      <Select value={newVisit.family_id} onValueChange={(value) => setNewVisit(prev => ({ ...prev, family_id: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر العائلة" />
                        </SelectTrigger>
                        <SelectContent>
                          {families.map(f => (
                            <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="visitDate">التاريخ</Label>
                      <Input 
                        id="visitDate" 
                        type="date"
                        value={newVisit.date}
                        onChange={(e) => setNewVisit(prev => ({ ...prev, date: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="visitTime">الوقت</Label>
                      <Input 
                        id="visitTime" 
                        type="time"
                        value={newVisit.time}
                        onChange={(e) => setNewVisit(prev => ({ ...prev, time: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="duration">المدة</Label>
                      <Select value={newVisit.duration} onValueChange={(value) => setNewVisit(prev => ({ ...prev, duration: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر المدة" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30min">30 دقيقة</SelectItem>
                          <SelectItem value="45min">45 دقيقة</SelectItem>
                          <SelectItem value="1hour">ساعة واحدة</SelectItem>
                          <SelectItem value="1.5hour">ساعة ونصف</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="purpose">الغرض من الزيارة</Label>
                      <Textarea 
                        id="purpose" 
                        placeholder="الغرض من الزيارة"
                        value={newVisit.purpose}
                        onChange={(e) => setNewVisit(prev => ({ ...prev, purpose: e.target.value }))}
                      />
                    </div>
                    <Button onClick={() => {
                      if (!newVisit.family_id || !newVisit.date || !newVisit.time || !newVisit.purpose) {
                        toast({
                          title: "خد بالك!",
                          description: "لازم تعبي كل بيانات الزيارة قبل الجدولة.",
                          variant: "destructive"
                        });
                        return;
                      }
                      handleScheduleVisit();
                      setShowVisitDialog(false);
                    }} className="w-full">
                      جدولة الزيارة
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visits.map((visit) => (
              <Card key={visit.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold">{visit.family_name}</h4>
                      <p className="text-sm text-gray-600">المريض: {visit.patient_name}</p>
                    </div>
                    <Badge className={
                      visit.status === 'completed' ? 'bg-green-100 text-green-800' :
                      visit.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }>
                      {visit.status === 'completed' ? 'مكتملة' :
                       visit.status === 'scheduled' ? 'مجدولة' : 'ملغية'}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>التاريخ:</span>
                      <span className="font-medium">{visit.date}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>الوقت:</span>
                      <span className="font-medium">{visit.time}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>المدة:</span>
                      <span className="font-medium">{visit.duration}</span>
                    </div>
                    <div className="text-sm">
                      <span>الغرض:</span>
                      <p className="text-gray-600 mt-1">{visit.purpose}</p>
                    </div>
                    {visit.notes && (
                      <div className="text-sm">
                        <span>ملاحظات:</span>
                        <p className="text-gray-600 mt-1">{visit.notes}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">التقارير</h3>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  إنشاء تقرير جديد
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>إنشاء تقرير جديد</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="reportFamily">العائلة</Label>
                    <Select value={newReport.family_id} onValueChange={(value) => setNewReport(prev => ({ ...prev, family_id: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر العائلة" />
                      </SelectTrigger>
                      <SelectContent>
                        {families.map(f => (
                          <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="reportType">نوع التقرير</Label>
                    <Select value={newReport.type} onValueChange={(value) => setNewReport(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر نوع التقرير" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">أسبوعي</SelectItem>
                        <SelectItem value="monthly">شهري</SelectItem>
                        <SelectItem value="progress">تقدم</SelectItem>
                        <SelectItem value="treatment">علاج</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="reportTitle">عنوان التقرير</Label>
                    <Input 
                      id="reportTitle" 
                      placeholder="عنوان التقرير"
                      value={newReport.title}
                      onChange={(e) => setNewReport(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="reportContent">محتوى التقرير</Label>
                    <div className="space-y-2">
                      <Textarea 
                        id="reportContent" 
                        placeholder="محتوى التقرير" 
                        rows={6}
                        value={newReport.content}
                        onChange={(e) => setNewReport(prev => ({ ...prev, content: e.target.value }))}
                      />
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={async () => {
                            const family = families.find(f => f.id === newReport.family_id);
                            if (family && newReport.type) {
                              const smartReport = await generateSmartReport(
                                family.name,
                                family.patient_name,
                                newReport.type,
                                'بيانات المريض الحالية'
                              );
                              
                              if (smartReport) {
                                setNewReport(prev => ({ ...prev, content: smartReport }));
                                toast({
                                  title: "تم إنشاء التقرير",
                                  description: "تم إنشاء تقرير ذكي باللهجة المصرية",
                                });
                              }
                            }
                          }}
                          disabled={isGeneratingReport}
                          className="flex-1"
                        >
                          {isGeneratingReport ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                              جاري الإنشاء...
                            </>
                          ) : (
                            <>
                              <Star className="w-4 h-4 mr-2" />
                              إنشاء تقرير ذكي
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                  <Button onClick={handleGenerateReport} className="w-full">
                    إنشاء التقرير
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reports.map((report) => (
              <Card key={report.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold">{report.title}</h4>
                      <p className="text-sm text-gray-600">{report.family_name}</p>
                    </div>
                    <Badge className={
                      report.status === 'read' ? 'bg-green-100 text-green-800' :
                      report.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }>
                      {report.status === 'read' ? 'مقروء' :
                       report.status === 'sent' ? 'مرسل' : 'مسودة'}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>نوع التقرير:</span>
                      <span className="font-medium">
                        {report.type === 'weekly' ? 'أسبوعي' :
                         report.type === 'monthly' ? 'شهري' :
                         report.type === 'progress' ? 'تقدم' : 'علاج'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>تاريخ الإنشاء:</span>
                      <span className="font-medium">{report.generated_at}</span>
                    </div>
                    <div className="text-sm">
                      <span>المحتوى:</span>
                      <p className="text-gray-600 mt-1 line-clamp-3">{report.content}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3 pt-3 border-t">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="w-3 h-3 mr-1" />
                      عرض
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Download className="w-3 h-3 mr-1" />
                      تحميل
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FamilyCommunication; 