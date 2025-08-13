// Polyfill fetch/Request/Response for Jest (Node env)
import { fetch, Request, Response, Headers } from 'undici';

// @ts-ignore
global.fetch = fetch as any;
// @ts-ignore
global.Request = Request as any;
// @ts-ignore
global.Response = Response as any;
// @ts-ignore
global.Headers = Headers as any;

