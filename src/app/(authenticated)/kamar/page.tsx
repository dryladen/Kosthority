import RoomPage from './roomPage'

// Menambahkan force-dynamic untuk memastikan SSR
export const dynamic = 'force-dynamic';
export const revalidate = 0; // Disable static generation untuk real-time data

export default async function page() {
  return <RoomPage />
}
