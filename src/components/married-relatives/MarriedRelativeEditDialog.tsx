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
import { useMarriedRelativesData } from './useMarriedRelativesData'

interface MarriedRelativeEditDialogProps {
  member: useMarriedRelativesData | null
  isOpen: boolean
  onClose: () => void
  onSave: (member: useMarriedRelativesData) => void
}

export const MarriedRelativeEditDialog: React.FC<MarriedRelativeEditDialogProps> = ({
  member,
  isOpen,
  onClose,
  onSave
}) => {
  const [editingMember, setEditingMember] = useState<useMarriedRelativesData | null>(member)

  React.useEffect(() => {
    if (member) {
      setEditingMember({ ...member })
    }
  }, [member])

  const handleInputChange = (field: keyof useMarriedRelativesData, value: string) => {
    if (!editingMember) return
    
    const numValue = Number(value)
    setEditingMember(prev => prev ? {
      ...prev,
      [field]: isNaN(numValue) ? 0 : numValue
    } : null)
  }

  const handleSelectChange = (field: keyof useMarriedRelativesData, value: string) => {
    if (!editingMember) return
    
    const numValue = Number(value)
    setEditingMember(prev => prev ? {
      ...prev,
      [field]: numValue
    } : null)
  }

  const handleSave = () => {
    if (editingMember) {
      onSave(editingMember)
    }
  }

  const handleMaxAllTalents = () => {
    if (!editingMember) return
    setEditingMember(prev => prev ? {
      ...prev,
      literaryTalent: 100,
      martialTalent: 100,
      commercialTalent: 100,
      artisticTalent: 100
    } : null)
  }

  const handleMaxAllAttributes = () => {
    if (!editingMember) return
    setEditingMember(prev => prev ? {
      ...prev,
      mood: 100,
      strategy: 100,
      reputation: 100,
      luck: 100,
      charm: 100,
      health: 100
    } : null)
  }

  if (!editingMember) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-6xl max-h-[90vh] flex flex-col">
        <DialogHeader className="pb-4 border-b border-gray-100 flex-shrink-0">
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
              {editingMember.name.charAt(0)}
            </div>
            <div>
              <div>Chỉnh sửa họ hàng kết hôn</div>
              <div className="text-sm font-normal text-gray-500 mt-1">
                {editingMember.name} - {editingMember.gender === 0 ? '👩 Nữ' : '👨 Nam'}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="basic" className="flex-1 flex flex-col min-h-0">
          <TabsList className="grid w-full grid-cols-4 mb-4 flex-shrink-0">
            <TabsTrigger value="basic" className="flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
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
            <TabsTrigger value="special" className="flex items-center gap-2">
              <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
              Đặc biệt
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto min-h-0">
            <TabsContent value="basic" className="space-y-6">
              <Card className="border-0 shadow-sm bg-gradient-to-r from-purple-50 to-pink-50">
                <CardHeader>
                  <CardTitle className="text-lg text-purple-900">Thông tin cá nhân</CardTitle>
                  <CardDescription>Thông tin cơ bản của họ hàng kết hôn</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-6">
                    {/* Name - Read Only */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <span className="w-1 h-4 bg-purple-500 rounded-full"></span>
                        Tên
                      </label>
                      <div className="relative">
                        <Input
                          type="text"
                          value={editingMember.name}
                          disabled
                          className="bg-gray-50 border-gray-200 text-gray-600 cursor-not-allowed"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">🔒 Trường này không thể chỉnh sửa</p>
                    </div>

                    {/* Gender - Read Only */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <span className="w-1 h-4 bg-purple-500 rounded-full"></span>
                        Giới tính
                      </label>
                      <div className="relative">
                        <Input
                          type="text"
                          value={editingMember.gender === 0 ? '👩 Nữ' : '👨 Nam'}
                          disabled
                          className="bg-gray-50 border-gray-200 text-gray-600 cursor-not-allowed"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">🔒 Trường này không thể chỉnh sửa</p>
                    </div>

                    {/* Age */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <span className="w-1 h-4 bg-green-500 rounded-full"></span>
                        Tuổi
                      </label>
                      <Input
                        type="number"
                        value={editingMember.age}
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
                        value={editingMember.lifespan}
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

                    {/* Hobby */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <span className="w-1 h-4 bg-green-500 rounded-full"></span>
                        Sở thích
                      </label>
                      <Select value={editingMember.hobby.toString()} onValueChange={(value) => handleSelectChange('hobby', value)}>
                        <SelectTrigger className="border-green-200 focus:border-green-500">
                          <SelectValue placeholder="Chọn sở thích" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Hương phấn</SelectItem>
                          <SelectItem value="1">Mực</SelectItem>
                          <SelectItem value="2">Hội họa</SelectItem>
                          <SelectItem value="3">Đồ cổ</SelectItem>
                          <SelectItem value="4">Bộ trà</SelectItem>
                          <SelectItem value="5">Hương</SelectItem>
                          <SelectItem value="6">Bình</SelectItem>
                          <SelectItem value="7">Rượu</SelectItem>
                          <SelectItem value="8">Âm nhạc</SelectItem>
                          <SelectItem value="9">Da</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="text-xs text-gray-500">
                        Chọn sở thích phù hợp cho họ hàng
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
                      <CardDescription>Các loại tài năng cơ bản của họ hàng</CardDescription>
                    </div>
                    <Button
                      onClick={handleMaxAllTalents}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-200 transform hover:scale-105"
                    >
                      <span className="mr-2">🚀</span>
                      Full 100
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    {/* Văn Tài */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <span className="text-lg">📚</span>
                        Văn Tài
                      </label>
                      <Input
                        type="number"
                        value={editingMember.literaryTalent}
                        onChange={(e) => handleInputChange('literaryTalent', e.target.value)}
                        min="0"
                        max="100"
                        className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    {/* Võ Tài */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <span className="text-lg">⚔️</span>
                        Võ Tài
                      </label>
                      <Input
                        type="number"
                        value={editingMember.martialTalent}
                        onChange={(e) => handleInputChange('martialTalent', e.target.value)}
                        min="0"
                        max="100"
                        className="border-red-200 focus:border-red-500 focus:ring-red-500"
                      />
                    </div>

                    {/* Thương Tài */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <span className="text-lg">💰</span>
                        Thương Tài
                      </label>
                      <Input
                        type="number"
                        value={editingMember.commercialTalent}
                        onChange={(e) => handleInputChange('commercialTalent', e.target.value)}
                        min="0"
                        max="100"
                        className="border-yellow-200 focus:border-yellow-500 focus:ring-yellow-500"
                      />
                    </div>

                    {/* Nghệ Tài */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <span className="text-lg">🎨</span>
                        Nghệ Tài
                      </label>
                      <Input
                        type="number"
                        value={editingMember.artisticTalent}
                        onChange={(e) => handleInputChange('artisticTalent', e.target.value)}
                        min="0"
                        max="100"
                        className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="attributes" className="space-y-6">
              <Card className="border-0 shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-lg text-blue-900">Thuộc tính cá nhân</CardTitle>
                      <CardDescription>Các thuộc tính đặc trưng của họ hàng</CardDescription>
                    </div>
                    <Button
                      onClick={handleMaxAllAttributes}
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-200 transform hover:scale-105"
                    >
                      <span className="mr-2">⚡</span>
                      Full 100
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    {[
                      { key: 'mood', label: 'Tâm Trạng', icon: '😊', colorClass: 'border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500' },
                      { key: 'strategy', label: 'Chiến Lược', icon: '🧠', colorClass: 'border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500' },
                      { key: 'reputation', label: 'Danh Tiếng', icon: '⭐', colorClass: 'border-yellow-200 focus:border-yellow-500 focus:ring-yellow-500' },
                      { key: 'luck', label: 'May Mắn', icon: '🍀', colorClass: 'border-green-200 focus:border-green-500 focus:ring-green-500' },
                      { key: 'charm', label: 'Quyến Rũ', icon: '✨', colorClass: 'border-pink-200 focus:border-pink-500 focus:ring-pink-500' },
                      { key: 'health', label: 'Sức Khỏe', icon: '❤️', colorClass: 'border-red-200 focus:border-red-500 focus:ring-red-500' },
                    ].map(({ key, label, icon, colorClass }) => (
                      <div key={key} className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <span className="text-lg">{icon}</span>
                          {label}
                        </label>
                        <Input
                          type="number"
                          value={editingMember[key as keyof useMarriedRelativesData] as number}
                          onChange={(e) => handleInputChange(key as keyof useMarriedRelativesData, e.target.value)}
                          min="0"
                          max="100"
                          className={colorClass}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="special" className="space-y-6">
              <Card className="border-0 shadow-sm bg-gradient-to-r from-orange-50 to-red-50">
                <CardHeader>
                  <CardTitle className="text-lg text-orange-900">Khả năng đặc biệt</CardTitle>
                  <CardDescription>Thiên phú và kỹ năng đặc biệt</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    {/* Talent Section */}
                    <div className="space-y-4 p-4 bg-white rounded-lg border border-orange-200">
                      <h4 className="font-semibold text-orange-800 flex items-center gap-2">
                        <span className="text-lg">🌟</span>
                        Thiên Phú
                      </h4>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">Loại Thiên Phú</label>
                          <Select value={editingMember.talent.toString()} onValueChange={(value) => handleSelectChange('talent', value)}>
                            <SelectTrigger className="w-full border-orange-200 focus:border-orange-500">
                              <SelectValue placeholder="Chọn loại thiên phú" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0">❌ Không có</SelectItem>
                              <SelectItem value="1">📚 Văn tài</SelectItem>
                              <SelectItem value="2">⚔️ Võ tài</SelectItem>
                              <SelectItem value="3">💰 Thương tài</SelectItem>
                              <SelectItem value="4">🎨 Nghệ tài</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">Giá trị Thiên Phú</label>
                          <Input
                            type="number"
                            value={editingMember.talentValue}
                            onChange={(e) => handleInputChange('talentValue', e.target.value)}
                            min="0"
                            max="100"
                            className="border-orange-200 focus:border-orange-500 focus:ring-orange-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Skill Section */}
                    <div className="space-y-4 p-4 bg-white rounded-lg border border-purple-200">
                      <h4 className="font-semibold text-purple-800 flex items-center gap-2">
                        <span className="text-lg">🔮</span>
                        Kỹ Năng
                      </h4>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">Loại Kỹ Năng</label>
                          <Select value={editingMember.skillType.toString()} onValueChange={(value) => handleSelectChange('skillType', value)}>
                            <SelectTrigger className="w-full border-purple-200 focus:border-purple-500">
                              <SelectValue placeholder="Chọn loại kỹ năng" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0">❌ Không có</SelectItem>
                              <SelectItem value="1">🙏 Đạo pháp</SelectItem>
                              <SelectItem value="2">🏥 Y học</SelectItem>
                              <SelectItem value="3">🎰 Vận may</SelectItem>
                              <SelectItem value="4">🔮 Bói toán</SelectItem>
                              <SelectItem value="5">💫 Sự quyến rũ</SelectItem>
                              <SelectItem value="6">🔨 Thủ công</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">Giá trị Kỹ Năng</label>
                          <Input
                            type="number"
                            value={editingMember.skill}
                            onChange={(e) => handleInputChange('skill', e.target.value)}
                            min="0"
                            max="100"
                            className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>

        <DialogFooter className="flex justify-between items-center pt-4 border-t border-gray-100 flex-shrink-0">
          <div className="text-sm text-gray-500">
            Họ hàng #{editingMember.index} • Cập nhật lần cuối: {new Date().toLocaleString('vi-VN')}
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
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium shadow-lg transition-all duration-200 transform hover:scale-105"
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
