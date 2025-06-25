'use client'

import { useState, useEffect } from 'react'

export function useCurrencyData() {
  const [money, setMoney] = useState('0')
  const [gold, setGold] = useState('0')
  const [dataLoaded, setDataLoaded] = useState(false)

  useEffect(() => {
    // First try to get data from sessionStorage (from menu)
    const storedMoney = sessionStorage.getItem('currentMoney')
    const storedGold = sessionStorage.getItem('currentGold')
    
    if (storedMoney && storedGold) {
      setMoney(storedMoney)
      setGold(storedGold)
      setDataLoaded(true)
    } else {
      // Fallback: try to get from URL parameters (for direct access)
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
    
    // Update sessionStorage
    sessionStorage.setItem('currentMoney', newMoney)
    sessionStorage.setItem('currentGold', newGold)
  }

  return {
    money,
    gold,
    dataLoaded,
    updateCurrency
  }
}
