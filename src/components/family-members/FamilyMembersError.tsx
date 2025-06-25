import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface FamilyMembersErrorProps {
  error: string
  onRetry?: () => void
}

export const FamilyMembersError: React.FC<FamilyMembersErrorProps> = ({ error, onRetry }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6">
      <Card className="max-w-md w-full border-red-200 bg-red-50/50 backdrop-blur-sm shadow-xl">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <CardTitle className="text-red-600 text-xl">Có lỗi xảy ra</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-red-700 bg-white/50 p-4 rounded-lg border border-red-200">{error}</p>
          {onRetry && (
            <button 
              onClick={onRetry} 
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Thử lại
            </button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
