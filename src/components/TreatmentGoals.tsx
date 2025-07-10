import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Target, 
  Calendar, 
  TrendingUp, 
  Edit, 
  Save, 
  X,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface TreatmentGoal {
  id: string;
  patient_id: string;
  title: string;
  description: string;
  target_date: string;
  priority: 'high' | 'medium' | 'low';
  category: 'behavioral' | 'emotional' | 'social' | 'physical' | 'spiritual';
  progress: number;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  created_at?: string;
  updated_at?: string;
}

interface TreatmentGoalsProps {
  patientId?: string;
}

const priorityColors = {
  high: 'bg-red-100 text-red-800 border-red-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  low: 'bg-green-100 text-green-800 border-green-200'
};

const categoryColors = {
  behavioral: 'bg-blue-100 text-blue-800',
  emotional: 'bg-purple-100 text-purple-800',
  social: 'bg-green-100 text-green-800',
  physical: 'bg-orange-100 text-orange-800',
  spiritual: 'bg-indigo-100 text-indigo-800'
};

const statusIcons = {
  pending: Clock,
  in_progress: TrendingUp,
  completed: CheckCircle,
  failed: AlertTriangle
};

export default function TreatmentGoals({ patientId }: TreatmentGoalsProps) {
  const { toast } = useToast();
  const [goals, setGoals] = useState<TreatmentGoal[]>([]);
  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    target_date: '',
    priority: 'medium' as const,
    category: 'behavioral' as const
  });

  useEffect(() => {
    if (patientId) {
      fetchGoals();
    }
  }, [patientId]);

  const fetchGoals = async () => {
    if (!patientId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('treatment_goals')
        .select('*')
        .eq('patient_id', patientId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGoals(data || []);
    } catch (error: any) {
      console.error('Error fetching goals:', error);
      toast({
        title: "خطأ في تحميل الأهداف",
        description: error.message || "حدث خطأ أثناء تحميل الأهداف العلاجية",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGoal = async (goalId: string, updates: Partial<TreatmentGoal>) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('treatment_goals')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', goalId);

      if (error) throw error;

      setGoals(prev => prev.map(goal => 
        goal.id === goalId ? { ...goal, ...updates, updated_at: new Date().toISOString() } : goal
      ));

      toast({
        title: "تم تحديث الهدف",
        description: "تم حفظ التغييرات بنجاح",
      });

      setEditingGoal(null);
    } catch (error: any) {
      console.error('Error updating goal:', error);
      toast({
        title: "خطأ في تحديث الهدف",
        description: error.message || "حدث خطأ أثناء تحديث الهدف",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddGoal = async () => {
    if (!patientId) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى تحديد المريض أولاً",
        variant: "destructive",
      });
      return;
    }

    if (!newGoal.title || !newGoal.description || !newGoal.target_date) {
      toast({
        title: "بيانات مطلوبة",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const goalData = {
        patient_id: patientId,
        ...newGoal,
        progress: 0,
        status: 'pending' as const
      };

      const { data, error } = await supabase
        .from('treatment_goals')
        .insert([goalData])
        .select()
        .single();

      if (error) throw error;

      setGoals(prev => [data, ...prev]);
      toast({
        title: "تم إضافة الهدف",
        description: "تم إضافة الهدف العلاجي بنجاح",
      });

      setNewGoal({
        title: '',
        description: '',
        target_date: '',
        priority: 'medium',
        category: 'behavioral'
      });
    } catch (error: any) {
      console.error('Error adding goal:', error);
      toast({
        title: "خطأ في إضافة الهدف",
        description: error.message || "حدث خطأ أثناء إضافة الهدف",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الهدف؟')) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('treatment_goals')
        .delete()
        .eq('id', goalId);

      if (error) throw error;

      setGoals(prev => prev.filter(goal => goal.id !== goalId));
      toast({
        title: "تم حذف الهدف",
        description: "تم حذف الهدف العلاجي بنجاح",
      });
    } catch (error: any) {
      console.error('Error deleting goal:', error);
      toast({
        title: "خطأ في حذف الهدف",
        description: error.message || "حدث خطأ أثناء حذف الهدف",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'in_progress': return 'text-blue-600';
      case 'failed': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      behavioral: 'سلوكي',
      emotional: 'عاطفي',
      social: 'اجتماعي',
      physical: 'جسدي',
      spiritual: 'روحي'
    };
    return labels[category as keyof typeof labels] || category;
  };

  const getPriorityLabel = (priority: string) => {
    const labels = {
      high: 'عالية',
      medium: 'متوسطة',
      low: 'منخفضة'
    };
    return labels[priority as keyof typeof labels] || priority;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Target className="h-5 w-5 text-purple-600" />
          <span>الأهداف العلاجية</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* إضافة هدف جديد */}
        <div className="p-4 border rounded-lg bg-gray-50">
          <h4 className="font-medium mb-4">إضافة هدف جديد</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="new-title">عنوان الهدف</Label>
              <Input
                id="new-title"
                value={newGoal.title}
                onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                placeholder="أدخل عنوان الهدف"
              />
            </div>
            <div>
              <Label htmlFor="new-date">تاريخ الهدف</Label>
              <Input
                id="new-date"
                type="date"
                value={newGoal.target_date}
                onChange={(e) => setNewGoal({...newGoal, target_date: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="new-priority">الأولوية</Label>
              <Select
                value={newGoal.priority}
                onValueChange={(value: any) => setNewGoal({...newGoal, priority: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">منخفضة</SelectItem>
                  <SelectItem value="medium">متوسطة</SelectItem>
                  <SelectItem value="high">عالية</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="new-category">الفئة</Label>
              <Select
                value={newGoal.category}
                onValueChange={(value: any) => setNewGoal({...newGoal, category: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="behavioral">سلوكي</SelectItem>
                  <SelectItem value="emotional">عاطفي</SelectItem>
                  <SelectItem value="social">اجتماعي</SelectItem>
                  <SelectItem value="physical">جسدي</SelectItem>
                  <SelectItem value="spiritual">روحي</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="new-description">وصف الهدف</Label>
              <Input
                id="new-description"
                value={newGoal.description}
                onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                placeholder="أدخل وصف الهدف"
              />
            </div>
          </div>
          <Button 
            onClick={handleAddGoal}
            disabled={!newGoal.title || !newGoal.description || !newGoal.target_date}
            className="mt-4"
          >
            إضافة الهدف
          </Button>
        </div>

        {/* قائمة الأهداف */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8 text-gray-500">
              جاري التحميل...
            </div>
          ) : goals.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              لا توجد أهداف علاجية محددة
            </div>
          ) : (
            goals.map((goal) => (
              <div key={goal.id} className="p-4 border rounded-lg">
                {editingGoal === goal.id ? (
                  // وضع التحرير
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>العنوان</Label>
                        <Input
                          value={goal.title}
                          onChange={(e) => handleSaveGoal(goal.id, { title: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>التقدم (%)</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={goal.progress}
                          onChange={(e) => handleSaveGoal(goal.id, { progress: parseInt(e.target.value) })}
                        />
                      </div>
                      <div>
                        <Label>الحالة</Label>
                        <Select
                          value={goal.status}
                          onValueChange={(value: any) => handleSaveGoal(goal.id, { status: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">في الانتظار</SelectItem>
                            <SelectItem value="in_progress">قيد التنفيذ</SelectItem>
                            <SelectItem value="completed">مكتمل</SelectItem>
                            <SelectItem value="failed">فشل</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>الأولوية</Label>
                        <Select
                          value={goal.priority}
                          onValueChange={(value: any) => handleSaveGoal(goal.id, { priority: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">منخفضة</SelectItem>
                            <SelectItem value="medium">متوسطة</SelectItem>
                            <SelectItem value="high">عالية</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label>الوصف</Label>
                      <Input
                        value={goal.description}
                        onChange={(e) => handleSaveGoal(goal.id, { description: e.target.value })}
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" onClick={() => setEditingGoal(null)}>
                        <Save className="h-4 w-4 mr-1" />
                        حفظ
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingGoal(null)}>
                        <X className="h-4 w-4 mr-1" />
                        إلغاء
                      </Button>
                    </div>
                  </div>
                ) : (
                  // وضع العرض
                  <div>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium">{goal.title}</h4>
                          <Badge 
                            variant="outline" 
                            className={`${priorityColors[goal.priority]}`}
                          >
                            {getPriorityLabel(goal.priority)}
                          </Badge>
                          <Badge 
                            variant="outline" 
                            className={`${categoryColors[goal.category]}`}
                          >
                            {getCategoryLabel(goal.category)}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{goal.description}</p>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">التقدم:</span>
                            <span className="text-sm font-medium">{goal.progress}%</span>
                          </div>
                          <Progress value={goal.progress} className="h-2" />
                        </div>

                        <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>الهدف: {new Date(goal.target_date).toLocaleDateString('ar-EG')}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            {React.createElement(statusIcons[goal.status], { 
                              className: `h-4 w-4 ${getStatusColor(goal.status)}` 
                            })}
                            <span className={getStatusColor(goal.status)}>
                              {goal.status === 'pending' && 'في الانتظار'}
                              {goal.status === 'in_progress' && 'قيد التنفيذ'}
                              {goal.status === 'completed' && 'مكتمل'}
                              {goal.status === 'failed' && 'فشل'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setEditingGoal(goal.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDeleteGoal(goal.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
} 