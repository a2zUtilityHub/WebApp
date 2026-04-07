/* global process */
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import compression from 'compression';
import helmet from 'helmet';

const app = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to your Vite build output
const staticPath = path.join(__dirname, 'dist');

// Middleware
app.use(helmet()); // Security headers
app.use(compression()); // Gzip/Brotli compression
app.use(express.static(staticPath));

// SPA fallback for React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(staticPath, 'index.html'));
});

// Error handling middleware (optional)
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).send('Something went wrong!');
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});