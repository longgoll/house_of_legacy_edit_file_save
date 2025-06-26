import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ServantsData } from './useServantsData'

interface ServantsEditDialogProps {
  servant: ServantsData | null
  isOpen: boolean
  onClose: () => void
  onSave: (servant: ServantsData) => void
}

export const ServantsEditDialog: React.FC<ServantsEditDialogProps> = ({
  servant,
  isOpen,
  onClose,
  onSave
}) => {
  const [editingServant, setEditingServant] = useState<ServantsData | null>(servant)

  React.useEffect(() => {
    if (servant) {
      setEditingServant({ ...servant })
    }
  }, [servant])

  const handleInputChange = (field: keyof ServantsData, value: string) => {
    if (!editingServant) return
    
    const numValue = Number(value)
    setEditingServant(prev => prev ? {
      ...prev,
      [field]: isNaN(numValue) ? 0 : numValue
    } : null)
  }

  const handleStringChange = (field: keyof ServantsData, value: string) => {
    if (!editingServant) return
    
    setEditingServant(prev => prev ? {
      ...prev,
      [field]: value
    } : null)
  }

  const handleSelectChange = (field: keyof ServantsData, value: string) => {
    if (!editingServant) return
    
    const numValue = Number(value)
    setEditingServant(prev => prev ? {
      ...prev,
      [field]: numValue
    } : null)
  }

  const handleSave = () => {
    if (editingServant) {
      onSave(editingServant)
    }
  }

  const handleMaxAllTalents = () => {
    if (!editingServant) return
    setEditingServant(prev => prev ? {
      ...prev,
      literaryTalent: 100,
      martialTalent: 100,
      commercialTalent: 100,
      artisticTalent: 100
    } : null)
  }

  const handleMaxAllAttributes = () => {
    if (!editingServant) return
    setEditingServant(prev => prev ? {
      ...prev,
      mood: 100,
      strategy: 100,
      reputation: 100,
      luck: 100,
      charm: 100,
      health: 100,
      physicalStrength: 100
    } : null)
  }

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

  if (!editingServant) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-6xl max-h-[90vh] flex flex-col">
        <DialogHeader className="pb-4 border-b border-gray-100 flex-shrink-0">
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold">
              {editingServant.name.charAt(0)}
            </div>
            <div>
              <div>Chỉnh sửa hầu cận</div>
              <div className="text-sm font-normal text-gray-500 mt-1">
                {editingServant.name} - {editingServant.gender === 0 ? '👩 Nữ' : '👨 Nam'}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="basic" className="flex-1 flex flex-col min-h-0">
          <TabsList className="grid w-full grid-cols-5 mb-4 flex-shrink-0">
            <TabsTrigger value="basic" className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              Thông tin cơ bản
            </TabsTrigger>
            <TabsTrigger value="talents" className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Tài năng
            </TabsTrigger>
            <TabsTrigger value="attributes" className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Thuộc tính
            </TabsTrigger>
            <TabsTrigger value="skills" className="flex items-center gap-2">
              <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
              Kỹ năng
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              Nâng cao
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto min-h-0">
            <TabsContent value="basic" className="space-y-6">
              <Card className="border-0 shadow-sm bg-gradient-to-r from-emerald-50 to-teal-50">
                <CardHeader>
                  <CardTitle className="text-lg text-emerald-900">Thông tin cá nhân</CardTitle>
                  <CardDescription>Thông tin cơ bản của hầu cận</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <span className="w-1 h-4 bg-emerald-500 rounded-full"></span>
                        Tên
                      </label>
                      <Input
                        type="text"
                        value={editingServant.name}
                        onChange={(e) => handleStringChange('name', e.target.value)}
                        className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                        placeholder="Nhập tên hầu cận"
                      />
                    </div>

                    {/* Gender */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <span className="w-1 h-4 bg-emerald-500 rounded-full"></span>
                        Giới tính
                      </label>
                      <Select value={editingServant.gender.toString()} onValueChange={(value) => handleSelectChange('gender', value)}>
                        <SelectTrigger className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">👩 Nữ</SelectItem>
                          <SelectItem value="1">👨 Nam</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Age */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <span className="w-1 h-4 bg-green-500 rounded-full"></span>
                        Tuổi
                      </label>
                      <Input
                        type="number"
                        value={editingServant.age}
                        onChange={(e) => handleInputChange('age', e.target.value)}
                        min="0"
                        max="100"
                        className="border-green-200 focus:border-green-500 focus:ring-green-500"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Min: 0</span>
                        <span>Max: 100</span>
                      </div>
                    </div>

                    {/* Lifespan */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <span className="w-1 h-4 bg-green-500 rounded-full"></span>
                        Tuổi thọ
                      </label>
                      <Input
                        type="number"
                        value={editingServant.lifespan}
                        onChange={(e) => handleInputChange('lifespan', e.target.value)}
                        min="0"
                        max="100"
                        className="border-green-200 focus:border-green-500 focus:ring-green-500"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Min: 0</span>
                        <span>Max: 100</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="talents" className="space-y-6">
              <Card className="border-0 shadow-sm bg-gradient-to-r from-green-50 to-emerald-50">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-lg text-green-900">Tài năng chính</CardTitle>
                      <CardDescription>Các loại tài năng cơ bản của hầu cận</CardDescription>
                    </div>
                    <Button
                      onClick={handleMaxAllTalents}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-200 transform hover:scale-105"
                    >
                      <span className="mr-2">🚀</span>
                      Max Tài năng
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    {/* Văn Tài */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-emerald-700 flex items-center gap-2">
                        <span className="w-1 h-4 bg-emerald-500 rounded-full"></span>
                        📚 Văn tài
                      </label>
                      <Input
                        type="number"
                        value={editingServant.literaryTalent}
                        onChange={(e) => handleInputChange('literaryTalent', e.target.value)}
                        min="0"
                        max="100"
                        className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Min: 0</span>
                        <span>Max: 100</span>
                      </div>
                    </div>

                    {/* Võ Tài */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-red-700 flex items-center gap-2">
                        <span className="w-1 h-4 bg-red-500 rounded-full"></span>
                        ⚔️ Võ tài
                      </label>
                      <Input
                        type="number"
                        value={editingServant.martialTalent}
                        onChange={(e) => handleInputChange('martialTalent', e.target.value)}
                        min="0"
                        max="100"
                        className="border-red-200 focus:border-red-500 focus:ring-red-500"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Min: 0</span>
                        <span>Max: 100</span>
                      </div>
                    </div>

                    {/* Thương Tài */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-amber-700 flex items-center gap-2">
                        <span className="w-1 h-4 bg-amber-500 rounded-full"></span>
                        💰 Thương tài
                      </label>
                      <Input
                        type="number"
                        value={editingServant.commercialTalent}
                        onChange={(e) => handleInputChange('commercialTalent', e.target.value)}
                        min="0"
                        max="100"
                        className="border-amber-200 focus:border-amber-500 focus:ring-amber-500"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Min: 0</span>
                        <span>Max: 100</span>
                      </div>
                    </div>

                    {/* Nghệ Tài */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-purple-700 flex items-center gap-2">
                        <span className="w-1 h-4 bg-purple-500 rounded-full"></span>
                        🎨 Nghệ tài
                      </label>
                      <Input
                        type="number"
                        value={editingServant.artisticTalent}
                        onChange={(e) => handleInputChange('artisticTalent', e.target.value)}
                        min="0"
                        max="100"
                        className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Min: 0</span>
                        <span>Max: 100</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="attributes" className="space-y-6">
              <Card className="border-0 shadow-sm bg-gradient-to-r from-blue-50 to-cyan-50">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-lg text-blue-900">Thuộc tính cá nhân</CardTitle>
                      <CardDescription>Các chỉ số quan trọng của hầu cận</CardDescription>
                    </div>
                    <Button
                      onClick={handleMaxAllAttributes}
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-200 transform hover:scale-105"
                    >
                      <span className="mr-2">⭐</span>
                      Max Thuộc tính
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-6">
                    {/* May mắn */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-green-700 flex items-center gap-2">
                        <span className="w-1 h-4 bg-green-500 rounded-full"></span>
                        🍀 May mắn
                      </label>
                      <Input
                        type="number"
                        value={editingServant.luck}
                        onChange={(e) => handleInputChange('luck', e.target.value)}
                        min="0"
                        max="100"
                        className="border-green-200 focus:border-green-500 focus:ring-green-500"
                      />
                    </div>

                    {/* Danh tiếng */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-blue-700 flex items-center gap-2">
                        <span className="w-1 h-4 bg-blue-500 rounded-full"></span>
                        🏆 Danh tiếng
                      </label>
                      <Input
                        type="number"
                        value={editingServant.reputation}
                        onChange={(e) => handleInputChange('reputation', e.target.value)}
                        min="0"
                        max="100"
                        className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    {/* Sức khỏe */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-rose-700 flex items-center gap-2">
                        <span className="w-1 h-4 bg-rose-500 rounded-full"></span>
                        ❤️ Sức khỏe
                      </label>
                      <Input
                        type="number"
                        value={editingServant.health}
                        onChange={(e) => handleInputChange('health', e.target.value)}
                        min="0"
                        max="100"
                        className="border-rose-200 focus:border-rose-500 focus:ring-rose-500"
                      />
                    </div>

                    {/* Quyến rũ */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-pink-700 flex items-center gap-2">
                        <span className="w-1 h-4 bg-pink-500 rounded-full"></span>
                        ✨ Quyến rũ
                      </label>
                      <Input
                        type="number"
                        value={editingServant.charm}
                        onChange={(e) => handleInputChange('charm', e.target.value)}
                        min="0"
                        max="100"
                        className="border-pink-200 focus:border-pink-500 focus:ring-pink-500"
                      />
                    </div>

                    {/* Tâm trạng */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-yellow-700 flex items-center gap-2">
                        <span className="w-1 h-4 bg-yellow-500 rounded-full"></span>
                        😊 Tâm trạng
                      </label>
                      <Input
                        type="number"
                        value={editingServant.mood}
                        onChange={(e) => handleInputChange('mood', e.target.value)}
                        min="0"
                        max="100"
                        className="border-yellow-200 focus:border-yellow-500 focus:ring-yellow-500"
                      />
                    </div>

                    {/* Mưu lượt */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-indigo-700 flex items-center gap-2">
                        <span className="w-1 h-4 bg-indigo-500 rounded-full"></span>
                        🧠 Mưu lượt
                      </label>
                      <Input
                        type="number"
                        value={editingServant.strategy}
                        onChange={(e) => handleInputChange('strategy', e.target.value)}
                        min="0"
                        max="100"
                        className="border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>

                    {/* Thể lực */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-cyan-700 flex items-center gap-2">
                        <span className="w-1 h-4 bg-cyan-500 rounded-full"></span>
                        💪 Thể lực
                      </label>
                      <Input
                        type="number"
                        value={editingServant.physicalStrength}
                        onChange={(e) => handleInputChange('physicalStrength', e.target.value)}
                        min="0"
                        max="100"
                        className="border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
                      />
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-4 text-center">
                    Tất cả thuộc tính có giá trị từ 0 đến 100
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="skills" className="space-y-6">
              <Card className="border-0 shadow-sm bg-gradient-to-r from-orange-50 to-red-50">
                <CardHeader>
                  <CardTitle className="text-lg text-orange-900">Kỹ năng chuyên môn</CardTitle>
                  <CardDescription>Kỹ năng và năng lực đặc biệt của hầu cận</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    {/* Skill Type */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-orange-700 flex items-center gap-2">
                        <span className="w-1 h-4 bg-orange-500 rounded-full"></span>
                        🎯 Loại kỹ năng
                      </label>
                      <Select value={editingServant.skillType.toString()} onValueChange={(value) => handleSelectChange('skillType', value)}>
                        <SelectTrigger className="border-orange-200 focus:border-orange-500 focus:ring-orange-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Không có</SelectItem>
                          <SelectItem value="1">Đạo pháp</SelectItem>
                          <SelectItem value="2">Y học</SelectItem>
                          <SelectItem value="3">Vận may</SelectItem>
                          <SelectItem value="4">Bói toán</SelectItem>
                          <SelectItem value="5">Sự quyến rũ</SelectItem>
                          <SelectItem value="6">Thủ công</SelectItem>
                          <SelectItem value="7">Kinh doanh</SelectItem>
                          <SelectItem value="8">Lãnh đạo</SelectItem>
                          <SelectItem value="9">Chiến đấu</SelectItem>
                          <SelectItem value="10">Học thuật</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-500">
                        Hiện tại: {getSkillTypeName(editingServant.skillType)}
                      </p>
                    </div>

                    {/* Skill Value */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-orange-700 flex items-center gap-2">
                        <span className="w-1 h-4 bg-orange-500 rounded-full"></span>
                        📊 Giá trị kỹ năng
                      </label>
                      <Input
                        type="number"
                        value={editingServant.skillValue}
                        onChange={(e) => handleInputChange('skillValue', e.target.value)}
                        min="0"
                        max="100"
                        className="border-orange-200 focus:border-orange-500 focus:ring-orange-500"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Min: 0</span>
                        <span>Max: 100</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-6">
              <Card className="border-0 shadow-sm bg-gradient-to-r from-purple-50 to-indigo-50">
                <CardHeader>
                  <CardTitle className="text-lg text-purple-900">Thông tin nâng cao</CardTitle>
                  <CardDescription>Các thông tin kinh tế và chỉ số đặc biệt</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    {/* Monthly Salary */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-green-700 flex items-center gap-2">
                        <span className="w-1 h-4 bg-green-500 rounded-full"></span>
                        💸 Lương hàng tháng
                      </label>
                      <Input
                        type="number"
                        value={editingServant.monthlySalary}
                        onChange={(e) => handleInputChange('monthlySalary', e.target.value)}
                        min="0"
                        className="border-green-200 focus:border-green-500 focus:ring-green-500"
                      />
                      <p className="text-xs text-gray-500">
                        Hiển thị: {editingServant.monthlySalary >= 1000000 
                          ? `${(editingServant.monthlySalary / 1000000).toFixed(1)}M` 
                          : editingServant.monthlySalary >= 1000 
                            ? `${(editingServant.monthlySalary / 1000).toFixed(1)}K` 
                            : editingServant.monthlySalary.toString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>

        <DialogFooter className="flex justify-between items-center pt-4 border-t border-gray-100 flex-shrink-0">
          <div className="text-sm text-gray-500">
            Hầu cận #{editingServant.index} • Cập nhật lần cuối: {new Date().toLocaleString('vi-VN')}
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Hủy bỏ
            </Button>
            <Button
              onClick={handleSave}
              className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Lưu thay đổi
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
