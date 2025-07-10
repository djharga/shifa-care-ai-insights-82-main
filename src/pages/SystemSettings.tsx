import React, { useState, useEffect } from 'react';
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
import { supabase } from '@/integrations/supabase/client';

interface SystemSettings {
  id?: string;
  // إعدادات عامة
  site_name: string;
  site_description: string;
  timezone: string;
  date_format: string;
  language: string;
  
  // إعدادات الأمان
  session_timeout: number;
  max_login_attempts: number;
  require_two_factor: boolean;
  password_min_length: number;
  password_complexity: 'low' | 'medium' | 'high';
  
  // إعدادات الذكاء الاصطناعي
  ai_enabled: boolean;
  openai_api_key: string;
  google_ai_enabled: boolean;
  google_ai_api_key: string;
  ai_response_timeout: number;
  ai_max_tokens: number;
  
  // إعدادات قاعدة البيانات
  database_backup_enabled: boolean;
  backup_frequency: 'daily' | 'weekly' | 'monthly';
  backup_retention_days: number;
  auto_optimization: boolean;
  
  // إعدادات الإشعارات
  email_notifications: boolean;
  sms_notifications: boolean;
  push_notifications: boolean;
  notification_sound: boolean;
  
  // إعدادات الواجهة
  theme: 'light' | 'dark' | 'auto';
  rtl_enabled: boolean;
  compact_mode: boolean;
  animations_enabled: boolean;
  
  // إعدادات الأداء
  cache_enabled: boolean;
  cache_duration: number;
  image_optimization: boolean;
  lazy_loading: boolean;
  
  // إعدادات الخصوصية
  data_retention_days: number;
  anonymize_data: boolean;
  gdpr_compliance: boolean;
  audit_log_enabled: boolean;
  
  created_at?: string;
  updated_at?: string;
}

const SystemSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<SystemSettings>({
    // إعدادات عامة
    site_name: 'شفاء كير - مركز العلاج النفسي',
    site_description: 'مركز متخصص في العلاج النفسي والسلوكي',
    timezone: 'Africa/Cairo',
    date_format: 'DD/MM/YYYY',
    language: 'ar-EG',
    
    // إعدادات الأمان
    session_timeout: 30,
    max_login_attempts: 5,
    require_two_factor: false,
    password_min_length: 8,
    password_complexity: 'medium',
    
    // إعدادات الذكاء الاصطناعي
    ai_enabled: true,
    openai_api_key: '',
    google_ai_enabled: false,
    google_ai_api_key: '',
    ai_response_timeout: 30,
    ai_max_tokens: 2000,
    
    // إعدادات قاعدة البيانات
    database_backup_enabled: true,
    backup_frequency: 'daily',
    backup_retention_days: 30,
    auto_optimization: true,
    
    // إعدادات الإشعارات
    email_notifications: true,
    sms_notifications: false,
    push_notifications: true,
    notification_sound: true,
    
    // إعدادات الواجهة
    theme: 'auto',
    rtl_enabled: true,
    compact_mode: false,
    animations_enabled: true,
    
    // إعدادات الأداء
    cache_enabled: true,
    cache_duration: 3600,
    image_optimization: true,
    lazy_loading: true,
    
    // إعدادات الخصوصية
    data_retention_days: 365,
    anonymize_data: false,
    gdpr_compliance: true,
    audit_log_enabled: true
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showApiKeys, setShowApiKeys] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
      
      if (data) {
        setSettings(data);
      } else {
        // إنشاء إعدادات افتراضية إذا لم تكن موجودة
        await createDefaultSettings();
      }
    } catch (error: any) {
      console.error('Error fetching settings:', error);
      toast({
        title: "خطأ في تحميل الإعدادات",
        description: error.message || "حدث خطأ أثناء تحميل إعدادات النظام",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createDefaultSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .insert([settings])
        .select()
        .single();

      if (error) throw error;
      setSettings(data);
    } catch (error: any) {
      console.error('Error creating default settings:', error);
    }
  };

  // حفظ الإعدادات
  const saveSettings = async () => {
    setIsLoading(true);
    try {
      const settingsData = {
        ...settings,
        updated_at: new Date().toISOString()
      };

      let error;
      if (settings.id) {
        // تحديث الإعدادات الموجودة
        const { error: updateError } = await supabase
          .from('system_settings')
          .update(settingsData)
          .eq('id', settings.id);
        error = updateError;
      } else {
        // إنشاء إعدادات جديدة
        const { error: insertError } = await supabase
          .from('system_settings')
          .insert([settingsData]);
        error = insertError;
      }

      if (error) throw error;
      
      toast({
        title: "✅ تم حفظ الإعدادات",
        description: "تم حفظ جميع الإعدادات بنجاح",
      });
    } catch (error: any) {
      console.error('Error saving settings:', error);
      toast({
        title: "❌ خطأ في الحفظ",
        description: error.message || "فشل في حفظ الإعدادات",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // اختبار الاتصال بالذكاء الاصطناعي
  const testAIConnection = async () => {
    try {
      setIsLoading(true);
      
      // اختبار الاتصال بـ OpenAI
      if (settings.ai_enabled && settings.openai_api_key) {
        const response = await fetch('/api/test-openai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            apiKey: settings.openai_api_key
          })
        });

        if (!response.ok) throw new Error('فشل في الاتصال بـ OpenAI');
      }

      // اختبار الاتصال بـ Google AI
      if (settings.google_ai_enabled && settings.google_ai_api_key) {
        const response = await fetch('/api/test-google-ai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            apiKey: settings.google_ai_api_key
          })
        });

        if (!response.ok) throw new Error('فشل في الاتصال بـ Google AI');
      }
      
      toast({
        title: "✅ اتصال ناجح",
        description: "تم اختبار الاتصال بالذكاء الاصطناعي بنجاح",
      });
    } catch (error: any) {
      console.error('Error testing AI connection:', error);
      toast({
        title: "❌ فشل في الاتصال",
        description: error.message || "فشل في الاتصال بالذكاء الاصطناعي",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
  const generateApiKey = async (type: 'openai' | 'google') => {
    try {
      setIsLoading(true);
      
      // محاكاة توليد مفتاح جديد
      const newKey = `sk-${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
      
      const updatedSettings = {
        ...settings,
        [type === 'openai' ? 'openai_api_key' : 'google_ai_api_key']: newKey,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('system_settings')
        .update(updatedSettings)
        .eq('id', settings.id);

      if (error) throw error;

      setSettings(updatedSettings);
      toast({
        title: "✅ تم التوليد",
        description: `تم توليد مفتاح ${type === 'openai' ? 'OpenAI' : 'Google AI'} جديد`,
      });
    } catch (error: any) {
      console.error('Error generating API key:', error);
      toast({
        title: "❌ خطأ في التوليد",
        description: error.message || "فشل في توليد مفتاح API جديد",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
                    value={settings.site_name}
                    onChange={(e) => setSettings(prev => ({ ...prev, site_name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="siteDescription">وصف الموقع</Label>
                  <Input
                    id="siteDescription"
                    value={settings.site_description}
                    onChange={(e) => setSettings(prev => ({ ...prev, site_description: e.target.value }))}
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
                  checked={settings.ai_enabled}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, ai_enabled: checked }))}
                />
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="openaiApiKey">مفتاح OpenAI API</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="openaiApiKey"
                      type={showApiKeys ? "text" : "password"}
                      value={settings.openai_api_key}
                      onChange={(e) => setSettings(prev => ({ ...prev, openai_api_key: e.target.value }))}
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
                      onClick={() => copyApiKey(settings.openai_api_key)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => generateApiKey('openai')}
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
                    checked={settings.google_ai_enabled}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, google_ai_enabled: checked }))}
                  />
                </div>

                {settings.google_ai_enabled && (
                  <div>
                    <Label htmlFor="googleAiApiKey">مفتاح Google AI API</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="googleAiApiKey"
                        type={showApiKeys ? "text" : "password"}
                        value={settings.google_ai_api_key}
                        onChange={(e) => setSettings(prev => ({ ...prev, google_ai_api_key: e.target.value }))}
                        placeholder="AIza..."
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyApiKey(settings.google_ai_api_key)}
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
                    value={settings.session_timeout}
                    onChange={(e) => setSettings(prev => ({ ...prev, session_timeout: parseInt(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="maxLoginAttempts">أقصى محاولات تسجيل الدخول</Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    value={settings.max_login_attempts}
                    onChange={(e) => setSettings(prev => ({ ...prev, max_login_attempts: parseInt(e.target.value) }))}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>المصادقة الثنائية</Label>
                  <p className="text-sm text-gray-600">تطلب رمز إضافي عند تسجيل الدخول</p>
                </div>
                <Switch
                  checked={settings.require_two_factor}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, require_two_factor: checked }))}
                />
              </div>

              <div>
                <Label htmlFor="passwordComplexity">تعقيد كلمة المرور</Label>
                <Select value={settings.password_complexity} onValueChange={(value: 'low' | 'medium' | 'high') => setSettings(prev => ({ ...prev, password_complexity: value }))}>
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
                  checked={settings.database_backup_enabled}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, database_backup_enabled: checked }))}
                />
              </div>

              {settings.database_backup_enabled && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="backupFrequency">تكرار النسخ الاحتياطي</Label>
                    <Select value={settings.backup_frequency} onValueChange={(value: 'daily' | 'weekly' | 'monthly') => setSettings(prev => ({ ...prev, backup_frequency: value }))}>
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
                  checked={settings.auto_optimization}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, auto_optimization: checked }))}
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
                    checked={settings.email_notifications}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, email_notifications: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>إشعارات SMS</Label>
                    <p className="text-sm text-gray-600">إرسال إشعارات عبر الرسائل النصية</p>
                  </div>
                  <Switch
                    checked={settings.sms_notifications}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, sms_notifications: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>إشعارات Push</Label>
                    <p className="text-sm text-gray-600">إشعارات فورية في المتصفح</p>
                  </div>
                  <Switch
                    checked={settings.push_notifications}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, push_notifications: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>صوت الإشعارات</Label>
                    <p className="text-sm text-gray-600">تشغيل صوت عند استلام إشعار</p>
                  </div>
                  <Switch
                    checked={settings.notification_sound}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, notification_sound: checked }))}
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
                    checked={settings.compact_mode}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, compact_mode: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>الحركات</Label>
                    <p className="text-sm text-gray-600">تفعيل الحركات والانتقالات</p>
                  </div>
                  <Switch
                    checked={settings.animations_enabled}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, animations_enabled: checked }))}
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