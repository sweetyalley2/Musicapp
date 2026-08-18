const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const songsFilePath = path.join(__dirname, '../data/songs.json');

// Helper to read data
const getSongs = () => {
  const data = fs.readFileSync(songsFilePath, 'utf8');
  return JSON.parse(data);
};

// GET /api/songs
router.get('/', (req, res) => {
  try {
    const songs = getSongs();
    res.json(songs);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving songs', error: error.message });
  }
});

// GET /api/songs/:id
router.get('/:id', (req, res) => {
  try {
    const songs = getSongs();
    const song = songs.find(s => s.id === req.params.id);
    if (!song) {
      return res.status(404).json({ message: 'Song not found' });
    }
    res.json(song);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving song', error: error.message });
  }
});

module.exports = router;
