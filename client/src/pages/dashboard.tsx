import { useQuery } from "@tanstack/react-query";
import { Package2, AlertTriangle, Ban, Tag } from "lucide-react";
import { Link } from "wouter";
import StatCard from "@/components/stats/stat-card";
import InventoryChart from "@/components/charts/inventory-chart";
import ActivityList from "@/components/inventory/activity-list";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { data: stats, isLoading: isStatsLoading } = useQuery({
    queryKey: ['/api/stats'],
  });

  return (
    <div>
      <div className="py-4">
        <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">Monitor your inventory health and key metrics</p>
      </div>

      {/* Stats Cards */}
      <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Items"
          value={stats?.totalItems || 0}
          icon={<Package2 className="h-5 w-5 text-white" />}
          iconColor="bg-blue-500"
          isLoading={isStatsLoading}
        />
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
          title="Categories"
          value={stats?.categoriesCount || 0}
          icon={<Tag className="h-5 w-5 text-white" />}
          iconColor="bg-purple-500"
          isLoading={isStatsLoading}
        />
      </div>

      {/* Charts and Activity */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Chart */}
        <div className="lg:col-span-2">
          <InventoryChart />
        </div>

        {/* Recent Activity */}
        <div>
          <ActivityList />
        </div>
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
    </div>
  );
}
