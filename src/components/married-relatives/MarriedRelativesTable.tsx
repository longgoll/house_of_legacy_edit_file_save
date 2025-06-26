'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useMarriedRelativesData } from './useMarriedRelativesData'

interface MarriedRelativesTableProps {
  marriedRelatives?: useMarriedRelativesData[]
  onEditMember: (member: useMarriedRelativesData) => void
}

export const MarriedRelativesTable: React.FC<MarriedRelativesTableProps> = ({
  marriedRelatives = [],
  onEditMember
}) => {
  // Helper functions to convert type numbers to readable text
  const getTalentTypeName = (type: number): string => {
    switch (type) {
      case 0: return 'Không có';
      case 1: return 'Văn tài';
      case 2: return 'Võ tài';
      case 3: return 'Thương tài';
      case 4: return 'Nghệ tài';
      default: return 'Không rõ';
    }
  };

  const getSkillTypeName = (type: number): string => {
    switch (type) {
      case 0: return 'Không có';
      case 1: return 'Đạo pháp';
      case 2: return 'Y học';
      case 3: return 'Vận may';
      case 4: return 'Bói toán';
      case 5: return 'Sự quyến rũ';
      case 6: return 'Thủ công';
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

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-blue-50 to-indigo-100 border-b-2 border-blue-200">
              <TableHead className="px-6 py-4 text-left font-bold text-gray-800 text-sm">💕 Họ hàng kết hôn</TableHead>
              <TableHead className="px-4 py-4 text-center font-bold text-gray-800 text-sm">📊 Thông tin cơ bản</TableHead>
              <TableHead className="px-4 py-4 text-center font-bold text-gray-800 text-sm">⭐ Tài năng chính</TableHead>
              <TableHead className="px-4 py-4 text-center font-bold text-gray-800 text-sm">🎯 Kỹ năng đặc biệt</TableHead>
              <TableHead className="px-4 py-4 text-center font-bold text-gray-800 text-sm">💫 Chỉ số quan trọng</TableHead>
              <TableHead className="px-4 py-4 text-center font-bold text-gray-800 text-sm">⚙️ Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(marriedRelatives || []).map((member, idx) => (
              <TableRow key={member.index} className={`hover:bg-blue-50 transition-all duration-200 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'} border-b border-gray-100`}>
                {/* Member Info Column */}
                <TableCell className="px-6 py-5">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white">
                      <span className="text-white font-bold text-xl">
                        {member.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-gray-900 text-lg mb-1">{member.name}</div>
                      <div className="text-sm text-gray-500 mb-2">ID: #{member.index}</div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          member.gender === 0 
                            ? 'bg-pink-100 text-pink-700' 
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {getGenderName(member.gender)}
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
                      <span className="font-bold text-gray-900">{member.age}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600 font-medium">⏰ Tuổi thọ:</span>
                      <span className="font-bold text-gray-900">{member.lifespan}</span>
                    </div>
                  </div>
                </TableCell>

                {/* Main Talents Column */}
                <TableCell className="px-4 py-5">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-emerald-50 rounded-lg p-2 text-center border border-emerald-200">
                      <div className="text-xs text-emerald-600 font-medium mb-1">📚 Văn</div>
                      <StatBadge value={member.literaryTalent} />
                    </div>
                    <div className="bg-red-50 rounded-lg p-2 text-center border border-red-200">
                      <div className="text-xs text-red-600 font-medium mb-1">⚔️ Võ</div>
                      <StatBadge value={member.martialTalent} />
                    </div>
                    <div className="bg-amber-50 rounded-lg p-2 text-center border border-amber-200">
                      <div className="text-xs text-amber-600 font-medium mb-1">💰 Thương</div>
                      <StatBadge value={member.commercialTalent} />
                    </div>
                    <div className="bg-purple-50 rounded-lg p-2 text-center border border-purple-200">
                      <div className="text-xs text-purple-600 font-medium mb-1">🎨 Nghệ</div>
                      <StatBadge value={member.artisticTalent} />
                    </div>
                  </div>
                </TableCell>

                {/* Special Skills Column */}
                <TableCell className="px-4 py-5">
                  <div className="space-y-3">
                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-3 border border-purple-200">
                      <div className="text-xs text-purple-600 font-semibold mb-1">🌟 Thiên phú</div>
                      <div className="text-sm font-bold text-purple-800">{getTalentTypeName(member.talent)}</div>
                      <div className="text-lg font-bold text-purple-900 mt-1">{member.talentValue}</div>
                    </div>
                    <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-3 border border-orange-200">
                      <div className="text-xs text-orange-600 font-semibold mb-1">🎯 Kỹ năng</div>
                      <div className="text-sm font-bold text-orange-800">{getSkillTypeName(member.skillType)}</div>
                      <div className="text-lg font-bold text-orange-900 mt-1">{member.skillType}</div>
                    </div>
                  </div>
                </TableCell>

                {/* Important Stats Column */}
                <TableCell className="px-4 py-5">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-blue-50 rounded-lg p-2 text-center border border-blue-200">
                      <div className="text-xs text-blue-600 font-medium mb-1">🏆 Danh tiếng</div>
                      <StatBadge value={member.reputation} />
                    </div>
                    <div className="bg-green-50 rounded-lg p-2 text-center border border-green-200">
                      <div className="text-xs text-green-600 font-medium mb-1">🍀 May mắn</div>
                      <StatBadge value={member.luck} />
                    </div>
                    <div className="bg-rose-50 rounded-lg p-2 text-center border border-rose-200">
                      <div className="text-xs text-rose-600 font-medium mb-1">❤️ Sức khỏe</div>
                      <StatBadge value={member.health} />
                    </div>
                    <div className="bg-pink-50 rounded-lg p-2 text-center border border-pink-200">
                      <div className="text-xs text-pink-600 font-medium mb-1">✨ Quyến rũ</div>
                      <StatBadge value={member.charm} />
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-2 text-center border border-yellow-200">
                      <div className="text-xs text-yellow-600 font-medium mb-1">� Tâm trạng</div>
                      <StatBadge value={member.mood} />
                    </div>
                    <div className="bg-indigo-50 rounded-lg p-2 text-center border border-indigo-200">
                      <div className="text-xs text-indigo-600 font-medium mb-1">🧠 Chiến lược</div>
                      <StatBadge value={member.strategy} />
                    </div>
                  </div>
                </TableCell>

                {/* Action Column */}
                <TableCell className="px-4 py-5 text-center">
                  <Button
                    onClick={() => onEditMember(member)}
                    variant="outline"
                    size="sm"
                    className="hover:bg-blue-100 hover:border-blue-400 hover:text-blue-700 transition-all duration-200 font-semibold shadow-sm"
                  >
                    ✏️ Chỉnh sửa
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {(!marriedRelatives || marriedRelatives.length === 0) && (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-600 mb-2">Chưa có họ hàng kết hôn nào</h3>
            <p className="text-gray-500 text-lg">Hãy thêm dữ liệu game để hiển thị thông tin họ hàng kết hôn</p>
          </div>
        )}
      </div>
    </div>
  )
}
