'use client'

import React from 'react'
import { CurrencyEditor } from '@/components/currency/CurrencyEditor'
import { CurrencyDisplay } from '@/components/currency/CurrencyDisplay'
import { useCurrencyData } from '@/components/currency/useCurrencyData'
import { ExportButton } from '@/components/ui/export-button'

export default function CurrencyManagerPage() {
  const { money, gold, dataLoaded, updateCurrency } = useCurrencyData()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto p-6 pt-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-2">
              Quản lý Tiền tệ
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Chỉnh sửa và theo dõi tiền tệ trong game
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <CurrencyEditor
                money={money}
                gold={gold}
                onUpdate={updateCurrency}
                dataLoaded={dataLoaded}
              />
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <CurrencyDisplay
                money={money}
                gold={gold}
              />
            </div>
          </div>
          
          {dataLoaded && (
            <div className="flex justify-center pt-4">
              <ExportButton 
                variant="outline" 
                className="px-6 py-2 rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-gray-700" 
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
