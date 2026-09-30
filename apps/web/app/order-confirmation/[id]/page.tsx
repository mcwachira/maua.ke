import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function OrderConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <main className="mx-auto max-w-2xl px-4 py-10 text-center">
      <p className="text-sm text-muted-foreground">Demo confirmation — payment integration lands with the Laravel backend.</p>
      <h1 className="mt-2 text-2xl font-bold">Thank you! Order {id} is confirmed.</h1>
      <p className="mt-2 text-sm text-muted-foreground">A confirmation email and M-Pesa receipt will be sent once real payments are connected.</p>
      <div className="mt-6 flex justify-center gap-3">
        <Button render={<Link href="/track-order" />}>Track order</Button>
        <Button variant="outline" render={<Link href="/shop" />}>Continue shopping</Button>
      </div>
      <p className="mt-4 text-sm"><Link className="underline" href="/account/orders">View your orders</Link></p>
    </main>
  );
}
