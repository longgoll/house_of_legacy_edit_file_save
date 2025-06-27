'use client'

import React, { useState } from 'react'
import { useInventoryManagerData, InventoryItem } from '@/components/inventory-manager/useInventoryManagerData'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { getItemName, searchItems } from '@/data/items'
import { PlusIcon, EditIcon, TrashIcon, SearchIcon, RefreshCwIcon } from 'lucide-react'

// Define the props for the EditDialog component
interface EditDialogProps {
  item: InventoryItem | null
  isOpen: boolean
  onClose: () => void
  onSave: (item: InventoryItem) => void
  isNew?: boolean
  inventoryItems: InventoryItem[]
}

function EditDialog({ item, isOpen, onClose, onSave, isNew = false, inventoryItems }: EditDialogProps) {
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
      setSearchResults(results.slice(0, 15)) // Increased to 15 results
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
      alert('Vui lòng nhập ID và số lượng hợp lệ')
      return
    }

    // Check for duplicates only when adding new items
    if (isNew) {
      const existingItem = inventoryItems.find(existingItem => existingItem.itemId === parsedItemId)
      if (existingItem) {
        alert(`⚠️ Vật phẩm "${getItemName(parsedItemId)}" đã tồn tại trong danh sách!\nSố lượng hiện tại: ${existingItem.quantity.toLocaleString()}\n\nVui lòng chỉnh sửa số lượng thay vì thêm mới.`)
        return
      }
    }

    const updatedItem: InventoryItem = {
      index: item?.index || 0,
      itemId: parsedItemId,
      itemName: getItemName(parsedItemId),
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
                <div className="text-xs text-gray-600 mt-1">
                  Tên: {getItemName(parseInt(itemId) || 0)}
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

const InventoryManagerPage = () => {
  const { 
    inventoryItems, 
    loading, 
    error, 
    updateInventoryItem, 
    addNewItem, 
    removeItem, 
    reloadData 
  } = useInventoryManagerData()

  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [searchFilter, setSearchFilter] = useState('')
  const [quickAddId, setQuickAddId] = useState('')
  const [quickAddQuantity, setQuickAddQuantity] = useState('')
  const [batchAddText, setBatchAddText] = useState('')
  const [editingQuantity, setEditingQuantity] = useState<{index: number, value: string} | null>(null)
  const [showFloatingForm, setShowFloatingForm] = useState(false)
  const [showBatchModal, setShowBatchModal] = useState(false)

  // Filter items based on search
  const filteredItems = inventoryItems.filter(item =>
    item.itemName.toLowerCase().includes(searchFilter.toLowerCase()) ||
    item.itemId.toString().includes(searchFilter)
  )

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item)
    setIsEditDialogOpen(true)
  }

  const handleSaveEdit = (updatedItem: InventoryItem) => {
    updateInventoryItem(updatedItem)
    setIsEditDialogOpen(false)
    setEditingItem(null)
  }

  const handleAddNew = (newItem: InventoryItem) => {
    // Check if item already exists
    const existingItem = inventoryItems.find(item => item.itemId === newItem.itemId)
    if (existingItem) {
      alert(`⚠️ Vật phẩm "${newItem.itemName}" đã tồn tại trong danh sách!\nVui lòng chỉnh sửa số lượng thay vì thêm mới.`)
      return
    }
    
    addNewItem(newItem.itemId, newItem.quantity)
    setIsAddDialogOpen(false)
  }

  const handleQuickAdd = () => {
    const parsedId = parseInt(quickAddId)
    const parsedQuantity = parseInt(quickAddQuantity)
    
    if (isNaN(parsedId) || isNaN(parsedQuantity) || parsedId <= 0 || parsedQuantity <= 0) {
      alert('Vui lòng nhập ID và số lượng hợp lệ')
      return
    }

    // Check if item already exists
    const existingItem = inventoryItems.find(item => item.itemId === parsedId)
    if (existingItem) {
      const itemName = getItemName(parsedId)
      alert(`⚠️ Vật phẩm "${itemName}" đã tồn tại trong danh sách!\nSố lượng hiện tại: ${existingItem.quantity.toLocaleString()}\n\nVui lòng click vào số lượng trong bảng để chỉnh sửa.`)
      return
    }

    addNewItem(parsedId, parsedQuantity)
    setQuickAddId('')
    setQuickAddQuantity('')
    
    // Show success feedback
    const itemName = getItemName(parsedId)
    alert(`✅ Đã thêm: ${itemName} x${parsedQuantity}`)
  }

  const handleBatchAdd = () => {
    const lines = batchAddText.trim().split('\n')
    let successCount = 0
    let errorCount = 0
    let duplicateCount = 0
    const duplicateItems: string[] = []

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
            addNewItem(id, quantity)
            successCount++
          }
        } else {
          errorCount++
        }
      } else if (line.trim()) {
        errorCount++
      }
    })

    // Show detailed feedback
    let message = ''
    if (successCount > 0) {
      message += `✅ Đã thêm thành công ${successCount} vật phẩm`
    }
    if (duplicateCount > 0) {
      message += `${successCount > 0 ? '\n' : ''}⚠️ ${duplicateCount} vật phẩm đã tồn tại:\n${duplicateItems.slice(0, 5).join('\n')}${duplicateItems.length > 5 ? '\n...' : ''}`
    }
    if (errorCount > 0) {
      message += `${(successCount > 0 || duplicateCount > 0) ? '\n' : ''}❌ ${errorCount} dòng lỗi định dạng`
    }

    if (message) {
      alert(message)
    }

    if (successCount > 0) {
      setBatchAddText('')
      setShowBatchModal(false)
    } else if (duplicateCount > 0 && errorCount === 0) {
      // If only duplicates, close modal but show message
      alert('💡 Mẹo: Bạn có thể click vào số lượng trong bảng để chỉnh sửa các vật phẩm đã tồn tại.')
    }
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
          updateInventoryItem({
            ...item,
            quantity: newQuantity
          })
        }
      }
      setEditingQuantity(null)
    }
  }

  const handleQuantityCancel = () => {
    setEditingQuantity(null)
  }

  const handleDelete = (item: InventoryItem) => {
    if (confirm(`Bạn có chắc muốn xóa "${item.itemName}"?`)) {
      removeItem(item.index)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Lỗi</h3>
              <p className="text-red-600">{error}</p>
              <Button 
                onClick={reloadData} 
                className="mt-4"
                variant="outline"
              >
                <RefreshCwIcon className="w-4 h-4 mr-2" />
                Thử lại
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">Quản lý túi đồ</CardTitle>
              <p className="text-gray-600 mt-1">
                Tổng số loại vật phẩm: {inventoryItems.length}
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={reloadData}
                variant="outline"
                size="sm"
              >
                <RefreshCwIcon className="w-4 h-4 mr-2" />
                Làm mới
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Search filter */}
          <div className="mb-4">
            <div className="relative max-w-sm">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Tìm kiếm theo tên hoặc ID..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="pl-10"
              />
            </div>
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
                            onClick={() => handleEdit(item)}
                          >
                            <EditIcon className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(item)}
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

          {/* Summary */}
          {inventoryItems.length > 0 && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2">Thống kê</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-gray-600">Tổng loại vật phẩm:</div>
                  <div className="font-semibold">{inventoryItems.length}</div>
                </div>
                <div>
                  <div className="text-gray-600">Tổng số lượng:</div>
                  <div className="font-semibold">
                    {inventoryItems.reduce((sum, item) => sum + item.quantity, 0).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">Vật phẩm có số lượng {'>'}0:</div>
                  <div className="font-semibold">
                    {inventoryItems.filter(item => item.quantity > 0).length}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">Vật phẩm không xác định:</div>
                  <div className="font-semibold text-red-600">
                    {inventoryItems.filter(item => item.itemName === 'Unknown Item').length}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <EditDialog
        item={editingItem}
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false)
          setEditingItem(null)
        }}
        onSave={handleSaveEdit}
        inventoryItems={inventoryItems}
      />

      {/* Add Dialog */}
      <EditDialog
        item={null}
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSave={handleAddNew}
        isNew={true}
        inventoryItems={inventoryItems}
      />

      {/* Batch Add Modal */}
      <Dialog open={showBatchModal} onOpenChange={setShowBatchModal}>
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
                onClick={() => {
                  handleBatchAdd()
                  setShowBatchModal(false)
                }} 
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

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {showFloatingForm && (
          <div className="bg-white rounded-lg shadow-2xl border border-gray-200 p-4 mb-4 min-w-[320px] animate-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-900">⚡ Thêm nhanh</h4>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowFloatingForm(false)}
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
                  disabled={!quickAddId || !quickAddQuantity || inventoryItems.some(item => item.itemId === parseInt(quickAddId))}
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Thêm
                </Button>
              </div>
              
              {quickAddId && (
                <div className="text-xs text-gray-600 bg-blue-50 p-2 rounded border-l-2 border-blue-300">
                  <strong>Tên:</strong> {getItemName(parseInt(quickAddId) || 0)}
                  {inventoryItems.some(item => item.itemId === parseInt(quickAddId)) && (
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
                  onClick={() => setIsAddDialogOpen(true)}
                  className="flex-1 text-xs"
                >
                  📝 Chi tiết
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowBatchModal(true)}
                  className="flex-1 text-xs"
                >
                  📋 Hàng loạt
                </Button>
              </div>
            </div>
          </div>
        )}
        
        <Button
          onClick={() => setShowFloatingForm(!showFloatingForm)}
          className={`h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 ${
            showFloatingForm 
              ? 'bg-red-600 hover:bg-red-700 rotate-45' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
          size="sm"
        >
          <PlusIcon className="h-6 w-6" />
        </Button>
      </div>
    </div>
  )
}

export default InventoryManagerPage