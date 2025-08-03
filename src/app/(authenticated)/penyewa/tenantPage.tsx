import { DataTable } from "@/components/datatables/data-table";
import { columns } from "./column";
import { api, HydrateClient } from "@/trpc/server";
import TenantForm from "./tenantForm";

export default async function TenantPage() {
  const data = await api.tenant.list();
  void api.tenant.list.prefetch();
  return (
    <HydrateClient>
      <div className="space-y-4">
        <DataTable title="Penyewa" columns={columns} data={data ?? []}>
          <TenantForm 
            title="Tambah Data" 
            description="Tambahkan penyewa baru"
            modeUpdate={false} 
          />
        </DataTable>
      </div>
    </HydrateClient>
  );
}
