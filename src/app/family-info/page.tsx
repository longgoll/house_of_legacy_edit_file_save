'use client'

import React from 'react'
import { FamilyDisplay } from '@/components/family/FamilyDisplay'
import { useFamilyData } from '@/components/family/useFamilyData'

export default function FamilyInfoPage() {
  const { familyName, familyLevel, familyReputation, dataLoaded } = useFamilyData()

  return (
    <div className="container mx-auto p-6 pt-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {!dataLoaded ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-400">Đang tải thông tin gia tộc...</p>
          </div>
        ) : (
          <FamilyDisplay
            familyName={familyName}
            familyLevel={familyLevel}
            familyReputation={familyReputation}
          />
        )}

        {/* Additional Information Card */}
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-lg p-6 border border-white/20 dark:border-slate-700/20 shadow-lg">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">Hướng dẫn</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white/40 dark:bg-slate-700/40 rounded-lg p-4">
              <h3 className="font-medium text-slate-700 dark:text-slate-300 mb-2">🏠 Họ gia tộc</h3>
              <p className="text-slate-600 dark:text-slate-400">Tên của gia tộc bạn đang tham gia</p>
            </div>
            <div className="bg-white/40 dark:bg-slate-700/40 rounded-lg p-4">
              <h3 className="font-medium text-slate-700 dark:text-slate-300 mb-2">🏆 Cấp bậc</h3>
              <p className="text-slate-600 dark:text-slate-400">Cấp độ hiện tại của gia tộc (0-100)</p>
            </div>
            <div className="bg-white/40 dark:bg-slate-700/40 rounded-lg p-4">
              <h3 className="font-medium text-slate-700 dark:text-slate-300 mb-2">⭐ Danh tiếng</h3>
              <p className="text-slate-600 dark:text-slate-400">Điểm danh tiếng tích lũy được</p>
            </div>
          </div>
        </div>
        </div>
      </div>
  )
}