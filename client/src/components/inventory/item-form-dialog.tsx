import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

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

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

// Form schema for inventory items
const itemFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  sku: z.string().min(3, "SKU must be at least 3 characters"),
  categoryId: z.coerce.number({
    required_error: "Category is required",
  }),
  price: z.coerce.number({
    required_error: "Price is required",
  }).positive("Price must be a positive number"),
  stock: z.coerce.number({
    required_error: "Stock quantity is required",
  }).int("Stock must be a whole number").min(0, "Stock cannot be negative"),
  description: z.string().optional(),
  imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

// Bulk upload schema
const bulkUploadSchema = z.object({
  file: z.instanceof(File, { message: "Please select a file" }),
});

interface ItemFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  categories: any[];
  title: string;
  item?: any;
}

export default function ItemFormDialog({
  isOpen,
  onClose,
  categories = [],
  title,
  item
}: ItemFormDialogProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("single");

  // Initialize form with default values or existing item data
  const form = useForm<z.infer<typeof itemFormSchema>>({
    resolver: zodResolver(itemFormSchema),
    defaultValues: {
      name: item?.name || "",
      sku: item?.sku || "",
      category: item?.category || undefined,
      price: item?.price || undefined,
      stock: item?.stock || 0,
      description: item?.description || "",
      imageUrl: item?.imageUrl || "",
    },
  });

  const bulkForm = useForm<z.infer<typeof bulkUploadSchema>>({
    resolver: zodResolver(bulkUploadSchema),
  });

  const handleSubmit = async (values: z.infer<typeof itemFormSchema>) => {
    setIsSubmitting(true);
    try {
      if (item) {
        await apiRequest("PUT", `/api/inventory/${item.id}`, values);
        toast({
          title: "Item updated",
          description: "The inventory item has been updated successfully.",
        });
      } else {
        await apiRequest("POST", "/api/inventory", values);
        toast({
          title: "Item created",
          description: "A new inventory item has been created.",
        });
      }

      queryClient.invalidateQueries({ queryKey: ['/api/inventory'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activity'] });

      onClose();
      form.reset();
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to ${item ? 'update' : 'create'} item: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBulkUpload = async (values: z.infer<typeof bulkUploadSchema>) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('file', values.file);

      await apiRequest("POST", "/api/inventory/bulk", formData);
      toast({
        title: "Bulk upload successful",
        description: "Items have been uploaded successfully.",
      });

      queryClient.invalidateQueries({ queryKey: ['/api/inventory'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activity'] });

      onClose();
      bulkForm.reset();
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to upload items: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto sm:max-h-[85vh] w-[95vw] sm:w-full">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {item
              ? "Update the details of this inventory item."
              : "Add new items to your inventory."}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="single">Single Item</TabsTrigger>
            <TabsTrigger value="bulk" disabled={!!item}>Bulk Upload</TabsTrigger>
          </TabsList>

          <TabsContent value="single">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Item name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sku"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SKU</FormLabel>
                      <FormControl>
                        <Input placeholder="Stock keeping unit" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" step="0.01" placeholder="0.00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="stock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stock</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" placeholder="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select 
                        onValueChange={(value) => field.onChange(parseInt(value))} 
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Item description" className="resize-none" rows={3} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/image.jpg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting
                      ? item
                        ? "Updating..."
                        : "Creating..."
                      : item
                      ? "Update"
                      : "Create"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="bulk">
            <Form {...bulkForm}>
              <form onSubmit={bulkForm.handleSubmit(handleBulkUpload)} className="space-y-4">
                <FormField
                  control={bulkForm.control}
                  name="file"
                  render={({ field: { onChange, ...field } }) => (
                    <FormItem>
                      <FormLabel>Upload File</FormLabel>
                      <FormControl>
                        <div className="flex items-center justify-center w-full">
                          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <Upload className="w-8 h-8 mb-2" />
                              <p className="mb-2 text-sm">Click to upload or drag and drop</p>
                              <p className="text-xs text-muted-foreground">CSV, Excel, or PDF file</p>
                            </div>
                            <input
                              type="file"
                              className="hidden"
                              accept=".csv,.xlsx,.xls,.pdf"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) onChange(file);
                              }}
                              {...field}
                            />
                          </label>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Uploading..." : "Upload"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}