import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Pencil, 
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface InventoryItem {
  id: number;
  name: string;
  sku: string;
  categoryId: number;
  stock: number;
  price: number;
  imageUrl?: string;
}

interface InventoryTableProps {
  items: InventoryItem[];
  onEdit: (item: InventoryItem) => void;
  onDelete: (item: InventoryItem) => void;
}

export default function InventoryTable({ items, onEdit, onDelete }: InventoryTableProps) {
  // Function to get stock status badge
  const getStockStatusBadge = (stock: number) => {
    if (stock === 0) {
      return <Badge variant="destructive">Out of Stock</Badge>;
    } else if (stock <= 5) {
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Low Stock</Badge>;
    } else {
      return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">In Stock</Badge>;
    }
  };

  // Function to format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  // Placeholder image for items without image
  const placeholderImage = "https://via.placeholder.com/40x40";

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="pl-6">Item</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right pr-6">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No inventory items found.
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="pl-6">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <img 
                        src={item.imageUrl || placeholderImage} 
                        alt={item.name} 
                        className="h-10 w-10 rounded-md object-cover"
                      />
                    </div>
                    <div className="ml-4">
                      <div className="font-medium text-gray-900">{item.name}</div>
                      <div className="text-gray-500 text-xs">SKU: {item.sku}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{item.categoryId}</TableCell>
                <TableCell>{item.stock}</TableCell>
                <TableCell>{formatPrice(item.price)}</TableCell>
                <TableCell>{getStockStatusBadge(item.stock)}</TableCell>
                <TableCell className="text-right pr-6">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(item)}
                    className="text-blue-600 hover:text-blue-900 mr-1"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(item)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
