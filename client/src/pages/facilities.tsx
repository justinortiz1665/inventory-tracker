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
import { Link } from "wouter";
import { Plus, Edit, Trash2, ExternalLink, MapPin, User, Info } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import DeleteDialog from "@/components/inventory/delete-dialog";
import { Textarea } from "@/components/ui/textarea";

// Facility form schema
const facilityFormSchema = z.object({
  name: z.string().min(1, "Facility name is required"),
  location: z.string().optional(),
  description: z.string().optional(),
  manager: z.string().optional(),
});

type FacilityFormValues = z.infer<typeof facilityFormSchema>;

export default function Facilities() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<any>(null);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Form for adding/editing facilities
  const form = useForm<FacilityFormValues>({
    resolver: zodResolver(facilityFormSchema),
    defaultValues: {
      name: "",
      location: "",
      description: "",
      manager: "",
    },
  });
  
  // Fetch facilities
  const { 
    data: facilities = [], 
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['/api/facilities'],
  });
  
  // Mutation for adding/editing facilities
  const facilityCrudMutation = useMutation({
    mutationFn: async ({ id, data }: { id?: number, data: FacilityFormValues }) => {
      if (id) {
        // Update facility
        return apiRequest("PUT", `/api/facilities/${id}`, data);
      } else {
        // Create facility
        return apiRequest("POST", "/api/facilities", data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/facilities'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
      toast({
        title: selectedFacility ? "Facility updated" : "Facility created",
        description: selectedFacility 
          ? "The facility has been updated successfully." 
          : "A new facility has been created.",
      });
      setIsAddDialogOpen(false);
      setIsEditDialogOpen(false);
      form.reset({ name: "", location: "", description: "", manager: "" });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to ${selectedFacility ? 'update' : 'create'} facility: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  // Mutation for deleting facilities
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/facilities/${id}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/facilities'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
      toast({
        title: "Facility deleted",
        description: "The facility has been deleted successfully.",
      });
      setIsDeleteDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete facility: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  // Handle form submission
  const onSubmit = (values: FacilityFormValues) => {
    facilityCrudMutation.mutate({
      id: selectedFacility?.id,
      data: values,
    });
  };
  
  // Handle edit facility
  const handleEditFacility = (facility: any) => {
    setSelectedFacility(facility);
    form.reset({ 
      name: facility.name,
      location: facility.location || "",
      description: facility.description || "",
      manager: facility.manager || "",
    });
    setIsEditDialogOpen(true);
  };
  
  // Handle delete facility
  const handleDeleteFacility = (facility: any) => {
    setSelectedFacility(facility);
    setIsDeleteDialogOpen(true);
  };
  
  // Handle confirm delete
  const handleConfirmDelete = () => {
    if (selectedFacility) {
      deleteMutation.mutate(selectedFacility.id);
    }
  };

  return (
    <div>
      <div className="py-4">
        <h1 className="text-2xl font-semibold text-gray-800">Facilities</h1>
        <p className="mt-1 text-sm text-gray-600">Manage your storage facilities and inventory locations</p>
      </div>
      
      <div className="flex justify-between items-center mt-6">
        <div></div>
        <Button onClick={() => {
          setSelectedFacility(null);
          form.reset({ name: "", location: "", description: "", manager: "" });
          setIsAddDialogOpen(true);
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Add Facility
        </Button>
      </div>
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Your Facilities</CardTitle>
          <CardDescription>
            Facilities with separate inventory tracking
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
              Error loading facilities: {(error as Error).message}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Manager</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {facilities?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No facilities found.
                    </TableCell>
                  </TableRow>
                ) : (
                  facilities?.map((facility: any) => (
                    <TableRow key={facility.id}>
                      <TableCell className="font-medium">
                        <Link href={`/facilities/${facility.id}`}>
                          <a className="flex items-center text-blue-600 hover:underline">
                            {facility.name}
                            <ExternalLink className="ml-1 h-3 w-3" />
                          </a>
                        </Link>
                      </TableCell>
                      <TableCell>
                        {facility.location ? (
                          <div className="flex items-center">
                            <MapPin className="mr-1 h-4 w-4 text-gray-500" />
                            <span>{facility.location}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {facility.manager ? (
                          <div className="flex items-center">
                            <User className="mr-1 h-4 w-4 text-gray-500" />
                            <span>{facility.manager}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditFacility(facility)}
                          className="text-blue-600 hover:text-blue-900 mr-1"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteFacility(facility)}
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
      
      {/* Add/Edit Facility Dialog */}
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
              {selectedFacility ? "Edit Facility" : "Add New Facility"}
            </DialogTitle>
            <DialogDescription>
              {selectedFacility 
                ? "Update the details of this facility." 
                : "Add a new facility to manage inventory at different locations."}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Facility Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter facility name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Facility location (optional)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="manager"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Manager</FormLabel>
                    <FormControl>
                      <Input placeholder="Facility manager (optional)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Facility description (optional)" 
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
                  onClick={() => {
                    setIsAddDialogOpen(false);
                    setIsEditDialogOpen(false);
                  }}
                  disabled={facilityCrudMutation.isPending}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={facilityCrudMutation.isPending}
                >
                  {facilityCrudMutation.isPending 
                    ? selectedFacility ? "Updating..." : "Creating..." 
                    : selectedFacility ? "Update" : "Create"
                  }
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      {selectedFacility && (
        <DeleteDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleConfirmDelete}
          isDeleting={deleteMutation.isPending}
          itemName={selectedFacility.name}
        />
      )}
    </div>
  );
}