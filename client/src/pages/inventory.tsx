import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, ShoppingCart, Search } from "lucide-react";
import CheckoutDialog from "@/components/inventory/checkout-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import InventoryTable from "@/components/inventory/inventory-table";
import ItemFormDialog from "@/components/inventory/item-form-dialog";
import DeleteDialog from "@/components/inventory/delete-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";

export default function Inventory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCheckoutDialogOpen, setIsCheckoutDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch inventory items
  const { 
    data: inventoryItems = [], 
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['/api/inventory', searchQuery, categoryFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (categoryFilter && categoryFilter !== 'all') params.append('category', categoryFilter);
      params.append('orderBy', 'id');
      
      const response = await fetch(`/api/inventory?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch inventory items');
      }
      return response.json();
    },
  });

  // Fetch categories
  const { data: categories, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ['/api/categories'],
  });

  // Delete item mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/inventory/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete item');
      }
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/inventory'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activity'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
      toast({
        title: "Item deleted",
        description: "The inventory item has been deleted successfully.",
      });
      setIsDeleteDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete item: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Handle edit item
  const handleEditItem = (item: any) => {
    setSelectedItem(item);
    setIsEditDialogOpen(true);
  };

  // Handle delete item
  const handleDeleteItem = (item: any) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };

  // Handle confirm delete
  const handleConfirmDelete = async () => {
    if (selectedItem) {
      deleteMutation.mutate(selectedItem.id);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Main Inventory</h1>
      </div>
      
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
        <Input
          placeholder="Search inventory..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 w-full border-gray-300"
        />
      </div>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Filter Options - Takes 8 columns on larger screens */}
        <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="w-full">
            <Select
              value={categoryFilter || "all"}
              onValueChange={setCategoryFilter}
            >
              <SelectTrigger className="border-gray-300">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories?.map((category: any) => (
                  <SelectItem 
                    key={category.id} 
                    value={category.id.toString()}
                  >
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full">
            <Select
              value="in-stock"
              onValueChange={() => {}}
            >
              <SelectTrigger className="border-gray-300">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="in-stock">In Stock</SelectItem>
                <SelectItem value="low-stock">Low Stock</SelectItem>
                <SelectItem value="out-of-stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Checkout Button - Takes 4 columns and is aligned right on larger screens */}
        <div className="md:col-span-4 flex md:justify-end">
          <Button className="w-full" onClick={() => setIsCheckoutDialogOpen(true)}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Check Out
          </Button>
        </div>
      </div>
      
      <div className="mt-4">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        ) : isError ? (
          <div className="rounded-md bg-red-50 p-4 text-red-700">
            Error loading inventory: {(error as Error).message}
          </div>
        ) : (
          <InventoryTable 
            items={inventoryItems} 
            onEdit={handleEditItem} 
            onDelete={handleDeleteItem}
          />
        )}
      </div>

      {/* Add Item Dialog */}
      <ItemFormDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        categories={categories || []}
        title="Add New Item"
      />

      {/* Edit Item Dialog */}
      {selectedItem && (
        <ItemFormDialog
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          categories={categories || []}
          title="Edit Item"
          item={selectedItem}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {selectedItem && (
        <DeleteDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleConfirmDelete}
          isDeleting={deleteMutation.isPending}
          itemName={selectedItem.name}
        />
      )}

      {/* Checkout Dialog */}
      <CheckoutDialog
        isOpen={isCheckoutDialogOpen}
        onClose={() => setIsCheckoutDialogOpen(false)}
        selectedItem={selectedItem}
      />
    </div>
  );
}
