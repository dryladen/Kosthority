import { DataTable } from "@/components/datatables/data-table";
import { columns } from "./column";
import { api, HydrateClient } from "@/trpc/server";
import RoomForm from "./roomForm";

export default async function RoomPage() {
  const data = await api.room.list();
  void api.room.list.prefetch();
  return (
    <HydrateClient>
      <div className="space-y-4">
        <DataTable title="Kamar" columns={columns} data={data ?? []}>
          <RoomForm 
            title="Tambah Data" 
            description="Tambahkan kamar baru"
            modeUpdate={false} 
          />
        </DataTable>
      </div>
    </HydrateClient>
  );
}
