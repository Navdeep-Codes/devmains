const fs = require('fs');
const path = require('path');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

process.on('unhandledRejection', err => {
  console.error('❌ Unhandled error:', err);
  process.exit(1);
});

const CF_API_TOKEN = process.env.CF_API_TOKEN;
const CF_ZONE_ID = process.env.CF_ZONE_ID;
const DOMAIN = process.env.DOMAIN;

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

async function createRecord(type, name, content) {
  await fetch(API_BASE, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${CF_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type,
      name,
      content,
      ttl: 1,
      proxied: false,
    }),
  });
}

(async () => {
  const domainsPath = path.join(__dirname, 'domains');
  const files = fs.readdirSync(domainsPath).filter(f => f.endsWith('.json'));

  const currentRecords = await getCurrentRecords();

  for (const file of files) {
    const data = JSON.parse(fs.readFileSync(path.join(domainsPath, file)));

    const subdomain = data.subdomain.toLowerCase();
    const fullDomain = `${subdomain}.${DOMAIN}`;

    // Delete old records for this subdomain
    const toDelete = currentRecords.filter(r => r.name === fullDomain);
    for (const rec of toDelete) {
      await deleteRecord(rec.id);
    }

    if (data.record) {
      if (data.record.A) {
        for (const ip of data.record.A) {
          await createRecord('A', fullDomain, ip);
          console.log(`✅ Created A record for ${fullDomain} -> ${ip}`);
        }
      }
      if (data.record.CNAME) {
        await createRecord('CNAME', fullDomain, data.record.CNAME);
        console.log(`✅ Created CNAME record for ${fullDomain} -> ${data.record.CNAME}`);
      }
    }
  }
})();
