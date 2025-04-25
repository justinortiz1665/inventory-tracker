import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Search, Plus, X } from "lucide-react";

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
import { ScrollArea } from "@/components/ui/scroll-area";

const checkoutItemSchema = z.object({
  itemId: z.coerce.number({
    required_error: "Item is required",
  }),
  quantity: z.coerce.number({
    required_error: "Quantity is required",
  }).positive("Quantity must be greater than 0"),
});

const checkoutFormSchema = z.object({
  facilityId: z.coerce.number({
    required_error: "Facility is required",
  }),
  items: z.array(checkoutItemSchema),
});

interface CheckoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CheckoutDialog({
  isOpen,
  onClose,
}: CheckoutDialogProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState<Array<{ id: number, name: string, quantity: number }>>([]);

  const { data: facilities = [] } = useQuery({
    queryKey: ['/api/facilities'],
  });

  const { data: inventoryItems = [] } = useQuery({
    queryKey: ['/api/inventory', searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      const response = await fetch(`/api/inventory?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch inventory items');
      }
      return response.json();
    },
  });

  const form = useForm<z.infer<typeof checkoutFormSchema>>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      facilityId: undefined,
      items: [],
    },
  });

  const addItem = (item: any) => {
    if (!selectedItems.some(i => i.id === item.id)) {
      setSelectedItems([...selectedItems, { id: item.id, name: item.name, quantity: 1 }]);
    }
  };

  const removeItem = (itemId: number) => {
    setSelectedItems(selectedItems.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: number, quantity: number) => {
    setSelectedItems(selectedItems.map(item => 
      item.id === itemId ? { ...item, quantity } : item
    ));
  };

  const handleSubmit = async (values: z.infer<typeof checkoutFormSchema>) => {
    setIsSubmitting(true);
    try {
      const itemsToSubmit = selectedItems.map(item => ({
        itemId: item.id,
        quantity: item.quantity,
      }));

      await apiRequest("POST", `/api/facilities/${values.facilityId}/inventory/bulk`, {
        items: itemsToSubmit,
      });

      toast({
        title: "Checkout successful",
        description: "Items have been transferred to the facility.",
      });

      queryClient.invalidateQueries({ queryKey: ['/api/inventory'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activity'] });

      onClose();
      form.reset();
      setSelectedItems([]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to checkout: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Checkout to Facility</DialogTitle>
          <DialogDescription>
            Transfer items from main inventory to a facility.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="facilityId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Facility</FormLabel>
                  <Select onValueChange={(value) => field.onChange(parseInt(value))}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a facility" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {facilities.map((facility: any) => (
                        <SelectItem key={facility.id} value={facility.id.toString()}>
                          {facility.facility_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                  <Input
                    placeholder="Search items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <ScrollArea className="h-[300px] border rounded-md p-2">
                  {inventoryItems.length > 0 ? (
                    inventoryItems.map((item: any) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-2 hover:bg-gray-100 rounded cursor-pointer"
                      onClick={() => addItem({id: item.id, name: item.item_name})}
                    >
                      <div>
                        <div className="font-medium text-xs">({item.quantity}) {item.item_name}</div>
                      </div>
                      <Button type="button" size="sm" variant="ghost">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))) : (
                    <div className="p-4 text-center text-gray-500">No items found</div>
                  )}
                </ScrollArea>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Selected Items</h4>
                  <div className="relative invisible">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                    <Input className="pl-10" disabled />
                  </div>
                </div>
                <ScrollArea className="h-[300px] border rounded-md p-2">
                  {selectedItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-2 border-b last:border-0">
                      <div className="flex-1">
                        <div className="font-medium">{item.name}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                            className="w-20"
                          />
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </ScrollArea>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || selectedItems.length === 0}>
                {isSubmitting ? "Processing..." : "Checkout"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}