require('dotenv').config();
const express = require('express');
const cors = require('cors');

const songsRoutes = require('./routes/songs');
const playlistsRoutes = require('./routes/playlists');

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Middleware
app.use(cors({
  origin: CLIENT_URL
}));
app.use(express.json());

// Routes
app.use('/api/songs', songsRoutes);
app.use('/api/playlists', playlistsRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Monsoon 90s Cafe API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
