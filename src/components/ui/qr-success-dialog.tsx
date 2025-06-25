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
import { Coffee, Heart, CheckCircle, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface QRSuccessDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const successMessages = [
  "Upload thành công! 🎉 File đã sẵn sàng để chỉnh sửa! Mời tôi cà phê để có thêm động lực nhé!",
  "Tuyệt vời! Dữ liệu đã được tải lên! ☕ Một ly cà phê sẽ giúp tôi phát triển thêm tính năng!",
  "Hoàn thành! Bạn có thể bắt đầu chỉnh sửa game rồi! 💪 Cà phê sẽ giúp tôi code thêm!",
  "File đã sẵn sàng! Hãy khám phá các tính năng! 🚀 Mời cà phê để tôi làm thêm nhé!"
]

export function QRSuccessDialog({ open, onOpenChange }: QRSuccessDialogProps) {
  const [currentMessage] = useState(() => 
    successMessages[Math.floor(Math.random() * successMessages.length)]
  )
  
  const router = useRouter()

  const handleGoToMenu = () => {
    onOpenChange(false)
    router.push('/menu')
  }

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
            Upload thành công!
            <Heart className="h-5 w-5 text-red-500" />
          </DialogTitle>
          <DialogDescription className="text-center">
            {currentMessage}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center space-y-4">
          {/* QR Code */}
          <div className="relative">
            <div className="border-4 border-green-200 rounded-lg p-2 bg-white">
              <Image
                src="/qr-momo.jpg"
                alt="QR Code MoMo"
                width={180}
                height={180}
                className="rounded"
                priority
              />
            </div>
            <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1">
              <Coffee className="h-4 w-4" />
            </div>
          </div>
          
          {/* Message */}
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Quét mã QR để ủng hộ nhà phát triển ☕
            </p>
            <p className="text-xs text-muted-foreground italic">
              Cà phê sẽ giúp tôi có thêm động lực phát triển! 🚀
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="w-full pt-4 space-y-2">
            <Button 
              onClick={handleGoToMenu}
              className="w-full bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              <ArrowRight className="h-4 w-4 mr-2" />
              Vào Menu chính
            </Button>
            <Button 
              onClick={handleClose}
              variant="outline"
              className="w-full"
              size="sm"
            >
              Đóng (ở lại trang này)
            </Button>
          </div>
          
          {/* Footer message */}
          <p className="text-xs text-center text-muted-foreground">
            Bạn có thể vào menu bất cứ lúc nào! 😊
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
