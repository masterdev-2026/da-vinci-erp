import { useMemo, useState } from "react"
import {
  AlertTriangle,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  Download,
  MoreHorizontal,
  Plus,
  Search,
} from "lucide-react"

import { themeClasses } from "@/lib/theme-classes"
import { useReceivables } from "@/modules/financial/hooks/use-receivables"
import type {
  FinancialStatus,
  FinancialTransaction,
} from "@/modules/financial/types/financial.types"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"

function toNumber(value: number | string) {
  return typeof value === "number" ? value : Number(value)
}

function formatCurrency(value: number | string) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(toNumber(value))
}

function formatDate(value?: string | null) {
  if (!value) return "-"
  return new Intl.DateTimeFormat("pt-BR").format(new Date(value))
}

function getStatusLabel(status: FinancialStatus) {
  switch (status) {
    case "PAID":
      return "Pago"
    case "OVERDUE":
      return "Vencido"
    default:
      return "Pendente"
  }
}

function getStatusClass(status: FinancialStatus) {
  switch (status) {
    case "PAID":
      return themeClasses.badgeSuccess
    case "OVERDUE":
      return themeClasses.badgeDanger
    default:
      return themeClasses.badgeWarning
  }
}

function KPI({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string
  value: string
  description: string
  icon: React.ElementType
}) {
  return (
    <Card className={themeClasses.cardPremium}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-primary/10 p-3 text-primary">
            <Icon className="size-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function AccountsReceivablePage() {
  const { data = [], isLoading, isError, error } = useReceivables()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<"ALL" | FinancialStatus>("ALL")

  const filteredRows = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.category?.name?.toLowerCase().includes(search.toLowerCase()) ||
        item.account?.name?.toLowerCase().includes(search.toLowerCase()) ||
        item.id.toLowerCase().includes(search.toLowerCase())

      const matchesStatus =
        statusFilter === "ALL" ? true : item.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [data, search, statusFilter])

  const totals = useMemo(() => {
    const total = data.reduce((acc, item) => acc + toNumber(item.amount), 0)
    const paid = data
      .filter((item) => item.status === "PAID")
      .reduce((acc, item) => acc + toNumber(item.amount), 0)
    const pending = data
      .filter((item) => item.status === "PENDING")
      .reduce((acc, item) => acc + toNumber(item.amount), 0)
    const overdue = data
      .filter((item) => item.status === "OVERDUE")
      .reduce((acc, item) => acc + toNumber(item.amount), 0)

    return { total, paid, pending, overdue }
  }, [data])

  if (isLoading) {
    return (
      <Card className={themeClasses.cardPremium}>
        <CardContent className="flex min-h-40 items-center justify-center text-muted-foreground">
          Carregando contas a receber...
        </CardContent>
      </Card>
    )
  }

  if (isError) {
    return (
      <Card className="border-rose-500/20 bg-rose-500/5">
        <CardHeader>
          <CardTitle>Erro ao carregar contas a receber</CardTitle>
          <CardDescription>
            Verifique o backend e os headers de sessão de desenvolvimento.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-rose-300">
            {error instanceof Error ? error.message : "Falha desconhecida"}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <section
        className={`relative overflow-hidden rounded-[28px] border border-white/10 p-8 ${themeClasses.gradientHero} ${themeClasses.cardHero}`}
      >
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <Badge className="border-white/10 bg-white/10 text-white hover:bg-white/10">
              Financeiro
            </Badge>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">
                Contas a Receber
              </h1>
              <p className="mt-1 max-w-2xl text-sm text-white/75">
                Visão consolidada dos lançamentos de receita integrados ao backend.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" className="rounded-2xl">
              <Download className="mr-2 size-4" />
              Exportar
            </Button>
            <Button className={themeClasses.gradientSidebarActive}>
              <Plus className="mr-2 size-4" />
              Novo lançamento
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KPI
          title="Carteira total"
          value={formatCurrency(totals.total)}
          description="Somatório de todos os recebíveis"
          icon={CircleDollarSign}
        />
        <KPI
          title="Pagos"
          value={formatCurrency(totals.paid)}
          description="Receitas já liquidadas"
          icon={CheckCircle2}
        />
        <KPI
          title="Pendentes"
          value={formatCurrency(totals.pending)}
          description="Receitas aguardando pagamento"
          icon={Clock3}
        />
        <KPI
          title="Vencidos"
          value={formatCurrency(totals.overdue)}
          description="Receitas em atraso"
          icon={AlertTriangle}
        />
      </section>

      <Card className={themeClasses.cardPremium}>
        <CardHeader className="gap-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle>Listagem operacional</CardTitle>
              <CardDescription>
                Dados reais vindos de <code>/financial/receivables</code>
              </CardDescription>
            </div>

            <div className="flex flex-col gap-3 md:flex-row">
              <div className="relative min-w-[280px]">
                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar por título, categoria, conta ou ID"
                  className="rounded-2xl pl-9"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant={statusFilter === "ALL" ? "default" : "outline"}
                  className="rounded-2xl"
                  onClick={() => setStatusFilter("ALL")}
                >
                  Todos
                </Button>
                <Button
                  variant={statusFilter === "PENDING" ? "default" : "outline"}
                  className="rounded-2xl"
                  onClick={() => setStatusFilter("PENDING")}
                >
                  Pendentes
                </Button>
                <Button
                  variant={statusFilter === "OVERDUE" ? "default" : "outline"}
                  className="rounded-2xl"
                  onClick={() => setStatusFilter("OVERDUE")}
                >
                  Vencidos
                </Button>
                <Button
                  variant={statusFilter === "PAID" ? "default" : "outline"}
                  className="rounded-2xl"
                  onClick={() => setStatusFilter("PAID")}
                >
                  Pagos
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-hidden rounded-3xl border border-white/10">
            <table className="w-full text-sm">
              <thead className="bg-muted/40">
                <tr className="text-left">
                  <th className="px-4 py-3 font-medium">Título</th>
                  <th className="px-4 py-3 font-medium">Categoria</th>
                  <th className="px-4 py-3 font-medium">Conta</th>
                  <th className="px-4 py-3 font-medium">Vencimento</th>
                  <th className="px-4 py-3 font-medium">Pagamento</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 text-right font-medium">Valor</th>
                  <th className="px-4 py-3 text-right font-medium">Ações</th>
                </tr>
              </thead>

              <tbody>
                {filteredRows.map((row: FinancialTransaction) => (
                  <tr key={row.id} className="border-t border-white/10">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium">{row.title}</p>
                        <p className="text-xs text-muted-foreground">{row.id}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">{row.category?.name ?? "-"}</td>
                    <td className="px-4 py-3">{row.account?.name ?? "-"}</td>
                    <td className="px-4 py-3">{formatDate(row.dueDate)}</td>
                    <td className="px-4 py-3">{formatDate(row.paidAt)}</td>
                    <td className="px-4 py-3">
                      <Badge className={getStatusClass(row.status)}>
                        {getStatusLabel(row.status)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right font-medium">
                      {formatCurrency(row.amount)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="rounded-2xl">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-2xl">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
                          <DropdownMenuItem>Editar lançamento</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}

                {filteredRows.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-10 text-center text-muted-foreground">
                      Nenhum lançamento encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}