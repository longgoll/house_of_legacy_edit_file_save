'use client'

import { useState, useEffect } from 'react'

export interface useMarriedRelativesData {
  index: number
  name: string
  generation: number // Deprecated - no longer used
  talent: number // Now represents talent type (from index 2)
  talentValue: number // Talent value (from index 3)
  gender: number // Gender (from index 4) - 1: nam, 0: nữ
  lifespan: number // From index 5
  skillType: number // From index 6
  luck: number // From index 7
  hobby: number // From index 8 - Sở thích
  age: number 
  literaryTalent: number
  martialTalent: number
  commercialTalent: number
  artisticTalent: number
  mood: number
  reputation: number
  charm: number // From index 15 - Mị lực
  health: number // From index 16
  strategy: number // From index 19 - Mưu lượt
  skill: number // From index 23 - Giá trị kỹ năng
}

export const useMemberQuData = () => {
  const [memberQu, setMemberQu] = useState<useMarriedRelativesData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadMemberQuData = () => {
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
      console.log('Member_qu:', gameData.Member_qu)
      
      if (!gameData.Member_qu) {
        setError('Không tìm thấy dữ liệu Member_qu trong gameData')
        setLoading(false)
        return
      }

      // Check if Member_qu has value property and it's an array
      let memberArray;
      if (Array.isArray(gameData.Member_qu)) {
        memberArray = gameData.Member_qu;
      } else if (gameData.Member_qu.value && Array.isArray(gameData.Member_qu.value)) {
        memberArray = gameData.Member_qu.value;
      } else {
        setError('Cấu trúc dữ liệu Member_qu không hợp lệ')
        setLoading(false)
        return
      }

      console.log('Member_qu array:', memberArray)
      console.log('Member_qu count:', memberArray.length)

      const members: useMarriedRelativesData[] = memberArray.map((memberData: unknown, index: number) => {
        console.log(`Processing member_qu ${index}:`, memberData)
        
        // Handle different possible structures
        let memberInfo: unknown[];
        
        if (Array.isArray(memberData)) {
          memberInfo = memberData;
        } else if (memberData && typeof memberData === 'object' && 'value' in memberData) {
          const memberObj = memberData as { value: unknown };
          if (Array.isArray(memberObj.value)) {
            memberInfo = memberObj.value;
          } else {
            console.warn(`Member_qu ${index} value is not an array:`, memberObj.value);
            return null;
          }
        } else {
          console.warn(`Member_qu ${index} has unexpected structure:`, memberData);
          return null;
        }

        console.log(`Member_qu ${index} info array:`, memberInfo)
        
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

        // Extract data from index 2 using split
        const getDataFromIndex2 = (item: unknown, splitIndex: number): string | number => {
          const rawValue = getValue(item);
          if (typeof rawValue === 'string' && rawValue.includes('|')) {
            const parts = rawValue.split('|');
            if (parts.length > splitIndex) {
              // Return string for name (index 0), number for others
              return splitIndex === 0 ? parts[splitIndex] || 'Không rõ' : Number(parts[splitIndex]) || 0;
            }
          }
          return splitIndex === 0 ? 'Không rõ' : 0;
        };

        // Extract name from index 2 using split (index 0 after split)
        const getNameFromIndex2 = (item: unknown): string => {
          return getDataFromIndex2(item, 0) as string;
        };

        // Extract talent type from index 2 using split (index 2 after split) 
        const getTalentFromIndex2 = (item: unknown): number => {
          return getDataFromIndex2(item, 2) as number;
        };

        // Extract talent value from index 2 using split (index 3 after split)
        const getTalentValueFromIndex2 = (item: unknown): number => {
          return getDataFromIndex2(item, 3) as number;
        };

        // Extract gender from index 2 using split (index 4 after split) - 1: nam, 0: nữ
        const getGenderFromIndex2 = (item: unknown): number => {
          return getDataFromIndex2(item, 4) as number;
        };

        // Extract lifespan from index 2 using split (index 5 after split)
        const getLifespanFromIndex2 = (item: unknown): number => {
          return getDataFromIndex2(item, 5) as number;
        };

        // Extract skillType from index 2 using split (index 6 after split)
        const getSkillTypeFromIndex2 = (item: unknown): number => {
          return getDataFromIndex2(item, 6) as number;
        };

        // Extract luck from index 2 using split (index 7 after split)
        const getLuckFromIndex2 = (item: unknown): number => {
          return getDataFromIndex2(item, 7) as number;
        };

        // Extract hobby from index 2 using split (index 8 after split)
        const getHobbyFromIndex2 = (item: unknown): number => {
          return getDataFromIndex2(item, 8) as number;
        };

        return {
          index: index,
          name: getNameFromIndex2(memberInfo[2]),
          generation: 0, // Removed generation field as per request
          talent: getTalentFromIndex2(memberInfo[2]), // Now represents talent type
          talentValue: getTalentValueFromIndex2(memberInfo[2]), // Talent value from index 3
          gender: getGenderFromIndex2(memberInfo[2]), // Now represents gender (1: nam, 0: nữ)
          lifespan: getLifespanFromIndex2(memberInfo[2]),
          skillType: getSkillTypeFromIndex2(memberInfo[2]),
          luck: getLuckFromIndex2(memberInfo[2]),
          hobby: getHobbyFromIndex2(memberInfo[2]),
          age: Number(getValue(memberInfo[5])) || 0,
          literaryTalent: Number(getValue(memberInfo[6])) || 0,
          martialTalent: Number(getValue(memberInfo[7])) || 0,
          commercialTalent: Number(getValue(memberInfo[8])) || 0,
          artisticTalent: Number(getValue(memberInfo[9])) || 0,
          mood: Number(getValue(memberInfo[10])) || 0,
          reputation: Number(getValue(memberInfo[12])) || 0,
          charm: Number(getValue(memberInfo[15])) || 0,
          health: Number(getValue(memberInfo[16])) || 0,
          strategy: Number(getValue(memberInfo[19])) || 0,
          skill: Number(getValue(memberInfo[23])) || 0, // Giá trị kỹ năng từ index 23
        }
      }).filter((member: useMarriedRelativesData | null): member is useMarriedRelativesData => member !== null)

      console.log('Processed member_qu:', members)
      setMemberQu(members)
      
    } catch (err) {
      console.error('Error loading member_qu data:', err)
      setError('Lỗi khi đọc dữ liệu Member_qu: ' + (err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Check if we're in the browser environment
    if (typeof window === "undefined") return;

    // Load data immediately
    loadMemberQuData()

    // Listen for storage changes (in case data is updated)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'gameData') {
        setLoading(true)
        loadMemberQuData()
      }
    }

    window.addEventListener('storage', handleStorageChange)

    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const updateMemberQu = (updatedMember: useMarriedRelativesData) => {
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
      if (Array.isArray(gameData.Member_qu)) {
        memberArray = gameData.Member_qu;
      } else if (gameData.Member_qu?.value && Array.isArray(gameData.Member_qu.value)) {
        memberArray = gameData.Member_qu.value;
      } else {
        console.error('Cannot find member_qu array in gameData structure', {
          Member_qu: gameData.Member_qu,
          isArray: Array.isArray(gameData.Member_qu),
          hasValue: gameData.Member_qu?.value,
          valueIsArray: Array.isArray(gameData.Member_qu?.value)
        })
        return
      }
      
      console.log(`Attempting to update member_qu at index ${updatedMember.index}, total members: ${memberArray.length}`)
      
      // Update the specific member at the correct index
      if (memberArray[updatedMember.index]) {
        const memberData = memberArray[updatedMember.index]
        console.log('Original member_qu data:', memberData)
        
        // Handle different possible structures for member data
        let memberInfo: unknown[];
        if (Array.isArray(memberData)) {
          memberInfo = memberData;
        } else if (memberData && typeof memberData === 'object' && 'value' in memberData) {
          const memberObj = memberData as { value: unknown };
          if (Array.isArray(memberObj.value)) {
            memberInfo = memberObj.value;
          } else {
            console.error('Member_qu data value is not an array:', memberObj.value)
            return
          }
        } else {
          console.error('Member_qu data has unexpected structure:', memberData)
          return
        }
        
        console.log('Member_qu info array before update:', memberInfo)
        
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
        
        // Update the pipe-separated string at index 2 with member info while preserving original structure
        const updatePipeString = (member: useMarriedRelativesData): void => {
          const currentPipeValue = getCurrentValue(2);
          
          if (typeof currentPipeValue === 'string' && currentPipeValue.includes('|')) {
            // Parse existing pipe string to preserve unknown fields
            const existingParts = currentPipeValue.split('|');
            console.log('Existing pipe parts:', existingParts)
            
            // Update only the fields we know about, preserve others
            const updatedParts = [...existingParts]; // Copy existing parts
            
            // Update based on new structure:
            // Index 0: name, Index 1: remove, Index 2: talent type, Index 3: talent value
            // Index 4: gender, Index 5: lifespan, Index 6: skillType, Index 7: luck, Index 8: hobby
            updatedParts[0] = member.name;                    // 0: name
            // Index 1: removed (skip update to preserve original)
            updatedParts[2] = member.talent.toString();       // 2: talent type
            updatedParts[3] = member.talentValue.toString();  // 3: talent value
            updatedParts[4] = member.gender.toString();       // 4: gender (1: nam, 0: nữ)
            updatedParts[5] = member.lifespan.toString();     // 5: lifespan
            updatedParts[6] = member.skillType.toString();    // 6: skillType
            updatedParts[7] = member.luck.toString();         // 7: luck
            updatedParts[8] = member.hobby.toString();        // 8: hobby (sở thích)
            // Keep any additional parts as they are (preserve original data)
            
            const updatedPipeString = updatedParts.join('|');
            console.log('Updated pipe string (preserving all original fields):', updatedPipeString)
            setValue(2, updatedPipeString);
          } else {
            console.warn('Unexpected pipe string format, unable to preserve original data:', currentPipeValue)
            // In this case, we cannot safely update without losing data
            // So we'll skip updating the pipe string
            console.log('Skipping pipe string update to avoid data loss')
          }
        };
        
        // Update all the member data fields
        updatePipeString(updatedMember);                       // Pipe-separated string with basic info
        setValue(5, updatedMember.age.toString());             // age (convert to string)
        setValue(6, updatedMember.literaryTalent.toString());  // literaryTalent (convert to string)
        setValue(7, updatedMember.martialTalent.toString());   // martialTalent (convert to string)
        setValue(8, updatedMember.commercialTalent.toString()); // commercialTalent (convert to string)
        setValue(9, updatedMember.artisticTalent.toString());  // artisticTalent (convert to string)
        setValue(10, updatedMember.mood.toString());           // mood (convert to string)
        setValue(12, updatedMember.reputation.toString());     // reputation (convert to string)
        setValue(15, updatedMember.charm.toString());          // charm (convert to string)
        setValue(16, updatedMember.health.toString());         // health (convert to string)
        setValue(19, updatedMember.strategy.toString());       // strategy (convert to string)
        setValue(23, updatedMember.skill.toString());          // skill (convert to string) - Giá trị kỹ năng
        
        console.log('Member_qu info array after update:', memberInfo)
        console.log('Updated member_qu data structure:', memberData)
        
        // Save the updated gameData back to sessionStorage
        const updatedGameDataString = JSON.stringify(gameData)
        sessionStorage.setItem('gameData', updatedGameDataString)
        console.log('Successfully saved updated member_qu data to sessionStorage')
        
        // Verify the save was successful
        const verifyData = sessionStorage.getItem('gameData')
        if (verifyData) {
          const verifyParsed = JSON.parse(verifyData)
          console.log('Verification - saved data contains updated member_qu:', 
            verifyParsed.Member_qu?.[updatedMember.index] || verifyParsed.Member_qu?.value?.[updatedMember.index])
        }
        
      } else {
        console.error(`Member_qu at index ${updatedMember.index} not found in array of length ${memberArray.length}`)
        return
      }
      
    } catch (error) {
      console.error('Error updating sessionStorage:', error)
      return
    }
    
    // Update local state AFTER successful sessionStorage update
    setMemberQu(prev => 
      prev.map(member => 
        member.index === updatedMember.index ? updatedMember : member
      )
    )
    console.log('Local state updated successfully')
  }

  return {
    memberQu,
    loading,
    error,
    updateMemberQu,
    reloadData: loadMemberQuData
  }
}
