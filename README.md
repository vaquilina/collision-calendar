# Collision Calendar

A FOSS, web-based tool for scheduling shared spaces.

**🚧 IN DEVELOPMENT 🚧**

## Task List

- [ ] Finalize data design
- [ ] Server
  - [ ] Auth/Permissions
    - [ ] Signup
    - [ ] Log in/out
    - [ ] Auth middleware
    - [ ] Permissions middleware
    - [ ] Invites
  - [ ] DB locks/connection pooling
  - [ ] DB type safety
  - [ ] API Endpoints (CRUD)
    - [ ] auth/
      - [ ] user
    - [ ] api/
      - [ ] calendar/
      - [ ] calendar_access/
      - [ ] space/
      - [ ] space_access/
      - [ ] proposal/
      - [ ] block/
      - [ ] repeat/
      - [ ] occupant
      - [ ] vote
      - [ ] collision
- [ ] Client
  - [ ] Auth
    - [ ] Sign up
    - [ ] Account recovery
    - [ ] Log in/out
  - [ ] Location admin
  - [ ] Space admin
  - [ ] Calendar
    - [ ] Blocks
      - [ ] Available Colours/picker
      - TODO: fill this in
    - [ ] Proposals
      - TODO: fill this in
    - [ ] Voting UI
    - [ ] Views
      - [ ] Month
      - [ ] Week
      - [ ] Day
      - [ ] Year
    - [ ] Collisions
  - [ ] Theme
    - [ ] Dark
    - [ ] Light
  - [ ] Settings
    - [ ] Theme preference
    - [ ] Date/time display
    - [ ] Default view
- [ ] Hosting
  - [ ] Server
  - [ ] Client
- [ ] README
  - [ ] Initialization
  - [ ] Running

## Data Design

See [DB.md](docs/DB.md)
