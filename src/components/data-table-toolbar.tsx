'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { TrashIcon, XIcon } from 'lucide-react';
import { Row, Table } from '@tanstack/react-table';
import { DataTableFacetedFilter } from './data-table-faceted-filter';
import { useConfirmDialog } from '@/hooks/use-confirm-dialog';

interface FacetedFiltersType {
  column: string;
  title: string;
  options: {
    value: string;
  }[];
}

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  filterKey: string;
  alertDialog: {
    title: string;
    description: string;
  };
  onDelete: (rows: Row<TData>[]) => void;
  facetedFilters?: FacetedFiltersType[];
  disabled: boolean;
}

export function DataTableToolbar<TData>({
  table,
  filterKey,
  alertDialog,
  onDelete,
  facetedFilters,
  disabled,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const [ConfirmDialog, confirm] = useConfirmDialog({
    title: alertDialog.title,
    description: alertDialog.description,
  });

  return (
    <>
      <ConfirmDialog />
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          {/* filter input */}
          <Input
            placeholder={`Filter ${filterKey}`}
            value={
              (table.getColumn(filterKey)?.getFilterValue() as string) ?? ''
            }
            onChange={(event) =>
              table.getColumn(filterKey)?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />

          {/* commnand filter */}
          {facetedFilters &&
            facetedFilters.map((filter) => {
              if (!table.getColumn(filter.column)) return null;

              return (
                <DataTableFacetedFilter
                  key={filter.column}
                  column={table.getColumn(filter.column)}
                  title={filter.title}
                  options={filter.options}
                />
              );
            })}

          {isFiltered && (
            <Button
              className="h-10 gap-2 px-2 lg:px-3"
              variant="ghost"
              onClick={() => table.resetColumnFilters()}
            >
              <XIcon className="size-4" />
              Reset
            </Button>
          )}
        </div>

        {/* bulk delete button */}
        {table.getFilteredSelectedRowModel().rows.length > 0 && (
          <Button
            className="gap-2"
            variant="outline"
            onClick={async () => {
              const isConfirm = await confirm();

              if (isConfirm) {
                onDelete(table.getFilteredSelectedRowModel().rows);
                table.resetRowSelection();
              }
            }}
            disabled={disabled}
          >
            <TrashIcon className="size-4" />
            <span>
              Delete {table.getFilteredSelectedRowModel().rows.length} item(s)
            </span>
          </Button>
        )}
      </div>
    </>
  );
}
