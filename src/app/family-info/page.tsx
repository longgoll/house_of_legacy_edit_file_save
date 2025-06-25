'use client'

import React from 'react'
import { PageHeader } from '@/components/currency/PageHeader'
import { FamilyDisplay } from '@/components/family/FamilyDisplay'
import { useFamilyData } from '@/components/family/useFamilyData'

export default function FamilyInfoPage() {
  const { familyName, familyLevel, familyReputation, dataLoaded } = useFamilyData()

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      <div className="mx-auto max-w-4xl">
        <PageHeader 
          title="Thông tin gia tộc" 
          description="Xem thông tin chi tiết về gia tộc của bạn"
        />

        <div className="space-y-6">
          {!dataLoaded ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-slate-600">Đang tải thông tin gia tộc...</p>
            </div>
          ) : (
            <FamilyDisplay
              familyName={familyName}
              familyLevel={familyLevel}
              familyReputation={familyReputation}
            />
          )}

          {/* Additional Information Card */}
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 border border-white/20 shadow-lg">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Hướng dẫn</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white/40 rounded-lg p-4">
                <h3 className="font-medium text-slate-700 mb-2">🏠 Họ gia tộc</h3>
                <p className="text-slate-600">Tên của gia tộc bạn đang tham gia</p>
              </div>
              <div className="bg-white/40 rounded-lg p-4">
                <h3 className="font-medium text-slate-700 mb-2">🏆 Cấp bậc</h3>
                <p className="text-slate-600">Cấp độ hiện tại của gia tộc (0-100)</p>
              </div>
              <div className="bg-white/40 rounded-lg p-4">
                <h3 className="font-medium text-slate-700 mb-2">⭐ Danh tiếng</h3>
                <p className="text-slate-600">Điểm danh tiếng tích lũy được</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}