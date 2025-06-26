'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { getItemName } from '../../data/items';

interface ItemBatchLookupProps {
  className?: string;
}

interface BatchResult {
  id: number;
  name: string;
  isUnknown: boolean;
}

export function ItemBatchLookup({ className }: ItemBatchLookupProps) {
  const [inputText, setInputText] = useState('');
  const [results, setResults] = useState<BatchResult[]>([]);

  const handleBatchLookup = () => {
    if (!inputText.trim()) return;

    // Parse input text to extract numbers
    const numbers = inputText
      .split(/[,\s\n]+/)
      .map(s => s.trim())
      .filter(s => s !== '')
      .map(s => parseInt(s))
      .filter(n => !isNaN(n));

    const batchResults: BatchResult[] = numbers.map(id => {
      const name = getItemName(id);
      const isUnknown = name.includes('Vật phẩm không xác định');
      return { id, name, isUnknown };
    });

    setResults(batchResults);
  };

  const handleClear = () => {
    setInputText('');
    setResults([]);
  };

  const handleCopyResults = () => {
    const text = results
      .map(result => `${result.id}\t${result.name}`)
      .join('\n');
    navigator.clipboard.writeText(text);
    alert('Đã copy kết quả vào clipboard!');
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle>Tra cứu hàng loạt</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Nhập danh sách ID (cách nhau bằng dấu phẩy, khoảng trắng hoặc xuống dòng):
            </label>
            <textarea
              placeholder="Ví dụ: 1, 2, 3 hoặc&#10;1&#10;2&#10;3"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full h-32 p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleBatchLookup}>
              Tra cứu hàng loạt
            </Button>
            <Button variant="outline" onClick={handleClear}>
              Xóa
            </Button>
            {results.length > 0 && (
              <Button variant="outline" onClick={handleCopyResults}>
                Copy kết quả
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              Kết quả tra cứu ({results.length} vật phẩm)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-96 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">ID</TableHead>
                    <TableHead>Tên vật phẩm</TableHead>
                    <TableHead className="w-24">Trạng thái</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((result, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-mono">{result.id}</TableCell>
                      <TableCell className={result.isUnknown ? 'text-red-600' : ''}>
                        {result.name}
                      </TableCell>
                      <TableCell>
                        {result.isUnknown ? (
                          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                            Không tìm thấy
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            Tìm thấy
                          </span>
                        )}
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

export default ItemBatchLookup;
