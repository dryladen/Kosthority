import { DataTable } from "@/components/datatables/data-table";
import { columns } from "./column";
import { api, HydrateClient } from "@/trpc/server";
import ApartmentForm from "./apartmentForm";

export default async function ApartmentPage() {
  const data = await api.apartment.list();
  void api.apartment.list.prefetch();
  return (
    <>
      <HydrateClient>
        <DataTable title="Bangunan" columns={columns} data={data ? data : []} >
          <ApartmentForm title="Tambah Data" description="Tambahkan bangunan baru"
          modeUpdate={false} />
        </DataTable>
      </HydrateClient>
    </>
  );
}
