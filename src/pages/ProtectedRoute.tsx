import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import supabase from '@/integrations/supabase/client';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[];
}

const ProtectedRoute = ({ children, roles }: ProtectedRouteProps) => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        // جلب بيانات المستخدم الحالي (في التطبيق الحقيقي استخدم بيانات الجلسة)
        const { data } = await supabase.from('profiles').select('role').limit(1);
        setUserRole(data?.[0]?.role || null);
      } catch (error) {
        console.error('Error fetching user role:', error);
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUserRole();
  }, []);

  if (loading) return null;
  if (roles && (!userRole || !roles.includes(userRole))) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

export default ProtectedRoute; 