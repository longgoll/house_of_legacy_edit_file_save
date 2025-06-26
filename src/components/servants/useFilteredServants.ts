import { useMemo, useState, useEffect } from 'react'
import { ServantsData } from './useServantsData'
import { ServantsFilterState } from './ServantsFilter'

const DEFAULT_FILTERS: ServantsFilterState = {
  searchTerm: '',
  gender: 'all',
  minAge: '',
  maxAge: '',
  minSalary: '',
  maxSalary: '',
  sortBy: 'index',
  sortOrder: 'asc'
}

export const useFilteredServants = (servants: ServantsData[]) => {
  const [filters, setFilters] = useState<ServantsFilterState>(DEFAULT_FILTERS)

  // Load filters from localStorage on mount
  useEffect(() => {
    try {
      const savedFilters = localStorage.getItem('servantsFilters')
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
      localStorage.setItem('servantsFilters', JSON.stringify(filters))
    } catch (error) {
      console.warn('Failed to save filters:', error)
    }
  }, [filters])

  const filteredAndSortedServants = useMemo(() => {
    const filtered = servants.filter(servant => {
      // Search by name
      if (filters.searchTerm && !servant.name.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
        return false
      }

      // Filter by gender
      if (filters.gender && filters.gender !== 'all' && servant.gender !== parseInt(filters.gender)) {
        return false
      }

      // Filter by age range
      if (filters.minAge && servant.age < parseInt(filters.minAge)) {
        return false
      }
      if (filters.maxAge && servant.age > parseInt(filters.maxAge)) {
        return false
      }

      // Filter by salary range
      if (filters.minSalary && servant.monthlySalary < parseInt(filters.minSalary)) {
        return false
      }
      if (filters.maxSalary && servant.monthlySalary > parseInt(filters.maxSalary)) {
        return false
      }

      return true
    })

    // Sort the filtered results
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        let aValue: string | number = a[filters.sortBy as keyof ServantsData]
        let bValue: string | number = b[filters.sortBy as keyof ServantsData]

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
  }, [servants, filters])

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS)
  }

  return {
    filters,
    setFilters,
    filteredServants: filteredAndSortedServants,
    resetFilters,
    totalCount: servants.length,
    filteredCount: filteredAndSortedServants.length
  }
}
