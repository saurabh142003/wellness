const express = require('express');

const { verifyToken } = require('../middleware/auth.mw.js');
const { getClients } = require('../controllers/client.controller.js');

const router = express.Router();


router.get("/:coachId/clients",verifyToken,getClients)
module.exports = router