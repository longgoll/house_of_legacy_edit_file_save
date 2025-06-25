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
import { Coffee, Heart, CheckCircle } from 'lucide-react'
import Image from 'next/image'

interface QRThankYouDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  message?: string
}

const thankYouMessages = [
  "Tuyệt vời! Bạn đã cập nhật thành công! 🎉 Mời tôi cà phê để tôi có thêm động lực nhé!",
  "Cảm ơn bạn đã sử dụng ứng dụng! ☕ Một ly cà phê sẽ giúp tôi phát triển thêm nhiều tính năng!",
  "Hoàn thành! Bạn thật tuyệt vời! 💪 Hãy mời tôi cà phê để tôi tiếp tục cải thiện ứng dụng!",
  "Dữ liệu đã được lưu thành công! 🚀 Cà phê sẽ là nguồn động lực để tôi code thêm tính năng mới!",
  "Bạn đã hoàn thành xuất sắc! 🌟 Một ly cà phê nhỏ sẽ giúp tôi có thêm năng lượng!"
]

export function QRThankYouDialog({ 
  open, 
  onOpenChange, 
  title = "Cảm ơn bạn!", 
  message 
}: QRThankYouDialogProps) {
  const [currentMessage] = useState(() => 
    message || thankYouMessages[Math.floor(Math.random() * thankYouMessages.length)]
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
            <CheckCircle className="h-5 w-5 text-green-500" />
            {title}
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
                width={180}
                height={180}
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
              Cà phê sẽ giúp tôi có thêm động lực để phát triển! 🚀
            </p>
          </div>
          
          {/* Close Button */}
          <div className="w-full pt-4">
            <Button 
              onClick={handleClose}
              className="w-full bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              Đóng
            </Button>
          </div>
          
          {/* Footer message */}
          <p className="text-xs text-center text-muted-foreground">
            Dù có mời cà phê hay không, tôi vẫn sẽ tiếp tục phát triển! 😊
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
