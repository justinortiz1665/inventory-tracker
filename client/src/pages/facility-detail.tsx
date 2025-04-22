import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, ArrowRight, ArrowLeft, Trash2, MapPin, User, Info, Boxes, TrendingUp, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import DeleteDialog from "@/components/inventory/delete-dialog";
import { format } from "date-fns";

// Form schema for adding inventory to facility
const addInventoryFormSchema = z.object({
  itemId: z.coerce.number({
    required_error: "Item is required",
  }),
  quantity: z.coerce.number({
    required_error: "Quantity is required",
  }).positive("Quantity must be greater than 0"),
});

type AddInventoryFormValues = z.infer<typeof addInventoryFormSchema>;

export default function FacilityDetail() {
  const params = useParams();
  const facilityId = parseInt(params.id || "0");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Form for adding inventory to facility
  const form = useForm<AddInventoryFormValues>({
    resolver: zodResolver(addInventoryFormSchema),
    defaultValues: {
      itemId: undefined,
      quantity: undefined,
    },
  });

  // Fetch facility details
  const { 
    data: facility = {}, 
    isLoading: isLoadingFacility,
    isError: isFacilityError,
    error: facilityError
  } = useQuery({
    queryKey: ['/api/facilities', facilityId],
    enabled: !!facilityId,
  });

  // Fetch facility inventory
  const { 
    data: facilityInventory = [], 
    isLoading: isLoadingInventory,
    isError: isInventoryError,
    error: inventoryError
  } = useQuery({
    queryKey: ['/api/facilities', facilityId, 'inventory'],
    enabled: !!facilityId,
  });

  // Fetch facility stats
  const { 
    data: facilityStats = {}, 
    isLoading: isLoadingStats,
  } = useQuery({
    queryKey: ['/api/facilities', facilityId, 'stats'],
    enabled: !!facilityId,
  });

  // Fetch facility activity logs
  const { 
    data: activityLogs = [], 
    isLoading: isLoadingLogs,
  } = useQuery({
    queryKey: ['/api/facilities', facilityId, 'activity'],
    queryFn: () => apiRequest("GET", `/api/facilities/${facilityId}/activity?limit=5`),
    enabled: !!facilityId,
  });

  // Fetch inventory items for dropdown
  const { 
    data: inventoryItems = [],
    isLoading: isLoadingItems 
  } = useQuery({
    queryKey: ['/api/inventory'],
  });
  
  // Mutation for adding inventory to facility
  const addInventoryMutation = useMutation({
    mutationFn: async (data: AddInventoryFormValues) => {
      return apiRequest("POST", `/api/facilities/${facilityId}/inventory`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/facilities', facilityId, 'inventory'] });
      queryClient.invalidateQueries({ queryKey: ['/api/facilities', facilityId, 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activity'] });
      
      toast({
        title: "Inventory added",
        description: "The item has been added to this facility's inventory.",
      });
      setIsAddDialogOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to add inventory: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Mutation for removing inventory from facility
  const removeInventoryMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/facilities/inventory/${id}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/facilities', facilityId, 'inventory'] });
      queryClient.invalidateQueries({ queryKey: ['/api/facilities', facilityId, 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activity'] });
      
      toast({
        title: "Inventory removed",
        description: "The item has been removed from this facility's inventory.",
      });
      setIsDeleteDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to remove inventory: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  // Handle form submission
  const onSubmit = (values: AddInventoryFormValues) => {
    addInventoryMutation.mutate(values);
  };

  // Handle delete inventory item
  const handleDeleteInventoryItem = (item: any) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };
  
  // Handle confirm delete
  const handleConfirmDelete = () => {
    if (selectedItem) {
      removeInventoryMutation.mutate(selectedItem.id);
    }
  };

  if (isLoadingFacility) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-2/3" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (isFacilityError) {
    return (
      <div className="rounded-md bg-red-50 p-6 text-red-700">
        <h3 className="text-lg font-medium">Error Loading Facility</h3>
        <p className="mt-2">{(facilityError as Error).message}</p>
        <Button className="mt-4" variant="outline" asChild>
          <Link href="/facilities">
            <a className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Facilities
            </a>
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="py-4 flex items-center justify-between">
        <div>
          <div className="flex items-center">
            <Link href="/facilities">
              <a className="text-blue-600 hover:text-blue-800 mr-2">
                <ArrowLeft className="h-4 w-4" />
              </a>
            </Link>
            <h1 className="text-2xl font-semibold text-gray-800">{facility?.name}</h1>
          </div>
          <p className="mt-1 text-sm text-gray-600">Facility inventory and details</p>
        </div>
        <Button onClick={() => {
          form.reset();
          setIsAddDialogOpen(true);
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Add Inventory
        </Button>
      </div>
      
      {/* Facility info card */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <MapPin className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-600">Location</h3>
                <p className="mt-1">{facility?.location || "Not specified"}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-purple-100 rounded-full">
                <User className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-600">Manager</h3>
                <p className="mt-1">{facility?.manager || "Not assigned"}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-green-100 rounded-full">
                <Info className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-600">Description</h3>
                <p className="mt-1">{facility?.description || "No description"}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Facility stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Items</p>
                {isLoadingStats ? (
                  <Skeleton className="h-8 w-16 mt-1" />
                ) : (
                  <h3 className="text-2xl font-bold">{facilityStats?.uniqueItems || 0}</h3>
                )}
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Boxes className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Quantity</p>
                {isLoadingStats ? (
                  <Skeleton className="h-8 w-16 mt-1" />
                ) : (
                  <h3 className="text-2xl font-bold">{facilityStats?.totalQuantity || 0}</h3>
                )}
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Last Activity</p>
                {isLoadingLogs || !activityLogs || activityLogs.length === 0 ? (
                  <h3 className="text-sm mt-1">No activity yet</h3>
                ) : (
                  <h3 className="text-sm mt-1">
                    {format(new Date(activityLogs[0].timestamp), 'MMM d, yyyy')}
                  </h3>
                )}
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Facility inventory */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Facility Inventory</CardTitle>
          <CardDescription>
            Items currently stored at this facility
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingInventory ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
          ) : isInventoryError ? (
            <div className="rounded-md bg-red-50 p-4 text-red-700">
              Error loading inventory: {(inventoryError as Error).message}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {facilityInventory?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No inventory items found at this facility.
                    </TableCell>
                  </TableRow>
                ) : (
                  facilityInventory?.map((inventoryItem: any) => (
                    <TableRow key={inventoryItem.id}>
                      <TableCell className="font-medium">{inventoryItem.item.name}</TableCell>
                      <TableCell>{inventoryItem.item.sku}</TableCell>
                      <TableCell>{inventoryItem.quantity}</TableCell>
                      <TableCell>
                        {inventoryItem.lastUpdated ? 
                          format(new Date(inventoryItem.lastUpdated), 'MMM d, yyyy') : 
                          '—'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteInventoryItem(inventoryItem)}
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

      {/* Recent activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Latest operations performed at this facility
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingLogs ? (
            <div className="space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
            </div>
          ) : !activityLogs || activityLogs.length === 0 ? (
            <p className="text-center py-6 text-gray-500">No activity recorded yet.</p>
          ) : (
            <ul className="space-y-4">
              {activityLogs.map((log: any) => (
                <li key={log.id} className="flex items-start">
                  <div className="p-2 bg-gray-100 rounded-full mr-3">
                    <Clock className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      {log.description}
                    </p>
                    <span className="text-xs text-gray-400">
                      {format(new Date(log.timestamp), 'MMM d, yyyy h:mm a')}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/transactions?facilityId=${facilityId}`}>
              <a>View All Transactions</a>
            </Link>
          </Button>
        </CardFooter>
      </Card>
      
      {/* Add Inventory Dialog */}
      <Dialog 
        open={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Add Inventory to Facility
            </DialogTitle>
            <DialogDescription>
              Add or transfer inventory items to this facility.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="itemId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an item" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isLoadingItems ? (
                          <SelectItem value="loading">Loading items...</SelectItem>
                        ) : (
                          inventoryItems?.map((item: any) => (
                            <SelectItem key={item.id} value={item.id.toString()}>
                              {item.name} (SKU: {item.sku})
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" placeholder="Quantity to add" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                  disabled={addInventoryMutation.isPending}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={addInventoryMutation.isPending}
                >
                  {addInventoryMutation.isPending ? "Adding..." : "Add Item"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      {selectedItem && (
        <DeleteDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleConfirmDelete}
          isDeleting={removeInventoryMutation.isPending}
          itemName={`${selectedItem.item?.name || "this item"} from this facility`}
        />
      )}
    </div>
  );
}