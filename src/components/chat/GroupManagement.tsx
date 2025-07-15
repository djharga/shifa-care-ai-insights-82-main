import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { 
  Users, 
  UserPlus, 
  UserMinus, 
  Crown, 
  Settings, 
  Edit, 
  Trash2,
  Search,
  MoreVertical,
  Shield,
  MessageSquare,
  Calendar,
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  getGroups, 
  getGroupMembers, 
  addGroupMember, 
  removeGroupMember,
  ChatGroup,
  GroupMember,
  ChatUser
} from '@/services/internal-chat-service';

interface GroupManagementProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserId: string;
  onGroupUpdated: () => void;
}

const GroupManagement: React.FC<GroupManagementProps> = ({
  isOpen,
  onClose,
  currentUserId,
  onGroupUpdated
}) => {
  const { toast } = useToast();
  const [groups, setGroups] = useState<ChatGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<ChatGroup | null>(null);
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);
  const [allUsers, setAllUsers] = useState<ChatUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchGroups();
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedGroup) {
      fetchGroupMembers(selectedGroup.id);
    }
  }, [selectedGroup]);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const groupsData = await getGroups();
      setGroups(groupsData);
    } catch (error) {
      console.error('Error fetching groups:', error);
      toast({
        title: "خطأ في تحميل المجموعات",
        description: "فشل في تحميل قائمة المجموعات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchGroupMembers = async (groupId: string) => {
    try {
      const membersData = await getGroupMembers(groupId);
      setGroupMembers(membersData);
    } catch (error) {
      console.error('Error fetching group members:', error);
      toast({
        title: "خطأ في تحميل أعضاء المجموعة",
        description: "فشل في تحميل قائمة الأعضاء",
        variant: "destructive",
      });
    }
  };

  const handleGroupSelect = (group: ChatGroup) => {
    setSelectedGroup(group);
  };

  const handleAddMember = async (userId: string) => {
    if (!selectedGroup) return;

    try {
      await addGroupMember(selectedGroup.id, userId);
      await fetchGroupMembers(selectedGroup.id);
      toast({
        title: "تم إضافة العضو",
        description: "تم إضافة العضو للمجموعة بنجاح",
      });
      onGroupUpdated();
    } catch (error: any) {
      console.error('Error adding member:', error);
      toast({
        title: "خطأ في إضافة العضو",
        description: error.message || "فشل في إضافة العضو للمجموعة",
        variant: "destructive",
      });
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!selectedGroup) return;

    try {
      await removeGroupMember(selectedGroup.id, userId);
      await fetchGroupMembers(selectedGroup.id);
      toast({
        title: "تم إزالة العضو",
        description: "تم إزالة العضو من المجموعة بنجاح",
      });
      onGroupUpdated();
    } catch (error: any) {
      console.error('Error removing member:', error);
      toast({
        title: "خطأ في إزالة العضو",
        description: error.message || "فشل في إزالة العضو من المجموعة",
        variant: "destructive",
      });
    }
  };

  const handleDeleteGroup = async () => {
    if (!selectedGroup) return;

    if (!confirm('هل أنت متأكد من حذف هذه المجموعة؟')) return;

    try {
      // حذف المجموعة (يحتاج تنفيذ في الخدمة)
      toast({
        title: "تم حذف المجموعة",
        description: "تم حذف المجموعة بنجاح",
      });
      setSelectedGroup(null);
      await fetchGroups();
      onGroupUpdated();
    } catch (error: any) {
      console.error('Error deleting group:', error);
      toast({
        title: "خطأ في حذف المجموعة",
        description: error.message || "فشل في حذف المجموعة",
        variant: "destructive",
      });
    }
  };

  const getMemberRole = (member: GroupMember) => {
    return member.role === 'admin' ? 'مدير' : 'عضو';
  };

  const isCurrentUserAdmin = () => {
    if (!selectedGroup || !currentUserId) return false;
    const currentMember = groupMembers.find(m => m.user_id === currentUserId);
    return currentMember?.role === 'admin';
  };

  const canManageMember = (member: GroupMember) => {
    if (!isCurrentUserAdmin()) return false;
    if (member.user_id === currentUserId) return false; // لا يمكن إزالة نفسه
    return true;
  };

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const availableUsers = allUsers.filter(user => 
    !groupMembers.some(member => member.user_id === user.id)
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>إدارة المجموعات</span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex h-[600px]">
          {/* قائمة المجموعات */}
          <div className="w-1/3 border-l p-4">
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="البحث في المجموعات..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>

            <ScrollArea className="h-[500px]">
              {loading ? (
                <div className="text-center text-gray-500 py-8">
                  جاري تحميل المجموعات...
                </div>
              ) : filteredGroups.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>لا توجد مجموعات</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredGroups.map((group) => (
                    <div
                      key={group.id}
                      className={`p-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedGroup?.id === group.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                      }`}
                      onClick={() => handleGroupSelect(group)}
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={group.avatar} />
                          <AvatarFallback>{group.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-medium text-sm">{group.name}</h3>
                          {group.description && (
                            <p className="text-xs text-gray-600 truncate">{group.description}</p>
                          )}
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {groupMembers.length} عضو
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>

          {/* تفاصيل المجموعة */}
          <div className="flex-1 p-4">
            {selectedGroup ? (
              <div className="space-y-6">
                {/* معلومات المجموعة */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={selectedGroup.avatar} />
                        <AvatarFallback>{selectedGroup.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="text-lg font-semibold">{selectedGroup.name}</h2>
                        {selectedGroup.description && (
                          <p className="text-gray-600">{selectedGroup.description}</p>
                        )}
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="secondary">
                            {groupMembers.length} عضو
                          </Badge>
                          <Badge variant="outline">
                            تم إنشاؤها في {new Date(selectedGroup.created_at).toLocaleDateString('ar-EG')}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      {isCurrentUserAdmin() && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={handleDeleteGroup}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* أعضاء المجموعة */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">أعضاء المجموعة</h3>
                    {isCurrentUserAdmin() && (
                      <Button 
                        size="sm" 
                        onClick={() => setShowAddMember(true)}
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        إضافة عضو
                      </Button>
                    )}
                  </div>

                  <ScrollArea className="h-64">
                    <div className="space-y-2">
                      {groupMembers.map((member) => (
                        <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="text-xs">
                                {member.user_id.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-sm">{member.user_id}</div>
                              <div className="flex items-center space-x-2">
                                <Badge 
                                  variant={member.role === 'admin' ? 'default' : 'secondary'}
                                  className="text-xs"
                                >
                                  {member.role === 'admin' && <Crown className="w-3 h-3 mr-1" />}
                                  {getMemberRole(member)}
                                </Badge>
                                <span className="text-xs text-gray-500">
                                  انضم في {new Date(member.joined_at).toLocaleDateString('ar-EG')}
                                </span>
                              </div>
                            </div>
                          </div>
                          {canManageMember(member) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveMember(member.user_id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <UserMinus className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                {/* إحصائيات المجموعة */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <MessageSquare className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                    <div className="text-2xl font-bold text-blue-600">
                      {groupMembers.length}
                    </div>
                    <div className="text-sm text-blue-600">عضو</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <Users className="w-6 h-6 mx-auto mb-2 text-green-600" />
                    <div className="text-2xl font-bold text-green-600">
                      {groupMembers.filter(m => m.role === 'admin').length}
                    </div>
                    <div className="text-sm text-green-600">مدير</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <Calendar className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                    <div className="text-2xl font-bold text-purple-600">
                      {Math.floor((Date.now() - new Date(selectedGroup.created_at).getTime()) / (1000 * 60 * 60 * 24))}
                    </div>
                    <div className="text-sm text-purple-600">يوم</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-500">
                  <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">اختر مجموعة</h3>
                  <p>اختر مجموعة من القائمة لعرض تفاصيلها</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            إغلاق
          </Button>
        </DialogFooter>
      </DialogContent>

      {/* حوار إضافة عضو */}
      <Dialog open={showAddMember} onOpenChange={setShowAddMember}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>إضافة عضو جديد</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>اختر المستخدم</Label>
              <ScrollArea className="h-48 mt-2 border rounded-md p-2">
                <div className="space-y-2">
                  {availableUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        handleAddMember(user.id);
                        setShowAddMember(false);
                      }}
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-sm">{user.name}</div>
                        <div className="text-xs text-gray-600">{user.role}</div>
                      </div>
                    </div>
                  ))}
                  {availableUsers.length === 0 && (
                    <div className="text-center text-gray-500 py-4">
                      لا يوجد مستخدمون متاحون
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddMember(false)}>
              إلغاء
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
};

export default GroupManagement; 