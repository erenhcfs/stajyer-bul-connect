import { handleAdminRequest } from "./admin.server.js";
// Vercel's current Node runtime invokes Web-standard fetch handlers directly.
// Keeping Request/Response untouched also preserves cookies and streaming safely.
export default {
    async fetch(request) {
        return (await handleAdminRequest(request)) ?? new Response(null, { status: 404 });
    },
};
