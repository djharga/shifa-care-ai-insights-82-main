import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Lightbulb, 
  Sparkles, 
  TrendingUp, 
  Users, 
  Calendar,
  Plus,
  Clock,
  Target,
  BarChart3,
  Activity,
  ArrowLeft,
  Download,
  Share,
  Eye,
  Edit,
  Trash2,
  Play,
  Pause,
  Settings,
  Star,
  MessageSquare,
  FileText,
  Zap
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import AdvancedSessions from './AdvancedSessions';

const AISessionsHub = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();
  const navigate = useNavigate();

  // بيانات وهمية للإحصائيات
  const stats = {
    totalSessions: 156,
    thisWeek: 23,
    thisMonth: 89,
    avgProgress: 78,
    completedGoals: 45,
    pendingGoals: 12,
    highPriorityCases: 8,
    aiInsights: 234
  };

  // الجلسات الأخيرة
  const recentSessions = [
    {
      id: '1',
      patientName: 'أحمد محمد',
      date: '2025-07-05',
      emotion: 'قلق',
      intensity: 7,
      progress: 65,
      goals: 3,
      status: 'completed'
    },
    {
      id: '2',
      patientName: 'فاطمة علي',
      date: '2025-07-04',
      emotion: 'اكتئاب',
      intensity: 8,
      progress: 45,
      goals: 4,
      status: 'completed'
    },
    {
      id: '3',
      patientName: 'محمد حسن',
      date: '2025-07-03',
      emotion: 'غضب',
      intensity: 6,
      progress: 80,
      goals: 2,
      status: 'completed'
    }
  ];

  // الأهداف العالية الأولوية
  const highPriorityGoals = [
    {
      id: '1',
      patientName: 'أحمد محمد',
      goal: 'تحسين الثقة بالنفس',
      deadline: '2025-07-15',
      progress: 60,
      category: 'عاطفي'
    },
    {
      id: '2',
      patientName: 'فاطمة علي',
      goal: 'إدارة التوتر',
      deadline: '2025-07-12',
      progress: 30,
      category: 'سلوكي'
    },
    {
      id: '3',
      patientName: 'محمد حسن',
      goal: 'تحسين العلاقات الاجتماعية',
      deadline: '2025-07-20',
      progress: 75,
      category: 'اجتماعي'
    }
  ];

  const getEmotionColor = (emotion: string) => {
    switch (emotion) {
      case 'قلق': return 'bg-yellow-100 text-yellow-800';
      case 'اكتئاب': return 'bg-blue-100 text-blue-800';
      case 'غضب': return 'bg-red-100 text-red-800';
      case 'فرح': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600';
    if (progress >= 60) return 'text-blue-600';
    if (progress >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  // وظائف الأزرار
  const handleBackToHome = () => {
    navigate('/');
    toast({
      title: "العودة للرئيسية",
      description: "سيتم نقلك إلى الصفحة الرئيسية",
    });
  };

  const handleCreateNewSession = () => {
    toast({
      title: "إنشاء جلسة جديدة",
      description: "سيتم فتح نموذج إنشاء الجلسة",
    });
    
    setTimeout(() => {
      navigate('/advanced-sessions');
    }, 1000);
  };

  const handleAnalyzeSessions = () => {
    toast({
      title: "تحليل الجلسات",
      description: "جاري تحليل الجلسات وتوليد الرؤى...",
    });
    
    setTimeout(() => {
      toast({
        title: "تم التحليل",
        description: "تم تحليل الجلسات بنجاح!",
      });
    }, 3000);
  };

  const handleManageGoals = () => {
    toast({
      title: "إدارة الأهداف",
      description: "سيتم فتح صفحة إدارة الأهداف",
    });
    
    setTimeout(() => {
      setActiveTab('goals');
    }, 1000);
  };

  const handleViewSession = (session: any) => {
    toast({
      title: "عرض الجلسة",
      description: `سيتم عرض تفاصيل جلسة ${session.patientName}`,
    });
  };

  const handleEditSession = (session: any) => {
    toast({
      title: "تعديل الجلسة",
      description: `سيتم فتح نموذج تعديل جلسة ${session.patientName}`,
    });
  };

  const handleDeleteSession = (session: any) => {
    toast({
      title: "حذف الجلسة",
      description: `هل أنت متأكد من حذف جلسة ${session.patientName}؟`,
      variant: "destructive",
    });
  };

  const handleDownloadReport = (session: any) => {
    toast({
      title: "تحميل التقرير",
      description: `جاري تحميل تقرير جلسة ${session.patientName}...`,
    });
    
    setTimeout(() => {
      toast({
        title: "تم التحميل",
        description: "تم تحميل التقرير بنجاح",
      });
    }, 2000);
  };

  const handleShareSession = (session: any) => {
    toast({
      title: "مشاركة الجلسة",
      description: `سيتم مشاركة جلسة ${session.patientName}`,
    });
  };

  const handleViewGoal = (goal: any) => {
    toast({
      title: "عرض الهدف",
      description: `سيتم عرض تفاصيل هدف ${goal.patientName}`,
    });
  };

  const handleEditGoal = (goal: any) => {
    toast({
      title: "تعديل الهدف",
      description: `سيتم فتح نموذج تعديل هدف ${goal.patientName}`,
    });
  };

  const handleDeleteGoal = (goal: any) => {
    toast({
      title: "حذف الهدف",
      description: `هل أنت متأكد من حذف هدف ${goal.patientName}؟`,
      variant: "destructive",
    });
  };

  const handleGenerateReport = () => {
    toast({
      title: "إنشاء تقرير",
      description: "جاري إنشاء التقرير الشامل...",
    });
    
    setTimeout(() => {
      toast({
        title: "تم إنشاء التقرير",
        description: "تم إنشاء التقرير بنجاح!",
      });
    }, 3000);
  };

  const handleExportData = () => {
    toast({
      title: "تصدير البيانات",
      description: "جاري تصدير البيانات...",
    });
    
    setTimeout(() => {
      toast({
        title: "تم التصدير",
        description: "تم تصدير البيانات بنجاح",
      });
    }, 2000);
  };

  const handleAISettings = () => {
    toast({
      title: "إعدادات الذكاء الاصطناعي",
      description: "سيتم فتح إعدادات النظام الذكي",
    });
  };

  const handleRateSystem = () => {
    toast({
      title: "تقييم النظام",
      description: "سيتم فتح نموذج التقييم",
    });
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={handleBackToHome} className="flex items-center">
                <ArrowLeft className="w-4 h-4 mr-2" />
                العودة للرئيسية
              </Button>
              
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                <Brain className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">الجلسات بالذكاء الاصطناعي</h1>
                <p className="text-muted-foreground">نظام متكامل لتحليل الجلسات العلاجية وتقديم رؤى ذكية</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={handleAISettings}>
                <Settings className="w-4 h-4" />
              </Button>
              <Button variant="outline" onClick={handleRateSystem}>
                <Star className="w-4 h-4" />
              </Button>
              <Button onClick={handleCreateNewSession} className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>جلسة جديدة</span>
              </Button>
            </div>
          </div>

          {/* إحصائيات سريعة */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            <Card className="text-center cursor-pointer hover:shadow-md transition-shadow" onClick={() => toast({ title: "إجمالي الجلسات", description: `عدد الجلسات: ${stats.totalSessions}` })}>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-purple-600">{stats.totalSessions}</div>
                <div className="text-sm text-gray-600">إجمالي الجلسات</div>
              </CardContent>
            </Card>
            <Card className="text-center cursor-pointer hover:shadow-md transition-shadow" onClick={() => toast({ title: "جلسات هذا الأسبوع", description: `عدد الجلسات: ${stats.thisWeek}` })}>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-blue-600">{stats.thisWeek}</div>
                <div className="text-sm text-gray-600">هذا الأسبوع</div>
              </CardContent>
            </Card>
            <Card className="text-center cursor-pointer hover:shadow-md transition-shadow" onClick={() => toast({ title: "معدل التحسن", description: `النسبة: ${stats.avgProgress}%` })}>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">{stats.avgProgress}%</div>
                <div className="text-sm text-gray-600">معدل التحسن</div>
              </CardContent>
            </Card>
            <Card className="text-center cursor-pointer hover:shadow-md transition-shadow" onClick={() => toast({ title: "الأهداف المكتملة", description: `عدد الأهداف: ${stats.completedGoals}` })}>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-orange-600">{stats.completedGoals}</div>
                <div className="text-sm text-gray-600">أهداف مكتملة</div>
              </CardContent>
            </Card>
            <Card className="text-center cursor-pointer hover:shadow-md transition-shadow" onClick={() => toast({ title: "الأهداف المعلقة", description: `عدد الأهداف: ${stats.pendingGoals}` })}>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-red-600">{stats.pendingGoals}</div>
                <div className="text-sm text-gray-600">أهداف معلقة</div>
              </CardContent>
            </Card>
            <Card className="text-center cursor-pointer hover:shadow-md transition-shadow" onClick={() => toast({ title: "الحالات عالية الأولوية", description: `عدد الحالات: ${stats.highPriorityCases}` })}>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-yellow-600">{stats.highPriorityCases}</div>
                <div className="text-sm text-gray-600">حالات عالية الأولوية</div>
              </CardContent>
            </Card>
            <Card className="text-center cursor-pointer hover:shadow-md transition-shadow" onClick={() => toast({ title: "الرؤى الذكية", description: `عدد الرؤى: ${stats.aiInsights}` })}>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-indigo-600">{stats.aiInsights}</div>
                <div className="text-sm text-gray-600">رؤى ذكية</div>
              </CardContent>
            </Card>
            <Card className="text-center cursor-pointer hover:shadow-md transition-shadow" onClick={() => toast({ title: "جلسات هذا الشهر", description: `عدد الجلسات: ${stats.thisMonth}` })}>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-pink-600">{stats.thisMonth}</div>
                <div className="text-sm text-gray-600">هذا الشهر</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* التبويبات الرئيسية */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
            <TabsTrigger value="sessions">الجلسات</TabsTrigger>
            <TabsTrigger value="goals">الأهداف</TabsTrigger>
            <TabsTrigger value="analysis">التحليل</TabsTrigger>
          </TabsList>

          {/* نظرة عامة */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* الجلسات الأخيرة */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5" />
                    <span>آخر الجلسات المحللة</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentSessions.map((session) => (
                      <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <Users className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <div className="font-medium">{session.patientName}</div>
                            <div className="text-sm text-gray-500">{session.date}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge variant="outline" className={getEmotionColor(session.emotion)}>
                            {session.emotion}
                          </Badge>
                          <div className="text-sm">
                            <span className={getProgressColor(session.progress)}>
                              {session.progress}%
                            </span>
                          </div>
                          <div className="flex space-x-1">
                            <Button size="sm" variant="outline" onClick={() => handleViewSession(session)}>
                              <Eye className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleEditSession(session)}>
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleDeleteSession(session)}>
                              <Trash2 className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleDownloadReport(session)}>
                              <Download className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleShareSession(session)}>
                              <Share className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* الأهداف العالية الأولوية */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5" />
                    <span>الأهداف العالية الأولوية</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {highPriorityGoals.map((goal) => (
                      <div key={goal.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium">{goal.patientName}</div>
                          <Badge variant="outline" className="bg-red-100 text-red-800">
                            عالية الأولوية
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">{goal.goal}</div>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span>التقدم: {goal.progress}%</span>
                          <span>الموعد: {goal.deadline}</span>
                        </div>
                        <div className="flex space-x-1">
                          <Button size="sm" variant="outline" onClick={() => handleViewGoal(goal)}>
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleEditGoal(goal)}>
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDeleteGoal(goal)}>
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* روابط سريعة */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Sparkles className="h-5 w-5" />
                  <span>إجراءات سريعة</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2" onClick={handleCreateNewSession}>
                    <Plus className="h-6 w-6" />
                    <span>إنشاء جلسة جديدة</span>
                  </Button>
                  <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2" onClick={handleAnalyzeSessions}>
                    <BarChart3 className="h-6 w-6" />
                    <span>تحليل الجلسات</span>
                  </Button>
                  <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2" onClick={handleManageGoals}>
                    <Target className="h-6 w-6" />
                    <span>إدارة الأهداف</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* الجلسات */}
          <TabsContent value="sessions">
            <AdvancedSessions />
          </TabsContent>

          {/* الأهداف */}
          <TabsContent value="goals" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>إدارة الأهداف العلاجية</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">إدارة الأهداف العلاجية</h3>
                  <p className="text-gray-600 mb-4">يمكنك إدارة الأهداف العلاجية من خلال الجلسات</p>
                  <div className="flex space-x-2 justify-center">
                    <Button onClick={() => navigate('/advanced-sessions')}>
                      الذهاب للجلسات
                    </Button>
                    <Button variant="outline" onClick={handleGenerateReport}>
                      <FileText className="w-4 h-4 mr-2" />
                      إنشاء تقرير
                    </Button>
                    <Button variant="outline" onClick={handleExportData}>
                      <Download className="w-4 h-4 mr-2" />
                      تصدير البيانات
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* التحليل */}
          <TabsContent value="analysis" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lightbulb className="h-5 w-5" />
                  <span>التحليل الشامل</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">التحليل الشامل</h3>
                  <p className="text-gray-600 mb-4">يمكنك الوصول للتحليل الشامل من خلال الجلسات</p>
                  <div className="flex space-x-2 justify-center">
                    <Button onClick={() => navigate('/advanced-sessions')}>
                      الذهاب للجلسات
                    </Button>
                    <Button variant="outline" onClick={handleAnalyzeSessions}>
                      <Zap className="w-4 h-4 mr-2" />
                      تحليل فوري
                    </Button>
                    <Button variant="outline" onClick={handleGenerateReport}>
                      <FileText className="w-4 h-4 mr-2" />
                      تقرير شامل
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AISessionsHub; 