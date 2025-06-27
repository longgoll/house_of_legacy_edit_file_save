'use client'

import React from 'react'
import { CurrencyEditor } from '@/components/currency/CurrencyEditor'
import { CurrencyDisplay } from '@/components/currency/CurrencyDisplay'
import { useCurrencyData } from '@/components/currency/useCurrencyData'
import { ExportButton } from '@/components/ui/export-button'

export default function CurrencyManagerPage() {
  const { money, gold, dataLoaded, updateCurrency } = useCurrencyData()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto p-6 pt-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-100 to-green-100 dark:from-yellow-900/30 dark:to-green-900/30 rounded-full text-yellow-700 dark:text-yellow-300 text-sm font-medium mb-4">
              💰 Currency Management
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 via-green-600 to-blue-600 bg-clip-text text-transparent">
              Quản lý Tiền tệ
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-green-400/10 rounded-3xl blur-2xl"></div>
              <div className="relative">
                <CurrencyEditor
                  money={money}
                  gold={gold}
                  onUpdate={updateCurrency}
                  dataLoaded={dataLoaded}
                />
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-3xl blur-2xl"></div>
              <div className="relative">
                <CurrencyDisplay
                  money={money}
                  gold={gold}
                />
              </div>
            </div>
          </div>
          
          {dataLoaded && (
            <div className="flex justify-center">
              <ExportButton 
                variant="outline" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-none px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105" 
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
