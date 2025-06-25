'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Coins, DollarSign } from 'lucide-react'

interface CurrencyDisplayProps {
  money: string
  gold: string
}

export function CurrencyDisplay({ money, gold }: CurrencyDisplayProps) {
  const formatNumber = (num: string) => {
    // If it's already formatted with commas, return as is
    if (num.includes(',')) return num
    
    // Otherwise, try to format as number
    const parsed = parseInt(num.replace(/,/g, ''))
    if (isNaN(parsed)) return num
    return parsed.toLocaleString()
  }

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardContent className="pt-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-green-600">Tiền</span>
            </div>
            <div className="text-2xl font-bold text-green-700">{formatNumber(money)}</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Coins className="h-5 w-5 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-600">Vàng</span>
            </div>
            <div className="text-2xl font-bold text-yellow-700">{formatNumber(gold)}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
