'use client'

import React from 'react'
import { PageHeader } from '@/components/currency/PageHeader'
import { CurrencyEditor } from '@/components/currency/CurrencyEditor'
import { CurrencyDisplay } from '@/components/currency/CurrencyDisplay'
import { useCurrencyData } from '@/components/currency/useCurrencyData'

export default function CurrencyManagerPage() {
  const { money, gold, dataLoaded, updateCurrency } = useCurrencyData()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="mx-auto max-w-2xl">
        <PageHeader 
          title="Quản lý tiền tệ" 
          description="Quản lý tiền và vàng trong game của bạn"
        />

        <div className="space-y-6">
          <CurrencyEditor
            money={money}
            gold={gold}
            onUpdate={updateCurrency}
            dataLoaded={dataLoaded}
          />
          
          <CurrencyDisplay
            money={money}
            gold={gold}
          />
        </div>
      </div>
    </div>
  )
}
