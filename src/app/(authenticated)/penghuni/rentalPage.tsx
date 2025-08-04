import { DataTable } from "@/components/datatables/data-table";
import { columns } from "./column";
import { api, HydrateClient } from "@/trpc/server";
import RentalForm from "./rentalForm";

export default async function RentalPage() {
  const data = await api.rental.list();
  void api.rental.list.prefetch();
  return (
    <HydrateClient>
      <div className="space-y-4">
        <DataTable title="Penghuni Sewa" search="tenantName" columns={columns} data={data ?? []}>
          <RentalForm 
            title="Tambah Penghuni" 
            description="Tambahkan penghuni baru"
            modeUpdate={false} 
          />
        </DataTable>
      </div>
    </HydrateClient>
  );
}
