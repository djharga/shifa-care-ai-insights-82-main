import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, UserPlus, Calendar, FileText, Brain, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const QuickActions = () => {
  const actions = [
    {
      title: "ضيف عيان جديد",
      description: "سجّل عيان جديد في النظام",
      icon: UserPlus,
      variant: "default" as const,
      link: "/patients"
    },
    {
      title: "ظبط جلسة",
      description: "حدد معاد جلسة علاجية",
      icon: Calendar,
      variant: "secondary" as const,
      link: "/sessions"
    },
    {
      title: "جلسة بالذكاء الاصطناعي",
      description: "أنشئ جلسة مع تحليل ذكي",
      icon: Sparkles,
      variant: "outline" as const,
      link: "/advanced-sessions"
    },
    {
      title: "اعمل تقرير",
      description: "طلع تقرير شامل",
      icon: FileText,
      variant: "outline" as const,
      link: "/reports"
    },
    {
      title: "اقترح علاج بالذكاء الصناعي",
      description: "خد خطة علاجية مقترحة",
      icon: Brain,
      variant: "secondary" as const,
      link: "/ai-treatment"
    },
  ];

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
          <Plus className="h-5 w-5 text-primary" />
          <span>إجراءات سريعة</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {actions.map((action, index) => (
            <Link key={index} to={action.link}>
              <Button
                variant={action.variant}
                className="h-auto p-4 justify-start text-right w-full"
              >
                <div className="flex items-center space-x-3 rtl:space-x-reverse w-full">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <action.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 text-right">
                    <p className="font-medium">{action.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {action.description}
                    </p>
                  </div>
                </div>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;