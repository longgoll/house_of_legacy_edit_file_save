'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface FamilyMember {
  index: number
  name: string
  age: number
  literaryTalent: number
  martialTalent: number
  commercialTalent: number
  artisticTalent: number
  strategy: number
  reputation: number
  luck: number
  charm: number
  health: number
  talentType: number
  talent: number
  skillType: number
  skill: number
}

export default function FamilyMembersPage() {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if we're in the browser environment
    if (typeof window === "undefined") return;

    const loadFamilyMemberData = () => {
      try {
        const gameDataString = sessionStorage.getItem('gameData')
        
        if (!gameDataString) {
          setError('Không tìm thấy dữ liệu game trong sessionStorage')
          setLoading(false)
          return
        }

        const gameData = JSON.parse(gameDataString)
        
        // Debug: log the structure to understand the data
        console.log('Full gameData:', gameData)
        console.log('Member_now:', gameData.Member_now)
        
        if (!gameData.Member_now) {
          setError('Không tìm thấy dữ liệu Member_now trong gameData')
          setLoading(false)
          return
        }

        // Check if Member_now has value property and it's an array
        let memberArray;
        if (Array.isArray(gameData.Member_now)) {
          memberArray = gameData.Member_now;
        } else if (gameData.Member_now.value && Array.isArray(gameData.Member_now.value)) {
          memberArray = gameData.Member_now.value;
        } else {
          setError('Cấu trúc dữ liệu Member_now không hợp lệ')
          setLoading(false)
          return
        }

        console.log('Member array:', memberArray)
        console.log('Member count:', memberArray.length)

        const members: FamilyMember[] = memberArray.map((memberData: unknown, index: number) => {
          console.log(`Processing member ${index}:`, memberData)
          
          // Handle different possible structures
          let memberInfo: unknown[];
          
          if (Array.isArray(memberData)) {
            memberInfo = memberData;
          } else if (memberData && typeof memberData === 'object' && 'value' in memberData) {
            const memberObj = memberData as { value: unknown };
            if (Array.isArray(memberObj.value)) {
              memberInfo = memberObj.value;
            } else {
              console.warn(`Member ${index} value is not an array:`, memberObj.value);
              return null;
            }
          } else {
            console.warn(`Member ${index} has unexpected structure:`, memberData);
            return null;
          }

          console.log(`Member ${index} info array:`, memberInfo)
          
          // Extract member information from the array
          // Safely access each index and handle both direct values and {value: ...} objects
          const getValue = (item: unknown): string | number => {
            if (item === null || item === undefined) return '';
            if (typeof item === 'string' || typeof item === 'number') return item;
            if (typeof item === 'object' && 'value' in item) {
              const obj = item as { value: unknown };
              return obj.value as string | number;
            }
            return String(item);
          };

          // Extract talent type from index 4 using split (index 2 after split)
          const getTalentTypeFromIndex4 = (item: unknown): number => {
            const rawValue = getValue(item);
            if (typeof rawValue === 'string' && rawValue.includes('|')) {
              const parts = rawValue.split('|');
              if (parts.length > 2) {
                return Number(parts[2]) || 0;
              }
            }
            return 0;
          };

          // Extract skill type from index 4 using split (index 6 after split)
          const getSkillTypeFromIndex4 = (item: unknown): number => {
            const rawValue = getValue(item);
            if (typeof rawValue === 'string' && rawValue.includes('|')) {
              const parts = rawValue.split('|');
              if (parts.length > 6) {
                return Number(parts[6]) || 0;
              }
            }
            return 0;
          };

          // Extract luck value from index 4 using split (index 7 after split)
          const getLuckFromIndex4 = (item: unknown): number => {
            const rawValue = getValue(item);
            if (typeof rawValue === 'string' && rawValue.includes('|')) {
              const parts = rawValue.split('|');
              if (parts.length > 7) {
                return Number(parts[7]) || 0;
              }
            }
            return 0;
          };

          // Extract talent value from index 4 using split (index 3 after split)
          const getTalentFromIndex4 = (item: unknown): number => {
            const rawValue = getValue(item);
            if (typeof rawValue === 'string' && rawValue.includes('|')) {
              const parts = rawValue.split('|');
              if (parts.length > 3) {
                return Number(parts[3]) || 0;
              }
            }
            return 0;
          };

          // Extract name from index 4 using split
          const getNameFromIndex4 = (item: unknown): string => {
            const rawValue = getValue(item);
            if (typeof rawValue === 'string' && rawValue.includes('|')) {
              const parts = rawValue.split('|');
              if (parts.length > 0) {
                return parts[0] || 'Không rõ';
              }
            }
            return String(rawValue) || 'Không rõ';
          };

          return {
            index: index,
            name: getNameFromIndex4(memberInfo[4]),
            age: Number(getValue(memberInfo[6])) || 0,
            literaryTalent: Number(getValue(memberInfo[7])) || 0,
            martialTalent: Number(getValue(memberInfo[8])) || 0,
            commercialTalent: Number(getValue(memberInfo[9])) || 0,
            artisticTalent: Number(getValue(memberInfo[10])) || 0,
            strategy: Number(getValue(memberInfo[27])) || 0,
            reputation: Number(getValue(memberInfo[16])) || 0,
            luck: getLuckFromIndex4(memberInfo[4]),
            charm: Number(getValue(memberInfo[20])) || 0,
            health: Number(getValue(memberInfo[21])) || 0,
            talentType: getTalentTypeFromIndex4(memberInfo[4]),
            talent: getTalentFromIndex4(memberInfo[4]),
            skillType: getSkillTypeFromIndex4(memberInfo[4]),
            skill: Number(getValue(memberInfo[33])) || 0,
          }
        }).filter((member: FamilyMember | null): member is FamilyMember => member !== null)

        console.log('Processed members:', members)
        setFamilyMembers(members)
        
      } catch (err) {
        console.error('Error loading family member data:', err)
        setError('Lỗi khi đọc dữ liệu: ' + (err as Error).message)
      } finally {
        setLoading(false)
      }
    }

    // Load data immediately
    loadFamilyMemberData()

    // Listen for storage changes (in case data is updated)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'gameData') {
        setLoading(true)
        loadFamilyMemberData()
      }
    }

    window.addEventListener('storage', handleStorageChange)

    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  // Helper functions to convert type numbers to readable text
  const getTalentTypeName = (type: number): string => {
    switch (type) {
      case 0: return 'Không có';
      case 1: return 'Văn tài';
      case 2: return 'Võ tài';
      case 3: return 'Thương tài';
      case 4: return 'Nghệ tài';
      default: return 'Không rõ';
    }
  };

  const getSkillTypeName = (type: number): string => {
    switch (type) {
      case 0: return 'Không có';
      case 1: return 'Đạo pháp';
      case 2: return 'Y học';
      case 3: return 'Vận may';
      case 4: return 'Bói toán';
      case 5: return 'Sự quyến rũ';
      case 6: return 'Thủ công';
      default: return 'Không rõ';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200 border-t-blue-600 mx-auto"></div>
            <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-t-blue-400 animate-spin mx-auto" style={{animationDelay: '0.1s', animationDuration: '1.5s'}}></div>
          </div>
          <div className="space-y-2">
            <p className="text-xl font-semibold text-slate-700">Đang tải dữ liệu</p>
            <p className="text-slate-500">Thành viên gia đình đang được chuẩn bị...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
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
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Thử lại
            </button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="container mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
            Thành Viên Gia Đình
          </h1>
          <p className="text-slate-600 text-lg">
            Quản lý và theo dõi thông tin chi tiết của 
            <span className="font-semibold text-blue-600 mx-1">{familyMembers.length}</span>
            thành viên
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Tổng thành viên</p>
                  <p className="text-3xl font-bold">{familyMembers.length}</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm font-medium">Tuổi trung bình</p>
                  <p className="text-3xl font-bold">
                    {familyMembers.length > 0 ? Math.round(familyMembers.reduce((sum, m) => sum + m.age, 0) / familyMembers.length) : 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Thiên phú cao</p>
                  <p className="text-3xl font-bold">
                    {familyMembers.filter(m => m.talent >= 1000).length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Sức khỏe tốt</p>
                  <p className="text-3xl font-bold">
                    {familyMembers.filter(m => m.health >= 70).length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Table Card */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                Chi Tiết Thành Viên
              </CardTitle>
              <div className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                {familyMembers.length} người
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-slate-100 to-slate-50 border-b border-slate-200 hover:bg-gradient-to-r hover:from-slate-100 hover:to-slate-50">
                  <TableHead className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Tên</TableHead>
                  <TableHead className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">Tuổi</TableHead>
                  <TableHead className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">Văn Tài</TableHead>
                  <TableHead className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">Võ Tài</TableHead>
                  <TableHead className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">Thương Tài</TableHead>
                  <TableHead className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">Nghệ Tài</TableHead>
                  <TableHead className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">Chiến Lược</TableHead>
                  <TableHead className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">Danh Tiếng</TableHead>
                  <TableHead className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">May Mắn</TableHead>
                  <TableHead className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">Sự Quyến Rũ</TableHead>
                  <TableHead className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">Sức Khỏe</TableHead>
                  <TableHead className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">Loại Thiên Phú</TableHead>
                  <TableHead className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">Giá Trị Thiên Phú</TableHead>
                  <TableHead className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">Loại Kỹ Năng</TableHead>
                  <TableHead className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">Giá Trị Kỹ Năng</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {familyMembers.map((member, idx) => (
                  <TableRow key={member.index} className={`transition-colors duration-200 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full flex items-center justify-center">
                          <span className="text-slate-600 font-semibold text-sm">
                            {member.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{member.name}</div>
                          <div className="text-xs text-slate-500">Thành viên #{member.index}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                        {member.age}
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      <div className="font-medium text-slate-900">
                        {member.literaryTalent}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      <div className="font-medium text-slate-900">
                        {member.martialTalent}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      <div className="font-medium text-slate-900">
                        {member.commercialTalent}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      <div className="font-medium text-slate-900">
                        {member.artisticTalent}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      <div className="font-medium text-slate-900">
                        {member.strategy}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      <div className="font-medium text-slate-900">
                        {member.reputation}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      <div className="font-medium text-slate-900">
                        {member.luck}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      <div className="font-medium text-slate-900">
                        {member.charm}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      <div className="font-medium text-slate-900">
                        {member.health}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      <div className="font-medium text-slate-900">
                        {getTalentTypeName(member.talentType)}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      <div className="font-medium text-slate-900">
                        {member.talent}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      <div className="font-medium text-slate-900">
                        {getSkillTypeName(member.skillType)}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      <div className="font-medium text-slate-900">
                        {member.skill}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {familyMembers.length === 0 && (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-600 mb-2">Chưa có thành viên nào</h3>
                <p className="text-slate-500">Hãy thêm dữ liệu game để hiển thị thông tin thành viên gia đình</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
