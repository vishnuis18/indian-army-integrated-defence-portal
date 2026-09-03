/**
 * Indian Army Integrated Defence Portal & DDMS
 * Node.js / Express REST API Backend Service
 */

const express = require('express');
const cors = require('cors');
const path = require('path');

const telemetryRouter = require('./routes/telemetry');
const dashboardRouter = require('./routes/dashboard');
const rosterRouter = require('./routes/roster');
const weaponsRouter = require('./routes/weapons');
const personnelRouter = require('./routes/personnel');
const reportsRouter = require('./routes/reports');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend clients (Live Preview on port 3000, 5500, etc.)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware (tactical format)
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (!req.path.startsWith('/assets/')) {
      console.log(`[DEFENCE-REST] ${req.method} ${req.path} -> ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

// Serve frontend static assets from files/
app.use(express.static(path.join(__dirname, '..', 'files')));
app.use('/assets', express.static(path.join(__dirname, '..', 'assets')));

// Health & System Information endpoint
app.get('/api', (req, res) => {
  res.json({
    system: "INDIAN ARMY INTEGRATED DEFENCE REST NODE",
    status: "OPERATIONAL",
    securityLevel: "RESTRICTED DEFENCE NODE // DEFCON 4",
    protocol: "256-BIT SHA",
    version: "1.0.0",
    endpoints: [
      "GET  /api/telemetry",
      "GET  /api/dashboard/stats",
      "GET  /api/dashboard/manning-chart",
      "GET  /api/dashboard/alerts",
      "GET  /api/roster",
      "POST /api/roster/assign",
      "GET  /api/weapons",
      "POST /api/weapons/issue",
      "GET  /api/personnel",
      "POST /api/personnel/status",
      "GET  /api/reports",
      "POST /api/reports/generate"
    ]
  });
});

// Mount Tactical Subsystem Routers
app.use('/api/telemetry', telemetryRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/roster', rosterRouter);
app.use('/api/weapons', weaponsRouter);
app.use('/api/personnel', personnelRouter);
app.use('/api/reports', reportsRouter);

// Fallback error handler
app.use((err, req, res, next) => {
  console.error('[DEFENCE-ERROR]', err);
  res.status(500).json({
    success: false,
    error: "Internal Defence Server Error",
    message: err.message
  });
});

// Start Server
app.listen(PORT, () => {
  console.log('====================================================');
  console.log(`🛡️  INDIAN ARMY INTEGRATED DEFENCE REST SERVER`);
  console.log(`📡 Port: http://localhost:${PORT}`);
  console.log(`🟢 Telemetry Stream: http://localhost:${PORT}/api/telemetry`);
  console.log(`📊 DDMS Dashboard:  http://localhost:${PORT}/api/dashboard/stats`);
  console.log(`🖥️  Frontend Portal:  http://localhost:${PORT}/index.html`);
  console.log('====================================================');
});

module.exports = app;
