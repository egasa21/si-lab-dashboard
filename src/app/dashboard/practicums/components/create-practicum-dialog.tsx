import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CreatePracticumDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type FormValues = {
  kode: number;
  nama: string;
  deskripsi: string;
  sks: number;
  semester: string;
};

export function CreatePracticumDialog({ open, onOpenChange }: CreatePracticumDialogProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>();

  const onSubmit = (data: FormValues) => {
    console.log("New Practicum Data:", data);
    onOpenChange(false);
    reset(); // Reset the form after closing
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Buat Praktikum Baru</DialogTitle>
          <DialogDescription>
            Isi detail untuk membuat praktikum baru.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="flex flex-col">
            <label className="mb-1 text-sm">Kode</label>
            <Input
              type="number"
              className="[&::-webkit-inner-spin-button]:appearance-none"
              {...register("kode", { required: true })}
              placeholder="Masukkan Kode Mata Kuliah"
              disabled={isSubmitting}
            />
            {errors.kode && (
              <span className="text-red-500 text-xs">Kode is required</span>
            )}
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm">Nama Mata Kuliah</label>
            <Input
              type="text"
              {...register("nama", { required: true })}
              placeholder="Masukkan nama mata kuliah"
              disabled={isSubmitting}
            />
            {errors.nama && (
              <span className="text-red-500 text-xs">Nama is required</span>
            )}
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm">Deskripsi</label>
            <Input
              type="text"
              {...register("deskripsi", { required: true })}
              placeholder="Masukkan Deskripsi"
              disabled={isSubmitting}
            />
            {errors.deskripsi && (
              <span className="text-red-500 text-xs">Deskripsi is required</span>
            )}
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm">SKS</label>
            <Input
              type="number"
              className="[&::-webkit-inner-spin-button]:appearance-none"
              {...register("sks", { required: true })}
              placeholder="Masukkan SKS"
              disabled={isSubmitting}
            />
            {errors.sks && (
              <span className="text-red-500 text-xs">SKS is required</span>
            )}
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm">Semester</label>
            <Select
              onValueChange={(value) => setValue("semester", value)}
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih Semester" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Gasal 2024/2025">Gasal 2024/2025</SelectItem>
                <SelectItem value="Genap 2024/2025">Genap 2024/2025</SelectItem>
                <SelectItem value="Gasal 2025/2026">Gasal 2025/2026</SelectItem>
                <SelectItem value="Genap 2025/2026">Genap 2025/2026</SelectItem>
              </SelectContent>
            </Select>
            {errors.semester && (
              <span className="text-red-500 text-xs">Semester is required</span>
            )}
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              Simpan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
