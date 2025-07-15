import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  Brain,
  MessageSquare,
  Settings,
  RefreshCw,
  Copy,
  Check
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { googleAIService } from '@/services/google-ai-service';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  type?: 'text' | 'suggestion' | 'analysis';
}

const AIAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // التمرير التلقائي للأسفل
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // رسالة ترحيب
  useEffect(() => {
    const welcomeMessage: Message = {
      id: 'welcome',
      content: 'أهلاً وسهلاً! أنا المساعد الذكي لمركز شفاء كير. أقدر أساعدك في:\n\n🔹 تحليل الجلسات العلاجية\n🔸 اقتراح خطط علاجية\n🔹 إجابة أسئلتك الطبية\n🔸 تقديم نصائح للمرضى\n\nاكتب لي أي سؤال أو استفسار باللهجة المصرية!',
      role: 'assistant',
      timestamp: new Date(),
      type: 'text'
    };
    setMessages([welcomeMessage]);
  }, []);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      const systemPrompt = `أنت مساعد طبي ذكي متخصص في علاج الإدمان. ترد دائماً باللهجة المصرية فقط. قدم إجابات مفيدة وعملية ومهنية. كن داعماً ومتفهماً لظروف المرضى.`;

      const userPrompt = `المستخدم كتب: "${input}"

أجب باللهجة المصرية فقط. قدم إجابة مفيدة ومهنية ومحددة. إذا كان السؤال عن علاج الإدمان، قدم نصائح عملية. إذا كان سؤال عام، أجب باختصار ومهنية.`;

      const result = await googleAIService.customCall(systemPrompt, userPrompt);
      
      if (!result.success) {
        throw new Error(result.error || 'فشل في الحصول على رد من المساعد');
      }

      const aiResponse = result.data || 'عذراً، لم أستطع فهم سؤالك. حاول مرة أخرى.';

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        role: 'assistant',
        timestamp: new Date(),
        type: 'text'
      };

      setMessages(prev => [...prev, assistantMessage]);

    } catch (error: any) {
      console.error('خطأ في المساعد الذكي:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'عذراً، حدث خطأ في الاتصال. حاول مرة أخرى بعد قليل.',
        role: 'assistant',
        timestamp: new Date(),
        type: 'text'
      };

      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "خطأ في الاتصال",
        description: "فشل في الاتصال بالمساعد الذكي",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const copyMessage = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "تم النسخ",
        description: "تم نسخ الرسالة إلى الحافظة",
      });
    } catch (error) {
      toast({
        title: "خطأ في النسخ",
        description: "فشل في نسخ الرسالة",
        variant: "destructive",
      });
    }
  };

  const clearChat = () => {
    setMessages([]);
    toast({
      title: "تم مسح المحادثة",
      description: "تم مسح جميع الرسائل",
    });
  };

  const getQuickSuggestions = () => [
    "اقترح خطة علاجية لمريض إدمان",
    "كيف أتعامل مع مريض مقاوم للعلاج؟",
    "ما هي أفضل طرق الوقاية من الانتكاس؟",
    "نصائح للتعامل مع أسر المرضى"
  ];

  return (
    <div className="container mx-auto p-4 h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
            <Bot className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">المساعد الذكي</h1>
            <p className="text-sm text-gray-600">Google Gemini - مساعد علاج الإدمان</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={clearChat}>
            <RefreshCw className="h-4 w-4 mr-1" />
            مسح المحادثة
          </Button>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 bg-white rounded-lg border overflow-hidden flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2 mb-2">
                    {message.role === 'user' ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                    <span className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString('ar-EG', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  {message.role === 'assistant' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyMessage(message.content)}
                      className="h-6 w-6 p-0 opacity-50 hover:opacity-100"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                <div className="whitespace-pre-line text-sm leading-relaxed">
                  {message.content}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <Bot className="h-4 w-4" />
                  <div className="flex space-x-1">
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

        {/* Quick Suggestions */}
        {messages.length === 1 && (
          <div className="p-4 border-t bg-gray-50">
            <p className="text-sm text-gray-600 mb-3">اقتراحات سريعة:</p>
            <div className="flex flex-wrap gap-2">
              {getQuickSuggestions().map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setInput(suggestion)}
                  className="text-xs h-8"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t bg-white">
          <div className="flex space-x-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="اكتب رسالتك هنا... (اضغط Enter للإرسال)"
              className="flex-1 min-h-[44px] max-h-32 resize-none"
              rows={1}
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              className="px-4 h-[44px]"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            المساعد الذكي يعمل بـ Google Gemini - جميع الردود باللهجة المصرية
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant; 