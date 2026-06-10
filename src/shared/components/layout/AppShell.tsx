import {
  SidebarInset,
  SidebarProvider,
} from "@/shared/components/ui/sidebar";
import { TooltipProvider } from "@/shared/components/ui/tooltip";
import { AppHeader } from "./AppHeader";
import { AppSidebar } from "./AppSidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <AppHeader />
          <div className="flex-1 overflow-y-auto">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
