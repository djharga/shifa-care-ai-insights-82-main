import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { useToast } from '@/hooks/use-toast';
import { Download, TrendingUp, Users, Calendar, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';

interface ReportStats {
  totalPatients: number;
  activeSessions: number;
  completionRate: number;
  relapseRate: number;
}

interface MonthlyData {
  name: string;
  patients: number;
  sessions: number;
  completion: number;
}

interface AddictionType {
  name: string;
  value: number;
  color: string;
}

interface AgeGroup {
  name: string;
  patients: number;
}

const Reports = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [stats, setStats] = useState<ReportStats>({
    totalPatients: 0,
    activeSessions: 0,
    completionRate: 0,
    relapseRate: 0
  });
  const [timeframe, setTimeframe] = useState('month');
  const [loading, setLoading] = useState(false);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [addictionTypes, setAddictionTypes] = useState<AddictionType[]>([]);
  const [ageGroups, setAgeGroups] = useState<AgeGroup[]>([]);

  useEffect(() => {
    fetchStats();
    fetchChartData();
  }, [timeframe]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // جلب إجمالي المرضى
      const { count: totalPatients, error: patientsError } = await supabase
        .from('patients')
        .select('*', { count: 'exact', head: true });

      if (patientsError) throw patientsError;

      // جلب الجلسات النشطة
      const { count: activeSessions, error: sessionsError } = await supabase
        .from('sessions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'scheduled');

      if (sessionsError) throw sessionsError;

      // جلب معدل الإكمال
      const { data: completedSessions, error: completedError } = await supabase
        .from('sessions')
        .select('*')
        .eq('status', 'completed');

      if (completedError) throw completedError;

      const { data: totalSessions, error: totalSessionsError } = await supabase
        .from('sessions')
        .select('*');

      if (totalSessionsError) throw totalSessionsError;

      const completionRate = totalSessions && totalSessions.length > 0 
        ? Math.round((completedSessions?.length || 0) / totalSessions.length * 100) 
        : 0;

      // جلب معدل الانتكاس
      const { data: relapseData, error: relapseError } = await supabase
        .from('relapse_indicators')
        .select('*');

      if (relapseError) throw relapseError;

      const relapseRate = relapseData && relapseData.length > 0 
        ? Math.round((relapseData.filter(r => r.status === 'relapsed').length / relapseData.length) * 100)
        : 0;

      setStats({
        totalPatients: totalPatients || 0,
        activeSessions: activeSessions || 0,
        completionRate,
        relapseRate
      });
    } catch (error: any) {
      console.error('Error fetching stats:', error);
      toast({
        title: t("error_loading_stats"),
        description: error.message || "حدث خطأ أثناء تحميل الإحصائيات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchChartData = async () => {
    try {
      // جلب بيانات المرضى الشهرية
      const { data: patientsData, error: patientsError } = await supabase
        .from('patients')
        .select('created_at, addiction_type');

      if (patientsError) throw patientsError;

      // جلب بيانات الجلسات الشهرية
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('sessions')
        .select('created_at, status');

      if (sessionsError) throw sessionsError;

      // تحليل البيانات الشهرية
      const monthlyAnalysis = analyzeMonthlyData(patientsData || [], sessionsData || []);
      setMonthlyData(monthlyAnalysis);

      // تحليل أنواع الإدمان
      const addictionAnalysis = analyzeAddictionTypes(patientsData || []);
      setAddictionTypes(addictionAnalysis);

      // تحليل الفئات العمرية
      const ageAnalysis = analyzeAgeGroups(patientsData || []);
      setAgeGroups(ageAnalysis);

    } catch (error: any) {
      console.error('Error fetching chart data:', error);
    }
  };

  const analyzeMonthlyData = (patients: any[], sessions: any[]): MonthlyData[] => {
    const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'];
    const currentYear = new Date().getFullYear();
    
    return months.map((month, index) => {
      const monthPatients = patients.filter(p => {
        const date = new Date(p.created_at);
        return date.getMonth() === index && date.getFullYear() === currentYear;
      }).length;

      const monthSessions = sessions.filter(s => {
        const date = new Date(s.created_at);
        return date.getMonth() === index && date.getFullYear() === currentYear;
      }).length;

      const completedSessions = sessions.filter(s => {
        const date = new Date(s.created_at);
        return date.getMonth() === index && date.getFullYear() === currentYear && s.status === 'completed';
      }).length;

      const completion = monthSessions > 0 ? Math.round((completedSessions / monthSessions) * 100) : 0;

      return {
        name: month,
        patients: monthPatients,
        sessions: monthSessions,
        completion
      };
    });
  };

  const analyzeAddictionTypes = (patients: any[]): AddictionType[] => {
    const typeCounts: { [key: string]: number } = {};
    
    patients.forEach(patient => {
      const type = patient.addiction_type || 'أخرى';
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });

    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#ff0000'];
    let colorIndex = 0;

    return Object.entries(typeCounts).map(([name, value]) => ({
      name,
      value,
      color: colors[colorIndex++ % colors.length]
    }));
  };

  const analyzeAgeGroups = (patients: any[]): AgeGroup[] => {
    const ageGroups: { [key: string]: number } = {
      '18-25': 0,
      '26-35': 0,
      '36-45': 0,
      '46-55': 0,
      '56+': 0
    };

    patients.forEach(patient => {
      if (patient.date_of_birth) {
        const birthDate = new Date(patient.date_of_birth);
        const age = new Date().getFullYear() - birthDate.getFullYear();
        
        if (age >= 18 && age <= 25) ageGroups['18-25']++;
        else if (age >= 26 && age <= 35) ageGroups['26-35']++;
        else if (age >= 36 && age <= 45) ageGroups['36-45']++;
        else if (age >= 46 && age <= 55) ageGroups['46-55']++;
        else if (age > 55) ageGroups['56+']++;
      }
    });

    return Object.entries(ageGroups).map(([name, patients]) => ({
      name,
      patients
    }));
  };

  const exportReport = async () => {
    try {
      toast({
        title: t("exporting_report"),
        description: t("report_will_be_downloaded_soon"),
      });

      const reportData = {
        stats,
        monthly_data: monthlyData,
        addiction_types: addictionTypes,
        age_groups: ageGroups,
        timeframe,
        generated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('reports')
        .insert([{
          type: 'comprehensive_report',
          data: reportData,
          created_at: new Date().toISOString()
        }]);

      if (error) throw error;

      setTimeout(() => {
        toast({
          title: "تم تصدير التقرير",
          description: "تم حفظ التقرير بنجاح",
        });
      }, 2000);
    } catch (error: any) {
      console.error('Error exporting report:', error);
      toast({
        title: "خطأ في تصدير التقرير",
        description: error.message || "حدث خطأ أثناء تصدير التقرير",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{t('reports_and_stats')}</h1>
            <p className="text-muted-foreground">{t('track_your_data_and_results_here')}</p>
          </div>

          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">أسبوعي</SelectItem>
                <SelectItem value="month">شهري</SelectItem>
                <SelectItem value="quarter">ربع سنوي</SelectItem>
                <SelectItem value="year">سنوي</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={exportReport} className="flex items-center space-x-2 rtl:space-x-reverse">
              <Download className="h-4 w-4" />
              <span>{t('download_report')}</span>
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('total_patients')}</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPatients}</div>
              <p className="text-xs text-muted-foreground">+12% عن الشهر اللي فات</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('active_sessions')}</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeSessions}</div>
              <p className="text-xs text-muted-foreground">+8% عن الأسبوع اللي فات</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('completion_rate')}</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completionRate}%</div>
              <p className="text-xs text-muted-foreground">+3% عن الشهر اللي فات</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('relapse_rate')}</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.relapseRate}%</div>
              <p className="text-xs text-muted-foreground">-2% عن الشهر اللي فات</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>{t('patient_and_session_development')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="patients" stroke="#8884d8" name={t('patients')} />
                  <Line type="monotone" dataKey="sessions" stroke="#82ca9d" name={t('sessions')} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('addiction_type_distribution')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={addictionTypes}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {addictionTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>{t('completion_rate_monthly')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="completion" fill="#8884d8" name={t('completion_rate')} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('patient_distribution_by_age')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={ageGroups}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="patients" fill="#82ca9d" name={t('patient_count')} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Reports;