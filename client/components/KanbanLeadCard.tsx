import { Lead, LeadStatus } from "@/hooks/useCRMStore";
import { GripVertical } from "lucide-react";

const STATUS_COLORS: Record<LeadStatus, string> = {
  "No Stage": "bg-gray-100 text-gray-800",
  "Appointment Schedule": "bg-blue-100 text-blue-800",
  "Presentation Done": "bg-purple-100 text-purple-800",
  Proposal: "bg-yellow-100 text-yellow-800",
  Negotiation: "bg-orange-100 text-orange-800",
  Evaluation: "bg-amber-100 text-amber-800",
  Result: "bg-green-100 text-green-800",
};

interface KanbanLeadCardProps {
  lead: Lead;
  onSelect: (lead: Lead) => void;
  getSalespersonName: (assignedTo?: string) => string;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, leadId: string) => void;
}

export function KanbanLeadCard({
  lead,
  onSelect,
  getSalespersonName,
  onDragStart,
}: KanbanLeadCardProps) {
  const status = (lead.status || "No Stage") as LeadStatus;

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, lead.id)}
      onClick={() => onSelect(lead)}
      className="bg-white border border-slate-200 rounded-lg p-4 cursor-grab active:cursor-grabbing hover:border-blue-400 hover:shadow-md transition-all group"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold text-slate-900 flex-1 truncate text-sm">
          {lead.name}
        </h3>
        <GripVertical className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
      </div>

      <div className="flex items-center justify-between mb-3">
        <span
          className={`px-2 py-0.5 rounded text-xs font-medium flex-shrink-0 ${STATUS_COLORS[status]}`}
        >
          {status}
        </span>
      </div>

      <div className="space-y-2 text-xs mb-3">
        {lead.company && (
          <div>
            <p className="text-slate-600 font-medium">Company</p>
            <p className="text-slate-900 truncate">{lead.company}</p>
          </div>
        )}
        {lead.jobTitle && (
          <div>
            <p className="text-slate-600 font-medium">Position</p>
            <p className="text-slate-900 truncate">{lead.jobTitle}</p>
          </div>
        )}
      </div>

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs text-slate-600 truncate">
          Assigned: {getSalespersonName(lead.assignedTo)}
        </span>
      </div>
    </div>
  );
}
