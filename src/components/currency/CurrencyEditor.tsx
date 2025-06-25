'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Edit3, Coins, DollarSign } from 'lucide-react'

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

  // Update temp values when props change
  React.useEffect(() => {
    setTempMoney(money)
    setTempGold(gold)
  }, [money, gold])

  const handleEdit = () => {
    if (isEditing) {
      // Save changes
      onUpdate(tempMoney, tempGold)
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
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl text-slate-800 flex items-center gap-2">
              <Coins className="h-5 w-5 text-yellow-600" />
              Quản lý tiền tệ
            </CardTitle>
            <CardDescription className="mt-1 flex items-center gap-2">
              Điều chỉnh số tiền và vàng trong game
              {dataLoaded && (
                <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  ✓ Đã tải dữ liệu
                </span>
              )}
            </CardDescription>
          </div>
          <Button
            onClick={handleEdit}
            variant={isEditing ? "default" : "outline"}
            size="sm"
            className="flex items-center gap-2"
          >
            <Edit3 className="h-4 w-4" />
            {isEditing ? 'Lưu' : 'Chỉnh sửa'}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Money Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <DollarSign className="h-4 w-4 text-green-600" />
            Tiền (Money)
          </div>
          {isEditing ? (
            <Input
              value={tempMoney}
              onChange={(e) => setTempMoney(e.target.value)}
              placeholder="Nhập số tiền..."
              className="text-lg font-semibold"
            />
          ) : (
            <div className="flex h-9 w-full rounded-md border border-input bg-slate-50 px-3 py-1 text-lg font-semibold text-green-700 items-center">
              {formatNumber(money)}
            </div>
          )}
        </div>

        {/* Gold Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <Coins className="h-4 w-4 text-yellow-600" />
            Vàng (Gold)
          </div>
          {isEditing ? (
            <Input
              value={tempGold}
              onChange={(e) => setTempGold(e.target.value)}
              placeholder="Nhập số vàng..."
              className="text-lg font-semibold"
            />
          ) : (
            <div className="flex h-9 w-full rounded-md border border-input bg-slate-50 px-3 py-1 text-lg font-semibold text-yellow-600 items-center">
              {formatNumber(gold)}
            </div>
          )}
        </div>

        {/* Action Buttons when editing */}
        {isEditing && (
          <div className="flex gap-3 pt-4 border-t">
            <Button
              onClick={handleEdit}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              Lưu thay đổi
            </Button>
            <Button
              onClick={handleCancel}
              variant="outline"
              className="flex-1"
            >
              Hủy
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
