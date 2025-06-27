'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Edit3, Coins, DollarSign } from 'lucide-react'
import { QRThankYouDialog } from '@/components/ui/qr-thankyou-dialog'

interface CurrencyEditorProps {
  money: string
  gold: string
  onUpdate: (money: string, gold: string) => void
  dataLoaded: boolean
}

export function CurrencyEditor({ money, gold, onUpdate, dataLoaded }: CurrencyEditorProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [tempMoney, setTempMoney] = useState(money)
  const [tempGold, setTempGold] = useState(gold)
  const [showThankYouDialog, setShowThankYouDialog] = useState(false)

  // Update temp values when props change
  React.useEffect(() => {
    setTempMoney(money)
    setTempGold(gold)
  }, [money, gold])

  const handleEdit = () => {
    if (isEditing) {
      // Save changes
      onUpdate(tempMoney, tempGold)
      setShowThankYouDialog(true) // Show thank you dialog on save
    } else {
      // Start editing
      setTempMoney(money)
      setTempGold(gold)
    }
    setIsEditing(!isEditing)
  }

  const handleCancel = () => {
    setTempMoney(money)
    setTempGold(gold)
    setIsEditing(false)
  }

  const formatNumber = (num: string) => {
    // If it's already formatted with commas, return as is
    if (num.includes(',')) return num
    
    // Otherwise, try to format as number
    const parsed = parseInt(num.replace(/,/g, ''))
    if (isNaN(parsed)) return num
    return parsed.toLocaleString()
  }

  return (
    <Card className="shadow-xl border border-slate-200/50 dark:border-slate-800/50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-green-600 bg-clip-text text-transparent flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
                <Coins className="h-5 w-5 text-white" />
              </div>
              Chỉnh sửa tiền tệ
            </CardTitle>
            <CardDescription className="mt-2 flex items-center gap-2 text-base">
              Điều chỉnh số tiền và vàng trong game một cách dễ dàng
              {dataLoaded && (
                <span className="text-xs text-green-600 bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full font-medium">
                  ✓ Dữ liệu đã sẵn sàng
                </span>
              )}
            </CardDescription>
          </div>
          <Button
            onClick={handleEdit}
            variant={isEditing ? "default" : "outline"}
            size="lg"
            className={`flex items-center gap-2 transition-all duration-300 ${
              isEditing 
                ? "bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl hover:scale-105" 
                : "hover:bg-slate-100 dark:hover:bg-slate-800 hover:scale-105"
            }`}
          >
            <Edit3 className="h-4 w-4" />
            {isEditing ? 'Lưu thay đổi' : 'Bắt đầu chỉnh sửa'}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Money Section */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-blue-400/10 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative space-y-4 p-6 bg-gradient-to-r from-green-50/50 to-blue-50/50 dark:from-green-900/20 dark:to-blue-900/20 rounded-2xl border border-green-200/50 dark:border-green-800/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-semibold text-slate-700 dark:text-slate-300">Tiền (Money)</span>
            </div>
            {isEditing ? (
              <Input
                value={tempMoney}
                onChange={(e) => setTempMoney(e.target.value)}
                placeholder="Nhập số tiền..."
                className="text-xl font-bold h-14 bg-white/80 dark:bg-slate-800/80 border-2 border-green-200 dark:border-green-800 focus:border-green-400 dark:focus:border-green-600 transition-all duration-300"
              />
            ) : (
              <div className="flex h-14 w-full rounded-xl border-2 border-green-200 dark:border-green-800 bg-white/80 dark:bg-slate-800/80 px-4 py-2 text-xl font-bold text-green-700 dark:text-green-400 items-center shadow-inner">
                {formatNumber(money)}
              </div>
            )}
          </div>
        </div>

        {/* Gold Section */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-orange-400/10 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative space-y-4 p-6 bg-gradient-to-r from-yellow-50/50 to-orange-50/50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl border border-yellow-200/50 dark:border-yellow-800/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                <Coins className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-semibold text-slate-700 dark:text-slate-300">Vàng (Gold)</span>
            </div>
            {isEditing ? (
              <Input
                value={tempGold}
                onChange={(e) => setTempGold(e.target.value)}
                placeholder="Nhập số vàng..."
                className="text-xl font-bold h-14 bg-white/80 dark:bg-slate-800/80 border-2 border-yellow-200 dark:border-yellow-800 focus:border-yellow-400 dark:focus:border-yellow-600 transition-all duration-300"
              />
            ) : (
              <div className="flex h-14 w-full rounded-xl border-2 border-yellow-200 dark:border-yellow-800 bg-white/80 dark:bg-slate-800/80 px-4 py-2 text-xl font-bold text-yellow-600 dark:text-yellow-400 items-center shadow-inner">
                {formatNumber(gold)}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons when editing */}
        {isEditing && (
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-200/50 dark:border-slate-700/50">
            <Button
              onClick={handleEdit}
              className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              💾 Lưu thay đổi
            </Button>
            <Button
              onClick={handleCancel}
              variant="outline"
              className="flex-1 py-3 text-lg font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 hover:scale-105"
            >
              ❌ Hủy bỏ
            </Button>
          </div>
        )}
      </CardContent>

      {/* QR Thank You Dialog */}
      {showThankYouDialog && (
        <QRThankYouDialog
          open={showThankYouDialog}
          onOpenChange={setShowThankYouDialog}
        />
      )}
    </Card>
  )
}
