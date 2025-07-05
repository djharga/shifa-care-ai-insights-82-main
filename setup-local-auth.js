// نظام مصادقة محلي - شفا كير
// حل بديل في حالة مشاكل الاتصال بـ Supabase

class LocalAuth {
  constructor() {
    this.users = this.loadUsers();
    this.currentUser = this.loadCurrentUser();
  }

  // تحميل المستخدمين من localStorage
  loadUsers() {
    const users = localStorage.getItem('shifa_users');
    if (users) {
      return JSON.parse(users);
    }
    
    // إنشاء مستخدم افتراضي إذا لم يكن هناك مستخدمين
    const defaultUsers = [
      {
        id: '1',
        email: 'admin@shifacare.com',
        password: 'admin123',
        full_name: 'مدير النظام',
        role: 'admin',
        permissions: {
          manage_users: true,
          manage_patients: true,
          manage_sessions: true,
          view_reports: true,
          manage_settings: true,
          manage_finances: true,
          manage_facility: true,
          manage_rooms: true
        },
        is_active: true,
        created_at: new Date().toISOString()
      },
      {
        id: '2',
        email: 'test@shifacare.com',
        password: 'test123456',
        full_name: 'مستخدم تجريبي',
        role: 'admin',
        permissions: {
          manage_users: true,
          manage_patients: true,
          manage_sessions: true,
          view_reports: true,
          manage_settings: true,
          manage_finances: true,
          manage_facility: true,
          manage_rooms: true
        },
        is_active: true,
        created_at: new Date().toISOString()
      }
    ];
    
    localStorage.setItem('shifa_users', JSON.stringify(defaultUsers));
    return defaultUsers;
  }

  // تحميل المستخدم الحالي
  loadCurrentUser() {
    const user = localStorage.getItem('shifa_current_user');
    return user ? JSON.parse(user) : null;
  }

  // حفظ المستخدم الحالي
  saveCurrentUser(user) {
    if (user) {
      localStorage.setItem('shifa_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('shifa_current_user');
    }
    this.currentUser = user;
  }

  // تسجيل الدخول
  async signIn(email, password) {
    const user = this.users.find(u => 
      u.email === email && u.password === password && u.is_active
    );

    if (user) {
      // حذف كلمة المرور من البيانات المحفوظة
      const { password: _, ...userWithoutPassword } = user;
      this.saveCurrentUser(userWithoutPassword);
      
      return {
        data: { user: userWithoutPassword },
        error: null
      };
    } else {
      return {
        data: { user: null },
        error: { message: 'بيانات الدخول غير صحيحة' }
      };
    }
  }

  // إنشاء حساب جديد
  async signUp(email, password, userData = {}) {
    // التحقق من عدم وجود المستخدم
    const existingUser = this.users.find(u => u.email === email);
    if (existingUser) {
      return {
        data: { user: null },
        error: { message: 'المستخدم موجود بالفعل' }
      };
    }

    // إنشاء مستخدم جديد
    const newUser = {
      id: Date.now().toString(),
      email,
      password,
      full_name: userData.full_name || 'مستخدم جديد',
      role: userData.role || 'therapist',
      permissions: userData.permissions || {},
      is_active: true,
      created_at: new Date().toISOString()
    };

    this.users.push(newUser);
    localStorage.setItem('shifa_users', JSON.stringify(this.users));

    // تسجيل الدخول تلقائياً
    const { password: _, ...userWithoutPassword } = newUser;
    this.saveCurrentUser(userWithoutPassword);

    return {
      data: { user: userWithoutPassword },
      error: null
    };
  }

  // تسجيل الخروج
  async signOut() {
    this.saveCurrentUser(null);
    return { error: null };
  }

  // الحصول على الجلسة الحالية
  async getSession() {
    return {
      data: {
        session: this.currentUser ? {
          user: this.currentUser,
          access_token: 'local_token',
          refresh_token: 'local_refresh_token'
        } : null
      }
    };
  }

  // مراقبة تغييرات المصادقة
  onAuthStateChange(callback) {
    // محاكاة مراقبة التغييرات
    const checkAuth = () => {
      const currentUser = this.loadCurrentUser();
      callback('SIGNED_IN', { user: currentUser });
    };

    // فحص كل ثانية
    const interval = setInterval(checkAuth, 1000);

    // إرجاع دالة لإلغاء المراقبة
    return {
      data: {
        subscription: {
          unsubscribe: () => clearInterval(interval)
        }
      }
    };
  }

  // الحصول على جميع المستخدمين (للوحة التحكم)
  async getUsers() {
    return this.users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }

  // تحديث مستخدم
  async updateUser(userId, updates) {
    const userIndex = this.users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      this.users[userIndex] = { ...this.users[userIndex], ...updates };
      localStorage.setItem('shifa_users', JSON.stringify(this.users));
      return { data: this.users[userIndex], error: null };
    }
    return { data: null, error: { message: 'المستخدم غير موجود' } };
  }

  // حذف مستخدم
  async deleteUser(userId) {
    const userIndex = this.users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      this.users.splice(userIndex, 1);
      localStorage.setItem('shifa_users', JSON.stringify(this.users));
      return { error: null };
    }
    return { error: { message: 'المستخدم غير موجود' } };
  }
}

// إنشاء نسخة عامة
const localAuth = new LocalAuth();

// تصدير للاستخدام
export { localAuth };

// بيانات الدخول الافتراضية
console.log('🔐 نظام المصادقة المحلي جاهز!');
console.log('📧 بيانات الدخول الافتراضية:');
console.log('   - admin@shifacare.com / admin123');
console.log('   - test@shifacare.com / test123456'); 