import { Lead, LeadStatus } from "@/hooks/useCRMStore";
import { TrendingUp } from "lucide-react";

const LEAD_STATUSES: LeadStatus[] = [
  "No Stage",
  "Appointment Schedule",
  "Presentation Done",
  "Proposal",
  "Negotiation",
  "Evaluation",
  "Result",
];

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

  const totalLeads = leads.length;
  const resultLeads = leadsGroupedByStatus["Result"].length;
  const conversionRate =
    totalLeads > 0 ? Math.round((resultLeads / totalLeads) * 100) : 0;

  const qualifiedLeads = LEAD_STATUSES.filter(
    (status) => status !== "No Stage",
  ).reduce((sum, status) => sum + leadsGroupedByStatus[status].length, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="text-sm font-medium text-slate-600 mb-2">
          Total Leads
        </div>
        <div className="text-3xl font-bold text-slate-900">{totalLeads}</div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="text-sm font-medium text-slate-600 mb-2">
          Qualified Leads
        </div>
        <div className="text-3xl font-bold text-blue-600">{qualifiedLeads}</div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="text-sm font-medium text-slate-600 mb-2">
          Closed Deals
        </div>
        <div className="text-3xl font-bold text-green-600">{resultLeads}</div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-slate-600 mb-2">
              Conversion Rate
            </div>
            <div className="text-3xl font-bold text-slate-900">
              {conversionRate}%
            </div>
          </div>
          <TrendingUp className="w-8 h-8 text-green-500" />
        </div>
      </div>
    </div>
  );
}
