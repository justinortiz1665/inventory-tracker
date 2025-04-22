import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

// Sample data for the chart, will be replaced with API data
const sampleData = [
  { name: "Electronics", value: 24 },
  { name: "Furniture", value: 18 },
  { name: "Office", value: 42 },
  { name: "Clothing", value: 15 },
];

export default function InventoryChart() {
  // In a real implementation, this would fetch data from the API
  const { data: categories, isLoading } = useQuery({
    queryKey: ['/api/categories'],
  });

  const { data: inventory, isLoading: isInventoryLoading } = useQuery({
    queryKey: ['/api/inventory'],
  });

  // Prepare chart data when both categories and inventory are loaded
  const chartData = !isLoading && !isInventoryLoading && categories && inventory 
    ? categories.map((category: any) => ({
        name: category.name,
        value: inventory.filter((item: any) => item.categoryId === category.id).length
      }))
    : sampleData;

  return (
    <Card>
      <CardHeader className="pb-0">
        <CardTitle>Inventory Overview</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading || isInventoryLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="hsl(var(--primary))" barSize={30} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
