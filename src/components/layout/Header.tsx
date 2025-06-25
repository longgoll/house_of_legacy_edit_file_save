'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Home, Menu, Coins, Users, FileText, X } from 'lucide-react'

interface HeaderProps {
  title?: string
  description?: string
  showBackButton?: boolean
  showHomeButton?: boolean
}

export function Header({ 
  title, 
  description, 
  showBackButton = true, 
  showHomeButton = true 
}: HeaderProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const getPageInfo = () => {
    switch (pathname) {
      case '/':
        return { title: 'Game Tool', description: 'Tải lên và xử lý file game của bạn một cách dễ dàng' }
      case '/menu':
        return { title: 'Menu chính', description: 'Chọn tính năng bạn muốn sử dụng' }
      case '/currency-manager':
        return { title: 'Quản lý tiền tệ', description: 'Quản lý tiền và vàng trong game của bạn' }
      case '/family-members':
        return { title: 'Quản lý thành viên gia đình', description: 'Xem và chỉnh sửa thông tin thành viên gia đình' }
      case '/family-info':
        return { title: 'Thông tin gia đình', description: 'Xem thông tin tổng quan về gia đình' }
      case '/raw-data':
        return { title: 'Dữ liệu thô', description: 'Xem dữ liệu JSON của file game' }
      default:
        return { title: title || 'Game Tool', description: description || '' }
    }
  }

  const { title: pageTitle, description: pageDesc } = getPageInfo()
  const isHomePage = pathname === '/'
  const isMenuPage = pathname === '/menu'

  const navigationItems = [
    { href: '/menu', label: 'Menu', icon: Menu, active: isMenuPage },
    { href: '/currency-manager', label: 'Tiền tệ', icon: Coins, active: pathname === '/currency-manager' },
    { href: '/family-members', label: 'Thành viên', icon: Users, active: pathname === '/family-members' },
    { href: '/family-info', label: 'Gia đình', icon: Users, active: pathname === '/family-info' },
    { href: '/raw-data', label: 'Dữ liệu', icon: FileText, active: pathname === '/raw-data' },
  ]

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Game Tool
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            {!isHomePage && navigationItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button 
                  variant={item.active ? "default" : "ghost"} 
                  size="sm" 
                  className="flex items-center gap-2"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>

          {/* Desktop Action buttons */}
          <div className="hidden md:flex items-center space-x-2">
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
              {navigationItems.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                  <Button 
                    variant={item.active ? "default" : "ghost"} 
                    size="sm" 
                    className="w-full justify-start gap-2"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              ))}
              <div className="border-t border-slate-200 dark:border-slate-700 pt-2 mt-2 space-y-2">
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

        {/* Page title section */}
        {(pageTitle || pageDesc) && (
          <div className="pb-6 pt-4 text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              {pageTitle}
            </h1>
            {pageDesc && (
              <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                {pageDesc}
              </p>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
