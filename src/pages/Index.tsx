import { Users, Calendar, Brain, TrendingUp, UserCheck, AlertCircle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import StatsCard from "@/components/dashboard/StatsCard";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentSessions from "@/components/dashboard/RecentSessions";
import TreatmentProgress from "@/components/dashboard/TreatmentProgress";
import TodaySessions from "@/components/dashboard/TodaySessions";
import NotificationCenter from "@/components/dashboard/NotificationCenter";
import AISessionsQuickAccess from "@/components/dashboard/AISessionsQuickAccess";
import { useTranslation } from 'react-i18next';
import i18n from '../lib/i18n';

const Index = () => {
  const { t } = useTranslation();
  const stats = [
    {
      title: "عدد العيانين الكلي",
      value: 45,
      description: "عيان شغال معانا دلوقتي",
      icon: Users,
      trend: { value: 12, isPositive: true },
      variant: "default" as const,
    },
    {
      title: "جلسات النهاردة",
      value: 8,
      description: "جلسة متظبطة لليوم",
      icon: Calendar,
      trend: { value: 25, isPositive: true },
      variant: "info" as const,
    },
    {
      title: "معدل التحسن",
      value: "85%",
      description: "نسبة التحسن الشهر ده",
      icon: TrendingUp,
      trend: { value: 8, isPositive: true },
      variant: "success" as const,
    },
    {
      title: "حالات الانتكاسة",
      value: 3,
      description: "حالات محتاجة متابعة",
      icon: AlertCircle,
      trend: { value: 15, isPositive: false },
      variant: "warning" as const,
    },
    {
      title: "المعالجين الشغالين",
      value: 12,
      description: "معالج شغال دلوقتي",
      icon: UserCheck,
      trend: { value: 5, isPositive: true },
      variant: "default" as const,
    },
    {
      title: "استشارات الذكاء الاصطناعي",
      value: 23,
      description: "استشارة الأسبوع ده",
      icon: Brain,
      trend: { value: 45, isPositive: true },
      variant: "info" as const,
    },
    {
      title: "الجلسات بالذكاء الاصطناعي",
      value: 15,
      description: "جلسة محللة بالذكاء الاصطناعي",
      icon: Brain,
      trend: { value: 67, isPositive: true },
      variant: "success" as const,
    },
  ];

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">{t('dashboard')}</h1>
            <p className="text-muted-foreground">
              أهلاً بيك في نظام شفا كير - هنا هتلاقي كل جديد عن العيانين والجلسات
            </p>
          </div>
          <div>
            <button onClick={() => i18n.changeLanguage('ar')}>فصحى</button>
            <button onClick={() => i18n.changeLanguage('ar-EG')} style={{marginRight: 8}}>مصري</button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <StatsCard
              key={index}
              title={stat.title}
              value={stat.value}
              description={stat.description}
              icon={stat.icon}
              trend={stat.trend}
              variant={stat.variant}
            />
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            <QuickActions />
            <TodaySessions />
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1 space-y-8">
            <AISessionsQuickAccess />
            <TreatmentProgress />
            <NotificationCenter />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
