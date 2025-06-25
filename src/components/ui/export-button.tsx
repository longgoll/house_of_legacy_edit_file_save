'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { FamilyMember } from '@/components/family-members'

interface ExportButtonProps {
  className?: string
  variant?: 'default' | 'outline' | 'secondary' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
  disabled?: boolean
  familyMembers?: FamilyMember[]
}

export function ExportButton({ 
  className, 
  variant = 'default', 
  size = 'default',
  disabled = false,
  familyMembers
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
      // Parse gameData
      const gameData = JSON.parse(gameDataString)
      
      // Additional validation: ensure sessionStorage data is consistent
      if (familyMembers && familyMembers.length > 0) {
        console.log('Validating data consistency before export...')
        console.log(`Found ${familyMembers.length} family members in component state`)
        
        // Check if Member_now exists and has data
        let memberArray;
        if (Array.isArray(gameData.Member_now)) {
          memberArray = gameData.Member_now;
        } else if (gameData.Member_now?.value && Array.isArray(gameData.Member_now.value)) {
          memberArray = gameData.Member_now.value;
        }
        
        if (memberArray) {
          console.log(`Found ${memberArray.length} members in sessionStorage gameData`)
          
          if (memberArray.length !== familyMembers.length) {
            console.warn('Data count mismatch between component state and sessionStorage!')
          }
        }
      }
      
      // Format and export data
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
      
      console.log('Export completed successfully')
      alert('File đã được xuất thành công!')
    } catch (error) {
      console.error('Lỗi khi xuất file:', error)
      alert('Có lỗi xảy ra khi xuất file: ' + (error as Error).message)
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
