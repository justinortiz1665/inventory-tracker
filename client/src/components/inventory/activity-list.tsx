import { useQuery } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  PlusCircle, 
  Edit, 
  Trash2, 
  AlertCircle 
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function ActivityList() {
  const { data: activities, isLoading } = useQuery({
    queryKey: ['/api/activity'],
    queryFn: async () => {
      const response = await fetch('/api/activity?limit=4');
      if (!response.ok) {
        throw new Error('Failed to fetch activity logs');
      }
      return response.json();
    },
  });

  // Function to get the appropriate icon based on activity action
  const getActivityIcon = (action: string) => {
    switch (action) {
      case 'add':
        return <PlusCircle className="text-green-500 h-5 w-5" />;
      case 'update':
        return <Edit className="text-blue-500 h-5 w-5" />;
      case 'delete':
        return <Trash2 className="text-red-500 h-5 w-5" />;
      default:
        return <AlertCircle className="text-amber-500 h-5 w-5" />;
    }
  };

  // Function to format the timestamp
  const formatTimestamp = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : activities && activities.length > 0 ? (
          <div className="flow-root">
            <ul className="-my-4 divide-y divide-gray-200">
              {activities.map((activity: any) => (
                <li key={activity.id} className="py-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {getActivityIcon(activity.action)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {activity.description}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatTimestamp(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            <p>No recent activity</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
