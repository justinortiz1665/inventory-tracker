import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Edit, 
  Trash2,
  ImageOff,
  ExternalLink 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { Link } from "wouter";

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
  // Helper function to determine stock status
  const getStockStatus = (stock: number) => {
    if (stock <= 0) {
      return { label: 'Out of Stock', color: 'bg-red-100 text-red-800' };
    } else if (stock < 10) {
      return { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' };
    } else {
      return { label: 'In Stock', color: 'bg-green-100 text-green-800' };
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Image</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>SKU</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead className="text-right">Actions</TableHead>
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
          items.map((item) => {
            const stockStatus = getStockStatus(item.stock);
            
            return (
              <TableRow key={item.id}>
                <TableCell>
                  {item.imageUrl ? (
                    <div className="h-12 w-12 rounded-md overflow-hidden">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-12 w-12 bg-gray-100 rounded-md flex items-center justify-center">
                      <ImageOff className="h-5 w-5 text-gray-400" />
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span>{item.name}</span>
                    <Link href={`/inventory/${item.id}`} className="text-xs text-blue-600 flex items-center hover:underline">
                      View Details <ExternalLink className="ml-1 h-3 w-3" />
                    </Link>
                  </div>
                </TableCell>
                <TableCell>
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm">{item.sku}</code>
                </TableCell>
                <TableCell>{formatCurrency(item.price)}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <span>{item.stock}</span>
                    <Badge variant="outline" className={stockStatus.color}>
                      {stockStatus.label}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(item)}
                    className="text-blue-600 hover:text-blue-900 mr-1"
                  >
                    <Edit className="h-4 w-4" />
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
            );
          })
        )}
      </TableBody>
    </Table>
  );
}