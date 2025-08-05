import { DataTable } from "@/components/datatables/data-table";
import { columns } from "./column";
import { api, HydrateClient } from "@/trpc/server";
import PaymentForm from "./paymentForm";

export default async function PaymentPage() {
  const data = await api.payment.list();
  void api.payment.list.prefetch();
  
  return (
    <HydrateClient>
      <div className="space-y-4">
        <DataTable title="Pembayaran" search="tenantName" columns={columns} data={data ?? []}>
          <PaymentForm 
            title="Catat Pembayaran" 
            description="Catat pembayaran dari penyewa"
            modeUpdate={false}
          />
        </DataTable>
      </div>
    </HydrateClient>
  );
}
