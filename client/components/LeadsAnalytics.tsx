import { Lead, LeadStatus } from "@/hooks/useCRMStore";

const LEAD_STATUSES: LeadStatus[] = [
  "No Stage",
  "Appointment Schedule",
  "Presentation Done",
  "Proposal",
  "Negotiation",
  "Evaluation",
  "Result",
];

const STATUS_COLORS: Record<
  LeadStatus,
  { bg: string; text: string; border: string }
> = {
  "No Stage": {
    bg: "bg-gray-50",
    text: "text-gray-800",
    border: "border-gray-200",
  },
  "Appointment Schedule": {
    bg: "bg-blue-50",
    text: "text-blue-800",
    border: "border-blue-200",
  },
  "Presentation Done": {
    bg: "bg-purple-50",
    text: "text-purple-800",
    border: "border-purple-200",
  },
  Proposal: {
    bg: "bg-yellow-50",
    text: "text-yellow-800",
    border: "border-yellow-200",
  },
  Negotiation: {
    bg: "bg-orange-50",
    text: "text-orange-800",
    border: "border-orange-200",
  },
  Evaluation: {
    bg: "bg-amber-50",
    text: "text-amber-800",
    border: "border-amber-200",
  },
  Result: {
    bg: "bg-green-50",
    text: "text-green-800",
    border: "border-green-200",
  },
};

interface LeadsAnalyticsProps {
  leads: Lead[];
}

export function LeadsAnalytics({ leads }: LeadsAnalyticsProps) {
  const leadsGroupedByStatus: Record<LeadStatus, Lead[]> = {
    "No Stage": [],
    "Appointment Schedule": [],
    "Presentation Done": [],
    Proposal: [],
    Negotiation: [],
    Evaluation: [],
    Result: [],
  };

  leads.forEach((lead) => {
    const status = (lead.status || "No Stage") as LeadStatus;
    if (leadsGroupedByStatus[status]) {
      leadsGroupedByStatus[status].push(lead);
    } else {
      leadsGroupedByStatus["No Stage"].push(lead);
    }
  });

  return (
    <div
      className="grid gap-3"
      style={{ gridTemplateColumns: `repeat(7, minmax(180px, 1fr))` }}
    >
      {LEAD_STATUSES.map((status) => {
        const count = leadsGroupedByStatus[status].length;
        const colors = STATUS_COLORS[status];

        return (
          <div
            key={status}
            className={`rounded-lg border-2 p-3 text-center ${colors.bg} ${colors.border}`}
          >
            <p className="text-xs font-medium text-slate-600 mb-1 truncate">
              {status}
            </p>
            <p className={`text-2xl font-bold ${colors.text}`}>{count}</p>
          </div>
        );
      })}
    </div>
  );
}
