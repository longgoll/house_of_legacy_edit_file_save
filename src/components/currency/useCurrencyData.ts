'use client'

import { useState, useEffect } from 'react'

export function useCurrencyData() {
  const [money, setMoney] = useState('0')
  const [gold, setGold] = useState('0')
  const [dataLoaded, setDataLoaded] = useState(false)

  useEffect(() => {
    // First try to get data from gameData in sessionStorage
    const gameDataString = sessionStorage.getItem('gameData')
    if (gameDataString) {
      try {
        const gameData = JSON.parse(gameDataString)
        if (gameData.CGNum?.value) {
          const moneyFromGameData = gameData.CGNum.value[0] || '0'
          const goldFromGameData = gameData.CGNum.value[1] || '0'
          setMoney(moneyFromGameData)
          setGold(goldFromGameData)
          setDataLoaded(true)
          return
        }
      } catch (error) {
        console.error('Error parsing gameData:', error)
      }
    }
    
    // Fallback: try to get from individual sessionStorage keys (from menu)
    const storedMoney = sessionStorage.getItem('currentMoney')
    const storedGold = sessionStorage.getItem('currentGold')
    
    if (storedMoney && storedGold) {
      setMoney(storedMoney)
      setGold(storedGold)
      setDataLoaded(true)
    } else {
      // Final fallback: try to get from URL parameters (for direct access)
      const urlParams = new URLSearchParams(window.location.search)
      const moneyParam = urlParams.get('money')
      const goldParam = urlParams.get('gold')
      
      if (moneyParam && goldParam) {
        setMoney(moneyParam)
        setGold(goldParam)
        setDataLoaded(true)
      }
    }
  }, [])

  const updateCurrency = (newMoney: string, newGold: string) => {
    setMoney(newMoney)
    setGold(newGold)
    
    // Update sessionStorage - both individual values and gameData object
    sessionStorage.setItem('currentMoney', newMoney)
    sessionStorage.setItem('currentGold', newGold)
    
    // Update gameData object in sessionStorage
    try {
      const gameDataString = sessionStorage.getItem('gameData')
      if (gameDataString) {
        const gameData = JSON.parse(gameDataString)
        
        // Ensure CGNum structure exists
        if (!gameData.CGNum) {
          gameData.CGNum = {}
        }
        if (!gameData.CGNum.value) {
          gameData.CGNum.value = ['0', '0']
        }
        
        // Update money and gold values
        gameData.CGNum.value[0] = newMoney
        gameData.CGNum.value[1] = newGold
        
        // Save updated gameData back to sessionStorage
        sessionStorage.setItem('gameData', JSON.stringify(gameData))
      }
    } catch (error) {
      console.error('Error updating gameData:', error)
    }
  }

  return {
    money,
    gold,
    dataLoaded,
    updateCurrency
  }
}
