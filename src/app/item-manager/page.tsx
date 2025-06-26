'use client';

import { useState } from 'react';
import { ItemLookup } from '../../components/items';
import { ItemBatchLookup } from '../../components/items/ItemBatchLookup';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';

export default function ItemManagerPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Tra cứu vật phẩm
        </h1>
        <p className="text-gray-600">
          Tra cứu thông tin vật phẩm theo ID hoặc tìm kiếm theo tên
        </p>
      </div>
      
      <Tabs defaultValue="single" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="single">Tra cứu đơn lẻ</TabsTrigger>
          <TabsTrigger value="batch">Tra cứu hàng loạt</TabsTrigger>
        </TabsList>
        
        <TabsContent value="single" className="mt-6">
          <ItemLookup />
        </TabsContent>
        
        <TabsContent value="batch" className="mt-6">
          <ItemBatchLookup />
        </TabsContent>
      </Tabs>
    </div>
  );
}
