import PaymentPage from './paymentPage'

// Menambahkan force-dynamic untuk memastikan SSR
export const dynamic = 'force-dynamic';
export const revalidate = 0; // Disable static generation untuk real-time data

interface PageProps {
  searchParams: Promise<{ rental?: string }>
}

export default async function page({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  return <PaymentPage preSelectedRentalId={resolvedSearchParams.rental} />
}
