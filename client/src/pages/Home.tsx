// Design: Enterprise Editorial Operations — workbench operacional com fluxo visível, respiro editorial e sinais de risco com significado.

import { useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  ArrowUpRight,
  BarChart3,
  Bell,
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleAlert,
  CircleDot,
  Clock3,
  Filter,
  Inbox,
  LayoutDashboard,
  MapPin,
  MessageSquareText,
  MoreHorizontal,
  Paperclip,
  Plus,
  RotateCcw,
  ScanSearch,
  Search,
  Send,
  ShieldCheck,
  SlidersHorizontal,
  Store,
  Target,
  TimerReset,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import {
  attentionTickets,
  kpis,
  resolutionKpis,
  distribution,
  analyticsIndicators,
  navItems,
  occurrenceStats,
  performance,
  roleCopy,
  sellers,
  tickets as seedTickets,
  tmrTrend,
  type Priority,
  type Ticket,
  type TicketStatus,
  type TimelineEvent,
  type UserRole,
} from "@/lib/mockData";

type PageId = (typeof navItems)[number]["id"];

type Kpi = (typeof kpis)[number] | (typeof resolutionKpis)[number];

const iconMap = {
  LayoutDashboard,
  Inbox,
  ArrowUpRight,
  UsersRound,
  ScanSearch,
  Store,
  ShieldCheck,
  ChartNoAxesCombined: BarChart3,
};

const priorityClass: Record<Priority, string> = {
  Critical: "priority-critical",
  High: "priority-high",
  Medium: "priority-medium",
  Normal: "priority-normal",
};

const statusClass: Record<TicketStatus, string> = {
  Novo: "status-neutral",
  "Em análise": "status-blue",
  Regional: "status-amber",
  Planning: "status-violet",
  "On Hold": "status-red",
  "Aguardando validação FM": "status-green-soft",
  Resolvido: "status-green",
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function MiniTrend({ positive = true }: { positive?: boolean }) {
  return (
    <span className={cn("mini-trend", positive ? "mini-trend-positive" : "mini-trend-warning")}>
      <span className="mini-trend-line" />
      <span className="mini-trend-line mini-trend-line-2" />
      <span className="mini-trend-dot" />
    </span>
  );
}

function StatusBadge({ status }: { status: TicketStatus }) {
  return <span className={cn("status-badge", statusClass[status])}>{status}</span>;
}

function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span className={cn("priority-badge", priorityClass[priority])}>
      <span className="priority-dot" />
      {priority}
    </span>
  );
}

function MetricIcon({ tone }: { tone: string }) {
  const icons: Record<string, typeof Activity> = {
    ember: Activity,
    amber: TimerReset,
    green: CheckCircle2,
    blue: Target,
    slate: Inbox,
    red: CircleAlert,
    violet: ArrowUpRight,
  };
  const Icon = icons[tone] ?? Activity;
  return <Icon size={16} strokeWidth={2.2} />;
}

function Sparkline({ tone }: { tone: string }) {
  return (
    <div className={cn("sparkline", `sparkline-${tone}`)} aria-hidden="true">
      <MiniTrend positive={tone !== "red" && tone !== "amber"} />
    </div>
  );
}

function KpiCard({ kpi, onClick }: { kpi: Kpi; onClick: () => void }) {
  return (
    <button className={cn("kpi-card", `kpi-${kpi.tone}`)} onClick={onClick} type="button"><span className="caseflow-strip" aria-hidden="true"><i /><i /><i /></span>
      <div className="kpi-card-topline">
        <span className="kpi-label"><MetricIcon tone={kpi.tone} />{kpi.label}</span>
        <ArrowUpRight size={15} className="kpi-arrow" />
      </div>
      <div className="kpi-value">{kpi.value}</div>
      <div className="kpi-card-footer">
        <span className="kpi-trend">{kpi.trend}</span>
        <span className="kpi-helper">{kpi.helper}</span>
        <Sparkline tone={kpi.tone} />
      </div>
    </button>
  );
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return (
    <label className="select-field">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
      <ChevronDown size={14} />
    </label>
  );
}

function SectionHeader({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="section-header">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {action && <div className="section-header-action">{action}</div>}
    </div>
  );
}

