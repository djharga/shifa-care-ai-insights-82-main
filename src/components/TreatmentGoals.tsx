import React, { useState } from 'react';
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
import { TreatmentGoal } from '@/types/session';

interface TreatmentGoalsProps {
  goals: TreatmentGoal[];
  onUpdateGoal: (goalId: string, updates: Partial<TreatmentGoal>) => void;
  onAddGoal: (goal: Omit<TreatmentGoal, 'id'>) => void;
  onDeleteGoal: (goalId: string) => void;
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

export default function TreatmentGoals({ 
  goals, 
  onUpdateGoal, 
  onAddGoal, 
  onDeleteGoal 
}: TreatmentGoalsProps) {
  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    target_date: '',
    priority: 'medium' as const,
    category: 'behavioral' as const
  });

  const handleSaveGoal = (goalId: string, updates: Partial<TreatmentGoal>) => {
    onUpdateGoal(goalId, updates);
    setEditingGoal(null);
  };

  const handleAddGoal = () => {
    if (newGoal.title && newGoal.description && newGoal.target_date) {
      onAddGoal({
        ...newGoal,
        progress: 0,
        status: 'pending'
      });
      setNewGoal({
        title: '',
        description: '',
        target_date: '',
        priority: 'medium',
        category: 'behavioral'
      });
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
          {goals.map((goal) => (
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
                        onClick={() => onDeleteGoal(goal.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {goals.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            لا توجد أهداف علاجية محددة
          </div>
        )}
      </CardContent>
    </Card>
  );
} 