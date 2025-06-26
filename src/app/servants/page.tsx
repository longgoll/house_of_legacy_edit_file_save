'use client'

import React, { useState } from 'react'
import { ServantsTable, ServantsEditDialog, ServantsFilter, useServantsData, useFilteredServants, ServantsData } from '@/components/servants'

export default function ServantsPage() {
  const { servants, loading, error, updateServant } = useServantsData()
  const {
    filters,
    setFilters,
    filteredServants,
    resetFilters,
    totalCount,
    filteredCount
  } = useFilteredServants(servants)
  
  const [editingServant, setEditingServant] = useState<ServantsData | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const handleEditServant = (servant: ServantsData) => {
    setEditingServant(servant)
    setIsEditDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsEditDialogOpen(false)
    setEditingServant(null)
  }

  const handleSaveServant = (updatedServant: ServantsData) => {
    updateServant(updatedServant)
    handleCloseDialog()
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Đang tải dữ liệu hầu...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-red-800 mb-2">Lỗi tải dữ liệu</h2>
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    )
  }

  // Calculate statistics
  const femaleCount = filteredServants.filter(s => s.gender === 0).length
  const maleCount = filteredServants.filter(s => s.gender === 1).length
  const averageAge = filteredServants.length > 0 
    ? Math.round(filteredServants.reduce((sum, s) => sum + s.age, 0) / filteredServants.length)
    : 0
  const totalSalary = filteredServants.reduce((sum, s) => sum + s.monthlySalary, 0)
  const averageSalary = filteredServants.length > 0 
    ? Math.round(totalSalary / filteredServants.length)
    : 0

  // Format salary for display
  const formatSalary = (salary: number): string => {
    if (salary >= 1000000) {
      return `${(salary / 1000000).toFixed(1)}M`;
    } else if (salary >= 1000) {
      return `${(salary / 1000).toFixed(1)}K`;
    }
    return salary.toString();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            👥 Quản lý Hầu
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Thông tin chi tiết về các hầu trong gia đình
          </p>
        </div>

        <div className="bg-gradient-to-r from-emerald-100 to-teal-100 rounded-xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600">{filteredCount}</div>
              <div className="text-sm text-emerald-700 font-medium">Hiển thị / {totalCount} hầu</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-600">{femaleCount}</div>
              <div className="text-sm text-pink-700 font-medium">Nữ giới</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{maleCount}</div>
              <div className="text-sm text-blue-700 font-medium">Nam giới</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{averageAge}</div>
              <div className="text-sm text-green-700 font-medium">Tuổi trung bình</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{formatSalary(averageSalary)}</div>
              <div className="text-sm text-orange-700 font-medium">Lương TB/tháng</div>
            </div>
          </div>
        </div>

        {/* Total monthly cost */}
        <div className="bg-gradient-to-r from-orange-100 to-yellow-100 rounded-xl p-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600 mb-1">
              💰 Tổng chi phí hằng tháng: {formatSalary(totalSalary)}
            </div>
            <div className="text-sm text-orange-700">
              Chi phí trung bình mỗi hầu: {formatSalary(averageSalary)}
            </div>
          </div>
        </div>
      </div>

      <ServantsFilter
        filters={filters}
        onFiltersChange={setFilters}
        onReset={resetFilters}
        memberCount={totalCount}
        filteredCount={filteredCount}
      />

      <ServantsTable 
        servants={filteredServants}
        onEditServant={handleEditServant}
      />

      <ServantsEditDialog
        servant={editingServant}
        isOpen={isEditDialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSaveServant}
      />
    </div>
  )
}
