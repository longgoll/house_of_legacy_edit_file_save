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
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-full mx-auto">
        {/* Simple Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Thành Viên Gia Đình ({familyMembers.length} người)
          </h1>
        </div>

        {/* Scrollable Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead className="px-3 py-2 text-left text-xs font-medium text-gray-700 min-w-[120px]">Tên</TableHead>
                  <TableHead className="px-3 py-2 text-center text-xs font-medium text-gray-700 min-w-[60px]">Tuổi</TableHead>
                  <TableHead className="px-3 py-2 text-center text-xs font-medium text-gray-700 min-w-[80px]">Văn Tài</TableHead>
                  <TableHead className="px-3 py-2 text-center text-xs font-medium text-gray-700 min-w-[80px]">Võ Tài</TableHead>
                  <TableHead className="px-3 py-2 text-center text-xs font-medium text-gray-700 min-w-[80px]">Thương Tài</TableHead>
                  <TableHead className="px-3 py-2 text-center text-xs font-medium text-gray-700 min-w-[80px]">Nghệ Tài</TableHead>
                  <TableHead className="px-3 py-2 text-center text-xs font-medium text-gray-700 min-w-[80px]">Chiến Lược</TableHead>
                  <TableHead className="px-3 py-2 text-center text-xs font-medium text-gray-700 min-w-[80px]">Danh Tiếng</TableHead>
                  <TableHead className="px-3 py-2 text-center text-xs font-medium text-gray-700 min-w-[80px]">May Mắn</TableHead>
                  <TableHead className="px-3 py-2 text-center text-xs font-medium text-gray-700 min-w-[80px]">Quyến Rũ</TableHead>
                  <TableHead className="px-3 py-2 text-center text-xs font-medium text-gray-700 min-w-[80px]">Sức Khỏe</TableHead>
                  <TableHead className="px-3 py-2 text-center text-xs font-medium text-gray-700 min-w-[100px]">Loại Thiên Phú</TableHead>
                  <TableHead className="px-3 py-2 text-center text-xs font-medium text-gray-700 min-w-[90px]">GT Thiên Phú</TableHead>
                  <TableHead className="px-3 py-2 text-center text-xs font-medium text-gray-700 min-w-[100px]">Loại Kỹ Năng</TableHead>
                  <TableHead className="px-3 py-2 text-center text-xs font-medium text-gray-700 min-w-[90px]">GT Kỹ Năng</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {familyMembers.map((member, idx) => (
                  <TableRow key={member.index} className={`hover:bg-gray-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <TableCell className="px-3 py-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-gray-600 font-medium text-sm">
                            {member.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 text-sm">{member.name}</div>
                          <div className="text-xs text-gray-500">#{member.index}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-3 py-2 text-center text-sm">{member.age}</TableCell>
                    <TableCell className="px-3 py-2 text-center text-sm font-medium">{member.literaryTalent}</TableCell>
                    <TableCell className="px-3 py-2 text-center text-sm font-medium">{member.martialTalent}</TableCell>
                    <TableCell className="px-3 py-2 text-center text-sm font-medium">{member.commercialTalent}</TableCell>
                    <TableCell className="px-3 py-2 text-center text-sm font-medium">{member.artisticTalent}</TableCell>
                    <TableCell className="px-3 py-2 text-center text-sm font-medium">{member.strategy}</TableCell>
                    <TableCell className="px-3 py-2 text-center text-sm font-medium">{member.reputation}</TableCell>
                    <TableCell className="px-3 py-2 text-center text-sm font-medium">{member.luck}</TableCell>
                    <TableCell className="px-3 py-2 text-center text-sm font-medium">{member.charm}</TableCell>
                    <TableCell className="px-3 py-2 text-center text-sm font-medium">{member.health}</TableCell>
                    <TableCell className="px-3 py-2 text-center text-sm">{getTalentTypeName(member.talentType)}</TableCell>
                    <TableCell className="px-3 py-2 text-center text-sm font-medium">{member.talent}</TableCell>
                    <TableCell className="px-3 py-2 text-center text-sm">{getSkillTypeName(member.skillType)}</TableCell>
                    <TableCell className="px-3 py-2 text-center text-sm font-medium">{member.skill}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {familyMembers.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-2">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-600 mb-1">Chưa có thành viên nào</h3>
                <p className="text-gray-500">Hãy thêm dữ liệu game để hiển thị thông tin thành viên gia đình</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
