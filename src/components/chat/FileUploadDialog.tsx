import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { 
  Upload, 
  Image as ImageIcon, 
  File, 
  Mic, 
  X, 
  Check,
  AlertCircle,
  FileText,
  FileImage,
  FileAudio,
  FileVideo
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FileUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onFileUpload: (file: File, type: 'image' | 'file' | 'voice') => void;
  allowedTypes?: ('image' | 'file' | 'voice')[];
  maxFileSize?: number; // بالبايت
}

const FileUploadDialog: React.FC<FileUploadDialogProps> = ({
  isOpen,
  onClose,
  onFileUpload,
  allowedTypes = ['image', 'file', 'voice'],
  maxFileSize = 10 * 1024 * 1024 // 10MB
}) => {
  const { toast } = useToast();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles: File[] = [];

    files.forEach(file => {
      // التحقق من حجم الملف
      if (file.size > maxFileSize) {
        toast({
          title: "ملف كبير جداً",
          description: `الملف ${file.name} أكبر من الحد المسموح (${Math.round(maxFileSize / 1024 / 1024)}MB)`,
          variant: "destructive",
        });
        return;
      }

      // التحقق من نوع الملف
      const fileType = getFileType(file);
      if (!allowedTypes.includes(fileType)) {
        toast({
          title: "نوع ملف غير مدعوم",
          description: `نوع الملف ${file.name} غير مدعوم`,
          variant: "destructive",
        });
        return;
      }

      validFiles.push(file);
    });

    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const getFileType = (file: File): 'image' | 'file' | 'voice' => {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('audio/')) return 'voice';
    return 'file';
  };

  const getFileIcon = (file: File) => {
    const type = getFileType(file);
    switch (type) {
      case 'image':
        return <FileImage className="w-5 h-5" />;
      case 'voice':
        return <FileAudio className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioRecorderRef.current = recorder;

      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        const file = new File([blob], `voice_message_${Date.now()}.wav`, { type: 'audio/wav' }) as File;
        setSelectedFiles(prev => [...prev, file]);
        setIsRecording(false);
        setRecordingTime(0);
        if (recordingIntervalRef.current) {
          clearInterval(recordingIntervalRef.current);
        }
      };

      recorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "خطأ في التسجيل",
        description: "فشل في بدء التسجيل الصوتي",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (audioRecorderRef.current && isRecording) {
      audioRecorderRef.current.stop();
      audioRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "لا توجد ملفات",
        description: "يرجى اختيار ملف واحد على الأقل",
        variant: "destructive",
      });
      return;
    }

    // محاكاة رفع الملفات
    for (const file of selectedFiles) {
      const fileId = `${file.name}-${Date.now()}`;
      setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));

      // محاكاة التقدم
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setUploadProgress(prev => ({ ...prev, [fileId]: i }));
      }

      const fileType = getFileType(file);
      onFileUpload(file, fileType);
    }

    toast({
      title: "تم الرفع",
      description: `تم رفع ${selectedFiles.length} ملف بنجاح`,
    });

    setSelectedFiles([]);
    setUploadProgress({});
    onClose();
  };

  const handleClose = () => {
    if (isRecording) {
      stopRecording();
    }
    setSelectedFiles([]);
    setUploadProgress({});
    onClose();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Upload className="w-5 h-5" />
            <span>رفع ملفات</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* أزرار الرفع */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {allowedTypes.includes('image') && (
              <Button
                variant="outline"
                className="h-24 flex flex-col items-center justify-center space-y-2"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageIcon className="w-6 h-6" />
                <span>صورة</span>
              </Button>
            )}

            {allowedTypes.includes('file') && (
              <Button
                variant="outline"
                className="h-24 flex flex-col items-center justify-center space-y-2"
                onClick={() => fileInputRef.current?.click()}
              >
                <File className="w-6 h-6" />
                <span>ملف</span>
              </Button>
            )}

            {allowedTypes.includes('voice') && (
              <Button
                variant={isRecording ? "destructive" : "outline"}
                className="h-24 flex flex-col items-center justify-center space-y-2"
                onClick={isRecording ? stopRecording : startRecording}
              >
                <Mic className="w-6 h-6" />
                <span>{isRecording ? 'إيقاف التسجيل' : 'تسجيل صوتي'}</span>
                {isRecording && (
                  <Badge variant="destructive" className="text-xs">
                    {formatTime(recordingTime)}
                  </Badge>
                )}
              </Button>
            )}
          </div>

          {/* إدخال الملفات المخفي */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={allowedTypes.includes('image') ? 'image/*' : allowedTypes.includes('voice') ? 'audio/*' : '*'}
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* الملفات المختارة */}
          {selectedFiles.length > 0 && (
            <div>
              <Label>الملفات المختارة ({selectedFiles.length})</Label>
              <ScrollArea className="h-48 mt-2 border rounded-md p-2">
                <div className="space-y-2">
                  {selectedFiles.map((file, index) => (
                    <div key={`${file.name}-${index}`} className="flex items-center justify-between p-2 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getFileIcon(file)}
                        <div>
                          <div className="font-medium text-sm">{file.name}</div>
                          <div className="text-xs text-gray-600">{formatFileSize(file.size)}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {uploadProgress[`${file.name}-${Date.now()}`] !== undefined && (
                          <Progress value={uploadProgress[`${file.name}-${Date.now()}`]} className="w-20" />
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          {/* معلومات إضافية */}
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <div className="font-medium">ملاحظات:</div>
                <ul className="mt-1 space-y-1">
                  <li>• الحد الأقصى لحجم الملف: {Math.round(maxFileSize / 1024 / 1024)}MB</li>
                  <li>• الملفات المدعومة: {allowedTypes.join(', ')}</li>
                  <li>• يمكن رفع عدة ملفات في نفس الوقت</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            إلغاء
          </Button>
          <Button 
            onClick={handleUpload}
            disabled={selectedFiles.length === 0 || isRecording}
          >
            رفع الملفات
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FileUploadDialog; 