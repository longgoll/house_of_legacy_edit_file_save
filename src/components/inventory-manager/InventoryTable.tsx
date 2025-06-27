'use client'

import React, { useState } from 'react'
import { toast } from 'sonner'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { EditIcon, TrashIcon, SearchIcon } from 'lucide-react'
import { InventoryItem } from './useInventoryManagerData'

interface InventoryTableProps {
  inventoryItems: InventoryItem[]
  onEdit: (item: InventoryItem) => void
  onDelete: (item: InventoryItem) => void
  onUpdateQuantity: (item: InventoryItem) => void
}

export function InventoryTable({ inventoryItems, onEdit, onDelete, onUpdateQuantity }: InventoryTableProps) {
  const [searchFilter, setSearchFilter] = useState('')
  const [editingQuantity, setEditingQuantity] = useState<{index: number, value: string} | null>(null)

  // Filter items based on search
  const filteredItems = inventoryItems.filter(item =>
    item.itemName.toLowerCase().includes(searchFilter.toLowerCase()) ||
    item.itemId.toString().includes(searchFilter)
  )

  const handleQuantityClick = (item: InventoryItem) => {
    setEditingQuantity({ index: item.index, value: item.quantity.toString() })
  }

  const handleQuantityChange = (value: string) => {
    if (editingQuantity) {
      setEditingQuantity({ ...editingQuantity, value })
    }
  }

  const handleQuantitySave = () => {
    if (editingQuantity) {
      const newQuantity = parseInt(editingQuantity.value)
      if (!isNaN(newQuantity) && newQuantity >= 0) {
        const item = inventoryItems.find(i => i.index === editingQuantity.index)
        if (item) {
          const oldQuantity = item.quantity
          onUpdateQuantity({
            ...item,
            quantity: newQuantity
          })
          toast.success(`✅ Đã cập nhật số lượng "${item.itemName}"`, {
            description: `${oldQuantity.toLocaleString()} → ${newQuantity.toLocaleString()}`
          })
        }
      }
      setEditingQuantity(null)
    }
  }

  const handleQuantityCancel = () => {
    setEditingQuantity(null)
  }

  return (
    <div className="space-y-4">
      {/* Search filter */}
      <div className="relative max-w-sm">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Tìm kiếm theo tên hoặc ID..."
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Items table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">STT</TableHead>
              <TableHead className="w-20">ID</TableHead>
              <TableHead>Tên vật phẩm</TableHead>
              <TableHead className="w-24 text-right">Số lượng</TableHead>
              <TableHead className="w-24 text-center">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  {searchFilter ? 'Không tìm thấy vật phẩm nào' : 'Chưa có vật phẩm nào'}
                </TableCell>
              </TableRow>
            ) : (
              filteredItems.map((item, displayIndex) => (
                <TableRow key={item.index} className="hover:bg-gray-50">
                  <TableCell className="font-medium">
                    {displayIndex + 1}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    <div className="flex items-center gap-2">
                      <span>{item.itemId}</span>
                      {inventoryItems.filter(i => i.itemId === item.itemId).length > 1 && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-1 py-0.5 rounded" title="ID trùng lặp">
                          ⚠️
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{item.itemName}</div>
                    {item.itemName === 'Unknown Item' && (
                      <div className="text-xs text-red-500">Vật phẩm không xác định</div>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {editingQuantity && editingQuantity.index === item.index ? (
                      <div className="flex items-center gap-1 justify-end">
                        <Input
                          type="number"
                          value={editingQuantity.value}
                          onChange={(e) => handleQuantityChange(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') handleQuantitySave()
                            if (e.key === 'Escape') handleQuantityCancel()
                          }}
                          className="w-20 h-7 text-right"
                          autoFocus
                        />
                        <Button size="sm" variant="ghost" onClick={handleQuantitySave} className="h-7 w-7 p-0">
                          ✓
                        </Button>
                        <Button size="sm" variant="ghost" onClick={handleQuantityCancel} className="h-7 w-7 p-0">
                          ✕
                        </Button>
                      </div>
                    ) : (
                      <span 
                        className="cursor-pointer hover:bg-blue-100 px-2 py-1 rounded"
                        onClick={() => handleQuantityClick(item)}
                        title="Click để chỉnh sửa số lượng"
                      >
                        {item.quantity.toLocaleString()}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 justify-center">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEdit(item)}
                      >
                        <EditIcon className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onDelete(item)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <TrashIcon className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
