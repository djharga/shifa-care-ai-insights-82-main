import { supabase } from '@/integrations/supabase/client';
import { ChatEncryption } from '@/utils/chat-encryption';

export interface ChatWebSocketMessage {
  id: string;
  type: 'message' | 'typing' | 'status' | 'notification' | 'file' | 'voice';
  senderId: string;
  receiverId?: string;
  groupId?: string;
  content: string;
  timestamp: string;
  data?: any;
}

export interface TypingIndicator {
  userId: string;
  userName: string;
  isTyping: boolean;
  conversationId: string; // userId أو groupId
}

export interface UserStatus {
  userId: string;
  status: 'online' | 'offline' | 'busy';
  lastSeen?: string;
}

class ChatWebSocketService {
  private supabaseClient: any;
  private channels: Map<string, any> = new Map();
  private messageHandlers: Map<string, (message: ChatWebSocketMessage) => void> = new Map();
  private typingHandlers: Map<string, (typing: TypingIndicator) => void> = new Map();
  private statusHandlers: Map<string, (status: UserStatus) => void> = new Map();
  private notificationHandlers: Map<string, (notification: any) => void> = new Map();
  private currentUserId: string | null = null;
  private isConnected: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 1000;

  constructor() {
    this.supabaseClient = supabase;
  }

  /**
   * تهيئة الاتصال
   */
  async initialize(userId: string): Promise<void> {
    try {
      this.currentUserId = userId;
      await this.connect();
      this.isConnected = true;
      console.log('Chat WebSocket initialized successfully');
    } catch (error) {
      console.error('Error initializing Chat WebSocket:', error);
      throw error;
    }
  }

  /**
   * الاتصال بـ Supabase Realtime
   */
  private async connect(): Promise<void> {
    try {
      // إنشاء قناة للرسائل
      const messagesChannel = this.supabaseClient.channel('chat-messages');
      
      // الاستماع للرسائل الجديدة
      messagesChannel.on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages'
      }, (payload: any) => {
        this.handleNewMessage(payload.new);
      });

