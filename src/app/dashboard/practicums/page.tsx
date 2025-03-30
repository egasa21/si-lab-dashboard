import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"


export default function Practicums() {
    return (
        <div className="">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Kode</TableHead>
                        <TableHead>Nama</TableHead>
                        <TableHead>Deskripsi</TableHead>
                        <TableHead className="text-right">SKS</TableHead>
                        <TableHead className="text-right">Semester</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell className="font-medium">231640731</TableCell>
                        <TableCell>Teknologi Mobile</TableCell>
                        <TableCell>Praktikum Teknologi Mobile</TableCell>
                        <TableCell className="text-right">3</TableCell>
                        <TableCell className="text-right">Semester Gasal 2023</TableCell>
                    </TableRow>
                </TableBody>
            </Table>

        </div>
    )
}
