import { supabase } from '@/integrations/supabase/client';

// جلب كل المستخدمين
export async function getUsers() {
  const { data, error } = await supabase.from('users').select('*');
  if (error) throw error;
  return data;
}

// جلب كل المجموعات
export async function getGroups() {
  const { data, error } = await supabase.from('chat_groups').select('*');
  if (error) throw error;
  return data;
}

// جلب أعضاء مجموعة معينة
export async function getGroupMembers(groupId: string) {
  const { data, error } = await supabase
    .from('group_members')
    .select('user_id')
    .eq('group_id', groupId);
  if (error) throw error;
  return data;
}

// جلب الرسائل (فردية أو جماعية)
export async function getMessages({
  userId,
  contactId,
  groupId
}: {
  userId?: string;
  contactId?: string;
  groupId?: string;
}) {
  if (groupId) {
    // رسائل المجموعة
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('group_id', groupId)
      .order('timestamp', { ascending: true });
    if (error) throw error;
    return data;
  } else if (userId && contactId) {
    // رسائل فردية بين مستخدمين
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${userId},receiver_id.eq.${contactId}),and(sender_id.eq.${contactId},receiver_id.eq.${userId})`)
      .order('timestamp', { ascending: true });
    if (error) throw error;
    return data;
  } else {
    return [];
  }
}

// إرسال رسالة جديدة
export async function sendMessage({
  senderId,
  content,
  receiverId,
  groupId,
  type = 'text',
  status = 'sent'
}: {
  senderId: string;
  content: string;
  receiverId?: string;
  groupId?: string;
  type?: string;
  status?: string;
}) {
  const { data, error } = await supabase.from('messages').insert([
    {
      sender_id: senderId,
      receiver_id: receiverId || null,
      group_id: groupId || null,
      content,
      type,
      status
    }
  ]).select().single();
  if (error) throw error;
  return data;
} 