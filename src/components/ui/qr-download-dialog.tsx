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
import { Download, Coffee, Heart } from 'lucide-react'
import Image from 'next/image'

interface QRDownloadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onDownload: () => void
}

const motivationalMessages = [
  "Cảm ơn bạn đã sử dụng ứng dụng! ☕ Mời bạn ly cà phê để tôi có động lực phát triển thêm nhé!",
  "Hy vọng ứng dụng hữu ích với bạn! 🎉 Một ly cà phê sẽ giúp tôi tạo ra nhiều tính năng hay ho hơn!",
  "Bạn thật tuyệt vời! 💪 Hãy mời tôi cà phê để tôi tiếp tục coded những điều thú vị nhé!",
  "Chúc bạn có trải nghiệm tuyệt vời! ☕ Cà phê sẽ là nguồn động lực để tôi cải thiện ứng dụng!",
  "Bạn đã hoàn thành xuất file! 🎊 Một ly cà phê nhỏ sẽ giúp tôi có thêm năng lượng phát triển!"
]

export function QRDownloadDialog({ open, onOpenChange, onDownload }: QRDownloadDialogProps) {
  const [currentMessage] = useState(() => 
    motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]
  )

  const handleDownload = () => {
    onDownload()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-center">
            <Heart className="h-5 w-5 text-red-500" />
            Cảm ơn bạn đã sử dụng!
            <Heart className="h-5 w-5 text-red-500" />
          </DialogTitle>
          <DialogDescription className="text-center">
            {currentMessage}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center space-y-4">
          {/* QR Code */}
          <div className="relative">
            <div className="border-4 border-orange-200 rounded-lg p-2 bg-white">
              <Image
                src="/qr-momo.jpg"
                alt="QR Code MoMo"
                width={200}
                height={200}
                className="rounded"
                priority
              />
            </div>
            <div className="absolute -top-2 -right-2 bg-orange-500 text-white rounded-full p-1">
              <Coffee className="h-4 w-4" />
            </div>
          </div>
          
          {/* Message */}
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Quét mã QR để mời tôi một ly cà phê ☕
            </p>
            <p className="text-xs text-muted-foreground italic">
              Cà phê sẽ giúp tôi có thêm động lực để phát triển những tính năng mới! 🚀
            </p>
          </div>
          
          {/* Download Button */}
          <div className="w-full pt-4">
            <Button 
              onClick={handleDownload}
              className="w-full bg-green-600 hover:bg-green-700"
              size="lg"
            >
              <Download className="h-4 w-4 mr-2" />
              Tải file về ngay
            </Button>
          </div>
          
          {/* Footer message */}
          <p className="text-xs text-center text-muted-foreground">
            Dù có mời cà phê hay không, bạn vẫn có thể tải file về! 😊
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
