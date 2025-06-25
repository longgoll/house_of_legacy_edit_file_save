'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Coins, Users, Settings, FileText, Crown, Shield, Sword } from 'lucide-react'

interface MenuOption {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  href: string
  available: boolean
}

interface GameData {
  CGNum?: {
    value?: string[]
  }
  [key: string]: unknown
}

export default function MenuPage() {
  const [gameData, setGameData] = useState<GameData | null>(null)
  const [fileName, setFileName] = useState<string>('')

  useEffect(() => {
    // Read data from sessionStorage instead of URL parameters
    const storedGameData = sessionStorage.getItem('gameData')
    const storedFileName = sessionStorage.getItem('fileName')
    
    if (storedGameData) {
      try {
        const parsedData = JSON.parse(storedGameData)
        setGameData(parsedData)
        setFileName(storedFileName || 'GameData.es3')
      } catch (error) {
        console.error('Error parsing stored game data:', error)
      }
    }
  }, [])

  const menuOptions: MenuOption[] = [
    {
      id: 'currency',
      title: 'Quản lý tiền tệ',
      description: 'Chỉnh sửa số tiền và vàng trong game',
      icon: <Coins className="h-6 w-6" />,
      href: '/currency-manager',
      available: true
    },
    {
      id: 'family-members',
      title: 'Thành viên gia đình',
      description: 'Quản lý các thành viên trực hệ trong gia đình',
      icon: <Users className="h-6 w-6" />,
      href: '/family-members',
      available: true
    },
    {
      id: 'married-relatives',
      title: 'Người thân kết hôn',
      description: 'Quản lý những người thân đã kết hôn hoặc đang kết hôn',
      icon: <Crown className="h-6 w-6" />,
      href: '/married-relatives',
      available: false
    },
    {
      id: 'servants',
      title: 'Người hầu cận',
      description: 'Quản lý những người hầu và cận thần trong gia tộc',
      icon: <Shield className="h-6 w-6" />,
      href: '/servants',
      available: false
    },
    {
      id: 'family-info',
      title: 'Thông tin gia tộc',
      description: 'Xem thông tin chi tiết về gia tộc',
      icon: <Users className="h-6 w-6" />,
      href: '/family-info',
      available: true
    },
    {
      id: 'character',
      title: 'Quản lý nhân vật chính',
      description: 'Chỉnh sửa thông tin và thuộc tính nhân vật chính',
      icon: <Sword className="h-6 w-6" />,
      href: '/character-management',
      available: false
    },
    {
      id: 'equipment',
      title: 'Quản lý trang bị',
      description: 'Quản lý vũ khí, áo giáp và trang bị',
      icon: <Settings className="h-6 w-6" />,
      href: '/equipment-management',
      available: false
    },
    {
      id: 'skills',
      title: 'Quản lý kỹ năng',
      description: 'Chỉnh sửa kỹ năng và khả năng đặc biệt',
      icon: <Crown className="h-6 w-6" />,
      href: '/skills-management',
      available: false
    },
    {
      id: 'data',
      title: 'Xem dữ liệu thô',
      description: 'Xem toàn bộ dữ liệu JSON từ file',
      icon: <FileText className="h-6 w-6" />,
      href: '/raw-data',
      available: true
    }
  ]

  const handleMenuClick = (option: MenuOption) => {
    if (!option.available) {
      alert('Chức năng này đang được phát triển!')
      return
    }

    if (option.id === 'currency' && gameData?.CGNum?.value) {
      const money = gameData.CGNum.value[0] || '0'
      const gold = gameData.CGNum.value[1] || '0'
      // Store currency data for currency-manager page
      sessionStorage.setItem('currentMoney', money)
      sessionStorage.setItem('currentGold', gold)
      window.location.href = option.href
    } else {
      // For other pages, data is already in sessionStorage
      window.location.href = option.href
    }
  }

  return (
    <div className="container mx-auto p-6 pt-8">
      <div className="max-w-4xl mx-auto">
        {fileName && (
          <div className="mb-6 text-center">
            <div className="text-sm text-green-600 bg-green-50 dark:bg-green-950/20 px-4 py-2 rounded-full inline-block border border-green-200 dark:border-green-800">
              ✓ Đã tải file: {fileName}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuOptions.map((option) => (
            <Card 
              key={option.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-0 bg-white/80 backdrop-blur-sm ${
                !option.available ? 'opacity-60' : 'hover:scale-105'
              }`}
              onClick={() => handleMenuClick(option)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className={`rounded-full p-2 ${
                    option.available 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    {option.icon}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
                      {option.title}
                      {!option.available && (
                        <span className="text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full">
                          Sắp có
                        </span>
                      )}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-600">
                  {option.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Game Data Info */}
        {gameData && (
          <Card className="mt-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl text-slate-800 flex items-center gap-2">
                <Settings className="h-5 w-5 text-gray-600" />
                Thông tin file đã tải
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-lg font-bold text-green-700">
                    {gameData.CGNum?.value?.[0] || 'N/A'}
                  </div>
                  <div className="text-sm text-green-600">Tiền (Money)</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-lg font-bold text-yellow-700">
                    {gameData.CGNum?.value?.[1] || 'N/A'}
                  </div>
                  <div className="text-sm text-yellow-600">Vàng (Gold)</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-lg font-bold text-blue-700">
                    {Object.keys(gameData).length}
                  </div>
                  <div className="text-sm text-blue-600">Tổng số thuộc tính</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
