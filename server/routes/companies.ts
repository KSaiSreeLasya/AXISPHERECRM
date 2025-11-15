import { RequestHandler } from "express";

const APOLLO_BASE_URL = "https://api.apollo.io/v1";

export const handleGetCompanies: RequestHandler = async (req, res) => {
  try {
    const APOLLO_API_KEY = process.env.VITE_APOLLO_API_KEY;
    
    if (!APOLLO_API_KEY) {
      console.error("Missing VITE_APOLLO_API_KEY environment variable");
      return res.status(500).json({
        error: "Apollo API key not configured",
      });
    }

    // Get pagination parameters from query string
    const limit = Math.min(Math.max(parseInt(req.query.limit as string) || 100, 1), 500);
    const page = Math.max(parseInt(req.query.page as string) || 1, 1);

    console.log(`[Companies API] Fetching saved companies with limit=${limit}, page=${page}`);

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${APOLLO_API_KEY}`,
    };

    // Fetch bookmarks (saved companies) from Apollo.io
    const bookmarksUrl = `${APOLLO_BASE_URL}/bookmarks`;
    console.log(`[Companies API] Calling ${bookmarksUrl}`);
    
    const bookmarksResponse = await fetch(bookmarksUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({
        limit,
        page,
        type: "organization",
      }),
    });

    if (!bookmarksResponse.ok) {
      const errorText = await bookmarksResponse.text();
      console.error(`[Companies API] Apollo bookmarks error: ${bookmarksResponse.status}`);
      console.error(`[Companies API] Error response: ${errorText}`);
      
      // Return empty list with helpful error message
      if (bookmarksResponse.status === 404) {
        return res.json({
          companies: [],
          total: 0,
          page,
          limit,
          hasMore: false,
          error: "No saved companies found or API endpoint not available",
        });
      }
      
      return res.status(bookmarksResponse.status).json({
        error: "Failed to fetch saved companies from Apollo",
        status: bookmarksResponse.status,
      });
    }

    const responseText = await bookmarksResponse.text();
    let bookmarksData;
    
    try {
      bookmarksData = JSON.parse(responseText);
    } catch (e) {
      console.error("[Companies API] Failed to parse response:", responseText);
      return res.status(500).json({
        error: "Invalid response from Apollo API",
      });
    }

    const bookmarks = bookmarksData.bookmarks || [];
    console.log(`[Companies API] Fetched ${bookmarks.length} bookmarks`);

    // Map bookmarks to company format
    const companies = bookmarks
      .filter((b: any) => b && b.organization_id)
      .map((bookmark: any) => ({
        id: bookmark.organization_id,
        name: bookmark.organization_name || bookmark.name || "",
        domain: bookmark.domain || "",
        industry: bookmark.industry || "",
        employeeCount: bookmark.employee_count,
        employeeCountRange: bookmark.employee_count_range || "",
        revenue: bookmark.revenue,
        revenueRange: bookmark.revenue_range || "",
        logoUrl: bookmark.logo_url || "",
        linkedinUrl: bookmark.linkedin_url || "",
        crunchbaseUrl: bookmark.crunchbase_url || "",
        foundedYear: bookmark.founded_year,
        hqAddress: bookmark.hq_address || "",
        countries: bookmark.countries || [],
        website: bookmark.website || "",
        phone: bookmark.phone || "",
        apolloProfileUrl: bookmark.apollo_url || "",
      }));

    res.json({
      companies,
      total: bookmarksData.pagination?.total_entries || companies.length,
      page,
      limit,
      hasMore: bookmarksData.pagination?.total_pages ? page < bookmarksData.pagination.total_pages : false,
    });
  } catch (error) {
    console.error("[Companies API] Unexpected error:", error);
    res.status(500).json({
      error: "Failed to fetch companies",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
