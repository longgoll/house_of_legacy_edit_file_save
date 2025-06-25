'use client'

import { useState, useEffect } from 'react'

export interface FamilyMember {
  index: number
  name: string
  generation: number
  gender: number // 0: nữ, 1: nam
  lifespan: number
  hobby: number
  age: number
  literaryTalent: number
  martialTalent: number
  commercialTalent: number
  artisticTalent: number
  strategy: number
  reputation: number
  luck: number
  charm: number
  health: number
  stamina: number
  talentType: number
  talent: number
  skillType: number
  skill: number
}

export const useFamilyMembersData = () => {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadFamilyMemberData = () => {
    try {
      const gameDataString = sessionStorage.getItem('gameData')
      
      if (!gameDataString) {
        setError('Không tìm thấy dữ liệu game trong sessionStorage')
        setLoading(false)
        return
      }

      const gameData = JSON.parse(gameDataString)
      
      // Debug: log the structure to understand the data
      console.log('Full gameData:', gameData)
      console.log('Member_now:', gameData.Member_now)
      
      if (!gameData.Member_now) {
        setError('Không tìm thấy dữ liệu Member_now trong gameData')
        setLoading(false)
        return
      }

      // Check if Member_now has value property and it's an array
      let memberArray;
      if (Array.isArray(gameData.Member_now)) {
        memberArray = gameData.Member_now;
      } else if (gameData.Member_now.value && Array.isArray(gameData.Member_now.value)) {
        memberArray = gameData.Member_now.value;
      } else {
        setError('Cấu trúc dữ liệu Member_now không hợp lệ')
        setLoading(false)
        return
      }

      console.log('Member array:', memberArray)
      console.log('Member count:', memberArray.length)

      const members: FamilyMember[] = memberArray.map((memberData: unknown, index: number) => {
        console.log(`Processing member ${index}:`, memberData)
        
        // Handle different possible structures
        let memberInfo: unknown[];
        
        if (Array.isArray(memberData)) {
          memberInfo = memberData;
        } else if (memberData && typeof memberData === 'object' && 'value' in memberData) {
          const memberObj = memberData as { value: unknown };
          if (Array.isArray(memberObj.value)) {
            memberInfo = memberObj.value;
          } else {
            console.warn(`Member ${index} value is not an array:`, memberObj.value);
            return null;
          }
        } else {
          console.warn(`Member ${index} has unexpected structure:`, memberData);
          return null;
        }

        console.log(`Member ${index} info array:`, memberInfo)
        
        // Extract member information from the array
        // Safely access each index and handle both direct values and {value: ...} objects
        const getValue = (item: unknown): string | number => {
          if (item === null || item === undefined) return '';
          if (typeof item === 'string' || typeof item === 'number') return item;
          if (typeof item === 'object' && 'value' in item) {
            const obj = item as { value: unknown };
            return obj.value as string | number;
          }
          return String(item);
        };

        // Extract talent type from index 4 using split (index 2 after split)
        const getTalentTypeFromIndex4 = (item: unknown): number => {
          const rawValue = getValue(item);
          if (typeof rawValue === 'string' && rawValue.includes('|')) {
            const parts = rawValue.split('|');
            if (parts.length > 2) {
              return Number(parts[2]) || 0;
            }
          }
          return 0;
        };

        // Extract skill type from index 4 using split (index 6 after split)
        const getSkillTypeFromIndex4 = (item: unknown): number => {
          const rawValue = getValue(item);
          if (typeof rawValue === 'string' && rawValue.includes('|')) {
            const parts = rawValue.split('|');
            if (parts.length > 6) {
              return Number(parts[6]) || 0;
            }
          }
          return 0;
        };

        // Extract luck value from index 4 using split (index 7 after split)
        const getLuckFromIndex4 = (item: unknown): number => {
          const rawValue = getValue(item);
          if (typeof rawValue === 'string' && rawValue.includes('|')) {
            const parts = rawValue.split('|');
            if (parts.length > 7) {
              return Number(parts[7]) || 0;
            }
          }
          return 0;
        };

        // Extract talent value from index 4 using split (index 3 after split)
        const getTalentFromIndex4 = (item: unknown): number => {
          const rawValue = getValue(item);
          if (typeof rawValue === 'string' && rawValue.includes('|')) {
            const parts = rawValue.split('|');
            if (parts.length > 3) {
              return Number(parts[3]) || 0;
            }
          }
          return 0;
        };

        // Extract name from index 4 using split
        const getNameFromIndex4 = (item: unknown): string => {
          const rawValue = getValue(item);
          if (typeof rawValue === 'string' && rawValue.includes('|')) {
            const parts = rawValue.split('|');
            if (parts.length > 0) {
              return parts[0] || 'Không rõ';
            }
          }
          return String(rawValue) || 'Không rõ';
        };

        // Extract generation from index 4 using split (index 1 after split)
        const getGenerationFromIndex4 = (item: unknown): number => {
          const rawValue = getValue(item);
          if (typeof rawValue === 'string' && rawValue.includes('|')) {
            const parts = rawValue.split('|');
            if (parts.length > 1) {
              return Number(parts[1]) || 0;
            }
          }
          return 0;
        };

        // Extract gender from index 4 using split (index 4 after split)
        const getGenderFromIndex4 = (item: unknown): number => {
          const rawValue = getValue(item);
          if (typeof rawValue === 'string' && rawValue.includes('|')) {
            const parts = rawValue.split('|');
            if (parts.length > 4) {
              return Number(parts[4]) || 0;
            }
          }
          return 0;
        };

        // Extract lifespan from index 4 using split (index 5 after split)
        const getLifespanFromIndex4 = (item: unknown): number => {
          const rawValue = getValue(item);
          if (typeof rawValue === 'string' && rawValue.includes('|')) {
            const parts = rawValue.split('|');
            if (parts.length > 5) {
              return Number(parts[5]) || 0;
            }
          }
          return 0;
        };

        // Extract hobby from index 4 using split (index 9 after split)
        const getHobbyFromIndex4 = (item: unknown): number => {
          const rawValue = getValue(item);
          if (typeof rawValue === 'string' && rawValue.includes('|')) {
            const parts = rawValue.split('|');
            if (parts.length > 9) {
              return Number(parts[9]) || 0;
            }
          }
          return 0;
        };

        return {
          index: index,
          name: getNameFromIndex4(memberInfo[4]),
          generation: getGenerationFromIndex4(memberInfo[4]),
          gender: getGenderFromIndex4(memberInfo[4]),
          lifespan: getLifespanFromIndex4(memberInfo[4]),
          hobby: getHobbyFromIndex4(memberInfo[4]),
          age: Number(getValue(memberInfo[6])) || 0,
          literaryTalent: Number(getValue(memberInfo[7])) || 0,
          martialTalent: Number(getValue(memberInfo[8])) || 0,
          commercialTalent: Number(getValue(memberInfo[9])) || 0,
          artisticTalent: Number(getValue(memberInfo[10])) || 0,
          strategy: Number(getValue(memberInfo[27])) || 0,
          reputation: Number(getValue(memberInfo[16])) || 0,
          luck: getLuckFromIndex4(memberInfo[4]),
          charm: Number(getValue(memberInfo[20])) || 0,
          health: Number(getValue(memberInfo[21])) || 0,
          stamina: Number(getValue(memberInfo[30])) || 0,
          talentType: getTalentTypeFromIndex4(memberInfo[4]),
          talent: getTalentFromIndex4(memberInfo[4]),
          skillType: getSkillTypeFromIndex4(memberInfo[4]),
          skill: Number(getValue(memberInfo[33])) || 0,
        }
      }).filter((member: FamilyMember | null): member is FamilyMember => member !== null)

      console.log('Processed members:', members)
      setFamilyMembers(members)
      
    } catch (err) {
      console.error('Error loading family member data:', err)
      setError('Lỗi khi đọc dữ liệu: ' + (err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Check if we're in the browser environment
    if (typeof window === "undefined") return;

    // Load data immediately
    loadFamilyMemberData()

    // Listen for storage changes (in case data is updated)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'gameData') {
        setLoading(true)
        loadFamilyMemberData()
      }
    }

    window.addEventListener('storage', handleStorageChange)

    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const updateFamilyMember = (updatedMember: FamilyMember) => {
    setFamilyMembers(prev => 
      prev.map(member => 
        member.index === updatedMember.index ? updatedMember : member
      )
    )
    
    // Update sessionStorage with new data
    try {
      const gameDataString = sessionStorage.getItem('gameData')
      if (gameDataString) {
        const gameData = JSON.parse(gameDataString)
        // Update the specific member in the original data structure
        // This is a simplified update - in practice you'd need to properly update the nested structure
        sessionStorage.setItem('gameData', JSON.stringify(gameData))
      }
    } catch (error) {
      console.error('Error updating sessionStorage:', error)
    }
  }

  return {
    familyMembers,
    loading,
    error,
    updateFamilyMember,
    reloadData: loadFamilyMemberData
  }
}
