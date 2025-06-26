'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ServantsData } from './useServantsData'

interface ServantsTableProps {
  servants?: ServantsData[]
  onEditServant: (servant: ServantsData) => void
}

export const ServantsTable: React.FC<ServantsTableProps> = ({
  servants = [],
  onEditServant
}) => {
  // Helper functions to convert type numbers to readable text
  const getSkillTypeName = (type: number): string => {
    switch (type) {
      case 0: return 'Không có';
      case 1: return 'Đạo pháp';
      case 2: return 'Y học';
      case 3: return 'Vận may';
      case 4: return 'Bói toán';
      case 5: return 'Sự quyến rũ';
      case 6: return 'Thủ công';
      case 7: return 'Kinh doanh';
      case 8: return 'Lãnh đạo';
      case 9: return 'Chiến đấu';
      case 10: return 'Học thuật';
      default: return 'Không rõ';
    }
  };

  const getGenderName = (gender: number): string => {
    return gender === 0 ? 'Nữ' : 'Nam';
  };

  // Helper function to get status color based on value
  const getStatColor = (value: number): string => {
    if (value >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (value >= 60) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (value >= 40) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const StatBadge = ({ value }: { value: number }) => (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatColor(value)}`}>
      {value}
    </span>
  );

  // Helper function to format salary
  const formatSalary = (salary: number): string => {
    if (salary >= 1000000) {
      return `${(salary / 1000000).toFixed(1)}M`;
    } else if (salary >= 1000) {
      return `${(salary / 1000).toFixed(1)}K`;
    }
    return salary.toString();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-emerald-50 to-teal-100 border-b-2 border-emerald-200">
              <TableHead className="px-6 py-4 text-left font-bold text-gray-800 text-sm">👥 Thông tin hầu</TableHead>
              <TableHead className="px-4 py-4 text-center font-bold text-gray-800 text-sm">📊 Thông tin cơ bản</TableHead>
              <TableHead className="px-4 py-4 text-center font-bold text-gray-800 text-sm">⭐ Tài năng</TableHead>
              <TableHead className="px-4 py-4 text-center font-bold text-gray-800 text-sm">🎯 Kỹ năng & Lương</TableHead>
              <TableHead className="px-4 py-4 text-center font-bold text-gray-800 text-sm">💫 Chỉ số quan trọng</TableHead>
              <TableHead className="px-4 py-4 text-center font-bold text-gray-800 text-sm">⚙️ Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(servants || []).map((servant, idx) => (
              <TableRow key={servant.index} className={`hover:bg-emerald-50 transition-all duration-200 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'} border-b border-gray-100`}>
                {/* Servant Info Column */}
                <TableCell className="px-6 py-5">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white">
                      <span className="text-white font-bold text-xl">
                        {servant.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-gray-900 text-lg mb-1">{servant.name}</div>
                      <div className="text-sm text-gray-500 mb-2">ID: #{servant.index}</div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          servant.gender === 0 
                            ? 'bg-pink-100 text-pink-700' 
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {getGenderName(servant.gender)}
                        </span>
                      </div>
                    </div>
                  </div>
                </TableCell>

                {/* Basic Info Column */}
                <TableCell className="px-4 py-5">
                  <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600 font-medium">🎂 Tuổi:</span>
                      <span className="font-bold text-gray-900">{servant.age}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600 font-medium">⏰ Tuổi thọ:</span>
                      <span className="font-bold text-gray-900">{servant.lifespan}</span>
                    </div>
                  </div>
                </TableCell>

                {/* Talents Column */}
                <TableCell className="px-4 py-5">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-emerald-50 rounded-lg p-2 text-center border border-emerald-200">
                      <div className="text-xs text-emerald-600 font-medium mb-1">📚 Văn</div>
                      <StatBadge value={servant.literaryTalent} />
                    </div>
                    <div className="bg-red-50 rounded-lg p-2 text-center border border-red-200">
                      <div className="text-xs text-red-600 font-medium mb-1">⚔️ Võ</div>
                      <StatBadge value={servant.martialTalent} />
                    </div>
                    <div className="bg-amber-50 rounded-lg p-2 text-center border border-amber-200">
                      <div className="text-xs text-amber-600 font-medium mb-1">💰 Thương</div>
                      <StatBadge value={servant.commercialTalent} />
                    </div>
                    <div className="bg-purple-50 rounded-lg p-2 text-center border border-purple-200">
                      <div className="text-xs text-purple-600 font-medium mb-1">🎨 Nghệ</div>
                      <StatBadge value={servant.artisticTalent} />
                    </div>
                  </div>
                </TableCell>

                {/* Skills & Salary Column */}
                <TableCell className="px-4 py-5">
                  <div className="space-y-3">
                    <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-3 border border-orange-200">
                      <div className="text-xs text-orange-600 font-semibold mb-1">🎯 Kỹ năng</div>
                      <div className="text-sm font-bold text-orange-800">{getSkillTypeName(servant.skillType)}</div>
                      <div className="text-lg font-bold text-orange-900 mt-1">{servant.skillValue}</div>
                    </div>
                    <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-3 border border-green-200">
                      <div className="text-xs text-green-600 font-semibold mb-1">💸 Lương/tháng</div>
                      <div className="text-lg font-bold text-green-900">{formatSalary(servant.monthlySalary)}</div>
                    </div>
                  </div>
                </TableCell>

                {/* Important Stats Column */}
                <TableCell className="px-4 py-5">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-green-50 rounded-lg p-2 text-center border border-green-200">
                      <div className="text-xs text-green-600 font-medium mb-1">🍀 May mắn</div>
                      <StatBadge value={servant.luck} />
                    </div>
                    <div className="bg-blue-50 rounded-lg p-2 text-center border border-blue-200">
                      <div className="text-xs text-blue-600 font-medium mb-1">🏆 Danh tiếng</div>
                      <StatBadge value={servant.reputation} />
                    </div>
                    <div className="bg-rose-50 rounded-lg p-2 text-center border border-rose-200">
                      <div className="text-xs text-rose-600 font-medium mb-1">❤️ Sức khỏe</div>
                      <StatBadge value={servant.health} />
                    </div>
                    <div className="bg-pink-50 rounded-lg p-2 text-center border border-pink-200">
                      <div className="text-xs text-pink-600 font-medium mb-1">✨ Quyến rũ</div>
                      <StatBadge value={servant.charm} />
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-2 text-center border border-yellow-200">
                      <div className="text-xs text-yellow-600 font-medium mb-1">😊 Tâm trạng</div>
                      <StatBadge value={servant.mood} />
                    </div>
                    <div className="bg-indigo-50 rounded-lg p-2 text-center border border-indigo-200">
                      <div className="text-xs text-indigo-600 font-medium mb-1">🧠 Mưu lượt</div>
                      <StatBadge value={servant.strategy} />
                    </div>
                    <div className="bg-cyan-50 rounded-lg p-2 text-center border border-cyan-200">
                      <div className="text-xs text-cyan-600 font-medium mb-1">💪 Thể lực</div>
                      <StatBadge value={servant.physicalStrength} />
                    </div>
                  </div>
                </TableCell>

                {/* Action Column */}
                <TableCell className="px-4 py-5 text-center">
                  <Button
                    onClick={() => onEditServant(servant)}
                    variant="outline"
                    size="sm"
                    className="hover:bg-emerald-100 hover:border-emerald-400 hover:text-emerald-700 transition-all duration-200 font-semibold shadow-sm"
                  >
                    ✏️ Chỉnh sửa
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {(!servants || servants.length === 0) && (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-600 mb-2">Chưa có hầu nào</h3>
            <p className="text-gray-500 text-lg">Hãy thêm dữ liệu game để hiển thị thông tin các hầu</p>
          </div>
        )}
      </div>
    </div>
  )
}
