// Design: Enterprise Editorial Operations — dados são densos, auditáveis e sempre orientados ao fluxo do caso.

export type UserRole = "fm" | "regional" | "management";

export type TicketStatus =
  | "Novo"
  | "Em análise"
  | "Regional"
  | "Planning"
  | "On Hold"
  | "Aguardando validação FM"
  | "Resolvido";

export type Priority = "Critical" | "High" | "Medium" | "Normal";

export interface TimelineEvent {
  date: string;
  time: string;
  title: string;
  description?: string;
  actor?: string;
  tone: "ember" | "blue" | "violet" | "amber" | "green" | "slate";
}

export interface TimeBreakdown {
  total: number;
  fm: number;
  planning: number;
  operation: number;
  validation: number;
}

export interface Ticket {
  id: string;
  createdAt: string;
  seller: string;
  shopId: string;
  phone: string;
  operation: string;
  regional: string;
  station: string;
  dop: string;
  occurrence: string;
  identifiedIssue: string;
  activation: string;
  operator: string;
  status: TicketStatus;
  aging: number;
  tmr: string;
  tmrE2E?: string;
  tmrTeam?: string;
  sameDay?: boolean;
  timeBreakdown?: TimeBreakdown;
  sla: "Dentro do SLA" | "Próximo do SLA" | "Estourado";
  reopen: number;
  riskScore: number;
  priority: Priority;
  responsibleArea: string;
  subject: string;
  riskReason: string;
  timeline: TimelineEvent[];
}

const baseTimeline = (ticket: Omit<Ticket, "timeline">, final?: TimelineEvent): TimelineEvent[] => [
  { date: "18/08", time: "09:32", title: "Ticket criado", description: ticket.subject, tone: "slate" },
  { date: "18/08", time: "14:10", title: "Recebido pelo Tickets FM", actor: ticket.operator, tone: "blue" },
  { date: "18/08", time: "14:25", title: "Análise iniciada", actor: ticket.operator, tone: "violet" },
  ...(ticket.status === "Planning"
    ? [{ date: "18/08", time: "14:40", title: "Escalonado para Planning", description: "Aguardando retorno da área de planejamento", actor: ticket.operator, tone: "amber" as const }]
    : ticket.status === "Regional"
      ? [{ date: "18/08", time: "14:40", title: `Escalonado para ${ticket.regional}`, description: "Tratativa em andamento com a operação", actor: ticket.operator, tone: "amber" as const }]
      : ticket.status === "Aguardando validação FM"
        ? [{ date: "19/08", time: "10:20", title: "Retorno informado pela operação", description: "Coleta regularizada e evidência anexada", actor: "Regional 1", tone: "green" as const }]
        : []),
  ...(final ? [final] : []),
];

