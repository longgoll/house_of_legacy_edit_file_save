'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Copy, Download, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

export default function RawDataPage() {
  const [gameData, setGameData] = useState<Record<string, unknown> | null>(null)
  const [fileName, setFileName] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [filteredData, setFilteredData] = useState<string>('')

  useEffect(() => {
    // Read data from sessionStorage instead of URL parameters
    const storedGameData = sessionStorage.getItem('gameData')
    const storedFileName = sessionStorage.getItem('fileName')
    
    if (storedGameData) {
      try {
        const parsedData = JSON.parse(storedGameData)
        setGameData(parsedData)
        setFileName(storedFileName || 'GameData.es3')
        setFilteredData(JSON.stringify(parsedData, null, 2))
      } catch (error) {
        console.error('Error parsing stored game data:', error)
      }
    }
  }, [])

  useEffect(() => {
    if (gameData && searchTerm) {
      const filtered = Object.keys(gameData).reduce((acc, key) => {
        if (key.toLowerCase().includes(searchTerm.toLowerCase()) || 
            JSON.stringify(gameData[key]).toLowerCase().includes(searchTerm.toLowerCase())) {
          acc[key] = gameData[key]
        }
        return acc
      }, {} as Record<string, unknown>)
      setFilteredData(JSON.stringify(filtered, null, 2))
    } else if (gameData) {
      setFilteredData(JSON.stringify(gameData, null, 2))
    }
  }, [searchTerm, gameData])

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(filteredData)
      alert('Đã sao chép dữ liệu vào clipboard!')
    } catch (error) {
      console.error('Error copying to clipboard:', error)
      alert('Không thể sao chép dữ liệu!')
    }
  }

  const downloadData = () => {
    const blob = new Blob([filteredData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName.replace('.es3', '_modified.json')
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getDataStats = () => {
    if (!gameData) return { keys: 0, nested: 0, arrays: 0 }
    
    let keys = 0
    let nested = 0
    let arrays = 0
    
    const countStats = (obj: unknown) => {
      if (typeof obj === 'object' && obj !== null) {
        if (Array.isArray(obj)) {
          arrays++
          obj.forEach(countStats)
        } else {
          const record = obj as Record<string, unknown>
          keys += Object.keys(record).length
          Object.values(record).forEach(value => {
            if (typeof value === 'object' && value !== null) {
              nested++
            }
            countStats(value)
          })
        }
      }
    }
    
    countStats(gameData)
    return { keys, nested, arrays }
  }

  const stats = getDataStats()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/menu">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Quay lại Menu
              </Button>
            </Link>
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Dữ liệu thô</h1>
            <p className="text-slate-600">Xem và tương tác với dữ liệu JSON từ file game</p>
            {fileName && (
              <div className="mt-2 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full inline-block">
                File: {fileName}
              </div>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-700">{stats.keys}</div>
                <div className="text-sm text-blue-600">Tổng số keys</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-700">{stats.nested}</div>
                <div className="text-sm text-green-600">Objects lồng nhau</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-700">{stats.arrays}</div>
                <div className="text-sm text-purple-600">Arrays</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <Card className="mb-6 border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl text-slate-800">Công cụ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Tìm kiếm trong dữ liệu..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={copyToClipboard} variant="outline" className="flex items-center gap-2">
                  <Copy className="h-4 w-4" />
                  Sao chép
                </Button>
                <Button onClick={downloadData} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
                  <Download className="h-4 w-4" />
                  Tải xuống
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Display */}
        <Card className="border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl text-slate-800">Dữ liệu JSON</CardTitle>
            <CardDescription>
              {searchTerm ? `Kết quả tìm kiếm cho: "${searchTerm}"` : 'Toàn bộ dữ liệu từ file'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-900 rounded-lg p-4 overflow-auto max-h-96">
              <pre className="text-green-400 text-sm whitespace-pre-wrap font-mono">
                {filteredData || 'Không có dữ liệu để hiển thị'}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
