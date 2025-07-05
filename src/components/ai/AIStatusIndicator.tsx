import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  CheckCircle, 
  AlertTriangle, 
  Wifi, 
  WifiOff,
  Settings,
  RefreshCw
} from 'lucide-react';
import { openAIService } from '@/services/openai-service';
import { useToast } from '@/hooks/use-toast';

interface AIStatus {
  isConfigured: boolean;
  isConnected: boolean;
  lastTest: string | null;
  errorCount: number;
  successCount: number;
}

const AIStatusIndicator = () => {
  const [status, setStatus] = useState<AIStatus>({
    isConfigured: false,
    isConnected: false,
    lastTest: null,
    errorCount: 0,
    successCount: 0
  });
  const [isTesting, setIsTesting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkAIStatus();
  }, []);

  const checkAIStatus = async () => {
    const config = openAIService.getConfig();
    const isConfigured = !!(config.apiKey && config.apiKey.length > 0);
    
    setStatus(prev => ({
      ...prev,
      isConfigured
    }));
  };

  const testAIConnection = async () => {
    setIsTesting(true);
    
    try {
      const response = await openAIService.customCall(
        "أنت مساعد بسيط. أجب بـ 'مرحباً' فقط.",
        "قل مرحباً",
        { maxTokens: 10 }
      );

      if (response.success) {
        setStatus(prev => ({
          ...prev,
          isConnected: true,
          lastTest: new Date().toLocaleString('ar-EG'),
          successCount: prev.successCount + 1
        }));

        toast({
          title: "✅ اتصال OpenAI يعمل",
          description: "تم اختبار الاتصال بنجاح",
        });
      } else {
        throw new Error(response.error);
      }
    } catch (error: any) {
      setStatus(prev => ({
        ...prev,
        isConnected: false,
        lastTest: new Date().toLocaleString('ar-EG'),
        errorCount: prev.errorCount + 1
      }));

      toast({
        title: "❌ خطأ في الاتصال",
        description: error.message || "فشل في اختبار الاتصال",
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  };

  const getStatusColor = () => {
    if (!status.isConfigured) return 'bg-gray-500';
    if (status.isConnected) return 'bg-green-500';
    return 'bg-red-500';
  };

  const getStatusText = () => {
    if (!status.isConfigured) return 'غير مُعد';
    if (status.isConnected) return 'متصل';
    return 'غير متصل';
  };

  const getStatusIcon = () => {
    if (!status.isConfigured) return <Settings className="h-4 w-4" />;
    if (status.isConnected) return <CheckCircle className="h-4 w-4" />;
    return <AlertTriangle className="h-4 w-4" />;
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <Brain className="h-4 w-4" />
            <span>حالة الذكاء الاصطناعي</span>
          </div>
          <Badge 
            variant="outline" 
            className={`${getStatusColor()} text-white border-0`}
          >
            {getStatusText()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* حالة الاتصال */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {status.isConnected ? (
              <Wifi className="h-4 w-4 text-green-600" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-600" />
            )}
            <span className="text-sm">الاتصال</span>
          </div>
          <span className="text-sm text-gray-600">
            {status.isConnected ? 'متصل' : 'غير متصل'}
          </span>
        </div>

        {/* آخر اختبار */}
        {status.lastTest && (
          <div className="flex items-center justify-between">
            <span className="text-sm">آخر اختبار</span>
            <span className="text-sm text-gray-600">{status.lastTest}</span>
          </div>
        )}

        {/* إحصائيات */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">{status.successCount}</div>
            <div className="text-xs text-gray-600">نجح</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-red-600">{status.errorCount}</div>
            <div className="text-xs text-gray-600">فشل</div>
          </div>
        </div>

        {/* أزرار التحكم */}
        <div className="flex space-x-2 pt-2">
          <Button
            size="sm"
            onClick={testAIConnection}
            disabled={!status.isConfigured || isTesting}
            className="flex-1"
          >
            {isTesting ? (
              <>
                <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                اختبار...
              </>
            ) : (
              <>
                <RefreshCw className="h-3 w-3 mr-1" />
                اختبار الاتصال
              </>
            )}
          </Button>
          
          {!status.isConfigured && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                toast({
                  title: "إعداد OpenAI",
                  description: "يرجى إضافة VITE_OPENAI_API_KEY في ملف .env",
                });
              }}
            >
              <Settings className="h-3 w-3 mr-1" />
              إعداد
            </Button>
          )}
        </div>

        {/* رسائل المساعدة */}
        {!status.isConfigured && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs text-yellow-800">
              ⚠️ لم يتم إعداد مفتاح OpenAI. أضف VITE_OPENAI_API_KEY في ملف .env
            </p>
          </div>
        )}

        {status.isConfigured && !status.isConnected && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-xs text-red-800">
              ❌ فشل في الاتصال بـ OpenAI. تحقق من صحة المفتاح
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIStatusIndicator; 