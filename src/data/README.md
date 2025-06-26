# Hệ thống tra cứu vật phẩm

## Tổng quan
Hệ thống này cung cấp khả năng tra cứu thông tin vật phẩm dựa trên ID hoặc tên, hỗ trợ việc phân tích dữ liệu character từ file game.

## Các file quan trọng

### 1. Data vật phẩm
- **File**: `src/data/items.ts`
- **Mô tả**: Chứa mapping giữa ID vật phẩm (0-284) và tên tiếng Việt
- **Chức năng**:
  - `getItemName(id)`: Lấy tên vật phẩm từ ID
  - `getItemId(name)`: Tìm ID từ tên vật phẩm
  - `searchItems(query)`: Tìm kiếm vật phẩm theo tên
  - `getAllItems()`: Lấy danh sách tất cả vật phẩm

### 2. Components tra cứu

#### ItemLookup (`src/components/items/ItemLookup.tsx`)
- Tra cứu vật phẩm đơn lẻ theo ID hoặc tên
- Tìm kiếm và hiển thị kết quả trong bảng
- Xem danh sách tất cả vật phẩm

#### ItemBatchLookup (`src/components/items/ItemBatchLookup.tsx`)
- Tra cứu nhiều vật phẩm cùng lúc
- Nhập danh sách ID (cách nhau bằng dấu phẩy, khoảng trắng, xuống dòng)
- Copy kết quả ra clipboard
- Hiển thị trạng thái tìm thấy/không tìm thấy

#### ItemName & ItemDisplay (`src/components/items/ItemName.tsx`)
- Components tiện ích để hiển thị tên vật phẩm
- Tự động hiển thị "Vật phẩm không xác định" cho ID không hợp lệ
- Hỗ trợ hiển thị ID cùng với tên
- ItemDisplay: hiển thị vật phẩm với số lượng

### 3. Trang tra cứu
- **URL**: `/item-manager`
- **File**: `src/app/item-manager/page.tsx`
- **Tính năng**:
  - Tab "Tra cứu đơn lẻ"
  - Tab "Tra cứu hàng loạt"

## Cách sử dụng

### 1. Tra cứu đơn lẻ
```typescript
import { getItemName } from '@/data/items';

const itemName = getItemName(0); // "hương nến"
```

### 2. Tìm kiếm
```typescript
import { searchItems } from '@/data/items';

const results = searchItems("đan"); // Tìm tất cả vật phẩm có chứa "đan"
```

### 3. Sử dụng component
```tsx
import { ItemName, ItemDisplay } from '@/components/items';

// Hiển thị tên vật phẩm
<ItemName id={0} showId={true} />

// Hiển thị vật phẩm với số lượng
<ItemDisplay id={0} quantity={5} />
```

## Mở rộng

### Thêm vật phẩm mới
Cập nhật object `ITEMS_DATA` trong file `src/data/items.ts`:
```typescript
export const ITEMS_DATA: Record<number, string> = {
  // ...existing items...
  285: "tên vật phẩm mới",
  286: "vật phẩm khác",
};
```

### Thêm metadata cho vật phẩm
Có thể mở rộng để thêm thông tin như loại vật phẩm, độ hiếm, mô tả:
```typescript
interface ItemData {
  id: number;
  name: string;
  category?: string;
  rarity?: string;
  description?: string;
}
```

## Integration với character data

Khi phân tích dữ liệu character, có thể sử dụng hệ thống này để:
1. Chuyển đổi ID vật phẩm thành tên hiển thị
2. Lọc và tìm kiếm vật phẩm trong kho
3. Tạo báo cáo thống kê vật phẩm

Ví dụ:
```typescript
// Giả sử có mảng vật phẩm từ character data
const characterItems = [
  { id: 0, quantity: 5 },
  { id: 29, quantity: 100 },
  { id: 68, quantity: 3 }
];

// Chuyển đổi thành danh sách hiển thị
const itemList = characterItems.map(item => ({
  ...item,
  name: getItemName(item.id)
}));
```
