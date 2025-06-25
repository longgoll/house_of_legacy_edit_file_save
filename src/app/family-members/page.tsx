'use client'

import React, { useState } from 'react'
import {
  FamilyMembersTable,
  FamilyMemberEditDialog,
  FamilyMembersLoading,
  FamilyMembersError,
  useFamilyMembersData,
  type FamilyMember
} from '@/components/family-members'
import { ExportButton } from '@/components/ui/export-button'

export default function FamilyMembersPage() {
  const { familyMembers, loading, error, updateFamilyMember, reloadData } = useFamilyMembersData()
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
            Tổng cộng: <span className="font-semibold text-blue-600">{familyMembers.length} thành viên</span>
          </p>
          <ExportButton variant="outline" size="sm" />
        </div>

        <FamilyMembersTable 
          familyMembers={familyMembers}
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
