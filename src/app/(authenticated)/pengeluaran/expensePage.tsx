import { DataTable } from "@/components/datatables/data-table";
import { columns } from "./column";
import { api, HydrateClient } from "@/trpc/server";
import ExpenseForm from "./expenseForm";

export default async function ExpensePage() {
  const data = await api.expense.list();
  void api.expense.list.prefetch();
  return (
    <HydrateClient>
      <div className="space-y-4">
        <DataTable title="Pengeluaran" search="category" columns={columns} data={data ?? []}>
          <ExpenseForm 
            title="Tambah Pengeluaran" 
            description="Tambahkan data pengeluaran baru"
            modeUpdate={false} 
          />
        </DataTable>
      </div>
    </HydrateClient>
  );
}
