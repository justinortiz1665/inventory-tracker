import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

export default function Transactions() {
  // Fetch transactions
  const { 
    data: transactions = [], 
    isLoading: isLoadingTransactions,
    isError: isTransactionsError,
    error: transactionsError
  } = useQuery({
    queryKey: ['/api/transactions'],
  });

  // Fetch inventory items for displaying item names
  const { 
    data: inventoryItems = [],
    isLoading: isLoadingItems 
  } = useQuery({
    queryKey: ['/api/inventory'],
  });

  // Fetch facilities for displaying facility names
  const { 
    data: facilities = [],
    isLoading: isLoadingFacilities 
  } = useQuery({
    queryKey: ['/api/facilities'],
  });

  // Get item name by ID
  const getItemName = (itemId: number) => {
    const item = inventoryItems?.find((item: any) => item.id === itemId);
    return item ? item.name : 'Unknown Item';
  };

  // Get facility name by ID
  const getFacilityName = (facilityId: number) => {
    if (!facilityId) return 'Main Inventory';
    const facility = facilities?.find((facility: any) => facility.id === facilityId);
    return facility ? facility.name : 'Unknown Facility';
  };

  return (
    <div>
      <div className="py-4">
        <h1 className="text-2xl font-semibold text-gray-800">Inventory Transactions</h1>
      </div>
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>
            Record of inventory movements between facilities
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingTransactions ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
          ) : isTransactionsError ? (
            <div className="rounded-md bg-red-50 p-4 text-red-700">
              Error loading transactions: {(transactionsError as Error).message}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No transactions found.
                    </TableCell>
                  </TableRow>
                ) : (
                  transactions?.map((transaction: any) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        {transaction.transactionDate ? 
                          format(new Date(transaction.transactionDate), 'MMM d, yyyy') : 
                          '—'}
                      </TableCell>
                      <TableCell>{isLoadingItems ? '...' : getItemName(transaction.itemId)}</TableCell>
                      <TableCell>{transaction.quantity}</TableCell>
                      <TableCell>
                        {isLoadingFacilities ? '...' : 
                          transaction.fromFacilityId ? 
                            <Link href={`/facilities/${transaction.fromFacilityId}`}>
                              {getFacilityName(transaction.fromFacilityId)}
                            </Link> : 
                            'Main Inventory'
                        }
                      </TableCell>
                      <TableCell>
                        {isLoadingFacilities ? '...' : 
                          transaction.toFacilityId ? 
                            <Link href={`/facilities/${transaction.toFacilityId}`}>
                              {getFacilityName(transaction.toFacilityId)}
                            </Link> : 
                            'Main Inventory'
                        }
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {transaction.notes || '—'}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}