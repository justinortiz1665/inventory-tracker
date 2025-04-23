import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Edit, 
  Trash2,
  MoreHorizontal
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Link } from "wouter";

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
  onEdit: (item: InventoryItem) => void;
  onDelete: (item: InventoryItem) => void;
}

export default function InventoryTable({ items, onEdit, onDelete }: InventoryTableProps) {
  // Helper function to determine stock status
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
              <TableCell colSpan={7} className="h-24 text-center">
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
                  <TableCell>{item.quantity} {item.unit}</TableCell>
                  <TableCell>
                    <Badge className={stockStatus.color + " rounded-full px-3"}>
                      {stockStatus.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:bg-gray-100"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Item</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="quantity" className="text-right">Quantity</Label>
                            <Input
                              id="quantity"
                              type="number"
                              defaultValue={item.quantity}
                              className="col-span-3"
                              onChange={(e) => {
                                const newQuantity = parseInt(e.target.value);
                                if (!isNaN(newQuantity)) {
                                  onEdit({
                                    ...item,
                                    quantity: newQuantity
                                  });
                                }
                              }}
                            />
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
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