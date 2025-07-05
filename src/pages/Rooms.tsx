import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Bed, Building, Users, Plus, Edit, Trash2, 
  CheckCircle, AlertCircle, Clock, X, 
  Home, Floor, DollarSign, User, Calendar
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
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  
  const [newRoom, setNewRoom] = useState({
    room_number: '',
    room_name: '',
    room_type: 'single' as const,
    floor_number: '',
    capacity: '',
    daily_rate: '',
    description: '',
    amenities: [] as string[]
  });

  const [newBed, setNewBed] = useState({
    room_id: '',
    bed_number: '',
    bed_name: '',
    bed_type: 'single' as const,
    notes: ''
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
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
        description: '',
        amenities: []
      });
      fetchRooms();
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
      fetchRooms();
    } catch (error: any) {
      toast({
        title: "خطأ في إضافة السرير",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getRoomTypeName = (type: string) => {
    switch (type) {
      case 'single': return 'فردية';
      case 'double': return 'مزدوجة';
      case 'triple': return 'ثلاثية';
      case 'family': return 'عائلية';
      case 'vip': return 'VIP';
      default: return type;
    }
  };

  const getBedTypeName = (type: string) => {
    switch (type) {
      case 'single': return 'فردي';
      case 'double': return 'مزدوج';
      case 'bunk': return 'طابقية';
      default: return type;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      available: 'bg-green-100 text-green-800',
      occupied: 'bg-red-100 text-red-800',
      maintenance: 'bg-yellow-100 text-yellow-800',
      reserved: 'bg-blue-100 text-blue-800'
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800'}>
        {status === 'available' && 'متاح'}
        {status === 'occupied' && 'مشغول'}
        {status === 'maintenance' && 'صيانة'}
        {status === 'reserved' && 'محجوز'}
      </Badge>
    );
  };

  const calculateTotalRooms = () => {
    return rooms.length;
  };

  const calculateTotalBeds = () => {
    return rooms.reduce((total, room) => total + room.beds.length, 0);
  };

  const calculateAvailableBeds = () => {
    return rooms.reduce((total, room) => 
      total + room.beds.filter(bed => bed.status === 'available').length, 0);
  };

  const calculateOccupiedBeds = () => {
    return rooms.reduce((total, room) => 
      total + room.beds.filter(bed => bed.status === 'occupied').length, 0);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">إدارة الغرف والأسرّة</h1>
            <p className="text-muted-foreground">إدارة غرف وأسرّة المصحة مع حالاتها</p>
          </div>
        </div>

        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي الغرف</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{calculateTotalRooms()}</div>
              <p className="text-xs text-muted-foreground">غرفة</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي الأسرّة</CardTitle>
              <Bed className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{calculateTotalBeds()}</div>
              <p className="text-xs text-muted-foreground">سرير</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">الأسرّة المتاحة</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{calculateAvailableBeds()}</div>
              <p className="text-xs text-muted-foreground">متاح</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">الأسرّة المشغولة</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{calculateOccupiedBeds()}</div>
              <p className="text-xs text-muted-foreground">مشغول</p>
            </CardContent>
          </Card>
        </div>

        {/* التبويبات */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex justify-between items-center">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="rooms">الغرف</TabsTrigger>
              <TabsTrigger value="beds">الأسرّة</TabsTrigger>
            </TabsList>
            
            <div className="flex space-x-2">
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
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="room-number">رقم الغرفة</Label>
                        <Input
                          id="room-number"
                          value={newRoom.room_number}
                          onChange={(e) => setNewRoom({...newRoom, room_number: e.target.value})}
                          placeholder="مثال: 101"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="room-name">اسم الغرفة</Label>
                        <Input
                          id="room-name"
                          value={newRoom.room_name}
                          onChange={(e) => setNewRoom({...newRoom, room_name: e.target.value})}
                          placeholder="مثال: غرفة 101"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="room-type">نوع الغرفة</Label>
                        <Select value={newRoom.room_type} onValueChange={(value: any) => setNewRoom({...newRoom, room_type: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر نوع الغرفة" />
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
                        <Label htmlFor="floor">الطابق</Label>
                        <Input
                          id="floor"
                          type="number"
                          value={newRoom.floor_number}
                          onChange={(e) => setNewRoom({...newRoom, floor_number: e.target.value})}
                          placeholder="مثال: 1"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="capacity">السعة</Label>
                        <Input
                          id="capacity"
                          type="number"
                          value={newRoom.capacity}
                          onChange={(e) => setNewRoom({...newRoom, capacity: e.target.value})}
                          placeholder="مثال: 2"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="rate">السعر اليومي</Label>
                        <Input
                          id="rate"
                          type="number"
                          value={newRoom.daily_rate}
                          onChange={(e) => setNewRoom({...newRoom, daily_rate: e.target.value})}
                          placeholder="مثال: 500"
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">الوصف</Label>
                      <Textarea
                        id="description"
                        value={newRoom.description}
                        onChange={(e) => setNewRoom({...newRoom, description: e.target.value})}
                        placeholder="وصف الغرفة والمرافق"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAddRoomOpen(false)}>
                      إلغاء
                    </Button>
                    <Button onClick={handleAddRoom}>
                      إضافة
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
                        <Button variant="outline" size="sm" className="flex-1">
                          <Edit className="w-4 h-4 mr-1" />
                          تعديل
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
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
                              <Button variant="outline" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Rooms; 