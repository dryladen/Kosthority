import React, { Suspense } from 'react'
import PageDetails from './pageDetails'
import { api } from '@/trpc/server';
import { Apartment } from '@/utils/types';
import { Skeleton } from "@/components/ui/skeleton";
import { notFound } from 'next/navigation';

type Props = { params: Promise<{ uuid: string }> };

// Loading component untuk detail page
function DetailsSkeleton() {
    return (
        <div className="flex flex-col gap-4 w-full">
            <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-48" />
                <div className="flex gap-2">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-16" />
                </div>
            </div>
            <div className="grid gap-4">
                <div className="space-y-4">
                    <Skeleton className="h-6 w-32" />
                    <div className="space-y-2">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <Skeleton key={i} className="h-4 w-full" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Komponen untuk detail apartment
async function ApartmentDetails({ uuid }: { uuid: string }) {
    try {
        const apartment: Apartment = await api.apartment.getById(uuid);

        if (!apartment) {
            notFound();
        }

        return <PageDetails data={apartment} />;
    } catch (error) {
        notFound();
    }
}

// Menambahkan generateStaticParams untuk dynamic routing yang lebih baik
export async function generateStaticParams() {
    // Hanya generate untuk development, production akan menggunakan ISR
    if (process.env.NODE_ENV === 'development') {
        return [];
    }

    try {
        const apartments = await api.apartment.list();
        return apartments.map((apartment) => ({
            uuid: apartment.id,
        }));
    } catch {
        return [];
    }
}

// Menggunakan ISR untuk caching
export const revalidate = 3600; // Revalidate setiap 1 jam
export const dynamic = 'force-dynamic';

async function page({ params }: Props) {
    const { uuid } = await params;

    // Prefetch untuk optimasi
    void api.apartment.getById.prefetch(uuid);
    return (
        <Suspense fallback={<DetailsSkeleton />}>
            <ApartmentDetails uuid={uuid} />
        </Suspense>
    );
}

export default page
