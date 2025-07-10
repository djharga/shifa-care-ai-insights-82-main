import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Copyright, 
  Lock, 
  UserCheck, 
  AlertTriangle, 
  FileText,
  Download,
  Mail,
  Phone,
  Globe,
  Calendar,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PrivacyPolicy = () => {
  const { toast } = useToast();

  const handleDownloadPolicy = () => {
    toast({
      title: "تحميل السياسة",
      description: "سيتم تحميل سياسة الخصوصية والاستخدام",
    });
  };

  const handleContact = () => {
    toast({
      title: "تواصل معنا",
      description: "سيتم فتح نموذج التواصل",
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Shield className="w-12 h-12 text-blue-600 mr-4" />
          <div>
            <h1 className="text-4xl font-bold text-gray-900">سياسة الخصوصية والاستخدام</h1>
            <p className="text-xl text-gray-600">شفا كير - نظام الرعاية الذكي</p>
          </div>
        </div>
        <Badge className="bg-blue-600 text-white px-4 py-2 text-lg">
          <Copyright className="w-4 h-4 mr-2" />
          محفوظة الحقوق © 2024
        </Badge>
      </div>

      {/* حقوق الملكية */}
      <Card className="border-2 border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-800">
            <Copyright className="w-6 h-6 mr-2" />
            حقوق الملكية الفكرية
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-white p-4 rounded-lg">
            <h3 className="font-bold text-lg mb-3 text-blue-800">المطور الأساسي:</h3>
            <p className="text-gray-700 mb-2">Claude Sonnet 4 - Anthropic</p>
            <p className="text-sm text-gray-600">مطور الذكاء الاصطناعي والمنطق الأساسي للنظام</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg">
            <h3 className="font-bold text-lg mb-3 text-blue-800">المبرمج البشري:</h3>
            <p className="text-gray-700 mb-2">Islam Ali Dev</p>
            <p className="text-sm text-gray-600">مطور الواجهة والوظائف التفاعلية</p>
          </div>

          <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
            <h3 className="font-bold text-lg mb-3 text-red-800 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              تحذير هام
            </h3>
            <p className="text-red-700">
              جميع حقوق الملكية محفوظة. يحظر نسخ أو توزيع أو تعديل هذا المنتج دون إذن كتابي مسبق.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* سياسة الاستخدام */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <UserCheck className="w-6 h-6 mr-2" />
            سياسة الاستخدام
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                الاستخدام المسموح
              </h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• استخدام النظام للرعاية الصحية</li>
                <li>• إدارة المرضى والموظفين</li>
                <li>• إنشاء التقارير والإحصائيات</li>
                <li>• التواصل مع أسر المرضى</li>
                <li>• استخدام المساعد الذكي</li>
              </ul>
            </div>

            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <h4 className="font-semibold text-red-800 mb-2 flex items-center">
                <XCircle className="w-4 h-4 mr-2" />
                الاستخدام المحظور
              </h4>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• نسخ أو توزيع النظام</li>
                <li>• عكس هندسة الكود</li>
                <li>• إزالة علامات الملكية</li>
                <li>• استخدام تجاري غير مصرح</li>
                <li>• إعادة بيع النظام</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* حماية من السرقة */}
      <Card className="border-2 border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center text-red-800">
            <Lock className="w-6 h-6 mr-2" />
            حماية المنتج من السرقة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-white p-4 rounded-lg">
            <h3 className="font-bold text-lg mb-3 text-red-800">إجراءات الحماية:</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <Shield className="w-4 h-4 mr-2 mt-1 text-red-600" />
                <span>تشفير الكود المصدري وحماية من النسخ</span>
              </li>
              <li className="flex items-start">
                <Shield className="w-4 h-4 mr-2 mt-1 text-red-600" />
                <span>مراقبة الاستخدام واكتشاف الاستخدام غير المصرح</span>
              </li>
              <li className="flex items-start">
                <Shield className="w-4 h-4 mr-2 mt-1 text-red-600" />
                <span>تتبع IP ومراقبة محاولات الاختراق</span>
              </li>
              <li className="flex items-start">
                <Shield className="w-4 h-4 mr-2 mt-1 text-red-600" />
                <span>إيقاف فوري للحسابات المخالفة</span>
              </li>
            </ul>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
            <h3 className="font-bold text-lg mb-3 text-yellow-800">العقوبات:</h3>
            <ul className="space-y-2 text-yellow-700">
              <li>• إيقاف فوري للحساب المخالف</li>
              <li>• إجراءات قانونية ضد المخالفين</li>
              <li>• تعويضات مالية عن الأضرار</li>
              <li>• منع نهائي من استخدام النظام</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* معلومات الاتصال */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mail className="w-6 h-6 mr-2" />
            معلومات الاتصال
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-800">للاستفسارات القانونية:</h4>
              <div className="flex items-center space-x-2 space-x-reverse">
                <Mail className="w-4 h-4 text-blue-600" />
                <span>legal@shifacare.com</span>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <Phone className="w-4 h-4 text-blue-600" />
                <span>+20 123 456 7890</span>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-gray-800">للدعم الفني:</h4>
              <div className="flex items-center space-x-2 space-x-reverse">
                <Mail className="w-4 h-4 text-green-600" />
                <span>support@shifacare.com</span>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <Globe className="w-4 h-4 text-green-600" />
                <span>www.shifacare.com</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* تاريخ التحديث */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-6 h-6 mr-2" />
            معلومات التحديث
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">آخر تحديث: 15 ديسمبر 2024</p>
              <p className="text-gray-600">الإصدار: 1.0.0</p>
            </div>
            <div className="flex space-x-2 space-x-reverse">
              <Button onClick={handleDownloadPolicy} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                تحميل السياسة
              </Button>
              <Button onClick={handleContact}>
                <Mail className="w-4 h-4 mr-2" />
                تواصل معنا
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* شروط إضافية */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="w-6 h-6 mr-2" />
            شروط إضافية
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">الخصوصية:</h4>
            <p className="text-blue-700 text-sm">
              نحن نلتزم بحماية خصوصية بيانات المرضى والموظفين وفقاً لأعلى معايير الأمان.
            </p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">الأمان:</h4>
            <p className="text-green-700 text-sm">
              جميع البيانات مشفرة ومحمية بأحدث تقنيات الأمان المتاحة.
            </p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-semibold text-purple-800 mb-2">التحديثات:</h4>
            <p className="text-purple-700 text-sm">
              نحتفظ بحق تحديث هذه السياسة في أي وقت مع إشعار مسبق للمستخدمين.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacyPolicy; 