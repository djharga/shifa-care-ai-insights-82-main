import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Activity, 
  Clock, 
  Users, 
  User, 
  Home,
  Calendar,
  Star,
  Play,
  Pause,
  CheckCircle
} from 'lucide-react';
import { Activity as ActivityType } from '@/types/session';

interface CenterActivitiesProps {
  activities: ActivityType[];
  onUpdateActivity: (activityId: string, updates: Partial<ActivityType>) => void;
  onAddActivity: (activity: Omit<ActivityType, 'id'>) => void;
  onDeleteActivity: (activityId: string) => void;
}

const typeColors = {
  individual: 'bg-blue-100 text-blue-800',
  group: 'bg-green-100 text-green-800',
  family: 'bg-purple-100 text-purple-800'
};

const frequencyColors = {
  daily: 'bg-red-100 text-red-800',
  weekly: 'bg-yellow-100 text-yellow-800',
  monthly: 'bg-blue-100 text-blue-800'
};

const statusColors = {
  planned: 'bg-gray-100 text-gray-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};

const statusIcons = {
  planned: Clock,
  completed: CheckCircle,
  cancelled: Pause
};

export default function CenterActivities({ 
  activities, 
  onUpdateActivity, 
  onAddActivity, 
  onDeleteActivity 
}: CenterActivitiesProps) {
  const [editingActivity, setEditingActivity] = useState<string | null>(null);
  const [newActivity, setNewActivity] = useState({
    title: '',
    description: '',
    type: 'individual' as const,
    duration: 60,
    frequency: 'weekly' as const
  });

  const handleSaveActivity = (activityId: string, updates: Partial<ActivityType>) => {
    onUpdateActivity(activityId, updates);
    setEditingActivity(null);
  };

  const handleAddActivity = () => {
    if (newActivity.title && newActivity.description) {
      onAddActivity({
        ...newActivity,
        status: 'planned'
      });
      setNewActivity({
        title: '',
        description: '',
        type: 'individual',
        duration: 60,
        frequency: 'weekly'
      });
    }
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      individual: 'فردي',
      group: 'جماعي',
      family: 'عائلي'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getFrequencyLabel = (frequency: string) => {
    const labels = {
      daily: 'يومي',
      weekly: 'أسبوعي',
      monthly: 'شهري'
    };
    return labels[frequency as keyof typeof labels] || frequency;
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      planned: 'مخطط',
      completed: 'مكتمل',
      cancelled: 'ملغي'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'individual': return User;
      case 'group': return Users;
      case 'family': return Home;
      default: return Activity;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Activity className="h-5 w-5 text-orange-600" />
          <span>أنشطة المركز العلاجي</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* إضافة نشاط جديد */}
        <div className="p-4 border rounded-lg bg-gray-50">
          <h4 className="font-medium mb-4">إضافة نشاط جديد</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="new-activity-title">عنوان النشاط</Label>
              <Input
                id="new-activity-title"
                value={newActivity.title}
                onChange={(e) => setNewActivity({...newActivity, title: e.target.value})}
                placeholder="أدخل عنوان النشاط"
              />
            </div>
            <div>
              <Label htmlFor="new-activity-duration">المدة (دقيقة)</Label>
              <Input
                id="new-activity-duration"
                type="number"
                min="15"
                max="180"
                value={newActivity.duration}
                onChange={(e) => setNewActivity({...newActivity, duration: parseInt(e.target.value)})}
              />
            </div>
            <div>
              <Label htmlFor="new-activity-type">النوع</Label>
              <Select
                value={newActivity.type}
                onValueChange={(value: string) => setNewActivity({...newActivity, type: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">فردي</SelectItem>
                  <SelectItem value="group">جماعي</SelectItem>
                  <SelectItem value="family">عائلي</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="new-activity-frequency">التكرار</Label>
              <Select
                value={newActivity.frequency}
                onValueChange={(value: string) => setNewActivity({...newActivity, frequency: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">يومي</SelectItem>
                  <SelectItem value="weekly">أسبوعي</SelectItem>
                  <SelectItem value="monthly">شهري</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="new-activity-description">وصف النشاط</Label>
              <Input
                id="new-activity-description"
                value={newActivity.description}
                onChange={(e) => setNewActivity({...newActivity, description: e.target.value})}
                placeholder="أدخل وصف النشاط"
              />
            </div>
          </div>
          <Button 
            onClick={handleAddActivity}
            disabled={!newActivity.title || !newActivity.description}
            className="mt-4"
          >
            إضافة النشاط
          </Button>
        </div>

        {/* قائمة الأنشطة */}
        <div className="space-y-4">
          {activities.map((activity) => {
            const TypeIcon = getTypeIcon(activity.type);
            const StatusIcon = statusIcons[activity.status];
            
            return (
              <div key={activity.id} className="p-4 border rounded-lg">
                {editingActivity === activity.id ? (
                  // وضع التحرير
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>العنوان</Label>
                        <Input
                          value={activity.title}
                          onChange={(e) => handleSaveActivity(activity.id, { title: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>المدة (دقيقة)</Label>
                        <Input
                          type="number"
                          min="15"
                          max="180"
                          value={activity.duration}
                          onChange={(e) => handleSaveActivity(activity.id, { duration: parseInt(e.target.value) })}
                        />
                      </div>
                      <div>
                        <Label>النوع</Label>
                        <Select
                          value={activity.type}
                          onValueChange={(value: string) => handleSaveActivity(activity.id, { type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="individual">فردي</SelectItem>
                            <SelectItem value="group">جماعي</SelectItem>
                            <SelectItem value="family">عائلي</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>الحالة</Label>
                        <Select
                          value={activity.status}
                          onValueChange={(value: string) => handleSaveActivity(activity.id, { status: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="planned">مخطط</SelectItem>
                            <SelectItem value="completed">مكتمل</SelectItem>
                            <SelectItem value="cancelled">ملغي</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>التكرار</Label>
                        <Select
                          value={activity.frequency}
                          onValueChange={(value: string) => handleSaveActivity(activity.id, { frequency: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">يومي</SelectItem>
                            <SelectItem value="weekly">أسبوعي</SelectItem>
                            <SelectItem value="monthly">شهري</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>تقييم الفعالية (1-10)</Label>
                        <Input
                          type="number"
                          min="1"
                          max="10"
                          value={activity.effectiveness_rating || ''}
                          onChange={(e) => handleSaveActivity(activity.id, { 
                            effectiveness_rating: e.target.value ? parseInt(e.target.value) : undefined 
                          })}
                        />
                      </div>
                    </div>
                    <div>
                      <Label>الوصف</Label>
                      <Input
                        value={activity.description}
                        onChange={(e) => handleSaveActivity(activity.id, { description: e.target.value })}
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" onClick={() => setEditingActivity(null)}>
                        <CheckCircle className="h-4 w-4 mr-1" />
                        حفظ
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingActivity(null)}>
                        <Pause className="h-4 w-4 mr-1" />
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
                          <TypeIcon className="h-5 w-5 text-blue-600" />
                          <h4 className="font-medium">{activity.title}</h4>
                          <Badge 
                            variant="outline" 
                            className={`${typeColors[activity.type]}`}
                          >
                            {getTypeLabel(activity.type)}
                          </Badge>
                          <Badge 
                            variant="outline" 
                            className={`${frequencyColors[activity.frequency]}`}
                          >
                            {getFrequencyLabel(activity.frequency)}
                          </Badge>
                          <Badge 
                            variant="outline" 
                            className={`${statusColors[activity.status]}`}
                          >
                            {getStatusLabel(activity.status)}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3">{activity.description}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{activity.duration} دقيقة</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{getFrequencyLabel(activity.frequency)}</span>
                          </div>
                          {activity.effectiveness_rating && (
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 text-yellow-500" />
                              <span>{activity.effectiveness_rating}/10</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-1">
                            <StatusIcon className="h-4 w-4" />
                            <span>{getStatusLabel(activity.status)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setEditingActivity(activity.id)}
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => onDeleteActivity(activity.id)}
                        >
                          <Pause className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {activities.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            لا توجد أنشطة محددة
          </div>
        )}
      </CardContent>
    </Card>
  );
} 