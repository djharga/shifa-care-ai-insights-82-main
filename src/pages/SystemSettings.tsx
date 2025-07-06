import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, 
  Database, 
  Shield, 
  Users, 
  Bell, 
  Palette, 
  Globe, 
  Zap,
  Save,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Wifi,
  WifiOff,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Calendar,
  Clock,
  FileText,
  Download,
  Upload,
  Trash2,
  Plus,
  Edit,
  Copy,
  ExternalLink
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
      title: "تم النسخ",
      description: "تم نسخ مفتاح API إلى الحافظة",
    });
  };

  // إنشاء مفتاح API جديد
  const generateApiKey = () => {
    const newKey = 'sk-' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setSettings(prev => ({ ...prev, openaiApiKey: newKey }));
    toast({
      title: "تم إنشاء مفتاح جديد",
      description: "تم إنشاء مفتاح API جديد",
    });
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Settings className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">إعدادات النظام</h1>
                <p className="text-muted-foreground">إدارة جميع إعدادات النظام والمركز العلاجي</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => window.location.reload()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                إعادة تعيين
              </Button>
              <Button onClick={saveSettings} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    حفظ...
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
        </div>

        {/* التبويبات الرئيسية */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="general">عامة</TabsTrigger>
            <TabsTrigger value="security">الأمان</TabsTrigger>
            <TabsTrigger value="ai">الذكاء الاصطناعي</TabsTrigger>
            <TabsTrigger value="database">قاعدة البيانات</TabsTrigger>
            <TabsTrigger value="notifications">الإشعارات</TabsTrigger>
            <TabsTrigger value="interface">الواجهة</TabsTrigger>
          </TabsList>

          {/* الإعدادات العامة */}
          <TabsContent value="general" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Globe className="h-5 w-5" />
                    <span>إعدادات الموقع</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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
                        <SelectItem value="UTC">UTC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="dateFormat">تنسيق التاريخ</Label>
                    <Select value={settings.dateFormat} onValueChange={(value) => setSettings(prev => ({ ...prev, dateFormat: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Zap className="h-5 w-5" />
                    <span>إعدادات الأداء</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>تفعيل التخزين المؤقت</Label>
                      <p className="text-sm text-muted-foreground">تحسين سرعة تحميل الصفحات</p>
                    </div>
                    <Switch
                      checked={settings.cacheEnabled}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, cacheEnabled: checked }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cacheDuration">مدة التخزين المؤقت (ثانية)</Label>
                    <Input
                      id="cacheDuration"
                      type="number"
                      value={settings.cacheDuration}
                      onChange={(e) => setSettings(prev => ({ ...prev, cacheDuration: parseInt(e.target.value) }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>تحسين الصور</Label>
                      <p className="text-sm text-muted-foreground">ضغط الصور تلقائياً</p>
                    </div>
                    <Switch
                      checked={settings.imageOptimization}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, imageOptimization: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>التحميل الكسول</Label>
                      <p className="text-sm text-muted-foreground">تحميل المحتوى عند الحاجة</p>
                    </div>
                    <Switch
                      checked={settings.lazyLoading}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, lazyLoading: checked }))}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* إعدادات الأمان */}
          <TabsContent value="security" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>إعدادات الأمان</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="sessionTimeout">مهلة الجلسة (دقيقة)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      value={settings.sessionTimeout}
                      onChange={(e) => setSettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxLoginAttempts">الحد الأقصى لمحاولات تسجيل الدخول</Label>
                    <Input
                      id="maxLoginAttempts"
                      type="number"
                      value={settings.maxLoginAttempts}
                      onChange={(e) => setSettings(prev => ({ ...prev, maxLoginAttempts: parseInt(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="passwordMinLength">الحد الأدنى لطول كلمة المرور</Label>
                    <Input
                      id="passwordMinLength"
                      type="number"
                      value={settings.passwordMinLength}
                      onChange={(e) => setSettings(prev => ({ ...prev, passwordMinLength: parseInt(e.target.value) }))}
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
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>المصادقة الثنائية</Label>
                      <p className="text-sm text-muted-foreground">تطلب رمز إضافي عند تسجيل الدخول</p>
                    </div>
                    <Switch
                      checked={settings.requireTwoFactor}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, requireTwoFactor: checked }))}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Lock className="h-5 w-5" />
                    <span>إعدادات الخصوصية</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="dataRetentionDays">مدة الاحتفاظ بالبيانات (يوم)</Label>
                    <Input
                      id="dataRetentionDays"
                      type="number"
                      value={settings.dataRetentionDays}
                      onChange={(e) => setSettings(prev => ({ ...prev, dataRetentionDays: parseInt(e.target.value) }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>إخفاء هوية البيانات</Label>
                      <p className="text-sm text-muted-foreground">إزالة المعلومات الشخصية من التقارير</p>
                    </div>
                    <Switch
                      checked={settings.anonymizeData}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, anonymizeData: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>توافق GDPR</Label>
                      <p className="text-sm text-muted-foreground">الامتثال لقوانين حماية البيانات الأوروبية</p>
                    </div>
                    <Switch
                      checked={settings.gdprCompliance}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, gdprCompliance: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>سجل التدقيق</Label>
                      <p className="text-sm text-muted-foreground">تسجيل جميع العمليات للتتبع</p>
                    </div>
                    <Switch
                      checked={settings.auditLogEnabled}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, auditLogEnabled: checked }))}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* إعدادات الذكاء الاصطناعي */}
          <TabsContent value="ai" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Zap className="h-5 w-5" />
                    <span>إعدادات OpenAI</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>تفعيل OpenAI</Label>
                      <p className="text-sm text-muted-foreground">تفعيل خدمات الذكاء الاصطناعي</p>
                    </div>
                    <Switch
                      checked={settings.aiEnabled}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, aiEnabled: checked }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="openaiApiKey">مفتاح API</Label>
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
                        size="icon"
                        onClick={() => setShowApiKeys(!showApiKeys)}
                      >
                        {showApiKeys ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => copyApiKey(settings.openaiApiKey)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={generateApiKey}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="aiResponseTimeout">مهلة الاستجابة (ثانية)</Label>
                    <Input
                      id="aiResponseTimeout"
                      type="number"
                      value={settings.aiResponseTimeout}
                      onChange={(e) => setSettings(prev => ({ ...prev, aiResponseTimeout: parseInt(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="aiMaxTokens">الحد الأقصى للكلمات</Label>
                    <Input
                      id="aiMaxTokens"
                      type="number"
                      value={settings.aiMaxTokens}
                      onChange={(e) => setSettings(prev => ({ ...prev, aiMaxTokens: parseInt(e.target.value) }))}
                    />
                  </div>
                  <Button onClick={testAIConnection} className="w-full">
                    <Wifi className="h-4 w-4 mr-2" />
                    اختبار الاتصال
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Globe className="h-5 w-5" />
                    <span>إعدادات Google AI</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>تفعيل Google AI</Label>
                      <p className="text-sm text-muted-foreground">استخدام خدمات Google للذكاء الاصطناعي</p>
                    </div>
                    <Switch
                      checked={settings.googleAiEnabled}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, googleAiEnabled: checked }))}
                    />
                  </div>
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
                        size="icon"
                        onClick={() => copyApiKey(settings.googleAiApiKey)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">معلومات مهمة</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• احتفظ بمفاتيح API آمنة ولا تشاركها</li>
                      <li>• استخدم متغيرات البيئة للإنتاج</li>
                      <li>• راقب استخدام API لتجنب تجاوز الحدود</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* إعدادات قاعدة البيانات */}
          <TabsContent value="database" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Database className="h-5 w-5" />
                    <span>إعدادات النسخ الاحتياطي</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>النسخ الاحتياطي التلقائي</Label>
                      <p className="text-sm text-muted-foreground">إنشاء نسخ احتياطية تلقائياً</p>
                    </div>
                    <Switch
                      checked={settings.databaseBackupEnabled}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, databaseBackupEnabled: checked }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="backupFrequency">تكرار النسخ الاحتياطي</Label>
                    <Select value={settings.backupFrequency} onValueChange={(value: 'daily' | 'weekly' | 'monthly') => setSettings(prev => ({ ...prev, backupFrequency: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">يومي</SelectItem>
                        <SelectItem value="weekly">أسبوعي</SelectItem>
                        <SelectItem value="monthly">شهري</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="backupRetentionDays">مدة الاحتفاظ بالنسخ (يوم)</Label>
                    <Input
                      id="backupRetentionDays"
                      type="number"
                      value={settings.backupRetentionDays}
                      onChange={(e) => setSettings(prev => ({ ...prev, backupRetentionDays: parseInt(e.target.value) }))}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      إنشاء نسخة احتياطية
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Upload className="h-4 w-4 mr-2" />
                      استعادة نسخة احتياطية
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Zap className="h-5 w-5" />
                    <span>تحسين الأداء</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>التحسين التلقائي</Label>
                      <p className="text-sm text-muted-foreground">تحسين قاعدة البيانات تلقائياً</p>
                    </div>
                    <Switch
                      checked={settings.autoOptimization}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoOptimization: checked }))}
                    />
                  </div>
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-green-900">حالة قاعدة البيانات</span>
                    </div>
                    <div className="text-sm text-green-800 space-y-1">
                      <div>• الحجم: 2.3 GB</div>
                      <div>• عدد الجلسات: 1,247</div>
                      <div>• آخر تحسين: منذ ساعتين</div>
                      <div>• الحالة: ممتازة</div>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    تحسين قاعدة البيانات الآن
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* إعدادات الإشعارات */}
          <TabsContent value="notifications" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="h-5 w-5" />
                    <span>إعدادات الإشعارات</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>إشعارات البريد الإلكتروني</Label>
                      <p className="text-sm text-muted-foreground">إرسال إشعارات عبر البريد الإلكتروني</p>
                    </div>
                    <Switch
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, emailNotifications: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>إشعارات الرسائل النصية</Label>
                      <p className="text-sm text-muted-foreground">إرسال إشعارات عبر الرسائل النصية</p>
                    </div>
                    <Switch
                      checked={settings.smsNotifications}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, smsNotifications: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>إشعارات المتصفح</Label>
                      <p className="text-sm text-muted-foreground">إشعارات فورية في المتصفح</p>
                    </div>
                    <Switch
                      checked={settings.pushNotifications}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, pushNotifications: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>صوت الإشعارات</Label>
                      <p className="text-sm text-muted-foreground">تشغيل صوت عند وصول إشعار</p>
                    </div>
                    <Switch
                      checked={settings.notificationSound}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, notificationSound: checked }))}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span>أنواع الإشعارات</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">جلسات جديدة</div>
                        <div className="text-sm text-muted-foreground">إشعار عند جدولة جلسة جديدة</div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">تحديثات الأهداف</div>
                        <div className="text-sm text-muted-foreground">إشعار عند تحديث أهداف العلاج</div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">تقارير جاهزة</div>
                        <div className="text-sm text-muted-foreground">إشعار عند جاهزية التقارير</div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">تنبيهات النظام</div>
                        <div className="text-sm text-muted-foreground">إشعارات فنية وإدارية</div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* إعدادات الواجهة */}
          <TabsContent value="interface" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Palette className="h-5 w-5" />
                    <span>إعدادات المظهر</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>الوضع العربي (RTL)</Label>
                      <p className="text-sm text-muted-foreground">تفعيل الكتابة من اليمين لليسار</p>
                    </div>
                    <Switch
                      checked={settings.rtlEnabled}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, rtlEnabled: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>الوضع المضغوط</Label>
                      <p className="text-sm text-muted-foreground">تقليل المسافات لعرض أكثر محتوى</p>
                    </div>
                    <Switch
                      checked={settings.compactMode}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, compactMode: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>الحركات والانتقالات</Label>
                      <p className="text-sm text-muted-foreground">تفعيل الحركات والانتقالات</p>
                    </div>
                    <Switch
                      checked={settings.animationsEnabled}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, animationsEnabled: checked }))}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>إعدادات المستخدمين</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <span className="font-medium text-yellow-900">إعدادات متقدمة</span>
                    </div>
                    <p className="text-sm text-yellow-800">
                      هذه الإعدادات تؤثر على جميع المستخدمين. يرجى الحذر عند التعديل.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Users className="h-4 w-4 mr-2" />
                      إدارة الصلاحيات
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Shield className="h-4 w-4 mr-2" />
                      إعدادات الأمان للمستخدمين
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      قوالب التقارير
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Calendar className="h-4 w-4 mr-2" />
                      إعدادات الجدولة
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default SystemSettings; 