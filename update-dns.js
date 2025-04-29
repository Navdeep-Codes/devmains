const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const CF_API_TOKEN = process.env.CF_API_TOKEN;
const CF_ZONE_ID = process.env.CF_ZONE_ID;
const DOMAINS = JSON.parse(process.env.DOMAINS || '["is-open-source.org"]');

const API_BASE = `https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/dns_records`;

async function getCurrentRecords() {
  const res = await fetch(API_BASE, {
    headers: {
      Authorization: `Bearer ${CF_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
  });
  const data = await res.json();
  return data.result;
}

async function deleteRecord(id) {
  await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${CF_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
  });
}

async function createRecord(record) {
  const body = {
    type: record.type,
    name: record.name,
    content: record.content,
    ttl: 1, // Auto TTL
    proxied: false, // Not proxied by default
  };

  // Add optional fields if present (for MX, SRV, etc.)
  if ('priority' in record) body.priority = record.priority;
  if ('data' in record) Object.assign(body, record.data); // e.g., for SRV

  await fetch(API_BASE, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${CF_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
}

(async () => {
  const domainsPath = path.join(__dirname, 'domains');
  const domainFolders = fs.readdirSync(domainsPath).filter(f => fs.statSync(path.join(domainsPath, f)).isDirectory());

  const currentRecords = await getCurrentRecords();

  for (const domain of domainFolders) {
    const domainPath = path.join(domainsPath, domain);
    const files = fs.readdirSync(domainPath).filter(f => f.endsWith('.json'));

    for (const file of files) {
      const data = JSON.parse(fs.readFileSync(path.join(domainPath, file)));
      const subdomain = data.subdomain.toLowerCase();
      const fullDomain = `${subdomain}.${domain}`;

      // Delete old records for this subdomain
      const toDelete = currentRecords.filter(r => r.name === fullDomain);
      for (const rec of toDelete) {
        await deleteRecord(rec.id);
      }

      if (data.record) {
        for (const type in data.record) {
          const records = Array.isArray(data.record[type]) ? data.record[type] : [data.record[type]];

          for (const entry of records) {
            const record = {
              type,
              name: fullDomain,
              content: typeof entry === 'string' ? entry : entry.content,
            };

            if (typeof entry === 'object' && entry.priority) {
              record.priority = entry.priority;
            }

            if (typeof entry === 'object' && entry.data) {
              record.data = entry.data;
            }

            await createRecord(record);
          }
        }
      }

      console.log(`✅ Synced ${fullDomain}`);
    }
  }
})();
