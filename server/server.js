/**
 * Indian Army Base & Unit Management Portal (DDMS Command)
 * Node.js / Express REST API Backend Service
 */

const express = require('express');
const cors = require('cors');
const path = require('path');

const unitsRouter = require('./routes/units');
const personnelRouter = require('./routes/personnel');
const dutyAssignmentsRouter = require('./routes/dutyAssignments');
const rosterRouter = require('./routes/roster');
const controlledItemsRouter = require('./routes/controlledItems');
const weaponsRouter = require('./routes/weapons');
const reportsRouter = require('./routes/reports');
const dashboardRouter = require('./routes/dashboard');
const telemetryRouter = require('./routes/telemetry');
const pillarsRouter = require('./routes/pillars');
const postMembersRouter = require('./routes/postMembers');
const rulesRouter = require('./routes/rules');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend clients (Live Preview on port 3000, 5500, etc.)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
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
    system: "INDIAN ARMY BASE & UNIT DDMS REST NODE",
    status: "OPERATIONAL",
    securityLevel: "RESTRICTED DEFENCE NODE // DEFCON 4",
    protocol: "256-BIT SHA",
    version: "2.0.0",
    endpoints: [
      "GET  /api/units",
      "GET  /api/units/:id",
      "GET  /api/personnel",
      "GET  /api/personnel/:id",
      "POST /api/personnel",
      "PUT  /api/personnel/:id",
      "POST /api/personnel/transfer",
      "POST /api/duty-assignments",
      "GET  /api/duty-assignments",
      "GET  /api/duty-assignments/posts",
      "GET  /api/roster",
      "GET  /api/roster/dates",
      "GET  /api/roster/history",
      "GET  /api/controlled-items",
      "POST /api/controlled-items/custody",
      "GET  /api/reports",
      "GET  /api/reports/unit-summary",
      "GET  /api/reports/equipment-audit",
      "GET  /api/dashboard/stats",
      "GET  /api/telemetry"
    ]
  });
});

// Mount Base & Unit Subsystem Routers
app.use('/api/units', unitsRouter);
app.use('/api/personnel', personnelRouter);
app.use('/api/duty-assignments', dutyAssignmentsRouter);
app.use('/api/roster', rosterRouter);
app.use('/api/controlled-items', controlledItemsRouter);
app.use('/api/weapons', weaponsRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/telemetry', telemetryRouter);
app.use('/api/pillars', pillarsRouter);
app.use('/api/rules', rulesRouter);
app.use('/api/post-members', postMembersRouter);

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
  console.log(`🛡️  INDIAN ARMY BASE & UNIT REST SERVER (DDMS 2.0)`);
  console.log(`📡 Port: http://localhost:${PORT}`);
  console.log(`🏛️  Units API:       http://localhost:${PORT}/api/units`);
  console.log(`👥 Personnel API:   http://localhost:${PORT}/api/personnel`);
  console.log(`⚔️  Duty Roster:     http://localhost:${PORT}/api/roster`);
  console.log(`📦 Equipment API:   http://localhost:${PORT}/api/controlled-items`);
  console.log(`🖥️  Frontend Portal: http://localhost:${PORT}/index.html`);
  console.log('====================================================');
});

module.exports = app;
