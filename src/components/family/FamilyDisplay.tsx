'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Trophy, Star } from 'lucide-react'

interface FamilyDisplayProps {
  familyName: string
  familyLevel: string
  familyReputation: string
}

export function FamilyDisplay({ familyName, familyLevel, familyReputation }: FamilyDisplayProps) {
  const formatNumber = (num: string) => {
    // If it's already formatted with commas, return as is
    if (num.includes(',')) return num
    
    // Otherwise, try to format as number
    const parsed = parseInt(num.replace(/,/g, ''))
    if (isNaN(parsed)) return num
    return parsed.toLocaleString()
  }

  const getLevelColor = (level: string) => {
    const levelNum = parseInt(level)
    if (levelNum >= 80) return 'text-purple-700 bg-purple-50'
    if (levelNum >= 60) return 'text-blue-700 bg-blue-50'
    if (levelNum >= 40) return 'text-green-700 bg-green-50'
    if (levelNum >= 20) return 'text-yellow-700 bg-yellow-50'
    return 'text-gray-700 bg-gray-50'
  }

  const getReputationColor = (reputation: string) => {
    const repNum = parseInt(reputation.replace(/,/g, ''))
    if (repNum >= 100000) return 'text-red-700 bg-red-50'
    if (repNum >= 50000) return 'text-orange-700 bg-orange-50'
    if (repNum >= 10000) return 'text-yellow-700 bg-yellow-50'
    if (repNum >= 1000) return 'text-green-700 bg-green-50'
    return 'text-blue-700 bg-blue-50'
  }

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl font-bold text-slate-800 flex items-center justify-center gap-2">
          <Users className="h-6 w-6 text-slate-600" />
          Thông tin gia tộc
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Family Name */}
        <div className="text-center p-6 bg-indigo-50 rounded-lg border border-indigo-100">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Users className="h-6 w-6 text-indigo-600" />
            <span className="text-lg font-medium text-indigo-600">Họ gia tộc</span>
          </div>
          <div className="text-3xl font-bold text-indigo-800">{familyName || 'Chưa có thông tin'}</div>
        </div>

        {/* Level and Reputation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Family Level */}
          <div className={`text-center p-6 rounded-lg border ${getLevelColor(familyLevel)}`}>
            <div className="flex items-center justify-center gap-2 mb-3">
              <Trophy className="h-5 w-5" />
              <span className="text-sm font-medium">Cấp bậc gia tộc</span>
            </div>
            <div className="text-3xl font-bold">
              {familyLevel || '0'}
            </div>
            <div className="text-sm mt-2 opacity-80">
              Cấp độ hiện tại
            </div>
          </div>

          {/* Family Reputation */}
          <div className={`text-center p-6 rounded-lg border ${getReputationColor(familyReputation)}`}>
            <div className="flex items-center justify-center gap-2 mb-3">
              <Star className="h-5 w-5" />
              <span className="text-sm font-medium">Điểm danh tiếng</span>
            </div>
            <div className="text-3xl font-bold">
              {formatNumber(familyReputation) || '0'}
            </div>
            <div className="text-sm mt-2 opacity-80">
              Điểm danh tiếng hiện tại
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
