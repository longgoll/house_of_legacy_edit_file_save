'use client'

import React, { useState } from 'react'
import { toast } from 'sonner'
import { 
  useInventoryManagerData, 
  InventoryItem,
  EditDialog,
  InventoryTable,
  QuickAddForm,
  BatchAddModal,
  InventoryStats,
  PageHeader
} from '@/components/inventory-manager'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getItemName } from '@/data/items'
import { PlusIcon, RefreshCwIcon } from 'lucide-react'

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
  const [showFloatingForm, setShowFloatingForm] = useState(false)
  const [showBatchModal, setShowBatchModal] = useState(false)

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item)
    setIsEditDialogOpen(true)
  }

  const handleSaveEdit = (updatedItem: InventoryItem) => {
    updateInventoryItem(updatedItem)
    toast.success(`✅ Đã cập nhật "${updatedItem.itemName}"`, {
      description: `Số lượng: ${updatedItem.quantity.toLocaleString()}`
    })
    setIsEditDialogOpen(false)
    setEditingItem(null)
  }

  const handleAddNew = (newItem: InventoryItem) => {
    // Check if item already exists
    const existingItem = inventoryItems.find(item => item.itemId === newItem.itemId)
    if (existingItem) {
      toast.error(`⚠️ Vật phẩm "${newItem.itemName}" đã tồn tại trong danh sách!`, {
        description: 'Vui lòng chỉnh sửa số lượng thay vì thêm mới.'
      })
      return
    }
    
    addNewItem(newItem.itemId, newItem.quantity)
    toast.success(`✅ Đã thêm "${newItem.itemName}"`, {
      description: `Số lượng: ${newItem.quantity.toLocaleString()}`
    })
    setIsAddDialogOpen(false)
  }

  const handleQuickAdd = (id: number, quantity: number) => {
    // Check if item already exists
    const existingItem = inventoryItems.find(item => item.itemId === id)
    if (existingItem) {
      const itemName = getItemName(id)
      toast.error(`⚠️ Vật phẩm "${itemName}" đã tồn tại trong danh sách!`, {
        description: `Số lượng hiện tại: ${existingItem.quantity.toLocaleString()}. Vui lòng click vào số lượng trong bảng để chỉnh sửa.`,
        duration: 5000
      })
      return
    }

    addNewItem(id, quantity)
    
    // Show success feedback
    const itemName = getItemName(id)
    toast.success(`✅ Đã thêm: ${itemName} x${quantity}`)
  }

  const handleBatchAdd = (items: Array<{id: number, quantity: number}>) => {
    items.forEach(item => {
      addNewItem(item.id, item.quantity)
    })
  }

  const handleDelete = (item: InventoryItem) => {
    toast(`Bạn có chắc muốn xóa "${item.itemName}"?`, {
      action: {
        label: 'Xóa',
        onClick: () => {
          removeItem(item.index)
          toast.success(`Đã xóa "${item.itemName}"`)
        }
      },
      cancel: {
        label: 'Hủy',
        onClick: () => {}
      },
      duration: 5000
    })
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
          <PageHeader
            title="Quản lý túi đồ"
            itemCount={inventoryItems.length}
            onReload={reloadData}
          />
        </CardHeader>

        <CardContent>
          <InventoryTable
            inventoryItems={inventoryItems}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onUpdateQuantity={updateInventoryItem}
          />

          <InventoryStats inventoryItems={inventoryItems} />
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
      <BatchAddModal
        isOpen={showBatchModal}
        onClose={() => setShowBatchModal(false)}
        onBatchAdd={handleBatchAdd}
        inventoryItems={inventoryItems}
      />

      {/* Floating Action Button with Quick Add Form */}
      <div className="fixed bottom-6 right-6 z-50">
        <QuickAddForm
          isVisible={showFloatingForm}
          onClose={() => setShowFloatingForm(false)}
          onAdd={handleQuickAdd}
          onOpenDetailDialog={() => setIsAddDialogOpen(true)}
          onOpenBatchModal={() => setShowBatchModal(true)}
          inventoryItems={inventoryItems}
        />
        
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