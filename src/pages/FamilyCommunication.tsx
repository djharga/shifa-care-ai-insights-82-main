import React, { useState, useEffect } from 'react';
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
  TrendingUp,
  BarChart3,
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

interface Family {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  patientName: string;
  patientId: string;
  relationship: string;
  status: 'active' | 'inactive';
  lastContact: string;
  preferences: {
    notifications: boolean;
    reports: boolean;
    visits: boolean;
    language: 'ar' | 'en';
  };
}

interface Message {
  id: string;
  familyId: string;
  familyName: string;
  type: 'notification' | 'report' | 'reminder' | 'general';
  title: string;
  content: string;
  status: 'sent' | 'delivered' | 'read';
  sentAt: string;
  priority: 'low' | 'medium' | 'high';
}

interface Visit {
  id: string;
  familyId: string;
  familyName: string;
  patientName: string;
  date: string;
  time: string;
  duration: string;
  purpose: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes: string;
}

interface Report {
  id: string;
  familyId: string;
  familyName: string;
  patientName: string;
  type: 'weekly' | 'monthly' | 'progress' | 'treatment';
  title: string;
  content: string;
  generatedAt: string;
  status: 'draft' | 'sent' | 'read';
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

  // Mock data
  useEffect(() => {
    const mockFamilies: Family[] = [
      {
        id: '1',
        name: 'عائلة أحمد محمد',
        phone: '0123456789',
        email: 'ahmed.family@email.com',
        address: 'شارع الملك فهد، الرياض',
        patientName: 'أحمد محمد علي',
        patientId: 'P001',
        relationship: 'أب',
        status: 'active',
        lastContact: '2024-01-15',
        preferences: {
          notifications: true,
          reports: true,
          visits: true,
          language: 'ar'
        }
      },
      {
        id: '2',
        name: 'عائلة سارة أحمد',
        phone: '0123456790',
        email: 'sara.family@email.com',
        address: 'شارع التحلية، جدة',
        patientName: 'سارة أحمد حسن',
        patientId: 'P002',
        relationship: 'أم',
        status: 'active',
        lastContact: '2024-01-14',
        preferences: {
          notifications: true,
          reports: false,
          visits: true,
          language: 'ar'
        }
      },
      {
        id: '3',
        name: 'عائلة محمد علي',
        phone: '0123456791',
        email: 'mohamed.family@email.com',
        address: 'شارع العليا، الدمام',
        patientName: 'محمد علي أحمد',
        patientId: 'P003',
        relationship: 'أخ',
        status: 'inactive',
        lastContact: '2024-01-10',
        preferences: {
          notifications: false,
          reports: true,
          visits: false,
          language: 'ar'
        }
      }
    ];

    const mockMessages: Message[] = [
      {
        id: '1',
        familyId: '1',
        familyName: 'عائلة أحمد محمد',
        type: 'notification',
        title: 'تحديث حالة المريض',
        content: 'تم تحسين حالة المريض أحمد محمد بشكل ملحوظ خلال الأسبوع الماضي',
        status: 'read',
        sentAt: '2024-01-15 10:30',
        priority: 'medium'
      },
      {
        id: '2',
        familyId: '2',
        familyName: 'عائلة سارة أحمد',
        type: 'reminder',
        title: 'تذكير بموعد الزيارة',
        content: 'تذكير بموعد الزيارة غداً الساعة 2:00 مساءً',
        status: 'delivered',
        sentAt: '2024-01-15 09:00',
        priority: 'high'
      }
    ];

    const mockVisits: Visit[] = [
      {
        id: '1',
        familyId: '1',
        familyName: 'عائلة أحمد محمد',
        patientName: 'أحمد محمد علي',
        date: '2024-01-20',
        time: '14:00',
        duration: 'ساعة واحدة',
        purpose: 'مناقشة تقدم العلاج',
        status: 'scheduled',
        notes: 'سيتم مناقشة خطة العلاج الجديدة'
      },
      {
        id: '2',
        familyId: '2',
        familyName: 'عائلة سارة أحمد',
        patientName: 'سارة أحمد حسن',
        date: '2024-01-18',
        time: '15:30',
        duration: '45 دقيقة',
        purpose: 'زيارة روتينية',
        status: 'completed',
        notes: 'تمت الزيارة بنجاح وتم مناقشة التقدم'
      }
    ];

    const mockReports: Report[] = [
      {
        id: '1',
        familyId: '1',
        familyName: 'عائلة أحمد محمد',
        patientName: 'أحمد محمد علي',
        type: 'weekly',
        title: 'تقرير الأسبوع الأول',
        content: 'تقرير مفصل عن تقدم المريض خلال الأسبوع الأول من العلاج',
        generatedAt: '2024-01-15',
        status: 'sent'
      },
      {
        id: '2',
        familyId: '2',
        familyName: 'عائلة سارة أحمد',
        patientName: 'سارة أحمد حسن',
        type: 'progress',
        title: 'تقرير التقدم الشهري',
        content: 'تقرير شامل عن التقدم المحرز خلال الشهر الماضي',
        generatedAt: '2024-01-10',
        status: 'read'
      }
    ];

    setFamilies(mockFamilies);
    setMessages(mockMessages);
    setVisits(mockVisits);
    setReports(mockReports);
  }, []);

