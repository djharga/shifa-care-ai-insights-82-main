import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Building, 
  Users, 
  Plus, 
  Edit, 
  Trash2,
  CheckCircle,
  AlertCircle,
  Bed,
  Home
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

const Rooms = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [pageLoaded, setPageLoaded] = useState(false);
  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);
  const [isEditRoomsOpen, setIsEditRoomsOpen] = useState(false);
  const [isManageBookingsOpen, setIsManageBookingsOpen] = useState(false);

  // بيانات وهمية للغرف
  const rooms = [
    { id: 1, number: '101', type: 'عادي', status: 'متاحة', beds: 2, occupiedBeds: 0, price: 500 },
    { id: 2, number: '102', type: 'عادي', status: 'مشغولة', beds: 2, occupiedBeds: 2, price: 500 },
    { id: 3, number: '103', type: 'VIP', status: 'متاحة', beds: 1, occupiedBeds: 0, price: 1000 },
    { id: 4, number: '201', type: 'عادي', status: 'صيانة', beds: 2, occupiedBeds: 0, price: 500 },
    { id: 5, number: '202', type: 'VIP', status: 'مشغولة', beds: 1, occupiedBeds: 1, price: 1000 },
    { id: 6, number: '203', type: 'عادي', status: 'متاحة', beds: 2, occupiedBeds: 0, price: 500 },
  ];

  const stats = {
    totalRooms: rooms.length,
    availableRooms: rooms.filter(r => r.status === 'متاحة').length,
    occupiedRooms: rooms.filter(r => r.status === 'مشغولة').length,
    maintenanceRooms: rooms.filter(r => r.status === 'صيانة').length,
    totalBeds: rooms.reduce((sum, room) => sum + room.beds, 0),
    occupiedBeds: rooms.reduce((sum, room) => sum + room.occupiedBeds, 0),
  };

  // اختبار تحميل الصفحة
  useEffect(() => {
    console.log('Rooms component loaded successfully');
    setPageLoaded(true);
    toast({
      title: "تم تحميل صفحة إدارة الغرف",
      description: "الصفحة تعمل بشكل صحيح",
    });
  }, [toast]);

  const handleBackToHome = () => {
    navigate('/');
  };

  // وظائف الأزرار
  const handleAddRoom = () => {
    setIsAddRoomOpen(true);
    toast({
      title: "إضافة غرفة جديدة",
      description: "سيتم فتح نموذج إضافة الغرفة",
    });
  };

  const handleEditRooms = () => {
    setIsEditRoomsOpen(true);
    toast({
      title: "تعديل الغرف",
      description: "سيتم فتح قائمة الغرف للتعديل",
    });
  };

  const handleManageBookings = () => {
    setIsManageBookingsOpen(true);
    toast({
      title: "إدارة الحجوزات",
      description: "سيتم فتح صفحة إدارة الحجوزات",
    });
  };

  const handleEditRoom = (roomId: number) => {
    toast({
      title: "تعديل الغرفة",
      description: `سيتم فتح نموذج تعديل الغرفة رقم ${roomId}`,
    });
  };

  const handleViewRoomDetails = (roomId: number) => {
    toast({
      title: "تفاصيل الغرفة",
      description: `سيتم فتح تفاصيل الغرفة رقم ${roomId}`,
    });
  };

  const handleDownloadReport = () => {
    toast({
      title: "تحميل التقرير",
      description: "جاري تحميل تقرير الغرف...",
    });
    
    setTimeout(() => {
      toast({
        title: "تم التحميل",
        description: "تم تحميل تقرير الغرف بنجاح",
      });
    }, 2000);
  };

  const handleCreateReport = () => {
    toast({
      title: "إنشاء التقرير",
      description: "جاري إنشاء تقرير الغرف...",
    });
    
    setTimeout(() => {
      toast({
        title: "تم الإنشاء",
        description: "تم إنشاء تقرير الغرف بنجاح",
      });
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Building className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">إدارة الغرف والأسرّة</h1>
                <p className="text-muted-foreground">إدارة شاملة لجميع غرف وأسرّة المصحة</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {pageLoaded && (
                <Badge variant="secondary" className="bg-green-500">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  محملة
                </Badge>
              )}
              <Button variant="outline" onClick={handleBackToHome}>
                العودة للرئيسية
              </Button>
            </div>
          </div>

          {/* إحصائيات سريعة */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
            <Card className="text-center">
              <CardContent className="p-4">
                <Building className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold text-blue-600">{stats.totalRooms}</div>
                <div className="text-sm text-gray-600">إجمالي الغرف</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <CheckCircle className="h-6 w-6 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold text-green-600">{stats.availableRooms}</div>
                <div className="text-sm text-gray-600">غرف متاحة</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <Users className="h-6 w-6 mx-auto mb-2 text-red-600" />
                <div className="text-2xl font-bold text-red-600">{stats.occupiedRooms}</div>
                <div className="text-sm text-gray-600">غرف مشغولة</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <AlertCircle className="h-6 w-6 mx-auto mb-2 text-yellow-600" />
                <div className="text-2xl font-bold text-yellow-600">{stats.maintenanceRooms}</div>
                <div className="text-sm text-gray-600">غرف صيانة</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <Bed className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                <div className="text-2xl font-bold text-purple-600">{stats.totalBeds}</div>
                <div className="text-sm text-gray-600">إجمالي الأسرّة</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <Users className="h-6 w-6 mx-auto mb-2 text-indigo-600" />
                <div className="text-2xl font-bold text-indigo-600">{stats.occupiedBeds}</div>
                <div className="text-sm text-gray-600">أسرّة مشغولة</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* التبويبات الرئيسية */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
            <TabsTrigger value="rooms">قائمة الغرف</TabsTrigger>
            <TabsTrigger value="management">إدارة الغرف</TabsTrigger>
          </TabsList>

          {/* نظرة عامة */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* حالة الغرف */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building className="h-5 w-5" />
                    <span>حالة الغرف</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span>متاحة</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800">{stats.availableRooms} غرفة</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Users className="h-5 w-5 text-red-600" />
                        <span>مشغولة</span>
                      </div>
                      <Badge className="bg-red-100 text-red-800">{stats.occupiedRooms} غرفة</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="h-5 w-5 text-yellow-600" />
                        <span>صيانة</span>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800">{stats.maintenanceRooms} غرفة</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* إحصائيات الأسرّة */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bed className="h-5 w-5" />
                    <span>إحصائيات الأسرّة</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Bed className="h-4 w-4 text-blue-600" />
                        <span>إجمالي الأسرّة</span>
                      </div>
                      <span className="font-medium">{stats.totalBeds} سرير</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-red-600" />
                        <span>أسرّة مشغولة</span>
                      </div>
                      <span className="font-medium">{stats.occupiedBeds} سرير</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>أسرّة متاحة</span>
                      </div>
                      <span className="font-medium">{stats.totalBeds - stats.occupiedBeds} سرير</span>
                    </div>
                    <hr />
                    <div className="flex items-center justify-between font-bold">
                      <span>نسبة الإشغال</span>
                      <span>{Math.round((stats.occupiedBeds / stats.totalBeds) * 100)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* روابط سريعة */}
            <Card>
              <CardHeader>
                <CardTitle>إجراءات سريعة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2" onClick={handleAddRoom}>
                    <Plus className="h-6 w-6" />
                    <span>إضافة غرفة جديدة</span>
                  </Button>
                  <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2" onClick={handleEditRooms}>
                    <Edit className="h-6 w-6" />
                    <span>تعديل الغرف</span>
                  </Button>
                  <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2" onClick={handleManageBookings}>
                    <Building className="h-6 w-6" />
                    <span>إدارة الحجوزات</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* قائمة الغرف */}
          <TabsContent value="rooms" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>قائمة الغرف</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {rooms.map((room) => (
                    <Card key={room.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-bold text-lg">غرفة {room.number}</h3>
                          <Badge 
                            variant={room.status === 'متاحة' ? 'default' : room.status === 'مشغولة' ? 'destructive' : 'secondary'}
                            className={room.status === 'متاحة' ? 'bg-green-100 text-green-800' : room.status === 'مشغولة' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}
                          >
                            {room.status}
                          </Badge>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>النوع:</span>
                            <span className="font-medium">{room.type}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>الأسرّة:</span>
                            <span className="font-medium">{room.occupiedBeds}/{room.beds}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>السعر:</span>
                            <span className="font-medium">{room.price} ج.م</span>
                          </div>
                        </div>
                        <div className="mt-4 flex space-x-2">
                          <Button size="sm" variant="outline" className="flex-1" onClick={() => handleEditRoom(room.id)}>
                            <Edit className="h-3 w-3 mr-1" />
                            تعديل
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1" onClick={() => handleViewRoomDetails(room.id)}>
                            <Users className="h-3 w-3 mr-1" />
                            تفاصيل
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* إدارة الغرف */}
          <TabsContent value="management" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>إدارة الغرف</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  يمكنك إضافة وتعديل وحذف الغرف
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button onClick={handleAddRoom}>
                    <Plus className="h-4 w-4 mr-2" />
                    إضافة غرفة جديدة
                  </Button>
                  <Button variant="outline" onClick={handleEditRooms}>
                    <Edit className="h-4 w-4 mr-2" />
                    تعديل الغرف
                  </Button>
                  <Button variant="outline" onClick={handleDownloadReport}>
                    <Building className="h-4 w-4 mr-2" />
                    تحميل التقرير
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Rooms; 