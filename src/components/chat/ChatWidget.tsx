import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageSquare, 
  X, 
  Minimize2, 
  Send, 
  Paperclip, 
  Smile, 
  Mic,
  Users,
  User,
  Search,
  MoreVertical,
  Phone,
  Video,
  Check,
  CheckCheck,
  Clock,
  Image as ImageIcon,
  File,
  Archive,
  Trash2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import supabase from '@/integrations/supabase/client';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file' | 'voice';
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

const ChatWidget = () => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [groups, setGroups] = useState<ChatGroup[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | ChatGroup | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showContacts, setShowContacts] = useState(true);
  const [showGroups, setShowGroups] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [totalUnread, setTotalUnread] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // جلب المستخدمين والمجموعات
  useEffect(() => {
    async function fetchData() {
      try {
        const { data: users, error: usersError } = await supabase
          .from('users')
          .select('*')
          .eq('is_active', true);

        if (usersError) throw usersError;

        const contactsData = users.map((u: any) => ({
          id: u.id,
          name: u.name,
          role: u.role,
          avatar: u.avatar || '',
          status: u.status || 'offline',
          unreadCount: 0,
          lastMessage: '',
          lastMessageTime: undefined,
        }));

        setContacts(contactsData);
        if (users.length > 0) setCurrentUserId(users[0].id);

        // جلب المجموعات
        const { data: groupsData, error: groupsError } = await supabase
          .from('chat_groups')
          .select('*');

        if (groupsError) throw groupsError;

        setGroups(groupsData.map((g: any) => ({
          id: g.id,
          name: g.name,
          members: [],
          isGroup: true,
          avatar: g.avatar || '',
        })));

        // حساب الرسائل غير المقروءة
        calculateUnreadCount();
      } catch (error: any) {
        console.error('Error fetching chat data:', error);
        toast({
          title: "خطأ في تحميل بيانات الشات",
          description: error.message,
          variant: "destructive",
        });
      }
    }
    fetchData();
  }, []);

  // حساب الرسائل غير المقروءة
  const calculateUnreadCount = async () => {
    if (!currentUserId) return;
    
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('receiver_id', currentUserId)
        .eq('is_read', false);

      if (error) throw error;
      setTotalUnread(data?.length || 0);
    } catch (error) {
      console.error('Error calculating unread count:', error);
    }
  };

  // جلب الرسائل
  useEffect(() => {
    async function fetchMessages() {
      if (!selectedContact || !currentUserId) return;
      
      try {
        let query;
        if ('members' in selectedContact) {
          // مجموعة
          query = supabase
            .from('messages')
            .select('*')
            .eq('group_id', selectedContact.id)
            .order('created_at', { ascending: true });
        } else {
          // فردي
          query = supabase
            .from('messages')
            .select('*')
            .or(`and(sender_id.eq.${currentUserId},receiver_id.eq.${selectedContact.id}),and(sender_id.eq.${selectedContact.id},receiver_id.eq.${currentUserId})`)
            .order('created_at', { ascending: true });
        }

        const { data, error } = await query;
        if (error) throw error;

        setMessages(data.map((m: any) => ({
          id: m.id,
          senderId: m.sender_id,
          senderName: contacts.find(c => c.id === m.sender_id)?.name || '',
          senderRole: contacts.find(c => c.id === m.sender_id)?.role || '',
          content: m.content,
          timestamp: new Date(m.created_at),
          type: m.type || 'text',
          status: m.status || 'sent',
          isOwn: m.sender_id === currentUserId,
        })));
      } catch (error: any) {
        console.error('Error fetching messages:', error);
        toast({
          title: "خطأ في تحميل الرسائل",
          description: error.message,
          variant: "destructive",
        });
      }
    }
    fetchMessages();
  }, [selectedContact, currentUserId, contacts]);

  // التمرير التلقائي للأسفل
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // إرسال رسالة
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedContact || !currentUserId) return;

    try {
      const messageData = {
        sender_id: currentUserId,
        content: newMessage.trim(),
        type: 'text',
        status: 'sent',
        created_at: new Date().toISOString(),
      };

      if ('members' in selectedContact) {
        messageData.group_id = selectedContact.id;
      } else {
        messageData.receiver_id = selectedContact.id;
      }

      const { data, error } = await supabase
        .from('messages')
        .insert([messageData])
        .select()
        .single();

      if (error) throw error;

      const newMsg: Message = {
        id: data.id,
        senderId: currentUserId,
        senderName: contacts.find(c => c.id === currentUserId)?.name || '',
        senderRole: contacts.find(c => c.id === currentUserId)?.role || '',
        content: newMessage.trim(),
        timestamp: new Date(),
        type: 'text',
        status: 'sent',
        isOwn: true,
      };

      setMessages(prev => [...prev, newMsg]);
      setNewMessage('');
      
      toast({
        title: "تم الإرسال",
        description: "تم إرسال الرسالة بنجاح",
      });
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: "خطأ في إرسال الرسالة",
        description: error.message,
        variant: "destructive",
      });
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
    if ('unreadCount' in contact) {
      setContacts(prev => 
        prev.map(c => 
          c.id === contact.id ? { ...c, unreadCount: 0 } : c
        )
      );
    }
    calculateUnreadCount();
  };

  const handleUploadFile = () => {
    toast({
      title: "رفع ملف",
      description: "سيتم فتح نافذة اختيار الملف",
    });
  };

  const handleVoiceMessage = () => {
    toast({
      title: "رسالة صوتية",
      description: "جاري تسجيل الرسالة الصوتية...",
    });
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg"
          size="lg"
        >
          <MessageSquare className="w-6 h-6 text-white" />
          {totalUnread > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {totalUnread > 99 ? '99+' : totalUnread}
            </Badge>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 h-[500px]">
      <Card className="w-full h-full flex flex-col shadow-xl border-2 border-blue-200">
        <CardHeader className="pb-3 bg-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5" />
              <CardTitle className="text-lg">الشات الداخلي</CardTitle>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white hover:bg-blue-700"
              >
                <Minimize2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-blue-700"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <>
            {!selectedContact ? (
              <CardContent className="flex-1 p-0">
                {/* البحث */}
                <div className="p-3 border-b">
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
                <ScrollArea className="flex-1">
                  {showContacts && (
                    <div className="p-2">
                      {filteredContacts.map((contact) => (
                        <div
                          key={contact.id}
                          className="flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                          onClick={() => handleContactSelect(contact)}
                        >
                          <div className="relative">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={contact.avatar} />
                              <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                              contact.status === 'online' ? 'bg-green-500' :
                              contact.status === 'busy' ? 'bg-yellow-500' : 'bg-gray-400'
                            }`} />
                          </div>
                          <div className="mr-3 flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium text-sm">{contact.name}</h3>
                              {contact.unreadCount > 0 && (
                                <Badge variant="destructive" className="text-xs">
                                  {contact.unreadCount}
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-gray-600">{contact.role}</p>
                            {contact.lastMessage && (
                              <p className="text-xs text-gray-500 truncate">{contact.lastMessage}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {showGroups && (
                    <div className="p-2">
                      {filteredGroups.map((group) => (
                        <div
                          key={group.id}
                          className="flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                          onClick={() => handleContactSelect(group)}
                        >
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={group.avatar} />
                            <AvatarFallback>{group.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="mr-3 flex-1">
                            <h3 className="font-medium text-sm">{group.name}</h3>
                            <p className="text-xs text-gray-600">{group.members.length} عضو</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            ) : (
              <CardContent className="flex-1 p-0 flex flex-col">
                {/* Header المحادثة */}
                <div className="bg-white border-b p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedContact(null)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={'avatar' in selectedContact ? selectedContact.avatar : selectedContact.avatar} />
                        <AvatarFallback>{selectedContact.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium text-sm">{selectedContact.name}</h3>
                        <p className="text-xs text-gray-600">
                          {'role' in selectedContact ? selectedContact.role : `${selectedContact.members.length} عضو`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="sm">
                        <Phone className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Video className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* الرسائل */}
                <ScrollArea className="flex-1 p-3">
                  <div className="space-y-2">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[80%] ${message.isOwn ? 'order-2' : 'order-1'}`}>
                          <div className={`p-2 rounded-lg text-sm ${
                            message.isOwn 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-gray-100 text-gray-900'
                          }`}>
                            <p>{message.content}</p>
                            <div className={`text-xs mt-1 flex items-center justify-between ${
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
                        <div className="bg-gray-100 p-2 rounded-lg">
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
                <div className="p-3 border-t bg-white">
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" onClick={handleUploadFile}>
                      <Paperclip className="w-4 h-4" />
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
                    <Button variant="ghost" size="sm" onClick={handleVoiceMessage}>
                      <Mic className="w-4 h-4" />
                    </Button>
                    <Button onClick={handleSendMessage} disabled={!newMessage.trim()} size="sm">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            )}
          </>
        )}
      </Card>
    </div>
  );
};

export default ChatWidget; 