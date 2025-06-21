import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table'
import { Button } from './ui/button'
import { Copy } from 'lucide-react'
import { useToast } from '../hooks/use-toast'

interface Order {
  id: string
  term: string
  rate: number
  amount: number
  createdAt: string
}

export const OrderHistory = ({ orders }: { orders: Order[] }) => {
  const { toast } = useToast()

  if (!orders || orders.length === 0) {
    return (
      <Card data-testid="order-history-no-orders">
        <CardHeader>
          <CardTitle>Order History</CardTitle>
          <CardDescription>No recent treasury orders found.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const handleCopy = (id: string) => {
    navigator.clipboard.writeText(id).then(() => {
      toast({
        title: 'Copied to clipboard',
        description: `Order ID starting with ${id.substring(0, 6)}... copied.`,
      })
    })
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return 'Invalid Date'
    }
    return date.toLocaleString()
  }

  return (
    <Card>
      <CardHeader className="border-b-2 border-black-300" data-testid="order-history">
        <CardTitle>Order History</CardTitle>
        <CardDescription>Recent treasury orders</CardDescription>
      </CardHeader>
        <div className="max-h-[600px] overflow-y-auto pr-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">
                  <span className="sr-only">ID</span>
                </TableHead>
                <TableHead className="text-right">Term (Years)</TableHead>
                <TableHead className="text-right">Rate (%)</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Created At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-xs">
                    <div className="flex items-center gap-2">
                      <span>Order ID</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleCopy(order.id)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {order.term}
                  </TableCell>
                  <TableCell className="text-right">
                    {order.rate}%
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(order.amount)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatDate(order.createdAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
    </Card>
  )
} 