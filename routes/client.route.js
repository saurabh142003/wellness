const express = require('express');

const { verifyToken, verifyClientReq, isCoach, isAdmin } = require('../middleware/auth.mw.js');
const { createClient, updateClientProgress, deleteClient } = require('../controllers/client.controller.js');
const { scheduleSession } = require('../controllers/session.controller.js');
const router = express.Router();

router.post("/",verifyToken,verifyClientReq,createClient)
// router.post("/:coachId",verifyToken,verifyClientReq,createClient)
router.patch("/:id/progress",verifyToken,isCoach,updateClientProgress)
router.post('/:id/schedule', verifyToken,isCoach, scheduleSession);
router.delete("/:id",verifyToken,isAdmin,deleteClient)
module.exports = router