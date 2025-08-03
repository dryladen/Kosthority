export type Apartment = {
    id: string;
    name: string;
    description?: string;
    address: string;
    gmaps: string;
    electric_number?: string;
    water_number?: string;
};

export type Room = {
    id: string;
    status: string;
    name: string;
    price: string;
    apartment_id: string;
};

export type Tenant = {
    id: string;
    name: string;
    phone: string;
    ktp_address: string;
    note?: string;
};

export type Rental = {
    id: string; // bigint
    house_id: string; // uuid
    tenant_id: string; // uuid
    move_in: string; // date
    move_out: string; // date
    monthly_price: string; // text
    note?: string; // text
};

export type Payment = {
    id: string; // bigint
    rental_id: string; // bigint
    amount: string; // text
    note?: string; // text
    for_month: string; // date
};