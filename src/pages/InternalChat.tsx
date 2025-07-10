import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Send, 
  Paperclip, 
  Smile, 
  MoreVertical, 
  Search, 
  Phone, 
  Video, 
  Image, 
  File, 
  Mic,
  Check,
  CheckCheck,
  Clock,
  User,
  Users,
  Settings,
  ArrowLeft,
  Plus,
  Filter,
  Archive,
  Trash2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import {
  getUsers,
  getGroups,
  getMessages,
  sendMessage
} from '@/services/internal-chat-service';
import { createClient } from '@supabase/supabase-js';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file' | 'session' | 'report';
  status: 'sent' | 'delivered' | 'read';
  isOwn: boolean;
}

interface Contact {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: 'online' | 'offline' | 'busy';
  lastSeen?: Date;
  unreadCount: number;
  lastMessage?: string;
  lastMessageTime?: Date;
}

interface ChatGroup {
  id: string;
  name: string;
  members: Contact[];
  isGroup: boolean;
  avatar?: string;
}

const InternalChat = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [groups, setGroups] = useState<ChatGroup[]>([]);
  const [usersMap, setUsersMap] = useState<Record<string, { name: string; role: string; avatar: string }>>({});
  const [selectedContact, setSelectedContact] = useState<Contact | ChatGroup | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showContacts, setShowContacts] = useState(true);
  const [showGroups, setShowGroups] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // معرف المستخدم الحالي (مؤقتاً: أول مستخدم في القائمة)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // جلب المستخدمين والمجموعات من Supabase
  useEffect(() => {
    async function fetchData() {
      try {
        const users = await getUsers();
        setContacts(users.map((u: any) => ({
          ...u,
          unreadCount: 0,
          lastMessage: '',
          lastMessageTime: undefined,
          status: u.status || 'offline',
          avatar: u.avatar || '',
        })));
        // usersMap: id => {name, role, avatar}
        const map: Record<string, { name: string; role: string; avatar: string }> = {};
        users.forEach((u: any) => { map[u.id] = { name: u.name, role: u.role, avatar: u.avatar || '' }; });
        setUsersMap(map);
        if (users.length > 0) setCurrentUserId(users[0].id); // مؤقتاً
        const groups = await getGroups();
        setGroups(groups.map((g: any) => ({
          ...g,
          members: [], // يمكن جلب الأعضاء لاحقاً
          isGroup: true,
          avatar: g.avatar || '',
        })));
      } catch (error) {
        toast({ title: 'خطأ', description: 'فشل في تحميل البيانات' });
      }
    }
    fetchData();
  }, []);

  // جلب الرسائل الحقيقية عند اختيار جهة اتصال أو مجموعة
  useEffect(() => {
    async function fetchMessages() {
      if (!selectedContact || !currentUserId) return;
      try {
        let msgs = [];
        if ('members' in selectedContact) {
          // مجموعة
          msgs = await getMessages({ groupId: selectedContact.id });
        } else {
          // فردي
          msgs = await getMessages({ userId: currentUserId, contactId: selectedContact.id });
        }
        setMessages((msgs as any[]).map((m) => ({
          id: m.id,
          senderId: m.sender_id,
          senderName: usersMap[m.sender_id]?.name || '',
          senderRole: usersMap[m.sender_id]?.role || '',
          content: m.content,
          timestamp: new Date(m.timestamp),
          type: m.type || 'text',
          status: m.status || 'sent',
          isOwn: m.sender_id === currentUserId,
        })));
      } catch (error) {
        toast({ title: 'خطأ', description: 'فشل في تحميل الرسائل' });
      }
    }
    fetchMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedContact, currentUserId, usersMap]);

  // تفعيل التحديث اللحظي (Realtime) للرسائل
  useEffect(() => {
    if (!selectedContact || !currentUserId) return;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) return;
    const supabase = createClient(supabaseUrl, supabaseKey);
    const channel = supabase.channel('messages-realtime');
    channel.on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
      const m = payload.new;
      // تحقق أن الرسالة تخص المحادثة الحالية
      if (
        ('members' in selectedContact && m.group_id === selectedContact.id) ||
        (!('members' in selectedContact) &&
          ((m.sender_id === currentUserId && m.receiver_id === selectedContact.id) ||
           (m.sender_id === selectedContact.id && m.receiver_id === currentUserId)))
      ) {
        setMessages((prev) => ([
          ...prev,
          {
            id: m.id,
            senderId: m.sender_id,
            senderName: usersMap[m.sender_id]?.name || '',
            senderRole: usersMap[m.sender_id]?.role || '',
            content: m.content,
            timestamp: new Date(m.timestamp),
            type: m.type || 'text',
            status: m.status || 'sent',
            isOwn: m.sender_id === currentUserId,
          }
        ]));
      }
    });
    channel.subscribe();
    return () => { channel.unsubscribe(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedContact, currentUserId, usersMap]);

  // التمرير التلقائي للأسفل
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // إرسال رسالة جديدة وحفظها في Supabase
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedContact || !currentUserId) return;
    try {
      if ('members' in selectedContact) {
        // رسالة جماعية
        await sendMessage({
          senderId: currentUserId,
          content: newMessage,
          groupId: selectedContact.id
        });
      } else {
        // رسالة فردية
        await sendMessage({
          senderId: currentUserId,
          content: newMessage,
          receiverId: selectedContact.id
        });
      }
      setNewMessage('');
      // إعادة تحميل الرسائل بعد الإرسال
      let msgs = [];
      if ('members' in selectedContact) {
        msgs = await getMessages({ groupId: selectedContact.id });
      } else {
        msgs = await getMessages({ userId: currentUserId, contactId: selectedContact.id });
      }
      setMessages((msgs as any[]).map((m) => ({
        id: m.id,
        senderId: m.sender_id,
        senderName: '',
        senderRole: '',
        content: m.content,
        timestamp: new Date(m.timestamp),
        type: m.type || 'text',
        status: m.status || 'sent',
        isOwn: m.sender_id === currentUserId,
      })));
      toast({ title: 'تم الإرسال', description: 'تم إرسال الرسالة بنجاح' });
    } catch (error) {
      toast({ title: 'خطأ', description: 'فشل في إرسال الرسالة' });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleContactSelect = (contact: Contact | ChatGroup) => {
    setSelectedContact(contact);
    // إعادة تعيين عدد الرسائل غير المقروءة
    if ('unreadCount' in contact) {
      setContacts(prev => 
        prev.map(c => 
          c.id === contact.id ? { ...c, unreadCount: 0 } : c
        )
      );
    }
  };

  const handleBackToHome = () => {
    navigate('/');
    toast({
      title: 'العودة للرئيسية',
      description: 'سيتم نقلك إلى الصفحة الرئيسية',
    });
  };

  const handleCreateGroup = () => {
    toast({
      title: 'إنشاء مجموعة جديدة',
      description: 'سيتم فتح نموذج إنشاء المجموعة',
    });
  };

  const handleUploadFile = () => {
    toast({
      title: 'رفع ملف',
      description: 'سيتم فتح نافذة اختيار الملف',
    });
  };

  const handleShareSession = () => {
    toast({
      title: 'مشاركة جلسة',
      description: 'سيتم فتح قائمة الجلسات للمشاركة',
    });
  };

  const handleVoiceMessage = () => {
    toast({
      title: 'رسالة صوتية',
      description: 'جاري تسجيل الرسالة الصوتية...',
    });
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <div className="bg-white border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={handleBackToHome}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">الشات الداخلي</h1>
              <p className="text-sm text-gray-600">تواصل المعالجين والمشرفين</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleCreateGroup}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar - قائمة جهات الاتصال */}
        <div className="w-80 bg-white border-l">
          {/* البحث */}
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="البحث في المحادثات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
          </div>

          {/* التبويبات */}
          <div className="flex border-b">
            <Button
              variant={showContacts ? "default" : "ghost"}
              className="flex-1 rounded-none"
              onClick={() => { setShowContacts(true); setShowGroups(false); }}
            >
              <User className="w-4 h-4 mr-2" />
              جهات الاتصال
            </Button>
            <Button
              variant={showGroups ? "default" : "ghost"}
              className="flex-1 rounded-none"
              onClick={() => { setShowGroups(true); setShowContacts(false); }}
            >
              <Users className="w-4 h-4 mr-2" />
              المجموعات
            </Button>
          </div>

          {/* قائمة جهات الاتصال */}
          <ScrollArea className="h-[calc(100vh-200px)]">
            {showContacts && (
              <div className="p-2">
                {filteredContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className={`flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedContact?.id === contact.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                    }`}
                    onClick={() => handleContactSelect(contact)}
                  >
                    <div className="relative">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={contact.avatar} />
                        <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                        contact.status === 'online' ? 'bg-green-500' :
                        contact.status === 'busy' ? 'bg-yellow-500' : 'bg-gray-400'
                      }`} />
                    </div>
                    <div className="mr-3 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{contact.name}</h3>
                        {contact.unreadCount > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {contact.unreadCount}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{contact.role}</p>
                      {contact.lastMessage && (
                        <p className="text-sm text-gray-500 truncate">{contact.lastMessage}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* قائمة المجموعات */}
            {showGroups && (
              <div className="p-2">
                {filteredGroups.map((group) => (
                  <div
                    key={group.id}
                    className={`flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedContact?.id === group.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                    }`}
                    onClick={() => handleContactSelect(group)}
                  >
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={group.avatar} />
                      <AvatarFallback>{group.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="mr-3 flex-1">
                      <h3 className="font-medium">{group.name}</h3>
                      <p className="text-sm text-gray-600">{group.members.length} عضو</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* منطقة المحادثة */}
        <div className="flex-1 flex flex-col">
          {selectedContact ? (
            <>
              {/* Header المحادثة */}
              <div className="bg-white border-b p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={'avatar' in selectedContact ? selectedContact.avatar : selectedContact.avatar} />
                      <AvatarFallback>{selectedContact.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="font-semibold">{selectedContact.name}</h2>
                      <p className="text-sm text-gray-600">
                        {'role' in selectedContact ? selectedContact.role : `${selectedContact.members.length} عضو`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Video className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* الرسائل */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs lg:max-w-md ${message.isOwn ? 'order-2' : 'order-1'}`}>
                        <div className={`p-3 rounded-lg ${
                          message.isOwn 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-100 text-gray-900'
                        }`}>
                          <p className="text-sm">{message.content}</p>
                          {!message.isOwn && (
                            <div className="text-xs text-gray-500 mt-1 mr-2 flex gap-2">
                              <span>{message.senderName}</span>
                              <span>{message.senderRole}</span>
                            </div>
                          )}
                          <div className={`flex items-center justify-between mt-2 text-xs ${
                            message.isOwn ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            <span>{message.timestamp.toLocaleTimeString('ar-EG', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}</span>
                            {message.isOwn && (
                              <div className="flex items-center space-x-1">
                                {message.status === 'sent' && <Clock className="w-3 h-3" />}
                                {message.status === 'delivered' && <Check className="w-3 h-3" />}
                                {message.status === 'read' && <CheckCheck className="w-3 h-3" />}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* إدخال الرسالة */}
              <div className="bg-white border-t p-4">
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={handleUploadFile}>
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleShareSession}>
                    <File className="w-4 h-4" />
                  </Button>
                  <div className="flex-1 relative">
                    <Input
                      placeholder="اكتب رسالة..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="pr-12"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute left-2 top-1/2 transform -translate-y-1/2"
                    >
                      <Smile className="w-4 h-4" />
                    </Button>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleVoiceMessage}>
                    <Mic className="w-4 h-4" />
                  </Button>
                  <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            /* شاشة الترحيب */
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-12 h-12 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">الشات الداخلي</h2>
                <p className="text-gray-600 mb-4">اختر جهة اتصال أو مجموعة للبدء في المحادثة</p>
                <div className="flex space-x-2 justify-center">
                  <Button onClick={() => setShowContacts(true)}>
                    <User className="w-4 h-4 mr-2" />
                    جهات الاتصال
                  </Button>
                  <Button variant="outline" onClick={() => setShowGroups(true)}>
                    <Users className="w-4 h-4 mr-2" />
                    المجموعات
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InternalChat; 