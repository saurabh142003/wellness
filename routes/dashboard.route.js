const express = require('express');

const { verifyToken, isAdmin } = require('../middleware/auth.mw');
const { getAdminDashboard } = require('../controllers/dashboard.controller.js');

const router = express.Router();

// Admin dashboard route (only accessible by admins)
router.get('/dashboard', verifyToken,isAdmin,getAdminDashboard);

module.exports = router;