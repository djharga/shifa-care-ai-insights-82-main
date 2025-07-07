import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Plus, 
  TrendingUp, 
  Users, 
  Clock,
  Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AISessionsQuickAccess = () => {
  const recentAISessions = [
    {
      id: '1',
      patientName: 'أحمد محمد',
      date: '2025-07-05',
      emotion: 'قلق',
      intensity: 7,
      status: 'completed'
    },
    {
      id: '2',
      patientName: 'فاطمة علي',
      date: '2025-07-04',
      emotion: 'اكتئاب',
      intensity: 8,
      status: 'completed'
    },
    {
      id: '3',
      patientName: 'محمد حسن',
      date: '2025-07-03',
      emotion: 'غضب',
      intensity: 6,
      status: 'completed'
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

  const getIntensityColor = (intensity: number) => {
    if (intensity >= 8) return 'text-red-600';
    if (intensity >= 6) return 'text-orange-600';
    if (intensity >= 4) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-purple-600" />
            <span>الجلسات بالذكاء الاصطناعي</span>
          </div>
          <Link to="/advanced-sessions">
            <Button size="sm" className="flex items-center space-x-1">
              <Plus className="h-4 w-4" />
              <span>جلسة جديدة</span>
            </Button>
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* إحصائيات سريعة */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">15</div>
              <div className="text-sm text-gray-600">جلسة هذا الأسبوع</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">85%</div>
              <div className="text-sm text-gray-600">معدل التحسن</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">8</div>
              <div className="text-sm text-gray-600">أهداف مكتملة</div>
            </div>
          </div>

          {/* الجلسات الأخيرة */}
          <div>
            <h4 className="font-medium mb-3 flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>آخر الجلسات المحللة</span>
            </h4>
            <div className="space-y-3">
              {recentAISessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <Users className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">{session.patientName}</div>
                      <div className="text-xs text-gray-500">{session.date}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant="outline" 
                      className={getEmotionColor(session.emotion)}
                    >
                      {session.emotion}
                    </Badge>
                    <div className={`text-sm font-medium ${getIntensityColor(session.intensity)}`}>
                      {session.intensity}/10
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* روابط سريعة */}
          <div className="grid grid-cols-2 gap-2 pt-4 border-t">
            <Link to="/advanced-sessions">
              <Button variant="outline" size="sm" className="w-full">
                <TrendingUp className="h-4 w-4 mr-2" />
                تحليل الجلسات
              </Button>
            </Link>
            <Link to="/advanced-sessions">
              <Button variant="outline" size="sm" className="w-full">
                <Activity className="h-4 w-4 mr-2" />
                الأهداف والأنشطة
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AISessionsQuickAccess; 