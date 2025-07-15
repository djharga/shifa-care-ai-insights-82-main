import { supabase } from '@/integrations/supabase/client';

export interface ChatUser {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  status: 'online' | 'offline' | 'busy';
  last_seen?: string;
  is_active: boolean;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  sender_id: string;
  receiver_id?: string;
  group_id?: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'voice';
  status: 'sent' | 'delivered' | 'read';
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export interface ChatGroup {
  id: string;
  name: string;
  description?: string;
  avatar?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface GroupMember {
  id: string;
  group_id: string;
  user_id: string;
  role: 'admin' | 'member';
  joined_at: string;
}

// جلب جميع المستخدمين النشطين
export const getUsers = async (): Promise<ChatUser[]> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// جلب جميع المجموعات
export const getGroups = async (): Promise<ChatGroup[]> => {
  try {
    const { data, error } = await supabase
      .from('chat_groups')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching groups:', error);
    throw error;
  }
};

// جلب رسائل محادثة فردية
export const getMessages = async (params: {
  userId: string;
  contactId: string;
}): Promise<ChatMessage[]> => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${params.userId},receiver_id.eq.${params.contactId}),and(sender_id.eq.${params.contactId},receiver_id.eq.${params.userId})`)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

// جلب رسائل مجموعة
export const getGroupMessages = async (groupId: string): Promise<ChatMessage[]> => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('group_id', groupId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching group messages:', error);
    throw error;
  }
};

// إرسال رسالة
export const sendMessage = async (params: {
  senderId: string;
  content: string;
  receiverId?: string;
  groupId?: string;
  type?: 'text' | 'image' | 'file' | 'voice';
}): Promise<ChatMessage> => {
  try {
    const messageData: any = {
      sender_id: params.senderId,
      content: params.content,
      type: params.type || 'text',
      status: 'sent',
      is_read: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (params.receiverId) {
      messageData.receiver_id = params.receiverId;
    }

    if (params.groupId) {
      messageData.group_id = params.groupId;
    }

    const { data, error } = await supabase
      .from('messages')
      .insert([messageData])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

// تحديث حالة الرسالة
export const updateMessageStatus = async (messageId: string, status: 'delivered' | 'read'): Promise<void> => {
  try {
    const { error } = await supabase
      .from('messages')
      .update({ 
        status, 
        is_read: status === 'read',
        updated_at: new Date().toISOString() 
      })
      .eq('id', messageId);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating message status:', error);
    throw error;
  }
};

// إنشاء مجموعة جديدة
export const createGroup = async (params: {
  name: string;
  description?: string;
  createdBy: string;
  members: string[];
}): Promise<ChatGroup> => {
  try {
    // إنشاء المجموعة
    const { data: group, error: groupError } = await supabase
      .from('chat_groups')
      .insert([{
        name: params.name,
        description: params.description,
        created_by: params.createdBy,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (groupError) throw groupError;

    // إضافة الأعضاء
    const membersData = params.members.map(userId => ({
      group_id: group.id,
      user_id: userId,
      role: userId === params.createdBy ? 'admin' : 'member',
      joined_at: new Date().toISOString(),
    }));

    const { error: membersError } = await supabase
      .from('group_members')
      .insert(membersData);

    if (membersError) throw membersError;

    return group;
  } catch (error) {
    console.error('Error creating group:', error);
    throw error;
  }
};

// إضافة عضو لمجموعة
export const addGroupMember = async (groupId: string, userId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('group_members')
      .insert([{
        group_id: groupId,
        user_id: userId,
        role: 'member',
        joined_at: new Date().toISOString(),
      }]);

    if (error) throw error;
  } catch (error) {
    console.error('Error adding group member:', error);
    throw error;
  }
};

// إزالة عضو من مجموعة
export const removeGroupMember = async (groupId: string, userId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('group_members')
      .delete()
      .eq('group_id', groupId)
      .eq('user_id', userId);

    if (error) throw error;
  } catch (error) {
    console.error('Error removing group member:', error);
    throw error;
  }
};

// جلب أعضاء المجموعة
export const getGroupMembers = async (groupId: string): Promise<GroupMember[]> => {
  try {
    const { data, error } = await supabase
      .from('group_members')
      .select('*')
      .eq('group_id', groupId);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching group members:', error);
    throw error;
  }
};

// تحديث حالة المستخدم
export const updateUserStatus = async (userId: string, status: 'online' | 'offline' | 'busy'): Promise<void> => {
  try {
    const { error } = await supabase
      .from('users')
      .update({ 
        status, 
        last_seen: new Date().toISOString() 
      })
      .eq('id', userId);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating user status:', error);
    throw error;
  }
};

// جلب الرسائل غير المقروءة
export const getUnreadMessages = async (userId: string): Promise<ChatMessage[]> => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('receiver_id', userId)
      .eq('is_read', false)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching unread messages:', error);
    throw error;
  }
};

// حذف رسالة
export const deleteMessage = async (messageId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', messageId);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting message:', error);
    throw error;
  }
};

// أرشفة محادثة
export const archiveConversation = async (params: {
  userId: string;
  contactId?: string;
  groupId?: string;
}): Promise<void> => {
  try {
    const archiveData = {
      user_id: params.userId,
      contact_id: params.contactId,
      group_id: params.groupId,
      archived_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('archived_conversations')
      .insert([archiveData]);

    if (error) throw error;
  } catch (error) {
    console.error('Error archiving conversation:', error);
    throw error;
  }
};

// جلب المحادثات المؤرشفة
export const getArchivedConversations = async (userId: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('archived_conversations')
      .select('*')
      .eq('user_id', userId)
      .order('archived_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching archived conversations:', error);
    throw error;
  }
};

// إلغاء أرشفة محادثة
export const unarchiveConversation = async (params: {
  userId: string;
  contactId?: string;
  groupId?: string;
}): Promise<void> => {
  try {
    const { error } = await supabase
      .from('archived_conversations')
      .delete()
      .eq('user_id', params.userId)
      .eq('contact_id', params.contactId || null)
      .eq('group_id', params.groupId || null);

    if (error) throw error;
  } catch (error) {
    console.error('Error unarchiving conversation:', error);
    throw error;
  }
};

// البحث في الرسائل
export const searchMessages = async (params: {
  userId: string;
  query: string;
  contactId?: string;
  groupId?: string;
}): Promise<ChatMessage[]> => {
  try {
    let query = supabase
      .from('messages')
      .select('*')
      .ilike('content', `%${params.query}%`);

    if (params.contactId) {
      query = query.or(`and(sender_id.eq.${params.userId},receiver_id.eq.${params.contactId}),and(sender_id.eq.${params.contactId},receiver_id.eq.${params.userId})`);
    }

    if (params.groupId) {
      query = query.eq('group_id', params.groupId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error searching messages:', error);
    throw error;
  }
};

// إرسال إشعار
export const sendNotification = async (params: {
  userId: string;
  title: string;
  message: string;
  type: 'message' | 'group' | 'system';
  data?: any;
}): Promise<void> => {
  try {
    const { error } = await supabase
      .from('notifications')
      .insert([{
        user_id: params.userId,
        title: params.title,
        message: params.message,
        type: params.type,
        data: params.data,
        is_read: false,
        created_at: new Date().toISOString(),
      }]);

    if (error) throw error;
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
};

// جلب الإشعارات
export const getNotifications = async (userId: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

// تحديث حالة الإشعار
export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    if (error) throw error;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
}; 