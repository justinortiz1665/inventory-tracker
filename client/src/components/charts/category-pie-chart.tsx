import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#0ea5e9", "#14b8a6"];

export default function CategoryPieChart() {
  // Fetch categories
  const { data: categories = [], isLoading: isCategoriesLoading } = useQuery({
    queryKey: ['/api/categories'],
  });

  // Fetch inventory items to count by category
  const { data: items = [], isLoading: isItemsLoading } = useQuery({
    queryKey: ['/api/inventory'],
  });

  const isLoading = isCategoriesLoading || isItemsLoading;

  // Process data for the pie chart
  const getChartData = () => {
    if (!categories.length || !items.length) return [];

    // Create a map to count items by category
    const categoryMap = new Map();
    
    // Initialize with all categories having 0 count
    categories.forEach((category: any) => {
      categoryMap.set(category.id, {
        name: category.name,
        value: 0,
      });
    });
    
    // Count items by category
    items.forEach((item: any) => {
      if (categoryMap.has(item.categoryId)) {
        const category = categoryMap.get(item.categoryId);
        categoryMap.set(item.categoryId, {
          ...category,
          value: category.value + 1
        });
      }
    });
    
    return Array.from(categoryMap.values());
  };

  const chartData = getChartData();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Distribution</CardTitle>
        <CardDescription>
          Distribution of inventory items by category
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : chartData.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            No category data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [`${value} items`, 'Count']}
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "6px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}