import { RequestHandler } from "express";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Debug: log if keys are loaded
console.log("[Salespersons Route] Supabase URL loaded:", !!supabaseUrl);
console.log("[Salespersons Route] Service Role Key loaded:", !!supabaseServiceKey);

if (!supabaseUrl) {
  console.error("Missing VITE_SUPABASE_URL on server");
}

// Create server-side Supabase client with service role key (bypasses RLS)
const adminSupabase =
  supabaseUrl && supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey)
    : null;

export const handleDeleteSalesperson: RequestHandler = async (req, res) => {
  try {
    if (!adminSupabase) {
      return res.status(500).json({
        error: "Server configuration error: service role key not configured",
        details: "SUPABASE_SERVICE_ROLE_KEY is not set",
      });
    }

    const { salespersonId } = req.body;

    if (!salespersonId) {
      return res.status(400).json({
        error: "Missing required field: salespersonId",
      });
    }

    // First, delete all leads assigned to this salesperson
    const { error: leadsError } = await adminSupabase
      .from("leads")
      .delete()
      .eq("assigned_to", salespersonId);

    if (leadsError) {
      console.error("Error deleting leads for salesperson:", leadsError);
      return res.status(400).json({
        error: "Failed to delete leads assigned to salesperson",
        details: leadsError.message,
      });
    }

    // Then delete the salesperson record
    const { error: salespersonError } = await adminSupabase
      .from("salespersons")
      .delete()
      .eq("id", salespersonId);

    if (salespersonError) {
      console.error("Error deleting salesperson:", salespersonError);
      return res.status(400).json({
        error: "Failed to delete salesperson",
        details: salespersonError.message,
      });
    }

    res.json({
      success: true,
      message: "Salesperson deleted successfully",
    });
  } catch (error) {
    console.error("Salesperson delete error:", error);
    res.status(500).json({
      error: error instanceof Error ? error.message : "Salesperson deletion failed",
    });
  }
};
