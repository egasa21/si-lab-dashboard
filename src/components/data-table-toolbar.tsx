"use client"

import { Table } from "@tanstack/react-table"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "./data-table-view-options"

interface DataTableToolbarProps<TData> {
    table: Table<TData>
    buttonText?: string
    onButtonClick?: () => void
    searchFunction?: (value: string, searchableColumns: (keyof TData)[]) => void
    searchableColumns: (keyof TData)[]
}

export function DataTableToolbar<TData>({
    table,
    buttonText,
    onButtonClick,
    searchFunction,
    searchableColumns
}: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        if (searchFunction) {
            searchFunction(value, searchableColumns)
        }
    }

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
                {/* Single Input to filter the specified columns */}
                <Input
                    placeholder="Search..."
                    onChange={handleSearchChange}
                    className="h-8 w-[150px] lg:w-[250px]"
                />
                {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={() => table.resetColumnFilters()}
                        className="h-8 px-2 lg:px-3"
                    >
                        Reset <X className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>
            {buttonText && onButtonClick && (
                <Button variant="default" onClick={onButtonClick} className="ml-4 mr-4 h-8 px-2 lg:px-3">
                    {buttonText}
                </Button>
            )}

            <DataTableViewOptions table={table} />
        </div>
    )
}
