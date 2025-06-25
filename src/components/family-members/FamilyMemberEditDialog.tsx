import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FamilyMember } from './useFamilyMembersData'

interface FamilyMemberEditDialogProps {
  member: FamilyMember | null
  isOpen: boolean
  onClose: () => void
  onSave: (member: FamilyMember) => void
}

export const FamilyMemberEditDialog: React.FC<FamilyMemberEditDialogProps> = ({
  member,
  isOpen,
  onClose,
  onSave
}) => {
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(member)

  React.useEffect(() => {
    if (member) {
      setEditingMember({ ...member })
    }
  }, [member])

  const handleInputChange = (field: keyof FamilyMember, value: string) => {
    if (!editingMember) return
    
    const numValue = Number(value)
    setEditingMember(prev => prev ? {
      ...prev,
      [field]: isNaN(numValue) ? 0 : numValue
    } : null)
  }

  const handleSave = () => {
    if (editingMember) {
      onSave(editingMember)
    }
  }

  if (!editingMember) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Chỉnh sửa thành viên gia đình
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Cập nhật thông tin chi tiết của thành viên gia đình #{editingMember.index}
          </DialogDescription>
        </DialogHeader>

        {/* Basic Information */}
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Thông tin cơ bản</h3>
            <div className="grid grid-cols-3 gap-4">
              {/* Name - Read Only */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Tên</label>
                <Input
                  type="text"
                  value={editingMember.name}
                  disabled
                  className="w-full bg-gray-100 cursor-not-allowed"
                />
                <div className="text-xs text-gray-500">Không thể chỉnh sửa</div>
              </div>

              {/* Generation - Read Only */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Thế hệ</label>
                <Input
                  type="number"
                  value={editingMember.generation}
                  disabled
                  className="w-full bg-gray-100 cursor-not-allowed"
                />
                <div className="text-xs text-gray-500">Không thể chỉnh sửa</div>
              </div>

              {/* Gender - Read Only */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Giới tính</label>
                <Input
                  type="text"
                  value={editingMember.gender === 0 ? 'Nữ' : 'Nam'}
                  disabled
                  className="w-full bg-gray-100 cursor-not-allowed"
                />
                <div className="text-xs text-gray-500">Không thể chỉnh sửa</div>
              </div>

              {/* Age */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Tuổi</label>
                <Input
                  type="number"
                  value={editingMember.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  min="0"
                  max="100"
                  className="w-full"
                />
              </div>

              {/* Lifespan */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Tuổi thọ</label>
                <Input
                  type="number"
                  value={editingMember.lifespan}
                  onChange={(e) => handleInputChange('lifespan', e.target.value)}
                  min="0"
                  max="150"
                  className="w-full"
                />
              </div>

              {/* Hobby */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Sở thích</label>
                <Input
                  type="number"
                  value={editingMember.hobby}
                  onChange={(e) => handleInputChange('hobby', e.target.value)}
                  min="0"
                  max="10"
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Main Talents */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Tài năng chính</h3>
            <div className="grid grid-cols-2 gap-4">
              {/* Văn Tài */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Văn Tài</label>
                <Input
                  type="number"
                  value={editingMember.literaryTalent}
                  onChange={(e) => handleInputChange('literaryTalent', e.target.value)}
                  min="0"
                  max="100"
                  className="w-full"
                />
              </div>

              {/* Võ Tài */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Võ Tài</label>
                <Input
                  type="number"
                  value={editingMember.martialTalent}
                  onChange={(e) => handleInputChange('martialTalent', e.target.value)}
                  min="0"
                  max="100"
                  className="w-full"
                />
              </div>

              {/* Thương Tài */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Thương Tài</label>
                <Input
                  type="number"
                  value={editingMember.commercialTalent}
                  onChange={(e) => handleInputChange('commercialTalent', e.target.value)}
                  min="0"
                  max="100"
                  className="w-full"
                />
              </div>

              {/* Nghệ Tài */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Nghệ Tài</label>
                <Input
                  type="number"
                  value={editingMember.artisticTalent}
                  onChange={(e) => handleInputChange('artisticTalent', e.target.value)}
                  min="0"
                  max="100"
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Attributes */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Thuộc tính</h3>
            <div className="grid grid-cols-3 gap-4">
              {/* Chiến Lược */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Chiến Lược</label>
                <Input
                  type="number"
                  value={editingMember.strategy}
                  onChange={(e) => handleInputChange('strategy', e.target.value)}
                  min="0"
                  max="100"
                  className="w-full"
                />
              </div>

              {/* Danh Tiếng */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Danh Tiếng</label>
                <Input
                  type="number"
                  value={editingMember.reputation}
                  onChange={(e) => handleInputChange('reputation', e.target.value)}
                  min="0"
                  max="100"
                  className="w-full"
                />
              </div>

              {/* May Mắn */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">May Mắn</label>
                <Input
                  type="number"
                  value={editingMember.luck}
                  onChange={(e) => handleInputChange('luck', e.target.value)}
                  min="0"
                  max="100"
                  className="w-full"
                />
              </div>

              {/* Quyến Rũ */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Quyến Rũ</label>
                <Input
                  type="number"
                  value={editingMember.charm}
                  onChange={(e) => handleInputChange('charm', e.target.value)}
                  min="0"
                  max="100"
                  className="w-full"
                />
              </div>

              {/* Sức Khỏe */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Sức Khỏe</label>
                <Input
                  type="number"
                  value={editingMember.health}
                  onChange={(e) => handleInputChange('health', e.target.value)}
                  min="0"
                  max="100"
                  className="w-full"
                />
              </div>

              {/* Thể Lực */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Thể Lực</label>
                <Input
                  type="number"
                  value={editingMember.stamina}
                  onChange={(e) => handleInputChange('stamina', e.target.value)}
                  min="0"
                  max="100"
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Special Abilities */}
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Khả năng đặc biệt</h3>
            <div className="grid grid-cols-2 gap-4">
              {/* Talent Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Loại Thiên Phú</label>
                <Input
                  type="number"
                  value={editingMember.talentType}
                  onChange={(e) => handleInputChange('talentType', e.target.value)}
                  min="0"
                  max="10"
                  className="w-full"
                />
                <div className="text-xs text-gray-500">
                  0: Không có, 1: Văn tài, 2: Võ tài, 3: Thương tài, 4: Nghệ tài
                </div>
              </div>

              {/* Talent Value */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Giá trị Thiên Phú</label>
                <Input
                  type="number"
                  value={editingMember.talent}
                  onChange={(e) => handleInputChange('talent', e.target.value)}
                  min="0"
                  max="100"
                  className="w-full"
                />
              </div>

              {/* Skill Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Loại Kỹ Năng</label>
                <Input
                  type="number"
                  value={editingMember.skillType}
                  onChange={(e) => handleInputChange('skillType', e.target.value)}
                  min="0"
                  max="10"
                  className="w-full"
                />
                <div className="text-xs text-gray-500">
                  0: Không có, 1: Đạo pháp, 2: Y học, 3: Vận may, 4: Bói toán, 5: Quyến rũ, 6: Thủ công
                </div>
              </div>

              {/* Skill Value */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Giá trị Kỹ Năng</label>
                <Input
                  type="number"
                  value={editingMember.skill}
                  onChange={(e) => handleInputChange('skill', e.target.value)}
                  min="0"
                  max="100"
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-end space-x-2 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="px-4 py-2"
          >
            Hủy
          </Button>
          <Button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700"
          >
            Lưu thay đổi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