  const filteredFamilies = families.filter(family => {
    const matchesSearch = family.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         family.patientName.toLowerCase().includes(searchTerm.toLowerCase());
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

  const handleAddFamily = () => {
    // قراءة البيانات من النموذج
    const familyNameInput = document.getElementById('familyName') as HTMLInputElement;
    const patientNameInput = document.getElementById('patientName') as HTMLInputElement;
    const relationshipSelect = document.querySelector('select') as HTMLSelectElement;
    const phoneInput = document.getElementById('phone') as HTMLInputElement;
    const emailInput = document.getElementById('email') as HTMLInputElement;
    const addressTextarea = document.getElementById('address') as HTMLTextAreaElement;

    // التحقق من البيانات المطلوبة
    if (!familyNameInput?.value || !patientNameInput?.value || !phoneInput?.value) {
      toast({
        title: "خطأ",
        description: "يرجى ملء الحقول المطلوبة (اسم العائلة، اسم المريض، رقم الهاتف)",
        variant: "destructive"
      });
      return;
    }

    // إنشاء عائلة جديدة
    const newFamily: Family = {
      id: Date.now().toString(),
      name: familyNameInput.value,
      phone: phoneInput.value,
      email: emailInput.value || '',
      address: addressTextarea?.value || '',
      patientName: patientNameInput.value,
      patientId: `P${Date.now()}`,
      relationship: relationshipSelect?.options[relationshipSelect.selectedIndex]?.text || 'أخرى',
      status: 'active',
      lastContact: new Date().toLocaleDateString('ar-EG'),
      preferences: {
        notifications: true,
        reports: true,
        visits: true,
        language: 'ar'
      }
    };

    // إضافة العائلة للقائمة
    setFamilies(prev => [newFamily, ...prev]);

    // إظهار رسالة نجاح
    toast({
      title: "تم إضافة العائلة",
      description: "تم إضافة العائلة بنجاح",
    });

    // إغلاق النموذج (إعادة تعيين الحقول)
    if (familyNameInput) familyNameInput.value = '';
    if (patientNameInput) patientNameInput.value = '';
    if (relationshipSelect) relationshipSelect.value = '';
    if (phoneInput) phoneInput.value = '';
    if (emailInput) emailInput.value = '';
    if (addressTextarea) addressTextarea.value = '';
  };

  const handleSendMessage = () => {
    // قراءة البيانات من النموذج
    const familySelect = document.querySelector('select') as HTMLSelectElement;
    const messageTypeSelect = document.querySelectorAll('select')[1] as HTMLSelectElement;
    const titleInput = document.getElementById('title') as HTMLInputElement;
    const contentTextarea = document.getElementById('content') as HTMLTextAreaElement;
    const prioritySelect = document.querySelectorAll('select')[2] as HTMLSelectElement;

    // التحقق من البيانات
    if (!familySelect?.value || !messageTypeSelect?.value || !titleInput?.value || !contentTextarea?.value) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    // إنشاء رسالة جديدة
    const newMessage: Message = {
      id: Date.now().toString(),
      familyId: familySelect.value,
      familyName: familySelect.options[familySelect.selectedIndex]?.text || '',
      type: messageTypeSelect.value as any,
      title: titleInput.value,
      content: contentTextarea.value,
      status: 'sent',
      sentAt: new Date().toLocaleString('ar-EG'),
      priority: prioritySelect?.value as any || 'medium'
    };

    // إضافة الرسالة للقائمة
    setMessages(prev => [newMessage, ...prev]);

    // إظهار رسالة نجاح
    toast({
      title: "تم إرسال الرسالة",
      description: "تم إرسال الرسالة بنجاح",
    });

    // إغلاق النموذج (إعادة تعيين الحقول)
    if (familySelect) familySelect.value = '';
    if (messageTypeSelect) messageTypeSelect.value = '';
    if (titleInput) titleInput.value = '';
    if (contentTextarea) contentTextarea.value = '';
    if (prioritySelect) prioritySelect.value = '';
  };

  const handleScheduleVisit = () => {
    // قراءة البيانات من النموذج
    const familySelect = document.querySelector('select') as HTMLSelectElement;
    const dateInput = document.getElementById('visitDate') as HTMLInputElement;
    const timeInput = document.getElementById('visitTime') as HTMLInputElement;
    const durationSelect = document.querySelectorAll('select')[1] as HTMLSelectElement;
    const purposeTextarea = document.getElementById('purpose') as HTMLTextAreaElement;

    // التحقق من البيانات المطلوبة
    if (!familySelect?.value || !dateInput?.value || !timeInput?.value || !purposeTextarea?.value) {
      toast({
        title: "خطأ",
        description: "يرجى ملء الحقول المطلوبة (العائلة، التاريخ، الوقت، الغرض)",
        variant: "destructive"
      });
      return;
    }

    // إنشاء زيارة جديدة
    const newVisit: Visit = {
      id: Date.now().toString(),
      familyId: familySelect.value,
      familyName: familySelect.options[familySelect.selectedIndex]?.text || '',
      patientName: familySelect.options[familySelect.selectedIndex]?.text.replace('عائلة ', '') || '',
      date: dateInput.value,
      time: timeInput.value,
      duration: durationSelect?.options[durationSelect.selectedIndex]?.text || 'ساعة واحدة',
      purpose: purposeTextarea.value,
      status: 'scheduled',
      notes: ''
    };

    // إضافة الزيارة للقائمة
    setVisits(prev => [newVisit, ...prev]);

    // إظهار رسالة نجاح
    toast({
      title: "تم جدولة الزيارة",
      description: "تم جدولة الزيارة بنجاح",
    });

    // إغلاق النموذج (إعادة تعيين الحقول)
    if (familySelect) familySelect.value = '';
    if (dateInput) dateInput.value = '';
    if (timeInput) timeInput.value = '';
    if (durationSelect) durationSelect.value = '';
    if (purposeTextarea) purposeTextarea.value = '';
  };

  const handleGenerateReport = () => {
    // قراءة البيانات من النموذج
    const familySelect = document.querySelectorAll('select')[0] as HTMLSelectElement;
    const reportTypeSelect = document.querySelectorAll('select')[1] as HTMLSelectElement;
    const titleInput = document.getElementById('reportTitle') as HTMLInputElement;
    const contentTextarea = document.getElementById('reportContent') as HTMLTextAreaElement;

    // التحقق من البيانات المطلوبة
    if (!familySelect?.value || !reportTypeSelect?.value || !titleInput?.value || !contentTextarea?.value) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    // إنشاء تقرير جديد
    const newReport: Report = {
      id: Date.now().toString(),
      familyId: familySelect.value,
      familyName: familySelect.options[familySelect.selectedIndex]?.text || '',
      patientName: familySelect.options[familySelect.selectedIndex]?.text.replace('عائلة ', '') || '',
      type: reportTypeSelect.value as any,
      title: titleInput.value,
      content: contentTextarea.value,
      generatedAt: new Date().toLocaleString('ar-EG'),
      status: 'draft'
    };

    // إضافة التقرير للقائمة
    setReports(prev => [newReport, ...prev]);

    // إظهار رسالة نجاح
    toast({
      title: "تم إنشاء التقرير",
      description: "تم إنشاء التقرير بنجاح",
    });

    // إغلاق النموذج (إعادة تعيين الحقول)
    if (familySelect) familySelect.value = '';
    if (reportTypeSelect) reportTypeSelect.value = '';
    if (titleInput) titleInput.value = '';
    if (contentTextarea) contentTextarea.value = '';
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
                  <Input id="familyName" placeholder="اسم العائلة" />
                </div>
                <div>
                  <Label htmlFor="patientName">اسم المريض</Label>
                  <Input id="patientName" placeholder="اسم المريض" />
                </div>
                <div>
                  <Label htmlFor="relationship">صلة القرابة</Label>
                  <Select>
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
                  <Input id="phone" placeholder="0123456789" />
                </div>
                <div>
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input id="email" type="email" placeholder="example@email.com" />
                </div>
                <div>
                  <Label htmlFor="address">العنوان</Label>
                  <Textarea id="address" placeholder="عنوان العائلة" />
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
                      <p className="text-sm text-gray-600">المريض: {family.patientName}</p>
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
                        آخر تواصل: {family.lastContact}
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
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  إرسال رسالة جديدة
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>إرسال رسالة جديدة</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="recipient">المستقبل</Label>
                    <Select>
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
                    <Select>
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
                    <Input id="title" placeholder="عنوان الرسالة" />
                  </div>
                  <div>
                    <Label htmlFor="content">المحتوى</Label>
                    <div className="space-y-2">
                      <Textarea id="content" placeholder="محتوى الرسالة" rows={4} />
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={async () => {
                            const familySelect = document.querySelector('select') as HTMLSelectElement;
                            const messageTypeSelect = document.querySelectorAll('select')[1] as HTMLSelectElement;
                            const contentTextarea = document.getElementById('content') as HTMLTextAreaElement;
                            
                            if (familySelect && messageTypeSelect && contentTextarea) {
                              const familyName = familySelect.options[familySelect.selectedIndex]?.text || '';
                              const messageType = messageTypeSelect.options[messageTypeSelect.selectedIndex]?.text || '';
                              
                              const smartMessage = await generateSmartMessage(
                                familyName,
                                messageType,
                                'رسالة عامة للتواصل مع العائلة'
                              );
                              
                              if (smartMessage) {
                                contentTextarea.value = smartMessage;
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
                    <Select>
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
                  <Button onClick={handleSendMessage} className="w-full">
                    <Send className="w-4 h-4 mr-2" />
                    إرسال الرسالة
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {messages.map((message) => (
              <Card key={message.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold">{message.title}</h4>
                      <p className="text-sm text-gray-600">{message.familyName}</p>
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
                      <span>{message.sentAt}</span>
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
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  جدولة زيارة جديدة
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>جدولة زيارة جديدة</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="family">العائلة</Label>
                    <Select>
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
                    <Input id="visitDate" type="date" />
                  </div>
                  <div>
                    <Label htmlFor="visitTime">الوقت</Label>
                    <Input id="visitTime" type="time" />
                  </div>
                  <div>
                    <Label htmlFor="duration">المدة</Label>
                    <Select>
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
                    <Textarea id="purpose" placeholder="الغرض من الزيارة" />
                  </div>
                  <Button onClick={handleScheduleVisit} className="w-full">
                    جدولة الزيارة
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visits.map((visit) => (
              <Card key={visit.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold">{visit.familyName}</h4>
                      <p className="text-sm text-gray-600">المريض: {visit.patientName}</p>
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
                    <Select>
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
                    <Select>
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
                    <Input id="reportTitle" placeholder="عنوان التقرير" />
                  </div>
                  <div>
                    <Label htmlFor="reportContent">محتوى التقرير</Label>
                    <div className="space-y-2">
                      <Textarea id="reportContent" placeholder="محتوى التقرير" rows={6} />
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={async () => {
                            const familySelect = document.querySelectorAll('select')[0] as HTMLSelectElement;
                            const reportTypeSelect = document.querySelectorAll('select')[1] as HTMLSelectElement;
                            const contentTextarea = document.getElementById('reportContent') as HTMLTextAreaElement;
                            
                            if (familySelect && reportTypeSelect && contentTextarea) {
                              const familyName = familySelect.options[familySelect.selectedIndex]?.text || '';
                              const reportType = reportTypeSelect.options[reportTypeSelect.selectedIndex]?.text || '';
                              const patientName = familyName.replace('عائلة ', '');
                              
                              const smartReport = await generateSmartReport(
                                familyName,
                                patientName,
                                reportType,
                                'مريض في مرحلة العلاج، يحتاج تقرير شامل عن التقدم'
                              );
                              
                              if (smartReport) {
                                contentTextarea.value = smartReport;
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
                      <p className="text-sm text-gray-600">{report.familyName}</p>
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
                      <span className="font-medium">{report.generatedAt}</span>
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