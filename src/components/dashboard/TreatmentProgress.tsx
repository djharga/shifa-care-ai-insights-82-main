import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Users, Activity } from "lucide-react";

const TreatmentProgress = () => {
  const progressData = [
    {
      stage: "مرحلة الانسحاب",
      patients: 12,
      total: 45,
      percentage: 27,
      color: "bg-warning",
    },
    {
      stage: "إعادة التأهيل",
      patients: 18,
      total: 45,
      percentage: 40,
      color: "bg-info",
    },
    {
      stage: "المتابعة",
      patients: 15,
      total: 45,
      percentage: 33,
      color: "bg-success",
    },
  ];

  const recoveryStats = [
    {
      label: "معدل التحسن الشهري",
      value: "85%",
      trend: "+12%",
      icon: TrendingUp,
    },
    {
      label: "المرضى النشطون",
      value: "45",
      trend: "+5",
      icon: Users,
    },
    {
      label: "الجلسات هذا الأسبوع",
      value: "127",
      trend: "+23",
      icon: Activity,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Treatment Stages Progress */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
            <Activity className="h-5 w-5 text-primary" />
            <span>توزيع المرضى حسب مراحل العلاج</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {progressData.map((stage, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-foreground">
                    {stage.stage}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {stage.patients} من {stage.total} مريض
                  </span>
                </div>
                <Progress value={stage.percentage} className="h-2" />
                <div className="text-xs text-muted-foreground text-right">
                  {stage.percentage}%
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recovery Statistics */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span>إحصائيات التعافي</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recoveryStats.map((stat, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
              >
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {stat.label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      تحسن بنسبة {stat.trend} من الشهر الماضي
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-success font-medium">{stat.trend}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TreatmentProgress;