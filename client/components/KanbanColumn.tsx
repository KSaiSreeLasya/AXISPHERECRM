import { Lead, LeadStatus } from "@/hooks/useCRMStore";
import { KanbanLeadCard } from "./KanbanLeadCard";

const COLUMN_BG_COLORS: Record<LeadStatus, string> = {
  "No Stage": "bg-gray-50 border-gray-200",
  "Appointment Schedule": "bg-blue-50 border-blue-200",
  "Presentation Done": "bg-purple-50 border-purple-200",
  Proposal: "bg-yellow-50 border-yellow-200",
  Negotiation: "bg-orange-50 border-orange-200",
  Evaluation: "bg-amber-50 border-amber-200",
  Result: "bg-green-50 border-green-200",
};

interface KanbanColumnProps {
  status: LeadStatus;
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
  getSalespersonName: (assignedTo?: string) => string;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, status: LeadStatus) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, leadId: string) => void;
}

export function KanbanColumn({
  status,
  leads,
  onSelectLead,
  getSalespersonName,
  onDragOver,
  onDrop,
  onDragStart,
}: KanbanColumnProps) {
  return (
    <div
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, status)}
      className={`flex flex-col rounded-lg border-2 ${COLUMN_BG_COLORS[status]} min-h-96 max-h-[calc(100vh-280px)] overflow-hidden`}
    >
      <div className="bg-white border-b border-slate-200 px-3 py-2 flex items-center justify-between sticky top-0">
        <h2 className="font-semibold text-slate-900 text-xs truncate">{status}</h2>
        <span className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded-full text-xs font-semibold flex-shrink-0">
          {leads.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {leads.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-center">
            <p className="text-slate-500 text-xs">Drag to add</p>
          </div>
        ) : (
          leads.map((lead) => (
            <KanbanLeadCard
              key={lead.id}
              lead={lead}
              onSelect={onSelectLead}
              getSalespersonName={getSalespersonName}
              onDragStart={onDragStart}
            />
          ))
        )}
      </div>
    </div>
  );
}
