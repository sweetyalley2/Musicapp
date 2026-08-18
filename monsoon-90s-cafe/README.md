# Monsoon 90s Café

An immersive nostalgic music experience built with React, Node.js, and Express.

## Project Setup

The project is split into two directories: `client` (React frontend) and `server` (Node.js backend).

### Prerequisites
- Node.js (v18+ recommended)
- npm

### 1. Backend Setup

1. Open a terminal and navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
4. Start the backend server:
   ```bash
   npm run dev
   # Or use: node server.js
   ```
   The backend should now be running on `http://localhost:5000`.

### 2. Frontend Setup

1. Open a second terminal and navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The frontend should now be accessible at `http://localhost:5173`.

## Adding Real Audio Files

To keep this project compliant with copyright laws, the current version only contains metadata for songs. If you want to add actual audio:

1. Place your legally hosted or licensed MP3 files inside `client/public/audio/` (you will need to create the `audio` folder).
2. Open `server/data/songs.json`.
3. Locate the song entry you want to update and change the `audioUrl` field to point to your audio file. For example:
   ```json
   "audioUrl": "/audio/pehla-nasha.mp3"
   ```
   *Note: If `audioUrl` is empty, the player will gracefully disable playback and show "Audio preview unavailable".*

## Customizing Rain Presets

The rain animation is handled by an HTML5 canvas inside `client/src/components/RainCanvas.jsx`. You can adjust the intensity of the rain by passing different presets:
- `mumbai` (Heavy rain, stronger winds)
- `kolkata` (Slower, warmer atmosphere)
- `storm` (Very heavy)
- `light` (Gentle sprinkle)

## Deployment

### Frontend (Vite)
To deploy the frontend to services like Vercel or Netlify:
1. In the `client` folder, run `npm run build`.
2. Deploy the resulting `dist` folder.
*Make sure to change the API URLs in your components from `http://localhost:5000` to your deployed backend URL.*

### Backend (Node.js)
To deploy the backend to services like Render or Railway:
1. Deploy the `server` directory.
2. Set the `PORT` and `CLIENT_URL` environment variables in your hosting provider's dashboard.
