'use client'

import { useState, useEffect } from 'react'
import { getItemName, getItemCategory } from '@/data/items'

export interface InventoryItem {
  index: number
  itemId: number
  itemName: string
  category: string
  quantity: number
}

export const useInventoryManagerData = () => {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadInventoryData = () => {
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
      console.log('Prop_have:', gameData.Prop_have)
      
      if (!gameData.Prop_have) {
        setError('Không tìm thấy dữ liệu Prop_have trong gameData')
        setLoading(false)
        return
      }

      // Check if Prop_have has value property and it's an array
      let inventoryArray;
      if (Array.isArray(gameData.Prop_have)) {
        inventoryArray = gameData.Prop_have;
      } else if (gameData.Prop_have.value && Array.isArray(gameData.Prop_have.value)) {
        inventoryArray = gameData.Prop_have.value;
      } else {
        setError('Cấu trúc dữ liệu Prop_have không hợp lệ')
        setLoading(false)
        return
      }

      console.log('Prop_have array:', inventoryArray)
      console.log('Prop_have count:', inventoryArray.length)

      const items: InventoryItem[] = inventoryArray.map((itemData: unknown, index: number) => {
        console.log(`Processing item ${index}:`, itemData)
        
        // Handle different possible structures
        let itemInfo: unknown[];
        
        if (Array.isArray(itemData)) {
          itemInfo = itemData;
        } else if (itemData && typeof itemData === 'object' && 'value' in itemData) {
          const itemObj = itemData as { value: unknown };
          if (Array.isArray(itemObj.value)) {
            itemInfo = itemObj.value;
          } else {
            console.warn(`Item ${index} value is not an array:`, itemObj.value);
            return null;
          }
        } else {
          console.warn(`Item ${index} has unexpected structure:`, itemData);
          return null;
        }

        console.log(`Item ${index} info array:`, itemInfo)
        
        // Extract item information from the array
        // Safely access each index and handle both direct values and {value: ...} objects
        const getValue = (item: unknown): string | number => {
          if (item === null || item === undefined) return 0;
          if (typeof item === 'string' || typeof item === 'number') return item;
          if (typeof item === 'object' && 'value' in item) {
            const obj = item as { value: unknown };
            return obj.value as string | number;
          }
          return 0;
        };

        // Extract item ID from index 0
        const itemId = Number(getValue(itemInfo[0])) || 0;
        
        // Extract quantity from index 1
        const quantity = Number(getValue(itemInfo[1])) || 0;

        // Get item name from items.ts using the ID
        const itemName = getItemName(itemId);
        const itemCategory = getItemCategory(itemId);

        return {
          index: index,
          itemId: itemId,
          itemName: itemName,
          category: itemCategory,
          quantity: quantity
        }
      }).filter((item: InventoryItem | null): item is InventoryItem => item !== null)

      console.log('Processed inventory items:', items)
      setInventoryItems(items)
      
    } catch (err) {
      console.error('Error loading inventory data:', err)
      setError('Lỗi khi đọc dữ liệu Prop_have: ' + (err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Check if we're in the browser environment
    if (typeof window === "undefined") return;

    // Load data immediately
    loadInventoryData()

    // Listen for storage changes (in case data is updated)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'gameData') {
        setLoading(true)
        loadInventoryData()
      }
    }

    window.addEventListener('storage', handleStorageChange)

    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const updateInventoryItem = (updatedItem: InventoryItem) => {
    // Update sessionStorage with new data FIRST
    try {
      const gameDataString = sessionStorage.getItem('gameData')
      if (!gameDataString) {
        console.error('No gameData found in sessionStorage')
        return
      }

      const gameData = JSON.parse(gameDataString)
      console.log('Original gameData structure:', gameData)
      
      // Find the correct inventory array structure
      let inventoryArray;
      if (Array.isArray(gameData.Prop_have)) {
        inventoryArray = gameData.Prop_have;
      } else if (gameData.Prop_have?.value && Array.isArray(gameData.Prop_have.value)) {
        inventoryArray = gameData.Prop_have.value;
      } else {
        console.error('Cannot find Prop_have array in gameData structure', {
          Prop_have: gameData.Prop_have,
          isArray: Array.isArray(gameData.Prop_have),
          hasValue: gameData.Prop_have?.value,
          valueIsArray: Array.isArray(gameData.Prop_have?.value)
        })
        return
      }
      
      console.log(`Attempting to update item at index ${updatedItem.index}, total items: ${inventoryArray.length}`)
      
      // Update the specific item at the correct index
      if (inventoryArray[updatedItem.index]) {
        const itemData = inventoryArray[updatedItem.index]
        
        // Handle different possible structures for the item data
        let itemArray;
        if (Array.isArray(itemData)) {
          itemArray = itemData;
        } else if (itemData && typeof itemData === 'object' && 'value' in itemData) {
          const itemObj = itemData as { value: unknown };
          if (Array.isArray(itemObj.value)) {
            itemArray = itemObj.value;
          } else {
            console.error('Item data value is not an array:', itemObj.value)
            return
          }
        } else {
          console.error('Item data has unexpected structure:', itemData)
          return
        }

        console.log('Original item data before update:', itemArray)

        // Helper function to update value in the array
        const updateValue = (index: number, newValue: number) => {
          if (itemArray[index] && typeof itemArray[index] === 'object' && 'value' in itemArray[index]) {
            (itemArray[index] as { value: string }).value = newValue.toString();
          } else {
            itemArray[index] = newValue.toString();
          }
        };

        // Update item ID (index 0) and quantity (index 1)
        updateValue(0, updatedItem.itemId);
        updateValue(1, updatedItem.quantity);

        console.log('Updated item data:', itemArray)
        
        // Save the updated data back to sessionStorage
        sessionStorage.setItem('gameData', JSON.stringify(gameData))
        console.log('Successfully updated gameData in sessionStorage')
        
        // Update local state
        setInventoryItems(prevItems => 
          prevItems.map(item => 
            item.index === updatedItem.index ? updatedItem : item
          )
        )
        
        // Trigger storage event for other components
        window.dispatchEvent(new Event('storage'))
        
      } else {
        console.error(`Item at index ${updatedItem.index} not found`)
      }
      
    } catch (err) {
      console.error('Error updating item:', err)
      setError('Lỗi khi cập nhật dữ liệu: ' + (err as Error).message)
    }
  }

  const addNewItem = (itemId: number, quantity: number) => {
    try {
      const gameDataString = sessionStorage.getItem('gameData')
      if (!gameDataString) {
        console.error('No gameData found in sessionStorage')
        return
      }

      const gameData = JSON.parse(gameDataString)
      
      // Find the correct inventory array structure
      let inventoryArray;
      if (Array.isArray(gameData.Prop_have)) {
        inventoryArray = gameData.Prop_have;
      } else if (gameData.Prop_have?.value && Array.isArray(gameData.Prop_have.value)) {
        inventoryArray = gameData.Prop_have.value;
      } else {
        console.error('Cannot find Prop_have array in gameData structure')
        return
      }

      // Add new item to the array
      const newItemData = [itemId.toString(), quantity.toString()];
      inventoryArray.push(newItemData);

      // Save back to sessionStorage
      sessionStorage.setItem('gameData', JSON.stringify(gameData))
      
      // Reload data to update state
      loadInventoryData()
      
    } catch (err) {
      console.error('Error adding new item:', err)
      setError('Lỗi khi thêm vật phẩm mới: ' + (err as Error).message)
    }
  }

  const removeItem = (index: number) => {
    try {
      const gameDataString = sessionStorage.getItem('gameData')
      if (!gameDataString) {
        console.error('No gameData found in sessionStorage')
        return
      }

      const gameData = JSON.parse(gameDataString)
      
      // Find the correct inventory array structure
      let inventoryArray;
      if (Array.isArray(gameData.Prop_have)) {
        inventoryArray = gameData.Prop_have;
      } else if (gameData.Prop_have?.value && Array.isArray(gameData.Prop_have.value)) {
        inventoryArray = gameData.Prop_have.value;
      } else {
        console.error('Cannot find Prop_have array in gameData structure')
        return
      }

      // Remove item from array
      inventoryArray.splice(index, 1);

      // Save back to sessionStorage
      sessionStorage.setItem('gameData', JSON.stringify(gameData))
      
      // Reload data to update state
      loadInventoryData()
      
    } catch (err) {
      console.error('Error removing item:', err)
      setError('Lỗi khi xóa vật phẩm: ' + (err as Error).message)
    }
  }

  return {
    inventoryItems,
    loading,
    error,
    updateInventoryItem,
    addNewItem,
    removeItem,
    reloadData: loadInventoryData
  }
}
