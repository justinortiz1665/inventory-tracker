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
  const [calendarView, setCalendarView] = useState<"day" | "month" | "year" | "decade">("day");
  const [viewDate, setViewDate] = useState<Date>(new Date());

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

  const handleMonthChange = (direction: "prev" | "next") => {
    const newDate = new Date(viewDate);
    const monthChange = direction === "prev" ? -1 : 1;
    newDate.setMonth(newDate.getMonth() + monthChange);
    setViewDate(newDate);
  };

  const handleYearChange = (direction: "prev" | "next") => {
    const newDate = new Date(viewDate);
    const yearChange = direction === "prev" ? -1 : 1;
    newDate.setFullYear(newDate.getFullYear() + yearChange);
    setViewDate(newDate);
  };

  const handleDecadeChange = (direction: "prev" | "next") => {
    const newDate = new Date(viewDate);
    const decadeChange = direction === "prev" ? -10 : 10;
    newDate.setFullYear(newDate.getFullYear() + decadeChange);
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
              {calendarView === "day" && (
                <div className="flex flex-col">
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
                      caption_label: "hidden",
                      cell: "text-sm p-0 relative focus-within:relative focus-within:z-20",
                      day: "h-8 w-8 p-0 font-normal",
                      head_cell: "text-xs font-normal",
                      nav_button: "invisible h-0 w-0",
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
              )}
              {calendarView === "month" && <MonthView />}
              {calendarView === "year" && <YearView />}

              <div className="p-2 border-t">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    if (calendarView !== "day") {
                      setCalendarView("day");
                    } else if (fromDate) {
                      setViewDate(fromDate);
                    }
                  }}
                >
                  {calendarView !== "day" ? "Back to Calendar" : "Reset View"}
                </Button>
              </div>
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