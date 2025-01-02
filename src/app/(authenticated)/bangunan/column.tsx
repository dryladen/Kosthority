"use client";

import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Apartment = {
  id: string;
  name: string;
  description: string;
  address: string;
  gmaps: string;
  electric_number: string;
  water_number: string;
  created_at: string;
};

export const columns: ColumnDef<Apartment>[] = [
  {
    id: "name",
    header: "Nama",
  },
  {
    id: "description",
    header: "Deskripsi",
  },
  {
    id: "address",
    header: "Alamat",
  },
  {
    id: "gmaps",
    header: "Google Maps",
  },
  {
    id: "electric_number",
    header: "Nomor Listrik",
  },
  {
    id: "water_number",
    header: "Nomor Air",
  },
  {
    id: "created_at",
    header: "Dibuat",
  },
];
