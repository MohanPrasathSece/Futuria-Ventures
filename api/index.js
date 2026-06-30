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

// Helper to get or create workbook from Vercel Blob
const getWorkbookFromBlob = async () => {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("BLOB_READ_WRITE_TOKEN is missing. Please add it to your environment variables.");
  }

  try {
    const { blobs } = await list({ prefix: BLOB_FILE_NAME });
    const blob = blobs.find(b => b.pathname === BLOB_FILE_NAME);
    
    if (blob) {
      const res = await fetch(blob.url, {
        headers: {
          Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`
        }
      });
      const arrayBuffer = await res.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      return xlsx.read(buffer, { type: 'buffer' });
    }
  } catch (error) {
    console.error("Error fetching from Blob, falling back to new workbook:", error);
  }

  // Create new workbook if it doesn't exist or error occurs
  const wb = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(wb, xlsx.utils.json_to_sheet([]), 'Users');
  xlsx.utils.book_append_sheet(wb, xlsx.utils.json_to_sheet([]), 'Contacts');
  return wb;
};

// Helper to save workbook to Vercel Blob
const saveWorkbookToBlob = async (wb) => {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("BLOB_READ_WRITE_TOKEN is missing. Cannot save to Blob.");
  }
  const buffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
  await put(BLOB_FILE_NAME, buffer, {
    access: 'private',
    addRandomSuffix: false, // ensures we overwrite the same file
  });
};

// CRM Submission Helper
const sendToCRM = async (leadData) => {
  const [first_name, ...lastNameParts] = (leadData.name || "Unknown").split(" ");
  const last_name = lastNameParts.join(" ") || "Lead";

  const payload = {
    country_name: "cy",
    description: leadData.message || "Signup Lead",
    phone: leadData.number || "0000000000",
    email: leadData.email,
    first_name,
    last_name,
    custom_fields: {
      Source_ID: "website",
      How_Much_Invested: leadData.amount || "0",
      Outline_Your_Case: leadData.message || ""
    }
  };

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

// Signup Endpoint
app.post('/api/signup', async (req, res) => {
  try {
    const { name, email, number } = req.body;

    if (!name || !email || !number) {
      return res.status(400).json({ error: 'Name, email, and number are required' });
    }

    const wb = await getWorkbookFromBlob();
    if (!wb.Sheets['Users']) {
      xlsx.utils.book_append_sheet(wb, xlsx.utils.json_to_sheet([]), 'Users');
    }
    const ws = wb.Sheets['Users'];
    const users = xlsx.utils.sheet_to_json(ws);

    if (users.find(u => u.email === email)) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    users.push({
      name,
      email,
      number,
      registeredAt: new Date().toISOString()
    });

    wb.Sheets['Users'] = xlsx.utils.json_to_sheet(users);
    await saveWorkbookToBlob(wb);

    // Send to CRM
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

// Contact Form Endpoint (saves to a different sheet)
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, number, amount, message } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    // Send to CRM
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
