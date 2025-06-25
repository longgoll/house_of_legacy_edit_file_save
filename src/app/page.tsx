"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Upload, FileText, X, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const router = useRouter();

  const handleGameDataFile = useCallback(async (file: File) => {
    try {
      const text = await file.text();
      const gameData = JSON.parse(text);
      
      // Store data in sessionStorage instead of URL
      sessionStorage.setItem('gameData', JSON.stringify(gameData));
      sessionStorage.setItem('fileName', file.name);
      
      // Navigate to menu
      router.push('/menu');
    } catch (error) {
      console.error('Error parsing GameData.es3:', error);
      alert('Error parsing GameData.es3 file. Please make sure it\'s a valid JSON file.');
    }
  }, [router]);

  const addFiles = useCallback((newFiles: File[]) => {
    setFiles(prev => [...prev, ...newFiles]);
    
    // Check if any of the new files is GameData.es3
    const gameDataFile = newFiles.find(file => file.name === 'GameData.es3');
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 flex items-center justify-center">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Game Tool
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Tải lên và xử lý file game của bạn một cách dễ dàng
          </p>
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              💡 <strong>Hướng dẫn:</strong> Upload file <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">GameData.es3</code> để truy cập menu quản lý game với nhiều tính năng hữu ích!
            </p>
          </div>
        </div>

        {/* Upload Area */}
        <Card className="border-2 border-dashed transition-colors duration-200 hover:border-slate-400 dark:hover:border-slate-600">
          <CardContent className="p-8">
            <div
              className={`relative flex flex-col items-center justify-center space-y-4 rounded-lg border-2 border-dashed p-8 transition-colors duration-200 ${
                dragActive
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                  : "border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="rounded-full bg-slate-100 dark:bg-slate-800 p-4">
                  <Upload className="h-8 w-8 text-slate-600 dark:text-slate-400" />
                </div>
                <div className="text-center space-y-2">
                  <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    Kéo thả file vào đây
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    hoặc click để chọn file
                  </p>
                </div>
                <Button
                  onClick={() => document.getElementById('fileInput')?.click()}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
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

        {/* File List */}
        {files.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                File đã tải lên ({files.length})
              </CardTitle>
              <CardDescription>
                Danh sách các file bạn đã chọn
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
                >
                  <div className="flex items-center space-x-3">
                    <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-2">
                      <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-900 dark:text-slate-100 truncate max-w-xs">
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
                    className="text-slate-600 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              {files.length > 0 && (
                <div className="flex justify-between pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setFiles([])}
                    className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
                  >
                    Xóa tất cả
                  </Button>
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    Xử lý file
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
