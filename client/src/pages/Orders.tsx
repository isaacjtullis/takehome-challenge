import { useQuery } from '@tanstack/react-query'
import { OrderHistory } from '../components/OrderHistory'
import { Loader2 } from 'lucide-react'
import { Card, CardContent } from '../components/ui/card'

interface Order {
  id: string
  term: string
  amount: number
  createdAt: string
}

export const Orders = () => {
  const { data: orders, isLoading, error } = useQuery({
    queryKey: ['orders'],
    queryFn: async (): Promise<Order[]> => {
      const response = await fetch('/api/orders')
      if (!response.ok) {
        throw new Error('Failed to fetch orders')
      }
      return response.json()
    },
  })

  console.log('orders', orders);

  return (
    <div className="w-full">
      <div className="">
        {isLoading ? (
          <Card>
            <CardContent className="p-6 flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </CardContent>
          </Card>
        ) : error ? (
          <Card>
            <CardContent className="p-6">
              <p className="text-destructive">Error loading orders: {error.message}</p>
            </CardContent>
          </Card>
        ) : (
          <OrderHistory orders={orders || []} />
        )}
      </div>
    </div>
  )
} 