import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";

// Transaction form schema
const transactionFormSchema = z.object({
  itemId: z.coerce.number({
    required_error: "Item is required",
  }),
  quantity: z.coerce.number({
    required_error: "Quantity is required",
  }).positive("Quantity must be greater than 0"),
  fromFacilityId: z.coerce.number().nullable().optional(),
  toFacilityId: z.coerce.number().nullable().optional(),
  notes: z.string().optional(),
});

type TransactionFormValues = z.infer<typeof transactionFormSchema>;

export default function Transactions() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Form for adding transactions
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      itemId: undefined,
      quantity: undefined,
      fromFacilityId: undefined,
      toFacilityId: undefined,
      notes: "",
    },
  });

  // Fetch transactions
  const { 
    data: transactions = [], 
    isLoading: isLoadingTransactions,
    isError: isTransactionsError,
    error: transactionsError
  } = useQuery({
    queryKey: ['/api/transactions'],
  });

  // Fetch inventory items for dropdown
  const { 
    data: inventoryItems = [],
    isLoading: isLoadingItems 
  } = useQuery({
    queryKey: ['/api/inventory'],
  });

  // Fetch facilities for dropdown
  const { 
    data: facilities = [],
    isLoading: isLoadingFacilities 
  } = useQuery({
    queryKey: ['/api/facilities'],
  });
  
  // Mutation for adding transactions
  const addTransactionMutation = useMutation({
    mutationFn: async (data: TransactionFormValues) => {
      return apiRequest("POST", "/api/transactions", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/inventory'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activity'] });
      
      if (form.getValues().fromFacilityId) {
        queryClient.invalidateQueries({ 
          queryKey: ['/api/facilities', form.getValues().fromFacilityId, 'inventory'] 
        });
      }
      
      if (form.getValues().toFacilityId) {
        queryClient.invalidateQueries({ 
          queryKey: ['/api/facilities', form.getValues().toFacilityId, 'inventory'] 
        });
      }
      
      toast({
        title: "Transaction created",
        description: "The inventory transaction has been recorded successfully.",
      });
      setIsAddDialogOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create transaction: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  // Handle form submission
  const onSubmit = (values: TransactionFormValues) => {
    // Validate that at least one facility is selected
    if (!values.fromFacilityId && !values.toFacilityId) {
      toast({
        title: "Validation Error",
        description: "You must specify at least one facility (source or destination).",
        variant: "destructive",
      });
      return;
    }

    // Validate that source and destination are not the same
    if (values.fromFacilityId && values.toFacilityId && values.fromFacilityId === values.toFacilityId) {
      toast({
        title: "Validation Error",
        description: "Source and destination facilities cannot be the same.",
        variant: "destructive",
      });
      return;
    }

    addTransactionMutation.mutate(values);
  };

  // Get item name by ID
  const getItemName = (itemId: number) => {
    const item = inventoryItems?.find((item: any) => item.id === itemId);
    return item ? item.name : 'Unknown Item';
  };

  // Get facility name by ID
  const getFacilityName = (facilityId: number) => {
    if (!facilityId) return 'Main Inventory';
    const facility = facilities?.find((facility: any) => facility.id === facilityId);
    return facility ? facility.name : 'Unknown Facility';
  };

  return (
    <div>
      <div className="py-4">
        <h1 className="text-2xl font-semibold text-gray-800">Inventory Transactions</h1>
        <p className="mt-1 text-sm text-gray-600">Track movement of inventory between facilities</p>
      </div>
      
      <div className="flex justify-between items-center mt-6">
        <div></div>
        <Button onClick={() => {
          form.reset({
            itemId: undefined,
            quantity: undefined,
            fromFacilityId: undefined,
            toFacilityId: undefined,
            notes: "",
          });
          setIsAddDialogOpen(true);
        }}>
          <Plus className="mr-2 h-4 w-4" />
          New Transaction
        </Button>
      </div>
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>
            Record of inventory movements between facilities
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingTransactions ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
          ) : isTransactionsError ? (
            <div className="rounded-md bg-red-50 p-4 text-red-700">
              Error loading transactions: {(transactionsError as Error).message}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No transactions found.
                    </TableCell>
                  </TableRow>
                ) : (
                  transactions?.map((transaction: any) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        {transaction.transactionDate ? 
                          format(new Date(transaction.transactionDate), 'MMM d, yyyy') : 
                          '—'}
                      </TableCell>
                      <TableCell>{isLoadingItems ? '...' : getItemName(transaction.itemId)}</TableCell>
                      <TableCell>{transaction.quantity}</TableCell>
                      <TableCell>
                        {isLoadingFacilities ? '...' : 
                          transaction.fromFacilityId ? 
                            <Link href={`/facilities/${transaction.fromFacilityId}`}>
                              <a className="text-blue-600 hover:underline">
                                {getFacilityName(transaction.fromFacilityId)}
                              </a>
                            </Link> : 
                            'Main Inventory'
                        }
                      </TableCell>
                      <TableCell>
                        {isLoadingFacilities ? '...' : 
                          transaction.toFacilityId ? 
                            <Link href={`/facilities/${transaction.toFacilityId}`}>
                              <a className="text-blue-600 hover:underline">
                                {getFacilityName(transaction.toFacilityId)}
                              </a>
                            </Link> : 
                            'Main Inventory'
                        }
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {transaction.notes || '—'}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      {/* Add Transaction Dialog */}
      <Dialog 
        open={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              New Inventory Transaction
            </DialogTitle>
            <DialogDescription>
              Record a transfer of inventory items between locations.
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
                          <SelectItem value="loading-items">Loading items...</SelectItem>
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
                      <Input type="number" min="1" placeholder="Quantity to transfer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center space-x-4">
                <FormField
                  control={form.control}
                  name="fromFacilityId"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>From (Source)</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select source" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="0">Main Inventory</SelectItem>
                          {isLoadingFacilities ? (
                            <SelectItem value="loading">Loading facilities...</SelectItem>
                          ) : (
                            facilities?.map((facility: any) => (
                              <SelectItem key={facility.id} value={facility.id.toString()}>
                                {facility.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-center pt-6">
                  <ArrowRight className="h-5 w-5 text-gray-400" />
                </div>

                <FormField
                  control={form.control}
                  name="toFacilityId"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>To (Destination)</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select destination" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="0">Main Inventory</SelectItem>
                          {isLoadingFacilities ? (
                            <SelectItem value="loading">Loading facilities...</SelectItem>
                          ) : (
                            facilities?.map((facility: any) => (
                              <SelectItem key={facility.id} value={facility.id.toString()}>
                                {facility.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Additional details about this transaction" 
                        className="resize-none" 
                        {...field} 
                      />
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
                  disabled={addTransactionMutation.isPending}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={addTransactionMutation.isPending}
                >
                  {addTransactionMutation.isPending ? "Processing..." : "Create Transaction"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}