const rawTickets: Omit<Ticket, "timeline">[] = [
  {
    id: "#100245",
    createdAt: "18/08/2026 09:32",
    seller: "Casas Bahia",
    shopId: "123456",
    phone: "(11) 99999-9999",
    operation: "OwnFlex",
    regional: "Regional 1",
    station: "SP01",
    dop: "DOP123",
    occurrence: "Disable",
    identifiedIssue: "Disable — Ativação de PUP",
    activation: "Não tive coleta.",
    operator: "Tatiani",
    status: "On Hold",
    aging: 96,
    tmr: "44h 12m",
    sla: "Estourado",
    reopen: 1,
    riskScore: 98,
    priority: "Critical",
    responsibleArea: "Planning",
    subject: "Não tive coleta no ponto acordado",
    riskReason: "Aging alto · dependência externa · ocorrência crítica",
  },
  {
    id: "#100891",
    createdAt: "18/08/2026 11:08",
    seller: "Seller ABC",
    shopId: "287412",
    phone: "(11) 98888-1818",
    operation: "Fulfillment",
    regional: "Regional 1",
    station: "SP02",
    dop: "DOP087",
    occurrence: "Coleta parcial",
    identifiedIssue: "Coleta parcial — capacidade de rota",
    activation: "Parte dos pedidos não foi coletada.",
    operator: "Marina",
    status: "Regional",
    aging: 83,
    tmr: "36h 40m",
    sla: "Estourado",
    reopen: 0,
    riskScore: 91,
    priority: "Critical",
    responsibleArea: "Regional 1",
    subject: "Parte dos pedidos não foi coletada",
    riskReason: "Aging alto · SLA estourado · regional acionada",
  },
  {
    id: "#101002",
    createdAt: "19/08/2026 08:41",
    seller: "Seller XYZ",
    shopId: "442190",
    phone: "(11) 97777-9090",
    operation: "Seller",
    regional: "Regional 2",
    station: "SP03",
    dop: "DOP112",
    occurrence: "Falta de coleta",
    identifiedIssue: "Falta de coleta — janela operacional",
    activation: "A coleta não aconteceu ontem.",
    operator: "Tatiani",
    status: "On Hold",
    aging: 72,
    tmr: "31h 20m",
    sla: "Próximo do SLA",
    reopen: 1,
    riskScore: 87,
    priority: "High",
    responsibleArea: "Regional 2",
    subject: "A coleta não aconteceu ontem",
    riskReason: "Reopen · aging elevado · SLA próximo do vencimento",
  },
  {
    id: "#100764",
    createdAt: "19/08/2026 10:14",
    seller: "Magazine Luiza",
    shopId: "810223",
    phone: "(11) 96666-4433",
    operation: "OwnFlex",
    regional: "Regional 3",
    station: "SP04",
    dop: "DOP054",
    occurrence: "Improcedente",
    identifiedIssue: "Improcedente — coleta realizada",
    activation: "Não tive coleta.",
    operator: "João",
    status: "Resolvido",
    aging: 18,
    tmr: "3h 12m",
    sla: "Dentro do SLA",
    reopen: 0,
    riskScore: 24,
    priority: "Normal",
    responsibleArea: "Tickets FM",
    subject: "Não tive coleta.",
    riskReason: "Evidência validada · baixa recorrência",
  },
  {
    id: "#101142",
    createdAt: "19/08/2026 12:46",
    seller: "Mercado Livre",
    shopId: "650912",
    phone: "(11) 95555-2211",
    operation: "Big Seller",
    regional: "Regional 1",
    station: "SP01",
    dop: "DOP145",
    occurrence: "Conduta Driver",
    identifiedIssue: "Conduta Driver — tentativa fora da janela",
    activation: "O motorista não apareceu no horário.",
    operator: "Marina",
    status: "Aguardando validação FM",
    aging: 39,
    tmr: "18h 08m",
    sla: "Próximo do SLA",
    reopen: 0,
    riskScore: 76,
    priority: "High",
    responsibleArea: "Regional 1",
    subject: "O motorista não apareceu no horário",
    riskReason: "SLA próximo do vencimento · seller estratégico",
  },
  {
    id: "#101201",
    createdAt: "20/08/2026 07:05",
    seller: "Renner",
    shopId: "512034",
    phone: "(11) 94444-5512",
    operation: "Fulfillment",
    regional: "Regional 2",
    station: "SP03",
    dop: "DOP166",
    occurrence: "Falta de coleta",
    identifiedIssue: "Falta de coleta — rota não alocada",
    activation: "Pedido aguardando retirada.",
    operator: "João",
    status: "Em análise",
    aging: 21,
    tmr: "9h 44m",
    sla: "Dentro do SLA",
    reopen: 0,
    riskScore: 55,
    priority: "Medium",
    responsibleArea: "Tickets FM",
    subject: "Pedido aguardando retirada.",
    riskReason: "Primeiro contato · monitorar janela",
  },
  {
    id: "#101330",
    createdAt: "20/08/2026 08:22",
    seller: "Lojas Ponto",
    shopId: "384019",
    phone: "(11) 93333-1200",
    operation: "Seller SVP",
    regional: "Regional 4",
    station: "SP05",
    dop: "DOP188",
    occurrence: "Disable",
    identifiedIssue: "Disable — cadastro de PUP",
    activation: "O ponto foi desativado sem aviso.",
    operator: "Tatiani",
    status: "Planning",
    aging: 16,
    tmr: "10h 28m",
    sla: "Dentro do SLA",
    reopen: 0,
    riskScore: 68,
    priority: "High",
    responsibleArea: "Planning",
    subject: "O ponto foi desativado sem aviso.",
    riskReason: "Dependência externa · seller recorrente",
  },
  {
    id: "#101404",
    createdAt: "20/08/2026 09:18",
    seller: "Petz",
    shopId: "901183",
    phone: "(11) 92222-7788",
    operation: "OwnFlex",
    regional: "Regional 1",
    station: "SP02",
    dop: "DOP191",
    occurrence: "Coleta parcial",
    identifiedIssue: "Coleta parcial — volume divergente",
    activation: "Coletaram apenas parte dos volumes.",
    operator: "Marina",
    status: "Regional",
    aging: 11,
    tmr: "7h 05m",
    sla: "Dentro do SLA",
    reopen: 0,
    riskScore: 62,
    priority: "Medium",
    responsibleArea: "Regional 1",
    subject: "Coletaram apenas parte dos volumes.",
    riskReason: "Volume divergente · confirmar retorno",
  },
  {
    id: "#101512",
    createdAt: "20/08/2026 10:36",
    seller: "Camicado",
    shopId: "720414",
    phone: "(11) 91111-3300",
    operation: "Seller",
    regional: "Regional 3",
    station: "SP04",
    dop: "DOP206",
    occurrence: "Improcedente",
    identifiedIssue: "Improcedente — janela ainda vigente",
    activation: "Ainda não tive coleta.",
    operator: "João",
    status: "Resolvido",
    aging: 6,
    tmr: "2h 16m",
    sla: "Dentro do SLA",
    reopen: 0,
    riskScore: 18,
    priority: "Normal",
    responsibleArea: "Tickets FM",
    subject: "Ainda não tive coleta.",
    riskReason: "Orientação enviada · sem desvio",
  },
  {
    id: "#101588",
    createdAt: "20/08/2026 11:52",
    seller: "Seller ABC",
    shopId: "287412",
    phone: "(11) 98888-1818",
    operation: "Fulfillment",
    regional: "Regional 1",
    station: "SP02",
    dop: "DOP087",
    occurrence: "Falta de coleta",
    identifiedIssue: "Falta de coleta — recorrência no shop",
    activation: "O problema voltou a acontecer hoje.",
    operator: "Marina",
    status: "Em análise",
    aging: 4,
    tmr: "1h 08m",
    sla: "Dentro do SLA",
    reopen: 1,
    riskScore: 73,
    priority: "High",
    responsibleArea: "Tickets FM",
    subject: "O problema voltou a acontecer hoje.",
    riskReason: "Seller recorrente · reopen identificado",
  },
];

