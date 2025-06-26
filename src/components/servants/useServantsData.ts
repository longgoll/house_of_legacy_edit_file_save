'use client'

import { useState, useEffect } from 'react'

export interface ServantsData {
  index: number
  name: string
  gender: number // Giới tính từ index 2 split[4] - 1: nam, 0: nữ
  lifespan: number // Tuổi thọ từ index 2 split[5]
  luck: number // May mắn từ index 2 split[8]
  age: number // Tuổi từ index 3
  literaryTalent: number // Văn tài từ index 4
  martialTalent: number // Võ tài từ index 5
  commercialTalent: number // Thương tài từ index 6
  artisticTalent: number // Nghệ tài từ index 7
  mood: number // Tâm trạng từ index 8
  reputation: number // Danh tiếng từ index 11
  charm: number // Mị lực từ index 13
  health: number // Sức khỏe từ index 14
  strategy: number // Mưu lượt từ index 15
  monthlySalary: number // Tiền lương hằng tháng từ index 18
  physicalStrength: number // Thể lực từ index 19
}

export const useServantsData = () => {
  const [servants, setServants] = useState<ServantsData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadServantsData = () => {
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
      console.log('MenKe_Now:', gameData.MenKe_Now)
      
      if (!gameData.MenKe_Now) {
        setError('Không tìm thấy dữ liệu MenKe_Now trong gameData')
        setLoading(false)
        return
      }

      // Check if MenKe_Now has value property and it's an array
      let servantsArray;
      if (Array.isArray(gameData.MenKe_Now)) {
        servantsArray = gameData.MenKe_Now;
      } else if (gameData.MenKe_Now.value && Array.isArray(gameData.MenKe_Now.value)) {
        servantsArray = gameData.MenKe_Now.value;
      } else {
        setError('Cấu trúc dữ liệu MenKe_Now không hợp lệ')
        setLoading(false)
        return
      }

      console.log('MenKe_Now array:', servantsArray)
      console.log('MenKe_Now count:', servantsArray.length)

      const servantsData: ServantsData[] = servantsArray.map((servantData: unknown, index: number) => {
        console.log(`Processing servant ${index}:`, servantData)
        
        // Handle different possible structures
        let servantInfo: unknown[];
        
        if (Array.isArray(servantData)) {
          servantInfo = servantData;
        } else if (servantData && typeof servantData === 'object' && 'value' in servantData) {
          const servantObj = servantData as { value: unknown };
          if (Array.isArray(servantObj.value)) {
            servantInfo = servantObj.value;
          } else {
            console.warn(`Servant ${index} value is not an array:`, servantObj.value);
            return null;
          }
        } else {
          console.warn(`Servant ${index} has unexpected structure:`, servantData);
          return null;
        }

        console.log(`Servant ${index} info array:`, servantInfo)
        
        // Extract servant information from the array
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

        // Extract gender from index 2 using split (index 4 after split) - 1: nam, 0: nữ
        const getGenderFromIndex2 = (item: unknown): number => {
          return getDataFromIndex2(item, 4) as number;
        };

        // Extract lifespan from index 2 using split (index 5 after split)
        const getLifespanFromIndex2 = (item: unknown): number => {
          return getDataFromIndex2(item, 5) as number;
        };

        // Extract luck from index 2 using split (index 8 after split)
        const getLuckFromIndex2 = (item: unknown): number => {
          return getDataFromIndex2(item, 8) as number;
        };

        return {
          index: index,
          name: getNameFromIndex2(servantInfo[2]),
          gender: getGenderFromIndex2(servantInfo[2]), // Giới tính (1: nam, 0: nữ)
          lifespan: getLifespanFromIndex2(servantInfo[2]), // Tuổi thọ
          luck: getLuckFromIndex2(servantInfo[2]), // May mắn
          age: Number(getValue(servantInfo[3])) || 0, // Tuổi
          literaryTalent: Number(getValue(servantInfo[4])) || 0, // Văn tài
          martialTalent: Number(getValue(servantInfo[5])) || 0, // Võ tài
          commercialTalent: Number(getValue(servantInfo[6])) || 0, // Thương tài
          artisticTalent: Number(getValue(servantInfo[7])) || 0, // Nghệ tài
          mood: Number(getValue(servantInfo[8])) || 0, // Tâm trạng
          reputation: Number(getValue(servantInfo[11])) || 0, // Danh tiếng
          charm: Number(getValue(servantInfo[13])) || 0, // Mị lực
          health: Number(getValue(servantInfo[14])) || 0, // Sức khỏe
          strategy: Number(getValue(servantInfo[15])) || 0, // Mưu lượt
          monthlySalary: Number(getValue(servantInfo[18])) || 0, // Tiền lương hằng tháng
          physicalStrength: Number(getValue(servantInfo[19])) || 0, // Thể lực
        }
      }).filter((servant: ServantsData | null): servant is ServantsData => servant !== null)

      console.log('Processed servants:', servantsData)
      setServants(servantsData)
      
    } catch (err) {
      console.error('Error loading MenKe_Now data:', err)
      setError('Lỗi khi đọc dữ liệu MenKe_Now: ' + (err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Check if we're in the browser environment
    if (typeof window === "undefined") return;

    // Load data immediately
    loadServantsData()

    // Listen for storage changes (in case data is updated)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'gameData') {
        setLoading(true)
        loadServantsData()
      }
    }

    window.addEventListener('storage', handleStorageChange)

    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const updateServant = (updatedServant: ServantsData) => {
    // Update sessionStorage with new data FIRST
    try {
      const gameDataString = sessionStorage.getItem('gameData')
      if (!gameDataString) {
        console.error('No gameData found in sessionStorage')
        return
      }

      const gameData = JSON.parse(gameDataString)
      console.log('Original gameData structure:', gameData)
      
      // Find the correct servant array structure
      let servantsArray;
      if (Array.isArray(gameData.MenKe_Now)) {
        servantsArray = gameData.MenKe_Now;
      } else if (gameData.MenKe_Now?.value && Array.isArray(gameData.MenKe_Now.value)) {
        servantsArray = gameData.MenKe_Now.value;
      } else {
        console.error('Cannot find MenKe_Now array in gameData structure', {
          MenKe_Now: gameData.MenKe_Now,
          isArray: Array.isArray(gameData.MenKe_Now),
          hasValue: gameData.MenKe_Now?.value,
          valueIsArray: Array.isArray(gameData.MenKe_Now?.value)
        })
        return
      }
      
      console.log(`Attempting to update servant at index ${updatedServant.index}, total servants: ${servantsArray.length}`)
      
      // Update the specific servant at the correct index
      if (servantsArray[updatedServant.index]) {
        const servantData = servantsArray[updatedServant.index]
        console.log('Original servant data:', servantData)
        
        // Handle different possible structures for servant data
        let servantInfo: unknown[];
        if (Array.isArray(servantData)) {
          servantInfo = servantData;
        } else if (servantData && typeof servantData === 'object' && 'value' in servantData) {
          const servantObj = servantData as { value: unknown };
          if (Array.isArray(servantObj.value)) {
            servantInfo = servantObj.value;
          } else {
            console.error('Servant data value is not an array:', servantObj.value)
            return
          }
        } else {
          console.error('Servant data has unexpected structure:', servantData)
          return
        }
        
        console.log('Servant info array before update:', servantInfo)
        
        // Helper function to set value (handles both direct values and {value: ...} objects)
        const setValue = (index: number, newValue: string | number) => {
          console.log(`Setting index ${index} to value:`, newValue)
          
          if (servantInfo[index] && typeof servantInfo[index] === 'object' && servantInfo[index] !== null && 'value' in (servantInfo[index] as object)) {
            const oldValue = (servantInfo[index] as { value: unknown }).value;
            (servantInfo[index] as { value: unknown }).value = newValue;
            console.log(`Updated object value at index ${index}: ${oldValue} -> ${newValue}`)
          } else {
            const oldValue = servantInfo[index];
            servantInfo[index] = newValue;
            console.log(`Updated direct value at index ${index}: ${oldValue} -> ${newValue}`)
          }
        };
        
        // Helper function to get current value (preserves original format)
        const getCurrentValue = (index: number): string | number => {
          if (servantInfo[index] && typeof servantInfo[index] === 'object' && servantInfo[index] !== null && 'value' in (servantInfo[index] as object)) {
            return (servantInfo[index] as { value: unknown }).value as string | number;
          } else {
            return servantInfo[index] as string | number;
          }
        };
        
        // Update the pipe-separated string at index 2 with servant info while preserving original structure
        const updatePipeString = (servant: ServantsData): void => {
          const currentPipeValue = getCurrentValue(2);
          
          if (typeof currentPipeValue === 'string' && currentPipeValue.includes('|')) {
            // Parse existing pipe string to preserve unknown fields
            const existingParts = currentPipeValue.split('|');
            console.log('Existing pipe parts:', existingParts)
            
            // Update only the fields we know about, preserve others
            const updatedParts = [...existingParts]; // Copy existing parts
            
            // Update based on servant structure:
            // Index 0: name, Index 4: gender, Index 5: lifespan, Index 8: luck
            updatedParts[0] = servant.name;                         // 0: name
            updatedParts[4] = servant.gender.toString();            // 4: gender (1: nam, 0: nữ)
            updatedParts[5] = servant.lifespan.toString();          // 5: lifespan
            updatedParts[8] = servant.luck.toString();              // 8: luck
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
        
        // Update all the servant data fields
        updatePipeString(updatedServant);                              // Pipe-separated string with basic info
        setValue(3, updatedServant.age.toString());                    // age
        setValue(4, updatedServant.literaryTalent.toString());         // literaryTalent
        setValue(5, updatedServant.martialTalent.toString());          // martialTalent
        setValue(6, updatedServant.commercialTalent.toString());       // commercialTalent
        setValue(7, updatedServant.artisticTalent.toString());         // artisticTalent
        setValue(8, updatedServant.mood.toString());                   // mood
        setValue(11, updatedServant.reputation.toString());            // reputation
        setValue(13, updatedServant.charm.toString());                 // charm
        setValue(14, updatedServant.health.toString());                // health
        setValue(15, updatedServant.strategy.toString());              // strategy
        setValue(18, updatedServant.monthlySalary.toString());         // monthlySalary
        setValue(19, updatedServant.physicalStrength.toString());      // physicalStrength
        
        console.log('Servant info array after update:', servantInfo)
        console.log('Updated servant data structure:', servantData)
        
        // Save the updated gameData back to sessionStorage
        const updatedGameDataString = JSON.stringify(gameData)
        sessionStorage.setItem('gameData', updatedGameDataString)
        console.log('Successfully saved updated servant data to sessionStorage')
        
        // Verify the save was successful
        const verifyData = sessionStorage.getItem('gameData')
        if (verifyData) {
          const verifyParsed = JSON.parse(verifyData)
          console.log('Verification - saved data contains updated servant:', 
            verifyParsed.MenKe_Now?.[updatedServant.index] || verifyParsed.MenKe_Now?.value?.[updatedServant.index])
        }
        
      } else {
        console.error(`Servant at index ${updatedServant.index} not found in array of length ${servantsArray.length}`)
        return
      }
      
    } catch (error) {
      console.error('Error updating sessionStorage:', error)
      return
    }
    
    // Update local state AFTER successful sessionStorage update
    setServants(prev => 
      prev.map(servant => 
        servant.index === updatedServant.index ? updatedServant : servant
      )
    )
    console.log('Local state updated successfully')
  }

  return {
    servants,
    loading,
    error,
    updateServant,
    reloadData: loadServantsData
  }
}