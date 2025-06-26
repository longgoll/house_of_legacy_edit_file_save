import { useMemo, useState, useEffect } from 'react'
import { useMarriedRelativesData } from './useMarriedRelativesData'
import { MarriedRelativesFilterState } from './MarriedRelativesFilter'

const DEFAULT_FILTERS: MarriedRelativesFilterState = {
  searchTerm: '',
  gender: 'all',
  talentType: 'all',
  skillType: 'all',
  minAge: '',
  maxAge: '',
  sortBy: 'index',
  sortOrder: 'asc'
}

export const useFilteredMarriedRelatives = (marriedRelatives: useMarriedRelativesData[]) => {
  const [filters, setFilters] = useState<MarriedRelativesFilterState>(DEFAULT_FILTERS)

  // Load filters from localStorage on mount
  useEffect(() => {
    try {
      const savedFilters = localStorage.getItem('marriedRelativesFilters')
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
      localStorage.setItem('marriedRelativesFilters', JSON.stringify(filters))
    } catch (error) {
      console.warn('Failed to save filters:', error)
    }
  }, [filters])

  const filteredAndSortedRelatives = useMemo(() => {
    const filtered = marriedRelatives.filter(relative => {
      // Search by name
      if (filters.searchTerm && !relative.name.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
        return false
      }

      // Filter by gender
      if (filters.gender && filters.gender !== 'all' && relative.gender !== parseInt(filters.gender)) {
        return false
      }

      // Filter by talent type
      if (filters.talentType && filters.talentType !== 'all' && relative.talent !== parseInt(filters.talentType)) {
        return false
      }

      // Filter by skill type
      if (filters.skillType && filters.skillType !== 'all' && relative.skillType !== parseInt(filters.skillType)) {
        return false
      }

      // Filter by age range
      if (filters.minAge && relative.age < parseInt(filters.minAge)) {
        return false
      }
      if (filters.maxAge && relative.age > parseInt(filters.maxAge)) {
        return false
      }

      return true
    })

    // Sort the filtered results
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        let aValue: string | number = a[filters.sortBy as keyof useMarriedRelativesData]
        let bValue: string | number = b[filters.sortBy as keyof useMarriedRelativesData]

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
  }, [marriedRelatives, filters])

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS)
  }

  return {
    filters,
    setFilters,
    filteredRelatives: filteredAndSortedRelatives,
    resetFilters,
    totalCount: marriedRelatives.length,
    filteredCount: filteredAndSortedRelatives.length
  }
}
