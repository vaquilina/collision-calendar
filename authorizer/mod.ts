import issuer from './lib/issuer.ts';

Deno.serve(issuer.fetch);
