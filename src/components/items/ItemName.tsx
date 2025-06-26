import { getItemName } from '../../data/items';

interface ItemNameProps {
  id: number;
  className?: string;
  showId?: boolean;
  fallback?: string;
}

export function ItemName({ 
  id, 
  className = '', 
  showId = false, 
  fallback = 'Vật phẩm không xác định' 
}: ItemNameProps) {
  const itemName = getItemName(id);
  const isUnknown = itemName.includes('Vật phẩm không xác định');
  
  return (
    <span className={`${className} ${isUnknown ? 'text-red-600' : 'text-gray-900'}`}>
      {showId && (
        <span className="font-mono text-sm text-gray-500">
          [{id}] 
        </span>
      )}
      {isUnknown ? fallback : itemName}
    </span>
  );
}

interface ItemDisplayProps {
  id: number;
  quantity?: number;
  className?: string;
  showQuantity?: boolean;
}

export function ItemDisplay({ 
  id, 
  quantity, 
  className = '', 
  showQuantity = true 
}: ItemDisplayProps) {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <ItemName id={id} showId={true} />
      {showQuantity && quantity !== undefined && (
        <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
          x{quantity}
        </span>
      )}
    </div>
  );
}

export default ItemName;
