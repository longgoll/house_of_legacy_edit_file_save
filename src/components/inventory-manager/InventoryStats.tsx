'use client'

import React from 'react'
import { InventoryItem } from './useInventoryManagerData'

interface InventoryStatsProps {
  inventoryItems: InventoryItem[]
}

export function InventoryStats({ inventoryItems }: InventoryStatsProps) {
  if (inventoryItems.length === 0) return null

  return (
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
          <div className="text-gray-600">Vật phẩm có số lượng {'>'} 0:</div>
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
  )
}
