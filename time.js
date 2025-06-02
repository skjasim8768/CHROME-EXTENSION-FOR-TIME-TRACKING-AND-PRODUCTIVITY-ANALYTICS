// routes/time.js
const express = require('express');
const router = express.Router();
const TimeEntry = require('../models/TimeEntry');

router.post('/', async (req, res) => {
  try {
    const { site, seconds, date, type, user } = req.body;
    const entry = new TimeEntry({ site, seconds, date, type, user });
    await entry.save();
    res.status(201).json({ message: 'Saved successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/', async (req, res) => {
  const data = await TimeEntry.find({});
  res.json(data);
});

module.exports = router;
