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

interface EditDialogProps {
  item: InventoryItem | null
  isOpen: boolean
  onClose: () => void
  onSave: (item: InventoryItem) => void
  isNew?: boolean
}

function EditDialog({ item, isOpen, onClose, onSave, isNew = false }: EditDialogProps) {
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
  }, [item])

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const results = searchItems(searchQuery.trim())
      setSearchResults(results.slice(0, 10)) // Limit to 10 results
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
      <DialogContent className="max-w-md">
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
              <div className="mt-2 max-h-40 overflow-y-auto border rounded-md">
                {searchResults.map((result) => (
                  <div
                    key={result.id}
                    className="p-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                    onClick={() => handleSelectItem(result.id)}
                  >
                    <div className="text-sm font-medium">{result.name}</div>
                    <div className="text-xs text-gray-500">ID: {result.id}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

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
    addNewItem(newItem.itemId, newItem.quantity)
    setIsAddDialogOpen(false)
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
              <Button 
                onClick={() => setIsAddDialogOpen(true)}
                size="sm"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Thêm vật phẩm
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
                        {item.itemId}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{item.itemName}</div>
                        {item.itemName === 'Unknown Item' && (
                          <div className="text-xs text-red-500">Vật phẩm không xác định</div>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {item.quantity.toLocaleString()}
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
      />

      {/* Add Dialog */}
      <EditDialog
        item={null}
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSave={handleAddNew}
        isNew={true}
      />
    </div>
  )
}

export default InventoryManagerPage