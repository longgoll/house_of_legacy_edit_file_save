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

export interface ServantsFilterState {
  searchTerm: string
  gender: string
  minAge: string
  maxAge: string
  minSalary: string
  maxSalary: string
  sortBy: string
  sortOrder: 'asc' | 'desc'
}

interface ServantsFilterProps {
  filters: ServantsFilterState
  onFiltersChange: (filters: ServantsFilterState) => void
  onReset: () => void
  memberCount: number
  filteredCount: number
}

export const ServantsFilter: React.FC<ServantsFilterProps> = ({
  filters,
  onFiltersChange,
  onReset,
  memberCount,
  filteredCount
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleFilterChange = (key: keyof ServantsFilterState, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    })
  }

  const handleQuickFilter = (updates: Partial<ServantsFilterState>) => {
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
    <Card className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <div className="space-y-4">
        {/* Search and Basic Filters - Always Visible */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="🔍 Tìm kiếm theo tên hạ nhân..."
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
              className="bg-white border-blue-300 focus:border-blue-500"
            />
          </div>
          
          <Select 
            value={filters.gender} 
            onValueChange={(value) => handleFilterChange('gender', value)}
          >
            <SelectTrigger className="w-[130px] bg-white border-blue-300">
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
            className="border-blue-300 text-blue-700 hover:bg-blue-100"
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
          <div className="space-y-4 pt-4 border-t border-blue-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Input
                placeholder="Tuổi tối thiểu"
                type="number"
                value={filters.minAge}
                onChange={(e) => handleFilterChange('minAge', e.target.value)}
                className="bg-white border-blue-300 focus:border-blue-500"
              />

              <Input
                placeholder="Tuổi tối đa"
                type="number"
                value={filters.maxAge}
                onChange={(e) => handleFilterChange('maxAge', e.target.value)}
                className="bg-white border-blue-300 focus:border-blue-500"
              />

              <Input
                placeholder="Lương tối thiểu"
                type="number"
                value={filters.minSalary}
                onChange={(e) => handleFilterChange('minSalary', e.target.value)}
                className="bg-white border-blue-300 focus:border-blue-500"
              />

              <Input
                placeholder="Lương tối đa"
                type="number"
                value={filters.maxSalary}
                onChange={(e) => handleFilterChange('maxSalary', e.target.value)}
                className="bg-white border-blue-300 focus:border-blue-500"
              />
            </div>

            {/* Quick Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-gray-700">⚡ Lọc nhanh:</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickFilter({ minSalary: '1000' })}
                className={`${filters.minSalary === '1000' ? 'bg-yellow-100 border-yellow-400 text-yellow-700' : 'border-gray-300'} hover:bg-yellow-50`}
              >
                💰 Lương cao
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickFilter({ minAge: '50' })}
                className={`${filters.minAge === '50' ? 'bg-gray-100 border-gray-400 text-gray-700' : 'border-gray-300'} hover:bg-gray-50`}
              >
                🧓 Cao tuổi
              </Button>
            </div>
          </div>
        )}

        {/* Sort Controls */}
        <div className="flex flex-wrap gap-4 items-center pt-4 border-t border-blue-200">
          <span className="text-sm font-medium text-gray-700">📊 Sắp xếp theo:</span>
          
          <Select 
            value={filters.sortBy} 
            onValueChange={(value) => handleFilterChange('sortBy', value)}
          >
            <SelectTrigger className="w-[150px] bg-white border-blue-300">
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
              <SelectItem value="monthlySalary">Lương tháng</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={handleSortOrderToggle}
            className="border-blue-300 text-blue-700 hover:bg-blue-100"
          >
            {filters.sortOrder === 'asc' ? '📈 Tăng dần' : '📉 Giảm dần'}
          </Button>

          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600 bg-white px-3 py-2 rounded-lg border border-blue-200">
              Hiển thị: <span className="font-bold text-blue-600">{filteredCount}</span> / <span className="font-bold">{memberCount}</span> hạ nhân
            </div>
            
            {filteredCount < memberCount && (
              <div className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full border border-orange-200">
                🔍 Đang lọc ({memberCount - filteredCount} hạ nhân bị ẩn)
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
