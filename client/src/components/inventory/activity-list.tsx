import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Package,
  Plus,
  Trash2,
  Edit
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ActivityList() {
  const { data: activities, isLoading, isError } = useQuery({
    queryKey: ['/api/activity'],
    queryFn: async () => {
      const response = await fetch('/api/activity');
      if (!response.ok) {
        throw new Error('Failed to fetch activity data');
      }
      return response.json();
    },
  });

  // Function to get the appropriate icon for each activity type
  const getActivityIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case 'add':
        return <Plus className="h-4 w-4 text-green-500" />;
      case 'update':
        return <Edit className="h-4 w-4 text-blue-500" />;
      case 'delete':
        return <Trash2 className="h-4 w-4 text-red-500" />;
      case 'transfer-in':
        return <ArrowDownRight className="h-4 w-4 text-purple-500" />;
      case 'transfer-out':
        return <ArrowUpRight className="h-4 w-4 text-orange-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  // Function to format the date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-md flex items-center">
          <Activity className="mr-2 h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : isError ? (
          <div className="text-sm text-red-500">Failed to load activity data</div>
        ) : activities && activities.length > 0 ? (
          <div className="space-y-3">
            {activities.slice(0, 10).map((activity: any, index: number) => (
              <div key={index} className="flex items-start gap-2 text-sm">
                <div className="mt-0.5">
                  {getActivityIcon(activity.action)}
                </div>
                <div className="space-y-1">
                  <p className="font-medium leading-none">
                    {activity.itemName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {activity.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(activity.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-500 py-3 text-center">
            No recent activity
          </div>
        )}
      </CardContent>
    </Card>
  );
}