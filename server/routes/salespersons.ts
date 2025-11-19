import { RequestHandler } from "express";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

// Create Supabase client with service role key (bypasses RLS)
const serverSupabaseAdmin =
  supabaseUrl && supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey)
    : null;

/* =========================================================
   DELETE SALESPERSON
========================================================= */
export const handleDeleteSalesperson: RequestHandler = async (req, res) => {
  try {
    if (!serverSupabaseAdmin) {
      console.error("Delete Salesperson Error: Supabase admin client not initialized");
      return res.status(500).json({
        error: "Server configuration error",
        details: "Missing Supabase service role key",
      });
    }

    const { salespersonId } = req.body;

    if (!salespersonId) {
      return res.status(400).json({
        error: "Salesperson ID is required",
      });
    }

    console.log("[DeleteSalesperson] Attempting to delete:", salespersonId);

    // First, update all leads assigned to this salesperson to null
    const { error: leadsError } = await serverSupabaseAdmin
      .from("leads")
      .update({ assigned_to: null })
      .eq("assigned_to", salespersonId);

    if (leadsError) {
      console.error("[DeleteSalesperson] Error updating leads:", leadsError);
      return res.status(400).json({
        error: "Failed to update associated leads",
        details: leadsError.message,
      });
    }

    // Then delete the salesperson
    const { error: spError } = await serverSupabaseAdmin
      .from("salespersons")
      .delete()
      .eq("id", salespersonId);

    if (spError) {
      console.error("[DeleteSalesperson] Error deleting salesperson:", spError);
      return res.status(400).json({
        error: "Failed to delete salesperson",
        details: spError.message,
      });
    }

    console.log("[DeleteSalesperson] Successfully deleted:", salespersonId);
    return res.json({ success: true });
  } catch (err) {
    console.error("[DeleteSalesperson] Exception:", err);
    return res.status(500).json({
      error: "Failed to delete salesperson",
      details: err instanceof Error ? err.message : "Unknown error",
    });
  }
};

/* =========================================================
   UPDATE SALESPERSON
========================================================= */
export const handleUpdateSalesperson: RequestHandler = async (req, res) => {
  try {
    if (!serverSupabaseAdmin) {
      console.error("Update Salesperson Error: Supabase admin client not initialized");
      return res.status(500).json({
        error: "Server configuration error",
        details: "Missing Supabase service role key",
      });
    }

    const { salespersonId, updates } = req.body;

    if (!salespersonId) {
      return res.status(400).json({
        error: "Salesperson ID is required",
      });
    }

    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({
        error: "No updates provided",
      });
    }

    console.log("[UpdateSalesperson] Attempting to update:", salespersonId);

    // Map frontend field names to database column names
    const updateData: any = {};
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.email !== undefined) updateData.email = updates.email;
    if (updates.phoneNumber !== undefined)
      updateData.phone_number = updates.phoneNumber;

    const { error } = await serverSupabaseAdmin
      .from("salespersons")
      .update(updateData)
      .eq("id", salespersonId);

    if (error) {
      console.error("[UpdateSalesperson] Error updating:", error);
      return res.status(400).json({
        error: "Failed to update salesperson",
        details: error.message,
      });
    }

    console.log("[UpdateSalesperson] Successfully updated:", salespersonId);
    return res.json({ success: true });
  } catch (err) {
    console.error("[UpdateSalesperson] Exception:", err);
    return res.status(500).json({
      error: "Failed to update salesperson",
      details: err instanceof Error ? err.message : "Unknown error",
    });
  }
};
