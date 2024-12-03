const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs')
const authRoutes = require("./routes/auth.route.js")
// const authRoutes = require('./routes/authRoutes');
const clientRoutes = require('./routes/client.route.js');
const adminRoutes = require('./routes/dashboard.route.js')
// const sessionRoutes = require('./routes/sessionRoutes');
const coachRoutes = require("./routes/coach.route.js");
const adminModel = require('./models/admin.model.js');
dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// admin creation

async function innit() {

    try {
        let admin = await adminModel.findOne({ email: "saurabhmishra142003@gmail.com" })
        if (admin) {
            console.log("admin is present")
            return
        }
    } catch (error) {
        console.log("issues are there")
    }
    try {
        admin = await adminModel.create({
            name: "Saurabh Mishra",
            role: "admin",
            password: bcrypt.hashSync("saurabh", 10),
            email: "saurabhmishra142003@gmail.com"


        })

        console.log("ADMIN", admin)

    } catch (error) {
        console.log("facing issue while creating admin" + error)
    }
}

innit()

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/coaches', coachRoutes);
app.use('/api/admin', adminRoutes);
// app.use('/api/sessions', sessionRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
