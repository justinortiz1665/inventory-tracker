import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { DateRange } from "react-day-picker";
import { format, subMonths } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

export default function InventoryFinancialOverview() {
  // Default date range: Last 3 months to today
  const [date, setDate] = useState<DateRange | undefined>({
    from: subMonths(new Date(), 3),
    to: new Date(),
  });

  // Fetch inventory items
  const { data: items = [], isLoading } = useQuery({
    queryKey: ['/api/inventory'],
  });

  // Calculate total inventory cost
  const calculateTotalCost = () => {
    if (!items.length) return 0;
    
    return items.reduce((total: number, item: any) => {
      // Multiply item price by item stock
      return total + (item.price * item.stock);
    }, 0);
  };

  // Group items by vendor (using categoryId as a proxy for vendor for now)
  const getVendorSummary = () => {
    if (!items.length) return [];
    
    const vendorMap = new Map();
    
    items.forEach((item: any) => {
      const vendorId = item.categoryId; // Using category as proxy for vendor
      const cost = item.price * item.stock;
      
      if (vendorMap.has(vendorId)) {
        const vendor = vendorMap.get(vendorId);
        vendorMap.set(vendorId, {
          ...vendor,
          totalCost: vendor.totalCost + cost,
          itemCount: vendor.itemCount + 1
        });
      } else {
        vendorMap.set(vendorId, {
          id: vendorId,
          name: `Vendor ${vendorId}`, // Placeholder - would be actual vendor name
          totalCost: cost,
          itemCount: 1
        });
      }
    });
    
    return Array.from(vendorMap.values()).sort((a, b) => b.totalCost - a.totalCost);
  };

  const totalCost = calculateTotalCost();
  const vendorSummary = getVendorSummary();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Inventory Value Overview</CardTitle>
          <CardDescription>
            Total inventory cost and vendor breakdown
          </CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="h-8 border-dashed"
            size="sm"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : (
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <div className="text-lg text-gray-500">Total Inventory Value</div>
              <div className="text-3xl font-bold mt-1">{formatCurrency(totalCost)}</div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3">Vendor Breakdown</h3>
              {vendorSummary.length === 0 ? (
                <div className="text-center text-gray-500 py-4">
                  No vendor data available
                </div>
              ) : (
                <div className="space-y-3">
                  {vendorSummary.map((vendor) => (
                    <div key={vendor.id} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                      <div>
                        <div className="font-medium">{vendor.name}</div>
                        <div className="text-sm text-gray-500">{vendor.itemCount} items</div>
                      </div>
                      <div className="font-semibold">{formatCurrency(vendor.totalCost)}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}