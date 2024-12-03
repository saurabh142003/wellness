const express = require('express');
const { registerUser, loginUser, registerAdmin, loginAdmin } = require('../controllers/auth.controller.js');
const { verifyAllReq, verifySignIn, isAdmin, verifyToken } = require('../middleware/auth.mw.js');
const router = express.Router();
// router.post("/admin",verifyAllReq, registerAdmin)  // commenting out this endpoint because anybody cant be an admin only the known ones are allowed
router.post("/admin/login", verifySignIn,loginAdmin)
router.post("/coaches",verifyAllReq,verifyToken,isAdmin, registerUser)
router.post("/login",verifySignIn,loginUser)
module.exports = router