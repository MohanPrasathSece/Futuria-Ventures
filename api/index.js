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

// ---------------------------------------------------------------------------
// Swiss Phone Auto-Formatter
// Normalises any common Swiss phone format to the 0041xxxxxxxxx format
// required by the CRM (e.g. +41791234567 → 0041791234567).
// ---------------------------------------------------------------------------
const formatSwissPhone = (raw) => {
  let phone = (raw || "").replace(/[^0-9+]/g, '');

  if (!phone) return "0000000000";

  // +41... → 0041...
  if (phone.startsWith('+')) {
    phone = '00' + phone.slice(1);
  }

  // 41xxxxxxxxx (11 digits, no leading zero) → 0041xxxxxxxxx
  if (phone.startsWith('41') && phone.length === 11) {
    phone = '00' + phone;
  }

  // Already 0041... — nothing more to do
  if (phone.startsWith('0041')) return phone;

  // 0xx... (local Swiss format) → 0041xx...
  if (phone.startsWith('0') && !phone.startsWith('00')) {
    return '0041' + phone.slice(1);
  }

  // Bare 7x/8x/9x digits without any prefix → 0041 + digits
  if (!phone.startsWith('00')) {
    return '0041' + phone;
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

  const phone = formatSwissPhone(leadData.number);

  const payload = {
    country_name: "ch",
    description: leadData.message || "Signup Lead",
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
    const { name, email, number } = req.body;

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
    } else {
      users.push({ name, email, number, registeredAt: new Date().toISOString() });
    }

    wb.Sheets['Users'] = xlsx.utils.json_to_sheet(users);
    await saveWorkbookToBlob(wb);
    // --- end blob ---

    // Send lead to CRM — no fallback file storage needed
    await sendToCRM({ name, email, number });

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
      user: { name: user.name, email: user.email, number: user.number } 
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
    const { name, email, number, amount, message } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    // Send directly to CRM — no Excel/blob involved
    await sendToCRM({ name, email, number, amount, message });

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

export default app;
