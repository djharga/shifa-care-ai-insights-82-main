import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  CheckCircle, 
  AlertTriangle, 
  Loader2, 
  RefreshCw,
  Wifi,
  WifiOff,
  Activity,
  Zap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { googleAIService } from '@/services/google-ai-service';

interface AIStatus {
  isOnline: boolean;
  responseTime: number;
  lastCheck: Date;
  errorCount: number;
  successRate: number;
  model: string;
  provider: string;
}

const AIStatusIndicator = () => {
  const [status, setStatus] = useState<AIStatus>({
    isOnline: false,
    responseTime: 0,
    lastCheck: new Date(),
    errorCount: 0,
    successRate: 0,
    model: 'gemini-1.5-flash',
    provider: 'Google AI'
  });
  const [isChecking, setIsChecking] = useState(false);
  const { toast } = useToast();

  // فحص حالة الذكاء الاصطناعي
  const checkAIStatus = async () => {
    setIsChecking(true);
    
    try {
      const startTime = Date.now();
      
      const systemPrompt = `أنت مساعد بسيط. رد بكلمة "متصل" فقط.`;
      const userPrompt = `أجب بكلمة "متصل" فقط.`;
      
      const result = await googleAIService.customCall(systemPrompt, userPrompt);
      
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      if (result.success) {
        setStatus(prev => ({
          ...prev,
          isOnline: true,
          responseTime,
          lastCheck: new Date(),
          successRate: Math.min(prev.successRate + 10, 100),
          errorCount: Math.max(prev.errorCount - 1, 0)
        }));
        
        toast({
          title: "متصل",
          description: `الذكاء الاصطناعي يعمل بشكل طبيعي (${responseTime}ms)`,
        });
      } else {
        throw new Error(result.error || 'فشل في الاتصال');
      }
    } catch (error: any) {
      console.error('خطأ في فحص حالة الذكاء الاصطناعي:', error);
      
      setStatus(prev => ({
        ...prev,
        isOnline: false,
        lastCheck: new Date(),
        errorCount: prev.errorCount + 1,
        successRate: Math.max(prev.successRate - 10, 0)
      }));
      
      toast({
        title: "غير متصل",
        description: "فشل في الاتصال بالذكاء الاصطناعي",
        variant: "destructive",
      });
    } finally {
      setIsChecking(false);
    }
  };

  // فحص تلقائي كل دقيقة
  useEffect(() => {
    checkAIStatus();
    
    const interval = setInterval(checkAIStatus, 60000); // كل دقيقة
    
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    if (status.isOnline) {
      if (status.responseTime < 1000) return 'text-green-600';
      if (status.responseTime < 3000) return 'text-yellow-600';
      return 'text-orange-600';
    }
    return 'text-red-600';
  };

  const getStatusIcon = () => {
    if (isChecking) return <Loader2 className="h-4 w-4 animate-spin" />;
    if (status.isOnline) return <CheckCircle className="h-4 w-4" />;
    return <AlertTriangle className="h-4 w-4" />;
  };

  const getStatusText = () => {
    if (isChecking) return 'جاري الفحص...';
    if (status.isOnline) return 'متصل';
    return 'غير متصل';
  };

  const getResponseTimeText = () => {
    if (status.responseTime < 1000) return 'سريع';
    if (status.responseTime < 3000) return 'متوسط';
    return 'بطيء';
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <Brain className="h-4 w-4 text-purple-600" />
            <span>حالة الذكاء الاصطناعي</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={checkAIStatus}
            disabled={isChecking}
            className="h-6 w-6 p-0"
          >
            <RefreshCw className={`h-3 w-3 ${isChecking ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* حالة الاتصال */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <span className="text-sm font-medium">{getStatusText()}</span>
          </div>
          <Badge 
            variant={status.isOnline ? "default" : "destructive"}
            className="text-xs"
          >
            {status.provider}
          </Badge>
        </div>

        {/* وقت الاستجابة */}
        {status.isOnline && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span>وقت الاستجابة:</span>
              <span className={`font-medium ${getStatusColor()}`}>
                {status.responseTime}ms ({getResponseTimeText()})
              </span>
            </div>
            <Progress 
              value={Math.min((status.responseTime / 5000) * 100, 100)} 
              className="h-1"
            />
          </div>
        )}

        {/* معدل النجاح */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span>معدل النجاح:</span>
            <span className="font-medium">{status.successRate}%</span>
          </div>
          <Progress value={status.successRate} className="h-1" />
        </div>

        {/* معلومات إضافية */}
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
          <div className="flex items-center space-x-1">
            <Activity className="h-3 w-3" />
            <span>النموذج: {status.model}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Zap className="h-3 w-3" />
            <span>الأخطاء: {status.errorCount}</span>
          </div>
        </div>

        {/* آخر فحص */}
        <div className="text-xs text-gray-500 text-center">
          آخر فحص: {status.lastCheck.toLocaleTimeString('ar-EG')}
        </div>
      </CardContent>
    </Card>
  );
};

export default AIStatusIndicator; 