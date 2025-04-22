import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  iconColor: string;
  isLoading?: boolean;
}

export default function StatCard({ 
  title, 
  value, 
  icon, 
  iconColor, 
  isLoading = false 
}: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center">
          <div className={`flex-shrink-0 ${iconColor} rounded-md p-3`}>
            {icon}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dt className="text-sm font-medium text-gray-500 truncate">
              {title}
            </dt>
            <dd className="flex items-baseline">
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-semibold text-gray-900">
                  {value}
                </div>
              )}
            </dd>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