      // الاستماع لتحديثات الرسائل
      messagesChannel.on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'messages'
      }, (payload: any) => {
        this.handleMessageUpdate(payload.new);
      });

      // إنشاء قناة لحالة المستخدمين
      const statusChannel = this.supabaseClient.channel('user-status');
      
      statusChannel.on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'users'
      }, (payload: any) => {
        this.handleUserStatusUpdate(payload.new);
      });

      // إنشاء قناة للإشعارات
      const notificationsChannel = this.supabaseClient.channel('notifications');
      
      notificationsChannel.on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications'
      }, (payload: any) => {
        this.handleNewNotification(payload.new);
      });

      // الاشتراك في القنوات
      await messagesChannel.subscribe();
      await statusChannel.subscribe();
      await notificationsChannel.subscribe();

      this.channels.set('messages', messagesChannel);
      this.channels.set('status', statusChannel);
      this.channels.set('notifications', notificationsChannel);

      this.reconnectAttempts = 0;
    } catch (error) {
      console.error('Error connecting to WebSocket:', error);
      await this.handleReconnect();
    }
  }

  /**
   * إعادة الاتصال في حالة الفشل
   */
  private async handleReconnect(): Promise<void> {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

    setTimeout(async () => {
      try {
        await this.connect();
      } catch (error) {
        console.error('Reconnection failed:', error);
        await this.handleReconnect();
      }
    }, this.reconnectDelay * this.reconnectAttempts);
  }

  /**
   * معالجة رسالة جديدة
   */
  private async handleNewMessage(messageData: any): Promise<void> {
    try {
      // فك تشفير الرسالة إذا كانت مشفرة
      let decryptedContent = messageData.content;
      if (ChatEncryption.isValidEncryptedMessage(messageData.content)) {
        decryptedContent = await ChatEncryption.decryptMessage(messageData.content);
      }

      const message: ChatWebSocketMessage = {
        id: messageData.id,
        type: messageData.type || 'message',
        senderId: messageData.sender_id,
        receiverId: messageData.receiver_id,
        groupId: messageData.group_id,
        content: decryptedContent,
        timestamp: messageData.created_at,
        data: messageData.data
      };

      // إرسال الرسالة للمعالجين المناسبين
      this.messageHandlers.forEach((handler, conversationId) => {
        if (this.isMessageForConversation(message, conversationId)) {
          handler(message);
        }
      });

      // إرسال إشعار إذا كان المستخدم الحالي هو المستقبل
      if (message.receiverId === this.currentUserId || 
          (message.groupId && this.isUserInGroup(this.currentUserId!, message.groupId))) {
        this.sendNotification({
          title: 'رسالة جديدة',
          message: `رسالة من ${message.senderId}`,
          type: 'message',
          data: message
        });
      }
    } catch (error) {
      console.error('Error handling new message:', error);
    }
  }

  /**
   * معالجة تحديث رسالة
   */
  private handleMessageUpdate(messageData: any): void {
    // تحديث حالة الرسالة (مثل "تمت القراءة")
    this.messageHandlers.forEach((handler, conversationId) => {
      if (this.isMessageForConversation({
        receiverId: messageData.receiver_id,
        groupId: messageData.group_id
      } as ChatWebSocketMessage, conversationId)) {
        handler({
          id: messageData.id,
          type: 'message',
          senderId: messageData.sender_id,
          receiverId: messageData.receiver_id,
          groupId: messageData.group_id,
          content: messageData.content,
          timestamp: messageData.updated_at,
          data: { status: messageData.status, is_read: messageData.is_read }
        });
      }
    });
  }

  /**
   * معالجة تحديث حالة المستخدم
   */
  private handleUserStatusUpdate(userData: any): void {
    const status: UserStatus = {
      userId: userData.id,
      status: userData.status,
      lastSeen: userData.last_seen
    };

    this.statusHandlers.forEach(handler => {
      handler(status);
    });
  }

  /**
   * معالجة إشعار جديد
   */
  private handleNewNotification(notificationData: any): void {
    if (notificationData.user_id === this.currentUserId) {
      this.notificationHandlers.forEach(handler => {
        handler(notificationData);
      });
    }
  }

  /**
   * التحقق من أن الرسالة تخص المحادثة المحددة
   */
  private isMessageForConversation(message: ChatWebSocketMessage, conversationId: string): boolean {
    if (message.groupId) {
      return message.groupId === conversationId;
    }
    
    if (message.receiverId) {
      return message.receiverId === conversationId || message.senderId === conversationId;
    }
    
    return false;
  }

  /**
   * التحقق من أن المستخدم في المجموعة
   */
  private async isUserInGroup(userId: string, groupId: string): Promise<boolean> {
    try {
      const { data, error } = await this.supabaseClient
        .from('group_members')
        .select('*')
        .eq('user_id', userId)
        .eq('group_id', groupId)
        .single();

      if (error) return false;
      return !!data;
    } catch (error) {
      return false;
    }
  }

  /**
   * إرسال رسالة
   */
  async sendMessage(message: Omit<ChatWebSocketMessage, 'id' | 'timestamp'>): Promise<void> {
    try {
      // تشفير الرسالة
      const encryptedContent = await ChatEncryption.encryptMessage(message.content);

      const messageData = {
        sender_id: message.senderId,
        content: encryptedContent,
        type: message.type,
        status: 'sent',
        is_read: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      if (message.receiverId) {
        messageData.receiver_id = message.receiverId;
      }

      if (message.groupId) {
        messageData.group_id = message.groupId;
      }

      const { error } = await this.supabaseClient
        .from('messages')
        .insert([messageData]);

      if (error) throw error;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  /**
   * إرسال مؤشر الكتابة
   */
  async sendTypingIndicator(conversationId: string, isTyping: boolean): Promise<void> {
    try {
      // إرسال مؤشر الكتابة عبر قناة منفصلة
      const typingChannel = this.supabaseClient.channel(`typing-${conversationId}`);
      
      await typingChannel.send({
        type: 'broadcast',
        event: 'typing',
        payload: {
          userId: this.currentUserId,
          isTyping,
          conversationId,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error sending typing indicator:', error);
    }
  }

  /**
   * تحديث حالة المستخدم
   */
  async updateUserStatus(status: 'online' | 'offline' | 'busy'): Promise<void> {
    try {
      const { error } = await this.supabaseClient
        .from('users')
        .update({
          status,
          last_seen: new Date().toISOString()
        })
        .eq('id', this.currentUserId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  }

  /**
   * إرسال إشعار
   */
  async sendNotification(notification: {
    title: string;
    message: string;
    type: 'message' | 'group' | 'system';
    data?: any;
  }): Promise<void> {
    try {
      const { error } = await this.supabaseClient
        .from('notifications')
        .insert([{
          user_id: this.currentUserId,
          title: notification.title,
          message: notification.message,
          type: notification.type,
          data: notification.data,
          is_read: false,
          created_at: new Date().toISOString()
        }]);

      if (error) throw error;
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }

  /**
   * تسجيل معالج للرسائل
   */
  onMessage(conversationId: string, handler: (message: ChatWebSocketMessage) => void): void {
    this.messageHandlers.set(conversationId, handler);
  }

  /**
   * إلغاء تسجيل معالج الرسائل
   */
  offMessage(conversationId: string): void {
    this.messageHandlers.delete(conversationId);
  }

  /**
   * تسجيل معالج لمؤشر الكتابة
   */
  onTyping(conversationId: string, handler: (typing: TypingIndicator) => void): void {
    this.typingHandlers.set(conversationId, handler);
  }

  /**
   * إلغاء تسجيل معالج مؤشر الكتابة
   */
  offTyping(conversationId: string): void {
    this.typingHandlers.delete(conversationId);
  }

  /**
   * تسجيل معالج لحالة المستخدم
   */
  onUserStatus(handler: (status: UserStatus) => void): void {
    this.statusHandlers.set('global', handler);
  }

  /**
   * إلغاء تسجيل معالج حالة المستخدم
   */
  offUserStatus(): void {
    this.statusHandlers.delete('global');
  }

  /**
   * تسجيل معالج للإشعارات
   */
  onNotification(handler: (notification: any) => void): void {
    this.notificationHandlers.set('global', handler);
  }

  /**
   * إلغاء تسجيل معالج الإشعارات
   */
  offNotification(): void {
    this.notificationHandlers.delete('global');
  }

  /**
   * قطع الاتصال
   */
  async disconnect(): Promise<void> {
    try {
      this.isConnected = false;
      
      // إلغاء الاشتراك من جميع القنوات
      for (const [name, channel] of this.channels) {
        await channel.unsubscribe();
      }
      
      this.channels.clear();
      this.messageHandlers.clear();
      this.typingHandlers.clear();
      this.statusHandlers.clear();
      this.notificationHandlers.clear();
      
      console.log('Chat WebSocket disconnected');
    } catch (error) {
      console.error('Error disconnecting WebSocket:', error);
    }
  }

  /**
   * التحقق من حالة الاتصال
   */
  isConnectedToWebSocket(): boolean {
    return this.isConnected;
  }

  /**
   * الحصول على معرف المستخدم الحالي
   */
  getCurrentUserId(): string | null {
    return this.currentUserId;
  }
}

// إنشاء نسخة واحدة من الخدمة
const chatWebSocketService = new ChatWebSocketService();

export default chatWebSocketService; 