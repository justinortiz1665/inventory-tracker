import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import DeleteDialog from "@/components/inventory/delete-dialog";

// Category form schema
const categoryFormSchema = z.object({
  name: z.string().min(1, "Category name is required"),
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

export default function Categories() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Form for adding/editing categories
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
    },
  });
  
  // Fetch categories
  const { 
    data: categories, 
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['/api/categories'],
  });
  
  // Mutation for adding/editing categories
  const categoryCrudMutation = useMutation({
    mutationFn: async ({ id, data }: { id?: number, data: CategoryFormValues }) => {
      if (id) {
        // Update category
        return apiRequest("PUT", `/api/categories/${id}`, data);
      } else {
        // Create category
        return apiRequest("POST", "/api/categories", data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
      toast({
        title: selectedCategory ? "Category updated" : "Category created",
        description: selectedCategory 
          ? "The category has been updated successfully." 
          : "A new category has been created.",
      });
      setIsAddDialogOpen(false);
      setIsEditDialogOpen(false);
      form.reset({ name: "" });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to ${selectedCategory ? 'update' : 'create'} category: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  // Mutation for deleting categories
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/categories/${id}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
      toast({
        title: "Category deleted",
        description: "The category has been deleted successfully.",
      });
      setIsDeleteDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete category: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  // Handle form submission
  const onSubmit = (values: CategoryFormValues) => {
    categoryCrudMutation.mutate({
      id: selectedCategory?.id,
      data: values,
    });
  };
  
  // Handle edit category
  const handleEditCategory = (category: any) => {
    setSelectedCategory(category);
    form.reset({ name: category.name });
    setIsEditDialogOpen(true);
  };
  
  // Handle delete category
  const handleDeleteCategory = (category: any) => {
    setSelectedCategory(category);
    setIsDeleteDialogOpen(true);
  };
  
  // Handle confirm delete
  const handleConfirmDelete = () => {
    if (selectedCategory) {
      deleteMutation.mutate(selectedCategory.id);
    }
  };

  return (
    <div>
      <div className="py-4">
        <h1 className="text-2xl font-semibold text-gray-800">Categories</h1>
        <p className="mt-1 text-sm text-gray-600">Manage product categories in your inventory</p>
      </div>
      
      <div className="flex justify-between items-center mt-6">
        <div></div>
        <Button onClick={() => {
          setSelectedCategory(null);
          form.reset({ name: "" });
          setIsAddDialogOpen(true);
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Inventory Categories</CardTitle>
          <CardDescription>
            Organize your inventory with categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
          ) : isError ? (
            <div className="rounded-md bg-red-50 p-4 text-red-700">
              Error loading categories: {(error as Error).message}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Items Count</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">
                      No categories found.
                    </TableCell>
                  </TableRow>
                ) : (
                  categories.map((category: any) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell>
                        {/* In a real implementation, this would show the count of items in this category */}
                        -
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditCategory(category)}
                          className="text-blue-600 hover:text-blue-900 mr-1"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteCategory(category)}
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
          )}
        </CardContent>
      </Card>
      
      {/* Add/Edit Category Dialog */}
      <Dialog 
        open={isAddDialogOpen || isEditDialogOpen} 
        onOpenChange={(open) => {
          if (!open) {
            setIsAddDialogOpen(false);
            setIsEditDialogOpen(false);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedCategory ? "Edit Category" : "Add New Category"}
            </DialogTitle>
            <DialogDescription>
              {selectedCategory 
                ? "Update the details of this category." 
                : "Add a new category to organize your inventory."}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter category name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddDialogOpen(false);
                    setIsEditDialogOpen(false);
                  }}
                  disabled={categoryCrudMutation.isPending}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={categoryCrudMutation.isPending}
                >
                  {categoryCrudMutation.isPending 
                    ? selectedCategory ? "Updating..." : "Creating..." 
                    : selectedCategory ? "Update" : "Create"
                  }
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      {selectedCategory && (
        <DeleteDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleConfirmDelete}
          isDeleting={deleteMutation.isPending}
          itemName={selectedCategory.name}
        />
      )}
    </div>
  );
}
