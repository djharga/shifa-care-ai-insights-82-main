import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Bed, Building, Users, Plus, Edit, Trash2, 
  CheckCircle, Clock, X, 
  Home, DollarSign, User, Calendar
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Room {
  id: string;
  room_number: string;
  room_name: string;
  room_type: 'single' | 'double' | 'triple' | 'family' | 'vip';
  floor_number: number;
  capacity: number;
  daily_rate: number;
  status: 'available' | 'occupied' | 'maintenance' | 'reserved';
  description: string | null;
  amenities: string[];
  beds: Bed[];
}

interface Bed {
  id: string;
  bed_number: string;
  bed_name: string;
  bed_type: 'single' | 'double' | 'bunk';
  status: 'available' | 'occupied' | 'maintenance' | 'reserved';
  current_patient_id: string | null;
  current_patient_name: string | null;
  notes: string | null;
}

const Rooms = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [activeTab, setActiveTab] = useState('rooms');
  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);
  const [isAddBedOpen, setIsAddBedOpen] = useState(false);
  const [isEditRoomOpen, setIsEditRoomOpen] = useState(false);
  const [isEditBedOpen, setIsEditBedOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [editingBed, setEditingBed] = useState<Bed | null>(null);
  
  // Update newRoom state to include all required Room properties
  const [newRoom, setNewRoom] = useState({
    room_number: '',
    room_name: '',
    room_type: 'single' as Room['room_type'],
    floor_number: '',
    capacity: '',
    daily_rate: '',
    status: 'available' as Room['status'],
    description: '',
    amenities: [] as string[],
  });

  const [newBed, setNewBed] = useState({
    room_id: '',
    bed_number: '',
    bed_name: '',
    bed_type: 'single' as const,
    notes: ''
  });

  const [showExtraFields, setShowExtraFields] = useState(false);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      // Mock data for demonstration
      const mockRooms: Room[] = [
        {
          id: '1',
          room_number: '101',
          room_name: 'غرفة فردية',
          room_type: 'single',
          floor_number: 1,
          capacity: 1,
          daily_rate: 500,
          status: 'available',
          description: 'غرفة فردية مريحة',
          amenities: ['تلفاز', 'مكيف', 'حمام خاص'],
          beds: [
            {
              id: '1',
              bed_number: 'B101-1',
              bed_name: 'سرير 1',
              bed_type: 'single',
              status: 'available',
              current_patient_id: null,
              current_patient_name: null,
              notes: null
            }
          ]
        },
        {
          id: '2',
          room_number: '201',
          room_name: 'غرفة مزدوجة',
          room_type: 'double',
          floor_number: 2,
          capacity: 2,
          daily_rate: 800,
          status: 'occupied',
          description: 'غرفة مزدوجة فسيحة',
          amenities: ['تلفاز', 'مكيف', 'حمام مشترك'],
          beds: [
            {
              id: '2',
              bed_number: 'B201-1',
              bed_name: 'سرير 1',
              bed_type: 'single',
              status: 'occupied',
              current_patient_id: '1',
              current_patient_name: 'أحمد محمد',
              notes: null
            },
            {
              id: '3',
              bed_number: 'B201-2',
              bed_name: 'سرير 2',
              bed_type: 'single',
              status: 'available',
              current_patient_id: null,
              current_patient_name: null,
              notes: null
            }
          ]
        }
      ];
      
      setRooms(mockRooms);
      
      // Uncomment this when database is properly set up:
      /*
      // جلب الغرف مع الأسرّة
      const { data: roomsData, error: roomsError } = await supabase
        .from('rooms')
        .select('*')
        .order('room_number');
      
      if (roomsError) throw roomsError;

      // جلب الأسرّة لكل غرفة
      const { data: bedsData, error: bedsError } = await supabase
        .from('beds')
        .select(`
          *,
          patients(name)
        `)
        .order('bed_number');
      
      if (bedsError) throw bedsError;

      // دمج البيانات
      const roomsWithBeds = roomsData?.map(room => ({
        ...room,
        amenities: room.amenities || [],
        beds: bedsData?.filter(bed => bed.room_id === room.id).map(bed => ({
          ...bed,
          current_patient_name: bed.patients?.name || null
        })) || []
      })) || [];

      setRooms(roomsWithBeds);
      */
    } catch (error: any) {
      toast({
        title: "خطأ في تحميل الغرف",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleAddRoom = async () => {
    try {
      // Mock implementation for demonstration
      // When creating a Room object from newRoom, convert number fields and remove notes if not needed
      const newRoomWithId: Room = {
        ...newRoom,
        id: Date.now().toString(),
        floor_number: parseInt(newRoom.floor_number),
        capacity: parseInt(newRoom.capacity),
        daily_rate: parseFloat(newRoom.daily_rate),
        description: newRoom.description || null,
        beds: [], // or handle as needed
      };
      
      setRooms(prev => [newRoomWithId, ...prev]);

      toast({
        title: "تم إضافة الغرفة",
        description: "تم إضافة الغرفة بنجاح",
      });

      setIsAddRoomOpen(false);
      setNewRoom({
        room_number: '',
        room_name: '',
        room_type: 'single',
        floor_number: '',
        capacity: '',
        daily_rate: '',
        status: 'available',
        description: '',
        amenities: [],
      });
      
      // Uncomment this when database is properly set up:
      /*
      const { error } = await supabase
        .from('rooms')
        .insert([{
          room_number: newRoom.room_number,
          room_name: newRoom.room_name,
          room_type: newRoom.room_type,
          floor_number: parseInt(newRoom.floor_number),
          capacity: parseInt(newRoom.capacity),
          daily_rate: parseFloat(newRoom.daily_rate),
          description: newRoom.description || null,
          amenities: newRoom.amenities
        }]);

      if (error) throw error;
      fetchRooms();
      */
    } catch (error: any) {
      toast({
        title: "خطأ في إضافة الغرفة",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleAddBed = async () => {
    try {
      // Mock implementation for demonstration
      const newBedWithId: Bed = {
        ...newBed,
        id: Date.now().toString(),
        status: 'available',
        current_patient_id: null,
        current_patient_name: null
      };
      
      setRooms(prev => prev.map(room => 
        room.id === newBed.room_id 
          ? { ...room, beds: [...room.beds, newBedWithId] }
          : room
      ));

      toast({
        title: "تم إضافة السرير",
        description: "تم إضافة السرير بنجاح",
      });

      setIsAddBedOpen(false);
      setNewBed({
        room_id: '',
        bed_number: '',
        bed_name: '',
        bed_type: 'single',
        notes: ''
      });
      
      // Uncomment this when database is properly set up:
      /*
      const { error } = await supabase
        .from('beds')
        .insert([{
          room_id: newBed.room_id,
          bed_number: newBed.bed_number,
          bed_name: newBed.bed_name,
          bed_type: newBed.bed_type,
          notes: newBed.notes || null
        }]);

      if (error) throw error;
      fetchRooms();
      */
    } catch (error: any) {
      toast({
        title: "خطأ في إضافة السرير",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEditRoom = (room: Room) => {
    setEditingRoom(room);
    setIsEditRoomOpen(true);
  };

  const handleUpdateRoom = async () => {
    if (!editingRoom) return;

    try {
      // Mock implementation for demonstration
      setRooms(prev => prev.map(room => 
        room.id === editingRoom.id ? editingRoom : room
      ));

      toast({
        title: "تم تحديث الغرفة",
        description: "تم حفظ التغييرات بنجاح",
      });

      setIsEditRoomOpen(false);
      setEditingRoom(null);
      
      // Uncomment this when database is properly set up:
      /*
      const { error } = await supabase
        .from('rooms')
        .update(editingRoom)
        .eq('id', editingRoom.id);

      if (error) throw error;
      fetchRooms();
      */
    } catch (error: any) {
      toast({
        title: "خطأ في تحديث الغرفة",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteRoom = async (roomId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الغرفة؟')) return;

    try {
      // Mock implementation for demonstration
      setRooms(prev => prev.filter(room => room.id !== roomId));

      toast({
        title: "تم حذف الغرفة",
        description: "تم حذف الغرفة بنجاح",
      });
      
      // Uncomment this when database is properly set up:
      /*
      const { error } = await supabase
        .from('rooms')
        .delete()
        .eq('id', roomId);

      if (error) throw error;
      fetchRooms();
      */
    } catch (error: any) {
      toast({
        title: "خطأ في حذف الغرفة",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEditBed = (bed: Bed) => {
    setEditingBed(bed);
    setIsEditBedOpen(true);
  };

  const handleUpdateBed = async () => {
    if (!editingBed) return;

    try {
      // Mock implementation for demonstration
      setRooms(prev => prev.map(room => ({
        ...room,
        beds: room.beds.map(bed => 
          bed.id === editingBed.id ? editingBed : bed
        )
      })));

      toast({
        title: "تم تحديث السرير",
        description: "تم حفظ التغييرات بنجاح",
      });

      setIsEditBedOpen(false);
      setEditingBed(null);
      
      // Uncomment this when database is properly set up:
      /*
      const { error } = await supabase
        .from('beds')
        .update(editingBed)
        .eq('id', editingBed.id);

      if (error) throw error;
      fetchRooms();
      */
    } catch (error: any) {
      toast({
        title: "خطأ في تحديث السرير",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteBed = async (bedId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا السرير؟')) return;

    try {
      // Mock implementation for demonstration
      setRooms(prev => prev.map(room => ({
        ...room,
        beds: room.beds.filter(bed => bed.id !== bedId)
      })));

      toast({
        title: "تم حذف السرير",
        description: "تم حذف السرير بنجاح",
      });
      
      // Uncomment this when database is properly set up:
      /*
      const { error } = await supabase
        .from('beds')
        .delete()
        .eq('id', bedId);

      if (error) throw error;
      fetchRooms();
      */
    } catch (error: any) {
      toast({
        title: "خطأ في حذف السرير",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getRoomTypeName = (type: string) => {
    const types = {
      single: 'فردية',
      double: 'مزدوجة',
      triple: 'ثلاثية',
      family: 'عائلية',
      vip: 'VIP'
    };
    return types[type as keyof typeof types] || type;
  };

  const getBedTypeName = (type: string) => {
    const types = {
      single: 'فردي',
      double: 'مزدوج',
      bunk: 'طابقية'
    };
    return types[type as keyof typeof types] || type;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      available: { label: 'متاح', variant: 'default' as const },
      occupied: { label: 'مشغول', variant: 'secondary' as const },
      maintenance: { label: 'صيانة', variant: 'destructive' as const },
      reserved: { label: 'محجوز', variant: 'outline' as const }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.available;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const calculateTotalRooms = () => rooms.length;
  const calculateTotalBeds = () => rooms.reduce((total, room) => total + room.beds.length, 0);
  const calculateAvailableBeds = () => rooms.reduce((total, room) => 
    total + room.beds.filter(bed => bed.status === 'available').length, 0
  );
  const calculateOccupiedBeds = () => rooms.reduce((total, room) => 
    total + room.beds.filter(bed => bed.status === 'occupied').length, 0
  );

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">إدارة الغرف والأسرّة</h1>
            <p className="text-muted-foreground">إدارة غرف العلاج وأسرّة المرضى</p>
          </div>
        </div>

        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <Building className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">إجمالي الغرف</p>
                  <p className="text-2xl font-bold">{calculateTotalRooms()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <Bed className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">إجمالي الأسرّة</p>
                  <p className="text-2xl font-bold">{calculateTotalBeds()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">الأسرّة المتاحة</p>
                  <p className="text-2xl font-bold">{calculateAvailableBeds()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <Users className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">الأسرّة المشغولة</p>
                  <p className="text-2xl font-bold">{calculateOccupiedBeds()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="rooms">الغرف</TabsTrigger>
              <TabsTrigger value="beds">الأسرّة</TabsTrigger>
            </TabsList>
            
            <div className="flex space-x-2 rtl:space-x-reverse">
              <Dialog open={isAddRoomOpen} onOpenChange={setIsAddRoomOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    إضافة غرفة
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>إضافة غرفة جديدة</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="room_name">اسم الغرفة <span style={{color: 'red'}}>*</span></Label>
                      <Input id="room_name" value={newRoom.room_name} onChange={e => setNewRoom({...newRoom, room_name: e.target.value})} placeholder="اسم الغرفة" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="room_number">رقم الغرفة <span style={{color: 'red'}}>*</span></Label>
                      <Input id="room_number" value={newRoom.room_number} onChange={e => setNewRoom({...newRoom, room_number: e.target.value})} placeholder="رقم الغرفة" required />
                    </div>
                    {!showExtraFields && (
                      <Button variant="outline" type="button" onClick={() => setShowExtraFields(true)}>
                        تفاصيل إضافية
                      </Button>
                    )}
                    {showExtraFields && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="status">الحالة</Label>
                          <Select value={newRoom.status} onValueChange={value => setNewRoom({...newRoom, status: value as Room['status']})}>
                            <SelectTrigger>
                              <SelectValue placeholder="الحالة (متاحة/مشغولة)" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="available">متاحة</SelectItem>
                              <SelectItem value="occupied">مشغولة</SelectItem>
                              <SelectItem value="maintenance">صيانة</SelectItem>
                              <SelectItem value="reserved">محجوزة</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </>
                    )}
                    <Button onClick={handleAddRoom} className="w-full">
                      إضافة الغرفة
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={isAddBedOpen} onOpenChange={setIsAddBedOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    إضافة سرير
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[400px]">
                  <DialogHeader>
                    <DialogTitle>إضافة سرير جديد</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="bed-room">الغرفة</Label>
                      <Select value={newBed.room_id} onValueChange={(value) => setNewBed({...newBed, room_id: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر الغرفة" />
                        </SelectTrigger>
                        <SelectContent>
                          {rooms.map((room) => (
                            <SelectItem key={room.id} value={room.id}>
                              {room.room_number} - {room.room_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="bed-number">رقم السرير</Label>
                        <Input
                          id="bed-number"
                          value={newBed.bed_number}
                          onChange={(e) => setNewBed({...newBed, bed_number: e.target.value})}
                          placeholder="مثال: B101-1"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="bed-name">اسم السرير</Label>
                        <Input
                          id="bed-name"
                          value={newBed.bed_name}
                          onChange={(e) => setNewBed({...newBed, bed_name: e.target.value})}
                          placeholder="مثال: سرير 1"
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="bed-type">نوع السرير</Label>
                      <Select value={newBed.bed_type} onValueChange={(value: any) => setNewBed({...newBed, bed_type: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر نوع السرير" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="single">فردي</SelectItem>
                          <SelectItem value="double">مزدوج</SelectItem>
                          <SelectItem value="bunk">طابقية</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="bed-notes">ملاحظات</Label>
                      <Textarea
                        id="bed-notes"
                        value={newBed.notes}
                        onChange={(e) => setNewBed({...newBed, notes: e.target.value})}
                        placeholder="أي ملاحظات إضافية"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAddBedOpen(false)}>
                      إلغاء
                    </Button>
                    <Button onClick={handleAddBed}>
                      إضافة
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* تبويب الغرف */}
          <TabsContent value="rooms" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room) => (
                <Card key={room.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{room.room_number}</CardTitle>
                      {getStatusBadge(room.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">{room.room_name}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">النوع:</span>
                        <span className="text-sm font-medium">{getRoomTypeName(room.room_type)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">الطابق:</span>
                        <span className="text-sm font-medium">{room.floor_number}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">السعة:</span>
                        <span className="text-sm font-medium">{room.capacity} شخص</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">السعر اليومي:</span>
                        <span className="text-sm font-medium">{room.daily_rate.toLocaleString()} ج.م</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">الأسرّة:</span>
                        <span className="text-sm font-medium">{room.beds.length} سرير</span>
                      </div>
                      {room.description && (
                        <div className="pt-2 border-t">
                          <p className="text-xs text-muted-foreground">{room.description}</p>
                        </div>
                      )}
                      <div className="flex space-x-2 pt-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleEditRoom(room)}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          تعديل
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleDeleteRoom(room.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          حذف
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* تبويب الأسرّة */}
          <TabsContent value="beds" className="space-y-6">
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto w-full">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>رقم السرير</TableHead>
                        <TableHead>اسم السرير</TableHead>
                        <TableHead>الغرفة</TableHead>
                        <TableHead>النوع</TableHead>
                        <TableHead>الحالة</TableHead>
                        <TableHead>المريض الحالي</TableHead>
                        <TableHead>الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rooms.flatMap(room => 
                        room.beds.map(bed => (
                          <TableRow key={bed.id}>
                            <TableCell>{bed.bed_number}</TableCell>
                            <TableCell>{bed.bed_name}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Building className="w-4 h-4" />
                                <span>{room.room_number}</span>
                              </div>
                            </TableCell>
                            <TableCell>{getBedTypeName(bed.bed_type)}</TableCell>
                            <TableCell>{getStatusBadge(bed.status)}</TableCell>
                            <TableCell>
                              {bed.current_patient_name ? (
                                <div className="flex items-center space-x-2">
                                  <User className="w-4 h-4" />
                                  <span>{bed.current_patient_name}</span>
                                </div>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleEditBed(bed)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleDeleteBed(bed.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Room Dialog */}
        <Dialog open={isEditRoomOpen} onOpenChange={setIsEditRoomOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>تعديل الغرفة</DialogTitle>
            </DialogHeader>
            {editingRoom && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-room-number">رقم الغرفة</Label>
                    <Input
                      id="edit-room-number"
                      value={editingRoom.room_number}
                      onChange={(e) => setEditingRoom({...editingRoom, room_number: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-room-name">اسم الغرفة</Label>
                    <Input
                      id="edit-room-name"
                      value={editingRoom.room_name}
                      onChange={(e) => setEditingRoom({...editingRoom, room_name: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-room-type">نوع الغرفة</Label>
                    <Select value={editingRoom.room_type} onValueChange={(value: any) => setEditingRoom({...editingRoom, room_type: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">فردية</SelectItem>
                        <SelectItem value="double">مزدوجة</SelectItem>
                        <SelectItem value="triple">ثلاثية</SelectItem>
                        <SelectItem value="family">عائلية</SelectItem>
                        <SelectItem value="vip">VIP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-floor">الطابق</Label>
                    <Input
                      id="edit-floor"
                      type="number"
                      value={editingRoom.floor_number}
                      onChange={(e) => setEditingRoom({...editingRoom, floor_number: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-capacity">السعة</Label>
                    <Input
                      id="edit-capacity"
                      type="number"
                      value={editingRoom.capacity}
                      onChange={(e) => setEditingRoom({...editingRoom, capacity: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-daily-rate">السعر اليومي (ج.م)</Label>
                  <Input
                    id="edit-daily-rate"
                    type="number"
                    value={editingRoom.daily_rate}
                    onChange={(e) => setEditingRoom({...editingRoom, daily_rate: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-status">الحالة</Label>
                  <Select value={editingRoom.status} onValueChange={(value: any) => setEditingRoom({...editingRoom, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">متاح</SelectItem>
                      <SelectItem value="occupied">مشغول</SelectItem>
                      <SelectItem value="maintenance">صيانة</SelectItem>
                      <SelectItem value="reserved">محجوز</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-description">الوصف</Label>
                  <Textarea
                    id="edit-description"
                    value={editingRoom.description || ''}
                    onChange={(e) => setEditingRoom({...editingRoom, description: e.target.value})}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsEditRoomOpen(false)}>
                    إلغاء
                  </Button>
                  <Button onClick={handleUpdateRoom}>
                    حفظ التغييرات
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Bed Dialog */}
        <Dialog open={isEditBedOpen} onOpenChange={setIsEditBedOpen}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>تعديل السرير</DialogTitle>
            </DialogHeader>
            {editingBed && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-bed-number">رقم السرير</Label>
                    <Input
                      id="edit-bed-number"
                      value={editingBed.bed_number}
                      onChange={(e) => setEditingBed({...editingBed, bed_number: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-bed-name">اسم السرير</Label>
                    <Input
                      id="edit-bed-name"
                      value={editingBed.bed_name}
                      onChange={(e) => setEditingBed({...editingBed, bed_name: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-bed-type">نوع السرير</Label>
                  <Select value={editingBed.bed_type} onValueChange={(value: any) => setEditingBed({...editingBed, bed_type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">فردي</SelectItem>
                      <SelectItem value="double">مزدوج</SelectItem>
                      <SelectItem value="bunk">طابقية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-bed-status">الحالة</Label>
                  <Select value={editingBed.status} onValueChange={(value: any) => setEditingBed({...editingBed, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">متاح</SelectItem>
                      <SelectItem value="occupied">مشغول</SelectItem>
                      <SelectItem value="maintenance">صيانة</SelectItem>
                      <SelectItem value="reserved">محجوز</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-bed-notes">ملاحظات</Label>
                  <Textarea
                    id="edit-bed-notes"
                    value={editingBed.notes || ''}
                    onChange={(e) => setEditingBed({...editingBed, notes: e.target.value})}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsEditBedOpen(false)}>
                    إلغاء
                  </Button>
                  <Button onClick={handleUpdateBed}>
                    حفظ التغييرات
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Rooms; 