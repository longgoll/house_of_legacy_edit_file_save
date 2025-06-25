'use client'

import React, { useState } from 'react'
import {
  FamilyMembersTable,
  FamilyMemberEditDialog,
  FamilyMembersLoading,
  FamilyMembersError,
  FamilyMembersFilter,
  useFamilyMembersData,
  useFilteredFamilyMembers,
  type FamilyMember
} from '@/components/family-members'
import { ExportButton } from '@/components/ui/export-button'
import { Button } from '@/components/ui/button'

export default function FamilyMembersPage() {
  const { familyMembers, loading, error, updateFamilyMember, reloadData } = useFamilyMembersData()
  const { 
    filters, 
    setFilters, 
    filteredMembers, 
    resetFilters, 
    totalCount, 
    filteredCount 
  } = useFilteredFamilyMembers(familyMembers)
  
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const handleEditMember = (member: FamilyMember) => {
    setEditingMember(member)
    setIsEditDialogOpen(true)
  }

  const handleSaveEdit = (updatedMember: FamilyMember) => {
    updateFamilyMember(updatedMember)
    setIsEditDialogOpen(false)
    setEditingMember(null)
  }

  const handleCancelEdit = () => {
    setIsEditDialogOpen(false)
    setEditingMember(null)
  }

  const handleDebugData = () => {
    console.log('=== DEBUG DATA ===')
    console.log('familyMembers count:', familyMembers.length)
    console.log('filteredMembers count:', filteredMembers.length)
    
    const gameDataString = sessionStorage.getItem('gameData')
    if (gameDataString) {
      try {
        const gameData = JSON.parse(gameDataString)
        let memberArray;
        if (Array.isArray(gameData.Member_now)) {
          memberArray = gameData.Member_now;
        } else if (gameData.Member_now?.value && Array.isArray(gameData.Member_now.value)) {
          memberArray = gameData.Member_now.value;
        }
        
        console.log('sessionStorage members count:', memberArray ? memberArray.length : 0)
        console.log('First 3 family members:', familyMembers.slice(0, 3))
        if (memberArray) {
          console.log('First 3 sessionStorage members:', memberArray.slice(0, 3))
        }
      } catch (error) {
        console.error('Error parsing sessionStorage data:', error)
      }
    }
    console.log('=== END DEBUG ===')
  }

  if (loading) {
    return <FamilyMembersLoading />
  }

  if (error) {
    return <FamilyMembersError error={error} onRetry={reloadData} />
  }

  return (
    <div className="container mx-auto p-4 pt-8">
      <div className="max-w-full">
        <div className="mb-6 text-center space-y-4">
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Tổng cộng: <span className="font-semibold text-blue-600">{totalCount} thành viên</span>
          </p>
          <div className="flex justify-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={reloadData}
              className="text-gray-600 hover:text-gray-800"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Tải lại dữ liệu
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDebugData}
              className="text-purple-600 hover:text-purple-800"
            >
              🔍 Debug Data
            </Button>
            <ExportButton 
              variant="outline" 
              size="sm"
              familyMembers={familyMembers}
            />
          </div>
        </div>

        <FamilyMembersFilter
          filters={filters}
          onFiltersChange={setFilters}
          onReset={resetFilters}
          memberCount={totalCount}
          filteredCount={filteredCount}
        />

        <FamilyMembersTable 
          familyMembers={filteredMembers}
          onEditMember={handleEditMember}
        />

        <FamilyMemberEditDialog
          member={editingMember}
          isOpen={isEditDialogOpen}
          onClose={handleCancelEdit}
          onSave={handleSaveEdit}
        />
      </div>
    </div>
  )
}
