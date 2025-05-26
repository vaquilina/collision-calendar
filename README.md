# Collision Calendar

**🚧 IN DEVELOPMENT 🚧**

A FOSS web-based tool for scheduling shared spaces.

This was created to solve two problems:

1. The challenge of scheduling the use of shared, divided spaces, where divisions cannot always be occupied
   simultaneously
2. The process of finding blocks of time that are most agreeable to a group of people

## Data Design

See [DB.md](docs/DB.md)

## Stack

- Runtime: [Deno](https://docs.deno.com/)
- SQLite module: [deno-sqlite](https://deno.land/x/sqlite@v3.9.1)
- Storage layer: [unstorage](https://unstorage.unjs.io/)
  - Driver: [Deno KV](https://docs.deno.com/deploy/kv/manual/)
- Server framework: [Hono](https://hono.dev/docs/)
  - Reqest validation: [Zod validator middleware](https://github.com/honojs/middleware/tree/main/packages/zod-validator)
- Schema validator: [Zod](https://zod.dev/)
- Auth flow: [OpenAuth](https://openauth.js.org/)
- Password hashing: [deno-bcrypt](https://github.com/darkaqua/bcrypt)
- SMTP client: [denomailer](https://github.com/EC-Nordbund/denomailer)
- Client framework: [SolidJS](https://www.solidjs.com/)
