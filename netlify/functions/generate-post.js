// Netlify Function: proxies the Facebook Content Generator page.
//
// Keeps the Apify and Anthropic API keys server-side (set as environment
// variables in the Netlify dashboard: Site settings > Environment variables).
// Never expose these keys in client-side code.
//
// Flow:
//   1. Run the Apify "facebook-posts-scraper" Actor synchronously to pull
//      recent posts from the given Facebook page.
//   2. Send those posts to Claude and ask it to draft one new, original post
//      inspired by their tone and what made them engage well.

const APIFY_ACTOR_RUN_URL =
  'https://api.apify.com/v2/acts/apify~facebook-posts-scraper/run-sync-get-dataset-items';
const ANTHROPIC_MESSAGES_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_MODEL = 'claude-sonnet-5';
const MAX_RESULTS_LIMIT = 10;
const MAX_POSTS_IN_PROMPT = 5;

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed. Use POST.' });
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch (err) {
    return jsonResponse(400, { error: 'Invalid JSON body.' });
  }

  const { facebookUrl, topic, resultsLimit } = body;

  if (!facebookUrl || typeof facebookUrl !== 'string' || !/^https?:\/\/(www\.)?facebook\.com\//i.test(facebookUrl.trim())) {
    return jsonResponse(400, { error: 'A valid Facebook page URL is required (e.g. https://www.facebook.com/somepage/).' });
  }

  const APIFY_API_TOKEN = process.env.APIFY_API_TOKEN;
  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

  if (!APIFY_API_TOKEN || !ANTHROPIC_API_KEY) {
    console.error('Missing APIFY_API_TOKEN or ANTHROPIC_API_KEY environment variable.');
    return jsonResponse(500, { error: 'Server is not configured with the required API keys.' });
  }

  const safeResultsLimit = Math.min(Math.max(parseInt(resultsLimit, 10) || 5, 1), MAX_RESULTS_LIMIT);

  try {
    const posts = await scrapeFacebookPosts(facebookUrl.trim(), safeResultsLimit, APIFY_API_TOKEN);

    if (!posts.length) {
      return jsonResponse(200, {
        posts: [],
        generatedPost: null,
        message: 'No posts were found for this page. Try a different page URL.',
      });
    }

    const generatedPost = await draftPostWithClaude(posts, topic, ANTHROPIC_API_KEY);

    return jsonResponse(200, {
      posts: posts.map(summarizePost),
      generatedPost,
    });
  } catch (err) {
    console.error('generate-post function failed:', err);
    return jsonResponse(502, { error: err.message || 'Something went wrong while generating the post.' });
  }
};

async function scrapeFacebookPosts(facebookUrl, resultsLimit, apifyToken) {
  const response = await fetch(`${APIFY_ACTOR_RUN_URL}?token=${encodeURIComponent(apifyToken)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      startUrls: [{ url: facebookUrl }],
      resultsLimit,
    }),
  });

  if (!response.ok) {
    const errText = await safeText(response);
    throw new Error(`Apify request failed (${response.status}): ${errText}`);
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

async function draftPostWithClaude(posts, topic, anthropicKey) {
  const sourceText = posts
    .slice(0, MAX_POSTS_IN_PROMPT)
    .map((post, index) => {
      const text = (post.text || '(no text)').slice(0, 1200);
      return `Post ${index + 1}:\n${text}\nEngagement — likes: ${post.likes ?? 0}, comments: ${post.comments ?? 0}, shares: ${post.shares ?? 0}`;
    })
    .join('\n\n---\n\n');

  const topicLine = topic && String(topic).trim() ? ` about "${String(topic).trim()}"` : '';

  const prompt = `You are a social media copywriter. Below are recent public Facebook posts scraped from a page${topicLine}. Study their tone, structure, and what made them engaging, then write ONE brand-new, original social media post inspired by these patterns. Do not copy sentences verbatim — create genuinely new content. Keep it concise and ready to publish.

${sourceText}

Write the new post now (post text only, no preamble):`;

  const response = await fetch(ANTHROPIC_MESSAGES_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': anthropicKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: ANTHROPIC_MODEL,
      max_tokens: 600,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    const errText = await safeText(response);
    throw new Error(`Anthropic request failed (${response.status}): ${errText}`);
  }

  const data = await response.json();
  return data?.content?.[0]?.text?.trim() || '';
}

function summarizePost(post) {
  return {
    text: post.text || '',
    likes: post.likes ?? 0,
    comments: post.comments ?? 0,
    shares: post.shares ?? 0,
    url: post.url || post.topLevelUrl || '',
    time: post.time || '',
  };
}

async function safeText(response) {
  try {
    return await response.text();
  } catch (err) {
    return '(no response body)';
  }
}

function jsonResponse(statusCode, payload) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  };
}
