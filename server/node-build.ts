import path from "path";
import { createServer } from "./index";
import * as express from "express";

// Log environment setup
console.log("Starting Fusion server...");
console.log("Environment variables:");
console.log(`  NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`  PORT: ${process.env.PORT || 3000}`);
console.log(`  VITE_SUPABASE_URL: ${process.env.VITE_SUPABASE_URL ? "✓ Set" : "✗ MISSING"}`);
console.log(`  VITE_SUPABASE_ANON_KEY: ${process.env.VITE_SUPABASE_ANON_KEY ? "✓ Set" : "✗ MISSING"}`);
console.log(`  SUPABASE_SERVICE_ROLE_KEY: ${process.env.SUPABASE_SERVICE_ROLE_KEY ? "✓ Set" : "✗ MISSING"}`);

const app = createServer();
const port = process.env.PORT || 3000;

// In production, serve the built SPA files
const __dirname = import.meta.dirname;
const distPath = path.join(__dirname, "../spa");

// Serve static files
app.use(express.static(distPath));

// Handle React Router - serve index.html for all non-API routes
app.get("*", (req, res) => {
  // Don't serve index.html for API routes
  if (req.path.startsWith("/api/") || req.path.startsWith("/health")) {
    return res.status(404).json({ error: "API endpoint not found" });
  }

  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(port, () => {
  console.log(`🚀 Fusion Starter server running on port ${port}`);
  console.log(`📱 Frontend: http://localhost:${port}`);
  console.log(`🔧 API endpoints available:`);
  console.log(`  - POST /api/auth/sign-in`);
  console.log(`  - POST /api/auth/sign-up`);
  console.log(`  - POST /api/leads/update`);
  console.log(`  - POST /api/salespersons/delete`);
  console.log(`  - GET /api/companies`);
  console.log(`  - POST /api/sync-companies`);

  if (!process.env.VITE_SUPABASE_URL || !process.env.VITE_SUPABASE_ANON_KEY) {
    console.error("⚠️  WARNING: Supabase environment variables are not set!");
    console.error("   Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable API functionality");
  }
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("🛑 Received SIGTERM, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("🛑 Received SIGINT, shutting down gracefully");
  process.exit(0);
});
