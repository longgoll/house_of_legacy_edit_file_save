'use client'

import React, { useState } from 'react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getItemName, getItemCategory, searchItems } from '@/data/items'
import { SearchIcon } from 'lucide-react'
import { InventoryItem } from './useInventoryManagerData'

interface EditDialogProps {
  item: InventoryItem | null
  isOpen: boolean
  onClose: () => void
  onSave: (item: InventoryItem) => void
  isNew?: boolean
  inventoryItems: InventoryItem[]
}

export function EditDialog({ item, isOpen, onClose, onSave, isNew = false, inventoryItems }: EditDialogProps) {
  const [itemId, setItemId] = useState(item?.itemId?.toString() || '')
  const [quantity, setQuantity] = useState(item?.quantity?.toString() || '')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Array<{ id: number; name: string }>>([])

  React.useEffect(() => {
    if (item) {
      setItemId(item.itemId.toString())
      setQuantity(item.quantity.toString())
    } else {
      setItemId('')
      setQuantity('')
    }
    setSearchQuery('')
    setSearchResults([])
  }, [item, isOpen])

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const results = searchItems(searchQuery.trim())
      setSearchResults(results.slice(0, 15))
    }
  }

  const handleSelectItem = (id: number) => {
    setItemId(id.toString())
    setSearchResults([])
    setSearchQuery('')
  }

  const handleSave = () => {
    const parsedItemId = parseInt(itemId)
    const parsedQuantity = parseInt(quantity)
    
    if (isNaN(parsedItemId) || isNaN(parsedQuantity) || parsedItemId <= 0 || parsedQuantity < 0) {
      toast.error('Vui lòng nhập ID và số lượng hợp lệ')
      return
    }

    // Check for duplicates only when adding new items
    if (isNew) {
      const existingItem = inventoryItems.find(existingItem => existingItem.itemId === parsedItemId)
      if (existingItem) {
        toast.error(`⚠️ Vật phẩm "${getItemName(parsedItemId)}" đã tồn tại trong danh sách!\nSố lượng hiện tại: ${existingItem.quantity.toLocaleString()}\n\nVui lòng chỉnh sửa số lượng thay vì thêm mới.`, {
          duration: 5000,
          description: 'Vui lòng chỉnh sửa số lượng thay vì thêm mới.'
        })
        return
      }
    }

    const updatedItem: InventoryItem = {
      index: item?.index || 0,
      itemId: parsedItemId,
      itemName: getItemName(parsedItemId),
      category: getItemCategory(parsedItemId),
      quantity: parsedQuantity
    }

    onSave(updatedItem)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isNew ? 'Thêm vật phẩm mới' : 'Chỉnh sửa vật phẩm'}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Tìm kiếm vật phẩm</label>
            <div className="flex gap-2 mt-1">
              <Input
                placeholder="Nhập tên vật phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button onClick={handleSearch} size="sm">
                <SearchIcon className="w-4 h-4" />
              </Button>
            </div>
            
            {searchResults.length > 0 && (
              <div className="mt-2 max-h-60 overflow-y-auto border rounded-md">
                {searchResults.map((result) => (
                  <div
                    key={result.id}
                    className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0 flex justify-between items-center"
                    onClick={() => handleSelectItem(result.id)}
                  >
                    <div>
                      <div className="text-sm font-medium">{result.name}</div>
                      <div className="text-xs text-gray-500">ID: {result.id}</div>
                    </div>
                    <Button size="sm" variant="ghost">
                      Chọn
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">ID vật phẩm</label>
              <Input
                type="number"
                placeholder="Nhập ID vật phẩm"
                value={itemId}
                onChange={(e) => setItemId(e.target.value)}
                className="mt-1"
              />
              {itemId && (
                <div className="text-xs text-gray-600 mt-1 space-y-1">
                  <div>Tên: {getItemName(parseInt(itemId) || 0)}</div>
                  <div>Danh mục: <span className="inline-block px-1.5 py-0.5 text-xs bg-blue-100 text-blue-800 rounded">{getItemCategory(parseInt(itemId) || 0)}</span></div>
                </div>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Số lượng</label>
              <Input
                type="number"
                placeholder="Nhập số lượng"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleSave} className="flex-1">
              {isNew ? 'Thêm' : 'Lưu'}
            </Button>
            <Button variant="outline" onClick={onClose} className="flex-1">
              Hủy
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
