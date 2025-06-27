'use client'

import React, { useState } from 'react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import { getItemName } from '@/data/items'
import { InventoryItem } from './useInventoryManagerData'

interface BatchAddModalProps {
  isOpen: boolean
  onClose: () => void
  onBatchAdd: (items: Array<{id: number, quantity: number}>) => void
  inventoryItems: InventoryItem[]
}

export function BatchAddModal({ isOpen, onClose, onBatchAdd, inventoryItems }: BatchAddModalProps) {
  const [batchAddText, setBatchAddText] = useState('')

  const handleBatchAdd = () => {
    const lines = batchAddText.trim().split('\n')
    let successCount = 0
    let errorCount = 0
    let duplicateCount = 0
    const duplicateItems: string[] = []
    const itemsToAdd: Array<{id: number, quantity: number}> = []

    lines.forEach(line => {
      const parts = line.trim().split(/[,\s]+/)
      if (parts.length >= 2) {
        const id = parseInt(parts[0])
        const quantity = parseInt(parts[1])
        
        if (!isNaN(id) && !isNaN(quantity) && id > 0 && quantity > 0) {
          // Check if item already exists
          const existingItem = inventoryItems.find(item => item.itemId === id)
          if (existingItem) {
            duplicateCount++
            const itemName = getItemName(id)
            duplicateItems.push(`${itemName} (ID: ${id})`)
          } else {
            itemsToAdd.push({ id, quantity })
            successCount++
          }
        } else {
          errorCount++
        }
      } else if (line.trim()) {
        errorCount++
      }
    })

    // Add items
    if (itemsToAdd.length > 0) {
      onBatchAdd(itemsToAdd)
    }

    // Show detailed feedback
    if (successCount > 0) {
      toast.success(`✅ Đã thêm thành công ${successCount} vật phẩm`)
    }
    if (duplicateCount > 0) {
      toast.warning(`⚠️ ${duplicateCount} vật phẩm đã tồn tại`, {
        description: duplicateItems.slice(0, 3).join(', ') + (duplicateItems.length > 3 ? '...' : ''),
        duration: 5000
      })
    }
    if (errorCount > 0) {
      toast.error(`❌ ${errorCount} dòng lỗi định dạng`)
    }

    if (successCount > 0) {
      setBatchAddText('')
      onClose()
    } else if (duplicateCount > 0 && errorCount === 0) {
      // If only duplicates, close modal but show message
      toast.info('💡 Mẹo: Bạn có thể click vào số lượng trong bảng để chỉnh sửa các vật phẩm đã tồn tại.')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>📋 Thêm hàng loạt vật phẩm</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Nhập danh sách vật phẩm (mỗi dòng: ID số_lượng)
            </label>
            <textarea
              placeholder="Ví dụ:&#10;68 10&#10;69 5&#10;70 3&#10;29 100"
              value={batchAddText}
              onChange={(e) => setBatchAddText(e.target.value)}
              className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md text-sm resize-none"
            />
          </div>
          
          <div className="bg-blue-50 p-3 rounded-lg">
            <h5 className="text-sm font-medium text-blue-900 mb-2">💡 Mẹo:</h5>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Mỗi dòng: ID khoảng_trắng số_lượng</li>
              <li>• Có thể dùng dấu phẩy: ID,số_lượng</li>
              <li>• Bỏ qua dòng trống</li>
            </ul>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={handleBatchAdd} 
              className="flex-1"
              disabled={!batchAddText.trim()}
            >
              <PlusIcon className="w-4 h-4 mr-1" />
              Thêm hàng loạt
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setBatchAddText('')}
              disabled={!batchAddText.trim()}
            >
              Xóa
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
