import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

const orderFormSchema = z.object({
  term: z.string().min(1, "Term is required"),
  amount: z.string().max(7, "Amount must be less than 7 digits").min(1, "Amount is required").refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a positive number"
  }),
})

type OrderFormValues = z.infer<typeof orderFormSchema>

interface YieldData {
  label: string
  value: number | string
}

interface OrderFormProps {
  closeSheet?: () => void,
  yieldData?: YieldData[]
}

// Hardcoded treasury terms
const TREASURY_TERMS = [
  { label: "1 Month", value: "1 Month" },
  { label: "1.5 Months", value: "1.5 Months" },
  { label: "2 Months", value: "2 Months" },
  { label: "3 Months", value: "3 Months" },
  { label: "4 Months", value: "4 Months" },
  { label: "6 Months", value: "6 Months" },
  { label: "1 Year", value: "1 Year" },
  { label: "2 Years", value: "2 Years" },
  { label: "3 Years", value: "3 Years" },
  { label: "5 Years", value: "5 Years" },
  { label: "7 Years", value: "7 Years" },
  { label: "10 Years", value: "10 Years" },
  { label: "30 Years", value: "30 Years" },
]

export const OrderForm = ({ closeSheet, yieldData }: OrderFormProps) => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      term: "",
      amount: "",
    },
  })

  // Watch the selected term to show current rate
  const selectedTerm = form.watch("term")
  
  // Find the current rate for the selected term
  const currentRate = selectedTerm 
    ? yieldData?.find((item: YieldData) => item.label === selectedTerm.replace(' ', '_').replace('s', ''))
    : null

  const createOrderMutation = useMutation({
    mutationFn: async (data: OrderFormValues) => {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          term_years: data.term,
          amount: parseFloat(data.amount),
          rate: currentRate?.value,
        }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to create order')
      }
      
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      form.reset()
      toast({
        title: "Order created successfully",
        description: "Your treasury order has been created.",
      })
      closeSheet?.()
    },
    onError: (error) => {
      toast({
        title: "Error creating order",
        description: error.message || "Failed to create order. Please try again.",
        variant: "destructive",
      })
    },
  })

  function onSubmit(data: OrderFormValues) {
    createOrderMutation.mutate(data)
  }

  return (
    <Card className="w-full max-w-md my-4">
      <CardHeader>
        <CardDescription>
          Enter the term and amount for your treasury order
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="term"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Term</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a term" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {TREASURY_TERMS.map((term) => (
                        <SelectItem key={term.value} value={term.value}>
                          {term.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {currentRate && (
                    <div className="text-sm text-muted-foreground mt-1">
                      Current rate: {typeof currentRate.value === 'number' 
                        ? `${currentRate.value.toFixed(2)}%` 
                        : `${currentRate.value}%`}
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount ($)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="Enter amount"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={createOrderMutation.isPending}
            >
              {createOrderMutation.isPending ? 'Creating...' : 'Create Order'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
} 