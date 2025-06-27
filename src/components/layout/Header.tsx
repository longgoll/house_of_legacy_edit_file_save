'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Home, Menu, FileText, X } from 'lucide-react'
import { ExportButton } from '@/components/ui/export-button'

interface HeaderProps {
  showBackButton?: boolean
  showHomeButton?: boolean
}

export function Header({ 
  showBackButton = true, 
  showHomeButton = true 
}: HeaderProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [hasGameData, setHasGameData] = useState(false)
  
  useEffect(() => {
    const checkGameData = () => {
      const gameData = sessionStorage.getItem('gameData')
      setHasGameData(!!gameData)
    }
    
    checkGameData()
    
    // Listen for sessionStorage changes
    const handleStorageChange = () => {
      checkGameData()
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    // Check periodically in case sessionStorage is modified from same tab
    const interval = setInterval(checkGameData, 1000)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [])
  
  const isHomePage = pathname === '/'
  const isMenuPage = pathname === '/menu'

  return (
    <header className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-200/60 dark:border-slate-800/60 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                  Game Tool
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 -mt-1">
                  House of Legacy
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {/* Navigation items removed */}
          </nav>

          {/* Desktop Action buttons */}
          <div className="hidden md:flex items-center space-x-2">
            {hasGameData && !isHomePage && (
              <ExportButton variant="outline" size="sm" />
            )}
            {!isHomePage && showBackButton && (
              <Link href={isMenuPage ? "/" : "/menu"}>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  {isMenuPage ? "Trang chủ" : "Menu"}
                </Button>
              </Link>
            )}
            {!isHomePage && showHomeButton && !isMenuPage && (
              <Link href="/">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Trang chủ
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && !isHomePage && (
          <div className="md:hidden py-4 border-t border-slate-200 dark:border-slate-700">
            <div className="space-y-2">
              {/* Mobile navigation items removed */}
              <div className="border-t border-slate-200 dark:border-slate-700 pt-2 mt-2 space-y-2">
                {hasGameData && (
                  <div className="px-2">
                    <ExportButton variant="outline" size="sm" className="w-full" />
                  </div>
                )}
                {showBackButton && (
                  <Link href={isMenuPage ? "/" : "/menu"} onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                      <ArrowLeft className="h-4 w-4" />
                      {isMenuPage ? "Trang chủ" : "Menu"}
                    </Button>
                  </Link>
                )}
                {showHomeButton && !isMenuPage && (
                  <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                      <Home className="h-4 w-4" />
                      Trang chủ
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
