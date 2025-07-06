import { useState, useCallback } from 'react';
import { googleAIService, GoogleAIResponse } from '@/services/openai-service';
import { useToast } from '@/hooks/use-toast';

export interface UseGoogleAIOptions {
  onSuccess?: (response: GoogleAIResponse) => void;
  onError?: (error: string) => void;
  showToast?: boolean;
}

export const useGoogleAI = (options: UseGoogleAIOptions = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const {
    onSuccess,
    onError,
    showToast = true
  } = options;

  // تحليل الجلسات
  const analyzeSession = useCallback(async (rawNotes: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await googleAIService.analyzeSession(rawNotes);
      
      if (response.success) {
        onSuccess?.(response);
        if (showToast) {
          toast({
            title: "تم تحليل الجلسة بنجاح",
            description: "تم معالجة الملاحظات وتحليل المشاعر",
          });
        }
        return response;
      } else {
        throw new Error(response.error || 'فشل في تحليل الجلسة');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'حدث خطأ أثناء تحليل الجلسة';
      setError(errorMessage);
      onError?.(errorMessage);
      
      if (showToast) {
        toast({
          title: "خطأ في تحليل الجلسة",
          description: errorMessage,
          variant: "destructive",
        });
      }
      
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [onSuccess, onError, showToast, toast]);

  // إنشاء خطة علاجية
  const generateTreatmentPlan = useCallback(async (patientData: {
    name: string;
    age: number;
    addictionType: string;
    currentStatus: string;
    riskFactors: string[];
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await googleAIService.generateTreatmentPlan(patientData);
      
      if (response.success) {
        onSuccess?.(response);
        if (showToast) {
          toast({
            title: "تم إنشاء خطة العلاج",
            description: "تم إنشاء خطة علاجية مخصصة بنجاح",
          });
        }
        return response;
      } else {
        throw new Error(response.error || 'فشل في إنشاء خطة العلاج');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'حدث خطأ أثناء إنشاء خطة العلاج';
      setError(errorMessage);
      onError?.(errorMessage);
      
      if (showToast) {
        toast({
          title: "خطأ في إنشاء خطة العلاج",
          description: errorMessage,
          variant: "destructive",
        });
      }
      
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [onSuccess, onError, showToast, toast]);

  // تقييم مخاطر الانتكاس
  const assessRelapseRisk = useCallback(async (patientData: string, sessionsHistory: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await googleAIService.assessRelapseRisk(patientData, sessionsHistory);
      
      if (response.success) {
        onSuccess?.(response);
        if (showToast) {
          toast({
            title: "تم تقييم مخاطر الانتكاس",
            description: "تم تحليل عوامل الخطر وتقديم التوصيات",
          });
        }
        return response;
      } else {
        throw new Error(response.error || 'فشل في تقييم مخاطر الانتكاس');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'حدث خطأ أثناء تقييم المخاطر';
      setError(errorMessage);
      onError?.(errorMessage);
      
      if (showToast) {
        toast({
          title: "خطأ في تقييم المخاطر",
          description: errorMessage,
          variant: "destructive",
        });
      }
      
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [onSuccess, onError, showToast, toast]);

  // إنشاء تقرير ذكي
  const generateSmartReport = useCallback(async (reportType: string, patientId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await googleAIService.generateSmartReport(reportType, patientId);
      
      if (response.success) {
        onSuccess?.(response);
        if (showToast) {
          toast({
            title: "تم إنشاء التقرير",
            description: "تم إنشاء تقرير شامل ومفصل",
          });
        }
        return response;
      } else {
        throw new Error(response.error || 'فشل في إنشاء التقرير');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'حدث خطأ أثناء إنشاء التقرير';
      setError(errorMessage);
      onError?.(errorMessage);
      
      if (showToast) {
        toast({
          title: "خطأ في إنشاء التقرير",
          description: errorMessage,
          variant: "destructive",
        });
      }
      
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [onSuccess, onError, showToast, toast]);

  // اقتراح أنشطة علاجية
  const suggestActivities = useCallback(async (patientProfile: string, sessionResults: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await googleAIService.suggestActivities(patientProfile, sessionResults);
      
      if (response.success) {
        onSuccess?.(response);
        if (showToast) {
          toast({
            title: "تم اقتراح الأنشطة",
            description: "تم اقتراح أنشطة علاجية مناسبة",
          });
        }
        return response;
      } else {
        throw new Error(response.error || 'فشل في اقتراح الأنشطة');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'حدث خطأ أثناء اقتراح الأنشطة';
      setError(errorMessage);
      onError?.(errorMessage);
      
      if (showToast) {
        toast({
          title: "خطأ في اقتراح الأنشطة",
          description: errorMessage,
          variant: "destructive",
        });
      }
      
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [onSuccess, onError, showToast, toast]);

  // استدعاء مخصص
  const customCall = useCallback(async (
    systemPrompt: string,
    userPrompt: string,
    options?: {
      maxTokens?: number;
      temperature?: number;
      model?: string;
    }
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await googleAIService.customCall(systemPrompt, userPrompt, options);
      
      if (response.success) {
        onSuccess?.(response);
        if (showToast) {
          toast({
            title: "تم الاستدعاء بنجاح",
            description: "تم معالجة الطلب وتوليد الرد",
          });
        }
        return response;
      } else {
        throw new Error(response.error || 'فشل في الاستدعاء المخصص');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'حدث خطأ أثناء الاستدعاء المخصص';
      setError(errorMessage);
      onError?.(errorMessage);
      
      if (showToast) {
        toast({
          title: "خطأ في الاستدعاء",
          description: errorMessage,
          variant: "destructive",
        });
      }
      
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [onSuccess, onError, showToast, toast]);

  return {
    isLoading,
    error,
    analyzeSession,
    generateTreatmentPlan,
    assessRelapseRisk,
    generateSmartReport,
    suggestActivities,
    customCall,
    clearError: () => setError(null)
  };
};

// تصدير للتوافق مع الكود القديم
export const useOpenAI = useGoogleAI; 