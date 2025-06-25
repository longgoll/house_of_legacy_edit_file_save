'use client'

import React, { useState } from 'react'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Shield, Copy, CheckCircle } from 'lucide-react'

interface BackupWarningDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BackupWarningDialog({ open, onOpenChange }: BackupWarningDialogProps) {
  const [copied, setCopied] = useState(false)
  
  const savePath = "C:\\Users\\User\\AppData\\LocalLow\\S3Studio\\House of Legacy\\FW"
  
  const copyPath = async () => {
    try {
      await navigator.clipboard.writeText(savePath)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Không thể copy path:', error)
    }
  }

  const handleUnderstood = () => {
    // Lưu trạng thái đã hiểu cảnh báo
    localStorage.setItem('backupWarningUnderstood', 'true')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={() => {}} modal>
      <DialogContent 
        className="sm:max-w-lg border-2 border-red-200 bg-gradient-to-br from-red-50 to-orange-50"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-center text-red-700">
            <div className="animate-bounce">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <span className="text-xl font-bold">CẢNH BÁO QUAN TRỌNG!</span>
            <div className="animate-bounce">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </DialogTitle>
          <DialogDescription className="text-center text-red-600 font-medium text-base mt-2">
            Đây là sản phẩm đang phát triển - Hãy sao lưu file save của bạn!
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center space-y-6 py-4">
          {/* Warning Icon */}
          <div className="relative">
            <div className="absolute inset-0 bg-red-400 rounded-full animate-ping opacity-30"></div>
            <div className="relative bg-red-500 rounded-full p-4">
              <Shield className="h-12 w-12 text-white" />
            </div>
          </div>
          
          {/* Warning Message */}
          <div className="text-center space-y-4 px-4">
            <div className="bg-white/80 border-2 border-red-300 rounded-lg p-4 shadow-lg">
              <h3 className="font-bold text-red-800 text-lg mb-2">
                ⚠️ Tại sao cần sao lưu?
              </h3>
              <ul className="text-sm text-red-700 text-left space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-red-500">•</span>
                  <span>Ứng dụng có thể ghi đè lên file save gốc</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">•</span>
                  <span>Tránh mất dữ liệu game quan trọng</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">•</span>
                  <span>Có thể khôi phục nếu có lỗi xảy ra</span>
                </li>
              </ul>
            </div>
            
            {/* File Path */}
            <div className="bg-slate-900 rounded-lg p-3 border-2 border-yellow-400">
              <p className="text-yellow-300 text-xs font-semibold mb-2">📁 Vị trí file save:</p>
              <div className="flex items-center gap-2 bg-slate-800 rounded p-2">
                <code className="text-green-400 text-xs flex-1 break-all font-mono">
                  {savePath}
                </code>
                <Button
                  onClick={copyPath}
                  size="sm"
                  variant="outline"
                  className="h-6 px-2 text-xs border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-slate-900"
                >
                  {copied ? (
                    <>
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
          
          {/* Action Button */}
          <div className="w-full pt-4">
            <Button 
              onClick={handleUnderstood}
              className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold text-lg py-6 shadow-lg transform transition-all duration-200 hover:scale-105"
              size="lg"
            >
              <Shield className="h-5 w-5 mr-2" />
              Tôi đã hiểu và sẽ sao lưu file save!
            </Button>
          </div>
          
          {/* Footer message */}
          <div className="text-center bg-yellow-100 border-2 border-yellow-400 rounded-lg p-3">
            <p className="text-yellow-800 text-sm font-semibold">
              💡 <strong>Mẹo:</strong> Copy toàn bộ thư mục FW để sao lưu an toàn nhất!
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
