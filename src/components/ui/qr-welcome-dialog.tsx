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
import { Coffee, Heart, Sparkles } from 'lucide-react'
import Image from 'next/image'

interface QRWelcomeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const welcomeMessages = [
  "Chào mừng bạn đến với trình quản lý game! 🎮 Nếu thấy hữu ích, hãy mời tôi cà phê nhé!",
  "Bạn đã upload file thành công! 🎉 Một ly cà phê sẽ giúp tôi tạo thêm nhiều tính năng!",
  "Tuyệt vời! Bạn đã sẵn sàng chỉnh sửa game! ⚡ Cà phê sẽ giúp tôi phát triển thêm!",
  "Welcome! Hãy khám phá các tính năng tuyệt vời! 🚀 Mời cà phê để tôi làm thêm nhé!"
]

export function QRWelcomeDialog({ open, onOpenChange }: QRWelcomeDialogProps) {
  const [currentMessage] = useState(() => 
    welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)]
  )

  const handleClose = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={() => {}} modal>
      <DialogContent 
        className="sm:max-w-md"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-center">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            Chào mừng bạn!
            <Heart className="h-5 w-5 text-red-500" />
          </DialogTitle>
          <DialogDescription className="text-center">
            {currentMessage}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center space-y-4">
          {/* QR Code */}
          <div className="relative">
            <div className="border-4 border-yellow-200 rounded-lg p-2 bg-white">
              <Image
                src="/qr-momo.jpg"
                alt="QR Code MoMo"
                width={160}
                height={160}
                className="rounded"
                priority
              />
            </div>
            <div className="absolute -top-2 -right-2 bg-yellow-500 text-white rounded-full p-1">
              <Coffee className="h-4 w-4" />
            </div>
          </div>
          
          {/* Message */}
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Quét mã QR để ủng hộ nhà phát triển ☕
            </p>
            <p className="text-xs text-muted-foreground italic">
              Mỗi ly cà phê là động lực để tôi code thêm tính năng! 💪
            </p>
          </div>
          
          {/* Continue Button */}
          <div className="w-full pt-4 space-y-2">
            <Button 
              onClick={handleClose}
              className="w-full bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              Tiếp tục khám phá
            </Button>
          </div>
          
          {/* Footer message */}
          <p className="text-xs text-center text-muted-foreground">
            Bạn có thể đóng popup này và tiếp tục sử dụng! 😊
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
