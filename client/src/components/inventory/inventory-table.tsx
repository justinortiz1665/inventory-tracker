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
  MoreHorizontal
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
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
      return { 
        label: 'Out of Stock', 
        color: 'bg-red-500 text-white',
        rowColor: 'bg-red-50' 
      };
    } else if (stock < 10) {
      return { 
        label: 'Low Stock', 
        color: 'bg-yellow-500 text-white',
        rowColor: 'bg-yellow-50'
      };
    } else {
      return { 
        label: 'In Stock', 
        color: 'bg-green-100 text-green-800',
        rowColor: ''
      };
    }
  };

  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold">Item #</TableHead>
            <TableHead className="font-semibold">Name</TableHead>
            <TableHead className="font-semibold">Category</TableHead>
            <TableHead className="font-semibold">Vendor</TableHead>
            <TableHead className="font-semibold">Quantity</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No inventory items found.
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => {
              const stockStatus = getStockStatus(item.stock);
              
              return (
                <TableRow key={item.id} className={cn("border-b", stockStatus.rowColor)}>
                  <TableCell className="font-medium">{item.sku}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>Category {item.categoryId}</TableCell>
                  <TableCell>Vendor</TableCell>
                  <TableCell>{item.stock} units</TableCell>
                  <TableCell>
                    <Badge className={stockStatus.color + " rounded-full px-3"}>
                      {stockStatus.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(item)}
                      className="hover:bg-gray-100"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}