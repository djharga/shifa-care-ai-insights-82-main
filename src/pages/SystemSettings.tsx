import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  Wifi, 
  WifiOff, 
  CheckCircle, 
  AlertTriangle,
  RefreshCw,
  Save,
  Globe,
  Zap,
  Shield,
  Lock,
  Eye,
  EyeOff,
  Copy,
  Plus,
  Database,
  Download,
  Upload,
  Bell,
  FileText,
  Palette,
  Users,
  Calendar
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SystemSettings {
  // إعدادات عامة
  siteName: string;
  siteDescription: string;
  timezone: string;
  dateFormat: string;
  language: string;
  
  // إعدادات الأمان
  sessionTimeout: number;
  maxLoginAttempts: number;
  requireTwoFactor: boolean;
  passwordMinLength: number;
  passwordComplexity: 'low' | 'medium' | 'high';
  
  // إعدادات الذكاء الاصطناعي
  aiEnabled: boolean;
  openaiApiKey: string;
  googleAiEnabled: boolean;
  googleAiApiKey: string;
  aiResponseTimeout: number;
  aiMaxTokens: number;
  
  // إعدادات قاعدة البيانات
  databaseBackupEnabled: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
  backupRetentionDays: number;
  autoOptimization: boolean;
  
  // إعدادات الإشعارات
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  notificationSound: boolean;
  
  // إعدادات الواجهة
  theme: 'light' | 'dark' | 'auto';
  rtlEnabled: boolean;
  compactMode: boolean;
  animationsEnabled: boolean;
  
  // إعدادات الأداء
  cacheEnabled: boolean;
  cacheDuration: number;
  imageOptimization: boolean;
  lazyLoading: boolean;
  
  // إعدادات الخصوصية
  dataRetentionDays: number;
  anonymizeData: boolean;
  gdprCompliance: boolean;
  auditLogEnabled: boolean;
}

const SystemSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<SystemSettings>({
    // إعدادات عامة
    siteName: 'شفاء كير - مركز العلاج النفسي',
    siteDescription: 'مركز متخصص في العلاج النفسي والسلوكي',
    timezone: 'Africa/Cairo',
    dateFormat: 'DD/MM/YYYY',
    language: 'ar-EG',
    
    // إعدادات الأمان
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    requireTwoFactor: false,
    passwordMinLength: 8,
    passwordComplexity: 'medium',
    
    // إعدادات الذكاء الاصطناعي
    aiEnabled: true,
    openaiApiKey: '',
    googleAiEnabled: false,
    googleAiApiKey: '',
    aiResponseTimeout: 30,
    aiMaxTokens: 2000,
    
    // إعدادات قاعدة البيانات
    databaseBackupEnabled: true,
    backupFrequency: 'daily',
    backupRetentionDays: 30,
    autoOptimization: true,
    
    // إعدادات الإشعارات
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    notificationSound: true,
    
    // إعدادات الواجهة
    theme: 'auto',
    rtlEnabled: true,
    compactMode: false,
    animationsEnabled: true,
    
    // إعدادات الأداء
    cacheEnabled: true,
    cacheDuration: 3600,
    imageOptimization: true,
    lazyLoading: true,
    
    // إعدادات الخصوصية
    dataRetentionDays: 365,
    anonymizeData: false,
    gdprCompliance: true,
    auditLogEnabled: true
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showApiKeys, setShowApiKeys] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  // حفظ الإعدادات
  const saveSettings = async () => {
    setIsLoading(true);
    try {
      // محاكاة حفظ الإعدادات
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "✅ تم حفظ الإعدادات",
        description: "تم حفظ جميع الإعدادات بنجاح",
      });
    } catch (error) {
      toast({
        title: "❌ خطأ في الحفظ",
        description: "فشل في حفظ الإعدادات",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // اختبار الاتصال بالذكاء الاصطناعي
  const testAIConnection = async () => {
    try {
      // محاكاة اختبار الاتصال
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "✅ اتصال ناجح",
        description: "تم اختبار الاتصال بالذكاء الاصطناعي بنجاح",
      });
    } catch (error) {
      toast({
        title: "❌ فشل في الاتصال",
        description: "فشل في الاتصال بالذكاء الاصطناعي",
        variant: "destructive",
      });
    }
  };

  // نسخ مفتاح API
  const copyApiKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast({
      title: "✅ تم النسخ",
      description: "تم نسخ مفتاح API إلى الحافظة",
    });
  };

  // توليد مفتاح API جديد
  const generateApiKey = () => {
    const newKey = 'sk-' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setSettings(prev => ({ ...prev, openaiApiKey: newKey }));
    toast({
      title: "✅ تم التوليد",
      description: "تم توليد مفتاح API جديد",
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">إعدادات النظام</h1>
          <p className="text-gray-600">إدارة إعدادات النظام والمنصة</p>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={testAIConnection}
            variant="outline"
            className="flex items-center"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            اختبار الاتصال
          </Button>
          <Button
            onClick={saveSettings}
            disabled={isLoading}
            className="flex items-center"
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                جاري الحفظ...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                حفظ الإعدادات
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">عامة</TabsTrigger>
          <TabsTrigger value="ai">الذكاء الاصطناعي</TabsTrigger>
          <TabsTrigger value="security">الأمان</TabsTrigger>
          <TabsTrigger value="database">قاعدة البيانات</TabsTrigger>
          <TabsTrigger value="notifications">الإشعارات</TabsTrigger>
          <TabsTrigger value="interface">الواجهة</TabsTrigger>
        </TabsList>

        {/* الإعدادات العامة */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5" />
                الإعدادات العامة
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="siteName">اسم الموقع</Label>
                  <Input
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) => setSettings(prev => ({ ...prev, siteName: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="siteDescription">وصف الموقع</Label>
                  <Input
                    id="siteDescription"
                    value={settings.siteDescription}
                    onChange={(e) => setSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="timezone">المنطقة الزمنية</Label>
                  <Select value={settings.timezone} onValueChange={(value) => setSettings(prev => ({ ...prev, timezone: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Africa/Cairo">القاهرة (GMT+2)</SelectItem>
                      <SelectItem value="Asia/Riyadh">الرياض (GMT+3)</SelectItem>
                      <SelectItem value="Asia/Dubai">دبي (GMT+4)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="language">اللغة</Label>
                  <Select value={settings.language} onValueChange={(value) => setSettings(prev => ({ ...prev, language: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ar-EG">العربية (مصر)</SelectItem>
                      <SelectItem value="ar-SA">العربية (السعودية)</SelectItem>
                      <SelectItem value="en-US">English (US)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* إعدادات الذكاء الاصطناعي */}
        <TabsContent value="ai" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5" />
                إعدادات الذكاء الاصطناعي
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>تفعيل الذكاء الاصطناعي</Label>
                  <p className="text-sm text-gray-600">تفعيل ميزات الذكاء الاصطناعي في النظام</p>
                </div>
                <Switch
                  checked={settings.aiEnabled}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, aiEnabled: checked }))}
                />
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="openaiApiKey">مفتاح OpenAI API</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="openaiApiKey"
                      type={showApiKeys ? "text" : "password"}
                      value={settings.openaiApiKey}
                      onChange={(e) => setSettings(prev => ({ ...prev, openaiApiKey: e.target.value }))}
                      placeholder="sk-..."
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowApiKeys(!showApiKeys)}
                    >
                      {showApiKeys ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyApiKey(settings.openaiApiKey)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={generateApiKey}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>تفعيل Google AI</Label>
                    <p className="text-sm text-gray-600">استخدام Google AI كبديل</p>
                  </div>
                  <Switch
                    checked={settings.googleAiEnabled}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, googleAiEnabled: checked }))}
                  />
                </div>

                {settings.googleAiEnabled && (
                  <div>
                    <Label htmlFor="googleAiApiKey">مفتاح Google AI API</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="googleAiApiKey"
                        type={showApiKeys ? "text" : "password"}
                        value={settings.googleAiApiKey}
                        onChange={(e) => setSettings(prev => ({ ...prev, googleAiApiKey: e.target.value }))}
                        placeholder="AIza..."
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyApiKey(settings.googleAiApiKey)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* إعدادات الأمان */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5" />
                إعدادات الأمان
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sessionTimeout">مهلة الجلسة (دقائق)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => setSettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="maxLoginAttempts">أقصى محاولات تسجيل الدخول</Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    value={settings.maxLoginAttempts}
                    onChange={(e) => setSettings(prev => ({ ...prev, maxLoginAttempts: parseInt(e.target.value) }))}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>المصادقة الثنائية</Label>
                  <p className="text-sm text-gray-600">تطلب رمز إضافي عند تسجيل الدخول</p>
                </div>
                <Switch
                  checked={settings.requireTwoFactor}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, requireTwoFactor: checked }))}
                />
              </div>

              <div>
                <Label htmlFor="passwordComplexity">تعقيد كلمة المرور</Label>
                <Select value={settings.passwordComplexity} onValueChange={(value: 'low' | 'medium' | 'high') => setSettings(prev => ({ ...prev, passwordComplexity: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">منخفض</SelectItem>
                    <SelectItem value="medium">متوسط</SelectItem>
                    <SelectItem value="high">عالي</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* إعدادات قاعدة البيانات */}
        <TabsContent value="database" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="h-5 w-5" />
                إعدادات قاعدة البيانات
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>النسخ الاحتياطي التلقائي</Label>
                  <p className="text-sm text-gray-600">إنشاء نسخ احتياطية تلقائية</p>
                </div>
                <Switch
                  checked={settings.databaseBackupEnabled}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, databaseBackupEnabled: checked }))}
                />
              </div>

              {settings.databaseBackupEnabled && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="backupFrequency">تكرار النسخ الاحتياطي</Label>
                    <Select value={settings.backupFrequency} onValueChange={(value: 'daily' | 'weekly' | 'monthly') => setSettings(prev => ({ ...prev, backupFrequency: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">يومياً</SelectItem>
                        <SelectItem value="weekly">أسبوعياً</SelectItem>
                        <SelectItem value="monthly">شهرياً</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" className="flex items-center">
                      <Download className="h-4 w-4 mr-2" />
                      تحميل نسخة احتياطية
                    </Button>
                    <Button variant="outline" className="flex items-center">
                      <Upload className="h-4 w-4 mr-2" />
                      استعادة نسخة احتياطية
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div>
                  <Label>التحسين التلقائي</Label>
                  <p className="text-sm text-gray-600">تحسين قاعدة البيانات تلقائياً</p>
                </div>
                <Switch
                  checked={settings.autoOptimization}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoOptimization: checked }))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* إعدادات الإشعارات */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5" />
                إعدادات الإشعارات
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>إشعارات البريد الإلكتروني</Label>
                    <p className="text-sm text-gray-600">إرسال إشعارات عبر البريد الإلكتروني</p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, emailNotifications: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>إشعارات SMS</Label>
                    <p className="text-sm text-gray-600">إرسال إشعارات عبر الرسائل النصية</p>
                  </div>
                  <Switch
                    checked={settings.smsNotifications}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, smsNotifications: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>إشعارات Push</Label>
                    <p className="text-sm text-gray-600">إشعارات فورية في المتصفح</p>
                  </div>
                  <Switch
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, pushNotifications: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>صوت الإشعارات</Label>
                    <p className="text-sm text-gray-600">تشغيل صوت عند استلام إشعار</p>
                  </div>
                  <Switch
                    checked={settings.notificationSound}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, notificationSound: checked }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* إعدادات الواجهة */}
        <TabsContent value="interface" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="h-5 w-5" />
                إعدادات الواجهة
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="theme">المظهر</Label>
                  <Select value={settings.theme} onValueChange={(value: 'light' | 'dark' | 'auto') => setSettings(prev => ({ ...prev, theme: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">فاتح</SelectItem>
                      <SelectItem value="dark">داكن</SelectItem>
                      <SelectItem value="auto">تلقائي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="language">اللغة</Label>
                  <Select value={settings.language} onValueChange={(value) => setSettings(prev => ({ ...prev, language: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ar-EG">العربية (مصر)</SelectItem>
                      <SelectItem value="ar-SA">العربية (السعودية)</SelectItem>
                      <SelectItem value="en-US">English (US)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>الوضع المضغوط</Label>
                    <p className="text-sm text-gray-600">تقليل المسافات والعناصر</p>
                  </div>
                  <Switch
                    checked={settings.compactMode}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, compactMode: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>الحركات</Label>
                    <p className="text-sm text-gray-600">تفعيل الحركات والانتقالات</p>
                  </div>
                  <Switch
                    checked={settings.animationsEnabled}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, animationsEnabled: checked }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5" />
                إعدادات المستخدمين
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Button variant="outline" className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  إدارة المستخدمين
                </Button>
                <Button variant="outline" className="flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  إدارة الصلاحيات
                </Button>
                <Button variant="outline" className="flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  سجل النشاط
                </Button>
                <Button variant="outline" className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  الجدول الزمني
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemSettings; 