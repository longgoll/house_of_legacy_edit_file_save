'use client'

import React from 'react'
import { CurrencyEditor } from '@/components/currency/CurrencyEditor'
import { CurrencyDisplay } from '@/components/currency/CurrencyDisplay'
import { useCurrencyData } from '@/components/currency/useCurrencyData'
import { ExportButton } from '@/components/ui/export-button'

export default function CurrencyManagerPage() {
  const { money, gold, dataLoaded, updateCurrency } = useCurrencyData()

  return (
    <div className="container mx-auto p-6 pt-8">
      <div className="max-w-2xl mx-auto space-y-6">
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
        
        {dataLoaded && (
          <div className="flex justify-center">
            <ExportButton variant="outline" />
          </div>
        )}
      </div>
    </div>
  )
}
