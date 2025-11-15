import { RequestHandler } from "express";

const APOLLO_BASE_URL = "https://api.apollo.io/v1";

export const handleGetCompanies: RequestHandler = async (req, res) => {
  try {
    const APOLLO_API_KEY = process.env.VITE_APOLLO_API_KEY;
    if (!APOLLO_API_KEY) {
      console.error("Missing VITE_APOLLO_API_KEY environment variable");
      console.error("Available env vars:", Object.keys(process.env).filter(k => k.includes('APOLLO')));
      return res.status(500).json({
        error: "Apollo API key not configured",
        availableVars: Object.keys(process.env).filter(k => k.includes('APOLLO')),
      });
    }

    console.log(`[Companies API] Using API key: ${APOLLO_API_KEY.substring(0, 10)}...`);

    // Get pagination parameters from query string
    const limit = Math.min(Math.max(parseInt(req.query.limit as string) || 100, 1), 500);
    const page = Math.max(parseInt(req.query.page as string) || 1, 1);

    console.log(`[Companies API] Fetching saved companies with limit=${limit}, page=${page}`);

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${APOLLO_API_KEY}`,
    };

    // First, fetch bookmarks (saved companies)
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

    console.log(`[Companies API] Response status: ${bookmarksResponse.status}`);
    const errorText = await bookmarksResponse.text();

    if (!bookmarksResponse.ok) {
      console.error(`[Companies API] Bookmarks API error: ${bookmarksResponse.status} - ${errorText}`);
      return res.status(bookmarksResponse.status).json({
        error: "Failed to fetch saved companies from Apollo",
        status: bookmarksResponse.status,
        details: errorText,
      });
    }

    let bookmarksData;
    try {
      bookmarksData = JSON.parse(errorText);
    } catch (e) {
      console.error("[Companies API] Failed to parse response:", errorText);
      return res.status(500).json({
        error: "Invalid response from Apollo API",
        details: errorText,
      });
    }

    const bookmarks = bookmarksData.bookmarks || [];

    console.log(`[Companies API] Fetched ${bookmarks.length} bookmarks`);

    // Map bookmarks to company format
    const companies = bookmarks
      .map((bookmark: any) => mapBookmarkToCompany(bookmark))
      .filter((c): c is any => c !== null);

    res.json({
      companies,
      total: bookmarksData.pagination?.total_entries || companies.length,
      page,
      limit,
      hasMore: bookmarksData.pagination?.total_pages ? page < bookmarksData.pagination.total_pages : false,
    });
  } catch (error) {
    console.error("Companies API error:", error);
    res.status(500).json({
      error: "Failed to fetch companies",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

function mapOrganizationToCompany(org: any) {
  return {
    id: org.id || org.organization_id,
    name: org.name,
    domain: org.domain,
    industry: org.industry,
    employeeCount: org.employee_count,
    employeeCountRange: org.employee_count_range,
    revenue: org.revenue,
    revenueRange: org.revenue_range,
    logoUrl: org.logo_url,
    linkedinUrl: org.linkedin_url,
    crunchbaseUrl: org.crunchbase_url,
    foundedYear: org.founded_year,
    hqAddress: org.hq_address,
    countries: org.countries,
    website: org.website,
    phone: org.phone,
    apolloProfileUrl: org.apollo_url,
  };
}

function mapBookmarkToCompany(bookmark: any) {
  return {
    id: bookmark.organization_id || bookmark.id,
    name: bookmark.organization_name || bookmark.name,
    domain: bookmark.domain,
    industry: bookmark.industry,
    employeeCount: bookmark.employee_count,
    employeeCountRange: bookmark.employee_count_range,
    revenue: bookmark.revenue,
    revenueRange: bookmark.revenue_range,
    logoUrl: bookmark.logo_url,
    linkedinUrl: bookmark.linkedin_url,
    crunchbaseUrl: bookmark.crunchbase_url,
    foundedYear: bookmark.founded_year,
    hqAddress: bookmark.hq_address,
    countries: bookmark.countries,
    website: bookmark.website,
    phone: bookmark.phone,
    apolloProfileUrl: bookmark.apollo_url,
  };
}
