import { DataTable } from "@/components/datatables/data-table";
import { columns } from "./column";
import { api, HydrateClient } from "@/trpc/server";
import PaymentForm from "./paymentForm";

interface PaymentPageProps {
  searchParams?: {
    rental?: string;
  }
}

export default async function PaymentPage({ searchParams }: PaymentPageProps) {
  const data = await api.payment.list();
  void api.payment.list.prefetch();
  
  const preSelectedRentalId = searchParams?.rental;
  
  return (
    <HydrateClient>
      <div className="space-y-4">
        <DataTable title="Tagihan & Pembayaran" search="tenantName" columns={columns} data={data ?? []}>
          <PaymentForm 
            title="Catat Pembayaran" 
            description="Catat pembayaran dari penyewa"
            modeUpdate={false}
            preSelectedRentalId={preSelectedRentalId}
          />
        </DataTable>
      </div>
    </HydrateClient>
  );
}
