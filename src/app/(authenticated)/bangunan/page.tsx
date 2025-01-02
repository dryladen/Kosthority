import { DataTable } from '@/components/datatables/data-table'
import React from 'react'
import { columns } from './column'
import { createClient } from '@/utils/supabase/server'
import { api } from '@/trpc/server'

export default async function page() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('apartment').select('id, name, description, address, gmaps, electric_number, water_number, created_at')
  return (
    <>
      <DataTable title='Bangunan' columns={columns} data={data || []} />
    </>
  )
}
