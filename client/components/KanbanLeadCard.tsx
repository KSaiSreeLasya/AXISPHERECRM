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
      className="bg-white border border-slate-200 rounded-lg p-3 cursor-grab active:cursor-grabbing hover:border-blue-400 hover:shadow-md transition-all group"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold text-slate-900 flex-1 truncate text-xs leading-tight">
          {lead.name}
        </h3>
        <GripVertical className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5" />
      </div>

      <div className="space-y-1 text-xs mb-2">
        {lead.company && (
          <div className="line-clamp-1">
            <p className="text-slate-500 font-medium text-[10px]">Company</p>
            <p className="text-slate-900 truncate text-xs">{lead.company}</p>
          </div>
        )}
        {lead.jobTitle && (
          <div className="line-clamp-1">
            <p className="text-slate-500 font-medium text-[10px]">Position</p>
            <p className="text-slate-900 truncate text-xs">{lead.jobTitle}</p>
          </div>
        )}
      </div>

      <div className="pt-2 border-t border-slate-100">
        <span className="text-[10px] text-slate-600 truncate block">
          {getSalespersonName(lead.assignedTo)}
        </span>
      </div>
    </div>
  );
}
