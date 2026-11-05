// Vercel Serverless Function: GET /api/scopus
// Proxies requests to Elsevier Scopus Search API using the user's Scopus API key

const DEFAULT_SCOPUS_API_KEY = 'c4c5b696cfd9e5c3ad43a784c60b75a5';

export default async function handler(req, res) {
  // Enable CORS for dashboard client
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-ELS-APIKey, x-scopus-key');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const apiKey = req.headers['x-scopus-key'] || req.query.apiKey || DEFAULT_SCOPUS_API_KEY;
  const rawQuery = req.query.query || 'TITLE-ABS-KEY(titanium AND "additive manufacturing")';
  const count = Math.min(25, Math.max(1, parseInt(req.query.count, 10) || 10));
  const start = Math.max(0, parseInt(req.query.start, 10) || 0);
  const sort = req.query.sort || '-citedby-count';

  const scopusUrl = `https://api.elsevier.com/content/search/scopus?query=${encodeURIComponent(
    rawQuery
  )}&count=${count}&start=${start}&sort=${encodeURIComponent(sort)}`;

  try {
    const scopusRes = await fetch(scopusUrl, {
      headers: {
        'X-ELS-APIKey': apiKey,
        'Accept': 'application/json',
      },
    });

    if (!scopusRes.ok) {
      const errText = await scopusRes.text();
      return res.status(scopusRes.status).json({
        error: `Scopus API error (${scopusRes.status}): ${scopusRes.statusText}`,
        details: errText,
      });
    }

    const data = await scopusRes.json();
    const searchResults = data['search-results'] || {};
    const totalResults = parseInt(searchResults['opensearch:totalResults'] || '0', 10);
    const rawEntries = searchResults['entry'] || [];

    // Transform Scopus raw XML-JSON entry format into clean client-friendly objects
    const papers = rawEntries.map((e, index) => {
      const doi = e['prism:doi'] || '';
      const scopusId = e['dc:identifier']?.replace('SCOPUS_ID:', '') || `scopus-${start + index}`;
      const url = doi
        ? `https://doi.org/${doi}`
        : e['link']?.find((l) => l['@ref'] === 'scopus')?.['@href'] || `https://www.scopus.com`;

      return {
        id: scopusId,
        title: e['dc:title'] || 'Untitled Publication',
        authors: e['dc:creator'] || 'Unknown Author',
        journal: e['prism:publicationName'] || 'Peer-Reviewed Journal',
        year: e['prism:coverDate'] ? parseInt(e['prism:coverDate'].slice(0, 4), 10) : 2024,
        date: e['prism:coverDate'] || '',
        doi,
        url,
        citations: parseInt(e['citedby-count'] || '0', 10),
        affiliation: e['affiliation']?.[0]?.['affilname'] || '',
        affiliationCity: e['affiliation']?.[0]?.['affiliation-city'] || '',
        affiliationCountry: e['affiliation']?.[0]?.['affiliation-country'] || '',
        volume: e['prism:volume'] || '',
        issueIdentifier: e['prism:issueIdentifier'] || '',
        pageRange: e['prism:pageRange'] || '',
        openAccess: e['openaccessFlag'] === 'true' || e['openaccess'] === '1',
      };
    });

    return res.status(200).json({
      success: true,
      query: rawQuery,
      totalResults,
      count: papers.length,
      start,
      papers,
    });
  } catch (err) {
    console.error('Scopus proxy error:', err);
    return res.status(500).json({
      error: 'Failed to communicate with Elsevier Scopus API',
      message: err.message,
    });
  }
}
