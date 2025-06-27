'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { RefreshCwIcon } from 'lucide-react'

interface PageHeaderProps {
  title: string
  itemCount: number
  onReload: () => void
}

export function PageHeader({ title, itemCount, onReload }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-gray-600 mt-1">
          Tổng số loại vật phẩm: {itemCount}
        </p>
      </div>
      <div className="flex gap-2">
        <Button 
          onClick={onReload}
          variant="outline"
          size="sm"
        >
          <RefreshCwIcon className="w-4 h-4 mr-2" />
          Làm mới
        </Button>
      </div>
    </div>
  )
}
