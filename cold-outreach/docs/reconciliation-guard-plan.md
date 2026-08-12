# Reconciliation Guard + Bounce Handling Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a standing n8n workflow that automatically repairs Approved ClickUp cards whose
webhook silently never fired, and wire the currently-dead bounce-detection branch in the Reply
Agent so delivery failures stop the send cadence and reject the card.

**Architecture:** Two independent changes on the existing n8n instance (voidnox.app.n8n.cloud):
(1) a new schedule-triggered workflow that diffs ClickUp's Approved column against the
"Cold Outreach Sends" data table and replays the Approve Handler's repair logic on any card
missing an active row, capped at 5/run; (2) an edit to one existing workflow's unused `auto`
route to mark bounced leads terminal and reject their card.

**Tech Stack:** n8n Cloud (Workflow SDK via MCP tools), ClickUp API (via MCP + HTTP Request
nodes), n8n Data Tables, Lusha v3 API (HTTP Request + predefined cred), Zoho SMTP/IMAP.

## Global Constraints

- No new credentials — reuse: ClickUp OAuth2 `u6QskCANdJE2ZfMQ`, Lusha `mpPiRn6tEUECh7PK`,
  Zoho SMTP `dNt6bQ75wTvlSOvz`, Zoho IMAP `pX145xpm70Qzu390`.
- Every ClickUp MCP/API call must pass `workspace_id: 90121850569` explicitly (two workspaces
  exist on this account; calls without it 500 or hit the wrong one).
- Lusha is a community node, un-introspectable via `get_node_types` — always call it via HTTP
  Request node with predefined credential type `lushaApi`, not the native Lusha node.
- Cron patterns use 24hr UTC-equivalent-to-n8n-instance-tz as already established by the
  Cadence Scanner (`0 0 9-17 * * 1-5` style) — do not assume a specific timezone offset without
  checking `get_workflow_details` on an existing scheduled workflow first.
- Before writing any n8n Workflow SDK code, call `get_sdk_reference` and, for each technique
  involved (scheduling, ClickUp, data tables, HTTP Request/Lusha), `get_workflow_best_practices`
  — do not guess SDK syntax or node parameter names.
- Every new/edited workflow is built/saved **inactive** first and only activated after a
  successful manual test execution is verified against real ClickUp/data-table state.
- Full design context: `cold-outreach/docs/reconciliation-guard-design.md`.

---

### Task 1: Build "Reconcile - Approved Backlog Guard" workflow

**Files:**
- New n8n workflow (name: "Reconcile - Approved Backlog Guard"), created via n8n MCP tools —
  no local file, but record its returned workflow ID in
  `cold-outreach/docs/reconciliation-guard-design.md` under a new "Built" note once created.
- Modify: `cold-outreach/docs/reconciliation-guard-design.md` (append workflow ID + verification
  results after test execution).

**Interfaces:**
- Consumes: ClickUp list `901219065232` (workspace `90121850569`) task status field; data table
  "Cold Outreach Sends" rows (`taskId`, `email`, `firstName`, `status`, `step`, `nextSendAt`,
  `senderName`, `subject1..body3`, `agentRounds`); Lusha v3 `prospecting`/`enrich` endpoints
  exactly as documented in the design doc and in [[equacore-cold-outreach]] memory.
- Produces: for each repaired card — data table row with `status='active', step=1,
  nextSendAt=<staggered ISO timestamp>, email=<found>, firstName=<derived>`; ClickUp card moved
  to status `Sent`; new ClickUp task created in list `901219065860` (New Leads).

- [ ] **Step 1: Fetch SDK reference and best practices**

  Call `get_sdk_reference` (no args, full reference). Then call
  `get_workflow_best_practices` once each for techniques: `"scheduling"`, `"clickup"` (or
  closest match — use `technique="list"` first if unsure of exact names), `"data tables"`,
  `"http request"`. Read the returned guidance before writing any code — do not skip.

- [ ] **Step 2: Discover nodes**

  Call `search_nodes` with queries: `["schedule trigger", "clickup", "data table", "http request",
  "if", "code", "set"]`. Note every discriminator (resource/operation/mode) returned for the
  ClickUp node (task list, task update, task create, comment create) and the Data Table node
  (get rows, update row).

