import { useState, useCallback } from "react";

export interface Lead {
  id: string;
  name: string;
  jobTitle: string;
  company: string;
  email: string;
  phoneNumbers: string[];
  actions: string[];
  links: string[];
  locations: string[];
  companyEmployees: string;
  companyIndustries: string[];
  companyKeywords: string[];
  createdAt: string;
}

export interface Salesperson {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  createdAt: string;
}

const LEADS_STORAGE_KEY = "crm_leads";
const SALESPERSONS_STORAGE_KEY = "crm_salespersons";

function getStoredLeads(): Lead[] {
  try {
    const stored = localStorage.getItem(LEADS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function getStoredSalespersons(): Salesperson[] {
  try {
    const stored = localStorage.getItem(SALESPERSONS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function useCRMStore() {
  const [leads, setLeads] = useState<Lead[]>(getStoredLeads());
  const [salespersons, setSalespersons] = useState<Salesperson[]>(
    getStoredSalespersons()
  );

  const addLead = useCallback((lead: Omit<Lead, "id" | "createdAt">) => {
    const newLead: Lead = {
      ...lead,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    const updated = [...leads, newLead];
    setLeads(updated);
    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(updated));
    return newLead;
  }, [leads]);

  const updateLead = useCallback((id: string, updates: Partial<Lead>) => {
    const updated = leads.map((lead) =>
      lead.id === id ? { ...lead, ...updates } : lead
    );
    setLeads(updated);
    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(updated));
  }, [leads]);

  const deleteLead = useCallback((id: string) => {
    const updated = leads.filter((lead) => lead.id !== id);
    setLeads(updated);
    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(updated));
  }, [leads]);

  const addSalesperson = useCallback(
    (salesperson: Omit<Salesperson, "id" | "createdAt">) => {
      const newSalesperson: Salesperson = {
        ...salesperson,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      const updated = [...salespersons, newSalesperson];
      setSalespersons(updated);
      localStorage.setItem(SALESPERSONS_STORAGE_KEY, JSON.stringify(updated));
      return newSalesperson;
    },
    [salespersons]
  );

  const updateSalesperson = useCallback(
    (id: string, updates: Partial<Salesperson>) => {
      const updated = salespersons.map((sp) =>
        sp.id === id ? { ...sp, ...updates } : sp
      );
      setSalespersons(updated);
      localStorage.setItem(SALESPERSONS_STORAGE_KEY, JSON.stringify(updated));
    },
    [salespersons]
  );

  const deleteSalesperson = useCallback((id: string) => {
    const updated = salespersons.filter((sp) => sp.id !== id);
    setSalespersons(updated);
    localStorage.setItem(SALESPERSONS_STORAGE_KEY, JSON.stringify(updated));
  }, [salespersons]);

  return {
    leads,
    salespersons,
    addLead,
    updateLead,
    deleteLead,
    addSalesperson,
    updateSalesperson,
    deleteSalesperson,
  };
}
