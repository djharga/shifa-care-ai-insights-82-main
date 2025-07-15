// تعريف الأدوار والصلاحيات
export type Role = 'admin' | 'supervisor' | 'accountant' | 'therapist' | 'receptionist' | 'patient';

export type Permission =
  | 'view_dashboard'
  | 'manage_patients'
  | 'manage_sessions'
  | 'view_finance'
  | 'manage_rooms'
  | 'view_reports'
  | 'manage_facility'
  | 'manage_expenses';

// جدول الصلاحيات لكل دور
const rolePermissions: Record<Role, Permission[]> = {
  admin: [
    'view_dashboard',
    'manage_patients',
    'manage_sessions',
    'view_finance',
    'manage_rooms',
    'view_reports',
    'manage_facility',
    'manage_expenses',
  ],
  supervisor: [
    'view_dashboard',
    'manage_patients',
    'manage_sessions',
    'view_reports',
  ],
  accountant: [
    'view_dashboard',
    'view_finance',
    'manage_expenses',
    'manage_facility',
    'view_reports',
  ],
  therapist: [
    'manage_sessions',
    'view_reports',
  ],
  receptionist: [
    'manage_patients',
    'manage_sessions',
  ],
  patient: [
    // يمكن إضافة صلاحيات للمرضى لاحقاً
  ],
};

// دالة فحص الصلاحية
export function hasPermission(role: Role, permission: Permission): boolean {
  return rolePermissions[role]?.includes(permission) || false;
} 