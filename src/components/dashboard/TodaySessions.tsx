import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Clock, User, Calendar, ArrowLeft } from 'lucide-react';

interface Session {
  id: string;
  patient_name: string;
  therapist_name: string;
  session_time: string;
  session_type: string;
  status: 'scheduled' | 'in_progress' | 'completed';
  duration: number;
}

const TodaySessions = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { toast } = useToast();

  useEffect(() => {
    // Update current time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    fetchTodaySessions();

    return () => clearInterval(timer);
  }, []);

  const fetchTodaySessions = async () => {
    try {
      // Mock data for today's sessions
      const mockSessions: Session[] = [
        {
          id: '1',
          patient_name: 'أحمد محمد',
          therapist_name: 'د. سارة أحمد',
          session_time: '10:00',
          session_type: 'فردية',
          status: 'completed',
          duration: 60
        },
        {
          id: '2',
          patient_name: 'فاطمة علي',
          therapist_name: 'د. محمد علي',
          session_time: '11:30',
          session_type: 'جماعية',
          status: 'in_progress',
          duration: 90
        },
        {
          id: '3',
          patient_name: 'سارة أحمد',
          therapist_name: 'د. سارة أحمد',
          session_time: '14:00',
          session_type: 'فردية',
          status: 'scheduled',
          duration: 60
        },
        {
          id: '4',
          patient_name: 'محمد عبدالله',
          therapist_name: 'د. أحمد محمود',
          session_time: '15:30',
          session_type: 'عائلية',
          status: 'scheduled',
          duration: 75
        }
      ];
      
      setSessions(mockSessions);
    } catch (error: any) {
      toast({
        title: "خطأ في تحميل الجلسات",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      scheduled: { label: 'مجدولة', variant: 'outline' as const, color: 'text-blue-600' },
      in_progress: { label: 'جارية', variant: 'default' as const, color: 'text-green-600' },
      completed: { label: 'مكتملة', variant: 'secondary' as const, color: 'text-gray-600' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const isSessionSoon = (sessionTime: string) => {
    const [hours, minutes] = sessionTime.split(':').map(Number);
    const sessionDateTime = new Date();
    sessionDateTime.setHours(hours, minutes, 0, 0);
    
    const timeDiff = sessionDateTime.getTime() - currentTime.getTime();
    const minutesDiff = Math.floor(timeDiff / (1000 * 60));
    
    return minutesDiff <= 15 && minutesDiff > 0;
  };

  const getTimeUntilSession = (sessionTime: string) => {
    const [hours, minutes] = sessionTime.split(':').map(Number);
    const sessionDateTime = new Date();
    sessionDateTime.setHours(hours, minutes, 0, 0);
    
    const timeDiff = sessionDateTime.getTime() - currentTime.getTime();
    const minutesDiff = Math.floor(timeDiff / (1000 * 60));
    
    if (minutesDiff < 0) return 'انتهت';
    if (minutesDiff === 0) return 'الآن';
    if (minutesDiff < 60) return `خلال ${minutesDiff} دقيقة`;
    
    const hoursDiff = Math.floor(minutesDiff / 60);
    const remainingMinutes = minutesDiff % 60;
    return `خلال ${hoursDiff}:${remainingMinutes.toString().padStart(2, '0')} ساعة`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Calendar className="h-5 w-5" />
            <span>جلسات اليوم</span>
          </div>
          <span className="text-sm text-muted-foreground">
            {currentTime.toLocaleDateString('ar-SA')}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sessions.map((session) => (
            <div 
              key={session.id} 
              className={`p-4 rounded-lg border transition-all ${
                isSessionSoon(session.session_time) 
                  ? 'border-primary bg-primary/5 shadow-md' 
                  : 'border-border'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{session.patient_name}</h4>
                    <p className="text-sm text-muted-foreground">{session.therapist_name}</p>
                  </div>
                </div>
                {getStatusBadge(session.status)}
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{session.session_time}</span>
                  <span className="text-muted-foreground">({session.duration} دقيقة)</span>
                </div>
                <div className="text-right">
                  <span className="text-muted-foreground">نوع الجلسة: </span>
                  <span className="font-medium">{session.session_type}</span>
                </div>
              </div>
              
              {session.status === 'scheduled' && (
                <div className="mt-3 flex items-center justify-between">
                  <div className={`text-sm ${
                    isSessionSoon(session.session_time) 
                      ? 'text-primary font-medium' 
                      : 'text-muted-foreground'
                  }`}>
                    {getTimeUntilSession(session.session_time)}
                  </div>
                  <Button variant="outline" size="sm">
                    بدء الجلسة
                    <ArrowLeft className="h-3 w-3 mr-1" />
                  </Button>
                </div>
              )}
              
              {session.status === 'in_progress' && (
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-green-600 font-medium">جلسة نشطة</span>
                  </div>
                  <Button variant="outline" size="sm">
                    إنهاء الجلسة
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-foreground">ملخص اليوم</h4>
              <p className="text-sm text-muted-foreground">
                {sessions.filter(s => s.status === 'completed').length} مكتملة • 
                {sessions.filter(s => s.status === 'in_progress').length} جارية • 
                {sessions.filter(s => s.status === 'scheduled').length} مجدولة
              </p>
            </div>
            <Button variant="outline" size="sm">
              عرض جميع الجلسات
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TodaySessions;