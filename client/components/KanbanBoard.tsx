import { useState } from "react";
import { Lead, LeadStatus } from "@/hooks/useCRMStore";
import { KanbanColumn } from "./KanbanColumn";

interface KanbanBoardProps {
  leads: Record<LeadStatus, Lead[]>;
  statuses: LeadStatus[];
  onDragEnd: (
    leadId: string,
    newStatus: LeadStatus,
    oldStatus: LeadStatus,
  ) => void;
  onSelectLead: (lead: Lead) => void;
  getSalespersonName: (assignedTo?: string) => string;
}

export function KanbanBoard({
  leads,
  statuses,
  onDragEnd,
  onSelectLead,
  getSalespersonName,
}: KanbanBoardProps) {
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
  const [draggedFromStatus, setDraggedFromStatus] = useState<LeadStatus | null>(
    null,
  );

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    leadId: string,
  ) => {
    setDraggedLeadId(leadId);

    const lead = findLeadInStatus(leadId);
    if (lead) {
      const status = (lead.status || "No Stage") as LeadStatus;
      setDraggedFromStatus(status);
      e.dataTransfer.effectAllowed = "move";
    }
  };

  const findLeadInStatus = (leadId: string): Lead | undefined => {
    for (const status of statuses) {
      const lead = leads[status].find((l) => l.id === leadId);
      if (lead) return lead;
    }
    return undefined;
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    toStatus: LeadStatus,
  ) => {
    e.preventDefault();

    if (!draggedLeadId || !draggedFromStatus) return;

    if (draggedFromStatus !== toStatus) {
      onDragEnd(draggedLeadId, toStatus, draggedFromStatus);
    }

    setDraggedLeadId(null);
    setDraggedFromStatus(null);
  };

  return (
    <div className="w-full pb-4">
      <div
        className="grid gap-3"
        style={{
          gridTemplateColumns: `repeat(${statuses.length}, minmax(180px, 1fr))`,
        }}
      >
        {statuses.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            leads={leads[status]}
            onSelectLead={onSelectLead}
            getSalespersonName={getSalespersonName}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragStart={handleDragStart}
          />
        ))}
      </div>
    </div>
  );
}
