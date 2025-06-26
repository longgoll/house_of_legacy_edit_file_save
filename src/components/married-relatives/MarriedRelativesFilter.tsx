import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export interface MarriedRelativesFilterState {
  searchTerm: string
  gender: string
  talentType: string
  skillType: string
  minAge: string
  maxAge: string
  sortBy: string
  sortOrder: 'asc' | 'desc'
}

interface MarriedRelativesFilterProps {
  filters: MarriedRelativesFilterState
  onFiltersChange: (filters: MarriedRelativesFilterState) => void
  onReset: () => void
  memberCount: number
  filteredCount: number
}

export const MarriedRelativesFilter: React.FC<MarriedRelativesFilterProps> = ({
  filters,
  onFiltersChange,
  onReset,
  memberCount,
  filteredCount
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleFilterChange = (key: keyof MarriedRelativesFilterState, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    })
  }

  const handleQuickFilter = (updates: Partial<MarriedRelativesFilterState>) => {
    onFiltersChange({
      ...filters,
      ...updates
    })
  }

  const handleSortOrderToggle = () => {
    onFiltersChange({
      ...filters,
      sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc'
    })
  }

  return (
    <Card className="mb-6 p-4 bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200">
      <div className="space-y-4">
        {/* Search and Basic Filters - Always Visible */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="🔍 Tìm kiếm theo tên họ hàng..."
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
              className="bg-white border-pink-300 focus:border-pink-500"
            />
          </div>
          
          <Select 
            value={filters.gender} 
            onValueChange={(value) => handleFilterChange('gender', value)}
          >
            <SelectTrigger className="w-[130px] bg-white border-pink-300">
              <SelectValue placeholder="Giới tính" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả giới tính</SelectItem>
              <SelectItem value="0">Nữ</SelectItem>
              <SelectItem value="1">Nam</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={() => setIsExpanded(!isExpanded)}
            className="border-pink-300 text-pink-700 hover:bg-pink-100"
          >
            {isExpanded ? '🔼 Thu gọn' : '🔽 Mở rộng'}
          </Button>

          <Button
            variant="outline"
            onClick={onReset}
            className="border-red-300 text-red-700 hover:bg-red-100"
          >
            🔄 Đặt lại
          </Button>
        </div>

        {/* Advanced Filters - Collapsible */}
        {isExpanded && (
          <div className="space-y-4 pt-4 border-t border-pink-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Select 
                value={filters.talentType} 
                onValueChange={(value) => handleFilterChange('talentType', value)}
              >
                <SelectTrigger className="bg-white border-pink-300">
                  <SelectValue placeholder="Thiên phú" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả thiên phú</SelectItem>
                  <SelectItem value="0">Không có</SelectItem>
                  <SelectItem value="1">📚 Văn tài</SelectItem>
                  <SelectItem value="2">⚔️ Võ tài</SelectItem>
                  <SelectItem value="3">💰 Thương tài</SelectItem>
                  <SelectItem value="4">🎨 Nghệ tài</SelectItem>
                </SelectContent>
              </Select>

              <Select 
                value={filters.skillType} 
                onValueChange={(value) => handleFilterChange('skillType', value)}
              >
                <SelectTrigger className="bg-white border-pink-300">
                  <SelectValue placeholder="Kỹ năng" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả kỹ năng</SelectItem>
                  <SelectItem value="0">Không có</SelectItem>
                  <SelectItem value="1">🙏 Đạo pháp</SelectItem>
                  <SelectItem value="2">💊 Y học</SelectItem>
                  <SelectItem value="3">🍀 Vận may</SelectItem>
                  <SelectItem value="4">🔮 Bói toán</SelectItem>
                  <SelectItem value="5">💫 Sự quyến rũ</SelectItem>
                  <SelectItem value="6">🔨 Thủ công</SelectItem>
                </SelectContent>
              </Select>

              <Input
                placeholder="Tuổi tối thiểu"
                type="number"
                value={filters.minAge}
                onChange={(e) => handleFilterChange('minAge', e.target.value)}
                className="bg-white border-pink-300 focus:border-pink-500"
              />

              <Input
                placeholder="Tuổi tối đa"
                type="number"
                value={filters.maxAge}
                onChange={(e) => handleFilterChange('maxAge', e.target.value)}
                className="bg-white border-pink-300 focus:border-pink-500"
              />
            </div>

            {/* Quick Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-gray-700">⚡ Lọc nhanh:</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickFilter({ talentType: '1' })}
                className={`${filters.talentType === '1' ? 'bg-green-100 border-green-400 text-green-700' : 'border-gray-300'} hover:bg-green-50`}
              >
                📚 Văn tài cao
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickFilter({ talentType: '2' })}
                className={`${filters.talentType === '2' ? 'bg-red-100 border-red-400 text-red-700' : 'border-gray-300'} hover:bg-red-50`}
              >
                ⚔️ Võ tài cao
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickFilter({ talentType: '3' })}
                className={`${filters.talentType === '3' ? 'bg-yellow-100 border-yellow-400 text-yellow-700' : 'border-gray-300'} hover:bg-yellow-50`}
              >
                💰 Thương tài cao
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickFilter({ minAge: '80' })}
                className={`${filters.minAge === '80' ? 'bg-purple-100 border-purple-400 text-purple-700' : 'border-gray-300'} hover:bg-purple-50`}
              >
                🧓 Cao tuổi
              </Button>
            </div>
          </div>
        )}

        {/* Sort Controls */}
        <div className="flex flex-wrap gap-4 items-center pt-4 border-t border-pink-200">
          <span className="text-sm font-medium text-gray-700">📊 Sắp xếp theo:</span>
          
          <Select 
            value={filters.sortBy} 
            onValueChange={(value) => handleFilterChange('sortBy', value)}
          >
            <SelectTrigger className="w-[150px] bg-white border-pink-300">
              <SelectValue placeholder="Sắp xếp" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="index">ID</SelectItem>
              <SelectItem value="name">Tên</SelectItem>
              <SelectItem value="age">Tuổi</SelectItem>
              <SelectItem value="literaryTalent">Văn tài</SelectItem>
              <SelectItem value="martialTalent">Võ tài</SelectItem>
              <SelectItem value="commercialTalent">Thương tài</SelectItem>
              <SelectItem value="artisticTalent">Nghệ tài</SelectItem>
              <SelectItem value="reputation">Danh tiếng</SelectItem>
              <SelectItem value="luck">May mắn</SelectItem>
              <SelectItem value="health">Sức khỏe</SelectItem>
              <SelectItem value="charm">Quyến rũ</SelectItem>
              <SelectItem value="strategy">Mưu lượt</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={handleSortOrderToggle}
            className="border-pink-300 text-pink-700 hover:bg-pink-100"
          >
            {filters.sortOrder === 'asc' ? '📈 Tăng dần' : '📉 Giảm dần'}
          </Button>

          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600 bg-white px-3 py-2 rounded-lg border border-pink-200">
              Hiển thị: <span className="font-bold text-pink-600">{filteredCount}</span> / <span className="font-bold">{memberCount}</span> họ hàng
            </div>
            
            {filteredCount < memberCount && (
              <div className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full border border-orange-200">
                🔍 Đang lọc ({memberCount - filteredCount} họ hàng bị ẩn)
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
