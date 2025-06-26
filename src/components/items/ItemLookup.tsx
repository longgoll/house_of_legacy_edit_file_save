'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { getItemName, getItemId, searchItems, getAllItems } from '../../data/items';

interface ItemLookupProps {
  className?: string;
}

export function ItemLookup({ className }: ItemLookupProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ id: number; name: string }>>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [selectedName, setSelectedName] = useState('');
  const [showAll, setShowAll] = useState(false);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const results = searchItems(searchQuery.trim());
      setSearchResults(results);
      setShowAll(false);
    }
  };

  const handleShowAll = () => {
    const allItems = getAllItems();
    setSearchResults(allItems);
    setShowAll(true);
    setSearchQuery('');
  };

  const handleLookupById = () => {
    if (selectedId.trim()) {
      const id = parseInt(selectedId);
      const name = getItemName(id);
      setSelectedName(name);
    }
  };

  const handleLookupByName = (itemName: string) => {
    const id = getItemId(itemName);
    if (id !== null) {
      setSelectedId(id.toString());
      setSelectedName(itemName);
    }
  };

  const clearResults = () => {
    setSearchResults([]);
    setSearchQuery('');
    setSelectedId('');
    setSelectedName('');
    setShowAll(false);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Tra cứu theo ID */}
      <Card>
        <CardHeader>
          <CardTitle>Tra cứu vật phẩm theo ID</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Nhập ID vật phẩm (0-284)"
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleLookupById}>Tra cứu</Button>
          </div>
          {selectedName && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-800">
                <strong>ID {selectedId}:</strong> {selectedName}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tìm kiếm theo tên */}
      <Card>
        <CardHeader>
          <CardTitle>Tìm kiếm vật phẩm theo tên</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Nhập tên vật phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch}>Tìm kiếm</Button>
            <Button variant="outline" onClick={handleShowAll}>
              Xem tất cả
            </Button>
            <Button variant="outline" onClick={clearResults}>
              Xóa
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Kết quả tìm kiếm */}
      {searchResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              {showAll ? 'Tất cả vật phẩm' : `Kết quả tìm kiếm (${searchResults.length} kết quả)`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-96 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">ID</TableHead>
                    <TableHead>Tên vật phẩm</TableHead>
                    <TableHead className="w-24">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {searchResults.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-mono">{item.id}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleLookupByName(item.name)}
                        >
                          Chọn
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default ItemLookup;
