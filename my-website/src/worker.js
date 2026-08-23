export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    try {
      // 1. Attempt to serve the requested asset
      const response = await env.ASSETS.fetch(request);

      // 2. If it's a real file (has an extension) and it's a 404, return it
      if (response.status === 404 && url.pathname.includes('.')) {
        return response;
      }

      // 3. If it's a 404 or a navigation request, serve index.html (SPA routing)
      if (response.status === 404 || !url.pathname.includes('.')) {
        const indexResponse = await env.ASSETS.fetch(new Request(new URL('/index.html', url.origin)));
        return new Response(indexResponse.body, indexResponse);
      }

      return response;
    } catch (e) {
      return new Response("RCS Worker Error: " + e.message, { status: 500 });
    }
  },
};
