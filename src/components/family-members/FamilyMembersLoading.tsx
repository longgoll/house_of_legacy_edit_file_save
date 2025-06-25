import React from 'react'

export const FamilyMembersLoading: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200 border-t-blue-600 mx-auto"></div>
          <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-t-blue-400 animate-spin mx-auto" style={{animationDelay: '0.1s', animationDuration: '1.5s'}}></div>
        </div>
        <div className="space-y-2">
          <p className="text-xl font-semibold text-slate-700">Đang tải dữ liệu</p>
          <p className="text-slate-500">Thành viên gia đình đang được chuẩn bị...</p>
        </div>
      </div>
    </div>
  )
}
