import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  AlertCircle, 
  Info, 
  Users,
  Calendar,
  Brain,
  Settings,
  Activity,
  DollarSign,
  ArrowRight,
  TrendingUp
} from 'lucide-react';

const TestPage = () => {
  return (
    <div className="min-h-screen bg-background p-8" dir="rtl">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            صفحة اختبار النظام الشاملة
          </h1>
          <p className="text-muted-foreground text-lg mb-4">
            للتأكد من أن جميع المكونات والأنماط تعمل بشكل صحيح
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

        {/* System Status */}
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 space-x-reverse text-green-800">
              <CheckCircle className="h-5 w-5" />
              <span>حالة النظام</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center space-x-3 space-x-reverse p-3 bg-white rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <div className="font-medium">React</div>
                  <div className="text-sm text-muted-foreground">مكونات تعمل</div>
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
              <div className="flex items-center space-x-3 space-x-reverse p-3 bg-white rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <div className="font-medium">RTL</div>
                  <div className="text-sm text-muted-foreground">العربية</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Section */}
        <Tabs defaultValue="components" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="components">المكونات</TabsTrigger>
            <TabsTrigger value="navigation">التنقل</TabsTrigger>
            <TabsTrigger value="forms">النماذج</TabsTrigger>
            <TabsTrigger value="data">البيانات</TabsTrigger>
          </TabsList>

          <TabsContent value="components" className="space-y-6">
            {/* Component Test Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Card 1 - Basic */}
              <Card className="debug-border">
                <CardHeader>
                  <CardTitle className="text-primary">بطاقة أساسية</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground mb-4">
                    هذه بطاقة اختبار للتأكد من أن الأنماط الأساسية شغالة
                  </p>
                  <Button className="w-full">زر تجريبي</Button>
                </CardContent>
              </Card>

              {/* Card 2 - Stats */}
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-100">
                <CardHeader>
                  <CardTitle className="text-blue-600">إحصائيات</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">المرضى:</span>
                      <Badge variant="default">45</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">الجلسات:</span>
                      <Badge variant="secondary">12</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">المعالجين:</span>
                      <Badge variant="outline">8</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Card 3 - Actions */}
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="text-green-600">إجراءات سريعة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      ➕ إضافة مريض جديد
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      📅 جدولة جلسة
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      🧠 جلسة بالذكاء الاصطناعي
                    </Button>
                  </div>
                </CardContent>
              </Card>

            </div>

            {/* Alerts Test */}
            <div className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  هذا تنبيه معلوماتي للتأكد من أن مكون التنبيهات يعمل بشكل صحيح.
                </AlertDescription>
              </Alert>
              
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  هذا تنبيه خطأ للتأكد من أن مكون التنبيهات يعمل بشكل صحيح.
                </AlertDescription>
              </Alert>
            </div>

            {/* Progress Test */}
            <Card>
              <CardHeader>
                <CardTitle>اختبار شريط التقدم</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span>تقدم العلاج</span>
                    <span>75%</span>
                  </div>
                  <Progress value={75} className="w-full" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span>معدل النجاح</span>
                    <span>90%</span>
                  </div>
                  <Progress value={90} className="w-full" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="navigation" className="space-y-6">
            {/* Navigation Test */}
            <Card>
              <CardHeader>
                <CardTitle>اختبار التنقل</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { icon: Users, title: 'المرضى', href: '/patients' },
                    { icon: Calendar, title: 'الجلسات', href: '/sessions' },
                    { icon: Brain, title: 'الذكاء الاصطناعي', href: '/ai-sessions' },
                    { icon: Settings, title: 'الإعدادات', href: '/admin' },
                    { icon: Activity, title: 'الجلسات المتقدمة', href: '/advanced-sessions' },
                    { icon: DollarSign, title: 'المالية', href: '/finance' }
                  ].map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <div key={index} className="flex items-center space-x-3 space-x-reverse p-3 border rounded-lg hover:bg-muted cursor-pointer">
                        <Icon className="h-5 w-5 text-primary" />
                        <span className="font-medium">{item.title}</span>
                        <ArrowRight className="h-4 w-4 text-muted-foreground mr-auto" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="forms" className="space-y-6">
            {/* Forms Test */}
            <Card>
              <CardHeader>
                <CardTitle>اختبار النماذج</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">الاسم</Label>
                      <Input id="name" placeholder="أدخل الاسم" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">البريد الإلكتروني</Label>
                      <Input id="email" type="email" placeholder="أدخل البريد الإلكتروني" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">ملاحظات</Label>
                    <Input id="notes" placeholder="أدخل الملاحظات" />
                  </div>
                  <div className="flex space-x-2 space-x-reverse">
                    <Button>حفظ</Button>
                    <Button variant="outline">إلغاء</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data" className="space-y-6">
            {/* Data Visualization Test */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <div className="p-3 bg-blue-500 rounded-lg">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">إجمالي المرضى</p>
                      <p className="text-2xl font-bold">45</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <div className="p-3 bg-green-500 rounded-lg">
                      <Calendar className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">الجلسات اليوم</p>
                      <p className="text-2xl font-bold">12</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <div className="p-3 bg-purple-500 rounded-lg">
                      <Brain className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">جلسات الذكاء الاصطناعي</p>
                      <p className="text-2xl font-bold">23</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <div className="p-3 bg-orange-500 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">معدل النجاح</p>
                      <p className="text-2xl font-bold">85%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Color Test */}
        <Card>
          <CardHeader>
            <CardTitle>اختبار الألوان</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <div className="p-4 bg-primary text-primary-foreground rounded-lg text-center">
                Primary
              </div>
              <div className="p-4 bg-secondary text-secondary-foreground rounded-lg text-center">
                Secondary
              </div>
              <div className="p-4 bg-success text-success-foreground rounded-lg text-center">
                Success
              </div>
              <div className="p-4 bg-warning text-warning-foreground rounded-lg text-center">
                Warning
              </div>
              <div className="p-4 bg-destructive text-destructive-foreground rounded-lg text-center">
                Destructive
              </div>
              <div className="p-4 bg-muted text-muted-foreground rounded-lg text-center">
                Muted
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Grid Test */}
        <Card>
          <CardHeader>
            <CardTitle>اختبار الشبكة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }, (_, i) => (
                <div key={i} className="p-4 bg-muted rounded-lg text-center">
                  عنصر {i + 1}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Final Status */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                ✅ اختبار النظام مكتمل بنجاح
              </h3>
              <p className="text-blue-600 mb-4">
                جميع المكونات والأنماط تعمل بشكل صحيح
              </p>
              <div className="flex justify-center space-x-4 space-x-reverse">
                <Badge variant="default" className="bg-green-500">
                  ✅ React
                </Badge>
                <Badge variant="default" className="bg-green-500">
                  ✅ TypeScript
                </Badge>
                <Badge variant="default" className="bg-green-500">
                  ✅ Tailwind CSS
                </Badge>
                <Badge variant="default" className="bg-green-500">
                  ✅ RTL
                </Badge>
                <Badge variant="default" className="bg-green-500">
                  ✅ Navigation
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default TestPage; 