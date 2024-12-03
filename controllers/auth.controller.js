const jwt = require('jsonwebtoken');
const User = require('../models/user.model.js');
const Admin = require('../models/admin.model.js')
const bcrypt = require('bcryptjs');

const registerUser = async (req, res) => {
  const { name, email, password, role, specialization } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }
  const hashedPassword = bcrypt.hashSync(password,10)

  const user = new User({
    name,
    email,
    password:hashedPassword,
    role,
    specialization,
  });

  await user.save();
  res.status(201).json({ message: 'User created successfully' });
};

const registerAdmin = async (req, res) => {
    const { name, email, password, role } = req.body;
  
    const userExists = await Admin.findOne({ email });
  
    if (userExists) {
      return res.status(400).json({ message: 'Admin already exists' });
    }
    const hashedPassword = bcrypt.hashSync(password,10)
  
    const user = new Admin({
      name,
      email,
      password:hashedPassword,
      role
     
    });
  
    await user.save();
    res.status(201).json({ message: 'Admin created successfully' });
  };

const loginUser = async (req, res) => {
    try { const {email,password} = req.body;
    const validUser = await User.findOne({email})
    if(!validUser){
        return res.status(400).json({message:"enter valid credentials"})
    }
    const isPassword = bcrypt.compareSync(password,validUser.password)
    const {password:pass ,...rest} = validUser._doc
    if(!isPassword){
        return res.status(400).json({message:"password didnt matched"})
    }
    const token = jwt.sign({ id: validUser._id, role: validUser.role }, "this is secret", { expiresIn: '30d' });
    res.cookie('access_token',token,{httpOnly:true}).status(200).json(rest)}
    catch(err){
        res.status(400).json({message:"login errors"})
    }
};

const loginAdmin = async (req, res) => {
    try { const {email,password} = req.body;
    const validUser = await Admin.findOne({email})
    if(!validUser){
        return res.status(400).json({message:"enter valid credentials"})
    }
    const isPassword = bcrypt.compareSync(password,validUser.password)
    const {password:pass ,...rest} = validUser._doc
    if(!isPassword){
        return res.status(400).json({message:"password didnt matched"})
    }
    const token = jwt.sign({ id: validUser._id, role: validUser.role }, "this is secret", { expiresIn: '30d' });
    res.cookie('access_token',token,{httpOnly:true}).status(200).json(rest)}
    catch(err){
        res.status(400).json({message:"login errors"})
    }
};

module.exports = { registerUser, loginUser ,registerAdmin,loginAdmin};
