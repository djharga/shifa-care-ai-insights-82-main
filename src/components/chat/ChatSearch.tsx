import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { 
  Search, 
  MessageSquare, 
  Users, 
  FileText, 
  Image as ImageIcon,
  FileAudio,
  Calendar,
  User,
  Filter,
  X,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { searchMessages, ChatMessage } from '@/services/internal-chat-service';

interface ChatSearchProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserId: string;
  currentConversationId?: string; // userId أو groupId
}

interface SearchResult {
  message: ChatMessage;
  context: string;
  highlightIndex: number;
}

const ChatSearch: React.FC<ChatSearchProps> = ({
  isOpen,
  onClose,
  currentUserId,
  currentConversationId
}) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchType, setSearchType] = useState<'all' | 'current'>('current');
  const [messageType, setMessageType] = useState<'all' | 'text' | 'file' | 'image' | 'voice'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [currentResultIndex, setCurrentResultIndex] = useState(-1);

  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setSearchResults([]);
      setCurrentResultIndex(-1);
    }
  }, [isOpen]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "خطأ في البحث",
        description: "يرجى إدخال نص للبحث",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const results = await searchMessages({
        userId: currentUserId,
        query: searchQuery.trim(),
        contactId: searchType === 'current' && currentConversationId ? currentConversationId : undefined,
        groupId: searchType === 'current' && currentConversationId ? currentConversationId : undefined,
      });

      // معالجة النتائج وإضافة السياق
      const processedResults: SearchResult[] = results.map((message, index) => {
        const content = message.content;
        const queryIndex = content.toLowerCase().indexOf(searchQuery.toLowerCase());
        const start = Math.max(0, queryIndex - 50);
        const end = Math.min(content.length, queryIndex + searchQuery.length + 50);
        const context = content.substring(start, end);
        
        return {
          message,
          context: context.length < content.length ? `...${context}...` : context,
          highlightIndex: queryIndex - start
        };
      });

      // تطبيق الفلاتر
      let filteredResults = processedResults;

      // فلتر نوع الرسالة
      if (messageType !== 'all') {
        filteredResults = filteredResults.filter(result => 
          result.message.type === messageType
        );
      }

      // فلتر التاريخ
      if (dateFilter !== 'all') {
        const now = new Date();
        const messageDate = new Date(filteredResults[0]?.message.created_at || '');
        
        switch (dateFilter) {
          case 'today':
            filteredResults = filteredResults.filter(result => {
              const msgDate = new Date(result.message.created_at);
              return msgDate.toDateString() === now.toDateString();
            });
            break;
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            filteredResults = filteredResults.filter(result => {
              const msgDate = new Date(result.message.created_at);
              return msgDate >= weekAgo;
            });
            break;
          case 'month':
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            filteredResults = filteredResults.filter(result => {
              const msgDate = new Date(result.message.created_at);
              return msgDate >= monthAgo;
            });
            break;
        }
      }

      setSearchResults(filteredResults);
      setCurrentResultIndex(filteredResults.length > 0 ? 0 : -1);

      toast({
        title: "تم البحث",
        description: `تم العثور على ${filteredResults.length} نتيجة`,
      });
    } catch (error: any) {
      console.error('Error searching messages:', error);
      toast({
        title: "خطأ في البحث",
        description: error.message || "فشل في البحث في الرسائل",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const navigateResults = (direction: 'next' | 'prev') => {
    if (searchResults.length === 0) return;

    if (direction === 'next') {
      setCurrentResultIndex(prev => 
        prev < searchResults.length - 1 ? prev + 1 : 0
      );
    } else {
      setCurrentResultIndex(prev => 
        prev > 0 ? prev - 1 : searchResults.length - 1
      );
    }
  };

  const highlightText = (text: string, highlightIndex: number, query: string) => {
    if (highlightIndex === -1) return text;
    
    const before = text.substring(0, highlightIndex);
    const highlighted = text.substring(highlightIndex, highlightIndex + query.length);
    const after = text.substring(highlightIndex + query.length);
    
    return (
      <>
        {before}
        <span className="bg-yellow-200 font-semibold">{highlighted}</span>
        {after}
      </>
    );
  };

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'text':
        return <MessageSquare className="w-4 h-4" />;
      case 'file':
        return <FileText className="w-4 h-4" />;
      case 'image':
        return <ImageIcon className="w-4 h-4" />;
      case 'voice':
        return <FileAudio className="w-4 h-4" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'الآن';
    if (diffInHours < 24) return `منذ ${diffInHours} ساعة`;
    if (diffInHours < 168) return `منذ ${Math.floor(diffInHours / 24)} يوم`;
    return date.toLocaleDateString('ar-EG');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Search className="w-5 h-5" />
            <span>البحث في المحادثات</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* شريط البحث */}
          <div className="flex space-x-2">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="ابحث في الرسائل..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pr-10"
              />
            </div>
            <Button onClick={handleSearch} disabled={loading || !searchQuery.trim()}>
              {loading ? 'جاري البحث...' : 'بحث'}
            </Button>
          </div>

          {/* الفلاتر */}
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">نطاق البحث:</span>
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value as 'all' | 'current')}
                className="text-sm border rounded px-2 py-1"
              >
                <option value="current">المحادثة الحالية</option>
                <option value="all">جميع المحادثات</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">نوع الرسالة:</span>
              <select
                value={messageType}
                onChange={(e) => setMessageType(e.target.value as any)}
                className="text-sm border rounded px-2 py-1"
              >
                <option value="all">الكل</option>
                <option value="text">نص</option>
                <option value="file">ملف</option>
                <option value="image">صورة</option>
                <option value="voice">صوت</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">التاريخ:</span>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value as any)}
                className="text-sm border rounded px-2 py-1"
              >
                <option value="all">الكل</option>
                <option value="today">اليوم</option>
                <option value="week">الأسبوع</option>
                <option value="month">الشهر</option>
              </select>
            </div>
          </div>

          {/* نتائج البحث */}
          <div className="flex-1 min-h-0">
            {searchResults.length > 0 && (
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">
                    {searchResults.length} نتيجة
                  </Badge>
                  {currentResultIndex >= 0 && (
                    <Badge variant="outline">
                      {currentResultIndex + 1} من {searchResults.length}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateResults('prev')}
                    disabled={currentResultIndex <= 0}
                  >
                    <ArrowUp className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateResults('next')}
                    disabled={currentResultIndex >= searchResults.length - 1}
                  >
                    <ArrowDown className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            <ScrollArea className="h-96">
              {loading ? (
                <div className="text-center text-gray-500 py-8">
                  جاري البحث...
                </div>
              ) : searchResults.length === 0 && searchQuery ? (
                <div className="text-center text-gray-500 py-8">
                  <Search className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>لا توجد نتائج للبحث</p>
                  <p className="text-sm">جرب كلمات بحث مختلفة</p>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="space-y-2">
                  {searchResults.map((result, index) => (
                    <div
                      key={`${result.message.id}-${index}`}
                      className={`p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer ${
                        index === currentResultIndex ? 'bg-blue-50 border-blue-200' : ''
                      }`}
                      onClick={() => setCurrentResultIndex(index)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          result.message.sender_id === currentUserId 
                            ? 'bg-blue-100 text-blue-600' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {getMessageIcon(result.message.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-sm">
                                {result.message.sender_id === currentUserId ? 'أنت' : result.message.sender_id}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {result.message.type}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                              <Calendar className="w-3 h-3" />
                              <span>{formatDate(result.message.created_at)}</span>
                            </div>
                          </div>
                          
                          <div className="text-sm text-gray-700">
                            {highlightText(result.context, result.highlightIndex, searchQuery)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <Search className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>ابدأ بالبحث في الرسائل</p>
                  <p className="text-sm">اكتب نص البحث واضغط Enter</p>
                </div>
              )}
            </ScrollArea>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            إغلاق
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChatSearch; 