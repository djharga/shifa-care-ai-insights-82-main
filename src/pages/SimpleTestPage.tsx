import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { 
  CheckCircle, 
  Users, 
  Calendar, 
  Brain, 
  Settings, 
  Activity, 
  DollarSign,
  ArrowRight
} from 'lucide-react';

const SimpleTestPage = () => {
  const testLinks = [
    { icon: Users, title: 'المرضى', href: '/patients', color: 'bg-blue-500' },
    { icon: Calendar, title: 'الجلسات', href: '/sessions', color: 'bg-green-500' },
    { icon: Brain, title: 'الذكاء الاصطناعي', href: '/ai-sessions', color: 'bg-purple-500' },
    { icon: Settings, title: 'الإعدادات', href: '/admin', color: 'bg-orange-500' },
    { icon: Activity, title: 'الجلسات المتقدمة', href: '/advanced-sessions', color: 'bg-red-500' },
    { icon: DollarSign, title: 'المالية', href: '/finance', color: 'bg-teal-500' }
  ];

  return (
    <div className="min-h-screen bg-background p-8" dir="rtl">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            اختبار التوجيه البسيط
          </h1>
          <p className="text-muted-foreground text-lg mb-4">
            للتأكد من أن جميع الروابط تعمل بشكل صحيح
          </p>
          <div className="flex justify-center space-x-4 space-x-reverse">
            <Badge variant="default" className="bg-green-500">
              ✅ النظام جاهز
            </Badge>
            <Badge variant="outline">
              النسخة 2025.2.1
            </Badge>
          </div>
        </div>

        {/* Status Card */}
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 space-x-reverse text-green-800">
              <CheckCircle className="h-5 w-5" />
              <span>حالة النظام</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 space-x-reverse p-3 bg-white rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <div className="font-medium">React Router</div>
                  <div className="text-sm text-muted-foreground">التوجيه يعمل</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 space-x-reverse p-3 bg-white rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <div className="font-medium">TypeScript</div>
                  <div className="text-sm text-muted-foreground">نوع البيانات</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 space-x-reverse p-3 bg-white rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <div className="font-medium">Tailwind CSS</div>
                  <div className="text-sm text-muted-foreground">الأنماط</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Links */}
        <Card>
          <CardHeader>
            <CardTitle>اختبار الروابط</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {testLinks.map((item, index) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={index}
                    to={item.href}
                    className="block p-4 border rounded-lg hover:shadow-md transition-all duration-200 hover:scale-105"
                  >
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <div className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-lg">{item.title}</div>
                        <div className="text-sm text-muted-foreground">انقر للانتقال</div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Back to Main */}
        <div className="text-center">
          <Link to="/">
            <Button size="lg" variant="outline">
              العودة للصفحة الرئيسية
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SimpleTestPage; 