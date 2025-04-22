import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, Ban, Plus, Edit, FileUp } from "lucide-react";
import StatCard from "@/components/stats/stat-card";
import ActivityList from "@/components/inventory/activity-list";
import { Button } from "@/components/ui/button";
import ItemFormDialog from "@/components/inventory/item-form-dialog";
import CategoryPieChart from "@/components/charts/category-pie-chart";
import InventoryFinancialOverview from "@/components/charts/inventory-financial-overview";

export default function Dashboard() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  const { data: stats, isLoading: isStatsLoading } = useQuery({
    queryKey: ['/api/stats'],
  });
  
  const { data: categories, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ['/api/categories'],
  });

  return (
    <div>
      <div className="py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">Monitor your inventory health and key metrics</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex flex-wrap gap-3">
        <Button variant="outline" onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
        <Button variant="outline">
          <Edit className="mr-2 h-4 w-4" />
          Edit Item
        </Button>
        <Button variant="outline">
          <FileUp className="mr-2 h-4 w-4" />
          Upload Invoice
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2">
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