- [ ] **Step 3: Fetch exact type definitions**

  Call `get_node_types` with every node ID + discriminator combination identified in Step 2 that
  this workflow will use. Do not write node parameters from memory — copy them from this
  response.

- [ ] **Step 4: Write the workflow via `create_workflow_from_code`**

  Build the workflow with this exact node sequence (parameter values from Steps 1-3's live
  schemas, not guessed):

  1. **Schedule Trigger** — cron `0 9-17/3 * * 1-5`
  2. **Set node "Reconcile Guard Now"** — one field `now` = `{{$now.toISO()}}` (captured once at
     the top of the run so later Code nodes never call `Date.now()`/`new Date()` inline —
     downstream nodes read this fixed value via `$('Reconcile Guard Now').first().json.now`)
  3. **ClickUp: list tasks** — list `901219065232`, workspace `90121850569`, filter
     `status = "Approved"`, credential `u6QskCANdJE2ZfMQ`
  4. **Data Table: get rows** — the "Cold Outreach Sends" table, return all
  5. **Code node "Find Mismatches"**:
     ```javascript
     const rows = $('Data Table: get rows').all().map(i => i.json);
     const activeIds = new Set(
       rows.filter(r => r.status === 'active' || r.status === 'completed').map(r => r.taskId)
     );
     const approved = $input.all().filter(i => !activeIds.has(i.json.id));
     return approved;
     ```
  6. **Code node "Cap To 5"**:
     ```javascript
     const items = $input.all();
     const kept = items.slice(0, 5);
     const deferred = items.length - kept.length;
     if (deferred > 0) {
       console.log(`Reconcile Guard: ${deferred} candidate(s) deferred to next run (cap=5)`);
     }
     return kept;
     ```
  7. **IF "Has Email?"** — condition: `{{$json.email}}` is not empty (branch true = skip Lusha,
     false = run Lusha Search → Pick Best Contact → Lusha Enrich → Extract Email, using the
     exact same HTTP Request node configuration as the Approve Handler workflow
     — fetch its current config with `get_workflow_details` on that ID first and copy the Lusha
     node parameters verbatim, do not re-derive them)
  8. **Code node "Compute Stagger"** (runs after the Has-Email/Lusha merge, receives all kept
     items with resolved email/firstName):
     ```javascript
     const items = $input.all();
     const now = $('Reconcile Guard Now').first().json.now; // ISO string passed in from a
       // Set node populated at workflow start via {{$now}} — do NOT call new Date()/now()
       // inline in multiple Code nodes, capture it once at the top of the run
     return items.map((item, idx) => ({
       json: {
         ...item.json,
         nextSendAt: new Date(new Date(now).getTime() + idx * 15 * 60 * 1000).toISOString(),
       },
     }));
     ```
  9. **Data Table: update row** — match on `taskId`, set `email, firstName, status='active',
     step=1, nextSendAt=<from Step 8>`
  10. **ClickUp: update task** — status → `Sent`, credential `u6QskCANdJE2ZfMQ`
  11. **ClickUp: create task** — list `901219065860`, folder `901211962352`, space
      `90128085539`, team `90121850569` — same field mapping as the Approve Handler's
      equivalent "create pipeline lead" step (copy from `get_workflow_details` on
      the Approve Handler)

  Save as **inactive**.

- [ ] **Step 5: Validate**

  Call `validate_workflow` on the new workflow ID. Fix any reported errors before proceeding.

- [ ] **Step 6: Manual test execution**

  Call `test_workflow` (or `execute_workflow` if `test_workflow` requires pin data you don't
  have — check which is appropriate for a schedule-triggered workflow via
  `get_workflow_best_practices` if unclear) to run it once manually against the live board.

- [ ] **Step 7: Verify against real state**

  Call `get_execution` on the resulting run. Confirm: at most 5 items processed; each
  processed card's ClickUp status actually changed to Sent (spot-check with `clickup_get_task`
  — note: this tool needs `workspace_id` too); each corresponding data table row now has
  `status='active'`. Confirm cards beyond the cap-of-5 are untouched (still Approved). Record
  the execution ID and outcome (how many fixed vs how many deferred vs how many Lusha-no-match)
  in `cold-outreach/docs/reconciliation-guard-design.md`.

- [ ] **Step 8: Activate**

  Only after Step 7 passes: call `publish_workflow` on the new workflow ID. Verify via
  `search_workflows` that it now shows `"active": true`.

