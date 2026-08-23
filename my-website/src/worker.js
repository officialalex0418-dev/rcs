export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    try {
      // 1. Attempt to serve the requested asset from the binding
      const response = await env.ASSETS.fetch(request);

      // 2. If it's a valid asset (status 200-299), return it
      if (response.ok) {
        return response;
      }

      // 3. SPA Routing Logic:
      // If the request is for a navigation route (like /services, /about)
      // and NOT a direct file request (like .png, .js, .css), serve index.html
      const isFile = url.pathname.includes('.');
      if (!isFile || response.status === 404) {
        // For navigation or missing files that might be handled by the SPA
        if (!isFile) {
           const index = await env.ASSETS.fetch(new Request(new URL('/index.html', url.origin)));
           return new Response(index.body, index);
        }
      }

      return response;
    } catch (e) {
      return new Response("Worker Error: " + e.message, { status: 500 });
    }
  },
};
