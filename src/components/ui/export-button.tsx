'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

interface ExportButtonProps {
  className?: string
  variant?: 'default' | 'outline' | 'secondary' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
  disabled?: boolean
}

export function ExportButton({ 
  className, 
  variant = 'default', 
  size = 'default',
  disabled = false 
}: ExportButtonProps) {
  const handleExportFile = () => {
    // Get gameData from sessionStorage
    const gameDataString = sessionStorage.getItem('gameData')
    const fileName = sessionStorage.getItem('fileName') || 'GameData_modified.es3'
    
    if (!gameDataString) {
      alert('Không có dữ liệu để xuất!')
      return
    }

    try {
      // Parse and re-stringify to ensure proper formatting
      const gameData = JSON.parse(gameDataString)
      const exportData = JSON.stringify(gameData, null, 2)
      
      // Create blob and download
      const blob = new Blob([exportData], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      
      // Create download link
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      
      // Cleanup
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      alert('File đã được xuất thành công!')
    } catch (error) {
      console.error('Lỗi khi xuất file:', error)
      alert('Có lỗi xảy ra khi xuất file!')
    }
  }

  return (
    <Button 
      onClick={handleExportFile}
      variant={variant}
      size={size}
      className={className}
      disabled={disabled}
    >
      <Download className="h-4 w-4" />
      Xuất file đã chỉnh sửa
    </Button>
  )
}