- [ ] **Step 9: Commit the design doc update**

  ```bash
  cd ~/equacore-website && git add cold-outreach/docs/reconciliation-guard-design.md
  git commit -m "Record Reconcile - Approved Backlog Guard build + first verified run"
  ```

---

### Task 2: Wire bounce handling into the Reply/Opt-out Watcher

**Files:**
- Modify existing n8n workflow the "Phase B - Reply Agent & Opt-out Watcher" workflow
  via n8n MCP tools — no local file.
- Modify: `cold-outreach/docs/reconciliation-guard-design.md` (append verification note).

**Interfaces:**
- Consumes: the existing `Switch(route)` node's `auto` output (already emits items for
  mailer-daemon/NDR-classified messages — see [[equacore-cold-outreach]] memory,
  "auto→dropped (fallback unwired)").
- Produces: data table row `status='bounced'` (terminal — excluded from Cadence Scanner's
  active-row query the same way `completed`/`unsubscribed` already are); ClickUp card status
  `Rejected` with a comment noting the bounce.

- [ ] **Step 1: Inspect the current workflow**

  Call `get_workflow_details` on the Reply Agent workflow. Locate the `Switch(route)` node's `auto`
  output connection (currently connects to nothing / a no-op). Note the exact node names and
  parameter shapes used by the neighboring `unsub` branch (`Mark Unsubscribed`, `Card Rejected`)
  — the new branch mirrors these exactly, just with different values.

- [ ] **Step 2: Fetch node types if new nodes are needed**

  If the `unsub` branch's `Mark Unsubscribed` (Data Table update) and `Card Rejected` (ClickUp
  update + comment) nodes can be duplicated as-is, skip to Step 3. Otherwise call
  `get_node_types` for any node type not already present in this workflow.

- [ ] **Step 3: Add the bounce-handling nodes**

  Using `update_workflow` (per the known gotcha: avoid JS backticks in the payload — they trip
  the Cloudflare WAF block on this instance; use string concatenation instead), add two nodes
  connected from the `Switch(route)` node's `auto` output:

  1. **Data Table: update row "Mark Bounced"** — match on the row found by the existing
     `Get Reply Row` node (by sender email, already computed upstream in this workflow), set
     `status = 'bounced'`
  2. **ClickUp: update task "Card Rejected (Bounce)"** — status → `Rejected`; then
     **ClickUp: create comment** — body: `'Delivery failed (bounce/NDR) from ' + $json.senderEmail
     + ' — mailbox appears inactive. Cadence stopped automatically.'` (string concatenation,
     not a template literal, per the WAF gotcha above)

- [ ] **Step 4: Validate**

  Call `validate_workflow` on the Reply Agent workflow. Fix any errors before proceeding.

- [ ] **Step 5: Republish**

  Call `publish_workflow` on the Reply Agent workflow to apply the change. Note: this workflow uses an
  IMAP trigger that has previously needed an unpublish/republish cycle to force a fresh IDLE
  connection (see [[equacore-cold-outreach]] "IMAP STALL BUG") — a straight republish while
  already active should be sufficient here since we're not toggling active/inactive, but if the
  IMAP trigger looks stalled afterward (no new executions for >30 min despite known test mail),
  unpublish then republish to force reconnect.

- [ ] **Step 6: Verify**

  Since a live bounce may not be immediately available, verify the logic path with a manual
  test: use `test_workflow` with pin data shaped like a real mailer-daemon NDR (sender
  `mailer-daemon@...` or similar, matching whatever pattern the existing classifier already
  recognizes per Step 1's inspection) against a data table row you seed for this test (a
  disposable row with a test taskId/email, deleted afterward — do not use a real lead's row).
  Confirm: row ends at `status='bounced'`; test ClickUp card (create a disposable test card
  first, or use a card you're prepared to move back afterward) ends at `Rejected` with the
  comment present. Clean up test row/card after verifying. Record the verification outcome in
  `cold-outreach/docs/reconciliation-guard-design.md`.

- [ ] **Step 7: Commit the design doc update**

  ```bash
  cd ~/equacore-website && git add cold-outreach/docs/reconciliation-guard-design.md
  git commit -m "Record bounce-handling branch build + verification in Reply Agent"
  ```
