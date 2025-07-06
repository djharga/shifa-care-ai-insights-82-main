import { supabase } from '@/integrations/supabase/client';

export interface Notification {
  id: string;
  user_id: string;
  type: 'session_reminder' | 'relapse_alert' | 'report_ready' | 'treatment_update' | 'system_alert';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  read: boolean;
  action_url?: string;
  created_at: string;
  scheduled_for?: string;
}

export interface NotificationTemplate {
  type: string;
  title_template: string;
  message_template: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export class NotificationService {
  private templates: NotificationTemplate[] = [
    {
      type: 'session_reminder',
      title_template: 'تذكير بجلسة علاج',
      message_template: 'لديك جلسة علاج غداً في الساعة {time} مع {therapist}',
      priority: 'medium'
    },
    {
      type: 'relapse_alert',
      title_template: 'تنبيه: خطر انتكاس',
      message_template: 'تم اكتشاف مؤشرات انتكاس محتملة للمريض {patient_name}. يرجى المتابعة العاجلة.',
      priority: 'urgent'
    },
    {
      type: 'report_ready',
      title_template: 'التقرير جاهز',
      message_template: 'تم إنشاء تقرير {report_type} للمريض {patient_name}',
      priority: 'low'
    },
    {
      type: 'treatment_update',
      title_template: 'تحديث خطة العلاج',
      message_template: 'تم تحديث خطة العلاج للمريض {patient_name} بناءً على التقدم المحرز',
      priority: 'medium'
    },
    {
      type: 'system_alert',
      title_template: 'تنبيه نظام',
      message_template: '{message}',
      priority: 'high'
    }
  ];

  async sendNotification(notification: Omit<Notification, 'id' | 'created_at'>): Promise<void> {
    try {
      const newNotification: Notification = {
        ...notification,
        id: Date.now().toString(),
        created_at: new Date().toISOString()
      };

      await supabase
        .from('notifications')
        .insert([newNotification]);

      // إرسال إشعار فوري إذا كان عاجلاً
      if (notification.priority === 'urgent') {
        await this.sendImmediateNotification(newNotification);
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  }

  async sendSessionReminder(sessionId: string): Promise<void> {
    try {
      // جلب بيانات الجلسة
      const { data: session } = await supabase
        .from('sessions')
        .select(`
          *,
          patients (name),
          profiles (full_name)
        `)
        .eq('id', sessionId)
        .single();

      if (!session) return;

      const template = this.templates.find(t => t.type === 'session_reminder');
      if (!template) return;

      const notification: Omit<Notification, 'id' | 'created_at'> = {
        user_id: session.therapist_id,
        type: 'session_reminder',
        title: template.title_template,
        message: template.message_template
          .replace('{time}', session.session_time)
          .replace('{therapist}', session.profiles?.full_name || 'المعالج'),
        priority: template.priority,
        read: false,
        action_url: `/sessions/${sessionId}`
      };

      await this.sendNotification(notification);
    } catch (error) {
      console.error('Error sending session reminder:', error);
    }
  }

  async sendRelapseAlert(patientId: string): Promise<void> {
    try {
      // جلب بيانات المريض
      const { data: patient } = await supabase
        .from('patients')
        .select('name, therapist_id')
        .eq('id', patientId)
        .single();

      if (!patient) return;

      const template = this.templates.find(t => t.type === 'relapse_alert');
      if (!template) return;

      const notification: Omit<Notification, 'id' | 'created_at'> = {
        user_id: patient.therapist_id,
        type: 'relapse_alert',
        title: template.title_template,
        message: template.message_template
          .replace('{patient_name}', patient.name),
        priority: template.priority,
        read: false,
        action_url: `/patients/${patientId}`
      };

      await this.sendNotification(notification);
    } catch (error) {
      console.error('Error sending relapse alert:', error);
    }
  }

  async sendTreatmentUpdate(patientId: string): Promise<void> {
    try {
      // جلب بيانات المريض
      const { data: patient } = await supabase
        .from('patients')
        .select('name, therapist_id')
        .eq('id', patientId)
        .single();

      if (!patient) return;

      const template = this.templates.find(t => t.type === 'treatment_update');
      if (!template) return;

      const notification: Omit<Notification, 'id' | 'created_at'> = {
        user_id: patient.therapist_id,
        type: 'treatment_update',
        title: template.title_template,
        message: template.message_template
          .replace('{patient_name}', patient.name),
        priority: template.priority,
        read: false,
        action_url: `/patients/${patientId}/treatment`
      };

      await this.sendNotification(notification);
    } catch (error) {
      console.error('Error sending treatment update:', error);
    }
  }

  async sendReportReady(patientId: string, reportType: string, userId: string): Promise<void> {
    try {
      // جلب بيانات المريض
      const { data: patient } = await supabase
        .from('patients')
        .select('name')
        .eq('id', patientId)
        .single();

      if (!patient) return;

      const template = this.templates.find(t => t.type === 'report_ready');
      if (!template) return;

      const notification: Omit<Notification, 'id' | 'created_at'> = {
        user_id: userId,
        type: 'report_ready',
        title: template.title_template,
        message: template.message_template
          .replace('{report_type}', reportType)
          .replace('{patient_name}', patient.name),
        priority: template.priority,
        read: false,
        action_url: `/reports/${patientId}`
      };

      await this.sendNotification(notification);
    } catch (error) {
      console.error('Error sending report ready notification:', error);
    }
  }

  async getUnreadNotifications(userId: string): Promise<Notification[]> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .eq('read', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting unread notifications:', error);
      return [];
    }
  }

  async markAsRead(notificationId: string): Promise<void> {
    try {
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }

  async markAllAsRead(userId: string): Promise<void> {
    try {
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }

  async deleteNotification(notificationId: string): Promise<void> {
    try {
      await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  }

  async scheduleNotification(notification: Omit<Notification, 'id' | 'created_at'>, scheduledFor: string): Promise<void> {
    try {
      const scheduledNotification: Notification = {
        ...notification,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        scheduled_for: scheduledFor
      };

      await supabase
        .from('scheduled_notifications')
        .insert([scheduledNotification]);
    } catch (error) {
      console.error('Error scheduling notification:', error);
      throw error;
    }
  }

  private async sendImmediateNotification(notification: Notification): Promise<void> {
    // يمكن إضافة إرسال إشعارات فورية عبر:
    // - Push Notifications
    // - Email
    // - SMS
    // - WebSocket
    
    console.log('Sending immediate notification:', notification);
    
    // مثال لإرسال Push Notification
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      try {
        const registration = await navigator.serviceWorker.ready;
        await registration.showNotification(notification.title, {
          body: notification.message,
          icon: '/icon-192.png',
          badge: '/icon-192.png',
          tag: notification.id,
          data: {
            url: notification.action_url
          }
        });
      } catch (error) {
        console.error('Error sending push notification:', error);
      }
    }
  }

  // دالة لفحص الإشعارات المجدولة وإرسالها
  async processScheduledNotifications(): Promise<void> {
    try {
      const now = new Date().toISOString();
      
      const { data: scheduledNotifications } = await supabase
        .from('scheduled_notifications')
        .select('*')
        .lte('scheduled_for', now);

      if (!scheduledNotifications) return;

      for (const scheduled of scheduledNotifications) {
        // إرسال الإشعار
        await this.sendNotification({
          user_id: scheduled.user_id,
          type: scheduled.type as any,
          title: scheduled.title,
          message: scheduled.message,
          priority: scheduled.priority as any,
          read: false,
          action_url: scheduled.action_url
        });

        // حذف الإشعار المجدول
        await supabase
          .from('scheduled_notifications')
          .delete()
          .eq('id', scheduled.id);
      }
    } catch (error) {
      console.error('Error processing scheduled notifications:', error);
    }
  }
}

export const notificationService = new NotificationService(); 