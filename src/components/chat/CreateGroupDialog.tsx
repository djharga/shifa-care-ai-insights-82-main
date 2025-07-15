import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { 
  Users, 
  User, 
  Search, 
  Plus, 
  X 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getUsers, createGroup, ChatUser } from '@/services/internal-chat-service';

interface CreateGroupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onGroupCreated: () => void;
  currentUserId: string;
}

const CreateGroupDialog: React.FC<CreateGroupDialogProps> = ({
  isOpen,
  onClose,
  onGroupCreated,
  currentUserId
}) => {
  const { toast } = useToast();
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  const fetchUsers = async () => {
    try {
      const usersData = await getUsers();
      // استبعاد المستخدم الحالي من القائمة
      setUsers(usersData.filter(user => user.id !== currentUserId));
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "خطأ في تحميل المستخدمين",
        description: "فشل في تحميل قائمة المستخدمين",
        variant: "destructive",
      });
    }
  };

  const handleUserToggle = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى إدخال اسم المجموعة",
        variant: "destructive",
      });
      return;
    }

    if (selectedUsers.length === 0) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى اختيار عضو واحد على الأقل",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      await createGroup({
        name: groupName.trim(),
        description: groupDescription.trim(),
        createdBy: currentUserId,
        members: [...selectedUsers, currentUserId], // إضافة المنشئ للمجموعة
      });

      toast({
        title: "تم إنشاء المجموعة",
        description: "تم إنشاء المجموعة بنجاح",
      });

      // إعادة تعيين النموذج
      setGroupName('');
      setGroupDescription('');
      setSelectedUsers([]);
      setSearchQuery('');
      
      onGroupCreated();
      onClose();
    } catch (error: any) {
      console.error('Error creating group:', error);
      toast({
        title: "خطأ في إنشاء المجموعة",
        description: error.message || "فشل في إنشاء المجموعة",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setGroupName('');
      setGroupDescription('');
      setSelectedUsers([]);
      setSearchQuery('');
      onClose();
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedUsersData = users.filter(user => selectedUsers.includes(user.id));

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>إنشاء مجموعة جديدة</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* معلومات المجموعة */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="groupName">اسم المجموعة *</Label>
              <Input
                id="groupName"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="أدخل اسم المجموعة"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="groupDescription">وصف المجموعة</Label>
              <Textarea
                id="groupDescription"
                value={groupDescription}
                onChange={(e) => setGroupDescription(e.target.value)}
                placeholder="أدخل وصف المجموعة (اختياري)"
                className="mt-1"
                rows={3}
              />
            </div>
          </div>

          {/* الأعضاء المختارين */}
          {selectedUsersData.length > 0 && (
            <div>
              <Label>الأعضاء المختارون ({selectedUsersData.length})</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedUsersData.map(user => (
                  <Badge key={user.id} variant="secondary" className="flex items-center space-x-1">
                    <Avatar className="w-4 h-4">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className="text-xs">{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs">{user.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => handleUserToggle(user.id)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* البحث عن المستخدمين */}
          <div>
            <Label htmlFor="userSearch">إضافة أعضاء</Label>
            <div className="relative mt-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="userSearch"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="البحث عن المستخدمين..."
                className="pr-10"
              />
            </div>
          </div>

          {/* قائمة المستخدمين */}
          <div>
            <Label>المستخدمون المتاحون</Label>
            <ScrollArea className="h-48 mt-2 border rounded-md p-2">
              <div className="space-y-2">
                {filteredUsers.map(user => (
                  <div
                    key={user.id}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleUserToggle(user.id)}
                  >
                    <Checkbox
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleUserToggle(user.id)}
                    />
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{user.name}</div>
                      <div className="text-xs text-gray-600">{user.role}</div>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${
                      user.status === 'online' ? 'bg-green-500' :
                      user.status === 'busy' ? 'bg-yellow-500' : 'bg-gray-400'
                    }`} />
                  </div>
                ))}
                {filteredUsers.length === 0 && (
                  <div className="text-center text-gray-500 py-4">
                    لا يوجد مستخدمون متاحون
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            إلغاء
          </Button>
          <Button 
            onClick={handleCreateGroup} 
            disabled={loading || !groupName.trim() || selectedUsers.length === 0}
          >
            {loading ? 'جاري الإنشاء...' : 'إنشاء المجموعة'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupDialog; 