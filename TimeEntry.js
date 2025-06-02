app.post('/api/time', async (req, res) => {
  const { site, seconds, date, type, user } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO time_entries (site, seconds, date, type, user_id) VALUES ($1, $2, $3, $4, $5)',
      [site, seconds, date, type, user]
    );
    res.status(201).json({ message: 'Time entry saved' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

