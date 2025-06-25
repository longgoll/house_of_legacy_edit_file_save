'use client'

import React, { useState } from 'react'
import {
  FamilyMembersTable,
  FamilyMemberEditDialog,
  FamilyMembersLoading,
  FamilyMembersError,
  PageHeader,
  useFamilyMembersData,
  type FamilyMember
} from '@/components/family-members'

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
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-full mx-auto">
        <PageHeader 
          title={`Thành Viên Gia Đình (${familyMembers.length} người)`}
          description="Quản lý thông tin các thành viên trong gia đình"
        />

        <div className="mt-6">
          <FamilyMembersTable 
            familyMembers={familyMembers}
            onEditMember={handleEditMember}
          />
        </div>

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
