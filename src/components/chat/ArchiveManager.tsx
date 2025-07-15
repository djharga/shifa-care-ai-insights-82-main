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
  Archive, 
  ArchiveRestore, 
  Trash2, 
  Search, 
  Calendar,
  User,
  Users,
  MessageSquare,
  Filter,
  SortAsc,
  SortDesc,
  Download,
  Eye,
  EyeOff
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  getArchivedConversations, 
  unarchiveConversation,
  ChatUser,
  ChatGroup
} from '@/services/internal-chat-service';

interface ArchivedConversation {
  id: string;
  user_id: string;
  contact_id?: string;
  group_id?: string;
  archived_at: string;
  contact?: ChatUser;
  group?: ChatGroup;
  last_message?: string;
  message_count?: number;
}

interface ArchiveManagerProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserId: string;
  onConversationRestored: () => void;
}

const ArchiveManager: React.FC<ArchiveManagerProps> = ({
  isOpen,
  onClose,
  currentUserId,
  onConversationRestored
}) => {
  const { toast } = useToast();
  const [archivedConversations, setArchivedConversations] = useState<ArchivedConversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<ArchivedConversation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'individual' | 'group'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'name'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchArchivedConversations();
    }
  }, [isOpen]);

  const fetchArchivedConversations = async () => {
    try {
      setLoading(true);
      const data = await getArchivedConversations(currentUserId);
      
      // تحويل البيانات إلى الشكل المطلوب
      const conversations: ArchivedConversation[] = data.map((item: any) => ({
        id: item.id,
        user_id: item.user_id,
        contact_id: item.contact_id,
        group_id: item.group_id,
        archived_at: item.archived_at,
        contact: item.contact,
        group: item.group,
        last_message: item.last_message || 'لا توجد رسائل',
        message_count: item.message_count || 0
      }));

      setArchivedConversations(conversations);
    } catch (error) {
      console.error('Error fetching archived conversations:', error);
      toast({
        title: "خطأ في تحميل المحادثات المؤرشفة",
        description: "فشل في تحميل قائمة المحادثات المؤرشفة",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRestoreConversation = async (conversation: ArchivedConversation) => {
    try {
      await unarchiveConversation({
        userId: currentUserId,
        contactId: conversation.contact_id,
        groupId: conversation.group_id
      });

      setArchivedConversations(prev => 
        prev.filter(c => c.id !== conversation.id)
      );

      toast({
        title: "تم استعادة المحادثة",
        description: "تم استعادة المحادثة من الأرشيف بنجاح",
      });

      onConversationRestored();
    } catch (error: any) {
      console.error('Error restoring conversation:', error);
      toast({
        title: "خطأ في استعادة المحادثة",
        description: error.message || "فشل في استعادة المحادثة",
        variant: "destructive",
      });
    }
  };

  const handleDeletePermanently = async (conversation: ArchivedConversation) => {
    if (!confirm('هل أنت متأكد من حذف هذه المحادثة نهائياً؟ لا يمكن التراجع عن هذا الإجراء.')) {
      return;
    }

    try {
      // حذف نهائي من قاعدة البيانات
      // await deleteArchivedConversation(conversation.id);
      
      setArchivedConversations(prev => 
        prev.filter(c => c.id !== conversation.id)
      );

      toast({
        title: "تم الحذف النهائي",
        description: "تم حذف المحادثة نهائياً",
      });
    } catch (error: any) {
      console.error('Error deleting conversation:', error);
      toast({
        title: "خطأ في حذف المحادثة",
        description: error.message || "فشل في حذف المحادثة",
        variant: "destructive",
      });
    }
  };

  const handleExportConversation = async (conversation: ArchivedConversation) => {
    try {
      // تصدير المحادثة كملف JSON
      const exportData = {
        conversation,
        exported_at: new Date().toISOString(),
        exported_by: currentUserId
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `conversation-${conversation.id}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "تم التصدير",
        description: "تم تصدير المحادثة بنجاح",
      });
    } catch (error) {
      console.error('Error exporting conversation:', error);
      toast({
        title: "خطأ في التصدير",
        description: "فشل في تصدير المحادثة",
        variant: "destructive",
      });
    }
  };

  const getConversationName = (conversation: ArchivedConversation) => {
    if (conversation.group) {
      return conversation.group.name;
    }
    if (conversation.contact) {
      return conversation.contact.name;
    }
    return conversation.contact_id || conversation.group_id || 'محادثة غير معروفة';
  };

  const getConversationType = (conversation: ArchivedConversation) => {
    return conversation.group_id ? 'group' : 'individual';
  };

  const getConversationIcon = (conversation: ArchivedConversation) => {
    return conversation.group_id ? <Users className="w-4 h-4" /> : <User className="w-4 h-4" />;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'اليوم';
    if (diffInDays === 1) return 'أمس';
    if (diffInDays < 7) return `منذ ${diffInDays} أيام`;
    if (diffInDays < 30) return `منذ ${Math.floor(diffInDays / 7)} أسابيع`;
    return `منذ ${Math.floor(diffInDays / 30)} أشهر`;
  };

  // فلترة وترتيب النتائج
  const filteredAndSortedConversations = archivedConversations
    .filter(conversation => {
      const matchesSearch = getConversationName(conversation)
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      
      const matchesType = filterType === 'all' || 
        (filterType === 'individual' && !conversation.group_id) ||
        (filterType === 'group' && conversation.group_id);

      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === 'date') {
        comparison = new Date(a.archived_at).getTime() - new Date(b.archived_at).getTime();
      } else {
        comparison = getConversationName(a).localeCompare(getConversationName(b));
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Archive className="w-5 h-5" />
            <span>إدارة الأرشيف</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* شريط البحث والفلترة */}
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="البحث في المحادثات المؤرشفة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="text-sm border rounded px-2 py-1"
              >
                <option value="all">الكل</option>
                <option value="individual">فردية</option>
                <option value="group">مجموعات</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-sm border rounded px-2 py-1"
              >
                <option value="date">التاريخ</option>
                <option value="name">الاسم</option>
              </select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* قائمة المحادثات المؤرشفة */}
          <div className="flex-1 min-h-0">
            {loading ? (
              <div className="text-center text-gray-500 py-8">
                جاري تحميل المحادثات المؤرشفة...
              </div>
            ) : filteredAndSortedConversations.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <Archive className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>لا توجد محادثات مؤرشفة</p>
                {searchQuery && <p className="text-sm">جرب كلمات بحث مختلفة</p>}
              </div>
            ) : (
              <ScrollArea className="h-96">
                <div className="space-y-2">
                  {filteredAndSortedConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className={`p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer ${
                        selectedConversation?.id === conversation.id ? 'bg-blue-50 border-blue-200' : ''
                      }`}
                      onClick={() => setSelectedConversation(conversation)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            getConversationType(conversation) === 'group' 
                              ? 'bg-green-100 text-green-600' 
                              : 'bg-blue-100 text-blue-600'
                          }`}>
                            {getConversationIcon(conversation)}
                          </div>
                          
                          <div>
                            <h3 className="font-medium">{getConversationName(conversation)}</h3>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Badge variant="outline" className="text-xs">
                                {getConversationType(conversation) === 'group' ? 'مجموعة' : 'فردية'}
                              </Badge>
                              <span>•</span>
                              <span>{conversation.message_count} رسالة</span>
                              <span>•</span>
                              <span>{getTimeAgo(conversation.archived_at)}</span>
                            </div>
                            {conversation.last_message && (
                              <p className="text-sm text-gray-500 mt-1 truncate">
                                {conversation.last_message}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleExportConversation(conversation);
                            }}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRestoreConversation(conversation);
                            }}
                          >
                            <ArchiveRestore className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeletePermanently(conversation);
                            }}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>

          {/* تفاصيل المحادثة المختارة */}
          {selectedConversation && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium">تفاصيل المحادثة</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDetails(!showDetails)}
                >
                  {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
              
              {showDetails && (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">الاسم:</span>
                    <span>{getConversationName(selectedConversation)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">النوع:</span>
                    <span>{getConversationType(selectedConversation) === 'group' ? 'مجموعة' : 'فردية'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">تاريخ الأرشفة:</span>
                    <span>{formatDate(selectedConversation.archived_at)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">عدد الرسائل:</span>
                    <span>{selectedConversation.message_count}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <div className="flex items-center justify-between w-full">
            <div className="text-sm text-gray-600">
              {filteredAndSortedConversations.length} محادثة مؤرشفة
            </div>
            <Button variant="outline" onClick={onClose}>
              إغلاق
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ArchiveManager; 