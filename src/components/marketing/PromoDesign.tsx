import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  Sparkles, 
  MessageSquare, 
  Clock, 
  Star,
  Zap,
  Brain,
  Shield,
  Download,
  Share2,
  Copy,
  CheckCircle,
  ArrowRight,
  Play,
  Smartphone,
  Monitor,
  Tablet,
  Palette,
  Image,
  Type,
  Layout,
  Eye
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRef } from 'react';
import * as htmlToImage from 'html-to-image';

const PromoDesign = () => {
  const { toast } = useToast();
  const [activeDesign, setActiveDesign] = useState('hero');
  const [copied, setCopied] = useState(false);
  const [customTexts, setCustomTexts] = useState({
    centerName: 'شفا كير',
    slogan: 'مساعدك الذكي للرعاية الصحية',
    promo: 'جرب المساعد الذكي الآن!'
  });
  const designRef = useRef<HTMLDivElement>(null);

  const designs = [
    {
      id: 'hero',
      title: 'تصميم البطل الرئيسي',
      description: 'تصميم جذاب للمساعد الذكي',
      color: 'from-blue-500 to-purple-600'
    },
    {
      id: 'features',
      title: 'تصميم المميزات',
      description: 'عرض مميزات المساعد الذكي',
      color: 'from-green-500 to-teal-600'
    },
    {
      id: 'testimonials',
      title: 'تصميم التوصيات',
      description: 'آراء المستخدمين',
      color: 'from-orange-500 to-red-600'
    },
    {
      id: 'cta',
      title: 'تصميم الدعوة للعمل',
      description: 'حث المستخدمين على التجربة',
      color: 'from-purple-500 to-pink-600'
    }
  ];

  const features = [
    {
      icon: MessageSquare,
      title: 'محادثة فورية',
      description: 'ردود سريعة باللهجة المصرية'
    },
    {
      icon: Clock,
      title: 'متاح 24/7',
      description: 'مساعدة على مدار الساعة'
    },
    {
      icon: Brain,
      title: 'ذكاء اصطناعي',
      description: 'تقنيات متقدمة للفهم'
    },
    {
      icon: Shield,
      title: 'آمن وموثوق',
      description: 'حماية كاملة للبيانات'
    }
  ];

  const testimonials = [
    {
      name: 'د. أحمد محمد',
      role: 'مدير المركز',
      text: 'المساعد الذكي ساعدنا في تحسين كفاءة العمل بشكل كبير!',
      rating: 5
    },
    {
      name: 'سارة أحمد',
      role: 'معالجة نفسية',
      text: 'سهولة الاستخدام والردود السريعة جعلت العمل أسهل بكثير.',
      rating: 5
    },
    {
      name: 'محمد علي',
      role: 'مشرف إداري',
      text: 'أفضل مساعد ذكي استخدمته في مجال الرعاية الصحية!',
      rating: 5
    }
  ];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({
      title: "تم النسخ!",
      description: "تم نسخ النص إلى الحافظة",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCustomTexts({
      ...customTexts,
      [e.target.name]: e.target.value
    });
  };

  const handleDownload = async () => {
    if (designRef.current) {
      try {
        const dataUrl = await htmlToImage.toPng(designRef.current, { pixelRatio: 2 });
        const link = document.createElement('a');
        link.download = `promo-design-${activeDesign}.png`;
        link.href = dataUrl;
        link.click();
        toast({
          title: 'تم تحميل الصورة!',
          description: 'يمكنك الآن نشر التصميم على وسائل التواصل الاجتماعي.'
        });
      } catch (err) {
        toast({
          title: 'حدث خطأ',
          description: 'تعذر تحميل الصورة. حاول مرة أخرى.'
        });
      }
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'المساعد الذكي - شفا كير',
        text: 'اكتشف المساعد الذكي الجديد للموظفين!',
        url: window.location.href
      });
    } else {
      handleCopy(window.location.href);
    }
  };

  const renderHeroDesign = () => (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 p-8 text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full"></div>
        <div className="absolute top-20 right-20 w-16 h-16 bg-white rounded-full"></div>
        <div className="absolute bottom-10 left-20 w-12 h-12 bg-white rounded-full"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-white rounded-full"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">{customTexts.centerName}</h2>
              <p className="text-sm opacity-90">نظام الرعاية الذكي</p>
            </div>
          </div>
          <Badge className="bg-white/20 text-white border-white/30">
            <Sparkles className="w-3 h-3 mr-1" />
            جديد
          </Badge>
        </div>

        {/* Main Content */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">{customTexts.promo}</h1>
          <p className="text-xl md:text-2xl opacity-90 mb-6">{customTexts.slogan}</p>
          <p className="text-lg opacity-80 mb-8 max-w-2xl mx-auto">
            احصل على مساعدة فورية باللهجة المصرية، متاح 24/7 لجميع الموظفين
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
              <Play className="w-5 h-5 mr-2" />
              جرب الآن
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
              <MessageSquare className="w-5 h-5 mr-2" />
              تعرف أكثر
            </Button>
          </div>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-sm">{feature.title}</h3>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderFeaturesDesign = () => (
    <div className="bg-gradient-to-br from-green-50 to-teal-50 p-8 rounded-2xl">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">مميزات المساعد الذكي</h2>
        <p className="text-lg text-gray-600">اكتشف كيف يمكن للمساعد الذكي تحسين عملك</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4 space-x-reverse">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="text-center mt-8">
        <Button size="lg" className="bg-gradient-to-r from-green-500 to-teal-600 text-white">
          <ArrowRight className="w-5 h-5 mr-2" />
          ابدأ التجربة
        </Button>
      </div>
    </div>
  );

  const renderTestimonialsDesign = () => (
    <div className="bg-gradient-to-br from-orange-50 to-red-50 p-8 rounded-2xl">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">آراء المستخدمين</h2>
        <p className="text-lg text-gray-600">ماذا يقول الموظفون عن المساعد الذكي</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <Card key={index} className="hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {testimonial.name.charAt(0)}
                </div>
                <div className="mr-3">
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderCTADesign = () => (
    <div className="bg-gradient-to-br from-purple-500 via-pink-600 to-red-600 p-8 rounded-2xl text-white">
      <div className="text-center">
        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Bot className="w-10 h-10" />
        </div>
        
        <h2 className="text-4xl font-bold mb-4">جرب المساعد الذكي الآن!</h2>
        <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
          انضم إلى مئات الموظفين الذين يستخدمون المساعد الذكي لتحسين كفاءة عملهم
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
            <Zap className="w-5 h-5 mr-2" />
            ابدأ مجاناً
          </Button>
          <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
            <MessageSquare className="w-5 h-5 mr-2" />
            تواصل معنا
          </Button>
        </div>

        <div className="flex items-center justify-center space-x-6 space-x-reverse text-sm opacity-80">
          <div className="flex items-center">
            <CheckCircle className="w-4 h-4 mr-1" />
            مجاني تماماً
          </div>
          <div className="flex items-center">
            <CheckCircle className="w-4 h-4 mr-1" />
            سهل الاستخدام
          </div>
          <div className="flex items-center">
            <CheckCircle className="w-4 h-4 mr-1" />
            دعم فني 24/7
          </div>
        </div>
      </div>
    </div>
  );

  const renderDesign = () => {
    switch (activeDesign) {
      case 'hero':
        return renderHeroDesign();
      case 'features':
        return renderFeaturesDesign();
      case 'testimonials':
        return renderTestimonialsDesign();
      case 'cta':
        return renderCTADesign();
      default:
        return renderHeroDesign();
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* تخصيص النصوص */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <Label htmlFor="centerName">اسم المركز</Label>
          <Input name="centerName" value={customTexts.centerName} onChange={handleInputChange} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="slogan">جملة تعريفية</Label>
          <Input name="slogan" value={customTexts.slogan} onChange={handleInputChange} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="promo">جملة دعائية</Label>
          <Input name="promo" value={customTexts.promo} onChange={handleInputChange} className="mt-1" />
        </div>
      </div>
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">تصميمات دعائية للمساعد الذكي</h1>
        <p className="text-xl text-gray-600">اختر التصميم المناسب لحملتك الدعائية</p>
      </div>

      {/* Design Selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {designs.map((design) => (
          <Button
            key={design.id}
            variant={activeDesign === design.id ? "default" : "outline"}
            onClick={() => setActiveDesign(design.id)}
            className="h-auto p-4 flex flex-col items-center space-y-2"
          >
            <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${design.color}`}></div>
            <div className="text-center">
              <div className="font-semibold">{design.title}</div>
              <div className="text-xs opacity-70">{design.description}</div>
            </div>
          </Button>
        ))}
      </div>

      {/* Design Preview */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-gray-50 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <CardTitle>معاينة التصميم</CardTitle>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
              >
                <Download className="w-4 h-4 mr-2" />
                تحميل
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
              >
                <Share2 className="w-4 h-4 mr-2" />
                مشاركة
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy('المساعد الذكي - شفا كير')}
              >
                {copied ? <CheckCircle className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {copied ? 'تم النسخ' : 'نسخ النص'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div ref={designRef} className="min-h-[600px] bg-white dark:bg-gray-900">
            {renderDesign()}
          </div>
        </CardContent>
      </Card>

      {/* Design Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Smartphone className="w-5 h-5 mr-2 text-blue-600" />
              متوافق مع الموبايل
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">التصميم متجاوب ويعمل على جميع الأجهزة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Monitor className="w-5 h-5 mr-2 text-green-600" />
              جودة عالية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">تصميم احترافي بجودة عالية للطباعة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Tablet className="w-5 h-5 mr-2 text-purple-600" />
              قابل للتخصيص
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">يمكن تخصيص الألوان والنصوص حسب الحاجة</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PromoDesign; 