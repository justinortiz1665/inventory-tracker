import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface InventoryItem {
  id: number;
  item_number: string;
  item_name: string;
  category: string;
  vendor: string;
  quantity: number;
  unit: string;
  min_threshold: number;
  max_threshold: number;
  price: number;
  created_at: string;
}

interface InventoryTableProps {
  items: InventoryItem[];
  onEdit?: (item: InventoryItem) => void;
}

export default function InventoryTable({ items, onEdit }: InventoryTableProps) {
  const getStockStatus = (quantity: number, min_threshold: number) => {
    if (quantity <= 0) {
      return { 
        label: 'Out of Stock', 
        color: 'bg-red-500 text-white',
        rowColor: 'bg-red-50' 
      };
    } else if (quantity <= min_threshold) {
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
              <TableCell colSpan={6} className="h-24 text-center">
                No inventory items found.
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => {
              const stockStatus = getStockStatus(item.quantity, item.min_threshold);

              return (
                <TableRow key={item.id} className={cn("border-b", stockStatus.rowColor)}>
                  <TableCell className="font-medium">{item.item_number}</TableCell>
                  <TableCell>{item.item_name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.vendor}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>
                    <Badge className={stockStatus.color + " rounded-full px-3"}>
                      {stockStatus.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => onEdit?.(item)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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