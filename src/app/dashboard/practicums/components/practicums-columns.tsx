import { ColumnDef } from "@tanstack/react-table"

export type Practicum = {
  kode: string
  nama: string
  deskripsi: string
  sks: string
  semester: string
}

export const columns: ColumnDef<Practicum>[] = [
  {
    accessorKey: "kode",
    header: "Kode",
  },
  {
    accessorKey: "nama",
    header: "Nama",
  },
  {
    accessorKey: "deskripsi",
    header: "Deskripsi",
  },
  {
    accessorKey: "sks",
    header: "SKS",
  },
  {
    accessorKey: "semester",
    header: "Semester",
  },
]
