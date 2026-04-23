import type { ReactNode } from "react";

import { AppHeader } from "@/components/layout/app-header";
import { ErpSidebar } from "@/components/layout/erp-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <SidebarProvider defaultOpen>
      <ErpSidebar />

      <SidebarInset className="min-h-svh bg-transparent">
        <div className="relative min-h-svh">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(79,70,229,0.12),transparent_28%),radial-gradient(circle_at_left,rgba(16,185,129,0.08),transparent_22%)]" />
          <AppHeader />

          <main className="relative z-10 px-4 py-4 md:px-6 md:py-6">
            <div className="mx-auto w-full max-w-[1600px]">{children}</div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}