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
