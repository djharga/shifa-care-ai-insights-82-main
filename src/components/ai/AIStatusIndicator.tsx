import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Wifi,
  WifiOff,
  RefreshCw,
  Settings
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AIStatus {
  isConfigured: boolean;
  isConnected: boolean;
  lastTest: string | null;
  errorCount: number;
  successCount: number;
}

interface AIStatusIndicatorProps {
  // Add props if needed
}

export const AIStatusIndicator: React.FC<AIStatusIndicatorProps> = () => {
  const { toast } = useToast();
  const [isTesting, setIsTesting] = useState(false);
  const [statusIndicator, setStatusIndicator] = useState<AIStatus>({
    isConfigured: false,
    isConnected: false,
    lastTest: null,
    errorCount: 0,
    successCount: 0
  });

  // Mock AI service for demonstration
  const openAIService = {
    checkStatus: async () => {
      // Mock implementation
      return { status: 'online', responseTime: 150 };
    },
    customCall: async () => {
      // Mock implementation
      return { success: true, data: 'مرحباً', error: null };
    }
  };

  const testAIConnection = async () => {
    setIsTesting(true);
    
    try {
      const response = await openAIService.customCall();

      if (response.success) {
        setStatusIndicator(prev => ({
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
        throw new Error(response.error || 'خطأ غير معروف');
      }
    } catch (error: any) {
      setStatusIndicator(prev => ({
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
    if (!statusIndicator.isConfigured) return 'bg-gray-500';
    if (statusIndicator.isConnected) return 'bg-green-500';
    return 'bg-red-500';
  };

  const getStatusText = () => {
    if (!statusIndicator.isConfigured) return 'غير مُعد';
    if (statusIndicator.isConnected) return 'متصل';
    return 'غير متصل';
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
            {statusIndicator.isConnected ? (
              <Wifi className="h-4 w-4 text-green-600" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-600" />
            )}
            <span className="text-sm">الاتصال</span>
          </div>
          <span className="text-sm text-gray-600">
            {statusIndicator.isConnected ? 'متصل' : 'غير متصل'}
          </span>
        </div>

        {/* آخر اختبار */}
        {statusIndicator.lastTest && (
          <div className="flex items-center justify-between">
            <span className="text-sm">آخر اختبار</span>
            <span className="text-sm text-gray-600">{statusIndicator.lastTest}</span>
          </div>
        )}

        {/* إحصائيات */}
        <div className="flex items-center justify-between">
          <span className="text-sm">النجاحات</span>
          <span className="text-sm text-green-600">{statusIndicator.successCount}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm">الأخطاء</span>
          <span className="text-sm text-red-600">{statusIndicator.errorCount}</span>
        </div>

        {/* أزرار التحكم */}
        <div className="flex space-x-2 pt-2">
          <Button
            size="sm"
            onClick={testAIConnection}
            disabled={isTesting}
            className="flex-1"
          >
            {isTesting ? (
              <>
                <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                جاري الاختبار...
              </>
            ) : (
              <>
                <RefreshCw className="h-3 w-3 mr-1" />
                اختبار الاتصال
              </>
            )}
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            className="flex-1"
          >
            <Settings className="h-3 w-3 mr-1" />
            الإعدادات
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIStatusIndicator; 