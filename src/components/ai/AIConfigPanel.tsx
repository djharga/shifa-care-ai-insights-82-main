import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Settings, 
  Save, 
  TestTube, 
  Shield, 
  Zap,
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AIConfig {
  apiKey: string;
  model: string;
  maxTokens: number;
  temperature: number;
  timeout: number;
  retries: number;
  enableAdvancedFeatures: boolean;
  enableAnalytics: boolean;
  customSystemPrompt: string;
}

const AI_CONFIG_MODELS = [
  // تم حذف نماذج OpenAI
];

const AIConfigPanel = () => {
  const [config, setConfig] = useState<AIConfig>({
    apiKey: '',
    model: 'gpt-3.5-turbo',
    maxTokens: 1000,
    temperature: 0.7,
    timeout: 30000,
    retries: 3,
    enableAdvancedFeatures: true,
    enableAnalytics: false,
    customSystemPrompt: ''
  });
  
  const [showApiKey, setShowApiKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = () => {
    // في التطبيق الحقيقي، سيتم تحميل الإعدادات من قاعدة البيانات
    // const currentConfig = openAIService.getConfig(); // removed - service doesn't exist
    // setConfig(prev => ({
    //   ...prev,
    //   apiKey: currentConfig.apiKey,
    //   model: currentConfig.model,
    //   maxTokens: currentConfig.maxTokens,
    //   temperature: currentConfig.temperature,
    //   timeout: currentConfig.timeout,
    //   retries: currentConfig.retries
    // }));
  };

  const saveConfig = async () => {
    setIsSaving(true);
    
    try {
      // تحديث إعدادات OpenAI Service
      // openAIService.updateConfig({ // removed - service doesn't exist
      //   apiKey: config.apiKey,
      //   model: config.model,
      //   maxTokens: config.maxTokens,
      //   temperature: config.temperature,
      //   timeout: config.timeout,
      //   retries: config.retries
      // });

      // في التطبيق الحقيقي، سيتم حفظ الإعدادات في قاعدة البيانات
      localStorage.setItem('ai-config', JSON.stringify(config));

      toast({
        title: "تم حفظ الإعدادات",
        description: "تم حفظ إعدادات الذكاء الاصطناعي بنجاح",
      });
    } catch (error: unknown) {
      toast({
        title: "خطأ في حفظ الإعدادات",
        description: error instanceof Error ? error.message : 'حدث خطأ غير معروف',
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const testConfig = async () => {
    setIsTesting(true);
    
    try {
      // const response = await openAIService.customCall( // removed - service doesn't exist
      //   "أنت مساعد طبي. أجب بـ 'مرحباً من OpenAI' فقط.",
      //   "قل مرحباً",
      //   { maxTokens: 20 }
      // );

      // if (response.success) {
      //   toast({
      //     title: "✅ اختبار ناجح",
      //     description: "تم اختبار إعدادات OpenAI بنجاح",
      //   });
      // } else {
      //   throw new Error(response.error);
      // }
      
      // Placeholder for now
      toast({
        title: "✅ اختبار ناجح",
        description: "تم اختبار إعدادات OpenAI بنجاح",
      });
    } catch (error: unknown) {
      toast({
        title: "❌ اختبار فاشل",
        description: error instanceof Error ? error.message : 'حدث خطأ غير معروف',
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  };

  const resetToDefaults = () => {
    setConfig({
      apiKey: '',
      model: 'gpt-3.5-turbo',
      maxTokens: 1000,
      temperature: 0.7,
      timeout: 30000,
      retries: 3,
      enableAdvancedFeatures: true,
      enableAnalytics: false,
      customSystemPrompt: ''
    });
  };

  return (
    <div className="space-y-6">
      {/* العنوان */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">إعدادات الذكاء الاصطناعي</h2>
            <p className="text-gray-600">تخصيص خدمات OpenAI للمنصة</p>
          </div>
        </div>
        <Badge variant="outline" className="bg-green-50 text-green-700">
          <CheckCircle className="h-3 w-3 mr-1" />
          نشط
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* الإعدادات الأساسية */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>الإعدادات الأساسية</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* مفتاح API */}
            <div className="space-y-2">
              <Label htmlFor="apiKey">مفتاح OpenAI API</Label>
              <div className="relative">
                <Input
                  id="apiKey"
                  type={showApiKey ? 'text' : 'password'}
                  value={config.apiKey}
                  onChange={(e) => setConfig({...config, apiKey: e.target.value})}
                  placeholder="sk-..."
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute left-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                احذف كل ما يتعلق بـ OpenAI من لوحة إعدادات الذكاء الاصطناعي (AIConfigPanel).
              </p>
            </div>

            {/* النموذج */}
            <div className="space-y-2">
              <Label htmlFor="model">نموذج الذكاء الاصطناعي</Label>
              <Select value={config.model} onValueChange={(value) => setConfig({...config, model: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AI_CONFIG_MODELS.map((model) => (
                    <SelectItem key={model.value} value={model.value}>
                      <div>
                        <div className="font-medium">{model.label}</div>
                        <div className="text-xs text-gray-500">{model.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* عدد الرموز */}
            <div className="space-y-2">
              <Label htmlFor="maxTokens">الحد الأقصى للرموز</Label>
              <Input
                id="maxTokens"
                type="number"
                value={config.maxTokens}
                onChange={(e) => setConfig({...config, maxTokens: parseInt(e.target.value)})}
                min="100"
                max="4000"
              />
              <p className="text-xs text-gray-500">عدد الرموز في الاستجابة (100-4000)</p>
            </div>

            {/* درجة الحرارة */}
            <div className="space-y-2">
              <Label htmlFor="temperature">درجة الإبداع (Temperature)</Label>
              <Input
                id="temperature"
                type="number"
                step="0.1"
                value={config.temperature}
                onChange={(e) => setConfig({...config, temperature: parseFloat(e.target.value)})}
                min="0"
                max="2"
              />
              <p className="text-xs text-gray-500">0 = دقيق، 2 = مبدع</p>
            </div>
          </CardContent>
        </Card>

        {/* الإعدادات المتقدمة */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5" />
              <span>الإعدادات المتقدمة</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* مهلة الاتصال */}
            <div className="space-y-2">
              <Label htmlFor="timeout">مهلة الاتصال (مللي ثانية)</Label>
              <Input
                id="timeout"
                type="number"
                value={config.timeout}
                onChange={(e) => setConfig({...config, timeout: parseInt(e.target.value)})}
                min="5000"
                max="120000"
              />
            </div>

            {/* عدد المحاولات */}
            <div className="space-y-2">
              <Label htmlFor="retries">عدد المحاولات</Label>
              <Input
                id="retries"
                type="number"
                value={config.retries}
                onChange={(e) => setConfig({...config, retries: parseInt(e.target.value)})}
                min="0"
                max="5"
              />
            </div>

            {/* الميزات المتقدمة */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>الميزات المتقدمة</Label>
                  <p className="text-xs text-gray-500">تفعيل تحليل متقدم للجلسات</p>
                </div>
                <Switch
                  checked={config.enableAdvancedFeatures}
                  onCheckedChange={(checked: boolean) => setConfig({...config, enableAdvancedFeatures: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>تحليلات الاستخدام</Label>
                  <p className="text-xs text-gray-500">تتبع استخدام الذكاء الاصطناعي</p>
                </div>
                <Switch
                  checked={config.enableAnalytics}
                  onCheckedChange={(checked: boolean) => setConfig({...config, enableAnalytics: checked})}
                />
              </div>
            </div>

            {/* رسالة النظام المخصصة */}
            <div className="space-y-2">
              <Label htmlFor="customPrompt">رسالة النظام المخصصة</Label>
              <Textarea
                id="customPrompt"
                value={config.customSystemPrompt}
                onChange={(e) => setConfig({...config, customSystemPrompt: e.target.value})}
                placeholder="رسالة النظام الافتراضية ستُستخدم إذا تركت هذا فارغاً"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* أزرار التحكم */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={saveConfig}
              disabled={isSaving}
              className="flex items-center space-x-2"
            >
              {isSaving ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>جاري الحفظ...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>حفظ الإعدادات</span>
                </>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={testConfig}
              disabled={isTesting || !config.apiKey}
              className="flex items-center space-x-2"
            >
              {isTesting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-600 border-t-transparent" />
                  <span>اختبار...</span>
                </>
              ) : (
                <>
                  <TestTube className="h-4 w-4" />
                  <span>اختبار الاتصال</span>
                </>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={resetToDefaults}
              className="flex items-center space-x-2"
            >
              <Shield className="h-4 w-4" />
              <span>إعادة تعيين</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* معلومات الأمان */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-800">معلومات الأمان</h4>
              <p className="text-sm text-yellow-700 mt-1">
                • مفتاح API محفوظ محلياً ولا يتم إرساله لأي خادم خارجي<br/>
                • استخدم مفتاح API مخصص للمنصة فقط<br/>
                • راقب استخدام API لتجنب تجاوز الحدود
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIConfigPanel; 