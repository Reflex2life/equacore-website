# SharePoint lists (created 2026-06-24)

Site: `https://equacore.sharepoint.com/sites/EquaCoreCustomerEnquiries`
Created via SharePoint REST (`/_api/web/lists` + `/fields` + `/fields/createfieldasxml`) using
the n8n `Equacore SharePoint account` OAuth2 credential (`Jw9owE9pyq7MbmqO`). The n8n
SharePoint node now does item CRUD against these. **Note:** that credential's token audience
is `equacore.sharepoint.com` (SharePoint REST), NOT Microsoft Graph — Graph calls 401 with
"Invalid audience". Use `/_api/...` endpoints. Writes work with the OAuth bearer (no form digest).

## Cold Outreach Leads  (review queue) — list id `b5c978f8-fc69-4817-a70a-1e6168daec5b`
| Column | Internal name | Type |
|---|---|---|
| Title (= Company) | Title | Text (built-in) |
| Email | Email | Text |
| Website | Website | Text |
| Signal | Signal | Note (multiline) |
| Draft (the 3-email sequence) | Draft | Note (multiline) |
| DedupKey (root domain) | DedupKey | Text |
| Status | Status | Choice: Pending·Approved·Rejected·Sent·Replied·Unsubscribed (default Pending) |

## Outreach Suppression — list id `c438f830-a2ac-4f5a-a8b2-9a24d9b6c452`
| Column | Internal name | Type |
|---|---|---|
| Title (= domain) | Title | Text (built-in) |
| Email | Email | Text |
| Reason | Reason | Choice: already-contacted·unsubscribed·bounced·client·competitor |

## Recipe (reproducible)

- Create list: `POST /_api/web/lists` body `{"BaseTemplate":100,"Title":"...","Description":"..."}`,
  headers `Accept` + `Content-Type: application/json;odata=nometadata`.
- Text/Note field: `POST /_api/web/lists/getbytitle('<List>')/fields` body
  `{"Title":"...","FieldTypeKind":2}` (2=Text, 3=Note).
- Choice field (the generic /fields endpoint REJECTS `Choices`): use
  `POST /_api/web/lists/getbytitle('<List>')/fields/createfieldasxml` body
  `{"parameters":{"SchemaXml":"<Field Type='Choice' DisplayName='Status' Name='Status'><CHOICES>...<\/CHOICES><Default>Pending<\/Default><\/Field>"}}`.
