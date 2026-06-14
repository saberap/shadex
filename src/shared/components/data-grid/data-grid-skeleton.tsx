"use client";

import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";

type DataGridSkeletonProps = {
  rows?: number;
  columns?: number;
};

export function DataGridSkeleton({
  rows = 8,
  columns = 6,
}: DataGridSkeletonProps) {
  const headKeys = Array.from({ length: columns }, (_, i) => `h-${i}`);
  const rowKeys = Array.from({ length: rows }, (_, i) => `r-${i}`);

  return (
    <div className="rounded-xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {headKeys.map((key) => (
              <TableHead key={key} className="h-11 px-4">
                <Skeleton className="h-4 w-24" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rowKeys.map((rowKey, r) => (
            <TableRow key={rowKey}>
              {headKeys.map((colKey, c) => (
                <TableCell key={`${rowKey}-${colKey}`} className="h-12 px-4">
                  <Skeleton
                    className="h-4"
                    style={{ width: `${50 + ((r * c) % 5) * 10}%` }}
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
