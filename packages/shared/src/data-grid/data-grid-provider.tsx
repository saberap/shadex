"use client";

import { createContext, type ReactNode, useContext } from "react";
import type { DataGridContextValue } from "./types";

// biome-ignore lint/suspicious/noExplicitAny: generic context requires any at storage point
const DataGridContext = createContext<DataGridContextValue<any> | null>(null);

export function DataGridProvider<TData>({
  value,
  children,
}: {
  value: DataGridContextValue<TData>;
  children: ReactNode;
}) {
  return (
    <DataGridContext.Provider value={value}>
      {children}
    </DataGridContext.Provider>
  );
}

export function useDataGridContext<TData>(): DataGridContextValue<TData> {
  const ctx = useContext(DataGridContext);
  if (!ctx) {
    throw new Error(
      "useDataGridContext must be used within <DataGridProvider />",
    );
  }
  return ctx as DataGridContextValue<TData>;
}
