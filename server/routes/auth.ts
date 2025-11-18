import { RequestHandler } from "express";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Missing Supabase environment variables on server");
  console.error("  VITE_SUPABASE_URL:", supabaseUrl ? "SET" : "MISSING");
  console.error("  VITE_SUPABASE_ANON_KEY:", supabaseAnonKey ? "SET" : "MISSING");
}

if (!supabaseServiceKey) {
  console.warn("⚠️  Missing VITE_SUPABASE_SERVICE_ROLE_KEY - RLS bypass will not work");
}

// Create Supabase client with anon key
const serverSupabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// Create Supabase client with service role key (bypasses RLS)
const serverSupabaseAdmin =
  supabaseUrl && supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey)
    : null;

/* =========================================================
   🔐 SIGN IN
========================================================= */
export const handleAuthSignIn: RequestHandler = async (req, res) => {
  try {
    if (!serverSupabase) {
      return res.status(500).json({ error: "Server configuration error" });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are required" });
    }

    const { data, error } = await serverSupabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({ error: error.message });
    }

    return res.json({
      user: data.user,
      session: data.session,
    });
  } catch (err) {
    return res.status(500).json({
      error: err instanceof Error ? err.message : "Sign in failed",
    });
  }
};

/* =========================================================
   🆕 SIGN UP  (UPDATED + FIXED)
========================================================= */
export const handleAuthSignUp: RequestHandler = async (req, res) => {
  try {
    if (!serverSupabase) {
      console.error("Sign Up Error: Supabase client not initialized");
      return res.status(500).json({ error: "Server configuration error" });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are required" });
    }

    console.log("[SignUp] Creating auth user for:", email);
    const { data, error } = await serverSupabase.auth.signUp({
      email,
      password,
    });

    // Supabase returns this when the person already signed up earlier
    if (error?.message?.includes("already registered")) {
      console.log("[SignUp] Email already registered:", email);
      return res.status(409).json({
        error: "Email already registered",
      });
    }

    if (error) {
      console.error("[SignUp] Auth error:", error);
      return res.status(400).json({ error: error.message });
    }

    console.log("[SignUp] Auth user created:", data?.user?.id);

    // 💯 Always return VALID JSON (important fix!)
    const responseData = {
      user: data?.user || null,
      session: data?.session || null,
    };

    console.log("[SignUp] Returning response:", {
      user: responseData.user?.id,
      hasSession: !!responseData.session,
    });

    return res.json(responseData);
  } catch (err) {
    console.error("[SignUp] Exception:", err);
    return res.status(500).json({
      error: "Signup failed",
      details: err instanceof Error ? err.message : "Unknown error",
    });
  }
};

/* =========================================================
   🚪 SIGN OUT
========================================================= */
export const handleAuthSignOut: RequestHandler = async (req, res) => {
  try {
    if (!serverSupabase) {
      return res.status(500).json({ error: "Server configuration error" });
    }

    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(400).json({ error: "No authorization token" });
    }

    const { data, error } = await serverSupabase.auth.getUser(token);

    if (error || !data?.user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const { error: signOutError } = await serverSupabase.auth.signOut();

    if (signOutError) {
      return res.status(400).json({ error: signOutError.message });
    }

    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({
      error: err instanceof Error ? err.message : "Sign out failed",
    });
  }
};

/* =========================================================
   🔄 SESSION CHECK
========================================================= */
export const handleAuthSession: RequestHandler = async (req, res) => {
  try {
    if (!serverSupabase) {
      return res.status(500).json({ error: "Server configuration error" });
    }

    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.json({ session: null });
    }

    const { data, error } = await serverSupabase.auth.getUser(token);

    if (error || !data?.user) {
      return res.json({ session: null });
    }

    return res.json({ user: data.user });
  } catch (err) {
    return res.status(500).json({
      error: err instanceof Error ? err.message : "Session check failed",
    });
  }
};