export const tickets: Ticket[] = rawTickets.map((ticket, index) => ({
  ...ticket,
  tmrE2E: ["68h 28m", "59h 12m", "52h 40m", "18h 04m", "44h 36m", "28h 18m", "24h 10m", "21h 06m", "12h 42m", "10h 38m"][index],
  tmrTeam: ["44h 12m", "36h 40m", "31h 20m", "3h 12m", "18h 08m", "9h 44m", "10h 28m", "7h 05m", "2h 16m", "1h 08m"][index],
  sameDay: index >= 3,
  timeBreakdown: [
    { total: 68.47, fm: 4.88, planning: 42.83, operation: 20.76, validation: 0 },
    { total: 59.2, fm: 4.5, planning: 28.3, operation: 26.4, validation: 0 },
    { total: 52.67, fm: 5.2, planning: 18.1, operation: 29.37, validation: 0 },
    { total: 18.07, fm: 3.2, planning: 0, operation: 0, validation: 14.87 },
    { total: 44.6, fm: 4.6, planning: 0, operation: 36.6, validation: 3.4 },
    { total: 28.3, fm: 9.73, planning: 0, operation: 18.57, validation: 0 },
    { total: 24.17, fm: 8.2, planning: 15.97, operation: 0, validation: 0 },
    { total: 21.1, fm: 7.08, planning: 0, operation: 14.02, validation: 0 },
    { total: 12.7, fm: 2.27, planning: 0, operation: 0, validation: 10.43 },
    { total: 10.63, fm: 1.13, planning: 0, operation: 9.5, validation: 0 },
  ][index],
  timeline: baseTimeline(ticket),
}));

