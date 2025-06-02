require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());


(async () => {
  try {
    await prisma.$connect();
    console.log('✅ Connected to Neon via Prisma');
  } catch (err) {
    console.error('❌ Prisma DB connection error:', err);
  }
})();

//  POST api time — Save time entry
app.post('/api/time', async (req, res) => {
  const { site, seconds, date, type, user } = req.body;
  try {
    const entry = await prisma.timeEntry.create({
      data: {
        site,
        seconds,
        date: new Date(date), // ensure it's a valid JS Date
        type,
        userId: user
      }
    });
    res.status(201).json({ message: 'Time entry saved', entry });
  } catch (err) {
    console.error('❌ Failed to save time entry:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

// GET /api/time — Fetch all time entries
app.get('/api/time', async (req, res) => {
  try {
    const entries = await prisma.timeEntry.findMany({
      orderBy: { date: 'desc' }
    });
    res.json(entries);
  } catch (err) {
    console.error('❌ Failed to fetch entries:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

//  Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
