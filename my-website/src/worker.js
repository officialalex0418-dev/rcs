export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    try {
      // 1. Attempt to serve the requested asset
      // The ASSETS binding is automatically created when using the [assets] configuration in wrangler.toml
      const response = await env.ASSETS.fetch(request);

      // 2. If the asset exists and is not a 404, return it
      if (response.status !== 404) {
        return response;
      }

      // 3. SPA Routing: If it's a 404 but looks like a navigation request (no file extension), serve index.html
      const isFileRequest = url.pathname.includes('.');
      if (!isFileRequest) {
        // Fetch index.html from assets and serve it
        return await env.ASSETS.fetch(new Request(new URL('/index.html', url.origin)));
      }

      // 4. Otherwise, return the original 404
      return response;
    } catch (e) {
      return new Response("Error serving asset: " + e.message, { status: 500 });
    }
  },
};
