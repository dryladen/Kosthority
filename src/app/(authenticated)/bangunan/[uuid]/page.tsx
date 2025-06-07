import React from 'react'
import PageDetails from './pageDetails'
import { api } from '@/trpc/server';
import { Apartment } from '@/utils/types';
type Props = { params: Promise<{ uuid: string }> };

async function page({ params }: Props) {
    const { uuid } = await params;
    const apartment: Apartment = await api.apartment.getById(uuid);
    void api.apartment.getById.prefetch(uuid);
    return (
        <PageDetails
            data={apartment}
        />
    )
}

export default page
