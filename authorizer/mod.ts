import { Issuer } from './lib/issuer.ts';

Deno.serve(Issuer.fetch);
