const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const playlistsFilePath = path.join(__dirname, '../data/playlists.json');

// Helper to read data
const getPlaylists = () => {
  const data = fs.readFileSync(playlistsFilePath, 'utf8');
  return JSON.parse(data);
};

// GET /api/playlists
router.get('/', (req, res) => {
  try {
    const playlists = getPlaylists();
    res.json(playlists);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving playlists', error: error.message });
  }
});

// GET /api/playlists/mood/:mood
router.get('/mood/:mood', (req, res) => {
  try {
    const playlists = getPlaylists();
    const playlistsByMood = playlists.filter(p => p.mood === req.params.mood);
    if (playlistsByMood.length === 0) {
      return res.status(404).json({ message: 'No playlists found for this mood' });
    }
    res.json(playlistsByMood);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving playlists by mood', error: error.message });
  }
});

module.exports = router;
