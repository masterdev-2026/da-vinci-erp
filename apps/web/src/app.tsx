import { Navigate, Route, Routes } from "react-router-dom";
import {
  Activity,
  Building2,
  ClipboardList,
  HandCoins,
  ShieldCheck,
  Truck,
  UserCog,
} from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { DashboardPage } from "@/modules/dashboard/dashboard-page";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type ModulePageProps = {
  title: string;
  description: string;
  icon: React.ElementType;
};

function ModulePage({ title, description, icon: Icon }: ModulePageProps) {
  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-card/90 p-8 shadow-[0_24px_70px_-28px_rgba(15,23,42,0.45)]">
        <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative flex items-start gap-4">
          <div className="rounded-2xl border border-white/10 bg-primary/10 p-3 text-primary">
            <Icon className="size-6" />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
            <p className="max-w-3xl text-sm leading-6 text-muted-foreground md:text-base">
              {description}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[
          "Visão geral do módulo pronta para integração com o backend.",
          "Padrão visual já alinhado com o dashboard executivo.",
          "Espaço ideal para filtros, tabelas, KPIs e ações rápidas.",
        ].map((item) => (
          <Card
            key={item}
            className="border-white/10 bg-card/80 shadow-[0_12px_40px_-24px_rgba(15,23,42,0.55)]"
          >
            <CardHeader>
              <CardTitle className="text-base">Próximo passo</CardTitle>
              <CardDescription>Expansão do módulo</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-muted-foreground">{item}</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}

export function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route path="/dashboard" element={<DashboardPage />} />

        <Route
          path="/financeiro"
          element={
            <ModulePage
              title="Financeiro"
              description="Módulo preparado para contas, transações, bancos, categorias, fluxo de caixa e visão consolidada do negócio."
              icon={HandCoins}
            />
          }
        />

        <Route
          path="/cadastros"
          element={
            <ModulePage
              title="Cadastros"
              description="Base central para empresas, clientes, fornecedores, contratos e demais entidades administrativas."
              icon={Building2}
            />
          }
        />

        <Route
          path="/frota"
          element={
            <ModulePage
              title="Frota"
              description="Estrutura pronta para veículos, motoristas, inspeções, multas, combustível, manutenção e ordens de serviço."
              icon={Truck}
            />
          }
        />

        <Route
          path="/rh"
          element={
            <ModulePage
              title="Recursos Humanos"
              description="Área destinada a colaboradores, cargos, recrutamento, férias, folha, ponto e demais processos internos."
              icon={UserCog}
            />
          }
        />

        <Route
          path="/relatorios"
          element={
            <ModulePage
              title="Relatórios"
              description="Camada analítica do sistema para dashboards, filtros executivos, comparativos e exportações futuras."
              icon={ClipboardList}
            />
          }
        />

        <Route
          path="/conta"
          element={
            <ModulePage
              title="Conta e Segurança"
              description="Configurações do usuário, permissões, trilha de auditoria, segurança e preferências do ambiente."
              icon={ShieldCheck}
            />
          }
        />

        <Route
          path="/monitoramento"
          element={
            <ModulePage
              title="Monitoramento"
              description="Visão operacional contínua para alertas, status do sistema, SLA, criticidade e acompanhamento de eventos."
              icon={Activity}
            />
          }
        />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AppShell>
  );
}