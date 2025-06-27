'use client'

import React, { useState } from 'react'
import { toast } from 'sonner'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { EditIcon, TrashIcon, SearchIcon, ArrowUpIcon, ArrowDownIcon } from 'lucide-react'
import { InventoryItem } from './useInventoryManagerData'

interface InventoryTableProps {
  inventoryItems: InventoryItem[]
  onEdit: (item: InventoryItem) => void
  onDelete: (item: InventoryItem) => void
  onUpdateQuantity: (item: InventoryItem) => void
}

export function InventoryTable({ inventoryItems, onEdit, onDelete, onUpdateQuantity }: InventoryTableProps) {
  const [searchFilter, setSearchFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [editingQuantity, setEditingQuantity] = useState<{index: number, value: string} | null>(null)
  const [sortField, setSortField] = useState<'id' | 'name' | 'quantity' | 'category'>('id')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [filterType, setFilterType] = useState<'all' | 'unknown' | 'duplicates'>('all')

  // Get all available categories from inventory items
  const availableCategories = Array.from(new Set(inventoryItems.map(item => item.category))).sort()

  // Sort and filter items
  const processedItems = inventoryItems
    // First apply search filter
    .filter(item => {
      if (searchFilter) {
        return item.itemName.toLowerCase().includes(searchFilter.toLowerCase()) ||
               item.itemId.toString().includes(searchFilter)
      }
      return true
    })
    // Apply category filter
    .filter(item => {
      if (categoryFilter !== 'all') {
        return item.category === categoryFilter
      }
      return true
    })
    // Then apply type filter
    .filter(item => {
      switch (filterType) {
        case 'unknown':
          return item.itemName === 'Unknown Item'
        case 'duplicates':
          return inventoryItems.filter(i => i.itemId === item.itemId).length > 1
        case 'all':
        default:
          return true
      }
    })
    // Finally sort
    .sort((a, b) => {
      let comparison = 0
      
      switch (sortField) {
        case 'id':
          comparison = a.itemId - b.itemId
          break
        case 'name':
          comparison = a.itemName.localeCompare(b.itemName, 'vi')
          break
        case 'category':
          comparison = a.category.localeCompare(b.category, 'vi')
          break
        case 'quantity':
          comparison = a.quantity - b.quantity
          break
      }
      
      return sortDirection === 'asc' ? comparison : -comparison
    })

  const handleSort = (field: 'id' | 'name' | 'quantity' | 'category') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const getSortIcon = (field: 'id' | 'name' | 'quantity' | 'category') => {
    if (sortField !== field) return null
    return sortDirection === 'asc' ? 
      <ArrowUpIcon className="w-3 h-3 ml-1 inline" /> : 
      <ArrowDownIcon className="w-3 h-3 ml-1 inline" />
  }

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
      {/* Filters and search */}
      <div className="flex flex-wrap gap-4 items-center">
        {/* Search filter */}
        <div className="relative flex-1 min-w-64">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Tìm kiếm theo tên hoặc ID..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Type filter */}
        <Select value={filterType} onValueChange={(value: 'all' | 'unknown' | 'duplicates') => setFilterType(value)}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Bộ lọc" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả vật phẩm</SelectItem>
            <SelectItem value="unknown">Vật phẩm không xác định</SelectItem>
            <SelectItem value="duplicates">ID trùng lặp</SelectItem>
          </SelectContent>
        </Select>

        {/* Category filter */}
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Lọc theo danh mục" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả danh mục</SelectItem>
            {availableCategories.map(category => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Items count */}
        <div className="text-sm text-gray-500">
          Hiển thị {processedItems.length} / {inventoryItems.length} vật phẩm
        </div>
      </div>

      {/* Items table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">STT</TableHead>
              <TableHead 
                className="w-20 cursor-pointer hover:bg-gray-100" 
                onClick={() => handleSort('id')}
              >
                ID {getSortIcon('id')}
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('name')}
              >
                Tên vật phẩm {getSortIcon('name')}
              </TableHead>
              <TableHead 
                className="w-32 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('category')}
              >
                Danh mục {getSortIcon('category')}
              </TableHead>
              <TableHead 
                className="w-24 text-right cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('quantity')}
              >
                Số lượng {getSortIcon('quantity')}
              </TableHead>
              <TableHead className="w-24 text-center">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {processedItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  {searchFilter || filterType !== 'all' || categoryFilter !== 'all' ? 'Không tìm thấy vật phẩm nào' : 'Chưa có vật phẩm nào'}
                </TableCell>
              </TableRow>
            ) : (
              processedItems.map((item, displayIndex) => (
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
                  <TableCell>
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {item.category}
                    </span>
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
                          className="w-32 h-7 text-right"
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