export const kpis = [
  { label: "Total tickets", value: "1.284", trend: "+12,4%", helper: "vs semana anterior", tone: "ember", detail: "Volume distribuído entre 4 regionais e 6 operações." },
  { label: "TMR geral", value: "28h 42m", trend: "↑ 8,2%", helper: "acima do alvo de 26h", tone: "amber", detail: "O desvio vem principalmente de Disable e Coleta parcial." },
  { label: "TMR Tickets FM", value: "14h 21m", trend: "−3,6%", helper: "melhor que o período anterior", tone: "green", detail: "Análise inicial dentro da janela para 91% dos casos." },
  { label: "OTR 24h", value: "87,4%", trend: "+2,1 pp", helper: "meta: 85%", tone: "green", detail: "Regional 1 lidera com 91,2% no recorte atual." },
  { label: "Reopen rate", value: "4,8%", trend: "−0,9 pp", helper: "9 tickets reabertos", tone: "blue", detail: "Seller ABC concentra 3 dos reopens do período." },
  { label: "Backlog", value: "184", trend: "−17", helper: "desde segunda-feira", tone: "slate", detail: "56 tickets estão em tratativa externa." },
  { label: "SLA crítico", value: "37", trend: "↑ 6", helper: "precisam de atenção", tone: "red", detail: "13 casos dependem de Planning e 9 estão em Regional." },
  { label: "Escalonados", value: "219", trend: "17,1%", helper: "do volume total", tone: "violet", detail: "Regional responde por 64% dos escalonamentos." },
] as const;

export const occurrenceStats = [
  { name: "Disable", tickets: 120, tmr: "46h", share: 18, color: "#F05A3C" },
  { name: "Falta de coleta", tickets: 180, tmr: "21h", share: 25, color: "#E4A62A" },
  { name: "Coleta parcial", tickets: 95, tmr: "27h", share: 12, color: "#5C7CFA" },
  { name: "Conduta Driver", tickets: 54, tmr: "15h", share: 7, color: "#8B6CE8" },
  { name: "Improcedente", tickets: 210, tmr: "3h", share: 28, color: "#35A875" },
];

export const tmrTrend = [
  { label: "12 ago", current: 21, previous: 24, volume: 146 },
  { label: "13 ago", current: 25, previous: 23, volume: 168 },
  { label: "14 ago", current: 24, previous: 25, volume: 182 },
  { label: "15 ago", current: 31, previous: 26, volume: 194 },
  { label: "16 ago", current: 29, previous: 27, volume: 176 },
  { label: "17 ago", current: 34, previous: 29, volume: 205 },
  { label: "18 ago", current: 28, previous: 28, volume: 213 },
];

export const resolutionKpis = [
  { label: "OTR E2E — 24h", value: "84,2%", trend: "+1,8 pp", helper: "criação → finalização", tone: "ember", detail: "Resolução end-to-end medida desde a criação do ticket." },
  { label: "OTR Tickets Team — 24h", value: "91,6%", trend: "+2,4 pp", helper: "entrada FM → finalização", tone: "green", detail: "Tempo contado somente a partir da entrada no Tickets FM." },
  { label: "OTR E2E — Same Day", value: "62,8%", trend: "+4,7 pp", helper: "resolução no mesmo dia", tone: "amber", detail: "Métrica independente: tickets criados e finalizados no mesmo dia." },
  { label: "OTR Tickets Team — Same Day", value: "71,4%", trend: "+5,2 pp", helper: "mesmo dia no Tickets FM", tone: "blue", detail: "Tickets finalizados no mesmo dia após entrada na fila FM." },
] as const;

export const performance = [
  { name: "Tatiani Correa", initials: "TC", handled: 238, tmr: "12h 18m", otr: "92,1%", reopen: "3,1%", quality: 96, productivity: "5,2", timeResolution: "89%", portfolio: { Disable: 12, "Falta de coleta": 10, "Coleta parcial": 8, Improcedente: 7, Outros: 5 }, portfolioTmr: { Disable: "46h", "Falta de coleta": "21h", "Coleta parcial": "27h", Improcedente: "3h" } },
  { name: "Marina Lopes", initials: "ML", handled: 216, tmr: "13h 05m", otr: "90,8%", reopen: "4,2%", quality: 94, productivity: "4,8", timeResolution: "86%", portfolio: { Disable: 9, "Falta de coleta": 11, "Coleta parcial": 9, Improcedente: 5, Outros: 4 }, portfolioTmr: { Disable: "39h", "Falta de coleta": "24h", "Coleta parcial": "29h", Improcedente: "4h" } },
  { name: "João Victor", initials: "JV", handled: 194, tmr: "15h 42m", otr: "88,6%", reopen: "5,8%", quality: 91, productivity: "4,1", timeResolution: "82%", portfolio: { Disable: 8, "Falta de coleta": 12, "Coleta parcial": 6, Improcedente: 9, Outros: 3 }, portfolioTmr: { Disable: "42h", "Falta de coleta": "26h", "Coleta parcial": "25h", Improcedente: "5h" } },
  { name: "Ana Beatriz", initials: "AB", handled: 182, tmr: "16h 09m", otr: "86,4%", reopen: "6,4%", quality: 89, productivity: "3,7", timeResolution: "78%", portfolio: { Disable: 7, "Falta de coleta": 9, "Coleta parcial": 10, Improcedente: 4, Outros: 6 }, portfolioTmr: { Disable: "37h", "Falta de coleta": "23h", "Coleta parcial": "31h", Improcedente: "4h" } },
];

