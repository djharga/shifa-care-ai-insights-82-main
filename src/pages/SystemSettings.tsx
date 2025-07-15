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
  Calendar,
  Brain
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import supabase from '@/integrations/supabase/client';
import { googleAIService } from '@/services/google-ai-service';

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
  google_ai_api_key: string;
  ai_response_timeout: number;
  ai_max_tokens: number;
  ai_model: string;
  ai_language: string;
  
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
    google_ai_api_key: import.meta.env.VITE_GOOGLE_AI_API_KEY || '',
    ai_response_timeout: 30,
    ai_max_tokens: 2000,
    ai_model: 'gemini-1.5-flash',
    ai_language: 'egyptian_arabic',
    
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

  const saveSettings = async () => {
    try {
      setIsLoading(true);
      
      const updatedSettings = {
        ...settings,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('system_settings')
        .upsert(updatedSettings);

      if (error) throw error;

      setSettings(updatedSettings);
      toast({
        title: "✅ تم الحفظ",
        description: "تم حفظ إعدادات النظام بنجاح",
      });
    } catch (error: any) {
      console.error('Error saving settings:', error);
      toast({
        title: "❌ خطأ في الحفظ",
        description: error.message || "فشل في حفظ إعدادات النظام",
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
      
      if (!settings.ai_enabled) {
        toast({
          title: "الذكاء الاصطناعي معطل",
          description: "يرجى تفعيل الذكاء الاصطناعي أولاً",
          variant: "destructive",
        });
        return;
      }

      if (!settings.google_ai_api_key) {
        toast({
          title: "مفتاح API مفقود",
          description: "يرجى إدخال مفتاح Google AI API",
          variant: "destructive",
        });
        return;
      }

      // اختبار الاتصال بـ Google AI
      const systemPrompt = `أنت مساعد اختبار. رد بكلمة "متصل" فقط.`;
      const userPrompt = `أجب بكلمة "متصل" فقط.`;
      
      const result = await googleAIService.customCall(systemPrompt, userPrompt);
      
      if (result.success) {
        toast({
          title: "✅ اتصال ناجح",
          description: "تم اختبار الاتصال بـ Google Gemini بنجاح",
        });
      } else {
        throw new Error(result.error || 'فشل في الاتصال');
      }
    } catch (error: any) {
      console.error('Error testing AI connection:', error);
      toast({
        title: "❌ فشل في الاتصال",
        description: error.message || "فشل في الاتصال بـ Google Gemini",
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
  const generateApiKey = async () => {
    try {
      setIsLoading(true);
      
      // محاكاة توليد مفتاح جديد
      const newKey = `AIza${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
      
      const updatedSettings = {
        ...settings,
        google_ai_api_key: newKey,
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
        description: "تم توليد مفتاح Google AI جديد",
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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">إعدادات النظام</h1>
          <p className="text-gray-600 text-sm sm:text-base">إدارة إعدادات النظام والمنصة</p>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={testAIConnection}
            variant="outline"
            className="flex items-center"
            disabled={isLoading}
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
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5 text-blue-600" />
                <span>الإعدادات العامة</span>
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
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5 text-purple-600" />
                <span>إعدادات الذكاء الاصطناعي</span>
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
                      onClick={() => setShowApiKeys(!showApiKeys)}
                    >
                      {showApiKeys ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyApiKey(settings.google_ai_api_key)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={generateApiKey}
                      disabled={isLoading}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    احصل على المفتاح من <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google AI Studio</a>
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="aiModel">نموذج الذكاء الاصطناعي</Label>
                    <Select value={settings.ai_model} onValueChange={(value) => setSettings(prev => ({ ...prev, ai_model: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gemini-1.5-flash">Gemini 1.5 Flash (سريع)</SelectItem>
                        <SelectItem value="gemini-1.5-pro">Gemini 1.5 Pro (متقدم)</SelectItem>
                        <SelectItem value="gemini-pro">Gemini Pro (عام)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="aiLanguage">لغة الرد</Label>
                    <Select value={settings.ai_language} onValueChange={(value) => setSettings(prev => ({ ...prev, ai_language: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="egyptian_arabic">اللهجة المصرية</SelectItem>
                        <SelectItem value="modern_standard_arabic">العربية الفصحى</SelectItem>
                        <SelectItem value="english">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="aiMaxTokens">الحد الأقصى للكلمات</Label>
                    <Input
                      id="aiMaxTokens"
                      type="number"
                      value={settings.ai_max_tokens}
                      onChange={(e) => setSettings(prev => ({ ...prev, ai_max_tokens: parseInt(e.target.value) || 2000 }))}
                      min="100"
                      max="8000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="aiTimeout">مهلة الاستجابة (ثواني)</Label>
                    <Input
                      id="aiTimeout"
                      type="number"
                      value={settings.ai_response_timeout}
                      onChange={(e) => setSettings(prev => ({ ...prev, ai_response_timeout: parseInt(e.target.value) || 30 }))}
                      min="10"
                      max="120"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* إعدادات الأمان */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-red-600" />
                <span>إعدادات الأمان</span>
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
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5 text-green-600" />
                <span>إعدادات قاعدة البيانات</span>
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
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-yellow-600" />
                <span>إعدادات الإشعارات</span>
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
                    <Label>إشعارات الرسائل النصية</Label>
                    <p className="text-sm text-gray-600">إرسال إشعارات عبر الرسائل النصية</p>
                  </div>
                  <Switch
                    checked={settings.sms_notifications}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, sms_notifications: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>إشعارات المتصفح</Label>
                    <p className="text-sm text-gray-600">إظهار إشعارات في المتصفح</p>
                  </div>
                  <Switch
                    checked={settings.push_notifications}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, push_notifications: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>صوت الإشعارات</Label>
                    <p className="text-sm text-gray-600">تشغيل صوت عند وصول إشعار</p>
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
              <CardTitle className="flex items-center space-x-2">
                <Palette className="h-5 w-5 text-indigo-600" />
                <span>إعدادات الواجهة</span>
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
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>دعم اللغة العربية</Label>
                    <p className="text-sm text-gray-600">تفعيل الاتجاه من اليمين لليسار</p>
                  </div>
                  <Switch
                    checked={settings.rtl_enabled}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, rtl_enabled: checked }))}
                  />
                </div>

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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemSettings; 