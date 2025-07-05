import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Plus, 
  TrendingUp, 
  Users, 
  Clock,
  Activity,
  Target,
  BarChart3,
  FileText,
  Sparkles,
  Lightbulb,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import AdvancedSessions from './AdvancedSessions';

const AISessionsHub = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');

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

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                <Brain className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">الجلسات بالذكاء الاصطناعي</h1>
                <p className="text-muted-foreground">نظام متكامل لتحليل الجلسات العلاجية وتقديم رؤى ذكية</p>
              </div>
            </div>
            <Link to="/advanced-sessions">
              <Button className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>جلسة جديدة</span>
              </Button>
            </Link>
          </div>

          {/* إحصائيات سريعة */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-purple-600">{stats.totalSessions}</div>
                <div className="text-sm text-gray-600">إجمالي الجلسات</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-blue-600">{stats.thisWeek}</div>
                <div className="text-sm text-gray-600">هذا الأسبوع</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">{stats.avgProgress}%</div>
                <div className="text-sm text-gray-600">معدل التحسن</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-orange-600">{stats.completedGoals}</div>
                <div className="text-sm text-gray-600">أهداف مكتملة</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-red-600">{stats.pendingGoals}</div>
                <div className="text-sm text-gray-600">أهداف معلقة</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-yellow-600">{stats.highPriorityCases}</div>
                <div className="text-sm text-gray-600">حالات عالية الأولوية</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-indigo-600">{stats.aiInsights}</div>
                <div className="text-sm text-gray-600">رؤى ذكية</div>
              </CardContent>
            </Card>
            <Card className="text-center">
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
                        <div className="flex items-center justify-between text-sm">
                          <span>التقدم: {goal.progress}%</span>
                          <span>الموعد: {goal.deadline}</span>
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
                  <Link to="/advanced-sessions">
                    <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                      <Plus className="h-6 w-6" />
                      <span>إنشاء جلسة جديدة</span>
                    </Button>
                  </Link>
                  <Link to="/advanced-sessions">
                    <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                      <BarChart3 className="h-6 w-6" />
                      <span>تحليل الجلسات</span>
                    </Button>
                  </Link>
                  <Link to="/advanced-sessions">
                    <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                      <Target className="h-6 w-6" />
                      <span>إدارة الأهداف</span>
                    </Button>
                  </Link>
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
                  <Link to="/advanced-sessions">
                    <Button>الذهاب للجلسات</Button>
                  </Link>
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
                  <Link to="/advanced-sessions">
                    <Button>الذهاب للجلسات</Button>
                  </Link>
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