import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { format, subMonths } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

export default function InventoryFinancialOverview() {
  // Default dates: From = 3 months ago, To = today
  const [fromDate, setFromDate] = useState<Date | undefined>(subMonths(new Date(), 3));
  const [toDate, setToDate] = useState<Date | undefined>(new Date());
  
  // For year/month navigation
  const [calendarView, setCalendarView] = useState<"day" | "month" | "year" | "decade">("day");
  const [viewDate, setViewDate] = useState<Date>(fromDate || new Date());

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

  // Helper functions for the date picker
  const getYearsInDecade = (date: Date) => {
    const year = date.getFullYear();
    const decadeStart = Math.floor(year / 10) * 10;
    return Array.from({length: 10}, (_, i) => decadeStart + i);
  };

  const getMonthsInYear = (date: Date) => {
    const year = date.getFullYear();
    return Array.from({length: 12}, (_, i) => {
      const d = new Date(year, i, 1);
      return {
        month: i,
        name: format(d, "MMM"),
        year
      };
    });
  };

  // Handle view changes
  const handleHeaderClick = () => {
    if (calendarView === "day") {
      setCalendarView("month");
    } else if (calendarView === "month") {
      setCalendarView("year");
    } else if (calendarView === "year") {
      setCalendarView("decade");
    }
  };

  const handleMonthSelect = (month: number) => {
    const newDate = new Date(viewDate);
    newDate.setMonth(month);
    setViewDate(newDate);
    setCalendarView("day");
  };

  const handleYearSelect = (year: number) => {
    const newDate = new Date(viewDate);
    newDate.setFullYear(year);
    setViewDate(newDate);
    setCalendarView("month");
  };

  const handleDecadeChange = (direction: "prev" | "next") => {
    const newDate = new Date(viewDate);
    const currentYear = newDate.getFullYear();
    const decadeChange = direction === "prev" ? -10 : 10;
    newDate.setFullYear(currentYear + decadeChange);
    setViewDate(newDate);
  };

  const handleYearChange = (direction: "prev" | "next") => {
    const newDate = new Date(viewDate);
    const yearChange = direction === "prev" ? -1 : 1;
    newDate.setFullYear(newDate.getFullYear() + yearChange);
    setViewDate(newDate);
  };

  const handleMonthChange = (direction: "prev" | "next") => {
    const newDate = new Date(viewDate);
    const monthChange = direction === "prev" ? -1 : 1;
    newDate.setMonth(newDate.getMonth() + monthChange);
    setViewDate(newDate);
  };

  // Month View Component
  const MonthView = () => {
    const months = getMonthsInYear(viewDate);
    return (
      <div className="p-2">
        <div className="flex justify-between items-center mb-2">
          <button 
            onClick={() => handleYearChange("prev")}
            className="p-1 rounded hover:bg-gray-200 text-xs"
          >
            &lt;
          </button>
          <button 
            onClick={handleHeaderClick} 
            className="font-medium hover:bg-gray-100 px-2 py-1 rounded text-sm"
          >
            {viewDate.getFullYear()}
          </button>
          <button 
            onClick={() => handleYearChange("next")}
            className="p-1 rounded hover:bg-gray-200 text-xs"
          >
            &gt;
          </button>
        </div>
        <div className="grid grid-cols-3 gap-1">
          {months.map((m) => (
            <button
              key={m.month}
              onClick={() => handleMonthSelect(m.month)}
              className="py-1 px-2 rounded hover:bg-gray-100 text-center text-xs"
            >
              {m.name}
            </button>
          ))}
        </div>
      </div>
    );
  };

  // Year View Component
  const YearView = () => {
    const decade = getYearsInDecade(viewDate);
    const decadeStart = decade[0];
    const decadeEnd = decade[decade.length - 1];
    
    return (
      <div className="p-2">
        <div className="flex justify-between items-center mb-2">
          <button 
            onClick={() => handleDecadeChange("prev")}
            className="p-1 rounded hover:bg-gray-200 text-xs"
          >
            &lt;
          </button>
          <button 
            onClick={handleHeaderClick} 
            className="font-medium hover:bg-gray-100 px-2 py-1 rounded text-sm"
          >
            {decadeStart} - {decadeEnd}
          </button>
          <button 
            onClick={() => handleDecadeChange("next")}
            className="p-1 rounded hover:bg-gray-200 text-xs"
          >
            &gt;
          </button>
        </div>
        <div className="grid grid-cols-4 gap-1">
          {decade.map((year) => (
            <button
              key={year}
              onClick={() => handleYearSelect(year)}
              className="py-1 px-1 rounded hover:bg-gray-100 text-center text-xs"
            >
              {year}
            </button>
          ))}
        </div>
      </div>
    );
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
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex flex-col sm:flex-row gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="h-8 border-dashed"
                  size="sm"
                >
                  <CalendarIcon className="mr-2 h-3 w-3" />
                  <span>From: </span>
                  {fromDate ? (
                    <span>{format(fromDate, "MMM dd, yyyy")}</span>
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start" side="bottom" sideOffset={4}>
                {calendarView === "day" && (
                  <div className="flex flex-col">
                    <div className="p-2">
                      <Calendar
                        mode="single"
                        selected={fromDate}
                        onSelect={(date) => {
                          if (date) {
                            setFromDate(date);
                            setViewDate(date);
                          }
                        }}
                        month={viewDate}
                        onMonthChange={setViewDate}
                        initialFocus
                        className="p-0"
                        classNames={{
                          caption_label: "hidden", // Hide the default caption
                          cell: "text-sm p-0 relative focus-within:relative focus-within:z-20",
                          day: "h-8 w-8 p-0 font-normal",
                          head_cell: "text-xs font-normal",
                          nav_button: "invisible h-0 w-0", // Hide default nav buttons
                          table: "w-full border-collapse",
                          caption: "relative flex justify-between pt-1 pb-2",
                        }}
                        components={{
                          Caption: ({ displayMonth }) => (
                            <div className="flex justify-between items-center w-full pt-1 pb-2">
                              <button 
                                onClick={() => handleMonthChange("prev")}
                                className="p-1 rounded hover:bg-gray-200 text-xs"
                              >
                                &lt;
                              </button>
                              <button 
                                onClick={handleHeaderClick} 
                                className="font-medium hover:bg-gray-100 px-2 py-1 rounded text-sm"
                              >
                                {format(viewDate, "MMMM yyyy")}
                              </button>
                              <button 
                                onClick={() => handleMonthChange("next")}
                                className="p-1 rounded hover:bg-gray-200 text-xs"
                              >
                                &gt;
                              </button>
                            </div>
                          )
                        }}
                      />
                    </div>
                  </div>
                )}
                
                {calendarView === "month" && <MonthView />}
                {calendarView === "year" && <YearView />}
                
                <div className="p-2 border-t border-gray-200">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => {
                      // When a date is selected, apply it and reset view to day
                      if (calendarView !== "day") {
                        setCalendarView("day");
                      } else if (fromDate) {
                        // Navigate back to the current date
                        setViewDate(fromDate);
                      }
                    }}
                  >
                    {calendarView !== "day" ? "Back to Calendar" : "Reset View"}
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            
            <div className="flex flex-col space-y-1">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-8 border-dashed w-full sm:w-auto"
                    size="sm"
                  >
                    <CalendarIcon className="mr-2 h-3 w-3" />
                    <span>To: </span>
                    {toDate ? (
                      <span>{format(toDate, "MMM dd, yyyy")}</span>
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start" side="bottom" sideOffset={4}>
                  <div className="flex flex-col">
                    <Calendar
                      mode="single"
                      selected={toDate}
                      onSelect={(date) => {
                        if (date) {
                          setToDate(date);
                          setViewDate(date);
                        }
                      }}
                      month={viewDate}
                      onMonthChange={setViewDate}
                      initialFocus
                      className="p-0"
                      classNames={{
                        caption_label: "hidden", // Hide the default caption
                        cell: "text-sm p-0 relative focus-within:relative focus-within:z-20",
                        day: "h-8 w-8 p-0 font-normal",
                        head_cell: "text-xs font-normal",
                        nav_button: "invisible h-0 w-0", // Hide default nav buttons
                        table: "w-full border-collapse",
                        caption: "relative flex justify-between pt-1 pb-2",
                      }}
                      components={{
                        Caption: ({ displayMonth }) => (
                          <div className="flex justify-between items-center w-full pt-1 pb-2">
                            <button 
                              onClick={() => handleMonthChange("prev")}
                              className="p-1 rounded hover:bg-gray-200 text-xs"
                            >
                              &lt;
                            </button>
                            <button 
                              onClick={handleHeaderClick} 
                              className="font-medium hover:bg-gray-100 px-2 py-1 rounded text-sm"
                            >
                              {format(viewDate, "MMMM yyyy")}
                            </button>
                            <button 
                              onClick={() => handleMonthChange("next")}
                              className="p-1 rounded hover:bg-gray-200 text-xs"
                            >
                              &gt;
                            </button>
                          </div>
                        )
                      }}
                    />
                    <div className="p-2 border-t border-gray-200">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => setToDate(new Date())}
                      >
                        Today
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
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