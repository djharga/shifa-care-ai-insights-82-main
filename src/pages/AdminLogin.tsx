import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      // تحقق من الدور
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user?.id)
        .single();
      
      if (!profile) {
        setError('لم يتم العثور على بيانات المستخدم');
        setLoading(false);
        return;
      }
      
      // توجيه حسب الدور
      if (profile.role === 'admin') {
        navigate('/admin'); // المدير يذهب للوحة التحكم
      } else if (profile.role === 'accountant') {
        navigate('/finance'); // المحاسب يذهب للحسابات المالية
      } else if (profile.role === 'supervisor') {
        navigate('/admin'); // المشرف يذهب للوحة التحكم
      } else {
        setError('ليس لديك صلاحية الدخول للوحة التحكم');
        setLoading(false);
        return;
      }
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <form onSubmit={handleLogin} className="bg-card p-8 rounded-lg shadow-md w-full max-w-md border">
        <h2 className="text-2xl font-bold mb-6 text-center">تسجيل دخول المدير</h2>
        {email === 'djharga@gmail.com' && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800 text-center">
              مرحباً بك في نظام شفا كير - المدير الرئيسي
            </p>
          </div>
        )}
        <div className="mb-4">
          <Label htmlFor="email">البريد الإلكتروني</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoFocus
          />
        </div>
        <div className="mb-6">
          <Label htmlFor="password">كلمة المرور</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="mb-4 text-red-600 text-sm text-center">{error}</div>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'جاري الدخول...' : 'دخول'}
        </Button>
      </form>
    </div>
  );
};

export default AdminLogin; 