function DashboardHeader({ role, page, onRoleChange, onSearch }: { role: UserRole; page: PageId; onRoleChange: (role: UserRole) => void; onSearch: (value: string) => void }) {
  const [roleOpen, setRoleOpen] = useState(false);
  const pageTitle = navItems.find((item) => item.id === page)?.label ?? "Overview";
  const profile = roleCopy[role];
  return (
    <header className="topbar">
      <div className="topbar-breadcrumb">
        <span>SPX CaseFlow</span><ChevronRight size={13} /><strong>{pageTitle}</strong>
      </div>
      <div className="topbar-actions">
        <label className="global-search">
          <Search size={16} />
          <input placeholder="Buscar ticket, seller ou Shop ID" onChange={(event) => onSearch(event.target.value)} />
          <kbd>⌘ K</kbd>
        </label>
        <button className="icon-button" type="button" aria-label="Notificações"><Bell size={18} /><span className="notification-dot" /></button>
        <div className="role-switcher">
          <button className="profile-trigger" onClick={() => setRoleOpen((open) => !open)} type="button">
            <span className={cn("avatar avatar-small", role === "regional" && "avatar-amber", role === "management" && "avatar-charcoal")}>{profile.initials}</span>
            <span className="profile-trigger-text"><strong>{profile.name}</strong><small>{profile.label}</small></span>
            <ChevronDown size={15} />
          </button>
          {roleOpen && (
            <div className="role-menu">
              <div className="menu-caption">Simular perfil</div>
              {(Object.keys(roleCopy) as UserRole[]).map((key) => (
                <button key={key} type="button" className={cn("role-option", role === key && "role-option-active")} onClick={() => { onRoleChange(key); setRoleOpen(false); }}>
                  <span className={cn("avatar avatar-small", key === "regional" && "avatar-amber", key === "management" && "avatar-charcoal")}>{roleCopy[key].initials}</span>
                  <span><strong>{roleCopy[key].label}</strong><small>{roleCopy[key].scope}</small></span>
                  {role === key && <Check size={15} />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function Sidebar({ page, onNavigate, role }: { page: PageId; onNavigate: (page: PageId) => void; role: UserRole }) {
  return (
    <aside className="sidebar">
      <div className="brand-lockup">
        <div className="brand-mark"><img src="/manus-storage/spx-caseflow-mark_5924dbc5.png" alt="" /></div>
        <div><div className="brand-name"><span>SPX</span><i className="brand-signal" /><b>CaseFlow</b></div><div className="brand-subtitle">Ticket Treatment &amp; Operational Intelligence</div></div>
      </div>
      <div className="workspace-chip"><span className="workspace-pulse" /><span><strong>Tickets FM</strong><small>workspace operacional</small></span><ChevronDown size={14} /></div>
      <div className="nav-section-label">Workspace</div>
      <nav className="main-nav" aria-label="Navegação principal">
        {navItems.map((item) => {
          const Icon = iconMap[item.icon as keyof typeof iconMap] ?? LayoutDashboard;
          const restricted = role === "regional" && ["overview", "performance", "occurrences", "sellers", "quality", "analytics"].includes(item.id);
          if (restricted) return null;
          return (
            <button key={item.id} type="button" className={cn("nav-item", page === item.id && "nav-item-active", restricted && "nav-item-muted")} onClick={() => onNavigate(item.id as PageId)}>
              <Icon size={18} strokeWidth={page === item.id ? 2.5 : 1.9} />
              <span><strong>{item.label}</strong><small>{item.description}</small></span>
              {item.id === "tickets" && <span className="nav-count">184</span>}
            </button>
          );
        })}
      </nav>
      <div className="sidebar-divider" />
      <button className="nav-item nav-item-help" type="button"><CircleAlert size={18} /><span><strong>Central de ajuda</strong><small>Guias e definições</small></span></button>
      <div className="sidebar-bottom">
        <div className="system-status"><span className="status-live-dot" /><span><strong>Mock environment</strong><small>Dados simulados • v0.1</small></span></div>
        <div className="sidebar-footer"><span>SPX CaseFlow</span><span>v0.1.0</span></div>
      </div>
    </aside>
  );
}

function Overview({ onKpiClick, onTicketClick, onNavigate, onAgingClick, role }: { onKpiClick: (kpi: Kpi) => void; onTicketClick: (ticket: Ticket) => void; onNavigate: (page: PageId) => void; onAgingClick: () => void; role: UserRole }) {
  const [period, setPeriod] = useState("Últimos 7 dias");
  const [operation, setOperation] = useState("Todas");
  const maxBar = Math.max(...tmrTrend.map((item) => Math.max(item.current, item.previous)));
  const linePoints = tmrTrend.map((item, index) => String(42 + index * 78) + "," + String(144 - (item.current / maxBar) * 100)).join(" ");
  const previousPoints = tmrTrend.map((item, index) => String(42 + index * 78) + "," + String(144 - (item.previous / maxBar) * 100)).join(" ");
  return (
    <>
      <div className="page-heading page-heading-overview">
        <div><div className="eyebrow">Tickets FM / {role === "management" ? "Management view" : role === "regional" ? "Regional 1 scope" : "Operational view"}</div><h1>Overview</h1><p>Uma leitura rápida do que está acontecendo na fila e onde a operação precisa agir.</p></div>
        <div className="heading-actions"><SelectField label="Período" value={period} onChange={setPeriod} options={["Hoje", "Últimos 7 dias", "Últimos 30 dias", "Semana", "Mês"]} /><button className="button button-dark" type="button"><SlidersHorizontal size={15} />Filtros avançados</button></div>
      </div>
      <div className="filter-strip"><span className="filter-strip-label"><Filter size={15} />Recorte atual</span><SelectField label="Operação" value={operation} onChange={setOperation} options={["Todas", "OwnFlex", "Fulfillment", "Seller", "Big Seller"]} /><SelectField label="Regional" value={role === "regional" ? "Regional 1" : "Todas"} onChange={() => undefined} options={role === "regional" ? ["Regional 1"] : ["Todas", "Regional 1", "Regional 2", "Regional 3", "Regional 4"]} /><SelectField label="Operador" value="Todos" onChange={() => undefined} options={["Todos", "Tatiani", "Marina", "João"]} /><button className="text-button" type="button">Limpar filtros</button><span className="filter-updated"><span className="status-live-dot" />Atualizado há 2 min</span></div>
      <div className="kpi-grid">{kpis.map((kpi) => <KpiCard key={kpi.label} kpi={kpi} onClick={() => onKpiClick(kpi)} />)}</div>
      <div className="resolution-strip"><div className="resolution-strip-heading"><div><div className="eyebrow">Resolução</div><h2>OTR por janela de resolução</h2></div><span>24h ≠ Same Day</span></div><div className="resolution-kpi-grid">{resolutionKpis.map((kpi) => <KpiCard key={kpi.label} kpi={kpi} onClick={() => onKpiClick(kpi)} />)}</div></div>
      <div className="overview-action-grid"><button className="aging-critical-card" type="button" onClick={onAgingClick}><span className="aging-critical-icon"><CircleAlert size={21} /></span><span><div className="eyebrow eyebrow-risk">Aging Critical</div><strong>27 tickets &gt; 4 dias</strong><small>Abra a fila já ordenada para atuação.</small></span><ArrowUpRight size={17} /></button><section className="panel seller-attention-panel"><div className="panel-heading"><div><div className="eyebrow eyebrow-risk">Sellers que precisam de atenção</div><h2>Recorrência no radar</h2></div><Store size={18} className="panel-icon" /></div><div className="seller-attention-list">{sellers.slice(0, 3).map((seller) => <div className="seller-attention-row" key={seller.shopId}><span className={cn("recurrence-dot", seller.risk === "Crítico" ? "recurrence-critical" : seller.risk === "Atenção" ? "recurrence-watch" : "recurrence-normal")} /><span><strong>{seller.name}</strong><small>{seller.recurrence_7_days} casos em 7 dias · {seller.qtde_reopen} reopen</small></span><span className={cn("risk-label", seller.risk === "Crítico" ? "risk-label-high" : seller.risk === "Atenção" ? "risk-label-medium" : "risk-label-normal")}>{seller.risk}</span></div>)}</div></section></div>
      <div className="overview-grid overview-grid-top">
        <section className="panel trend-panel">
          <div className="panel-heading"><div><div className="eyebrow">Movimento diário</div><h2>TMR — evolução diária</h2></div><div className="legend"><span><i className="legend-dot legend-dot-ember" />Atual</span><span><i className="legend-dot legend-dot-gray" />Período anterior</span></div></div>
          <div className="trend-summary"><strong>28h 42m</strong><span className="trend-summary-change">+8,2%</span><span>média móvel do período</span></div>
          <div className="trend-chart">
            <div className="chart-axis"><span>48h</span><span>36h</span><span>24h</span><span>12h</span><span>0h</span></div>
            <svg viewBox="0 0 520 170" preserveAspectRatio="none" aria-label="Gráfico de TMR atual e período anterior"><defs><linearGradient id="areaFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#F05A3C" stopOpacity="0.22" /><stop offset="100%" stopColor="#F05A3C" stopOpacity="0" /></linearGradient></defs><path d={`M ${linePoints.split(" ").map((point) => point.replace(",", " ")).join(" L ")} L 510 160 L 42 160 Z`} fill="url(#areaFill)" /><polyline points={previousPoints} fill="none" stroke="#AEB1B8" strokeWidth="2" strokeDasharray="5 5" /><polyline points={linePoints} fill="none" stroke="#F05A3C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />{tmrTrend.map((item, index) => <circle key={item.label} cx={42 + index * 78} cy={144 - (item.current / maxBar) * 100} r="4" fill="#fff" stroke="#F05A3C" strokeWidth="2.5" />)}</svg>
            <div className="chart-labels">{tmrTrend.map((item) => <span key={item.label}>{item.label}</span>)}</div>
          </div>
          <div className="chart-footer"><span><Activity size={14} />213 tickets no último ponto</span><button className="text-button" type="button" onClick={() => onNavigate("analytics")}>Ver análise completa <ArrowUpRight size={14} /></button></div>
        </section>
        <section className="panel attention-panel">
          <div className="panel-heading"><div><div className="eyebrow eyebrow-risk">Radar de risco</div><h2>Precisam de atenção</h2></div><span className="attention-count">{attentionTickets.length} casos</span></div>
          <p className="panel-intro">Aging, SLA, reopen e dependências externas concentrados em uma única fila.</p>
          <div className="attention-list">{attentionTickets.slice(0, 4).map((ticket) => <button key={ticket.id} className="attention-row" type="button" onClick={() => onTicketClick(ticket)}><span className={cn("attention-score", ticket.riskScore >= 90 ? "score-critical" : "score-high")}>{ticket.riskScore}</span><span className="attention-copy"><strong>{ticket.id} · {ticket.seller}</strong><small>{ticket.occurrence} · {ticket.aging}h aging</small></span><StatusBadge status={ticket.status} /><ChevronRight size={15} /></button>)}</div>
          <button className="panel-link" type="button" onClick={() => onNavigate("tickets")}>Abrir fila priorizada <ArrowUpRight size={14} /></button>
        </section>
      </div>
      <div className="overview-grid overview-grid-bottom">
        <section className="panel occurrence-panel"><div className="panel-heading"><div><div className="eyebrow">Causa raiz</div><h2>TMR por ocorrência</h2></div><button className="icon-button icon-button-sm" type="button" onClick={() => onNavigate("occurrences")}><MoreHorizontal size={18} /></button></div><div className="occurrence-table"><div className="occurrence-header"><span>Ocorrência</span><span>Tickets</span><span>TMR</span><span>Share</span></div>{occurrenceStats.map((item) => <button key={item.name} className="occurrence-row" type="button" onClick={() => onNavigate("occurrences")}><span className="occurrence-name"><i style={{ background: item.color }} />{item.name}</span><strong>{item.tickets}</strong><span>{item.tmr}</span><span className="share-wrap"><span className="share-track"><span style={{ width: `${item.share * 3}%`, background: item.color }} /></span>{item.share}%</span></button>)}</div><button className="panel-link" type="button" onClick={() => onNavigate("occurrences")}>Explorar ocorrências <ArrowUpRight size={14} /></button></section>
        <section className="panel regional-panel"><div className="panel-heading"><div><div className="eyebrow">Pulso por regional</div><h2>Saúde por regional</h2></div><MapPin size={18} className="panel-icon" /></div><div className="regional-list"><div className="regional-row"><span className="regional-name"><i className="regional-avatar">R1</i><span><strong>Regional 1</strong><small>SP01 · SP02</small></span></span><span><strong>91,2%</strong><small>OTR</small></span><span className="regional-status regional-status-good">Estável</span></div><div className="regional-row"><span className="regional-name"><i className="regional-avatar regional-avatar-amber">R2</i><span><strong>Regional 2</strong><small>SP03 · SP06</small></span></span><span><strong>84,6%</strong><small>OTR</small></span><span className="regional-status regional-status-watch">Atenção</span></div><div className="regional-row"><span className="regional-name"><i className="regional-avatar regional-avatar-red">R3</i><span><strong>Regional 3</strong><small>SP04 · SP07</small></span></span><span><strong>79,8%</strong><small>OTR</small></span><span className="regional-status regional-status-risk">Risco</span></div><div className="regional-row"><span className="regional-name"><i className="regional-avatar regional-avatar-gray">R4</i><span><strong>Regional 4</strong><small>SP05 · SP08</small></span></span><span><strong>87,1%</strong><small>OTR</small></span><span className="regional-status regional-status-good">Estável</span></div></div><div className="map-strip"><img src="/manus-storage/spx-caseflow-route-map_8041965e.png" alt="Rede abstrata de rotas operacionais" /><div><strong>4 regionais monitoradas</strong><span>12 stations com operação ativa</span></div></div></section>
      </div>
    </>
  );
}

function TicketTable({ role, tickets, onTicketClick, searchTerm, setSearchTerm, agingCritical = false, onClearCritical }: { role: UserRole; tickets: Ticket[]; onTicketClick: (ticket: Ticket) => void; searchTerm: string; setSearchTerm: (value: string) => void; agingCritical?: boolean; onClearCritical?: () => void }) {
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [period, setPeriod] = useState("Todos");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("Todos");
  const [occurrence, setOccurrence] = useState("Todas");
  const [priority, setPriority] = useState("Todas");
  const [regional, setRegional] = useState("Todas");
  const effectiveRegional = role === "regional" ? "Regional 1" : regional;
  const parseTicketDate = (createdAt: string) => {
    const [date, time] = createdAt.split(" ");
    const [day, month, year] = date.split("/").map(Number);
    const [hours, minutes] = time.split(":").map(Number);
    return new Date(year, month - 1, day, hours, minutes);
  };
  const isInPeriod = (ticket: Ticket) => {
    const ticketDate = parseTicketDate(ticket.createdAt);
    const mockNow = new Date(2026, 7, 21, 23, 59, 59);
    if (period === "Todos") return true;
    if (period === "Hoje") return ticketDate >= new Date(2026, 7, 21, 0, 0, 0) && ticketDate <= mockNow;
    if (period === "Últimos 7 dias") return ticketDate >= new Date(2026, 7, 15, 0, 0, 0) && ticketDate <= mockNow;
    if (period === "Últimos 30 dias") return ticketDate >= new Date(2026, 6, 23, 0, 0, 0) && ticketDate <= mockNow;
    const customStart = startDate ? new Date(`${startDate}T00:00:00`) : null;
    const customEnd = endDate ? new Date(`${endDate}T23:59:59`) : null;
    if (customStart && ticketDate < customStart) return false;
    if (customEnd && ticketDate > customEnd) return false;
    return true;
  };
  const filtered = tickets
    .filter((ticket) => status === "Todos" || ticket.status === status)
    .filter((ticket) => occurrence === "Todas" || ticket.occurrence === occurrence)
    .filter((ticket) => priority === "Todas" || ticket.priority === priority)
    .filter((ticket) => effectiveRegional === "Todas" || ticket.regional === effectiveRegional)
    .filter((ticket) => isInPeriod(ticket))
    .filter((ticket) => !agingCritical || ticket.aging >= 96)
    .filter((ticket) => !searchTerm || `${ticket.id} ${ticket.seller} ${ticket.shopId} ${ticket.phone}`.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      const operationOrder: Record<string, number> = { OwnFlex: 1, Fulfillment: 2, Full: 2, Seller: 3, "Big Seller": 4, "Seller SVP": 5, Buyer: 6 };
      const slaOrder: Record<string, number> = { Estourado: 1, "Próximo do SLA": 2, "Dentro do SLA": 3 };
      return (operationOrder[a.operation] ?? 99) - (operationOrder[b.operation] ?? 99)
        || (slaOrder[a.sla] ?? 99) - (slaOrder[b.sla] ?? 99)
        || b.aging - a.aging
        || b.riskScore - a.riskScore
        || b.reopen - a.reopen;
    });
  const activeFilterCount = [
    period !== "Todos",
    status !== "Todos",
    occurrence !== "Todas",
    priority !== "Todas",
    role !== "regional" && regional !== "Todas",
    Boolean(searchTerm),
    agingCritical,
  ].filter(Boolean).length;
  const clearFilters = () => {
    setPeriod("Todos");
    setStartDate("");
    setEndDate("");
    setStatus("Todos");
    setOccurrence("Todas");
    setPriority("Todas");
    setRegional("Todas");
    setSearchTerm("");
    onClearCritical?.();
  };
  return (
    <>
      <div className="page-heading"><div><div className="eyebrow">Gestão da fila</div><h1>{agingCritical ? "Tickets Aging +4 dias" : "Tickets"}</h1><p>{role === "regional" ? "Apenas os tickets escalonados para a Regional 1 aparecem nesta fila." : agingCritical ? "Fila crítica com tickets em aging igual ou superior a 4 dias." : "Central de tickets com prioridade, SLA e histórico acionáveis."}</p></div><div className="heading-actions"><button className="button button-dark" type="button" onClick={() => setFiltersOpen((open) => !open)}><SlidersHorizontal size={15} />{filtersOpen ? "Ocultar filtros" : "Filtros avançados"}{activeFilterCount > 0 && <span className="button-filter-count">{activeFilterCount}</span>}</button><button className="button button-ember" type="button"><Plus size={16} />Novo ticket</button></div></div>
      {filtersOpen && <div className="ticket-filter-panel"><div className="filter-panel-top"><strong><Filter size={15} />Filtros avançados {activeFilterCount > 0 && <span className="filter-count">{activeFilterCount} ativos</span>}</strong><div><span>{filtered.length} de {tickets.length} tickets</span><button className="filter-panel-reset" type="button" onClick={clearFilters}>Limpar filtros</button></div></div><div className="filter-grid"><label className="input-field input-field-search"><span>Busca livre</span><Search size={15} /><input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Ticket, seller, Shop ID, telefone" /></label><SelectField label="Período" value={period} onChange={(value) => { setPeriod(value); if (value !== "Personalizado") { setStartDate(""); setEndDate(""); } }} options={["Todos", "Hoje", "Últimos 7 dias", "Últimos 30 dias", "Personalizado"]} /><SelectField label="Status da tratativa" value={status} onChange={setStatus} options={["Todos", "Novo", "Em análise", "Regional", "Planning", "On Hold", "Aguardando validação FM", "Resolvido"]} /><SelectField label="Ocorrência" value={occurrence} onChange={setOccurrence} options={["Todas", "Disable", "Falta de coleta", "Coleta parcial", "Conduta Driver", "Improcedente"]} /><SelectField label="Regional" value={effectiveRegional} onChange={setRegional} options={role === "regional" ? ["Regional 1"] : ["Todas", "Regional 1", "Regional 2", "Regional 3", "Regional 4"]} /><SelectField label="Prioridade" value={priority} onChange={setPriority} options={["Todas", "Critical", "High", "Medium", "Normal"]} />{period === "Personalizado" && <label className="date-field"><span>Data inicial</span><input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} /></label>}{period === "Personalizado" && <label className="date-field"><span>Data final</span><input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} /></label>}</div>{period === "Personalizado" && <div className="filter-hint"><Clock3 size={14} />Escolha uma data inicial, final ou ambas para delimitar a busca.</div>}</div>}
      {role === "regional" && <div className="scope-banner"><Building2 size={17} /><span><strong>Escopo protegido:</strong> Regional 1. Tickets de outras regionais ficam ocultos neste perfil.</span><span className="scope-banner-count">{filtered.length} visíveis</span></div>}
      <div className="table-panel"><div className="table-toolbar"><div className="table-caption"><span className="status-live-dot" />Fila atualizada agora <span className="caption-separator">·</span> Ordenada por operação, SLA, aging, risco e recorrência</div><button className="icon-button icon-button-sm" type="button"><MoreHorizontal size={18} /></button></div><div className="table-scroll"><table className="ticket-table"><thead><tr><th>Prioridade</th><th>Ticket ID</th><th>Seller / Shop ID</th><th>Operação</th><th>Regional / Station</th><th>Ocorrência</th><th>Responsável</th><th>Status</th><th>Aging</th><th>TMR</th><th>SLA</th><th>Risk</th><th /></tr></thead><tbody>{filtered.map((ticket) => <tr key={ticket.id} onClick={() => onTicketClick(ticket)}><td><PriorityBadge priority={ticket.priority} /></td><td><button className="ticket-link" type="button">{ticket.id}</button><small className="table-subtext">{ticket.createdAt}</small></td><td><strong>{ticket.seller}</strong><small className="table-subtext">{ticket.shopId}</small></td><td><span className="operation-chip">{ticket.operation}</span></td><td><strong>{ticket.regional}</strong><small className="table-subtext">{ticket.station}</small></td><td><span className="occurrence-inline"><i style={{ background: occurrenceStats.find((item) => item.name === ticket.occurrence)?.color }} />{ticket.occurrence}</span></td><td>{ticket.operator}</td><td><StatusBadge status={ticket.status} /></td><td><span className={cn("aging", ticket.aging > 72 && "aging-critical", ticket.aging > 40 && ticket.aging <= 72 && "aging-watch")}>{ticket.aging}h</span></td><td>{ticket.tmr}</td><td><span className={cn("sla-cell", ticket.sla === "Estourado" && "sla-danger", ticket.sla === "Próximo do SLA" && "sla-warning")}>{ticket.sla === "Dentro do SLA" ? "Dentro" : ticket.sla === "Próximo do SLA" ? "Próximo" : "Estourado"}</span></td><td><span className={cn("risk-score", ticket.riskScore >= 90 ? "risk-score-critical" : ticket.riskScore >= 70 ? "risk-score-high" : ticket.riskScore >= 45 ? "risk-score-watch" : "risk-score-good")}>{ticket.riskScore}</span></td><td><ChevronRight size={16} className="row-chevron" /></td></tr>)}</tbody></table></div>{filtered.length === 0 && <div className="empty-state"><Search size={25} /><strong>Nenhum ticket encontrado</strong><span>Ajuste os filtros ou tente outro termo de busca.</span></div>}<div className="table-footer"><span>Mostrando {filtered.length} tickets mockados</span><div className="pagination"><button type="button" className="pagination-active">1</button><button type="button">2</button><button type="button">3</button><span>...</span><button type="button">12</button><ChevronRight size={15} /></div></div></div>
    </>
  );
}
function Escalations({ tickets, onTicketClick, role }: { tickets: Ticket[]; onTicketClick: (ticket: Ticket) => void; role: UserRole }) {
  const columns = [
    { label: "Aguardando triagem", tone: "slate", statuses: ["Em análise" as TicketStatus, "Novo" as TicketStatus] },
    { label: "Regional", tone: "amber", statuses: ["Regional" as TicketStatus] },
    { label: "Planning", tone: "violet", statuses: ["Planning" as TicketStatus, "On Hold" as TicketStatus] },
    { label: "Retorno para validação", tone: "green", statuses: ["Aguardando validação FM" as TicketStatus] },
  ];
  return <><div className="page-heading"><div><div className="eyebrow">Controle de handoffs</div><h1>Escalonamentos</h1><p>Acompanhe as dependências que estão fora do Tickets FM e o tempo parado em cada etapa.</p></div><div className="heading-actions"><div className="segmented-control"><button className="segmented-active" type="button">Quadro</button><button type="button">Lista</button></div><button className="button button-dark" type="button"><Filter size={15} />Filtrar</button></div></div><div className="escalation-summary"><div><span className="summary-marker marker-amber" /><strong>219</strong><small>tickets escalonados</small></div><div><span className="summary-marker marker-violet" /><strong>56</strong><small>dependências externas</small></div><div><span className="summary-marker marker-red" /><strong>18</strong><small>fora do SLA</small></div><div className="escalation-summary-note"><Clock3 size={16} /><span>Tempo médio aguardando retorno: <strong>18h 42m</strong></span></div></div><div className="kanban-grid">{columns.map((column) => { const items = tickets.filter((ticket) => column.statuses.includes(ticket.status)).filter((ticket) => role !== "regional" || ticket.regional === "Regional 1"); return <section className="kanban-column" key={column.label}><div className="kanban-column-heading"><span className={cn("column-dot", `column-dot-${column.tone}`)} /><strong>{column.label}</strong><span className="column-count">{items.length}</span></div><div className="kanban-cards">{items.map((ticket) => <button key={ticket.id} className="kanban-card" type="button" onClick={() => onTicketClick(ticket)}><div className="kanban-card-top"><PriorityBadge priority={ticket.priority} /><span>{ticket.aging}h</span></div><strong>{ticket.id} · {ticket.seller}</strong><p>{ticket.occurrence} — {ticket.subject}</p><div className="kanban-card-footer"><span className="avatar avatar-tiny">{ticket.operator.slice(0, 2).toUpperCase()}</span><span>{ticket.responsibleArea}</span><span className="risk-score risk-score-high">{ticket.riskScore}</span></div></button>)}</div>{column.label === "Planning" && <button className="add-column-card" type="button"><Plus size={15} />Adicionar ticket</button>}</section>})}</div></>;
}

function PerformancePage({ onTicketClick, tickets }: { onTicketClick: (ticket: Ticket) => void; tickets: Ticket[] }) {
  const [selectedName, setSelectedName] = useState(performance[0].name);
  const [availability, setAvailability] = useState<Record<string, string>>(() => Object.fromEntries(distribution.map((item) => [item.name, item.status])));
  const selected = performance.find((person) => person.name === selectedName) ?? performance[0];
  const operatorTickets = tickets.filter((ticket) => ticket.operator === selected.name.split(" ")[0]);
  return <>
    <div className="page-heading"><div><div className="eyebrow">Performance do time</div><h1>Performance</h1><p>Velocidade, resolução e contexto da carteira — sem confundir complexidade com produtividade.</p></div><div className="heading-actions"><SelectField label="Período" value="Últimos 7 dias" onChange={() => undefined} options={["Hoje", "Últimos 7 dias", "Últimos 30 dias"]} /><button className="button button-dark" type="button"><BarChart3 size={15} />Exportar visão</button></div></div>
    <div className="performance-hero"><div className="performance-hero-copy"><div className="eyebrow">Pulso do time</div><h2>91,4<span>%</span></h2><p>qualidade média da tratativa</p><div className="performance-goal"><span style={{ width: "91.4%" }} /><small>Meta 90%</small></div></div><div className="performance-hero-stats"><div><strong>830</strong><span>tickets tratados</span></div><div><strong>14h 21m</strong><span>TMR FM médio</span></div><div><strong>5,2</strong><span>tickets / hora</span></div></div><img src="/manus-storage/spx-caseflow-signal_557caf58.png" alt="Sinal abstrato do fluxo" /></div>
    <div className="table-panel performance-table"><div className="table-toolbar"><div><strong>Ranking de operadores</strong><span className="table-toolbar-helper"> Atualizado com o recorte atual</span></div><button className="text-button" type="button">Ver critérios <ArrowUpRight size={14} /></button></div><table className="operator-table"><thead><tr><th>Operador</th><th>Tratados</th><th>TMR FM</th><th>OTR 24h</th><th>Time Resolution</th><th>Produtividade / hora</th><th>Reopen</th><th>Qualidade</th><th /></tr></thead><tbody>{performance.map((person, index) => <tr key={person.name} className={selectedName === person.name ? "operator-row-active" : ""} onClick={() => setSelectedName(person.name)}><td><div className="operator-name"><span className="avatar avatar-medium">{person.initials}</span><span><strong>{person.name}</strong><small>{index === 0 ? "Top performer" : "Tickets FM / Analista"}</small></span></div></td><td><strong>{person.handled}</strong></td><td>{person.tmr}</td><td><span className="metric-good">{person.otr}</span></td><td><strong className="metric-good">{person.timeResolution}</strong></td><td><strong>{person.productivity} tickets/h</strong></td><td>{person.reopen}</td><td><div className="quality-cell"><span className="quality-bar"><i style={{ width: `${person.quality}%` }} /></span><strong>{person.quality}</strong></div></td><td><ChevronRight size={16} className="row-chevron" /></td></tr>)}</tbody></table></div>
    <div className="performance-detail-grid"><section className="panel portfolio-panel"><div className="panel-heading"><div><div className="eyebrow">Contexto da carteira</div><h2>{selected.name} — {selected.handled} tickets</h2></div><span className="panel-heading-note">TMR {selected.tmr}</span></div><p className="panel-intro">O TMR individual deve ser lido junto da complexidade e composição dos tickets tratados.</p><div className="portfolio-list">{Object.entries(selected.portfolio).map(([label, value]) => <div className="portfolio-row" key={label}><span><i className="portfolio-dot" />{label}</span><strong>{value}</strong><span className="portfolio-track"><i style={{ width: `${Math.min((value / selected.handled) * 100 * 4, 100)}%` }} /></span><small>{selected.portfolioTmr[label as keyof typeof selected.portfolioTmr] ?? "—"}</small></div>)}</div><div className="portfolio-note"><Target size={15} />Sem conclusão automática de pior performance: compare carteira, mix de ocorrência e TMR.</div></section><section className="panel distribution-panel"><div className="panel-heading"><div><div className="eyebrow">Demonstração</div><h2>Distribuição de tickets</h2></div><UsersRound size={18} className="panel-icon" /></div><p className="panel-intro">Simule disponibilidade para uma futura distribuição equilibrada.</p><div className="distribution-table"><div className="distribution-header"><span>Operador</span><span>Atuais</span><span>Status</span><span>Nova</span></div>{distribution.map((person) => { const currentStatus = availability[person.name]; return <div className="distribution-row" key={person.name}><span className="operator-name"><span className="avatar avatar-tiny">{person.initials}</span><strong>{person.name}</strong></span><strong>{person.current}</strong><button className={cn("availability-chip", currentStatus === "Online" ? "availability-online" : "availability-offline")} type="button" onClick={() => setAvailability((state) => ({ ...state, [person.name]: currentStatus === "Online" ? "Offline" : "Online" }))}>{currentStatus}</button><span className={currentStatus === "Online" ? "distribution-next" : "distribution-muted"}>{currentStatus === "Online" ? "+1" : "—"}</span></div>; })}</div></section></div>
    <section className="panel operator-drill-panel"><div className="panel-heading"><div><div className="eyebrow">Time Resolution / drill-down</div><h2>{selected.name}</h2></div><div className="operator-drill-summary"><span><strong>{selected.tmr}</strong>TMR</span><span><strong>{selected.otr}</strong>OTR</span><span><strong>{selected.timeResolution}</strong>Time Resolution</span><span><strong>{selected.productivity}</strong>tickets/h</span></div></div><div className="drill-ticket-row">{operatorTickets.slice(0, 4).map((ticket) => <button type="button" className="mini-ticket-row" key={ticket.id} onClick={() => onTicketClick(ticket)}><span><strong>{ticket.id}</strong><small>{ticket.seller} · {ticket.occurrence}</small></span><span className={cn("risk-score", ticket.riskScore >= 75 ? "risk-score-high" : "risk-score-watch")}>{ticket.riskScore}</span><ChevronRight size={14} /></button>)}{operatorTickets.length === 0 && <span className="empty-inline">Nenhum ticket mockado deste operador no recorte atual.</span>}</div></section>
  </>;
}

function OccurrencesPage({ onTicketClick, tickets }: { onTicketClick: (ticket: Ticket) => void; tickets: Ticket[] }) {
  const [selected, setSelected] = useState("Falta de coleta");
  const selectedTickets = tickets.filter((ticket) => ticket.occurrence === selected);
  return <><div className="page-heading"><div><div className="eyebrow">Análise de causa raiz</div><h1>Ocorrências</h1><p>Entenda quais problemas geram volume, espera e reabertura — e abra a fila de origem.</p></div><div className="heading-actions"><SelectField label="Período" value="Últimos 30 dias" onChange={() => undefined} options={["Últimos 7 dias", "Últimos 30 dias", "Mês"]} /></div></div><div className="occurrence-layout"><section className="panel occurrence-breakdown"><div className="panel-heading"><div><div className="eyebrow">Volume x tempo</div><h2>Mix de ocorrências</h2></div><span className="panel-heading-note">579 tickets</span></div><div className="occurrence-cards">{occurrenceStats.map((item) => <button key={item.name} type="button" onClick={() => setSelected(item.name)} className={cn("occurrence-card", selected === item.name && "occurrence-card-active")}><span className="occurrence-card-bar" style={{ background: item.color }} /><strong>{item.name}</strong><span className="occurrence-card-value">{item.tickets}</span><span><b style={{ color: item.color }}>{item.tmr}</b> TMR médio</span><div className="occurrence-progress"><i style={{ width: `${item.share * 3}%`, background: item.color }} /></div></button>)}</div><div className="cause-insight"><span className="insight-icon insight-icon-amber"><CircleAlert size={18} /></span><div><strong>Falta de coleta é o maior ponto de pressão.</strong><p>Representa 25% do volume no recorte e tem 21h de TMR. 42 tickets estão ligados a sellers recorrentes.</p></div></div></section><section className="panel occurrence-detail"><div className="panel-heading"><div><div className="eyebrow">Drill-down</div><h2>{selected}</h2></div><button className="button button-ghost" type="button">Ver fila <ArrowUpRight size={14} /></button></div><div className="detail-metrics"><div><strong>{occurrenceStats.find((item) => item.name === selected)?.tickets ?? 0}</strong><span>tickets</span></div><div><strong>{occurrenceStats.find((item) => item.name === selected)?.tmr}</strong><span>TMR médio</span></div><div><strong>8,4%</strong><span>reopen</span></div></div><div className="cause-list"><div className="cause-list-heading">Principais desvios</div><div className="cause-item"><span className="cause-rank">01</span><span><strong>Janela sem alocação</strong><small>38% dos acionamentos</small></span><b>68</b></div><div className="cause-item"><span className="cause-rank">02</span><span><strong>Capacidade de rota</strong><small>26% dos acionamentos</small></span><b>46</b></div><div className="cause-item"><span className="cause-rank">03</span><span><strong>Recorrência de seller</strong><small>19% dos acionamentos</small></span><b>34</b></div></div><div className="detail-ticket-list"><div className="cause-list-heading">Amostra da fila</div>{selectedTickets.slice(0, 3).map((ticket) => <button key={ticket.id} type="button" className="mini-ticket-row" onClick={() => onTicketClick(ticket)}><span><strong>{ticket.id}</strong><small>{ticket.seller} · {ticket.regional}</small></span><span className={cn("risk-score", ticket.riskScore > 75 ? "risk-score-high" : "risk-score-watch")}>{ticket.riskScore}</span><ChevronRight size={14} /></button>)}</div></section></div></>;
}

function SellersPage({ onTicketClick, tickets }: { onTicketClick: (ticket: Ticket) => void; tickets: Ticket[] }) {
  return <><div className="page-heading"><div><div className="eyebrow">Inteligência de sellers</div><h1>Sellers</h1><p>Visão 360º para identificar recorrência, exposição operacional, telefone e histórico de reabertura.</p></div><div className="heading-actions"><label className="global-search seller-search"><Search size={16} /><input placeholder="Buscar seller ou Shop ID" /></label><button className="button button-dark" type="button"><Filter size={15} />Filtrar</button></div></div><div className="seller-callout"><div className="seller-callout-copy"><div className="eyebrow eyebrow-risk">Recorrência no radar</div><h2>Seller ABC</h2><p>42 tickets no recorte, 3 reopens e TMR médio 28h 10m. A recorrência aumentou 18% desde a semana anterior.</p><span className="seller-phone"><UserRound size={14} />Telefone do Seller: (11) 98888-1818</span><button className="button button-ember" type="button">Abrir visão 360º <ArrowUpRight size={15} /></button></div><div className="seller-callout-stats"><div><strong>42</strong><span>tickets</span></div><div><strong>18</strong><span>recorrência 30d</span></div><div><strong>28h</strong><span>TMR</span></div></div><img src="/manus-storage/spx-caseflow-analytics-texture_1085f697.png" alt="Textura abstrata de analytics" /></div><div className="table-panel seller-table"><div className="table-toolbar"><div><strong>Watchlist de sellers</strong><span className="table-toolbar-helper"> ordenada por recorrência</span></div><span className="table-caption">4 sellers monitorados</span></div><table className="operator-table"><thead><tr><th>Seller</th><th>Telefone</th><th>Tickets</th><th>Reopen</th><th>Recorrência 7d / 30d</th><th>TMR médio</th><th>Risco</th><th /></tr></thead><tbody>{sellers.map((seller) => <tr key={seller.shopId} onClick={() => { const ticket = tickets.find((item) => item.seller === seller.name); if (ticket) onTicketClick(ticket); }}><td><div className="operator-name"><span className="seller-avatar"><Store size={17} /></span><span><strong>{seller.name}</strong><small>Shop ID {seller.shopId}</small></span></div></td><td><span className="seller-phone-inline">{seller.phone}</span></td><td><strong>{seller.tickets}</strong></td><td><span className={seller.reopen > 1 ? "metric-warning" : "metric-good"}>{seller.reopen}</span></td><td><span className="recurrence-cell"><strong>{seller.recurrence_7_days}</strong><small>/ {seller.recurrence_30_days}</small></span></td><td>{seller.avgTmr}</td><td><span className={cn("risk-label", seller.risk === "Crítico" ? "risk-label-high" : seller.risk === "Atenção" ? "risk-label-medium" : "risk-label-normal")}>{seller.risk}</span></td><td><ChevronRight size={16} className="row-chevron" /></td></tr>)}</tbody></table></div></>;
}

function QualityPage() {
  return <><div className="page-heading"><div><div className="eyebrow">Controle de qualidade</div><h1>Qualidade</h1><p>Reopen, recorrência e OTR em uma leitura de causa para orientar coaching e ação operacional.</p></div><div className="heading-actions"><SelectField label="Período" value="Últimos 30 dias" onChange={() => undefined} options={["Últimos 7 dias", "Últimos 30 dias", "Mês"]} /></div></div><div className="quality-grid"><div className="quality-hero panel"><div className="eyebrow">Score de qualidade</div><div className="quality-hero-value">91,4<span>%</span></div><p>+2,8 pp no período</p><div className="quality-ring"><div><strong>91</strong><span>score</span></div></div><span className="quality-hero-note"><CheckCircle2 size={15} />Dentro da meta de 90%</span></div><div className="quality-metric panel"><span className="metric-icon metric-icon-red"><RotateCcw size={18} /></span><div><span>Reopen rate</span><strong>4,8%</strong><small>9 tickets voltaram para a fila</small></div><div className="metric-footer"><span className="metric-negative">−0,9 pp</span><span>vs período anterior</span></div></div><div className="quality-metric panel"><span className="metric-icon metric-icon-amber"><Clock3 size={18} /></span><div><span>OTR 24h</span><strong>87,4%</strong><small>Meta de 85% atingida</small></div><div className="metric-footer"><span className="metric-positive">+2,1 pp</span><span>vs período anterior</span></div></div><div className="quality-metric panel"><span className="metric-icon metric-icon-blue"><Target size={18} /></span><div><span>First touch resolution</span><strong>72,8%</strong><small>Casos resolvidos sem handoff</small></div><div className="metric-footer"><span className="metric-positive">+4,4 pp</span><span>vs período anterior</span></div></div></div><div className="quality-lower-grid"><section className="panel"><div className="panel-heading"><div><div className="eyebrow">Reopen drivers</div><h2>Por que os tickets voltam?</h2></div></div><div className="reopen-bars"><div className="reopen-bar-row"><span>Retorno sem evidência</span><div><i style={{ width: "74%" }} /></div><strong>38%</strong></div><div className="reopen-bar-row"><span>Problema não resolvido</span><div><i style={{ width: "52%" }} /></div><strong>27%</strong></div><div className="reopen-bar-row"><span>Seller não orientado</span><div><i style={{ width: "39%" }} /></div><strong>19%</strong></div><div className="reopen-bar-row"><span>Outro</span><div><i style={{ width: "31%" }} /></div><strong>16%</strong></div></div></section><section className="panel quality-note-panel"><span className="insight-icon insight-icon-ember"><MessageSquareText size={18} /></span><div><div className="eyebrow">Próxima melhor ação</div><h2>Reduzir retorno sem evidência</h2><p>Crie um checklist simples para o retorno da operação. O motivo representa 38% dos reopens e aparece em 3 regionais.</p><button className="button button-ghost" type="button">Ver tickets relacionados <ArrowUpRight size={14} /></button></div></section></div></>;
}

function AnalyticsPage() {
  return <><div className="page-heading"><div><div className="eyebrow">Análises operacionais</div><h1>Analytics</h1><p>Explore padrões de volume, TMR, handoffs e causas dos desvios com mais detalhe.</p></div><div className="heading-actions"><button className="button button-dark" type="button"><BarChart3 size={15} />Exportar relatório</button></div></div><div className="analytics-hero"><div><div className="eyebrow">Inteligência operacional</div><h2>O tempo do ticket é composto por mais do que atendimento.</h2><p>Separe o tempo de análise FM, dependência externa e validação para explicar o TMR com contexto.</p><button className="button button-ember" type="button">Abrir decomposição do TMR <ArrowUpRight size={15} /></button></div><img src="/manus-storage/spx-caseflow-analytics-texture_1085f697.png" alt="Textura de fluxo operacional" /></div><div className="analytics-grid"><section className="panel"><div className="panel-heading"><div><div className="eyebrow">Composição do TMR</div><h2>Onde o tempo está ficando?</h2></div><span className="panel-heading-note">28h 42m total</span></div><div className="stacked-time"><div className="stacked-segment stacked-fm" style={{ width: "29%" }}><span>FM</span><b>8h 18m</b></div><div className="stacked-segment stacked-regional" style={{ width: "35%" }}><span>Regional</span><b>10h 02m</b></div><div className="stacked-segment stacked-planning" style={{ width: "24%" }}><span>Planning</span><b>6h 54m</b></div><div className="stacked-segment stacked-validation" style={{ width: "12%" }}><span>Validação</span><b>3h 28m</b></div></div><div className="stacked-legend"><span><i className="legend-box box-fm" />Tickets FM</span><span><i className="legend-box box-regional" />Regional</span><span><i className="legend-box box-planning" />Planning</span><span><i className="legend-box box-validation" />Validação</span></div></section><section className="panel analytics-variance"><div className="panel-heading"><div><div className="eyebrow">Mapa de desvios</div><h2>Causas do desvio</h2></div></div><div className="variance-item"><span className="variance-number">01</span><span><strong>Disable</strong><small>46h TMR · 18% volume</small></span><b className="variance-danger">+20h</b></div><div className="variance-item"><span className="variance-number">02</span><span><strong>Coleta parcial</strong><small>27h TMR · 12% volume</small></span><b className="variance-warning">+9h</b></div><div className="variance-item"><span className="variance-number">03</span><span><strong>Falta de coleta</strong><small>21h TMR · 25% volume</small></span><b className="variance-watch">+3h</b></div></section></div><section className="panel analytics-catalog"><div className="panel-heading"><div><div className="eyebrow">Catálogo de indicadores</div><h2>Novos recortes operacionais</h2></div><span className="panel-heading-note">{analyticsIndicators.length} indicadores mockados</span></div><div className="analytics-indicator-grid">{analyticsIndicators.map((indicator, index) => <button type="button" className="analytics-indicator" key={indicator}><span className="analytics-indicator-index">{String(index + 1).padStart(2, "0")}</span><span><strong>{indicator}</strong><small>Drill-down disponível no protótipo</small></span><ArrowUpRight size={14} /></button>)}</div></section></>;
}

function TicketDetail({ ticket, role, onClose, onUpdate }: { ticket: Ticket; role: UserRole; onClose: () => void; onUpdate: (ticket: Ticket) => void }) {
  const [activeTab, setActiveTab] = useState("Tratativa");
  const [showEscalation, setShowEscalation] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [note, setNote] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const breakdown = ticket.timeBreakdown ?? { total: 0, fm: 0, planning: 0, operation: 0, validation: 0 };
  const formatHours = (hours: number) => `${Math.floor(hours)}h ${String(Math.round((hours % 1) * 60)).padStart(2, "0")}m`;
  const share = (hours: number) => breakdown.total ? `${Math.round((hours / breakdown.total) * 100)}%` : "0%";
  const addEvent = (event: TimelineEvent, nextStatus?: TicketStatus, nextArea?: string) => {
    const next: Ticket = { ...ticket, status: nextStatus ?? ticket.status, responsibleArea: nextArea ?? ticket.responsibleArea, timeline: [...ticket.timeline, event] };
    onUpdate(next);
  };
  const isReadOnly = role === "management" || (role === "regional" && ticket.status === "Aguardando validação FM");
  const canValidate = role === "fm" && ticket.status === "Aguardando validação FM";
  const actionLabel = role === "management" ? "Visão somente leitura" : role === "regional" ? ticket.status === "Regional" ? "Informar conclusão" : "Retorno enviado" : canValidate ? "Validar tratativa" : "Escalonar ticket";
  const handlePrimaryAction = () => {
    if (role === "regional" && ticket.status === "Regional") {
      addEvent({ date: "21/08", time: "13:46", title: "Conclusão informada pela operação", description: "Retorno enviado para validação do Tickets FM. O relógio do ticket continua acumulando.", actor: "Regional 1", tone: "green" }, "Aguardando validação FM", "Regional 1");
    } else if (canValidate) {
      addEvent({ date: "21/08", time: "13:50", title: "Tratativa validada pelo Tickets FM", description: "Conclusão conferida com evidência operacional. Ticket resolvido.", actor: "Tatiani", tone: "green" }, "Resolvido", "Tickets FM");
    } else if (!isReadOnly) {
      setShowEscalation(true);
    }
  };
  const handleReject = () => {
    if (!rejectReason.trim()) return;
    addEvent({ date: "21/08", time: "13:54", title: "Tratativa devolvida para operação", description: `${rejectReason.trim()} · TMR de operação acumulado: ${formatHours(breakdown.operation)}. O relógio não foi reiniciado.`, actor: "Tatiani", tone: "ember" }, "Regional", ticket.regional);
    setRejectReason("");
    setShowReject(false);
  };
  return <div className="drawer-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><aside className="ticket-drawer"><div className="drawer-topbar"><button className="back-button" type="button" onClick={onClose}><ArrowLeft size={17} />Voltar para tickets</button><button className="icon-button icon-button-sm" type="button" onClick={onClose}><X size={18} /></button></div><div className="drawer-content"><div className="drawer-title-row"><div><div className="eyebrow">Detalhe do ticket / {ticket.priority}</div><h1>{ticket.id}</h1><p>{ticket.subject}</p></div><PriorityBadge priority={ticket.priority} /></div><div className="drawer-status-row"><StatusBadge status={ticket.status} /><span className="drawer-status-note"><Clock3 size={14} />{ticket.aging}h de aging</span><span className="drawer-status-note"><CircleAlert size={14} />Risk {ticket.riskScore}</span></div><div className="ticket-info-grid"><div><span>Seller</span><strong>{ticket.seller}</strong></div><div><span>Shop ID</span><strong>{ticket.shopId}</strong></div><div><span>Telefone</span><strong>{ticket.phone}</strong></div><div><span>Operação</span><strong>{ticket.operation}</strong></div><div><span>Regional</span><strong>{ticket.regional}</strong></div><div><span>Station</span><strong>{ticket.station}</strong></div><div><span>DOP</span><strong>{ticket.dop}</strong></div><div><span>Responsável</span><strong>{ticket.operator}</strong></div></div><div className="drawer-actions"><button className="button button-ember" type="button" disabled={isReadOnly} onClick={handlePrimaryAction}>{canValidate ? <CheckCircle2 size={15} /> : role === "regional" ? <Send size={15} /> : <ArrowUpRight size={15} />}{actionLabel}</button>{canValidate && <button className="button button-danger-soft" type="button" onClick={() => setShowReject(true)}><RotateCcw size={15} />Devolver para operação</button>}<button className="button button-ghost" type="button" onClick={() => setActiveTab("Histórico")}><MessageSquareText size={15} />Adicionar observação</button><button className="icon-button" type="button"><MoreHorizontal size={18} /></button></div><div className="drawer-tabs"><button type="button" className={activeTab === "Tratativa" ? "drawer-tab-active" : ""} onClick={() => setActiveTab("Tratativa")}>Tratativa</button><button type="button" className={activeTab === "Histórico" ? "drawer-tab-active" : ""} onClick={() => setActiveTab("Histórico")}>Histórico <span>{ticket.timeline.length}</span></button><button type="button" className={activeTab === "SLA" ? "drawer-tab-active" : ""} onClick={() => setActiveTab("SLA")}>SLA &amp; risco</button></div>{activeTab === "Tratativa" && <><div className="drawer-section"><div className="drawer-section-heading"><span className="section-marker section-marker-ember" /><div><div className="eyebrow">Acionamento do seller</div><h2>O que foi informado</h2></div></div><div className="activation-quote">“{ticket.activation}”</div><div className="quote-meta"><UserRound size={14} /> recebido em {ticket.createdAt}</div></div><div className="drawer-section"><div className="drawer-section-heading"><span className="section-marker section-marker-red" /><div><div className="eyebrow">Tickets FM / análise</div><h2>Ocorrência identificada</h2></div><span className="procedent-badge"><CircleDot size={14} />Procedente</span></div><div className="identified-issue"><strong>{ticket.identifiedIssue}</strong><span>Problema real identificado pelo Tickets FM</span></div><div className="classification-grid"><div><span>Ocorrência</span><strong>{ticket.occurrence}</strong></div><div><span>Área acionada</span><strong>{ticket.responsibleArea}</strong></div><div><span>SLA acordado</span><strong>48h</strong></div></div></div><div className="drawer-section tmr-definition-section"><div className="drawer-section-heading"><span className="section-marker section-marker-blue" /><div><div className="eyebrow">Abertura do tempo</div><h2>Dois relógios, um ticket</h2></div></div><div className="tmr-definition-grid"><div><span>TMR E2E</span><strong>{ticket.tmrE2E ?? ticket.tmr}</strong><small>Criação do ticket → Finalização</small></div><div><span>TMR Tickets Team</span><strong>{ticket.tmrTeam ?? ticket.tmr}</strong><small>Entrada na fila FM → Finalização</small></div></div></div></>}{activeTab === "Histórico" && <div className="drawer-section timeline-section"><div className="drawer-section-heading"><span className="section-marker section-marker-blue" /><div><div className="eyebrow">Histórico do caso</div><h2>Timeline da tratativa</h2></div></div><div className="time-breakdown-card"><div className="time-breakdown-heading"><span>TMR total</span><strong>{formatHours(breakdown.total)}</strong></div><div className="time-breakdown-bar"><i className="time-breakdown-fm" style={{ width: share(breakdown.fm) }} /><i className="time-breakdown-planning" style={{ width: share(breakdown.planning) }} /><i className="time-breakdown-operation" style={{ width: share(breakdown.operation) }} /><i className="time-breakdown-validation" style={{ width: share(breakdown.validation) }} /></div><div className="time-breakdown-legend"><span><i className="time-dot dot-fm" />Tickets FM <strong>{formatHours(breakdown.fm)}</strong> <small>{share(breakdown.fm)}</small></span><span><i className="time-dot dot-planning" />Planning <strong>{formatHours(breakdown.planning)}</strong> <small>{share(breakdown.planning)}</small></span><span><i className="time-dot dot-operation" />Operação <strong>{formatHours(breakdown.operation)}</strong> <small>{share(breakdown.operation)}</small></span><span><i className="time-dot dot-validation" />Validação <strong>{formatHours(breakdown.validation)}</strong> <small>{share(breakdown.validation)}</small></span></div></div><div className="timeline">{ticket.timeline.map((event, index) => <div className="timeline-item" key={event.title + index}><span className={cn("timeline-node", `timeline-node-${event.tone}`)}>{event.tone === "green" ? <Check size={12} /> : <CircleDot size={12} />}</span><div className="timeline-date"><strong>{event.date}</strong><span>{event.time}</span></div><div className="timeline-copy"><strong>{event.title}</strong>{event.description && <p>{event.description}</p>}{event.actor && <small>{event.actor}</small>}</div></div>)}</div><div className="note-composer"><textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Registrar observação para o próximo handoff..." /><div className="note-composer-footer"><button className="icon-button icon-button-sm" type="button"><Paperclip size={16} /></button><span>{note.length}/280</span><button className="button button-dark button-small" type="button" onClick={() => { if (note.trim()) { addEvent({ date: "21/08", time: "13:52", title: "Observação adicionada", description: note.trim(), actor: roleCopy[role].name, tone: "slate" }); setNote(""); } }}>Salvar observação</button></div></div></div>}{activeTab === "SLA" && <div className="drawer-section"><div className="drawer-section-heading"><span className="section-marker section-marker-amber" /><div><div className="eyebrow">SLA &amp; risk score</div><h2>Por que este ticket está no radar?</h2></div></div><div className="risk-detail-card"><div className="risk-detail-score"><strong>{ticket.riskScore}</strong><span>Risk score</span></div><div><strong>{ticket.riskReason}</strong><p>O score combina aging, proximidade do SLA, prioridade do seller, reopen e dependência de outras áreas.</p></div></div><div className="sla-progress-label"><span><strong>{ticket.aging}h</strong> consumidas</span><span>limite 48h</span></div><div className="sla-progress"><i style={{ width: `${Math.min((ticket.aging / 48) * 100, 100)}%` }} /></div><div className="sla-explain"><span className={ticket.sla === "Estourado" ? "sla-danger" : "sla-warning"}>{ticket.sla}</span><span>Última atualização há 2 min</span></div></div>}</div>{showEscalation && <div className="inline-modal-backdrop"><div className="inline-modal"><div className="inline-modal-heading"><div><div className="eyebrow">Próximo handoff</div><h2>Escalonar ticket</h2><p>Escolha quem deve assumir o próximo passo da tratativa.</p></div><button className="icon-button icon-button-sm" type="button" onClick={() => setShowEscalation(false)}><X size={17} /></button></div><div className="escalation-options"><button type="button" onClick={() => { addEvent({ date: "21/08", time: "13:46", title: "Escalonado para Regional 1", description: "Aguardando retorno da operação", actor: roleCopy[role].name, tone: "amber" }, "Regional", "Regional 1"); setShowEscalation(false); }}><span className="escalation-option-icon option-icon-amber"><Building2 size={18} /></span><span><strong>Regional 1</strong><small>Tratativa operacional local</small></span><ChevronRight size={16} /></button><button type="button" onClick={() => { addEvent({ date: "21/08", time: "13:46", title: "Escalonado para Planning", description: "Aguardando análise de capacidade e rota", actor: roleCopy[role].name, tone: "violet" }, "Planning", "Planning"); setShowEscalation(false); }}><span className="escalation-option-icon option-icon-violet"><BarChart3 size={18} /></span><span><strong>Planning</strong><small>Capacidade, rota e previsão</small></span><ChevronRight size={16} /></button></div><div className="inline-modal-footer"><button className="button button-ghost" type="button" onClick={() => setShowEscalation(false)}>Cancelar</button></div></div></div>}{showReject && <div className="inline-modal-backdrop"><div className="inline-modal reject-modal"><div className="inline-modal-heading"><div><div className="eyebrow eyebrow-risk">Validação FM</div><h2>Devolver para operação</h2><p>Registre o motivo. O relógio do ticket continua acumulando e não será reiniciado.</p></div><button className="icon-button icon-button-sm" type="button" onClick={() => setShowReject(false)}><X size={17} /></button></div><textarea className="reject-reason" value={rejectReason} onChange={(event) => setRejectReason(event.target.value)} placeholder="Ex.: evidência insuficiente, retorno sem comprovante..." /><div className="inline-modal-footer"><button className="button button-ghost" type="button" onClick={() => setShowReject(false)}>Cancelar</button><button className="button button-ember" type="button" disabled={!rejectReason.trim()} onClick={handleReject}><RotateCcw size={15} />Salvar devolução</button></div></div></div>}</aside></div>;
}

function KpiModal({ kpi, onClose }: { kpi: Kpi; onClose: () => void }) {
  return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><div className="kpi-modal"><div className="inline-modal-heading"><div><div className="eyebrow">Drill-down / KPI</div><h2>{kpi.label}</h2></div><button className="icon-button icon-button-sm" type="button" onClick={onClose}><X size={17} /></button></div><div className="modal-kpi-value">{kpi.value}<span>{kpi.trend}</span></div><p className="modal-description">{kpi.detail}</p><div className="modal-divider" /><div className="modal-breakdown"><div><span>Período atual</span><strong>{kpi.value}</strong></div><div><span>Período anterior</span><strong>{kpi.tone === "ember" ? "1.138" : kpi.tone === "amber" ? "26h 30m" : "84,1%"}</strong></div><div><span>Variação</span><strong className={kpi.tone === "red" || kpi.tone === "amber" ? "modal-danger" : "modal-good"}>{kpi.trend}</strong></div></div><button className="button button-ember modal-cta" type="button" onClick={onClose}>Entendi, voltar ao overview <ArrowLeft size={15} /></button></div></div>;
}

export default function Home() {
  const [page, setPage] = useState<PageId>("overview");
  const [role, setRole] = useState<UserRole>("fm");
  const [tickets, setTickets] = useState<Ticket[]>(seedTickets);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [selectedKpi, setSelectedKpi] = useState<Kpi | null>(null);
  const [agingCritical, setAgingCritical] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const scopedTickets = useMemo(() => role === "regional" ? tickets.filter((ticket) => ticket.regional === "Regional 1" && ["Regional", "Aguardando validação FM"].includes(ticket.status)) : tickets, [role, tickets]);
  const updateTicket = (updated: Ticket) => { setTickets((current) => current.map((ticket) => ticket.id === updated.id ? updated : ticket)); setSelectedTicket(updated); };
  const goTo = (next: PageId) => { setPage(next); setSelectedTicket(null); };
  const openAgingCritical = () => { setAgingCritical(true); setPage("tickets"); setSelectedTicket(null); };
  return <div className="app-shell"><Sidebar page={page} onNavigate={goTo} role={role} /><main className="main-area"><DashboardHeader role={role} page={page} onRoleChange={(nextRole) => { setRole(nextRole); setAgingCritical(false); if (nextRole === "regional") setPage("tickets"); }} onSearch={setSearchTerm} /><div className="page-content">{page === "overview" && <Overview role={role} onKpiClick={setSelectedKpi} onTicketClick={setSelectedTicket} onNavigate={goTo} onAgingClick={openAgingCritical} />}{page === "tickets" && <TicketTable role={role} tickets={scopedTickets} onTicketClick={setSelectedTicket} searchTerm={searchTerm} setSearchTerm={setSearchTerm} agingCritical={agingCritical} onClearCritical={() => setAgingCritical(false)} />}{page === "escalations" && <Escalations role={role} tickets={scopedTickets} onTicketClick={setSelectedTicket} />}{page === "performance" && <PerformancePage tickets={scopedTickets} onTicketClick={setSelectedTicket} />}{page === "occurrences" && <OccurrencesPage tickets={scopedTickets} onTicketClick={setSelectedTicket} />}{page === "sellers" && <SellersPage tickets={scopedTickets} onTicketClick={setSelectedTicket} />}{page === "quality" && <QualityPage />}{page === "analytics" && <AnalyticsPage />}</div><footer className="main-footer"><span>SPX CaseFlow · Mock environment</span><span>Última sincronização simulada: 21 ago 2026 · 13:46 BRT</span></footer></main>{selectedTicket && <TicketDetail ticket={selectedTicket} role={role} onClose={() => setSelectedTicket(null)} onUpdate={updateTicket} />}{selectedKpi && <KpiModal kpi={selectedKpi} onClose={() => setSelectedKpi(null)} />}</div>;
}
