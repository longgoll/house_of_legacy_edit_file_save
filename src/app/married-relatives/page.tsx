'use client'

import React from 'react'
import { MarriedRelativesTable } from '@/components/married-relatives'
import { useMemberQuData, useMarriedRelativesData } from '@/components/married-relatives/useMarriedRelativesData'

export default function MarriedRelativesPage() {
  const { memberQu: marriedRelatives, loading, error } = useMemberQuData()

  const handleEditMember = (member: useMarriedRelativesData) => {
    // You can implement an edit dialog here similar to family members
    console.log('Editing married relative:', member)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Đang tải dữ liệu họ hàng kết hôn...</p>
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            💕 Quản lý Họ hàng Kết hôn
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Thông tin chi tiết về các thành viên họ hàng đã kết hôn trong gia đình
          </p>
        </div>

        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{marriedRelatives.length}</div>
              <div className="text-sm text-purple-700 font-medium">Tổng số thành viên</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-600">
                {marriedRelatives.filter(m => m.gender === 0).length}
              </div>
              <div className="text-sm text-pink-700 font-medium">Nữ giới</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {marriedRelatives.filter(m => m.gender === 1).length}
              </div>
              <div className="text-sm text-blue-700 font-medium">Nam giới</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {marriedRelatives.length > 0 
                  ? Math.round(marriedRelatives.reduce((sum, m) => sum + m.age, 0) / marriedRelatives.length)
                  : 0
                }
              </div>
              <div className="text-sm text-green-700 font-medium">Tuổi trung bình</div>
            </div>
          </div>
        </div>
      </div>

      <MarriedRelativesTable 
        onEditMember={handleEditMember}
      />
    </div>
  )
}
