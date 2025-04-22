import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Package2, AlertTriangle, Ban, Plus, DollarSign } from "lucide-react";
import { Link } from "wouter";
import StatCard from "@/components/stats/stat-card";
import ActivityList from "@/components/inventory/activity-list";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import ItemFormDialog from "@/components/inventory/item-form-dialog";
import CategoryPieChart from "@/components/charts/category-pie-chart";
import InventoryFinancialOverview from "@/components/charts/inventory-financial-overview";
import { formatCurrency } from "@/lib/utils";

export default function Dashboard() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  const { data: stats, isLoading: isStatsLoading } = useQuery({
    queryKey: ['/api/stats'],
  });
  
  const { data: categories, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ['/api/categories'],
  });

  const { data: inventoryItems = [], isLoading: isInventoryLoading } = useQuery({
    queryKey: ['/api/inventory'],
  });

  // Calculate total inventory value
  const getTotalInventoryValue = () => {
    if (!inventoryItems.length) return 0;
    
    return inventoryItems.reduce((total: number, item: any) => {
      return total + (item.price * item.stock);
    }, 0);
  };

  const totalValue = getTotalInventoryValue();

  return (
    <div>
      <div className="py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">Monitor your inventory health and key metrics</p>
        </div>
        <Button variant="outline" onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Low Stock Items"
          value={stats?.lowStockItems || 0}
          icon={<AlertTriangle className="h-5 w-5 text-white" />}
          iconColor="bg-yellow-500"
          isLoading={isStatsLoading}
        />
        <StatCard
          title="Out of Stock"
          value={stats?.outOfStock || 0}
          icon={<Ban className="h-5 w-5 text-white" />}
          iconColor="bg-red-500"
          isLoading={isStatsLoading}
        />
        <StatCard
          title="Total Inventory Value"
          value={formatCurrency(totalValue)}
          icon={<DollarSign className="h-5 w-5 text-white" />}
          iconColor="bg-green-500"
          isLoading={isInventoryLoading}
        />
      </div>

      {/* Financial Overview and Categories */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Financial Overview */}
        <div>
          <InventoryFinancialOverview />
        </div>

        {/* Categories Pie Chart */}
        <div>
          <CategoryPieChart />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <ActivityList />
      </div>

      {/* Recent Inventory Preview */}
      <div className="mt-8">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Recent Inventory</h2>
          <Link href="/inventory" className="text-blue-500 text-sm hover:underline">
            View all inventory
          </Link>
        </div>
        <div className="mt-4">
          {isStatsLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Package2 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No recent inventory items to display</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Add Item Dialog */}
      <ItemFormDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        categories={categories || []}
        title="Add New Item"
      />
    </div>
  );
}
