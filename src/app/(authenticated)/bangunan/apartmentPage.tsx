import { DataTable } from '@/components/datatables/data-table'
import { columns } from './column'
import { createClient } from '@/utils/supabase/server'


export default async function ApartmentPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('apartments').select('id, name, description, address, gmaps, electric_number, water_number, created_at')
  return (
    <>
      <DataTable title='Bangunan' columns={columns} data={data ? data : []} />
    </>
  )
}
