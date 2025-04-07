import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IconDots, IconUserPlus, IconEdit, IconTrash } from "@tabler/icons-react";
import Image, { StaticImageData } from "next/image";
import defaultImage from "../../../../../public/default-image.jpg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type CardPracticumProps = {
  image?: string | StaticImageData;
  name: string;
  semester: string;
  updatedAt: string;
  onClick: () => void;  // New onClick function
  onAddUser: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function CardPracticum({
  image = defaultImage,
  name,
  semester,
  updatedAt,
  onClick,  // Accepting onClick function
  onAddUser,
  onEdit,
  onDelete,
}: CardPracticumProps) {
  return (
    <Card
      className={cn("w-[360px]")}
    >
      <CardContent className="grid gap-2">
        <Image
          src={image}
          alt="Practicum Thumbnail"
          width={340}
          height={80}
          className="rounded-sm h-20 object-cover"
        />
        <div className="flex flex-row justify-between">
          <div>
            <CardTitle className="py-4 cursor-pointer" onClick={onClick} >{name}</CardTitle>
            <Badge variant="outline">
              <p className="text-black">{semester}</p>
            </Badge>
            <span className="block text-xs font-semibold text-gray-400 mt-2">
              Edited {updatedAt}
            </span>
          </div>
          <div className="flex flex-col gap-2 justify-end">
            <span
              onClick={(e) => { e.stopPropagation(); onAddUser(); }} // Prevent triggering card click
              className="border rounded-full p-1 shadow-xs hover:scale-105 transition-transform duration-150 cursor-pointer"
            >
              <IconUserPlus className="w-4 h-4" />
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <span
                  onClick={(e) => e.stopPropagation()} // Prevent triggering card click
                  className="border rounded-full p-1 shadow-xs hover:scale-105 transition-transform duration-150 cursor-pointer"
                >
                  <IconDots className="w-4 h-4" />
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={(e) => { e.preventDefault(); onEdit(); }}>
                  <IconEdit className="mr-2 h-4 w-4" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={(e) => { e.preventDefault(); onDelete(); }}>
                  <IconTrash className="mr-2 h-4 w-4 text-red-600" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
