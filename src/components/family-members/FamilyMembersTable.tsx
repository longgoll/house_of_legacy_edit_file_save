import React from 'react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { FamilyMember } from './useFamilyMembersData'

interface FamilyMembersTableProps {
  familyMembers: FamilyMember[]
  onEditMember: (member: FamilyMember) => void
}

export const FamilyMembersTable: React.FC<FamilyMembersTableProps> = ({
  familyMembers,
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

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="px-3 py-2 text-left text-xs font-medium text-gray-700 min-w-[120px]">Tên</TableHead>
              <TableHead className="px-3 py-2 text-center text-xs font-medium text-gray-700 min-w-[60px]">Thế hệ</TableHead>
              <TableHead className="px-3 py-2 text-center text-xs font-medium text-gray-700 min-w-[70px]">Giới tính</TableHead>
              <TableHead className="px-3 py-2 text-center text-xs font-medium text-gray-700 min-w-[60px]">Tuổi</TableHead>
              <TableHead className="px-3 py-2 text-center text-xs font-medium text-gray-700 min-w-[70px]">Tuổi thọ</TableHead>
              <TableHead className="px-3 py-2 text-center text-xs font-medium text-gray-700 min-w-[70px]">Sở thích</TableHead>
              <TableHead className="px-3 py-2 text-center text-xs font-medium text-gray-700 min-w-[80px]">Văn Tài</TableHead>
              <TableHead className="px-3 py-2 text-center text-xs font-medium text-gray-700 min-w-[80px]">Võ Tài</TableHead>
              <TableHead className="px-3 py-2 text-center text-xs font-medium text-gray-700 min-w-[80px]">Thương Tài</TableHead>
              <TableHead className="px-3 py-2 text-center text-xs font-medium text-gray-700 min-w-[80px]">Nghệ Tài</TableHead>
              <TableHead className="px-3 py-2 text-center text-xs font-medium text-gray-700 min-w-[80px]">Chiến Lược</TableHead>
              <TableHead className="px-3 py-2 text-center text-xs font-medium text-gray-700 min-w-[80px]">Danh Tiếng</TableHead>
              <TableHead className="px-3 py-2 text-center text-xs font-medium text-gray-700 min-w-[80px]">May Mắn</TableHead>
              <TableHead className="px-3 py-2 text-center text-xs font-medium text-gray-700 min-w-[80px]">Quyến Rũ</TableHead>
              <TableHead className="px-3 py-2 text-center text-xs font-medium text-gray-700 min-w-[80px]">Sức Khỏe</TableHead>
              <TableHead className="px-3 py-2 text-center text-xs font-medium text-gray-700 min-w-[80px]">Thể Lực</TableHead>
              <TableHead className="px-3 py-2 text-center text-xs font-medium text-gray-700 min-w-[100px]">Loại Thiên Phú</TableHead>
              <TableHead className="px-3 py-2 text-center text-xs font-medium text-gray-700 min-w-[90px]">GT Thiên Phú</TableHead>
              <TableHead className="px-3 py-2 text-center text-xs font-medium text-gray-700 min-w-[100px]">Loại Kỹ Năng</TableHead>
              <TableHead className="px-3 py-2 text-center text-xs font-medium text-gray-700 min-w-[90px]">GT Kỹ Năng</TableHead>
              <TableHead className="px-3 py-2 text-center text-xs font-medium text-gray-700 min-w-[100px]">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {familyMembers.map((member, idx) => (
              <TableRow key={member.index} className={`hover:bg-gray-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                <TableCell className="px-3 py-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 font-medium text-sm">
                        {member.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 text-sm">{member.name}</div>
                      <div className="text-xs text-gray-500">#{member.index}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-3 py-2 text-center text-sm">{member.generation}</TableCell>
                <TableCell className="px-3 py-2 text-center text-sm">{getGenderName(member.gender)}</TableCell>
                <TableCell className="px-3 py-2 text-center text-sm">{member.age}</TableCell>
                <TableCell className="px-3 py-2 text-center text-sm">{member.lifespan}</TableCell>
                <TableCell className="px-3 py-2 text-center text-sm">{member.hobby}</TableCell>
                <TableCell className="px-3 py-2 text-center text-sm font-medium">{member.literaryTalent}</TableCell>
                <TableCell className="px-3 py-2 text-center text-sm font-medium">{member.martialTalent}</TableCell>
                <TableCell className="px-3 py-2 text-center text-sm font-medium">{member.commercialTalent}</TableCell>
                <TableCell className="px-3 py-2 text-center text-sm font-medium">{member.artisticTalent}</TableCell>
                <TableCell className="px-3 py-2 text-center text-sm font-medium">{member.strategy}</TableCell>
                <TableCell className="px-3 py-2 text-center text-sm font-medium">{member.reputation}</TableCell>
                <TableCell className="px-3 py-2 text-center text-sm font-medium">{member.luck}</TableCell>
                <TableCell className="px-3 py-2 text-center text-sm font-medium">{member.charm}</TableCell>
                <TableCell className="px-3 py-2 text-center text-sm font-medium">{member.health}</TableCell>
                <TableCell className="px-3 py-2 text-center text-sm font-medium">{member.stamina}</TableCell>
                <TableCell className="px-3 py-2 text-center text-sm">{getTalentTypeName(member.talentType)}</TableCell>
                <TableCell className="px-3 py-2 text-center text-sm font-medium">{member.talent}</TableCell>
                <TableCell className="px-3 py-2 text-center text-sm">{getSkillTypeName(member.skillType)}</TableCell>
                <TableCell className="px-3 py-2 text-center text-sm font-medium">{member.skill}</TableCell>
                <TableCell className="px-3 py-2 text-center">
                  <Button
                    onClick={() => onEditMember(member)}
                    variant="outline"
                    size="sm"
                    className="hover:bg-blue-50 hover:border-blue-300 text-xs"
                  >
                    Chỉnh sửa
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {familyMembers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-600 mb-1">Chưa có thành viên nào</h3>
            <p className="text-gray-500">Hãy thêm dữ liệu game để hiển thị thông tin thành viên gia đình</p>
          </div>
        )}
      </div>
    </div>
  )
}
