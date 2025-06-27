"use client";

import { useState, useCallback, useEffect } from "react";
import { Upload, FileText, X, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QRSuccessDialog } from "@/components/ui/qr-success-dialog";
import { BackupWarningDialog } from "@/components/ui/backup-warning-dialog";
import { toast } from 'sonner';

export default function Home() {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showBackupWarning, setShowBackupWarning] = useState(false);

  // Kiểm tra xem người dùng đã hiểu cảnh báo chưa
  useEffect(() => {
    const hasUnderstood = localStorage.getItem('backupWarningUnderstood')
    if (!hasUnderstood) {
      // Hiển thị cảnh báo sau 1 giây để trang load xong
      setTimeout(() => {
        setShowBackupWarning(true)
      }, 1000)
    }
  }, [])

  const handleGameDataFile = useCallback(async (file: File) => {
    try {
      const text = await file.text();
      const gameData = JSON.parse(text);
      
      // Store data in sessionStorage instead of URL
      sessionStorage.setItem('gameData', JSON.stringify(gameData));
      sessionStorage.setItem('fileName', file.name);
      
      // Show success dialog
      setShowSuccessDialog(true);
    } catch (error) {
      console.error('Error parsing GameData.es3:', error);
      toast.error('Error parsing GameData.es3 file. Please make sure it\'s a valid JSON file.');
    }
  }, []);

  const addFiles = useCallback((newFiles: File[]) => {
    setFiles(prev => [...prev, ...newFiles]);
    
    // Check if any of the new files is GameData file (case-insensitive, flexible naming)
    const gameDataFile = newFiles.find(file => 
      file.name.toLowerCase().includes('gamedata') && 
      file.name.toLowerCase().endsWith('.es3')
    );
    if (gameDataFile) {
      handleGameDataFile(gameDataFile);
    }
  }, [handleGameDataFile]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const newFiles = Array.from(e.dataTransfer.files);
      addFiles(newFiles);
    }
  }, [addFiles]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const newFiles = Array.from(e.target.files);
      addFiles(newFiles);
    }
  }, [addFiles]);

  const removeFile = useCallback((index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto p-4 pt-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-700 dark:text-blue-300 text-sm font-medium mb-6">
              🎮 House of Legacy Game Tool
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
              Quản lý Game<br />
              <span className="text-slate-700 dark:text-slate-300">Dễ dàng & Hiệu quả</span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Công cụ mạnh mẽ giúp bạn quản lý và chỉnh sửa dữ liệu game House of Legacy một cách dễ dàng và an toàn
            </p>
          </div>

          <div className="space-y-8">
            {/* Info Banner */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-2xl blur-xl"></div>
              <div className="relative p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl border border-blue-200/50 dark:border-blue-800/50 shadow-lg">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">📁 Hướng dẫn tìm file GameData.es3</h3>
                      <div className="space-y-2 text-slate-700 dark:text-slate-300">
                        <p>
                          <strong>Bước 1:</strong> Mở Windows Explorer (File Explorer)
                        </p>
                        <p>
                          <strong>Bước 2:</strong> Dán đường dẫn sau vào thanh địa chỉ:
                        </p>
                        <code className="block bg-blue-50 dark:bg-blue-900/30 px-3 py-2 rounded-lg font-mono text-sm border border-blue-200 dark:border-blue-800 my-2">
                          %USERPROFILE%\AppData\LocalLow\S3Studio\House of Legacy\FW
                        </code>
                        <p>
                          <strong>Bước 3:</strong> Bạn sẽ thấy các thư mục số như: <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">0</code>, <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">1</code>, <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">2</code>, <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">3</code>...
                        </p>
                        <p className="text-sm text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-2 rounded border border-amber-200 dark:border-amber-800">
                          💡 <strong>Mẹo:</strong> Mỗi thư mục số là 1 file save của game. Thư mục <code>0</code> là save đầu tiên, <code>1</code> là save thứ hai...
                        </p>
                        <p>
                          <strong>Bước 4:</strong> Mở thư mục của save game bạn muốn chỉnh sửa
                        </p>
                        <p>
                          <strong>Bước 5:</strong> Tìm file <code className="bg-green-100 dark:bg-green-900/50 px-2 py-1 rounded font-mono text-sm">GameData.es3</code> và upload lên đây
                        </p>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">⚠️ Lưu ý quan trọng</h3>
                      <div className="space-y-2">
                        <div className="text-sm text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg border border-orange-200 dark:border-orange-800">
                          <p className="font-medium mb-1">💾 Nhớ backup file gốc!</p>
                          <p>Sao chép file GameData.es3 gốc sang nơi khác trước khi ghi đè file đã chỉnh sửa, để có thể khôi phục nếu cần.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Upload Area */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-3xl blur-2xl"></div>
              <Card className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 transition-all duration-300 hover:border-blue-400 dark:hover:border-blue-600 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-lg hover:shadow-xl">
                <CardContent className="p-8">
                  <div
                    className={`relative flex flex-col items-center justify-center space-y-6 rounded-2xl border-2 border-dashed p-12 transition-all duration-300 ${
                      dragActive
                        ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 scale-105"
                        : "border-slate-300 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-600 hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <div className="flex flex-col items-center space-y-6">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-lg opacity-30"></div>
                        <div className="relative rounded-full bg-gradient-to-r from-blue-600 to-purple-600 p-6 shadow-lg">
                          <Upload className="h-8 w-8 text-white" />
                        </div>
                      </div>
                      <div className="text-center space-y-3">
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                          Kéo thả file vào đây
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 text-lg">
                          hoặc click để chọn file từ máy tính
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-500">
                          Hỗ trợ file .es3 và các định dạng game khác
                        </p>
                      </div>
                      <Button
                        onClick={() => document.getElementById('fileInput')?.click()}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                      >
                        Chọn file
                      </Button>
                    </div>
                    <input
                      id="fileInput"
                      type="file"
                      multiple
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={handleFileInput}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-600/5 to-blue-600/5 rounded-3xl blur-2xl"></div>
            <Card className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-800/50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                    File đã tải lên ({files.length})
                  </span>
                </CardTitle>
                <CardDescription>
                  Danh sách các file bạn đã chọn để xử lý
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="group flex items-center justify-between p-4 bg-gradient-to-r from-slate-50/50 to-blue-50/30 dark:from-slate-800/50 dark:to-slate-700/30 rounded-xl border border-slate-200/50 dark:border-slate-700/50 hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 p-3 shadow-lg">
                        <FileText className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900 dark:text-slate-100 truncate max-w-xs">
                          {file.name}
                        </span>
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {formatFileSize(file.size)}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 transition-all duration-300 hover:scale-110"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                
                {files.length > 0 && (
                  <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-200/50 dark:border-slate-700/50">
                    <Button
                      variant="outline"
                      onClick={() => setFiles([])}
                      className="flex-1 border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800/50 dark:text-red-400 dark:hover:bg-red-950/20 transition-all duration-300"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Xóa tất cả
                    </Button>
                    <Button className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Xử lý file
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Success Dialog */}
        <QRSuccessDialog
          open={showSuccessDialog}
          onOpenChange={setShowSuccessDialog}
        />

        {/* Backup Warning Dialog */}
        <BackupWarningDialog
          open={showBackupWarning}
          onOpenChange={setShowBackupWarning}
        />
          </div>
        </div>
      </div>
    </div>
  );
}
