'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Home } from 'lucide-react'
import Link from 'next/link'

interface PageHeaderProps {
  title: string
  description: string
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-4 mb-4">
        <Link href="/menu">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Quay lại Menu
          </Button>
        </Link>
        <Link href="/">
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Trang chủ
          </Button>
        </Link>
      </div>
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">{title}</h1>
        <p className="text-slate-600">{description}</p>
      </div>
    </div>
  )
}
