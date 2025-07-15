import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Settings, 
  Save, 
  TestTube, 
  CheckCircle, 
  AlertTriangle,
  Loader2,
  RefreshCw,
  Zap,
  Shield,
  Activity
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { googleAIService } from '@/services/google-ai-service';

interface AIConfig {
  apiKey: string;
  model: string;
  maxTokens: number;
  temperature: number;
  language: string;
  enableAutoResponse: boolean;
  enableNotifications: boolean;
  enableLogging: boolean;
}

const AIConfigPanel = () => {
  const [config, setConfig] = useState<AIConfig>({
    apiKey: import.meta.env.VITE_GOOGLE_AI_API_KEY || '',
    model: 'gemini-1.5-flash',
    maxTokens: 2000,
    temperature: 0.7,
    language: 'egyptian_arabic',
    enableAutoResponse: true,
    enableNotifications: true,
    enableLogging: false
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    responseTime?: number;
  } | null>(null);
  
  const { toast } = useToast();

  // تحميل الإعدادات المحفوظة
  useEffect(() => {
    const savedConfig = localStorage.getItem('ai-config');
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        setConfig(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('خطأ في تحميل الإعدادات:', error);
      }
    }
  }, []);

  // حفظ الإعدادات
  const saveConfig = async () => {
    setIsSaving(true);
    
    try {
      // حفظ في localStorage
      localStorage.setItem('ai-config', JSON.stringify(config));
      
      // تحديث متغيرات البيئة (في التطبيق الحقيقي)
      if (config.apiKey) {
        // يمكن إضافة منطق لحفظ المفتاح بشكل آمن
        console.log('تم حفظ مفتاح API');
      }
      
      toast({
        title: "تم الحفظ",
        description: "تم حفظ إعدادات الذكاء الاصطناعي بنجاح",
      });
      
      setTestResult(null);
    } catch (error: any) {
      toast({
        title: "خطأ في الحفظ",
        description: error.message || "فشل في حفظ الإعدادات",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // اختبار الاتصال
  const testConnection = async () => {
    if (!config.apiKey) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال مفتاح API أولاً",
        variant: "destructive",
      });
      return;
    }

    setIsTesting(true);
    setTestResult(null);
    
    try {
      const startTime = Date.now();
      
      const systemPrompt = `أنت مساعد اختبار. رد بكلمة "متصل" فقط.`;
      const userPrompt = `أجب بكلمة "متصل" فقط.`;
      
      const result = await googleAIService.customCall(systemPrompt, userPrompt);
      
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      if (result.success) {
        setTestResult({
          success: true,
          message: 'تم الاتصال بنجاح',
          responseTime
        });
        
        toast({
          title: "✅ اختبار ناجح",
          description: `تم الاتصال بالذكاء الاصطناعي (${responseTime}ms)`,
        });
      } else {
        throw new Error(result.error || 'فشل في الاتصال');
      }
    } catch (error: any) {
      console.error('خطأ في اختبار الاتصال:', error);
      
      setTestResult({
        success: false,
        message: error.message || 'فشل في الاتصال'
      });
      
      toast({
        title: "❌ اختبار فاشل",
        description: error.message || "فشل في الاتصال بالذكاء الاصطناعي",
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  };

  // إعادة تعيين الإعدادات
  const resetConfig = () => {
    const defaultConfig: AIConfig = {
      apiKey: import.meta.env.VITE_GOOGLE_AI_API_KEY || '',
      model: 'gemini-1.5-flash',
      maxTokens: 2000,
      temperature: 0.7,
      language: 'egyptian_arabic',
      enableAutoResponse: true,
      enableNotifications: true,
      enableLogging: false
    };
    
    setConfig(defaultConfig);
    setTestResult(null);
    
    toast({
      title: "تم إعادة التعيين",
      description: "تم إعادة الإعدادات إلى القيم الافتراضية",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">إعدادات الذكاء الاصطناعي</h2>
          <p className="text-gray-600 text-sm">تكوين Google Gemini والوظائف الذكية</p>
        </div>
        <Badge variant="outline" className="flex items-center space-x-1">
          <Brain className="h-3 w-3" />
          <span>Google Gemini</span>
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* إعدادات API */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5 text-blue-600" />
              <span>إعدادات API</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="apiKey">مفتاح Google AI API</Label>
              <Input
                id="apiKey"
                type="password"
                value={config.apiKey}
                onChange={(e) => setConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                placeholder="أدخل مفتاح API..."
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                احصل على المفتاح من <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google AI Studio</a>
              </p>
            </div>

            <div>
              <Label htmlFor="model">النموذج</Label>
              <Select value={config.model} onValueChange={(value) => setConfig(prev => ({ ...prev, model: value }))}>
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="maxTokens">الحد الأقصى للكلمات</Label>
                <Input
                  id="maxTokens"
                  type="number"
                  value={config.maxTokens}
                  onChange={(e) => setConfig(prev => ({ ...prev, maxTokens: parseInt(e.target.value) || 2000 }))}
                  min="100"
                  max="8000"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="temperature">درجة الإبداع</Label>
                <Input
                  id="temperature"
                  type="number"
                  step="0.1"
                  value={config.temperature}
                  onChange={(e) => setConfig(prev => ({ ...prev, temperature: parseFloat(e.target.value) || 0.7 }))}
                  min="0"
                  max="2"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="language">لغة الرد</Label>
              <Select value={config.language} onValueChange={(value) => setConfig(prev => ({ ...prev, language: value }))}>
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
          </CardContent>
        </Card>

        {/* إعدادات الوظائف */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-green-600" />
              <span>إعدادات الوظائف</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>الرد التلقائي</Label>
                <p className="text-xs text-gray-500">تفعيل الردود التلقائية للمساعد</p>
              </div>
              <Switch
                checked={config.enableAutoResponse}
                onCheckedChange={(checked) => setConfig(prev => ({ ...prev, enableAutoResponse: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>الإشعارات</Label>
                <p className="text-xs text-gray-500">إشعارات عند اكتمال المهام</p>
              </div>
              <Switch
                checked={config.enableNotifications}
                onCheckedChange={(checked) => setConfig(prev => ({ ...prev, enableNotifications: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>تسجيل النشاط</Label>
                <p className="text-xs text-gray-500">حفظ سجلات النشاط للتتبع</p>
              </div>
              <Switch
                checked={config.enableLogging}
                onCheckedChange={(checked) => setConfig(prev => ({ ...prev, enableLogging: checked }))}
              />
            </div>

            {/* معلومات النظام */}
            <div className="pt-4 border-t">
              <h4 className="text-sm font-medium mb-2">معلومات النظام</h4>
              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex items-center justify-between">
                  <span>المزود:</span>
                  <span className="font-medium">Google AI</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>النموذج الحالي:</span>
                  <span className="font-medium">{config.model}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>اللغة:</span>
                  <span className="font-medium">
                    {config.language === 'egyptian_arabic' ? 'اللهجة المصرية' : 
                     config.language === 'modern_standard_arabic' ? 'العربية الفصحى' : 'English'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* اختبار الاتصال */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TestTube className="h-5 w-5 text-purple-600" />
            <span>اختبار الاتصال</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Button
                onClick={testConnection}
                disabled={isTesting || !config.apiKey}
                className="flex-1"
              >
                {isTesting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    جاري الاختبار...
                  </>
                ) : (
                  <>
                    <TestTube className="h-4 w-4 mr-2" />
                    اختبار الاتصال
                  </>
                )}
              </Button>
              
              <Button
                onClick={saveConfig}
                disabled={isSaving}
                variant="outline"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    حفظ الإعدادات
                  </>
                )}
              </Button>
              
              <Button
                onClick={resetConfig}
                variant="outline"
                size="sm"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                إعادة تعيين
              </Button>
            </div>

            {testResult && (
              <div className={`p-3 rounded-lg border ${
                testResult.success 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center space-x-2">
                  {testResult.success ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                  )}
                  <span className={`text-sm font-medium ${
                    testResult.success ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {testResult.message}
                  </span>
                  {testResult.responseTime && (
                    <Badge variant="outline" className="text-xs">
                      {testResult.responseTime}ms
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIConfigPanel; 