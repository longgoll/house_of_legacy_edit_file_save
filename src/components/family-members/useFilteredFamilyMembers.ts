import { useMemo, useState, useEffect } from 'react'
import { FamilyMember } from './useFamilyMembersData'
import { FilterState } from './FamilyMembersFilter'

const DEFAULT_FILTERS: FilterState = {
  searchTerm: '',
  generation: 'all',
  gender: 'all',
  talentType: 'all',
  skillType: 'all',
  minAge: '',
  maxAge: '',
  sortBy: 'index',
  sortOrder: 'asc'
}

export const useFilteredFamilyMembers = (familyMembers: FamilyMember[]) => {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)

  // Load filters from localStorage on mount
  useEffect(() => {
    try {
      const savedFilters = localStorage.getItem('familyMembersFilters')
      if (savedFilters) {
        const parsedFilters = JSON.parse(savedFilters)
        setFilters({ ...DEFAULT_FILTERS, ...parsedFilters })
      }
    } catch (error) {
      console.warn('Failed to load saved filters:', error)
    }
  }, [])

  // Save filters to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem('familyMembersFilters', JSON.stringify(filters))
    } catch (error) {
      console.warn('Failed to save filters:', error)
    }
  }, [filters])

  const filteredAndSortedMembers = useMemo(() => {
    const filtered = familyMembers.filter(member => {
      // Search by name
      if (filters.searchTerm && !member.name.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
        return false
      }

      // Filter by generation
      if (filters.generation && filters.generation !== 'all') {
        if (filters.generation === '6') {
          // Generation 6+ means 6 or higher
          if (member.generation < 6) return false
        } else if (member.generation !== parseInt(filters.generation)) {
          return false
        }
      }

      // Filter by gender
      if (filters.gender && filters.gender !== 'all' && member.gender !== parseInt(filters.gender)) {
        return false
      }

      // Filter by talent type
      if (filters.talentType && filters.talentType !== 'all' && member.talentType !== parseInt(filters.talentType)) {
        return false
      }

      // Filter by skill type
      if (filters.skillType && filters.skillType !== 'all' && member.skillType !== parseInt(filters.skillType)) {
        return false
      }

      // Filter by age range
      if (filters.minAge && member.age < parseInt(filters.minAge)) {
        return false
      }
      if (filters.maxAge && member.age > parseInt(filters.maxAge)) {
        return false
      }

      return true
    })

    // Sort the filtered results
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        let aValue: string | number = a[filters.sortBy as keyof FamilyMember]
        let bValue: string | number = b[filters.sortBy as keyof FamilyMember]

        // Handle string comparisons (like name)
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          aValue = aValue.toLowerCase()
          bValue = bValue.toLowerCase()
        }

        let comparison = 0
        if (aValue < bValue) {
          comparison = -1
        } else if (aValue > bValue) {
          comparison = 1
        }

        return filters.sortOrder === 'desc' ? -comparison : comparison
      })
    }

    return filtered
  }, [familyMembers, filters])

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS)
  }

  return {
    filters,
    setFilters,
    filteredMembers: filteredAndSortedMembers,
    resetFilters,
    totalCount: familyMembers.length,
    filteredCount: filteredAndSortedMembers.length
  }
}
