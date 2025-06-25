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
    // Update sessionStorage with new data FIRST
    try {
      const gameDataString = sessionStorage.getItem('gameData')
      if (!gameDataString) {
        console.error('No gameData found in sessionStorage')
        return
      }

      const gameData = JSON.parse(gameDataString)
      console.log('Original gameData structure:', gameData)
      
      // Find the correct member array structure
      let memberArray;
      if (Array.isArray(gameData.Member_now)) {
        memberArray = gameData.Member_now;
      } else if (gameData.Member_now?.value && Array.isArray(gameData.Member_now.value)) {
        memberArray = gameData.Member_now.value;
      } else {
        console.error('Cannot find member array in gameData structure', {
          Member_now: gameData.Member_now,
          isArray: Array.isArray(gameData.Member_now),
          hasValue: gameData.Member_now?.value,
          valueIsArray: Array.isArray(gameData.Member_now?.value)
        })
        return
      }
      
      console.log(`Attempting to update member at index ${updatedMember.index}, total members: ${memberArray.length}`)
      
      // Update the specific member at the correct index
      if (memberArray[updatedMember.index]) {
        const memberData = memberArray[updatedMember.index]
        console.log('Original member data:', memberData)
        
        // Handle different possible structures for member data
        let memberInfo: unknown[];
        if (Array.isArray(memberData)) {
          memberInfo = memberData;
        } else if (memberData && typeof memberData === 'object' && 'value' in memberData) {
          const memberObj = memberData as { value: unknown };
          if (Array.isArray(memberObj.value)) {
            memberInfo = memberObj.value;
          } else {
            console.error('Member data value is not an array:', memberObj.value)
            return
          }
        } else {
          console.error('Member data has unexpected structure:', memberData)
          return
        }
        
        console.log('Member info array before update:', memberInfo)
        
        // Helper function to set value (handles both direct values and {value: ...} objects)
        const setValue = (index: number, newValue: string | number) => {
          console.log(`Setting index ${index} to value:`, newValue)
          
          if (memberInfo[index] && typeof memberInfo[index] === 'object' && memberInfo[index] !== null && 'value' in (memberInfo[index] as object)) {
            const oldValue = (memberInfo[index] as { value: unknown }).value;
            (memberInfo[index] as { value: unknown }).value = newValue;
            console.log(`Updated object value at index ${index}: ${oldValue} -> ${newValue}`)
          } else {
            const oldValue = memberInfo[index];
            memberInfo[index] = newValue;
            console.log(`Updated direct value at index ${index}: ${oldValue} -> ${newValue}`)
          }
        };
        
        // Helper function to get current value (preserves original format)
        const getCurrentValue = (index: number): string | number => {
          if (memberInfo[index] && typeof memberInfo[index] === 'object' && memberInfo[index] !== null && 'value' in (memberInfo[index] as object)) {
            return (memberInfo[index] as { value: unknown }).value as string | number;
          } else {
            return memberInfo[index] as string | number;
          }
        };
        
        // Update the pipe-separated string at index 4 with member info while preserving original structure
        const updatePipeString = (member: FamilyMember): void => {
          const currentPipeValue = getCurrentValue(4);
          
          if (typeof currentPipeValue === 'string' && currentPipeValue.includes('|')) {
            // Parse existing pipe string to preserve unknown fields
            const existingParts = currentPipeValue.split('|');
            console.log('Existing pipe parts:', existingParts)
            
            // Update only the known fields, keep others as they are
            const updatedParts = [...existingParts]; // Copy existing parts
            
            // Update only the fields we know about, preserve others
            updatedParts[0] = member.name;                    // 0: name
            updatedParts[1] = member.generation.toString();   // 1: generation  
            updatedParts[2] = member.talentType.toString();   // 2: talentType
            updatedParts[3] = member.talent.toString();       // 3: talent
            updatedParts[4] = member.gender.toString();       // 4: gender
            updatedParts[5] = member.lifespan.toString();     // 5: lifespan
            updatedParts[6] = member.skillType.toString();    // 6: skillType
            updatedParts[7] = member.luck.toString();         // 7: luck
            // Keep index 8 as is (DON'T MODIFY - preserve original value)
            if (updatedParts.length > 9) {
              updatedParts[9] = member.hobby.toString();      // 9: hobby
            }
            
            const updatedPipeString = updatedParts.join('|');
            console.log('Updated pipe string (preserving all original fields):', updatedPipeString)
            setValue(4, updatedPipeString);
          } else {
            console.warn('Unexpected pipe string format, unable to preserve original data:', currentPipeValue)
            // In this case, we cannot safely update without losing data
            // So we'll skip updating the pipe string
            console.log('Skipping pipe string update to avoid data loss')
          }
        };
        
        // Update all the member data fields
        updatePipeString(updatedMember);               // Pipe-separated string with basic info
        setValue(6, updatedMember.age.toString());                // age (convert to string)
        setValue(7, updatedMember.literaryTalent.toString());     // literaryTalent (convert to string)
        setValue(8, updatedMember.martialTalent.toString());      // martialTalent (convert to string)
        setValue(9, updatedMember.commercialTalent.toString());   // commercialTalent (convert to string)
        setValue(10, updatedMember.artisticTalent.toString());    // artisticTalent (convert to string)
        setValue(16, updatedMember.reputation.toString());        // reputation (convert to string)
        setValue(20, updatedMember.charm.toString());             // charm (convert to string)
        setValue(21, updatedMember.health.toString());            // health (convert to string)
        setValue(27, updatedMember.strategy.toString());          // strategy (convert to string)
        setValue(30, updatedMember.stamina.toString());           // stamina (convert to string)
        setValue(33, updatedMember.skill.toString());             // skill (convert to string)
        
        console.log('Member info array after update:', memberInfo)
        console.log('Updated member data structure:', memberData)
        
        // Save the updated gameData back to sessionStorage
        const updatedGameDataString = JSON.stringify(gameData)
        sessionStorage.setItem('gameData', updatedGameDataString)
        console.log('Successfully saved updated member data to sessionStorage')
        
        // Verify the save was successful
        const verifyData = sessionStorage.getItem('gameData')
        if (verifyData) {
          const verifyParsed = JSON.parse(verifyData)
          console.log('Verification - saved data contains updated member:', 
            verifyParsed.Member_now?.[updatedMember.index] || verifyParsed.Member_now?.value?.[updatedMember.index])
        }
        
      } else {
        console.error(`Member at index ${updatedMember.index} not found in array of length ${memberArray.length}`)
        return
      }
      
    } catch (error) {
      console.error('Error updating sessionStorage:', error)
      return
    }
    
    // Update local state AFTER successful sessionStorage update
    setFamilyMembers(prev => 
      prev.map(member => 
        member.index === updatedMember.index ? updatedMember : member
      )
    )
    console.log('Local state updated successfully')
  }

  return {
    familyMembers,
    loading,
    error,
    updateFamilyMember,
    reloadData: loadFamilyMemberData
  }
}
