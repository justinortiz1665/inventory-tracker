
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { formatCurrency } from "@/lib/utils";

export default function Reports() {
  const [reportType, setReportType] = useState<string>("category");
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();

  // Fetch required data
  const { data: items = [] } = useQuery({ queryKey: ['/api/inventory'] });
  const { data: categories = [] } = useQuery({ queryKey: ['/api/categories'] });
  const { data: facilities = [] } = useQuery({ queryKey: ['/api/facilities'] });

  // Calculate expenses by category
  const getCategoryExpenses = () => {
    const expenseMap = new Map();
    
    items.forEach((item: any) => {
      const category = categories.find((c: any) => c.id === item.categoryId);
      const totalCost = item.price * item.stock;
      
      if (expenseMap.has(category?.name)) {
        expenseMap.set(category?.name, expenseMap.get(category?.name) + totalCost);
      } else {
        expenseMap.set(category?.name, totalCost);
      }
    });
    
    return Array.from(expenseMap.entries()).map(([name, value]) => ({
      name,
      value
    }));
  };

  // Calculate expenses by facility
  const getFacilityExpenses = () => {
    return facilities.map((facility: any) => ({
      name: facility.name,
      value: items.reduce((total: number, item: any) => {
        const facilityItem = item.facilityInventory?.find(
          (fi: any) => fi.facilityId === facility.id
        );
        return total + (facilityItem?.quantity || 0) * item.price;
      }, 0)
    }));
  };

  // Get individual item expenses
  const getItemExpenses = () => {
    return items.map((item: any) => ({
      name: item.name,
      value: item.price * item.stock
    })).sort((a: any, b: any) => b.value - a.value);
  };

  const getChartData = () => {
    switch (reportType) {
      case "category":
        return getCategoryExpenses();
      case "facility":
        return getFacilityExpenses();
      case "item":
        return getItemExpenses();
      default:
        return [];
    }
  };

  const chartData = getChartData();
  const totalExpense = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Expense Reports</h1>
        <Button onClick={() => console.log("Export PDF")}>
          <Download className="mr-2 h-4 w-4" />
          Export PDF
        </Button>
      </div>

      <div className="flex space-x-4">
        <Select value={reportType} onValueChange={setReportType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select report type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="category">By Category</SelectItem>
            <SelectItem value="facility">By Facility</SelectItem>
            <SelectItem value="item">By Item</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="h-8 border-dashed" size="sm">
                <CalendarIcon className="mr-2 h-3 w-3" />
                <span>From: </span>
                {fromDate ? (
                  format(fromDate, "MMM dd, yyyy")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={fromDate}
                onSelect={setFromDate}
                initialFocus
                showOutsideDays={false}
                footer={
                  <Button
                    variant="outline"
                    className="w-full mt-2"
                    onClick={() => setFromDate(new Date())}
                  >
                    Today
                  </Button>
                }
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="h-8 border-dashed" size="sm">
                <CalendarIcon className="mr-2 h-3 w-3" />
                <span>To: </span>
                {toDate ? (
                  format(toDate, "MMM dd, yyyy")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={toDate}
                onSelect={setToDate}
                initialFocus
                showOutsideDays={false}
                footer={
                  <Button
                    variant="outline"
                    className="w-full mt-2"
                    onClick={() => setToDate(new Date())}
                  >
                    Today
                  </Button>
                }
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Expense Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="text-2xl font-bold">{formatCurrency(totalExpense)}</div>
              <div className="text-sm text-gray-500">Total expenses</div>
            </div>
            
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  tickLine={false} 
                  axisLine={false}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(value) => formatCurrency(value)}
                />
                <Tooltip 
                  formatter={(value: any) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "6px",
                  }}
                />
                <Bar dataKey="value" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Detailed Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {chartData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>{item.name}</div>
                  <div className="font-medium">{formatCurrency(item.value)}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
