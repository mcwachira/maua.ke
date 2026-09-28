"use client";

import { useQuery } from "@tanstack/react-query";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { currency } from "@/lib/catalog";
import { demoPayments } from "@/lib/demo-account";
import { api } from "@/lib/api/api";
import { useAuth } from "@/hooks/useAuth";

export default function PaymentsPage() {
  const { user } = useAuth();

  const { data: payments } = useQuery({
    queryKey: ["payments", user?.id],
    enabled: false,
    queryFn: () => api("/payments"),
    initialData: demoPayments,
  });

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl sm:text-3xl">
        Payment history
      </h2>

      <div className="overflow-x-auto border-2 border-border bg-card shadow-shadow">
        <Table className="min-w-[700px]">
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Reference</TableHead>
              <TableHead className="text-right">
                Amount
              </TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{payment.date}</TableCell>

                <TableCell className="font-medium">
                  {payment.order}
                </TableCell>

                <TableCell>{payment.method}</TableCell>

                <TableCell className="text-muted-foreground">
                  {payment.reference}
                </TableCell>

                <TableCell className="text-right">
                  {currency(Number(payment.amount))}
                </TableCell>

                <TableCell>
                  <Badge
                    variant={
                      payment.status === "Paid"
                        ? "secondary"
                        : "destructive"
                    }
                  >
                    {payment.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}