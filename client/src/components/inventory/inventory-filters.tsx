import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface InventoryFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
  sortOrder: string;
  setSortOrder: (order: string) => void;
  categories: any[];
  isCategoriesLoading: boolean;
}

export default function InventoryFilters({
  searchQuery,
  setSearchQuery,
  categoryFilter,
  setCategoryFilter,
  sortOrder,
  setSortOrder,
  categories,
  isCategoriesLoading
}: InventoryFiltersProps) {
  return (
    <Card className="mt-4">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Search items..."
              className="pl-10 pr-4"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Select 
            value={categoryFilter} 
            onValueChange={setCategoryFilter}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              {isCategoriesLoading ? (
                <div className="p-2">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full mt-2" />
                  <Skeleton className="h-5 w-full mt-2" />
                </div>
              ) : (
                categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          
          <Select 
            value={sortOrder} 
            onValueChange={setSortOrder}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sort by Name" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Sort by Name</SelectItem>
              <SelectItem value="stock">Sort by Stock Level</SelectItem>
              <SelectItem value="date">Sort by Date Added</SelectItem>
              <SelectItem value="price">Sort by Price</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
