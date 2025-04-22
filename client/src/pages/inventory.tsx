import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import InventoryTable from "@/components/inventory/inventory-table";
import InventoryFilters from "@/components/inventory/inventory-filters";
import ItemFormDialog from "@/components/inventory/item-form-dialog";
import DeleteDialog from "@/components/inventory/delete-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

export default function Inventory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
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
      if (categoryFilter) params.append('categoryId', categoryFilter);
      
      const url = `/api/inventory${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await fetch(url);
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
      <div className="py-4">
        <h1 className="text-2xl font-semibold text-gray-800">Inventory</h1>
        <p className="mt-1 text-sm text-gray-600">Manage and track your inventory items</p>
      </div>

      <div className="flex justify-between items-center mt-6">
        <div></div>
        <Link href="/transactions">
          <Button>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Check Out
          </Button>
        </Link>
      </div>

      <div className="mt-4">
        <InventoryFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          sortOrder=""
          setSortOrder={() => {}}
          categories={categories || []}
          isCategoriesLoading={isCategoriesLoading}
        />
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
    </div>
  );
}