export const sellers = [
  { name: "Seller ABC", shopId: "287412", phone: "(11) 98888-1818", tickets: 42, reopen: 3, qtde_reopen: 3, recurrence_7_days: 6, recurrence_15_days: 11, recurrence_30_days: 18, avgTmr: "28h 10m", risk: "Crítico", occurrences: "Falta de coleta · Coleta parcial" },
  { name: "Casas Bahia", shopId: "123456", phone: "(11) 99999-9999", tickets: 28, reopen: 1, qtde_reopen: 1, recurrence_7_days: 4, recurrence_15_days: 8, recurrence_30_days: 12, avgTmr: "31h 44m", risk: "Atenção", occurrences: "Disable · Falta de coleta" },
  { name: "Mercado Livre", shopId: "650912", phone: "(11) 95555-2211", tickets: 26, reopen: 0, qtde_reopen: 0, recurrence_7_days: 2, recurrence_15_days: 4, recurrence_30_days: 9, avgTmr: "18h 24m", risk: "Normal", occurrences: "Conduta Driver" },
  { name: "Petz", shopId: "901183", phone: "(11) 92222-7788", tickets: 19, reopen: 2, qtde_reopen: 2, recurrence_7_days: 3, recurrence_15_days: 5, recurrence_30_days: 8, avgTmr: "21h 08m", risk: "Atenção", occurrences: "Coleta parcial" },
];

export const distribution = [
  { name: "Tatiani", initials: "TC", current: 32, status: "Online", next: "+1" },
  { name: "Patrick", initials: "PA", current: 29, status: "Online", next: "+1" },
  { name: "Jeisa", initials: "JE", current: 35, status: "Offline", next: "—" },
  { name: "João", initials: "JV", current: 28, status: "Online", next: "+1" },
];

export const analyticsIndicators = [
  "TMR OPS", "TMR OPS — Working Hours", "TMR E2E — Working Hours", "TMR Tickets Team — Working Hours", "Tempo E2E To-End — Working Hours", "Tempo no Time — Working Hours", "Tempo na Operação — Working Hours", "Taxa Reopen", "Order Contact Rate", "Seller Contact Rate", "Recurrence 7 dias", "Recurrence 15 dias", "Recurrence 30 dias", "Tickets vs Cancelamento", "TMR vs Taxa de Cancelamento", "Tickets vs Performance de coleta", "Canal de Abertura", "Curva de Horários — Abertura x Escalonamento",
];

export const roleCopy: Record<UserRole, { label: string; name: string; scope: string; initials: string }> = {
  fm: { label: "Tickets FM / Analista", name: "Tatiani Correa", scope: "Visão operacional completa", initials: "TC" },
  regional: { label: "Operações / Regional", name: "Regional 1", scope: "Apenas escalonados para Regional 1", initials: "R1" },
  management: { label: "Gestão", name: "Thiago · Manager", scope: "Visão consolidada", initials: "TM" },
};

export const navItems = [
  { id: "overview", label: "Overview", description: "Dashboard principal", icon: "LayoutDashboard" },
  { id: "tickets", label: "Tickets", description: "Central de tickets", icon: "Inbox" },
  { id: "escalations", label: "Escalonamentos", description: "Tickets enviados para outras áreas", icon: "ArrowUpRight" },
  { id: "performance", label: "Performance", description: "Performance dos operadores", icon: "UsersRound" },
  { id: "occurrences", label: "Ocorrências", description: "Análise por tipo de problema", icon: "ScanSearch" },
  { id: "sellers", label: "Sellers", description: "Visão 360º do seller", icon: "Store" },
  { id: "quality", label: "Qualidade", description: "Reopen, recorrência e OTR", icon: "ShieldCheck" },
  { id: "analytics", label: "Analytics", description: "Análises mais detalhadas", icon: "ChartNoAxesCombined" },
];

export const attentionTickets = tickets.filter((ticket) => ticket.riskScore >= 76);
