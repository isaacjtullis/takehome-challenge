import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { OrderForm } from '../components/OrderForm'
import YieldCurveChart from '../components/YieldCurveChart'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

interface YieldData {
  label: string
  value: number | string
}

export const Home = () => {
  const [sheetOpen, setSheetOpen] = useState(false)
  const [currentDate, setCurrentDate] = useState<string | null>(null)
  const { data: yieldData, isLoading, error } = useQuery({
    queryKey: ['yield-data'],
    queryFn: async (): Promise<YieldData[]> => {
      const response = await fetch('/api/yield-data')
      if (!response.ok) {
        throw new Error('Failed to fetch yield data')
      }
      return response.json()
    },
    staleTime: 1000 * 60 * 60 * 24, // cache for 1 day
  })

  useEffect(() => {
    const currentDate = yieldData?.find((item: YieldData) => item.label === 'date');
    setCurrentDate(currentDate?.value as string);
  }, [yieldData]);

  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button>Create Order</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Create New Order</SheetTitle>
              <SheetDescription>
                Enter the term and amount for your treasury order
              </SheetDescription>
            </SheetHeader>
            <OrderForm closeSheet={() => { setSheetOpen(false) }} yieldData={yieldData} />
          </SheetContent>
        </Sheet>
      </div>
      <Card className="w-full h-128">
        <CardHeader className="border-b-2 border-black-300">
          <CardTitle>Current Yield Curve</CardTitle>
          <CardDescription>
            {currentDate ? `${new Date(currentDate).toLocaleDateString()}` : ''}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <div className="text-center space-y-2">
                <p className="text-sm font-medium">Loading yield curve data...</p>
                <p className="text-xs text-muted-foreground">
                  Fetching latest treasury rates
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <div className="text-center space-y-2">
                <p className="text-sm font-medium text-destructive">
                  Failed to load yield curve data
                </p>
                <p className="text-xs text-muted-foreground">
                  Please try refreshing the page
                </p>
              </div>
            </div>
          ) : (
            <YieldCurveChart data={yieldData} />
          )}
        </CardContent>
      </Card>
    </div>
  )
} 