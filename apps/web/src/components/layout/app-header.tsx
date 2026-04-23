import { Bell, ChevronDown, Command, Search, Sparkles } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-background/75 backdrop-blur-2xl">
      <div className="mx-auto flex h-18 max-w-[1600px] items-center gap-3 px-4 md:px-6">
        <SidebarTrigger className="rounded-xl border border-white/10 bg-card/70 shadow-sm" />

        <div className="hidden min-w-[280px] max-w-xl flex-1 md:block">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar empresas, contratos, ordens, usuários..."
              className="h-11 rounded-2xl border-white/10 bg-card/70 pl-10 shadow-sm"
            />
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2 md:gap-3">
          <Button
            variant="outline"
            className="hidden h-11 rounded-2xl border-white/10 bg-card/70 px-4 md:inline-flex"
          >
            <Sparkles className="size-4" />
            Modo executivo
          </Button>

          <Button
            variant="ghost"
            size="icon-sm"
            className="relative rounded-xl border border-white/10 bg-card/70"
          >
            <Bell className="size-4" />
            <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-emerald-500" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-11 rounded-2xl border border-white/10 bg-card/70 px-2.5"
              >
                <div className="flex items-center gap-3">
                  <Avatar size="lg">
                    <AvatarFallback>MM</AvatarFallback>
                  </Avatar>

                  <div className="hidden text-left md:block">
                    <p className="text-sm font-semibold leading-none">
                      Matheus Marques
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Administrador do sistema
                    </p>
                  </div>

                  <ChevronDown className="size-4 text-muted-foreground" />
                </div>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-64 rounded-2xl border-white/10 bg-popover/95 backdrop-blur-xl"
            >
              <DropdownMenuItem>Meu perfil</DropdownMenuItem>
              <DropdownMenuItem>Preferências</DropdownMenuItem>
              <DropdownMenuItem>Empresa ativa</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Configurações</DropdownMenuItem>
              <DropdownMenuItem>Sair</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="hidden items-center gap-2 rounded-2xl border border-white/10 bg-card/70 px-3 py-2 lg:flex">
            <Command className="size-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">⌘K</span>
          </div>
        </div>
      </div>
    </header>
  );
}