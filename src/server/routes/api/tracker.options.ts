import { defineEventHandler, setResponseHeaders } from 'h3';

/** Handle CORS preflight for the tracker endpoint. */
export default defineEventHandler((event) => {
  if (event.node.req.method === 'OPTIONS') {
    setResponseHeaders(event, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    event.node.res.statusCode = 204;
    event.node.res.end();
  }
});
