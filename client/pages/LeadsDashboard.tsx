import { useState } from "react";
import { MainLayout } from "@/components/Layout";
import { Lead, LeadStatus, useCRMStore } from "@/hooks/useCRMStore";
import { Loader2 } from "lucide-react";
import { LeadDetailModal } from "@/components/LeadDetailModal";
import { KanbanBoard } from "@/components/KanbanBoard";
import { LeadsAnalytics } from "@/components/LeadsAnalytics";

const LEAD_STATUSES: LeadStatus[] = [
  "No Stage",
  "Appointment Schedule",
  "Presentation Done",
  "Proposal",
  "Negotiation",
  "Evaluation",
  "Result",
];

export default function LeadsDashboard() {
  const { leads, salespersons, isLoading, updateLead } = useCRMStore();
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-slate-600">Loading dashboard...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

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

  const getSalespersonName = (assignedTo?: string) => {
    if (!assignedTo) return "Unassigned";
    const salesperson = salespersons.find((sp) => sp.id === assignedTo);
    return salesperson?.name || "Unknown";
  };

  const handleDragEnd = async (
    leadId: string,
    newStatus: LeadStatus,
    oldStatus: LeadStatus,
  ) => {
    if (newStatus !== oldStatus) {
      try {
        await updateLead(leadId, { status: newStatus });
      } catch (error) {
        console.error("Error updating lead status:", error);
      }
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Leads Dashboard</h1>
          <p className="text-slate-600 mt-1">Manage your leads across stages</p>
        </div>

        <LeadsAnalytics leads={leads} />

        <KanbanBoard
          leads={leadsGroupedByStatus}
          statuses={LEAD_STATUSES}
          onDragEnd={handleDragEnd}
          onSelectLead={setSelectedLead}
          getSalespersonName={getSalespersonName}
        />
      </div>

      {selectedLead && (
        <LeadDetailModal
          lead={selectedLead}
          isOpen={!!selectedLead}
          onClose={() => setSelectedLead(null)}
          onUpdate={updateLead}
        />
      )}
    </MainLayout>
  );
}
