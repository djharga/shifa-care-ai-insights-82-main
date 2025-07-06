import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bot, 
  Send, 
  Mic, 
  MicOff, 
  MessageSquare, 
  HelpCircle, 
  Lightbulb, 
  Clock, 
  User,
  Sparkles,
  Minimize2,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  type: 'text' | 'suggestion' | 'action';
  action?: {
    type: 'navigate' | 'open' | 'help';
    data: any;
  };
}

interface Suggestion {
  id: string;
  text: string;
  icon: React.ComponentType<any>;
  action: string;
}

const SmartAssistant = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // الاقتراحات السريعة
  const quickSuggestions: Suggestion[] = [
    {
      id: '1',
      text: 'إزاي أضيف مريض جديد؟',
      icon: User,
      action: 'add_patient'
    },
    {
      id: '2',
      text: 'عايز أعرف إزاي أجدول وردية',
      icon: Clock,
      action: 'schedule_shift'
    },
    {
      id: '3',
      text: 'إزاي أرسل رسالة لأسرة المريض؟',
      icon: MessageSquare,
      action: 'send_message'
    },
    {
      id: '4',
      text: 'عايز أعرف إزاي أعمل تقرير',
      icon: HelpCircle,
      action: 'create_report'
    },
    {
      id: '5',
      text: 'إيه هي الخطوات لإدارة الإجازات؟',
      icon: Lightbulb,
      action: 'manage_leaves'
    },
    {
      id: '6',
      text: 'إزاي أتتبع تقدم المريض؟',
      icon: Sparkles,
      action: 'track_progress'
    }
  ];

  // قاعدة المعرفة للمساعد
  const knowledgeBase = {
    add_patient: {
      response: 'طيب يا فندم، عشان تضيف مريض جديد:\n\n1. روح على صفحة "إدارة المرضى"\n2. اضغط على "إضافة مريض جديد"\n3. املأ البيانات المطلوبة\n4. اضغط "حفظ"\n\nسهل كده! 😊',
      action: { type: 'navigate', data: '/patients' }
    },
    schedule_shift: {
      response: 'ماشي، عشان تجدول وردية:\n\n1. روح على "إدارة الموظفين والورديات"\n2. اضغط على "جدولة وردية جديدة"\n3. اختار الموظف والتاريخ والوقت\n4. اضغط "جدولة الوردية"\n\nكده الوردية هتتسجل في النظام! 👍',
      action: { type: 'navigate', data: '/staff-management' }
    },
    send_message: {
      response: 'تمام، عشان ترسل رسالة لأسرة المريض:\n\n1. روح على "التواصل مع الأسر"\n2. اضغط على "إرسال رسالة جديدة"\n3. اختار العائلة ونوع الرسالة\n4. اكتب الرسالة واضغط "إرسال"\n\nكده الرسالة هتوصّل للأسرة! 📱',
      action: { type: 'navigate', data: '/family-communication' }
    },
    create_report: {
      response: 'ماشي، عشان تعمل تقرير:\n\n1. روح على "التقارير والإحصائيات"\n2. اختار نوع التقرير اللي عايزه\n3. حدد الفترة الزمنية\n4. اضغط "إنشاء التقرير"\n\nالتقرير هيجيلك جاهز! 📊',
      action: { type: 'navigate', data: '/reports' }
    },
    manage_leaves: {
      response: 'طيب، عشان تدير الإجازات:\n\n1. روح على "إدارة الموظفين والورديات"\n2. شوف تبويب "الإجازات"\n3. اضغط على "موافقة" أو "رفض" حسب الحالة\n4. كده الإجازة هتتسجل في النظام\n\nسهل ومريح! 🗓️',
      action: { type: 'navigate', data: '/staff-management' }
    },
    track_progress: {
      response: 'تمام، عشان تتتبع تقدم المريض:\n\n1. روح على صفحة المريض\n2. شوف تبويب "التقدم"\n3. هتلاقي الرسوم البيانية والتقارير\n4. كده تقدر تشوف التطور بالتفصيل\n\nكده تقدر تساعد المريض أحسن! 📈',
      action: { type: 'navigate', data: '/patients' }
    }
  };

  // رسالة الترحيب
  useEffect(() => {
    const welcomeMessage: Message = {
      id: 'welcome',
      text: 'أهلاً وسهلاً! أنا المساعد الذكي بتاع شفا كير 🤖\n\nأقدر أساعدك في:\n• إضافة المرضى والموظفين\n• جدولة الورديات والإجازات\n• التواصل مع أسر المرضى\n• عمل التقارير\n• حل أي مشكلة في النظام\n\nقولي إيه اللي عايز تعمله أو اختار من الاقتراحات! 😊',
      sender: 'assistant',
      timestamp: new Date(),
      type: 'text'
    };
    setMessages([welcomeMessage]);
  }, []);

  // التمرير التلقائي للأسفل
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // محاكاة الكتابة
  const simulateTyping = (response: string, action?: any) => {
    setIsTyping(true);
    setTimeout(() => {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: response,
        sender: 'assistant',
        timestamp: new Date(),
        type: 'text',
        action
      };
      setMessages(prev => [...prev, newMessage]);
      setIsTyping(false);
    }, 1000);
  };

  // معالجة الرسائل
  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    // إضافة رسالة المستخدم
    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    // تحليل الرسالة والرد
    const response = await analyzeMessage(text.trim());
    simulateTyping(response.text, response.action);
  };

  // تحليل الرسالة
  const analyzeMessage = async (text: string): Promise<{ text: string; action?: any }> => {
    const lowerText = text.toLowerCase();
    
    // البحث في قاعدة المعرفة
    for (const [key, value] of Object.entries(knowledgeBase)) {
      if (lowerText.includes(key.replace('_', ' ')) || 
          lowerText.includes(value.response.split('\n')[0].toLowerCase())) {
        return {
          text: value.response,
          action: value.action
        };
      }
    }

    // الردود العامة
    if (lowerText.includes('أهلاً') || lowerText.includes('مرحبا') || lowerText.includes('هلا')) {
      return {
        text: 'أهلاً وسهلاً! إيه اللي أقدر أعمله ليك النهاردة؟ 😊'
      };
    }

    if (lowerText.includes('شكراً') || lowerText.includes('شكرا') || lowerText.includes('ميرسي')) {
      return {
        text: 'العفو! أي وقت تحتاج مساعدة، أنا هنا! 🙏'
      };
    }

    if (lowerText.includes('كيف حالك') || lowerText.includes('إزاي حالك')) {
      return {
        text: 'الحمد لله تمام! وأنا سعيد إنني أقدر أساعدك! 😄'
      };
    }

    if (lowerText.includes('مش عارف') || lowerText.includes('مش فاهم')) {
      return {
        text: 'مش مشكلة! اختار من الاقتراحات اللي تحت أو قولي إيه بالظبط اللي عايز تعمله، وأنا هساعدك خطوة خطوة! 🤝'
      };
    }

    // الرد الافتراضي
    return {
      text: 'مش فاهم بالظبط إيه اللي عايزه. ممكن تقولي أكتر أو اختار من الاقتراحات اللي تحت؟ 🤔\n\nأو قولي:\n• "عايز أعرف إزاي أضيف مريض"\n• "عايز أعرف إزاي أجدول وردية"\n• "عايز أعرف إزاي أرسل رسالة"'
    };
  };

  // معالجة الاقتراحات
  const handleSuggestion = (suggestion: Suggestion) => {
    const action = suggestion.action as keyof typeof knowledgeBase;
    if (knowledgeBase[action]) {
      const response = knowledgeBase[action];
      simulateTyping(response.response, response.action);
    }
  };

  // محاكاة التحدث
  const toggleVoice = () => {
    setIsListening(!isListening);
    if (!isListening) {
      toast({
        title: "بدء الاستماع",
        description: "قولي إيه اللي عايز تعمله",
      });
      // محاكاة الاستماع
      setTimeout(() => {
        setIsListening(false);
        const mockVoiceInput = "عايز أعرف إزاي أضيف مريض جديد";
        setInputText(mockVoiceInput);
        handleSendMessage(mockVoiceInput);
      }, 3000);
    }
  };

  // التنقل
  const handleNavigation = (path: string) => {
    window.location.href = path;
  };

  // معالجة الإدخال
  const handleInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputText);
    }
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 left-4 z-50">
        <Button
          onClick={() => setIsMinimized(false)}
          className="bg-blue-600 hover:bg-blue-700 rounded-full w-12 h-12 p-0"
        >
          <Bot className="w-6 h-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 w-96">
      <Card className="shadow-2xl border-2 border-blue-200">
        <CardHeader className="pb-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 space-x-reverse">
              <Bot className="w-5 h-5" />
              <CardTitle className="text-lg">المساعد الذكي</CardTitle>
              <Badge variant="secondary" className="bg-white/20 text-white">
                متصل
              </Badge>
            </div>
            <div className="flex items-center space-x-1 space-x-reverse">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMuted(!isMuted)}
                className="text-white hover:bg-white/20"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(true)}
                className="text-white hover:bg-white/20"
              >
                <Minimize2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* منطقة الرسائل */}
          <div className="h-80 bg-gray-50">
            <ScrollArea className="h-full p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.sender === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border border-gray-200'
                      }`}
                    >
                      <div className="flex items-start space-x-2 space-x-reverse">
                        {message.sender === 'assistant' && (
                          <Bot className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm whitespace-pre-line">{message.text}</p>
                          {message.action && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="mt-2 text-xs"
                              onClick={() => handleNavigation(message.action!.data)}
                            >
                              افتح الصفحة
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString('ar-EG', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <Bot className="w-4 h-4 text-blue-600" />
                        <div className="flex space-x-1 space-x-reverse">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </div>

          {/* الاقتراحات السريعة */}
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="mb-3">
              <p className="text-sm font-medium text-gray-700 mb-2">اقتراحات سريعة:</p>
              <div className="grid grid-cols-2 gap-2">
                {quickSuggestions.slice(0, 4).map((suggestion) => {
                  const Icon = suggestion.icon;
                  return (
                    <Button
                      key={suggestion.id}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSuggestion(suggestion)}
                      className="text-xs h-auto p-2 text-right"
                    >
                      <Icon className="w-3 h-3 ml-1" />
                      {suggestion.text}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* منطقة الإدخال */}
            <div className="flex items-center space-x-2 space-x-reverse">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleVoice}
                className={`${isListening ? 'bg-red-100 text-red-600' : ''}`}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
              <Input
                ref={inputRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleInputKeyPress}
                placeholder="اكتب رسالتك هنا..."
                className="flex-1"
              />
              <Button
                size="sm"
                onClick={() => handleSendMessage(inputText)}
                disabled={!inputText.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SmartAssistant; 