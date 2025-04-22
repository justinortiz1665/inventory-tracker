import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

export default function InventoryChart() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['/api/stats'],
    queryFn: async () => {
      const response = await fetch('/api/stats');
      if (!response.ok) {
        throw new Error('Failed to fetch inventory statistics');
      }
      return response.json();
    },
  });

  // Transform data for the chart
  const getChartData = () => {
    if (!data) return [];

    return [
      {
        name: "Total Items",
        value: data.totalItems,
        color: "#4f46e5",
      },
      {
        name: "Low Stock",
        value: data.lowStockItems,
        color: "#f59e0b",
      },
      {
        name: "Out of Stock",
        value: data.outOfStock,
        color: "#ef4444",
      },
      {
        name: "Categories",
        value: data.categoriesCount,
        color: "#10b981",
      },
      {
        name: "Facilities",
        value: data.facilitiesCount,
        color: "#8b5cf6",
      },
    ];
  };

  const chartData = getChartData();

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Inventory Overview</CardTitle>
        <CardDescription>
          Summary of inventory items across all facilities
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : isError ? (
          <div className="text-center text-red-500 py-10">
            Failed to load inventory statistics
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "6px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}