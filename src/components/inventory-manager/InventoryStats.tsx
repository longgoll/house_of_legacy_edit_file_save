'use client'

import React from 'react'
import { InventoryItem } from './useInventoryManagerData'

interface InventoryStatsProps {
  inventoryItems: InventoryItem[]
}

export function InventoryStats({ inventoryItems }: InventoryStatsProps) {
  if (inventoryItems.length === 0) return null

  // Calculate stats by category
  const categoryStats = inventoryItems.reduce((acc, item) => {
    const category = item.category
    if (!acc[category]) {
      acc[category] = {
        count: 0,
        totalQuantity: 0,
        items: []
      }
    }
    acc[category].count += 1
    acc[category].totalQuantity += item.quantity
    acc[category].items.push(item)
    return acc
  }, {} as Record<string, { count: number; totalQuantity: number; items: InventoryItem[] }>)

  const totalItems = inventoryItems.length
  const totalQuantity = inventoryItems.reduce((sum, item) => sum + item.quantity, 0)
  const totalCategories = Object.keys(categoryStats).length

  return (
    <div className="space-y-4">
      {/* Main stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg shadow-lg">
          <div className="text-2xl font-bold mb-1">{totalItems.toLocaleString()}</div>
          <div className="text-blue-100 text-sm">Tổng số loại vật phẩm</div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg shadow-lg">
          <div className="text-2xl font-bold mb-1">{totalQuantity.toLocaleString()}</div>
          <div className="text-green-100 text-sm">Tổng số lượng</div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg shadow-lg">
          <div className="text-2xl font-bold mb-1">{totalCategories}</div>
          <div className="text-purple-100 text-sm">Số danh mục</div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-lg shadow-lg">
          <div className="text-2xl font-bold mb-1">
            {inventoryItems.filter(item => item.itemName.includes('Unknown')).length}
          </div>
          <div className="text-orange-100 text-sm">Vật phẩm không xác định</div>
        </div>
      </div>

      {/* Category breakdown */}
      <div className="bg-white rounded-lg shadow-lg p-4">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">📊 Thống kê theo danh mục</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {Object.entries(categoryStats)
            .sort(([,a], [,b]) => b.count - a.count)
            .map(([category, stats]) => (
              <div key={category} className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors">
                <div className="text-sm font-medium text-gray-700 mb-1 truncate" title={category}>
                  {category}
                </div>
                <div className="text-xs text-gray-500">
                  <div>{stats.count} loại</div>
                  <div>{stats.totalQuantity.toLocaleString()} cái</div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
