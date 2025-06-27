'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Coins, Users, FileText, Crown, Shield, Sword, Package, CheckCircle } from 'lucide-react'
import { ExportButton } from '@/components/ui/export-button'
import { QRWelcomeDialog } from '@/components/ui/qr-welcome-dialog'

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
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(false)

  useEffect(() => {
    // Read data from sessionStorage instead of URL parameters
    const storedGameData = sessionStorage.getItem('gameData')
    const storedFileName = sessionStorage.getItem('fileName')
    
    if (storedGameData) {
      try {
        const parsedData = JSON.parse(storedGameData)
        setGameData(parsedData)
        setFileName(storedFileName || 'GameData.es3')
        
        // Show welcome dialog if first time visiting menu
        const hasVisitedMenu = sessionStorage.getItem('hasVisitedMenu')
        if (!hasVisitedMenu) {
          setShowWelcomeDialog(true)
          sessionStorage.setItem('hasVisitedMenu', 'true')
        }
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
      available: true
    },
    {
      id: 'servants',
      title: 'Môn khách',
      description: 'Quản lý các môn khách',
      icon: <Shield className="h-6 w-6" />,
      href: '/servants',
      available: true
    },
    {
      id: 'inventory',
      title: 'Quản lý kho đồ',
      description: 'Chỉnh sửa thông tin kho đồ',
      icon: <Sword className="h-6 w-6" />,
      href: '/inventory-manager',
      available: true
    },
    {
      id: 'item-manager',
      title: 'Tra cứu vật phẩm',
      description: 'Tra cứu thông tin vật phẩm theo ID hoặc tên',
      icon: <Package className="h-6 w-6" />,
      href: '/item-manager',
      available: true
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
    } else if (option.id === 'item-manager') {
      // Item manager doesn't need game data, go directly
      window.location.href = option.href
    } else {
      // For other pages, data is already in sessionStorage
      window.location.href = option.href
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto p-6 pt-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="flex items-center justify-between py-2 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-slate-600 dark:text-slate-400">Menu</span>
            </div>
            {fileName && (
              <div className="flex items-center px-2 py-1 bg-green-50 dark:bg-green-900/20 rounded text-green-600 dark:text-green-400 text-xs">
                <CheckCircle className="h-3 w-3 mr-1" />
                {fileName}
              </div>
            )}
          </div>

          {/* Stats Overview */}
          {gameData && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-2xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 dark:border-slate-800/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
                    {gameData.CGNum?.value?.[0] || '0'}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Tiền</div>
                </div>
              </div>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-2xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 dark:border-slate-800/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-1">
                    {gameData.CGNum?.value?.[1] || '0'}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Vàng</div>
                </div>
              </div>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-2xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 dark:border-slate-800/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                    {Object.keys(gameData).filter(key => key.startsWith('FM')).length}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Thành viên</div>
                </div>
              </div>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-2xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 dark:border-slate-800/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                    {Object.keys(gameData).length}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Tổng thuộc tính</div>
                </div>
              </div>
            </div>
          )}

          {/* Export Button */}
          {gameData && (
            <div className="flex justify-center mb-8">
              <ExportButton className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105" />
            </div>
          )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuOptions.map((option) => (
            <div key={option.id} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <Card 
                className={`relative cursor-pointer transition-all duration-300 border border-slate-200/50 dark:border-slate-800/50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-lg hover:shadow-2xl ${
                  !option.available ? 'opacity-60' : 'hover:scale-105 hover:-translate-y-2'
                }`}
                onClick={() => handleMenuClick(option)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4">
                    <div className={`relative rounded-2xl p-4 transition-all duration-300 ${
                      option.available 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg group-hover:shadow-xl group-hover:scale-110' 
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      {option.icon}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl text-slate-800 dark:text-slate-200 flex items-center gap-3">
                        {option.title}
                        {!option.available && (
                          <span className="text-xs bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1 rounded-full shadow-sm">
                            Sắp có
                          </span>
                        )}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-600 dark:text-slate-400 text-base leading-relaxed">
                    {option.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Welcome Dialog */}
        <QRWelcomeDialog 
          open={showWelcomeDialog} 
          onOpenChange={setShowWelcomeDialog} 
        />
        </div>
      </div>
    </div>
  )
}
