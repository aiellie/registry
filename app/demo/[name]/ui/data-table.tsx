import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { HugeiconsIcon } from "@hugeicons/react"
import { MoreHorizontalIcon } from "@hugeicons/core-free-icons"

const payments = [
  {
    id: "TXN-4821",
    customer: "ken99@example.com",
    method: "Credit Card",
    status: "Success",
    amount: "$316.00",
  },
  {
    id: "TXN-4820",
    customer: "abe45@example.com",
    method: "PayPal",
    status: "Success",
    amount: "$242.00",
  },
  {
    id: "TXN-4819",
    customer: "monserrat44@example.com",
    method: "Bank Transfer",
    status: "Processing",
    amount: "$837.00",
  },
  {
    id: "TXN-4818",
    customer: "silas22@example.com",
    method: "Credit Card",
    status: "Success",
    amount: "$874.00",
  },
  {
    id: "TXN-4817",
    customer: "carmella@example.com",
    method: "Credit Card",
    status: "Failed",
    amount: "$721.00",
  },
] as const

const statusVariant = {
  Success: "secondary",
  Processing: "outline",
  Failed: "destructive",
} as const

export const dataTable = {
  name: "data-table",
  components: {
    Default: (
      <div className="flex w-full justify-center p-6">
        <div className="flex w-full max-w-2xl flex-col gap-4">
          <div className="flex items-center gap-2">
            <Input placeholder="Filter payments..." className="max-w-56" />
            <Button variant="outline" className="ms-auto">
              Export
            </Button>
          </div>
          <div className="overflow-hidden rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Transaction</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead className="text-end">Amount</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">{payment.id}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[payment.status]}>
                        {payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{payment.customer}</TableCell>
                    <TableCell>{payment.method}</TableCell>
                    <TableCell className="text-end">{payment.amount}</TableCell>
                    <TableCell className="text-end">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Open row actions"
                      >
                        <HugeiconsIcon
                          icon={MoreHorizontalIcon}
                          strokeWidth={2}
                          className="size-4"
                        />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={4}>Total</TableCell>
                  <TableCell className="text-end">$2,990.00</TableCell>
                  <TableCell />
                </TableRow>
              </TableFooter>
            </Table>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing 5 of 25 payments.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    ),
  },
}
