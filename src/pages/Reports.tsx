import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { useToast } from '@/hooks/use-toast';
import { Download, TrendingUp, Users, Calendar, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Reports = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [stats, setStats] = useState({
    totalPatients: 0,
    activeSessions: 0,
    completionRate: 0,
    relapseRate: 0
  });
  const [timeframe, setTimeframe] = useState('month');

  // Sample data for charts
  const monthlyData = [
    { name: 'يناير', patients: 12, sessions: 45, completion: 85 },
    { name: 'فبراير', patients: 15, sessions: 52, completion: 88 },
    { name: 'مارس', patients: 18, sessions: 61, completion: 82 },
    { name: 'أبريل', patients: 22, sessions: 78, completion: 90 },
    { name: 'مايو', patients: 25, sessions: 89, completion: 87 },
    { name: 'يونيو', patients: 28, sessions: 95, completion: 91 }
  ];

  const addictionTypes = [
    { name: 'المخدرات', value: 45, color: '#8884d8' },
    { name: 'الكحول', value: 25, color: '#82ca9d' },
    { name: 'التدخين', value: 20, color: '#ffc658' },
    { name: 'أخرى', value: 10, color: '#ff7300' }
  ];

  const ageGroups = [
    { name: '18-25', patients: 15 },
    { name: '26-35', patients: 22 },
    { name: '36-45', patients: 18 },
    { name: '46-55', patients: 12 },
    { name: '56+', patients: 8 }
  ];

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Mock data for demonstration
      setStats({
        totalPatients: 45,
        activeSessions: 8,
        completionRate: 87,
        relapseRate: 13
      });
      
      // Uncomment when database is set up:
      /*
      // Fetch total patients
      const { count: totalPatients } = await supabase
        .from('patients')
        .select('*', { count: 'exact', head: true });

      // Fetch active sessions
      const { count: activeSessions } = await supabase
        .from('sessions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'scheduled');

      setStats({
        totalPatients: totalPatients || 0,
        activeSessions: activeSessions || 0,
        completionRate: 87,
        relapseRate: 13
      });
      */
    } catch (error: any) {
      toast({
        title: t("error_loading_stats"),
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const exportReport = () => {
    toast({
      title: t("exporting_report"),
      description: t("report_will_be_downloaded_soon"),
    });
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