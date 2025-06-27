'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PlusIcon } from 'lucide-react'
import { getItemName } from '@/data/items'
import { InventoryItem } from './useInventoryManagerData'

interface QuickAddFormProps {
  isVisible: boolean
  onClose: () => void
  onAdd: (id: number, quantity: number) => void
  onOpenDetailDialog: () => void
  onOpenBatchModal: () => void
  inventoryItems: InventoryItem[]
}

export function QuickAddForm({ 
  isVisible, 
  onClose, 
  onAdd, 
  onOpenDetailDialog, 
  onOpenBatchModal,
  inventoryItems 
}: QuickAddFormProps) {
  const [quickAddId, setQuickAddId] = useState('')
  const [quickAddQuantity, setQuickAddQuantity] = useState('')

  const handleQuickAdd = () => {
    const parsedId = parseInt(quickAddId)
    const parsedQuantity = parseInt(quickAddQuantity)
    
    if (isNaN(parsedId) || isNaN(parsedQuantity) || parsedId <= 0 || parsedQuantity <= 0) {
      return
    }

    onAdd(parsedId, parsedQuantity)
    setQuickAddId('')
    setQuickAddQuantity('')
  }

  const isDuplicate = quickAddId && inventoryItems.some(item => item.itemId === parseInt(quickAddId))

  if (!isVisible) return null

  return (
    <div className="bg-white rounded-lg shadow-2xl border border-gray-200 p-4 mb-4 min-w-[320px] animate-in slide-in-from-bottom-2 duration-200">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-gray-900">⚡ Thêm nhanh</h4>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onClose}
          className="h-6 w-6 p-0 hover:bg-red-100"
        >
          ×
        </Button>
      </div>
      
      <div className="space-y-3">
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="ID"
            value={quickAddId}
            onChange={(e) => setQuickAddId(e.target.value)}
            className="w-20 text-sm"
            onKeyPress={(e) => e.key === 'Enter' && quickAddQuantity && handleQuickAdd()}
          />
          <Input
            type="number"
            placeholder="SL"
            value={quickAddQuantity}
            onChange={(e) => setQuickAddQuantity(e.target.value)}
            className="w-20 text-sm"
            onKeyPress={(e) => e.key === 'Enter' && quickAddId && handleQuickAdd()}
          />
          <Button 
            onClick={handleQuickAdd} 
            size="sm"
            className="whitespace-nowrap bg-blue-600 hover:bg-blue-700"
            disabled={!quickAddId.trim() || !quickAddQuantity.trim() || Boolean(isDuplicate)}
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            Thêm
          </Button>
        </div>
        
        {quickAddId && (
          <div className="text-xs text-gray-600 bg-blue-50 p-2 rounded border-l-2 border-blue-300">
            <strong>Tên:</strong> {getItemName(parseInt(quickAddId) || 0)}
            {isDuplicate && (
              <div className="text-orange-600 font-medium mt-1">
                ⚠️ Vật phẩm đã tồn tại - chỉ có thể chỉnh sửa số lượng
              </div>
            )}
          </div>
        )}
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onOpenDetailDialog}
            className="flex-1 text-xs"
          >
            📝 Chi tiết
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onOpenBatchModal}
            className="flex-1 text-xs"
          >
            📋 Hàng loạt
          </Button>
        </div>
      </div>
    </div>
  )
}
