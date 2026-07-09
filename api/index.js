import express from 'express';
import cors from 'cors';
import xlsx from 'xlsx';
import dotenv from 'dotenv';
import { put, list } from '@vercel/blob';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// CRM Config
const CRM_API_URL = process.env.CRM_API_URL;
const CRM_TOKEN = process.env.CRM_TOKEN;

const BLOB_FILE_NAME = 'users.xlsx';

// ---------------------------------------------------------------------------
// Blob helpers — used ONLY for login lookup and storing the mobile number
// on signup. No contact/lead data is ever written to the blob.
// ---------------------------------------------------------------------------

const getWorkbookFromBlob = async () => {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("BLOB_READ_WRITE_TOKEN is missing. Please add it to your environment variables.");
  }

  try {
    const { blobs } = await list({ prefix: BLOB_FILE_NAME });
    const blob = blobs.find(b => b.pathname === BLOB_FILE_NAME);

    if (blob) {
      const res = await fetch(blob.url, {
        headers: { Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` }
      });
      const arrayBuffer = await res.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      return xlsx.read(buffer, { type: 'buffer' });
    }
  } catch (error) {
    console.error("Error fetching from Blob, falling back to new workbook:", error);
  }

  // Create minimal workbook if none exists yet
  const wb = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(wb, xlsx.utils.json_to_sheet([]), 'Users');
  return wb;
};

const saveWorkbookToBlob = async (wb) => {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("BLOB_READ_WRITE_TOKEN is missing. Cannot save to Blob.");
  }
  const buffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
  await put(BLOB_FILE_NAME, buffer, {
    access: 'private',
    addRandomSuffix: false,
    allowOverwrite: true,
  });
};

const DIAL_CODES = {
  CH: "41",
  US: "1",
  GB: "44",
  DE: "49",
  IN: "91",
  FR: "33",
  BE: "32",
  IT: "39",
  ES: "34",
  NL: "31",
  AT: "43",
  SE: "46",
  CA: "1"
};

const formatPhoneForCRM = (phoneInput, countryCode = "FR") => {
  let phone = (phoneInput || "").replace(/[^\d+]/g, "").trim();
  const upperCountry = (countryCode || "FR").toUpperCase();
  const code = DIAL_CODES[upperCountry] || "33";

  if (phone) {
    if (phone.startsWith("+")) {
      phone = "00" + phone.slice(1);
    }
    if (phone.startsWith(code) && !phone.startsWith("00" + code)) {
      phone = "00" + phone;
    }
    if (phone.startsWith("0") && !phone.startsWith("00")) {
      phone = "00" + code + phone.slice(1);
    }
    if (!phone.startsWith("00")) {
      phone = "00" + code + phone;
    }
  } else {
    phone = "0000000000";
  }
  return phone;
};

// ---------------------------------------------------------------------------
// CRM Submission Helper
// Sends a lead payload to the CRM endpoint.  All data transformation
// (name parsing, phone formatting) happens here so the routes stay clean.
// ---------------------------------------------------------------------------
const sendToCRM = async (leadData) => {
  // Name parsing — trim first to avoid blank first_name from leading spaces
  const [first_name, ...lastNameParts] = (leadData.name || "Unknown").trim().split(" ");
  const last_name = lastNameParts.join(" ") || "Lead";

  const countryCode = leadData.countryCode || "FR";
  const phone = formatPhoneForCRM(leadData.number, countryCode);

  
        let finalPhone = (leadData.number || leadData.phone || "").replace(/[^0-9+]/g, '');
        if (finalPhone && finalPhone.startsWith('+')) {
            finalPhone = '00' + finalPhone.slice(1);
        }
        let countryName = leadData.countryCode ? leadData.countryCode.toLowerCase() : "ch";

        const payload = {
    country_name: countryCode.toLowerCase(),
    description: "Futuria Network",
    phone,
    email: leadData.email,
    first_name,
    last_name,
    custom_fields: {
      Source_ID: "website",
      How_Much_Invested: leadData.amount || "0",
      Outline_Your_Case: leadData.message || ""
    }
  };

  console.log("Sending payload to CRM:", JSON.stringify(payload, null, 2));

  try {
    const res = await fetch(CRM_API_URL, {
      method: 'POST',
      headers: {
        'authorization': CRM_TOKEN,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    const text = await res.text();
    console.log("CRM Response:", res.status, text);
    if (res.ok) {
      try {
        const url = (typeof process !== 'undefined' && process.env && process.env.VITE_DASHBOARD_URL) || "https://lead-dashboard-orcin.vercel.app/api/increment";
        await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ website: "Futuria Network", type: leadData.message ? "contact" : "signup", name: leadData.name, email: leadData.email})
        }).catch(() => {});
      } catch(e){}
    }
    return true;
  } catch (error) {
    console.error("CRM Error:", error);
    return false;
  }
};

// ---------------------------------------------------------------------------
// Signup Endpoint
// Writes name/email/number to the blob (for login lookup) and sends a
// CRM lead.  No other file-based storage is used.
// ---------------------------------------------------------------------------
app.post('/api/signup', async (req, res) => {
  try {
    const { name, email, number, countryCode } = req.body;

    if (!name || !email || !number) {
      return res.status(400).json({ error: 'Name, email, and number are required' });
    }

    // --- Blob: duplicate-check and upsert mobile number ---
    const wb = await getWorkbookFromBlob();
    if (!wb.Sheets['Users']) {
      xlsx.utils.book_append_sheet(wb, xlsx.utils.json_to_sheet([]), 'Users');
    }
    const ws = wb.Sheets['Users'];
    const users = xlsx.utils.sheet_to_json(ws);

    const existing = users.find(u => u.email === email);
    if (existing) {
      // Update mobile number in place for returning users
      existing.number = number;
      existing.countryCode = countryCode || 'FR';
    } else {
      users.push({ name, email, number, countryCode: countryCode || 'FR', registeredAt: new Date().toISOString() });
    }

    wb.Sheets['Users'] = xlsx.utils.json_to_sheet(users);
    await saveWorkbookToBlob(wb);
    // --- end blob ---

    // Send lead to CRM — no fallback file storage needed
    await sendToCRM({ name, email, number, countryCode });
    incrementLeadCount();

    res.json({ success: true, message: 'Signup successful' });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Internal server error during signup", details: error.message });
  }
});

// Login Endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const wb = await getWorkbookFromBlob();
    if (!wb.Sheets['Users']) {
      return res.status(401).json({ error: 'Email not found' });
    }
    const ws = wb.Sheets['Users'];
    const users = xlsx.utils.sheet_to_json(ws);

    const user = users.find(u => u.email === email);

    if (!user) {
      return res.status(401).json({ error: 'Email not found' });
    }

    res.json({ 
      success: true, 
      user: { name: user.name, email: user.email, number: user.number, countryCode: user.countryCode } 
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error during login", details: error.message });
  }
});

// ---------------------------------------------------------------------------
// Contact Form Endpoint
// Routes lead directly to CRM — no file/blob storage is used.
// ---------------------------------------------------------------------------
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, number, countryCode, amount, message } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    // Send directly to CRM — no Excel/blob involved
    await sendToCRM({ name, email, number, countryCode, amount, message });
    incrementLeadCount();

    res.json({ success: true, message: 'Message received' });
  } catch (error) {
    console.error("Contact form error:", error);
    res.status(500).json({ error: "Internal server error during contact form submission", details: error.message });
  }
});

const PORT = process.env.PORT || 3001;
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
  });
}


// --- persistent lead counter stored in vercel blob ---
async function incrementLeadCount() {
  try {
    const { list, put } = await import('@vercel/blob');
    let count = 0;
    try {
      const { blobs } = await list({ prefix: 'leads-count.json', token: process.env.BLOB_READ_WRITE_TOKEN, storeId: process.env.BLOB_STORE_ID });
      if (blobs.length > 0) {
        const fetchRes = await fetch(blobs[0].url);
        if (fetchRes.ok) {
          const json = await fetchRes.json();
          count = typeof json.count === 'number' ? json.count : 0;
        }
      }
    } catch (e) {}
    const next = count + 1;
    await put('leads-count.json', JSON.stringify({ count: next }), {
      access: 'public',
      contentType: 'application/json',
      allowOverwrite: true,
      token: process.env.BLOB_READ_WRITE_TOKEN,
      storeId: process.env.BLOB_STORE_ID,
      storeId: process.env.BLOB_STORE_ID,
    });
    console.log(`[leads-count] incremented to ${next}`);
  } catch (err) {
    console.error('[leads-count] increment error:', err);
  }
}

app.get('/api/leads-count', async (req, res) => {
  try {
    const { list } = await import('@vercel/blob');
    const { blobs } = await list({ prefix: 'leads-count.json', token: process.env.BLOB_READ_WRITE_TOKEN, storeId: process.env.BLOB_STORE_ID });
    if (blobs.length === 0) return res.json({ count: 0 });
    const fetchRes = await fetch(blobs[0].url);
    if (!fetchRes.ok) return res.json({ count: 0 });
    const json = await fetchRes.json();
    return res.json({ count: typeof json.count === 'number' ? json.count : 0 });
  } catch (err) {
    return res.json({ count: 0 });
  }
});

app.post('/api/leads-count', async (req, res) => {
  try {
    const { list, put } = await import('@vercel/blob');
    let count = 0;
    try {
      const { blobs } = await list({ prefix: 'leads-count.json', token: process.env.BLOB_READ_WRITE_TOKEN, storeId: process.env.BLOB_STORE_ID });
      if (blobs.length > 0) {
        const fetchRes = await fetch(blobs[0].url);
        if (fetchRes.ok) {
          const json = await fetchRes.json();
          count = typeof json.count === 'number' ? json.count : 0;
        }
      }
    } catch (e) {}
    const next = count + 1;
    await put('leads-count.json', JSON.stringify({ count: next }), {
      access: 'public',
      contentType: 'application/json',
      allowOverwrite: true,
      token: process.env.BLOB_READ_WRITE_TOKEN,
      storeId: process.env.BLOB_STORE_ID,
      storeId: process.env.BLOB_STORE_ID,
    });
    return res.json({ count: next });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

export default app;
