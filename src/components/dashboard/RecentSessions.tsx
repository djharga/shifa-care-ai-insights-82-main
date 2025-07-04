import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User } from "lucide-react";

const RecentSessions = () => {
  const sessions = [
    {
      id: 1,
      patientName: "أحمد عبدالله",
      therapist: "د. سارة محمد",
      type: "دعم نفسي",
      date: "2024-07-03",
      time: "10:00",
      status: "مكتملة",
      statusColor: "success",
    },
    {
      id: 2,
      patientName: "فاطمة علي",
      therapist: "د. محمد أحمد",
      type: "جلسة جماعية",
      date: "2024-07-03",
      time: "11:30",
      status: "قيد التنفيذ",
      statusColor: "info",
    },
    {
      id: 3,
      patientName: "محمد حسن",
      therapist: "د. نور الدين",
      type: "تقييم",
      date: "2024-07-03",
      time: "14:00",
      status: "مجدولة",
      statusColor: "warning",
    },
    {
      id: 4,
      patientName: "زينب كريم",
      therapist: "د. سارة محمد",
      type: "متابعة",
      date: "2024-07-02",
      time: "09:00",
      status: "غياب",
      statusColor: "destructive",
    },
  ];

  const getStatusBadgeVariant = (color: string) => {
    switch (color) {
      case "success":
        return "default";
      case "info":
        return "secondary";
      case "warning":
        return "outline";
      case "destructive":
        return "destructive";
      default:
        return "default";
    }
  };

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
          <Calendar className="h-5 w-5 text-primary" />
          <span>الجلسات الأخيرة</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-foreground">{session.patientName}</h4>
                  <Badge variant={getStatusBadgeVariant(session.statusColor)}>
                    {session.status}
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-4 rtl:space-x-reverse text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1 rtl:space-x-reverse">
                    <User className="h-3 w-3" />
                    <span>{session.therapist}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1 rtl:space-x-reverse">
                    <Calendar className="h-3 w-3" />
                    <span>{session.date}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1 rtl:space-x-reverse">
                    <Clock className="h-3 w-3" />
                    <span>{session.time}</span>
                  </div>
                </div>
                
                <p className="text-xs text-muted-foreground mt-1">{session.type}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentSessions;