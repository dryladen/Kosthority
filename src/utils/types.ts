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
    id: number; // bigint
    house_id: string; // uuid
    tenant_id: string; // uuid
    move_in: string; // date
    move_out: string; // date
    monthly_price: string; // text
    status: 'active' | 'completed' | 'terminated' | 'cancelled'; // rental status
    note?: string; // text
};

export type Payment = {
    id: number; // bigint
    rental_id: number; // bigint
    amount: string; // text
    note?: string; // text
    for_month: string; // date
};

export type Expense = {
    id: string;
    apartment_id: string;
    category: 'electricity' | 'water' | 'maintenance' | 'repair' | 'cleaning' | 'supplies' | 'tax' | 'insurance' | 'other';
    description: string;
    amount: string;
    expense_date: string;
    meter_reading_before?: string;
    meter_reading_after?: string;
    receipt_url?: string;
    note?: string;
    created_at: string;
};

export type Note = {
    id: number;
    title: string;
    content: string;
    category: 'general' | 'maintenance' | 'tenant' | 'payment' | 'important' | 'reminder';
    priority: 'low' | 'medium' | 'high';
    apartment_id?: string;
    created_at: string;
    updated_at: string;
};